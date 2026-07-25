import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import {
  ITEM_STATES,
  initialProgress,
  type ItemProgress,
  type ItemState
} from '@xtrata/collections-client';
import {
  ItemStatusRow,
  STATE_DESCRIPTION,
  STATE_LABEL,
  STATE_TONE,
  StatusBadge,
  statusLabel
} from './ItemStatus';

const progressIn = (state: ItemState, patch: Partial<ItemProgress> = {}): ItemProgress => ({
  ...initialProgress(0, 8),
  state,
  ...patch
});

const renderBadge = (state: ItemState, patch: Partial<ItemProgress> = {}) =>
  render(<StatusBadge progress={progressIn(state, patch)} />);

describe('StatusBadge — every executor state renders', () => {
  it('covers the full state machine with no gaps', () => {
    // If the client adds a state, this fails until the UI names it.
    expect(Object.keys(STATE_LABEL).sort()).toEqual([...ITEM_STATES].sort());
    expect(Object.keys(STATE_TONE).sort()).toEqual([...ITEM_STATES].sort());
    expect(Object.keys(STATE_DESCRIPTION).sort()).toEqual([...ITEM_STATES].sort());
  });

  it.each([...ITEM_STATES])('renders %s with its own label, tone and description', (state) => {
    const { container, unmount } = renderBadge(state, { uploadedChunks: state === 'partially-uploaded' ? 3 : 0 });

    const badge = container.querySelector(`[data-state="${state}"]`);
    expect(badge).not.toBeNull();
    expect(badge).toHaveTextContent(STATE_LABEL[state]);
    expect(badge).toHaveClass(`state--${STATE_TONE[state]}`);
    expect(badge).toHaveAttribute('title', STATE_DESCRIPTION[state]);

    unmount();
  });

  it('shows chunk progress only for partially-uploaded', () => {
    expect(statusLabel(progressIn('partially-uploaded', { uploadedChunks: 3 }))).toBe(
      'Uploading 3 of 8'
    );
    expect(statusLabel(progressIn('staged', { uploadedChunks: 8 }))).toBe('Staged');
    expect(statusLabel(progressIn('prepared'))).toBe('Prepared');
  });

  it('gives terminal-good states the done tone and failure the bad tone', () => {
    expect(STATE_TONE['indexed']).toBe('done');
    expect(STATE_TONE['assigned']).toBe('done');
    expect(STATE_TONE['claimed']).toBe('done');
    expect(STATE_TONE['failed']).toBe('bad');
    expect(STATE_TONE['expired']).toBe('stale');
    expect(STATE_TONE['prepared']).toBe('pending');
  });
});

describe('ItemStatusRow', () => {
  const renderRow = (progress: ItemProgress, fileName = 'artwork-01.png') =>
    render(
      <table>
        <tbody>
          <ItemStatusRow progress={progress} fileName={fileName} />
        </tbody>
      </table>
    );

  it('renders the index, file name, badge, chunk counter and tx count', () => {
    renderRow(
      progressIn('partially-uploaded', {
        index: 7,
        uploadedChunks: 3,
        txids: ['0xaa', '0xbb']
      })
    );

    const row = screen.getByRole('row');
    expect(within(row).getByText('7')).toBeInTheDocument();
    expect(within(row).getByText('artwork-01.png')).toBeInTheDocument();
    expect(within(row).getByText('Uploading 3 of 8')).toBeInTheDocument();
    expect(within(row).getByText('3/8')).toBeInTheDocument();
    expect(within(row).getByText('2')).toBeInTheDocument();
  });

  it('exposes upload progress to assistive technology', () => {
    renderRow(progressIn('partially-uploaded', { uploadedChunks: 2 }));
    expect(screen.getByLabelText('25% of chunks uploaded')).toBeInTheDocument();
  });

  it('shows the error text on a failed item', () => {
    renderRow(progressIn('failed', { error: 'contract rejected: u105' }));
    expect(screen.getByText('contract rejected: u105')).toBeInTheDocument();
  });

  it('does not divide by zero for a zero-chunk item', () => {
    renderRow({ ...initialProgress(0, 0), state: 'prepared' });
    expect(screen.getByLabelText('0% of chunks uploaded')).toBeInTheDocument();
  });

  it('tags the row with its item index for targeted updates', () => {
    renderRow(progressIn('indexed', { index: 42 }));
    expect(screen.getByRole('row')).toHaveAttribute('data-item-index', '42');
  });
});
