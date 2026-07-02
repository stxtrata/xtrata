import { useEffect, useMemo, useState } from 'react';
import { showContractCall, showContractDeploy } from '../lib/wallet/connect';
import { useQuery } from '@tanstack/react-query';
import {
  boolCV,
  principalCV,
  uintCV,
  validateStacksAddress,
  type ClarityValue
} from '@stacks/transactions';
import { createXtrataClient } from '../lib/contract/client';
import { getContractId } from '../lib/contract/config';
import type { ContractRegistryEntry } from '../lib/contract/registry';
import { resolveContractCapabilities } from '../lib/contract/capabilities';
import { formatMicroStx, MICROSTX_PER_STX } from '../lib/contract/fees';
import { getNetworkMismatch } from '../lib/network/guard';
import type { WalletSession } from '../lib/wallet/types';
import sourceV323 from '../../contracts/live/xtrata-v3.2.3.clar?raw';

type V323OwnerConsoleScreenProps = {
  contract: ContractRegistryEntry;
  walletSession: WalletSession;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelectContract: () => void;
};

type FeeField =
  | 'begin'
  | 'uploadChunk'
  | 'uploadBatch'
  | 'seal'
  | 'singleTx';

type TxPayload = {
  txId: string;
};

type StatusReadErrors = Record<string, string>;

const FEE_FIELDS: Array<{
  key: FeeField;
  label: string;
  getter: 'beginFee' | 'uploadChunkFee' | 'uploadBatchFee' | 'sealFee' | 'singleTxFee';
  functionName: string;
}> = [
  {
    key: 'begin',
    label: 'Begin fee',
    getter: 'beginFee',
    functionName: 'set-begin-fee-unit'
  },
  {
    key: 'uploadChunk',
    label: 'Upload chunk fee',
    getter: 'uploadChunkFee',
    functionName: 'set-upload-chunk-fee-unit'
  },
  {
    key: 'uploadBatch',
    label: 'Upload batch fee',
    getter: 'uploadBatchFee',
    functionName: 'set-upload-batch-fee-unit'
  },
  {
    key: 'seal',
    label: 'Seal fee',
    getter: 'sealFee',
    functionName: 'set-seal-fee-unit'
  },
  {
    key: 'singleTx',
    label: 'Single-tx fee',
    getter: 'singleTxFee',
    functionName: 'set-single-tx-fee-unit'
  }
];

const emptyFeeInputs = (): Record<FeeField, string> => ({
  begin: '',
  uploadChunk: '',
  uploadBatch: '',
  seal: '',
  singleTx: ''
});

const normalizeAddress = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed.toUpperCase() : null;
};

const addressesEqual = (left?: string | null, right?: string | null) => {
  const normalizedLeft = normalizeAddress(left);
  const normalizedRight = normalizeAddress(right);
  return !!normalizedLeft && !!normalizedRight && normalizedLeft === normalizedRight;
};

const parseMicroStxInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return null;
  }
  return BigInt(Math.round(parsed * MICROSTX_PER_STX));
};

const parseUintInput = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  try {
    const parsed = BigInt(trimmed);
    return parsed >= 0n ? parsed : null;
  } catch {
    return null;
  }
};

const toStxInput = (value?: bigint | null) =>
  value === null || value === undefined
    ? ''
    : (Number(value) / MICROSTX_PER_STX).toFixed(6);

const formatBigint = (value?: bigint | null) =>
  value === null || value === undefined ? 'Unknown' : value.toString();

const formatMicroStxBigint = (value?: bigint | null) => {
  if (value === null || value === undefined) {
    return 'Unknown';
  }
  const asNumber = Number(value);
  return Number.isSafeInteger(asNumber)
    ? formatMicroStx(asNumber)
    : `${value.toString()} microSTX`;
};

const isContractPrincipal = (value: string) => {
  const [address, name] = value.split('.');
  return !!address && !!name && validateStacksAddress(address) && /^[a-zA-Z]([a-zA-Z0-9-_]){0,127}$/.test(name);
};

const isPrincipalInput = (value: string) =>
  validateStacksAddress(value) || isContractPrincipal(value);

export default function V323OwnerConsoleScreen(props: V323OwnerConsoleScreenProps) {
  const client = useMemo(
    () => createXtrataClient({ contract: props.contract }),
    [props.contract]
  );
  const capabilities = useMemo(
    () => resolveContractCapabilities(props.contract),
    [props.contract]
  );
  const contractId = getContractId(props.contract);
  const readOnlySender = props.walletSession.address ?? props.contract.address;
  const mismatch = getNetworkMismatch(
    props.contract.network,
    props.walletSession.network
  );
  const isV323 =
    props.contract.protocolVersion === '3.2.3' ||
    props.contract.contractName.includes('v3-2-3');

  const statusQuery = useQuery({
    queryKey: ['v323-owner-console', contractId, readOnlySender],
    queryFn: async () => {
      const errors: StatusReadErrors = {};
      const read = async <T,>(label: string, task: () => Promise<T>) => {
        try {
          return await task();
        } catch (error) {
          errors[label] = error instanceof Error ? error.message : String(error);
          return null;
        }
      };
      const [
        admin,
        royaltyRecipient,
        paused,
        nextTokenId,
        lastTokenId,
        mintedCount,
        contractInfo,
        beginFee,
        uploadChunkFee,
        uploadBatchFee,
        sealFee,
        singleTxFee
      ] = await Promise.all([
        read('Owner', () => client.getAdmin(readOnlySender)),
        read('Royalty recipient', () => client.getRoyaltyRecipient(readOnlySender)),
        read('Pause state', () => client.isPaused(readOnlySender)),
        read('Next token ID', () => client.getNextTokenId(readOnlySender)),
        read('Last token ID', () => client.getLastTokenId(readOnlySender)),
        read('Minted count', () => client.getMintedCount(readOnlySender)),
        read('Runtime limits', () => client.getContractInfo(readOnlySender)),
        read('Begin fee', () => client.getBeginFeeUnit(readOnlySender)),
        read('Upload chunk fee', () => client.getUploadChunkFeeUnit(readOnlySender)),
        read('Upload batch fee', () => client.getUploadBatchFeeUnit(readOnlySender)),
        read('Seal fee', () => client.getSealFeeUnit(readOnlySender)),
        read('Single-tx fee', () => client.getSingleTxFeeUnit(readOnlySender))
      ]);
      return {
        admin,
        royaltyRecipient,
        paused,
        nextTokenId,
        lastTokenId,
        mintedCount,
        contractInfo,
        beginFee,
        uploadChunkFee,
        uploadBatchFee,
        sealFee,
        singleTxFee,
        errors
      };
    },
    enabled: isV323 && readOnlySender.length > 0,
    staleTime: 20_000,
    refetchOnWindowFocus: false
  });

  const status = statusQuery.data ?? null;
  const statusErrors = status?.errors ?? {};
  const statusErrorEntries = Object.entries(statusErrors);
  const isAdminWallet = addressesEqual(status?.admin, props.walletSession.address);
  const canTransact = !!props.walletSession.address && !mismatch;
  const canAdmin = canTransact && isAdminWallet;
  const sourceHashLabel = useMemo(
    () => `${sourceV323.length.toLocaleString()} chars`,
    []
  );

  const [feeInputs, setFeeInputs] = useState<Record<FeeField, string>>(
    emptyFeeInputs
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [royaltyInput, setRoyaltyInput] = useState('');
  const [ownerInput, setOwnerInput] = useState('');
  const [allowedCallerInput, setAllowedCallerInput] = useState('');
  const [allowedCallerStatus, setAllowedCallerStatus] = useState<string | null>(null);
  const [nextIdInput, setNextIdInput] = useState('');
  const [quoteSizeInput, setQuoteSizeInput] = useState('16384');
  const [quoteChunksInput, setQuoteChunksInput] = useState('1');
  const [quoteStatus, setQuoteStatus] = useState<string | null>(null);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenStatus, setTokenStatus] = useState<string | null>(null);
  const [deployName, setDeployName] = useState('xtrata-v3-2-3');
  const [deployStatus, setDeployStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!status) {
      return;
    }
    setFeeInputs((current) => ({
      begin: current.begin || toStxInput(status.beginFee),
      uploadChunk: current.uploadChunk || toStxInput(status.uploadChunkFee),
      uploadBatch: current.uploadBatch || toStxInput(status.uploadBatchFee),
      seal: current.seal || toStxInput(status.sealFee),
      singleTx: current.singleTx || toStxInput(status.singleTxFee)
    }));
    setRoyaltyInput((current) => current || status.royaltyRecipient || '');
  }, [status]);

  const handleSelectContract = () => {
    setActionMessage(null);
    try {
      props.onSelectContract();
      setActionMessage('Selected xtrata-v3-2-3. Loading contract state...');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setActionMessage(`Unable to select xtrata-v3-2-3: ${message}`);
    }
  };

  const requireAdmin = (label: string) => {
    if (!props.walletSession.address) {
      setActionMessage(`Connect the owner wallet to ${label}.`);
      return false;
    }
    if (mismatch) {
      setActionMessage(`Switch wallet to ${mismatch.expected} to ${label}.`);
      return false;
    }
    if (!status?.admin) {
      setActionMessage(`Refresh status before trying to ${label}.`);
      return false;
    }
    if (!isAdminWallet) {
      setActionMessage(`Connected wallet is not the contract owner (${status.admin}).`);
      return false;
    }
    return true;
  };

  const requestCall = (functionName: string, functionArgs: ClarityValue[]) =>
    new Promise<TxPayload>((resolve, reject) => {
      showContractCall({
        contractAddress: props.contract.address,
        contractName: props.contract.contractName,
        functionName,
        functionArgs,
        network: props.walletSession.network ?? props.contract.network,
        stxAddress: props.walletSession.address,
        onFinish: (payload) => resolve(payload as TxPayload),
        onCancel: () => reject(new Error('Wallet cancelled or failed to broadcast.'))
      });
    });

  const runAdminCall = async (
    label: string,
    functionName: string,
    functionArgs: ClarityValue[]
  ) => {
    if (!requireAdmin(label)) {
      return;
    }
    setPendingAction(functionName);
    setActionMessage(`Sending ${label} transaction...`);
    try {
      const tx = await requestCall(functionName, functionArgs);
      setActionMessage(`${label} tx sent: ${tx.txId}`);
      await statusQuery.refetch();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setActionMessage(`${label} failed: ${message}`);
    } finally {
      setPendingAction(null);
    }
  };

  const handleSetFee = (field: (typeof FEE_FIELDS)[number]) => {
    const microStx = parseMicroStxInput(feeInputs[field.key]);
    if (microStx === null) {
      setActionMessage(`Enter a valid STX value for ${field.label}.`);
      return;
    }
    void runAdminCall(field.label, field.functionName, [uintCV(microStx)]);
  };

  const handleAllowedCallerCheck = async () => {
    const value = allowedCallerInput.trim();
    if (!isPrincipalInput(value)) {
      setAllowedCallerStatus('Enter a valid standard or contract principal.');
      return;
    }
    setAllowedCallerStatus('Checking allowed caller...');
    try {
      const allowed = await client.isAllowedCaller(value, readOnlySender);
      setAllowedCallerStatus(allowed ? 'Caller is allowed.' : 'Caller is not allowed.');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setAllowedCallerStatus(`Allowed caller check failed: ${message}`);
    }
  };

  const handleSetAllowedCaller = (allowed: boolean) => {
    const value = allowedCallerInput.trim();
    if (!isPrincipalInput(value)) {
      setActionMessage('Enter a valid standard or contract principal.');
      return;
    }
    void runAdminCall(
      allowed ? 'allow caller' : 'remove allowed caller',
      'set-allowed-caller',
      [principalCV(value), boolCV(allowed)]
    );
  };

  const handleQuote = async () => {
    const totalSize = parseUintInput(quoteSizeInput);
    const totalChunks = parseUintInput(quoteChunksInput);
    if (totalSize === null || totalChunks === null || totalSize === 0n || totalChunks === 0n) {
      setQuoteStatus('Enter positive total size and chunk count.');
      return;
    }
    setQuoteStatus('Quoting v3 fees...');
    try {
      const [staged, singleTx] = await Promise.all([
        client.quoteStagedFee(totalSize, totalChunks, readOnlySender),
        client.quoteSingleTxFee(totalSize, totalChunks, readOnlySender)
      ]);
      setQuoteStatus(
        `Staged: begin ${formatMicroStxBigint(staged.beginFee)}, seal ${formatMicroStxBigint(staged.sealFee)}, total ${formatMicroStxBigint(staged.totalFee)}. Single-tx: ${formatMicroStxBigint(singleTx)}.`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setQuoteStatus(`Quote failed: ${message}`);
    }
  };

  const handleTokenInspect = async () => {
    const id = parseUintInput(tokenInput);
    if (id === null) {
      setTokenStatus('Enter a valid token ID.');
      return;
    }
    setTokenStatus('Inspecting token relationships...');
    try {
      const [meta, owner, tokenUri, dependencies, parents, migrationSource] =
        await Promise.all([
          client.getInscriptionMeta(id, readOnlySender),
          client.getOwner(id, readOnlySender),
          client.getTokenUri(id, readOnlySender),
          client.getDependencies(id, readOnlySender),
          client.getParents(id, readOnlySender),
          client.getMigrationSource(id, readOnlySender)
        ]);
      if (!meta) {
        setTokenStatus(`Token #${id.toString()} was not found.`);
        return;
      }
      const dependencyLabel =
        dependencies.length > 0 ? dependencies.map((dep) => `#${dep}`).join(', ') : 'none';
      const parentLabel =
        parents.length > 0 ? parents.map((parent) => `#${parent}`).join(', ') : 'none';
      const migrationLabel = migrationSource
        ? `${migrationSource.contract}:${migrationSource.tokenId.toString()}`
        : 'none';
      setTokenStatus(
        `#${id.toString()} owner ${owner ?? 'unknown'}, ${meta.mimeType}, ${meta.totalSize.toString()} bytes, ${meta.totalChunks.toString()} chunk(s), uri ${tokenUri ?? 'none'}, deps ${dependencyLabel}, parents ${parentLabel}, migration ${migrationLabel}.`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setTokenStatus(`Token inspect failed: ${message}`);
    }
  };

  const handleDeployV323 = () => {
    const name = deployName.trim();
    if (!/^[a-zA-Z][a-zA-Z0-9-_]{0,127}$/.test(name)) {
      setDeployStatus('Contract name must be a valid Clarity contract name.');
      return;
    }
    setDeployStatus('Opening wallet deploy prompt...');
    try {
      showContractDeploy({
        contractName: name,
        codeBody: sourceV323,
        network: props.walletSession.network ?? props.contract.network,
        onFinish: (payload) => setDeployStatus(`Deploy tx sent: ${payload.txId}`),
        onCancel: () => setDeployStatus('Deploy cancelled or failed in wallet.')
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setDeployStatus(`Deploy failed: ${message}`);
    }
  };

  return (
    <section
      className={`panel app-section${props.collapsed ? ' panel--collapsed' : ''}`}
      id="v323-owner-console"
    >
      <div className="panel__header">
        <div>
          <h2>v3.2.3 owner console</h2>
          <p>Dedicated controls and diagnostics for the deployed v3.2.3 core.</p>
        </div>
        <div className="panel__actions">
          {isV323 ? (
            <span className={`badge badge--${props.contract.network}`}>v3.2.3</span>
          ) : (
            <button
              className="button button--ghost"
              type="button"
              onClick={handleSelectContract}
            >
              Select v3.2.3
            </button>
          )}
          <button
            className="button button--ghost"
            type="button"
            onClick={() => statusQuery.refetch()}
            disabled={!isV323 || statusQuery.isFetching}
          >
            {statusQuery.isFetching ? 'Refreshing...' : 'Refresh'}
          </button>
          <button
            className="button button--ghost button--collapse"
            type="button"
            onClick={props.onToggleCollapse}
            aria-expanded={!props.collapsed}
          >
            {props.collapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
      </div>
      <div className="panel__body">
        {!isV323 && (
          <div className="alert">
            Select the deployed xtrata-v3-2-3 contract to use this console.
          </div>
        )}
        {isV323 && statusQuery.isLoading && (
          <div className="alert">Loading contract state from {contractId}...</div>
        )}
        {isV323 && statusErrorEntries.length > 0 && (
          <div className="alert">
            Some contract state could not be read from {contractId}:{' '}
            {statusErrorEntries
              .map(([label, message]) => `${label}: ${message}`)
              .join(' | ')}
          </div>
        )}

        <div className="meta-grid meta-grid--dense">
          <div>
            <span className="meta-label">Contract</span>
            <span className="meta-value">{contractId}</span>
          </div>
          <div>
            <span className="meta-label">Owner</span>
            <span className="meta-value">{status?.admin ?? 'Unknown'}</span>
          </div>
          <div>
            <span className="meta-label">Connected owner</span>
            <span className="meta-value">{isAdminWallet ? 'Yes' : 'No'}</span>
          </div>
          <div>
            <span className="meta-label">Pause state</span>
            <span className="meta-value">
              {status?.paused === undefined ? 'Unknown' : status.paused ? 'Paused' : 'Active'}
            </span>
          </div>
          <div>
            <span className="meta-label">Royalty recipient</span>
            <span className="meta-value">{status?.royaltyRecipient ?? 'Unknown'}</span>
          </div>
          <div>
            <span className="meta-label">Supply</span>
            <span className="meta-value">
              {formatBigint(status?.mintedCount)} minted, next #{formatBigint(status?.nextTokenId)}
            </span>
          </div>
          <div>
            <span className="meta-label">Last token</span>
            <span className="meta-value">{formatBigint(status?.lastTokenId)}</span>
          </div>
          <div>
            <span className="meta-label">Relationship support</span>
            <span className="meta-value">{capabilities.supportsRelationships ? 'Enabled' : 'Unavailable'}</span>
          </div>
        </div>

        <div className="mint-grid">
          <div className="mint-panel">
            <span className="meta-label">Runtime limits</span>
            <div className="meta-grid meta-grid--dense">
              <div>
                <span className="meta-label">Version</span>
                <span className="meta-value">{status?.contractInfo.version ?? 'Unknown'}</span>
              </div>
              <div>
                <span className="meta-label">Chunk size</span>
                <span className="meta-value">{formatBigint(status?.contractInfo.chunkSize)} bytes</span>
              </div>
              <div>
                <span className="meta-label">Single-tx chunks</span>
                <span className="meta-value">{formatBigint(status?.contractInfo.singleTxChunkLimit)}</span>
              </div>
              <div>
                <span className="meta-label">Upload batch limit</span>
                <span className="meta-value">{formatBigint(status?.contractInfo.uploadBatchLimit)}</span>
              </div>
              <div>
                <span className="meta-label">List limit</span>
                <span className="meta-value">{formatBigint(status?.contractInfo.generalListLimit)}</span>
              </div>
              <div>
                <span className="meta-label">Max total size</span>
                <span className="meta-value">{formatBigint(status?.contractInfo.maxTotalSize)} bytes</span>
              </div>
            </div>
          </div>

          <div className="mint-panel">
            <span className="meta-label">Emergency state</span>
            <p className="meta-value">Pause blocks public minting while preserving owner actions.</p>
            <div className="mint-actions">
              <button
                className="button"
                type="button"
                disabled={!canAdmin || pendingAction === 'set-paused' || status?.paused === true}
                onClick={() => void runAdminCall('pause contract', 'set-paused', [boolCV(true)])}
              >
                Pause
              </button>
              <button
                className="button button--ghost"
                type="button"
                disabled={!canAdmin || pendingAction === 'set-paused' || status?.paused === false}
                onClick={() => void runAdminCall('unpause contract', 'set-paused', [boolCV(false)])}
              >
                Unpause
              </button>
            </div>
          </div>

          <div className="mint-panel">
            <span className="meta-label">Fee policy</span>
            {FEE_FIELDS.map((field) => (
              <label className="field" key={field.key}>
                <span className="field__label">
                  {field.label} ({formatMicroStxBigint(status?.[field.getter])})
                </span>
                <div className="field__row">
                  <input
                    className="input"
                    value={feeInputs[field.key]}
                    disabled={!canAdmin}
                    onChange={(event) =>
                      setFeeInputs((current) => ({
                        ...current,
                        [field.key]: event.target.value
                      }))
                    }
                  />
                  <button
                    className="button button--ghost"
                    type="button"
                    disabled={!canAdmin || pendingAction === field.functionName}
                    onClick={() => handleSetFee(field)}
                  >
                    Set
                  </button>
                </div>
              </label>
            ))}
          </div>

          <div className="mint-panel">
            <span className="meta-label">Owner and proceeds</span>
            <label className="field">
              <span className="field__label">Royalty recipient</span>
              <div className="field__row">
                <input
                  className="input"
                  value={royaltyInput}
                  disabled={!canAdmin}
                  onChange={(event) => setRoyaltyInput(event.target.value)}
                />
                <button
                  className="button button--ghost"
                  type="button"
                  disabled={!canAdmin || !validateStacksAddress(royaltyInput)}
                  onClick={() =>
                    void runAdminCall('set royalty recipient', 'set-royalty-recipient', [
                      principalCV(royaltyInput.trim())
                    ])
                  }
                >
                  Set
                </button>
              </div>
            </label>
            <label className="field">
              <span className="field__label">Transfer ownership</span>
              <div className="field__row">
                <input
                  className="input"
                  placeholder="SP..."
                  value={ownerInput}
                  disabled={!canAdmin}
                  onChange={(event) => setOwnerInput(event.target.value)}
                />
                <button
                  className="button button--ghost"
                  type="button"
                  disabled={!canAdmin || !validateStacksAddress(ownerInput)}
                  onClick={() =>
                    void runAdminCall('transfer ownership', 'transfer-contract-ownership', [
                      principalCV(ownerInput.trim())
                    ])
                  }
                >
                  Transfer
                </button>
              </div>
            </label>
          </div>

          <div className="mint-panel">
            <span className="meta-label">Allowed callers</span>
            <p className="meta-value">Grant or remove contract callers for protocol-integrated apps.</p>
            <label className="field">
              <span className="field__label">Caller principal</span>
              <input
                className="input"
                placeholder="SP...contract-name"
                value={allowedCallerInput}
                onChange={(event) => {
                  setAllowedCallerInput(event.target.value);
                  setAllowedCallerStatus(null);
                }}
              />
            </label>
            <div className="mint-actions">
              <button className="button button--ghost" type="button" onClick={() => void handleAllowedCallerCheck()}>
                Check
              </button>
              <button className="button" type="button" disabled={!canAdmin} onClick={() => handleSetAllowedCaller(true)}>
                Allow
              </button>
              <button className="button button--ghost" type="button" disabled={!canAdmin} onClick={() => handleSetAllowedCaller(false)}>
                Remove
              </button>
            </div>
            {allowedCallerStatus && <span className="meta-value">{allowedCallerStatus}</span>}
          </div>

          <div className="mint-panel">
            <span className="meta-label">Continuity setup</span>
            <p className="meta-value">
              `set-next-id` is one-time only and only works before v3.2.3 has minted.
            </p>
            <label className="field">
              <span className="field__label">Next token ID</span>
              <div className="field__row">
                <input
                  className="input"
                  value={nextIdInput}
                  placeholder={status?.nextTokenId.toString() ?? '360'}
                  disabled={!canAdmin || (status?.mintedCount ?? 1n) > 0n}
                  onChange={(event) => setNextIdInput(event.target.value)}
                />
                <button
                  className="button button--ghost"
                  type="button"
                  disabled={!canAdmin || (status?.mintedCount ?? 1n) > 0n}
                  onClick={() => {
                    const parsed = parseUintInput(nextIdInput);
                    if (parsed === null) {
                      setActionMessage('Enter a valid next token ID.');
                      return;
                    }
                    void runAdminCall('set next token id', 'set-next-id', [uintCV(parsed)]);
                  }}
                >
                  Set once
                </button>
              </div>
            </label>
          </div>

          <div className="mint-panel">
            <span className="meta-label">Fee quote diagnostics</span>
            <div className="meta-grid meta-grid--dense">
              <label className="field">
                <span className="field__label">Total size bytes</span>
                <input className="input" value={quoteSizeInput} onChange={(event) => setQuoteSizeInput(event.target.value)} />
              </label>
              <label className="field">
                <span className="field__label">Total chunks</span>
                <input className="input" value={quoteChunksInput} onChange={(event) => setQuoteChunksInput(event.target.value)} />
              </label>
            </div>
            <div className="mint-actions">
              <button className="button button--ghost" type="button" onClick={() => void handleQuote()}>
                Quote
              </button>
            </div>
            {quoteStatus && <span className="meta-value">{quoteStatus}</span>}
          </div>

          <div className="mint-panel">
            <span className="meta-label">Token relationship diagnostics</span>
            <label className="field">
              <span className="field__label">Token ID</span>
              <div className="field__row">
                <input className="input" value={tokenInput} onChange={(event) => setTokenInput(event.target.value)} />
                <button className="button button--ghost" type="button" onClick={() => void handleTokenInspect()}>
                  Inspect
                </button>
              </div>
            </label>
            {tokenStatus && <span className="meta-value">{tokenStatus}</span>}
          </div>

          <div className="mint-panel">
            <span className="meta-label">v3.2.3 deployer</span>
            <p className="meta-value">
              Loaded live source: {sourceHashLabel}. Deploy uses the connected wallet network.
            </p>
            <label className="field">
              <span className="field__label">Contract name</span>
              <input className="input" value={deployName} onChange={(event) => setDeployName(event.target.value)} />
            </label>
            <div className="mint-actions">
              <button className="button" type="button" onClick={handleDeployV323}>
                Deploy v3.2.3 source
              </button>
            </div>
            {deployStatus && <span className="meta-value">{deployStatus}</span>}
          </div>
        </div>

        {actionMessage && <div className="alert">{actionMessage}</div>}
        {!props.walletSession.address && (
          <div className="alert">Connect the owner wallet to unlock write controls.</div>
        )}
        {mismatch && (
          <div className="alert">
            Wallet network is {mismatch.actual}. Switch to {mismatch.expected} for owner actions.
          </div>
        )}
        {props.walletSession.address && !mismatch && status?.admin && !isAdminWallet && (
          <div className="alert">
            Connected wallet is not the v3.2.3 contract owner. Controls are read-only.
          </div>
        )}
      </div>
    </section>
  );
}
