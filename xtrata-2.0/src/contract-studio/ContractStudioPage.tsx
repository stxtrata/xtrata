import { useMemo, useState } from 'react';
import { PostConditionMode, stringAsciiCV, uintCV } from '@stacks/transactions';
import type { WalletSession } from '../lib/wallet/types';
import {
  connectWallet,
  disconnectWallet,
  showContractCall,
  showContractDeploy
} from '../lib/wallet/connect';
import { resolveXtrataAssetRef } from '../lib/contract-studio/asset-reference';
import {
  DEFAULT_LEADERBOARD_CONFIGURATION,
  type LeaderboardConfiguration,
  type StudioProject,
  type XtrataAssetRef
} from '../lib/contract-studio/model';
import { generateLeaderboardProject } from '../lib/contract-studio/leaderboard';
import {
  createSimulation,
  resetSimulatedSeason,
  submitSimulatedScore,
  type SimulationState
} from '../lib/contract-studio/simulation';
import { downloadProjectZip } from '../lib/contract-studio/export';
import {
  assertDeploymentNetwork,
  verifyDeployedSource
} from '../lib/contract-studio/deployment';

const MAINNET_CORE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';

const short = (value: string) =>
  value.length > 22 ? `${value.slice(0, 10)}…${value.slice(-8)}` : value;

const ContractStudioPage = () => {
  const [wallet, setWallet] = useState<WalletSession>({ isConnected: false });
  const [coreContractId, setCoreContractId] = useState(MAINNET_CORE);
  const [tokenId, setTokenId] = useState('');
  const [asset, setAsset] = useState<XtrataAssetRef | null>(null);
  const [configuration, setConfiguration] = useState<LeaderboardConfiguration>(
    DEFAULT_LEADERBOARD_CONFIGURATION
  );
  const [project, setProject] = useState<StudioProject | null>(null);
  const [source, setSource] = useState('');
  const [customised, setCustomised] = useState(false);
  const [simulation, setSimulation] = useState<SimulationState>(createSimulation);
  const [simWallet, setSimWallet] = useState('wallet-a');
  const [simAlias, setSimAlias] = useState('ACE');
  const [simScore, setSimScore] = useState('100');
  const [status, setStatus] = useState('Select and verify an inscription to begin.');
  const [contractName, setContractName] = useState('xtrata-game-scores');
  const [deployTxId, setDeployTxId] = useState('');
  const [deployedSourceVerified, setDeployedSourceVerified] = useState(false);
  const [testsAcknowledged, setTestsAcknowledged] = useState(false);

  const updateConfiguration = <K extends keyof LeaderboardConfiguration>(
    key: K,
    value: LeaderboardConfiguration[K]
  ) => {
    setConfiguration((current) => ({ ...current, [key]: value }));
    setProject(null);
    setSource('');
    setCustomised(false);
    setTestsAcknowledged(false);
  };

  const includedModules = useMemo(
    () => [
      'Pinned Xtrata inscription reference',
      'Per-wallet score state',
      `Top ${configuration.topN} leaderboard`,
      configuration.submissionPolicy === 'public'
        ? 'Public score submission'
        : 'Administrator-only submission',
      configuration.seasons ? 'Administrator-created seasons' : 'Permanent season',
      'Indexable print events'
    ],
    [configuration]
  );

  const handleConnect = async () => {
    setStatus('Opening the wallet chooser…');
    try {
      const session = await connectWallet({
        appName: 'Xtrata Contract Studio',
        appIcon: `${window.location.origin}/favicon.svg`
      });
      setWallet(session);
      if (session.address) {
        updateConfiguration('administrator', session.address);
        setStatus(`Connected ${short(session.address)} on ${session.network}.`);
      } else {
        setStatus('Wallet connection was cancelled.');
      }
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setWallet({ isConnected: false });
    setStatus('Wallet disconnected. Read-only inscription verification remains available.');
  };

  const handleVerify = async () => {
    setStatus('Reading authoritative inscription state from the selected core…');
    setAsset(null);
    setProject(null);
    try {
      const next = await resolveXtrataAssetRef({
        coreContractId,
        tokenId,
        senderAddress: wallet.address
      });
      setAsset(next);
      setSimulation(createSimulation());
      setStatus(`Verified sealed ${next.mimeType} inscription #${next.tokenId}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    }
  };

  const handleGenerate = async () => {
    if (!asset) return;
    setStatus('Generating deterministic source and project artifacts…');
    try {
      const next = await generateLeaderboardProject(asset, configuration);
      setProject(next);
      setSource(next.source);
      setCustomised(false);
      setTestsAcknowledged(false);
      setStatus(`Generated source SHA-256 ${next.sourceHash}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    }
  };

  const handleSimulateScore = () => {
    try {
      const next = submitSimulatedScore(simulation, configuration, {
        wallet: simWallet,
        alias: simAlias,
        score: simScore,
        isAdministrator: simWallet === 'administrator'
      });
      setSimulation(next);
      setStatus('Browser model accepted the score. Run the exported Simnet suite for authoritative contract results.');
    } catch (error) {
      setStatus(`Expected/actual result: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const handleSeason = () => {
    try {
      setSimulation(resetSimulatedSeason(simulation, configuration, true));
      setStatus('Administrator simulation started the next season.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    }
  };

  const handleDeploy = () => {
    if (!asset || !project) return;
    try {
      if (customised) throw new Error('Customised source must be exported and pass the full Clarinet suite again before deployment.');
      if (!testsAcknowledged) throw new Error('Confirm the exported Clarinet tests passed before deployment.');
      assertDeploymentNetwork({
        assetNetwork: asset.network,
        walletNetwork: wallet.network,
        contractName
      });
      setStatus(`Waiting for wallet confirmation on ${asset.network}…`);
      showContractDeploy({
        contractName,
        codeBody: source,
        network: asset.network,
        onFinish: (payload) => {
          setDeployTxId(payload.txId);
          setDeployedSourceVerified(false);
          setStatus(`Deployment broadcast: ${payload.txId}. Verify source after confirmation.`);
        },
        onCancel: () => setStatus('Deployment cancelled or rejected by the wallet.')
      });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    }
  };

  const handleVerifyDeployedSource = async () => {
    if (!asset || !project || !wallet.address) return;
    setStatus('Fetching the confirmed deployed source and comparing SHA-256…');
    try {
      const result = await verifyDeployedSource({
        network: asset.network,
        address: wallet.address,
        contractName,
        expectedHash: project.sourceHash
      });
      setDeployedSourceVerified(result.matches);
      setStatus(
        result.matches
          ? `Deployed source verified: ${result.actualHash}.`
          : `Source mismatch. Expected ${project.sourceHash}; received ${result.actualHash}.`
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    }
  };

  const handleDeployedCall = (kind: 'verify' | 'score') => {
    if (!asset || !wallet.address || !deployedSourceVerified) return;
    try {
      setStatus(`Waiting for wallet confirmation: ${kind === 'verify' ? 'verify asset' : 'submit score'}…`);
      showContractCall({
        contractAddress: wallet.address,
        contractName,
        functionName: kind === 'verify' ? 'verify-asset' : 'submit-score',
        functionArgs:
          kind === 'verify'
            ? []
            : [uintCV(BigInt(simScore || '0')), stringAsciiCV(simAlias)],
        network: asset.network,
        postConditionMode: PostConditionMode.Deny,
        postConditions: [],
        onFinish: (payload) => setStatus(`Interaction broadcast: ${payload.txId}.`),
        onCancel: () => setStatus('Interaction cancelled or rejected by the wallet.')
      });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className="contract-studio">
      <header className="contract-studio__hero">
        <a href="/" className="contract-studio__brand">XTRATA</a>
        <div>
          <p className="contract-studio__eyebrow">Built using Xtrata Protocol</p>
          <h1>Contract Studio</h1>
          <p>Xtrata stores the data. Clarity provides the logic.</p>
        </div>
        <button type="button" onClick={wallet.isConnected ? handleDisconnect : handleConnect}>
          {wallet.isConnected ? short(wallet.address ?? '') : 'Connect wallet'}
        </button>
      </header>

      <div className="contract-studio__status" role="status">{status}</div>

      <nav className="contract-studio__steps" aria-label="Studio steps">
        {['1 Inscription', '2 Behaviour', '3 Configure', '4 Generate', '5 Test', '6 Deploy'].map(
          (step) => <span key={step}>{step}</span>
        )}
      </nav>

      <main className="contract-studio__layout">
        <section className="contract-studio__panel">
          <div className="contract-studio__heading">
            <span>01</span><div><h2>Select inscription</h2><p>Confirm the authoritative on-chain reference.</p></div>
          </div>
          <label>Network-specific Xtrata core
            <input value={coreContractId} onChange={(event) => setCoreContractId(event.target.value)} />
          </label>
          <label>Inscription token id
            <input inputMode="numeric" value={tokenId} onChange={(event) => setTokenId(event.target.value)} placeholder="e.g. 512" />
          </label>
          <button type="button" onClick={handleVerify}>Verify inscription</button>
          {asset && (
            <div className="contract-studio__asset">
              <div className="contract-studio__asset-preview">
                <iframe title={`Xtrata inscription ${asset.tokenId}`} src={`/inscription/${asset.tokenId}`} sandbox="allow-scripts" />
              </div>
              <dl>
                <div><dt>Canonical id</dt><dd>{asset.coreContractId}#{asset.tokenId}</dd></div>
                <div><dt>SHA-256</dt><dd>{asset.contentHash}</dd></div>
                <div><dt>Creator</dt><dd>{asset.creator}</dd></div>
                <div><dt>Current owner</dt><dd>{asset.owner}</dd></div>
                <div><dt>Type / bytes</dt><dd>{asset.mimeType} · {asset.totalSize}</dd></div>
                <div><dt>Protocol</dt><dd>{asset.protocolVersion}</dd></div>
                <div><dt>Parents</dt><dd>{asset.parents.join(', ') || 'None'}</dd></div>
              </dl>
            </div>
          )}
        </section>

        <section className="contract-studio__panel">
          <div className="contract-studio__heading">
            <span>02</span><div><h2>Choose behaviour</h2><p>Reviewed templates, plain language first.</p></div>
          </div>
          <div className="contract-studio__template-card contract-studio__template-card--active">
            <strong>Keep Scores</strong><span>Tier 1 · xtrata-leaderboard/1.0.0</span>
            <p>Wallet-authenticated scores tied permanently to one verified game inscription.</p>
          </div>
          <div className="contract-studio__template-grid" aria-label="Future templates">
            {['Save Presets', 'Create a Collection', 'Add Traits', 'Record Contributions', 'Control Access'].map(
              (label) => <div className="contract-studio__template-card contract-studio__template-card--disabled" key={label}>{label}<small>Later phase</small></div>
            )}
          </div>
        </section>

        <section className="contract-studio__panel">
          <div className="contract-studio__heading">
            <span>03</span><div><h2>Configure</h2><p>Every choice maps to a visible typed setting.</p></div>
          </div>
          <div className="contract-studio__form-grid">
            <label>Project name<input value={configuration.projectName} onChange={(e) => updateConfiguration('projectName', e.target.value)} /></label>
            <label>Game id<input value={configuration.gameId} onChange={(e) => updateConfiguration('gameId', e.target.value)} /></label>
            <label>Administrator<input value={configuration.administrator} onChange={(e) => updateConfiguration('administrator', e.target.value)} /></label>
            <label>Better score<select value={configuration.direction} onChange={(e) => updateConfiguration('direction', e.target.value as 'higher' | 'lower')}><option value="higher">Higher</option><option value="lower">Lower</option></select></label>
            <label>Wallet record<select value={configuration.recordMode} onChange={(e) => updateConfiguration('recordMode', e.target.value as 'personal-best' | 'most-recent')}><option value="personal-best">Personal best</option><option value="most-recent">Most recent</option></select></label>
            <label>Submission<select value={configuration.submissionPolicy} onChange={(e) => updateConfiguration('submissionPolicy', e.target.value as 'public' | 'administrator')}><option value="public">Public</option><option value="administrator">Administrator only</option></select></label>
            <label>Minimum score<input inputMode="numeric" value={configuration.minScore} onChange={(e) => updateConfiguration('minScore', e.target.value)} /></label>
            <label>Maximum score<input inputMode="numeric" value={configuration.maxScore} onChange={(e) => updateConfiguration('maxScore', e.target.value)} /></label>
            <label>Top N<input type="number" min="3" max="10" value={configuration.topN} onChange={(e) => updateConfiguration('topN', Number(e.target.value))} /></label>
            <label className="contract-studio__check"><input type="checkbox" checked={configuration.seasons} onChange={(e) => updateConfiguration('seasons', e.target.checked)} /> Seasonal reset</label>
            <label className="contract-studio__check"><input type="checkbox" checked={configuration.rejectIdentical} onChange={(e) => updateConfiguration('rejectIdentical', e.target.checked)} /> Reject identical score</label>
          </div>
          <div className="contract-studio__summary">
            <h3>Before generation</h3>
            <ul>{includedModules.map((item) => <li key={item}>{item}</li>)}</ul>
            <p><strong>Excluded:</strong> payments, custody, score oracle, upgrades, pausing.</p>
            <p><strong>Cannot do:</strong> inspect game bytes or prove a score was honestly earned.</p>
          </div>
          <button type="button" disabled={!asset} onClick={handleGenerate}>Generate project</button>
        </section>

        {project && (
          <>
            <section className="contract-studio__panel contract-studio__panel--wide">
              <div className="contract-studio__heading">
                <span>04</span><div><h2>Generated source</h2><p>Complete, inspectable, and exportable.</p></div>
              </div>
              <div className="contract-studio__hashes">
                <code>source {project.sourceHash}</code>
                <code>configuration {project.configurationHash}</code>
                {customised && <strong>Customised · test result invalidated</strong>}
              </div>
              <textarea className="contract-studio__source" spellCheck={false} value={source} onChange={(event) => { setSource(event.target.value); setCustomised(event.target.value !== project.source); setTestsAcknowledged(false); }} />
              <button type="button" onClick={() => downloadProjectZip(project.artifacts)}>Download Clarinet project (.zip)</button>
            </section>

            <section className="contract-studio__panel">
              <div className="contract-studio__heading">
                <span>05</span><div><h2>Contract laboratory</h2><p>Resettable browser model; Clarinet remains authoritative.</p></div>
              </div>
              <div className="contract-studio__form-grid">
                <label>Simulated wallet<select value={simWallet} onChange={(e) => setSimWallet(e.target.value)}><option value="wallet-a">Wallet A</option><option value="wallet-b">Wallet B</option><option value="administrator">Administrator</option></select></label>
                <label>Alias<input value={simAlias} onChange={(e) => setSimAlias(e.target.value)} /></label>
                <label>Score<input inputMode="numeric" value={simScore} onChange={(e) => setSimScore(e.target.value)} /></label>
              </div>
              <div className="contract-studio__actions">
                <button type="button" onClick={handleSimulateScore}>Submit score</button>
                <button type="button" onClick={handleSeason}>Admin reset</button>
                <button type="button" onClick={() => setSimulation(createSimulation())}>Reset lab</button>
              </div>
              <ol className="contract-studio__board">
                {simulation.scores.filter((entry) => entry.season === simulation.season).slice(0, configuration.topN).map((entry) => (
                  <li key={entry.wallet}><span>{entry.alias} · {entry.wallet}</span><strong>{entry.score.toString()}</strong></li>
                ))}
              </ol>
              <pre className="contract-studio__events">{simulation.events.join('\n')}</pre>
              <label className="contract-studio__check">
                <input type="checkbox" checked={testsAcknowledged} disabled={customised} onChange={(e) => setTestsAcknowledged(e.target.checked)} />
                I exported this exact source and its Clarinet tests passed.
              </label>
            </section>

            <section className="contract-studio__panel">
              <div className="contract-studio__heading">
                <span>06</span><div><h2>Deploy safely</h2><p>Wallet signed. No seed phrase or private key.</p></div>
              </div>
              <div className="contract-studio__readiness">
                <p><strong>Network:</strong> {asset?.network}</p>
                <p><strong>Risk:</strong> Tier 1 · no asset flow</p>
                <p><strong>Upgradeability:</strong> immutable</p>
                <p><strong>Administrator:</strong> {configuration.administrator}</p>
                <p><strong>Source:</strong> {project.sourceHash}</p>
              </div>
              <label>Contract name<input value={contractName} onChange={(e) => setContractName(e.target.value)} /></label>
              <button type="button" onClick={handleDeploy} disabled={!wallet.isConnected || customised}>Deploy on {asset?.network}</button>
              {deployTxId && (
                <div className="contract-studio__deployed">
                  <p>Broadcast transaction: <code>{deployTxId}</code></p>
                  <button type="button" onClick={handleVerifyDeployedSource}>Verify confirmed source</button>
                  {deployedSourceVerified && (
                    <>
                      <strong>Exact tested source verified.</strong>
                      <div className="contract-studio__actions">
                        <button type="button" onClick={() => handleDeployedCall('verify')}>Verify inscription link</button>
                        <button type="button" onClick={() => handleDeployedCall('score')}>Submit current lab score</button>
                      </div>
                    </>
                  )}
                </div>
              )}
              <p className="contract-studio__warning">A reference alone is a community connection. “Official” publication requires a separate current-owner approval mechanism.</p>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default ContractStudioPage;
