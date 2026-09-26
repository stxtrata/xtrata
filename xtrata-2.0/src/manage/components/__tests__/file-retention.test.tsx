// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import FileRetentionNotice from '../FileRetentionNotice';

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
const stub = (body: Record<string, unknown>, after?: Record<string, unknown>) =>
  vi.stubGlobal('fetch', vi.fn(async (_url: string, init?: RequestInit) =>
    Response.json(init?.method === 'POST' ? after : body)));

describe('file retention notice', () => {
  it('warns loudly under 24 hours and offers the one 14-day extension', async () => {
    const soon = Date.now() + 3.5 * 3600000;
    stub({ committed: false, earliestExpiry: soon, expiringWithin24h: 2, extensionsUsed: 0, extensionsLeft: 1, extensionDays: 14 },
      { committed: false, earliestExpiry: Date.now() + 14 * 86400000, expiringWithin24h: 0, extensionsUsed: 1, extensionsLeft: 0, extensionDays: 14 });
    render(<FileRetentionNotice collectionId="c" />);
    expect(await screen.findByText(/will be deleted in 3 hours/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Keep my files 14 more days' }));
    expect(await screen.findByText(/kept for another 14 days/)).toBeTruthy();
    expect(screen.getByText(/used this collection's one extension/)).toBeTruthy();
  });

  it('tells deployed collections their files are kept until minted', async () => {
    stub({ committed: true, earliestExpiry: null, expiringWithin24h: 0, extensionsUsed: 0, extensionsLeft: 0, extensionDays: 14 });
    render(<FileRetentionNotice collectionId="c" />);
    expect(await screen.findByText(/kept until they are minted/)).toBeTruthy();
  });
});
