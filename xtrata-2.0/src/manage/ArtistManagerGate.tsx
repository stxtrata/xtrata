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
  const { walletSession, connect, disconnect } = useManageWallet();
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
  const allowed = literalAddressAllowed || runtimeLiteralAllowed || bnsAddressAllowed;
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

  return (
    <div className="app">
      <header className="app__header">
        <span className="eyebrow">Collection mint v1.5 · Xtrata Core v3.2.3</span>
        <h1>Create your collection mint</h1>
        <p>Prepare your artwork, configure your mint and launch a collection page. Collectors inscribe the files when they mint.</p>
      </header>
      <main className="app__main">
        <section className="panel app-section">
          <div className="panel__header">
            <div>
              <h2>Connect to your collection workspace</h2>
              <p>Access currently requires an approved creator wallet. Connecting checks access; deploying and changing contract settings require separate transaction approvals.</p>
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
            <WalletTopBar
              walletSession={walletSession}
              walletPending={walletPending}
              onConnect={handleConnectWallet}
              onDisconnect={handleDisconnectWallet}
              showAddressWhenNamed
            />
            <div className="meta-grid">
              <div>
                <span className="meta-label">Connected address</span>
                <span className="meta-value">
                  {connectedAddress ? (
                    <AddressLabel
                      className="meta-value"
                      address={connectedAddress}
                      network={walletSession.network}
                      showAddressWhenNamed
                    />
                  ) : (
                    'Not connected'
                  )}
                </span>
              </div>
              <div>
                <span className="meta-label">Workspace access list</span>
                <span className="meta-value">
                  {allowlist.length > 0 ? allowlist.join(', ') : 'None'}
                </span>
              </div>
              <div>
                <span className="meta-label">Access configuration</span>
                <span className="meta-value">
                  {runtimeAllowlistSource
                    ? `Runtime env (${runtimeAllowlistSource})${buildAllowlist.length > 0 ? ' + build env' : ''}`
                    : 'Build env (VITE_ARTIST_ALLOWLIST)'}
                </span>
              </div>
              {bnsAllowlist.length > 0 && (
                <div>
                  <span className="meta-label">Resolved .btc names</span>
                  <span className="meta-value">
                    {bnsAllowlist
                      .map((name) => {
                        const resolved = resolvedBnsAllowlist[name];
                        if (resolved) {
                          return `${name} -> ${resolved}`;
                        }
                        return bnsResolutionPending
                          ? `${name} -> resolving...`
                          : `${name} -> unresolved`;
                      })
                      .join(', ')}
                  </span>
                </div>
              )}
            </div>
            {allowlist.length === 0 && (
              <div className="alert">
                No allowlist entries loaded. Set `VITE_ARTIST_ALLOWLIST` at build time, or set runtime `ARTIST_ALLOWLIST`, then redeploy.
              </div>
            )}
            {!walletSession.isConnected && (
              <div className="alert">
                Connect a wallet to check access.
              </div>
            )}
            {walletSession.isConnected && awaitingBnsAllowlistResolution && (
              <div className="alert">
                Checking allowlist .btc names against your connected wallet...
              </div>
            )}
            {walletSession.isConnected && !allowed && !awaitingBnsAllowlistResolution && (
              <div className="alert">
                This wallet does not have collection workspace access yet. Connect an approved
                creator wallet or request access from @XtrataLayers. This access list is
                separate from the collector allowlists you configure for your mint.
              </div>
            )}
          </div>
        </section>

        <section className="collection-studio" aria-labelledby="collection-gate-flow">
          <div className="collection-studio__heading">
            <div>
              <span className="eyebrow">From artwork to mint page</span>
              <h2 id="collection-gate-flow">Set up once. Let collectors mint.</h2>
              <p>The collection mint v1.5 helper works with Xtrata Core v3.2.3 to manage registered artwork hashes, buyer reservations and duplicate protection.</p>
            </div>
          </div>
          <ol className="collection-studio__grid" style={{ listStyle: 'none', padding: 0 }}>
            {[
              ['Create your collection', 'Choose a name, supply and collection details. Prepare and deploy your collection helper from the workspace.'],
              ['Upload and organise artwork', 'Stage files in temporary storage, preview them and organise metadata. Uploading here does not inscribe the artwork.'],
              ['Set prices and access', 'Configure prices, payouts, wallet limits and collector allowlists. Use phases for price tiers and mint windows defined by block heights.'],
              ['Prepare your mint page', 'Add a cover and description, review the staged inventory and register its hashes before launch.'],
              ['Review and launch', 'Check readiness, publish your collection page and enable minting when ready. Collectors complete inscription through the mint flow.'],
              ['Manage storage after minting', 'Review retention and cleanup status. Cleanup requires verification and recovery safeguards; a matching on-chain hash alone is not enough to delete a file.']
            ].map(([title, description], index) => (
              <li className="collection-studio__task" style={{ cursor: 'default' }} key={title}>
                <span className="collection-studio__number">{String(index + 1).padStart(2, '0')}</span>
                <strong>{title}</strong><span>{description}</span>
              </li>
            ))}
          </ol>
          <p className="collection-studio__note">Temporary storage has a retention window. Review expiry and cleanup availability in the workspace before launch. On-chain configuration and minting incur fees, shown in their respective transaction flows.</p>
          <p>Need creator access? <a href="https://x.com/XtrataLayers" target="_blank" rel="noreferrer">Contact @XtrataLayers</a>.</p>
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
