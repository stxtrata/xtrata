import { useState } from 'react';

type QueueJob = { job_id: string; storage_key: string; state: string; revision: number; reason: string;
  proof_json: string | null; last_error: string | null; eligible_at: number | null; attempts: number };
type QueuePage = { mode: string; jobs: QueueJob[]; nextCursor: string | null };
export default function StorageCleanupPanel({ collectionId }: { collectionId: string }) {
  // Operations token stays in component memory. Never persist it or put it in a URL.
  const [token, setToken] = useState('');
  const [page, setPage] = useState<QueuePage | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [key, setKey] = useState('');
  async function request(action?: string, job?: QueueJob, cursor = '') {
    setBusy(true); setError(null);
    const url = `/collections/${encodeURIComponent(collectionId)}/cleanup`;
    try {
      if (action) {
        const response = await fetch(url, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, jobId: job?.job_id, revision: job?.revision, note, key }) });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error ?? 'Storage action failed.');
      }
      const response = await fetch(url + (cursor ? `?cursor=${encodeURIComponent(cursor)}` : ''), { headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? 'Queue unavailable.');
      setPage(data);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Storage request failed.'); }
    finally { setBusy(false); }
  }
  return <section className="panel app-section">
    <div className="panel__header"><div><h2>Storage cleanup</h2>
      <p>Verified files leave staging automatically after a waiting period and a second verification. One recovery copy is retained.</p></div></div>
    <div className="panel__body">
      <label className="field"><span>Storage operations key</span>
        <input type="password" value={token} autoComplete="off" onChange={e => setToken(e.target.value)} /></label>
      <div className="mint-actions">
        <button type="button" className="button button--ghost" disabled={busy || !collectionId || !token} onClick={() => request()}>Refresh queue</button>
        <button type="button" className="button button--ghost" disabled={busy || !collectionId || !token} onClick={() => request('scan')}>Run verification pass</button>
        <button type="button" className="button button--ghost" onClick={() => { setToken(''); setPage(null); }}>Clear access</button>
      </div>
      {error && <p className="alert" role="alert">{error}</p>}
      {page && <>
        <p>Mode: {page.mode}. Exceptions stay in this queue. Recovery copies and on-chain chunks are never purged by this process.</p>
        <label className="field"><span>Exception review note</span><input value={note} onChange={e => setNote(e.target.value)} /></label>
        <label className="field"><span>File storage key to inspect</span><input value={key} onChange={e => setKey(e.target.value)} /></label>
        <button type="button" className="button button--ghost" disabled={busy || !key} onClick={() => request('flag')}>Inspect file</button>
        {page.jobs.length === 0 && <p>No cleanup items recorded yet.</p>}
        {page.jobs.map(job => {
          let proof: { tokenId?: string; size?: number; collectionMint?: boolean } | null = null;
          try { proof = job.proof_json ? JSON.parse(job.proof_json) : null; } catch { /* Display without unverifiable evidence. */ }
          return <article key={job.job_id} style={{ overflowWrap: 'anywhere', marginBlock: '1rem' }}>
            <strong>{job.state}</strong> · {job.reason}<p><code>{job.storage_key}</code></p>
            {proof && <p>{proof.size?.toLocaleString()} bytes verified{proof.tokenId != null ? ` · Inscription #${proof.tokenId}` : ''}
              {proof.tokenId != null && !proof.collectionMint ? ' · Existing content; no collection sale inferred' : ''}</p>}
            {job.eligible_at && <p>Second pass eligible: {new Date(job.eligible_at).toLocaleString()}</p>}
            {job.last_error && <p role="status">Held: {job.last_error}</p>}
            {['flagged','blocked','approved'].includes(job.state) && <button type="button" className="button button--ghost"
              disabled={busy || !note.trim()} onClick={() => request('retain', job)}>Keep in staging</button>}
          </article>;
        })}
        {page.nextCursor && <button type="button" className="button button--ghost" disabled={busy} onClick={() => request(undefined, undefined, page.nextCursor!)}>Next page</button>}
      </>}
    </div>
  </section>;
}
