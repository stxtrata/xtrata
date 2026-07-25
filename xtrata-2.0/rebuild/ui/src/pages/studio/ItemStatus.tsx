import { ITEM_STATES, type ItemProgress, type ItemState } from '@xtrata/collections-client';

/**
 * Per-item live status.
 *
 * The labels are a 1:1 rendering of the executor's state machine
 * (`client/src/progress.ts`) — no derived or invented states, because the
 * whole point of the state machine is that what the screen says and what the
 * engine believes are the same thing. `partially-uploaded` is the only state
 * that carries a number, and it always reads "k of n chunks".
 */

export type StatusTone = 'pending' | 'active' | 'done' | 'bad' | 'stale';

export const STATE_TONE: Record<ItemState, StatusTone> = {
  prepared: 'pending',
  reserved: 'active',
  begun: 'active',
  'partially-uploaded': 'active',
  staged: 'active',
  'seal-submitted': 'active',
  confirmed: 'active',
  indexed: 'done',
  assigned: 'done',
  claimed: 'done',
  failed: 'bad',
  expired: 'stale'
};

export const STATE_LABEL: Record<ItemState, string> = {
  prepared: 'Prepared',
  reserved: 'Reserved',
  begun: 'Begun',
  'partially-uploaded': 'Uploading',
  staged: 'Staged',
  'seal-submitted': 'Seal submitted',
  confirmed: 'Confirmed',
  indexed: 'Indexed',
  assigned: 'Assigned',
  claimed: 'Claimed',
  failed: 'Failed',
  expired: 'Expired'
};

/** Short explanation shown as the badge's tooltip / a11y description. */
export const STATE_DESCRIPTION: Record<ItemState, string> = {
  prepared: 'Planned locally. Nothing on chain yet.',
  reserved: 'A collection index is reserved on chain and counts against supply.',
  begun: 'Upload session opened on the core.',
  'partially-uploaded': 'Chunk batches are landing; the chain knows how many.',
  staged: 'All chunks are on chain and the running hash matches. Ready to seal.',
  'seal-submitted': 'Seal transaction broadcast, awaiting confirmation.',
  confirmed: 'Seal transaction confirmed.',
  indexed: 'Minted and placed at its index in the collection.',
  assigned: 'Assigned to a drop.',
  claimed: 'Claimed from a drop.',
  failed: 'This item stopped. Retry re-reads its chain state before doing anything.',
  expired: 'The reservation expired and the index returned to the free list. Restarts from scratch.'
};

export const statusLabel = (progress: ItemProgress): string =>
  progress.state === 'partially-uploaded'
    ? `${STATE_LABEL[progress.state]} ${progress.uploadedChunks} of ${progress.totalChunks}`
    : STATE_LABEL[progress.state];

export const ALL_ITEM_STATES = ITEM_STATES;

export const StatusBadge = ({ progress }: { progress: ItemProgress }): JSX.Element => (
  <span
    className={`state state--${STATE_TONE[progress.state]}`}
    data-state={progress.state}
    title={STATE_DESCRIPTION[progress.state]}
  >
    {statusLabel(progress)}
  </span>
);

export const ItemStatusRow = ({
  progress,
  fileName
}: {
  progress: ItemProgress;
  fileName: string;
}): JSX.Element => {
  const pct =
    progress.totalChunks > 0
      ? Math.round((progress.uploadedChunks / progress.totalChunks) * 100)
      : 0;
  return (
    <tr data-item-index={progress.index}>
      <td className="mono">{progress.index}</td>
      <td>{fileName}</td>
      <td>
        <StatusBadge progress={progress} />
      </td>
      <td>
        <span className="meter" role="img" aria-label={`${pct}% of chunks uploaded`}>
          <span style={{ width: `${pct}%` }} />
        </span>{' '}
        <span className="muted mono">
          {progress.uploadedChunks}/{progress.totalChunks}
        </span>
      </td>
      <td className="mono">{progress.txids.length}</td>
      <td className="muted">{progress.error ?? ''}</td>
    </tr>
  );
};
