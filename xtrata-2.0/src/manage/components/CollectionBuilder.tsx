import { useEffect, useRef, useState, type ReactNode } from 'react';
import { BUILDER_STEPS, getBuilderCompletion, getBuilderGates, type BuilderStepId } from '../lib/builder';
import type { JourneySignals } from '../lib/journey';

type Props = {
  collectionId: string; collectionName: string; walletKey: string;
  previewCover?: string | null; previewDescription?: string;
  signals: JourneySignals; loading: boolean; error: string | null;
  wallet: ReactNode; picker: ReactNode; deploy: ReactNode; artwork: ReactNode;
  inventory: ReactNode; rules: ReactNode; page: ReactNode; storage: ReactNode;
  onRefresh: () => void; onAdvanced: () => void; onCreate: () => void;
};
export default function CollectionBuilder(p: Props) {
  const [step, setStep] = useState<BuilderStepId>('basics');
  const [visited, setVisited] = useState<Set<BuilderStepId>>(new Set(['basics']));
  const [showPicker, setShowPicker] = useState(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const storageKey = `xtrata:collection-builder:${p.walletKey}:${p.collectionId || 'new'}`;
  const gates = getBuilderGates(p.signals);
  const complete = getBuilderCompletion(p.signals);
  useEffect(() => {
    let saved: BuilderStepId = 'basics';
    try { const value = localStorage.getItem(storageKey); if (BUILDER_STEPS.some(item => item.id === value)) saved = value as BuilderStepId; } catch { /* Browser storage is optional. */ }
    setStep(saved); setVisited(new Set(['basics', saved]));
  }, [storageKey]);
  const navigate = (id: BuilderStepId) => {
    if (gates[id]) return;
    setStep(id); setVisited(current => new Set([...current, id]));
    try { localStorage.setItem(storageKey, id); } catch { /* Browser storage is optional. */ }
    requestAnimationFrame(() => heading.current?.focus());
  };
  const index = BUILDER_STEPS.findIndex(item => item.id === step);
  const current = BUILDER_STEPS[index];
  const next = BUILDER_STEPS[index + 1];
  // Keep visited forms mounted: switching steps must not discard unsaved inputs.
  const section = (id: BuilderStepId, content: ReactNode) => visited.has(id) && <div key={id} hidden={step !== id}>{content}</div>;
  return <div className="app manage-app creator-builder">
    <header className="creator-builder__top">
      <div><span className="eyebrow">Collection studio · v1.6 / Core v3.2.3</span><h1>{p.collectionName || 'Your new collection'}</h1>
      <p>{p.loading ? 'Checking saved collection…' : p.signals.published ? 'Published' : 'Draft'} · {p.signals.unpaused === true ? 'Minting enabled' : p.signals.unpaused === false ? 'Minting paused' : 'Mint status unconfirmed'}</p></div>
      <div>{p.wallet}<div className="mint-actions"><button type="button" className="button button--ghost" onClick={() => setShowPicker(!showPicker)}>Switch collection</button><button type="button" className="button button--ghost" onClick={p.onCreate}>New collection</button></div></div>
    </header>
    <div hidden={!showPicker} className="panel">{showPicker && p.picker}</div>
    <div className="creator-builder__layout">
      <aside className="creator-builder__sidebar"><nav aria-label="Collection creation steps">
        {BUILDER_STEPS.map((item, i) => <button key={item.id} type="button" aria-current={step === item.id ? 'step' : undefined}
          className="creator-builder__step" onClick={() => navigate(item.id)} disabled={!!gates[item.id]} title={gates[item.id] ?? undefined}>
          <span className="creator-builder__step-number">{complete[item.id] ? '✓' : i + 1}</span>
          <span><strong>{item.title}</strong><small>{gates[item.id] ? 'Complete earlier steps' : complete[item.id] ? 'Ready' : step === item.id ? 'In progress' : 'Not started'}</small></span>
        </button>)}
      </nav><p className="creator-builder__help">Save changes within each form. Your place in the builder is remembered on this browser.</p>
      <details><summary>Technical tools</summary><p>Switching views may discard unsaved form edits.</p><button type="button" className="button button--ghost" onClick={p.onAdvanced}>Open advanced workspace</button></details></aside>
      <main className="creator-builder__workspace">
        <div className="creator-builder__section-heading"><span className="eyebrow">Step {index + 1} of 6</span><h2 ref={heading} tabIndex={-1}>{current.title}</h2><p>{current.description}</p></div>
        {p.error && <div role="alert" className="alert">{p.error}</div>}
        {gates[step] && <div role="status" className="alert">{gates[step]}</div>}
        <div className="creator-builder__forms">
          <div hidden={step !== 'basics' && step !== 'contract'}>{p.deploy}</div>
          {section('artwork', p.artwork)}
          {section('contract', p.inventory)}
          {section('rules', p.rules)}
          {section('launch', p.page)}
          {section('manage', p.storage)}
        </div>
        <footer className="creator-builder__footer"><div><button type="button" className="button button--ghost" disabled={index === 0} onClick={() => navigate(BUILDER_STEPS[index - 1].id)}>Back</button><button type="button" className="button button--ghost" disabled={p.loading} onClick={p.onRefresh}>Refresh readiness</button></div>
          <div>{next && <><span className="creator-builder__reason">{gates[next.id] || 'Save any edits above before continuing.'}</span><button type="button" className="button" disabled={p.loading || !!gates[next.id]} onClick={() => navigate(next.id)}>Continue to {next.title.toLowerCase()}</button></>}</div>
        </footer>
      </main>
      <aside className="creator-builder__review" aria-label="Collection summary"><span className="eyebrow">Your collection</span><h3>{p.collectionName || 'Untitled collection'}</h3>
        <div className="creator-builder__cover">{p.previewCover ? <img src={p.previewCover} alt={`${p.collectionName || 'Collection'} cover`} /> : <span>Set your cover in<br />Review & launch</span>}</div>
        {p.previewDescription && <p>{p.previewDescription}</p>}
        <dl><dt>Active files</dt><dd>{p.signals.activeAssetCount}</dd><dt>Inventory</dt><dd>{p.signals.deployPricingLockPresent ? 'Staging locked' : 'Preparing'}</dd><dt>Contract</dt><dd>{p.signals.deployReady ? 'Confirmed' : 'Not confirmed'}</dd><dt>Mint price</dt><dd>{p.signals.launchMintPriceConfigured ? 'Configured' : 'Needs configuration'}</dd><dt>Page details</dt><dd>{p.signals.hasLivePageDescription && p.signals.hasLivePageCover ? 'Prepared' : 'Needs cover / description'}</dd></dl>
        <p>Artwork stays in temporary storage until collectors mint. Review file expiry before launch.</p>
        {p.collectionId && <a href={`/collection/${encodeURIComponent(p.collectionId)}`} target="_blank" rel="noreferrer">Open saved mint-page preview ↗</a>}
        <p className="creator-builder__help">Preview reflects saved data. Registration and final launch checks remain in their action panels.</p>
      </aside>
    </div>
  </div>;
}
