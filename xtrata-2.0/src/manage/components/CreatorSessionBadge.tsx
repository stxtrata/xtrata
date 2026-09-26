import { useState } from 'react';
import { useManageWallet } from '../ManageWalletContext';

/** "Signed in until … · Sign out" for the studio header. */
export default function CreatorSessionBadge() {
  const { creatorSession, signOut } = useManageWallet();
  const [pending, setPending] = useState(false);
  if (creatorSession.status !== 'signed-in') return null;
  const until = new Date(creatorSession.expiresAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  return (
    <span className="creator-session-badge meta-value">
      Signed in{creatorSession.admin ? ' (admin)' : ''} until {until} ·{' '}
      <button type="button" className="button button--ghost button--mini" disabled={pending}
        onClick={() => { setPending(true); void signOut().finally(() => setPending(false)); }}>
        {pending ? 'Signing out…' : 'Sign out'}
      </button>
    </span>
  );
}
