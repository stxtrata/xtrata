import { useCallback, useEffect, useState } from 'react';
import { parseManageJsonResponse, toManageApiErrorMessage } from '../lib/api-errors';

type Retention = {
  committed: boolean;
  earliestExpiry: number | null;
  expiringWithin24h: number;
  extensionsUsed: number;
  extensionsLeft: number;
  extensionDays: number;
};

const HOUR = 3600000;
const formatWhen = (at: number) =>
  new Date(at).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
const formatLeft = (ms: number) => {
  if (ms <= 0) return 'now';
  const hours = Math.floor(ms / HOUR);
  if (hours >= 48) return `${Math.floor(hours / 24)} days`;
  if (hours >= 1) return `${hours} hour${hours === 1 ? '' : 's'}`;
  return `${Math.max(1, Math.floor(ms / 60000))} minutes`;
};

/**
 * Temporary-file retention for a draft: when files expire, a visible countdown
 * once under 24 hours, and the one-time "Keep my files" 14-day extension.
 * Deployed or published collections keep files until minted.
 */
export default function FileRetentionNotice({ collectionId, refreshKey = 0, compact = false }: {
  collectionId: string; refreshKey?: number; compact?: boolean;
}) {
  const [retention, setRetention] = useState<Retention | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  const load = useCallback(async () => {
    if (!collectionId) { setRetention(null); return; }
    try {
      const response = await fetch(`/collections/${encodeURIComponent(collectionId)}/retention`, { cache: 'no-store' });
      setRetention(await parseManageJsonResponse<Retention>(response, 'File retention'));
    } catch {
      setRetention(null);
    }
  }, [collectionId]);

  useEffect(() => { void load(); }, [load, refreshKey]);
  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timer);
  }, []);

  if (!retention) return null;
  if (retention.committed) {
    return compact ? null : <p className="meta-value">Your contract is deployed, so your files are kept until they are minted.</p>;
  }
  if (retention.earliestExpiry === null) return null;

  const left = retention.earliestExpiry - now;
  const urgent = left < 24 * HOUR;
  const extend = async () => {
    setBusy(true); setMessage('');
    try {
      const response = await fetch(`/collections/${encodeURIComponent(collectionId)}/retention`, { method: 'POST' });
      setRetention(await parseManageJsonResponse<Retention>(response, 'Keep my files'));
      setMessage(`Done. Your files are now kept for another ${retention.extensionDays} days.`);
    } catch (error) {
      setMessage(toManageApiErrorMessage(error, 'Could not extend your files.'));
    } finally { setBusy(false); }
  };

  if (compact) {
    return <p className={urgent ? 'alert' : 'meta-value'}>Files expire {formatWhen(retention.earliestExpiry)}{urgent ? ` (in ${formatLeft(left)})` : ''}</p>;
  }
  return (
    <div className={urgent ? 'alert' : 'panel__body'} role={urgent ? 'alert' : 'status'}>
      <p>
        <strong>{urgent ? `Your uploaded files will be deleted in ${formatLeft(left)}` : `Uploaded files are kept until ${formatWhen(retention.earliestExpiry)}`}</strong>
        {urgent ? ` (${formatWhen(retention.earliestExpiry)}).` : '.'}
        {' '}Files are temporary until your contract is deployed; after that they're kept until minted.
      </p>
      {retention.extensionsLeft > 0 ? (
        <div className="mint-actions">
          <button type="button" className={urgent ? 'button' : 'button button--ghost'} disabled={busy} onClick={() => void extend()}>
            {busy ? 'Saving…' : `Keep my files ${retention.extensionDays} more days`}
          </button>
          <span className="meta-value">You can do this once per collection.</span>
        </div>
      ) : (
        <p className="meta-value">You've used this collection's one extension. Deploy your contract before the date above to keep your files.</p>
      )}
      {message ? <p role="status">{message}</p> : null}
    </div>
  );
}
