import {
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useState
} from 'react';
import {
  applyThemeToDocument,
  coerceThemeMode,
  resolveInitialTheme,
  THEME_OPTIONS,
  type ThemeMode,
  writeThemePreference
} from '../lib/theme/preferences';
import AddressLabel from '../components/AddressLabel';
import WalletTopBar from '../components/WalletTopBar';
import {
  getArtistAllowlist,
  getArtistAllowlistBnsNames,
  isArtistAddressAllowed,
  parseArtistAllowlist
} from '../config/manage';
import { resolveBnsAddress } from '../lib/bns/resolver';
import { ManageWalletProvider, useManageWallet } from './ManageWalletContext';

type ArtistManagerGateProps = {
  children: ReactNode;
};

function GateContent({ children }: ArtistManagerGateProps) {
  const { walletSession, connect, disconnect, creatorSession, signIn, refreshCreatorSession } = useManageWallet();
  const [signInPending, setSignInPending] = useState(false);
  const [signInError, setSignInError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => resolveInitialTheme());
  const [walletPending, setWalletPending] = useState(false);
  const connectedAddress = walletSession.address ?? null;
  const buildAllowlist = useMemo(() => getArtistAllowlist(), []);
  const buildBnsAllowlist = useMemo(() => getArtistAllowlistBnsNames(), []);
  const [runtimeAllowlistRaw, setRuntimeAllowlistRaw] = useState('');
  const [runtimeAllowlistSource, setRuntimeAllowlistSource] = useState<string | null>(null);
  const [resolvedBnsAllowlist, setResolvedBnsAllowlist] = useState<
    Record<string, string | null>
  >({});
  const [bnsResolutionPending, setBnsResolutionPending] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadRuntimeAllowlist = async () => {
      try {
        const response = await fetch('/manage/allowlist', { cache: 'no-store' });
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as { raw?: unknown; source?: unknown };
        if (cancelled) {
          return;
        }
        setRuntimeAllowlistRaw(typeof payload.raw === 'string' ? payload.raw : '');
        setRuntimeAllowlistSource(
          typeof payload.source === 'string' && payload.source.trim()
            ? payload.source
            : null
        );
      } catch {
        if (cancelled) {
          return;
        }
        setRuntimeAllowlistRaw('');
        setRuntimeAllowlistSource(null);
      }
    };

    void loadRuntimeAllowlist();

    return () => {
      cancelled = true;
    };
  }, []);

  const runtimeAllowlist = useMemo(
    () => parseArtistAllowlist(runtimeAllowlistRaw),
    [runtimeAllowlistRaw]
  );

  const allowlist = useMemo(
    () => Array.from(new Set([...buildAllowlist, ...runtimeAllowlist.entries])),
    [buildAllowlist, runtimeAllowlist.entries]
  );

  const bnsAllowlist = useMemo(
    () =>
      Array.from(
        new Set([
          ...buildBnsAllowlist,
          ...Array.from(runtimeAllowlist.bnsNames.values())
        ])
      ),
    [buildBnsAllowlist, runtimeAllowlist.bnsNames]
  );

  useEffect(() => {
    let cancelled = false;

    if (bnsAllowlist.length === 0) {
      setResolvedBnsAllowlist({});
      setBnsResolutionPending(false);
      return () => {
        cancelled = true;
      };
    }

    setBnsResolutionPending(true);

    Promise.all(
      bnsAllowlist.map(async (name) => {
        try {
          const result = await resolveBnsAddress({
            name,
            network: walletSession.network ?? 'mainnet'
          });
          return [name, result.address ? result.address.trim().toUpperCase() : null] as const;
        } catch {
          return [name, null] as const;
        }
      })
    )
      .then((entries) => {
        if (cancelled) {
          return;
        }
        setResolvedBnsAllowlist(Object.fromEntries(entries));
      })
      .finally(() => {
        if (cancelled) {
          return;
        }
        setBnsResolutionPending(false);
      });

    return () => {
      cancelled = true;
    };
  }, [bnsAllowlist, walletSession.network]);

  const normalizedConnectedAddress = connectedAddress?.trim().toUpperCase() ?? null;
  const literalAddressAllowed = isArtistAddressAllowed(normalizedConnectedAddress);
  const runtimeLiteralAllowed = normalizedConnectedAddress
    ? runtimeAllowlist.literalAddresses.has(normalizedConnectedAddress)
    : false;
  const bnsAddressAllowed = normalizedConnectedAddress
    ? Object.values(resolvedBnsAllowlist).some(
        (resolvedAddress) => resolvedAddress === normalizedConnectedAddress
      )
    : false;
  // Legacy browser-side check: only used while server sign-in is not set up.
  const legacyAllowed = literalAddressAllowed || runtimeLiteralAllowed || bnsAddressAllowed;
  const sessionMatchesWallet =
    creatorSession.status === 'signed-in' &&
    !!normalizedConnectedAddress &&
    creatorSession.address.toUpperCase() === normalizedConnectedAddress;
  const allowed =
    creatorSession.status === 'unavailable'
      ? legacyAllowed
      : sessionMatchesWallet && (creatorSession.admin || creatorSession.allowlisted);
  const awaitingBnsAllowlistResolution =
    !!normalizedConnectedAddress &&
    !literalAddressAllowed &&
    bnsAllowlist.length > 0 &&
    bnsResolutionPending;

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextTheme = coerceThemeMode(event.target.value);
    setThemeMode(nextTheme);
    applyThemeToDocument(nextTheme);
    writeThemePreference(nextTheme);
  };

  const handleConnectWallet = async () => {
    setWalletPending(true);
    await connect();
    setWalletPending(false);
  };

  const handleDisconnectWallet = async () => {
    setWalletPending(true);
    await disconnect();
    setWalletPending(false);
  };

  if (allowed) {
    return <>{children}</>;
  }

  const handleSignIn = async () => {
    setSignInPending(true);
    setSignInError(null);
    try {
      await signIn();
    } catch (error) {
      setSignInError(error instanceof Error ? error.message : 'Sign-in was cancelled. Nothing changed.');
    } finally {
      setSignInPending(false);
    }
  };

  const copyAddress = async () => {
    if (!connectedAddress) return;
    try {
      await navigator.clipboard.writeText(connectedAddress);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const signedInElsewhere =
    creatorSession.status === 'signed-in' && !sessionMatchesWallet;
  const notListed =
    sessionMatchesWallet && creatorSession.status === 'signed-in' && !creatorSession.allowlisted;
  const listUnchecked =
    notListed && creatorSession.status === 'signed-in' && !creatorSession.allowlistChecked;

  return (
    <div className="app">
      <header className="app__header">
        <span className="eyebrow">Xtrata collection studio</span>
        <h1>Create your collection</h1>
        <p>Upload your artwork, set a price and publish a mint page. Collectors inscribe each file on-chain when they mint it.</p>
      </header>
      <main className="app__main">
        <section className="panel app-section">
          <div className="panel__header">
            <div>
              <h2>Sign in to your collection studio</h2>
              <p>Two quick steps: connect your wallet, then sign a short message to prove it's yours. Signing is free, isn't a transaction and moves no funds. It keeps you signed in on this browser for 7 days.</p>
            </div>
            <div className="panel__actions">
              <label className="theme-select" htmlFor="artist-gate-theme-select">
                <span className="theme-select__label">Theme</span>
                <select
                  id="artist-gate-theme-select"
                  className="theme-select__control"
                  value={themeMode}
                  onChange={handleThemeChange}
                  onInput={handleThemeChange}
                >
                  {THEME_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="panel__body">
            <ol className="creator-gate-steps">
              <li data-done={walletSession.isConnected ? 'true' : 'false'}>
                <strong>1. Connect your wallet</strong>
                <WalletTopBar
                  walletSession={walletSession}
                  walletPending={walletPending}
                  onConnect={handleConnectWallet}
                  onDisconnect={handleDisconnectWallet}
                  showAddressWhenNamed
                />
                {connectedAddress ? (
                  <span className="meta-value">
                    Connected:{' '}
                    <AddressLabel className="meta-value" address={connectedAddress} network={walletSession.network} showAddressWhenNamed />
                  </span>
                ) : null}
              </li>
              {creatorSession.status !== 'unavailable' ? (
                <li data-done={sessionMatchesWallet ? 'true' : 'false'}>
                  <strong>2. Sign in</strong>
                  {creatorSession.status === 'loading' ? (
                    <span className="meta-value">Checking…</span>
                  ) : sessionMatchesWallet ? (
                    <span className="meta-value">Signed in.</span>
                  ) : (
                    <div className="mint-actions">
                      <button type="button" className="button" disabled={!walletSession.isConnected || signInPending} onClick={() => void handleSignIn()}>
                        {signInPending ? 'Check your wallet…' : 'Sign in with your wallet'}
                      </button>
                    </div>
                  )}
                  {signedInElsewhere ? (
                    <span className="meta-value">You're signed in with a different wallet. Sign in again with this one.</span>
                  ) : null}
                  {signInError ? <div className="alert" role="alert">{signInError}</div> : null}
                </li>
              ) : null}
            </ol>
            {creatorSession.status === 'unavailable' && walletSession.isConnected && awaitingBnsAllowlistResolution && (
              <div className="alert">Checking your wallet against the creator list…</div>
            )}
            {listUnchecked ? (
              <div className="alert" role="status">
                Couldn't check the creator list right now.{' '}
                <button type="button" className="button button--ghost button--mini" onClick={() => void refreshCreatorSession()}>Try again</button>
              </div>
            ) : null}
            {(notListed && !listUnchecked) ||
            (creatorSession.status === 'unavailable' && walletSession.isConnected && !legacyAllowed && !awaitingBnsAllowlistResolution) ? (
              <div className="alert creator-gate-request">
                <p><strong>This wallet isn't on the creator list yet.</strong> The studio is open to approved creators while it's in early access.</p>
                <div className="mint-actions">
                  <a className="button" href="https://x.com/XtrataLayers" target="_blank" rel="noreferrer">Request access</a>
                  <button type="button" className="button button--ghost" onClick={() => void copyAddress()}>
                    {copied ? 'Address copied' : 'Copy my wallet address'}
                  </button>
                </div>
                <p className="meta-value">Send @XtrataLayers your wallet address. This list is separate from any collector allowlist you set up for your own mint.</p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="collection-studio" aria-labelledby="collection-gate-flow">
          <div className="collection-studio__heading">
            <div>
              <span className="eyebrow">What you'll do</span>
              <h2 id="collection-gate-flow">Six guided steps from artwork to mint page</h2>
            </div>
          </div>
          <ol className="collection-studio__grid" style={{ listStyle: 'none', padding: 0 }}>
            {[
              ['Collection basics', 'Name your collection. Nothing is deployed and no wallet approval is needed yet.'],
              ['Artwork & metadata', 'Upload your files and lock them for pricing. Uploading doesn’t inscribe anything.'],
              ['Prepare contract', 'Deploy your collection contract, then register every file on it. Both are wallet approvals.'],
              ['Mint rules', 'Set how many can be minted (permanent) and the one price collectors pay.'],
              ['Review & launch', 'Add a cover and description, publish your page, then open minting.'],
              ['Manage collection', 'Watch mints, handle reservations and review file storage.']
            ].map(([title, description], index) => (
              <li className="collection-studio__task" style={{ cursor: 'default' }} key={title}>
                <span className="collection-studio__number">{String(index + 1).padStart(2, '0')}</span>
                <strong>{title}</strong><span>{description}</span>
              </li>
            ))}
          </ol>
          <p className="collection-studio__note">Uploaded files are kept for 3 days while you set up (you can extend once by 14 days). Once your contract is deployed they're kept until minted.</p>
        </section>
      </main>
    </div>
  );
}

export default function ArtistManagerGate({ children }: ArtistManagerGateProps) {
  return (
    <ManageWalletProvider>
      <GateContent>{children}</GateContent>
    </ManageWalletProvider>
  );
}
