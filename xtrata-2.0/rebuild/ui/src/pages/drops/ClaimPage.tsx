import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ClaimReservationRow, DropRow } from '@xtrata/collections-client';
import { microToStx } from '../../services/fees';
import { useToasts } from '../../shell/ToastContext';
import { useWallet } from '../../shell/WalletContext';
import { useDropsServices } from './services';
import { evaluateEligibility, type EligibilityVerdict } from './eligibility';
import { MODE_COPY } from './copy';
import { eligibilityOf, modeOf } from './store';
import { runSponsoredClaim, type SponsoredStage } from './sponsoredClaim';
import { RelayerError } from './relayer';

/**
 * The collector's half of the page: one drop, honest costs, one button.
 *
 * The cost sentence comes from `copy.ts` so the mode-2/mode-3 language rule
 * holds here too — a zero-price drop says the claimer pays the network fee,
 * and only a sponsored drop says "free".
 *
 * Sponsored claims go through the relayer. When the relayer refuses for a
 * reason that is about the sponsorship rather than about the drop, the page
 * offers the documented fallback: claim it yourself and pay your own fee, with
 * the cost change stated before the wallet opens.
 */

interface ClaimSnapshot {
  drop: DropRow;
  remaining: number;
  walletClaims: number;
  allowlistAllowance: number | null;
  reservation: ClaimReservationRow | null;
  contractPaused: boolean;
  tipHeight: number | null;
  attestorConfigured: boolean | null;
}

interface ClaimOutcome {
  index: number | null;
  tokenId: number | null;
  txid: string | null;
  sponsored: boolean;
}

const STAGE_LABEL: Record<SponsoredStage, string> = {
  quoting: 'Asking the relayer for a fee quote…',
  signing: 'Waiting for your wallet signature…',
  submitting: 'Handing the signed claim to the relayer…',
  polling: 'The relayer is broadcasting your claim…',
  settled: 'Claim confirmed.',
  failed: 'The sponsored claim failed.',
  fallback: 'Sponsorship is unavailable.'
};

export const ClaimPage = ({ dropId }: { dropId: number }): JSX.Element => {
  const services = useDropsServices();
  const { address } = useWallet();
  const { notify, notifyError } = useToasts();

  const [snapshot, setSnapshot] = useState<ClaimSnapshot | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<SponsoredStage | null>(null);
  const [attestation, setAttestation] = useState<{ expiresAt: number; signature: string } | null>(null);
  const [fallbackOffer, setFallbackOffer] = useState<RelayerError | null>(null);
  const [outcome, setOutcome] = useState<ClaimOutcome | null>(null);

  const load = useCallback(async () => {
    if (!services.dropsReads) return;
    setLoading(true);
    setError(null);
    try {
      const reads = services.dropsReads;
      const drop = await reads.getDrop(dropId);
      if (!drop) {
        setError(`Drop ${dropId} does not exist on ${services.dropsContractId}.`);
        setSnapshot(null);
        return;
      }
      const [remaining, contractPaused, attestor, tipHeight, walletClaims, allowlistAllowance, reservation] =
        await Promise.all([
          reads.getRemaining(dropId),
          reads.isPaused(),
          reads.getAttestorPubkeyHash(),
          services.getBlockHeight ? services.getBlockHeight() : Promise.resolve(null),
          address ? reads.getWalletClaims(dropId, address) : Promise.resolve(0),
          address && drop.eligibility === 2
            ? reads.getAllowlistEntry(dropId, address)
            : Promise.resolve(null),
          address ? reads.getClaimReservation(dropId, address) : Promise.resolve(null)
        ]);
      setSnapshot({
        drop,
        remaining,
        contractPaused,
        attestorConfigured: attestor !== null,
        tipHeight,
        walletClaims,
        allowlistAllowance,
        reservation
      });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : String(loadError));
    } finally {
      setLoading(false);
    }
  }, [address, dropId, services]);

  useEffect(() => {
    void load();
  }, [load]);

  const verdict: EligibilityVerdict | null = useMemo(() => {
    if (!snapshot) return null;
    return evaluateEligibility({
      drop: snapshot.drop,
      wallet: address ?? null,
      contractPaused: snapshot.contractPaused,
      tipHeight: snapshot.tipHeight,
      remaining: snapshot.remaining,
      walletClaims: snapshot.walletClaims,
      allowlistAllowance: snapshot.allowlistAllowance,
      reservation: snapshot.reservation,
      attestorConfigured: snapshot.attestorConfigured,
      hasAttestation: attestation !== null
    });
  }, [address, attestation, snapshot]);

  const mode = snapshot ? modeOf(snapshot.drop.mode) : null;
  const copy = mode ? MODE_COPY[mode] : null;

  /** Read back what was actually received, from the chain. */
  const resolveOutcome = useCallback(
    async (txid: string | null, sponsored: boolean, reservedIndex?: number) => {
      let index: number | null = reservedIndex ?? null;
      let tokenId: number | null = null;
      try {
        if (index === null && services.dropsReads && address) {
          const claims = await services.dropsReads.getAllClaims(dropId);
          const mine = claims.filter((claim) => claim.claimer === address);
          index = mine.length > 0 ? mine[mine.length - 1]!.index : null;
        }
        if (index !== null && services.collectionReads) {
          const [item] = await services.collectionReads.getItems([index]);
          tokenId = item?.tokenId ?? null;
        }
      } catch {
        // The claim landed; failing to pretty-print it is not a claim failure.
      }
      setOutcome({ index, tokenId, txid, sponsored });
      await load();
    },
    [address, dropId, load, services]
  );

  const selfPaidClaim = useCallback(
    async (reason?: RelayerError) => {
      if (!services.builder || !services.submit || !snapshot) return;
      setBusy(true);
      setFallbackOffer(null);
      try {
        const reservedIndex = snapshot.reservation?.index;
        let expectedTokenId: number | undefined;
        if (reservedIndex !== undefined && services.dropsReads) {
          const escrowed = await services.dropsReads.getEscrowedToken(dropId, reservedIndex);
          if (escrowed !== null) expectedTokenId = escrowed;
        }
        const eligibility = eligibilityOf(snapshot.drop.eligibility);
        if (eligibility === 'signed' && attestation === null) {
          setError('This drop needs a signed attestation. Request one before claiming.');
          return;
        }
        const tx =
          eligibility === 'signed'
            ? services.builder.claimSigned(
                dropId,
                attestation!.expiresAt,
                attestation!.signature,
                expectedTokenId !== undefined ? { expectedTokenId } : undefined
              )
            : services.builder.claim(dropId, expectedTokenId !== undefined ? { expectedTokenId } : undefined);
        const { txid } = await services.submit(tx);
        notify({
          kind: 'info',
          title: reason ? 'Claiming without sponsorship' : 'Claim submitted',
          body: `${txid} — waiting for confirmation. You are paying this transaction's network fee.`
        });
        if (services.waitConfirm) {
          const result = await services.waitConfirm(txid);
          if (result.status !== 'success') {
            setError(
              `Claim transaction ${result.status}${
                result.chainErrorCode !== undefined ? ` (u${result.chainErrorCode})` : ''
              }.`
            );
            return;
          }
        }
        await resolveOutcome(txid, false, reservedIndex);
      } catch (claimError) {
        notifyError(claimError, 'Claim');
      } finally {
        setBusy(false);
      }
    },
    [attestation, dropId, notify, notifyError, resolveOutcome, services, snapshot]
  );

  const sponsoredClaim = useCallback(async () => {
    if (!services.builder || !services.relayer || !services.signSponsored || !services.getNonce || !address) {
      return;
    }
    setBusy(true);
    setFallbackOffer(null);
    try {
      const nonce = await services.getNonce(address);
      const eligibility = snapshot ? eligibilityOf(snapshot.drop.eligibility) : 'public';
      if (eligibility === 'signed' && attestation === null) {
        setError('This drop needs a signed attestation. Request one before claiming.');
        return;
      }
      const tx =
        eligibility === 'signed'
          ? services.builder.claimSigned(dropId, attestation!.expiresAt, attestation!.signature)
          : services.builder.claim(dropId);
      const result = await runSponsoredClaim({
        relayer: services.relayer,
        tx,
        dropId,
        nonce,
        stxAddress: address,
        sign: services.signSponsored,
        onStage: setStage
      });
      if (result.kind === 'sponsored') {
        notify({ kind: 'success', title: 'Claimed', body: 'The relayer paid the network fee.' });
        await resolveOutcome(result.sponsorTxid, true, snapshot?.reservation?.index);
        return;
      }
      if (result.kind === 'pending') {
        notify({
          kind: 'warn',
          title: 'Still in flight',
          body: `The relayer has your claim (job ${result.jobId}, state ${result.state}) but it has not settled yet. Do not sign again — reload this page in a few minutes.`
        });
        return;
      }
      if (result.kind === 'failed') {
        setError(`The sponsored claim failed${result.error ? `: ${result.error}` : '.'}`);
        return;
      }
      // Sponsorship unavailable — offer the self-paid path explicitly.
      setFallbackOffer(result.error);
    } catch (claimError) {
      if (claimError instanceof RelayerError) {
        notifyError(claimError.toClientError(), 'Relayer');
      } else {
        notifyError(claimError, 'Claim');
      }
    } finally {
      setBusy(false);
      setStage(null);
    }
  }, [address, attestation, dropId, notify, notifyError, resolveOutcome, services, snapshot]);

  const reserve = useCallback(async () => {
    if (!services.builder || !services.submit) return;
    setBusy(true);
    try {
      const { txid } = await services.submit(services.builder.reserveClaim(dropId));
      notify({ kind: 'info', title: 'Reservation submitted', body: txid });
      if (services.waitConfirm) await services.waitConfirm(txid);
      await load();
    } catch (reserveError) {
      notifyError(reserveError, 'Reserve');
    } finally {
      setBusy(false);
    }
  }, [dropId, load, notify, notifyError, services]);

  const fetchAttestation = useCallback(async () => {
    if (!services.relayer || !address) return;
    setBusy(true);
    try {
      const result = await services.relayer.attest({ dropId, claimer: address });
      setAttestation({ expiresAt: result.expiresAt, signature: result.signature });
      notify({
        kind: 'success',
        title: 'Attestation issued',
        body: `Valid until block ${result.expiresAt.toLocaleString()}.`
      });
    } catch (attestError) {
      if (attestError instanceof RelayerError) notifyError(attestError.toClientError(), 'Attestation');
      else notifyError(attestError, 'Attestation');
    } finally {
      setBusy(false);
    }
  }, [address, dropId, notify, notifyError, services]);

  if (loading && !snapshot) {
    return (
      <div className="card">
        <p className="muted">Reading drop #{dropId} from the chain…</p>
      </div>
    );
  }

  if (error && !snapshot) {
    return (
      <div className="banner banner--danger" role="alert">
        <div>
          <strong>Could not open this drop.</strong>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!snapshot || !copy || !verdict || !mode) {
    return (
      <div className="banner banner--info">
        <p>No drop selected. Add <code>?drop=&lt;id&gt;</code> to the URL.</p>
      </div>
    );
  }

  const { drop } = snapshot;
  const isSponsored = mode === 'sponsored';
  const canPressClaim =
    verdict.canClaim && services.canSign && !busy && (isSponsored ? Boolean(services.relayer) : Boolean(services.submit));

  return (
    <div>
      <section className="card">
        <div className="row spread">
          <h2>
            Drop #{dropId}{' '}
            <span className={`state state--${drop.statusName === 'active' ? 'done' : 'pending'}`}>
              {drop.statusName}
            </span>
          </h2>
          <button type="button" className="btn btn--sm" onClick={() => void load()} disabled={loading}>
            Refresh
          </button>
        </div>
        <dl className="grid-2">
          <div>
            <dt className="muted">Collection</dt>
            <dd className="mono">{drop.collection}</dd>
          </div>
          <div>
            <dt className="muted">Items left</dt>
            <dd className="mono" data-testid="claim-remaining">
              {snapshot.remaining.toLocaleString()} of {drop.inventoryCount.toLocaleString()}
            </dd>
          </div>
          <div>
            <dt className="muted">Per wallet</dt>
            <dd className="mono">
              {drop.perWalletLimit === 0 ? 'no limit' : drop.perWalletLimit} (you have{' '}
              {snapshot.walletClaims})
            </dd>
          </div>
          <div>
            <dt className="muted">Window</dt>
            <dd className="mono">
              {drop.startBlock.toLocaleString()} →{' '}
              {drop.endBlock === 0 ? 'open' : drop.endBlock.toLocaleString()}
              {snapshot.tipHeight !== null ? ` (tip ${snapshot.tipHeight.toLocaleString()})` : ''}
            </dd>
          </div>
        </dl>
      </section>

      <section className="card">
        <h2>What it costs you</h2>
        <p data-testid="claim-cost">{copy.costClaim}</p>
        {isSponsored ? (
          <p className="muted">
            Budget remaining for sponsorship: {microToStx(drop.feeBudgetRemaining)}. If it runs out, or the
            relayer is unavailable, you can still claim by paying your own network fee — this page will say
            so before anything is signed.
          </p>
        ) : null}
      </section>

      <section className="card">
        <h2>Your eligibility</h2>
        <p data-testid="eligibility-message">
          <span className={`state state--${verdict.canClaim ? 'done' : 'pending'}`}>{verdict.kind}</span>{' '}
          {verdict.message}
        </p>

        {verdict.kind === 'attestation-required' ? (
          <button type="button" className="btn" disabled={busy || !services.relayer} onClick={() => void fetchAttestation()}>
            Request an attestation
          </button>
        ) : null}

        {stage ? <p className="muted">{STAGE_LABEL[stage]}</p> : null}

        <div className="row" style={{ marginTop: '8px' }}>
          <button
            type="button"
            className="btn btn--primary"
            disabled={!canPressClaim}
            onClick={() => void (isSponsored ? sponsoredClaim() : selfPaidClaim())}
            data-testid="claim-button"
          >
            {busy ? 'Working…' : isSponsored ? 'Claim (free)' : 'Claim'}
          </button>
          {!snapshot.reservation && verdict.canClaim && !isSponsored ? (
            <button type="button" className="btn" disabled={busy} onClick={() => void reserve()}>
              Reserve an item first
            </button>
          ) : null}
        </div>
        {!services.canSign ? (
          <p className="hint">Connect a wallet on {services.network} to claim.</p>
        ) : null}
      </section>

      {fallbackOffer ? (
        <div className="banner banner--warn" role="alert" data-testid="fallback-offer">
          <div>
            <strong>Sponsorship is not available right now.</strong>
            <p>
              {fallbackOffer.userMessage} You can still claim this item, but you would be paying the
              network fee yourself instead of the drop's sponsor budget.
            </p>
            <button type="button" className="btn" disabled={busy} onClick={() => void selfPaidClaim(fallbackOffer)}>
              Claim and pay my own fee
            </button>
            <button type="button" className="btn btn--ghost" onClick={() => setFallbackOffer(null)}>
              Not now
            </button>
          </div>
        </div>
      ) : null}

      {error && snapshot ? (
        <div className="banner banner--danger" role="alert">
          <p>{error}</p>
        </div>
      ) : null}

      {outcome ? (
        <section className="card" data-testid="claim-result">
          <h2>You claimed an item</h2>
          <dl className="grid-2">
            <div>
              <dt className="muted">Item index</dt>
              <dd className="mono">{outcome.index ?? 'confirming…'}</dd>
            </div>
            <div>
              <dt className="muted">Token id</dt>
              <dd className="mono">{outcome.tokenId ?? 'confirming…'}</dd>
            </div>
            <div>
              <dt className="muted">Network fee paid by</dt>
              <dd>{outcome.sponsored ? "the drop's sponsor budget" : 'you'}</dd>
            </div>
            <div>
              <dt className="muted">Transaction</dt>
              <dd className="mono">
                {outcome.txid ? (
                  <a
                    href={`https://explorer.hiro.so/txid/${outcome.txid}?chain=${services.network}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {outcome.txid.slice(0, 14)}…
                  </a>
                ) : (
                  '—'
                )}
              </dd>
            </div>
          </dl>
          {outcome.tokenId !== null ? (
            <p>
              <a
                href={`https://explorer.hiro.so/txid/${services.coreContractId}?chain=${services.network}`}
                target="_blank"
                rel="noreferrer"
              >
                View {services.coreContractId} #{outcome.tokenId} on the explorer
              </a>
            </p>
          ) : null}
        </section>
      ) : null}
    </div>
  );
};
