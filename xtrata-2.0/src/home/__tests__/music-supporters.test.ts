// @vitest-environment happy-dom
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {readFileSync} from 'node:fs';
import {
  formatAgo, formatCount, formatStx, initMusicSupporters, nextMilestone, parseStats, shortAddress, stopMusicSupporters
} from '../music-supporters.js';

// Use the real homepage markup so a renamed hook in index.html fails here.
const html = readFileSync('index.html', 'utf8');
const banner = /<a class="home-supbar[\s\S]*?<\/a>/.exec(html)![0];
const hero = /<section class="home-panel home-sup[\s\S]*?<\/section>/.exec(html)![0];

const hex = (n: number) => '0x' + n.toString(16).padStart(64, '0');
const payload = (over: Record<string, unknown> = {}) => ({
  version: 1, supporters: 312, plays: 4674, microStx: 233700, complete: true, checkedAt: Date.now() - 14_000, contract: 'c',
  latest: [
    {txid: hex(3), song: 3088, core: 3, payer: 'SPX4KR3G5Z1SZT4RVF4ATHV4ZP4KXPWSZ4424W6K', recipient: 'SP1', at: Date.now() - 30_000},
    {txid: hex(2), song: 877, core: 3, payer: 'SP1ABCDEFGHJKLMNPQRSTUVWXYZ0123456', recipient: 'SP1', at: null},
    {txid: hex(1), song: 1310, core: 3, payer: 'SP3RK7HD', recipient: 'SP1', at: Date.now() - 400_000}
  ], ...over
});
const reply = (body: unknown, status = 200) => vi.fn(async () => new Response(JSON.stringify(body), {status}));
const text = (selector: string) => document.querySelector(selector)?.textContent?.replace(/\s+/g, ' ').trim();
const settle = async () => { await vi.advanceTimersByTimeAsync(0); await vi.advanceTimersByTimeAsync(0); };

beforeEach(() => {
  document.body.innerHTML = banner + hero;
  localStorage.clear();
  vi.useFakeTimers();
});
afterEach(() => {
  stopMusicSupporters();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('formatting helpers', () => {
  it('formats counts, STX, addresses and ages', () => {
    expect(formatCount(48310)).toBe('48,310');
    expect(formatStx(233700)).toBe('0.233700');
    expect(formatStx(2_415_500)).toBe('2.415500');
    expect(formatStx(0)).toBe('0.000000');
    expect(shortAddress('SPX4KR3G5Z1SZT4RVF4ATHV4ZP4KXPWSZ4424W6K')).toBe('SPX4KR3…424W6K');
    expect(shortAddress('SP3RK7HD')).toBe('SP3RK7HD');
    expect(formatAgo(1000, 15_000)).toBe('14 s ago');
    expect(formatAgo(0, 15_000)).toBe('');
    expect(formatAgo(Date.now() - 6 * 60_000)).toBe('6 min ago');
  });
  it('steps milestones 100, 250, 500, 1,000, 2,500, 5,000 ...', () => {
    expect(nextMilestone(0)).toEqual({previous: 0, next: 100, percent: 0});
    expect(nextMilestone(4674)).toEqual({previous: 2500, next: 5000, percent: 87});
    expect(nextMilestone(5000)).toMatchObject({previous: 5000, next: 10000, percent: 0});
    expect(nextMilestone(48310)).toMatchObject({previous: 25000, next: 50000});
  });
  it('accepts a valid response and rejects anything malformed', () => {
    expect(parseStats(payload())).toMatchObject({plays: 4674, supporters: 312, complete: true});
    expect(parseStats(null)).toBeNull();
    expect(parseStats(payload({version: 2}))).toBeNull();
    expect(parseStats(payload({plays: -1}))).toBeNull();
    expect(parseStats(payload({supporters: '312'}))).toBeNull();
    expect(parseStats(payload({latest: [{txid: 'x', song: 1, payer: 'SP1'}]}))).toBeNull();
    expect(parseStats(payload({latest: [{txid: hex(1), song: 1, payer: '<img src=x onerror=1>'}]}))).toBeNull();
  });
});

describe('banner and hero', () => {
  it('shows placeholders, never zero, until the first read finishes', async () => {
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    initMusicSupporters();
    expect(document.getElementById('musicBanner')!.dataset.state).toBe('loading');
    expect(text('#musicBanner')).toContain('… paid plays from …');
    expect(text('#musicSupporters [data-sup="plays"]')).toBe('…');
    expect(document.querySelectorAll('.home-sup__rcpt.is-skel')).toHaveLength(3);
  });

  it('renders the same totals in the banner and the hero', async () => {
    vi.stubGlobal('fetch', reply(payload()));
    initMusicSupporters();
    await settle();
    expect(document.getElementById('musicBanner')!.dataset.state).toBe('live');
    expect(text('#musicBanner')).toContain('4,674 paid plays from 312 music supporters');
    expect(text('#musicSupporters [data-sup="plays"]')).toBe('4,674');
    expect(text('#musicSupporters [data-sup="supporters"]')).toBe('312');
    expect(text('#musicSupporters [data-sup="stx"]')).toBe('0.233700 STX');
    expect(text('#musicSupporters [data-sup="milestone-label"]')).toBe('Next milestone · 5,000 plays');
    expect(text('#musicSupporters [data-sup="milestone-left"]')).toBe('326 to go');
    expect((document.querySelector('[data-sup="bar"]') as HTMLElement).style.width).toBe('87%');
    expect(text('#musicSupporters [data-sup="status"]')).toMatch(/^Live · checked \d+ s ago$/);
  });

  it('lists the latest paid plays with verifiable links and no timestamp when unknown', async () => {
    vi.stubGlobal('fetch', reply(payload()));
    initMusicSupporters();
    await settle();
    const items = [...document.querySelectorAll('.home-sup__rcpt')];
    expect(items).toHaveLength(3);
    expect(items[0].textContent).toContain('Song #3088');
    expect(items[0].textContent).toContain('from SPX4KR3…424W6K · 0.000050 STX');
    expect(items[0].querySelector('a')!.getAttribute('href')).toBe(`https://explorer.hiro.so/txid/${hex(3)}?chain=mainnet`);
    expect(items[0].querySelector('a')!.getAttribute('rel')).toContain('noopener');
    expect(items[1].querySelector('.home-sup__age')).toBeNull();
    expect(items[2].querySelector('.home-sup__age')!.textContent).toMatch(/min ago$/);
  });

  it('says the history is still being counted instead of presenting partial totals as final', async () => {
    vi.stubGlobal('fetch', reply(payload({complete: false, plays: 800})));
    initMusicSupporters();
    await settle();
    expect(document.getElementById('musicSupporters')!.dataset.state).toBe('syncing');
    expect(text('#musicSupporters [data-sup="status"]')).toContain('Still counting the full history');
    expect(text('#musicBanner')).toContain('still counting');
  });

  it('treats "nothing counted yet" as warming up, never as zero', async () => {
    vi.stubGlobal('fetch', reply(payload({plays: 0, supporters: 0, microStx: 0, latest: [], complete: false, syncError: null})));
    initMusicSupporters();
    await settle();
    expect(document.getElementById('musicSupporters')!.dataset.state).toBe('warming');
    expect(document.getElementById('musicBanner')!.hidden).toBe(false);
    expect(text('#musicSupporters [data-sup="plays"]')).toBe('…');
    expect(text('#musicSupporters [data-sup="supporters"]')).toBe('…');
    expect(text('#musicBanner')).not.toMatch(/\b0 paid plays/);
    expect(text('#musicSupporters [data-sup="status"]')).toContain('first batch');
  });

  it('hides the banner when the server reports it cannot read the chain', async () => {
    vi.stubGlobal('fetch', reply(payload({plays: 0, supporters: 0, microStx: 0, latest: [], complete: false, syncError: 403})));
    initMusicSupporters();
    await settle();
    expect(document.getElementById('musicSupporters')!.dataset.state).toBe('unavailable');
    expect(document.getElementById('musicBanner')!.hidden).toBe(true);
    expect(text('#musicSupporters [data-sup="plays"]')).toBe('—');
  });

  it('keeps remembered totals when the server later reports nothing counted', async () => {
    vi.stubGlobal('fetch', reply(payload()));
    initMusicSupporters();
    await settle();
    stopMusicSupporters();
    document.body.innerHTML = banner + hero;
    vi.stubGlobal('fetch', reply(payload({plays: 0, supporters: 0, microStx: 0, latest: [], complete: false})));
    initMusicSupporters();
    await settle();
    expect(document.getElementById('musicBanner')!.dataset.state).toBe('stale');
    expect(text('#musicSupporters [data-sup="plays"]')).toBe('4,674');
  });

  it('hides the banner and shows a dash, not zero, when the totals cannot be read', async () => {
    vi.stubGlobal('fetch', reply({error: 'x'}, 503));
    initMusicSupporters();
    await settle();
    expect(document.getElementById('musicBanner')!.hidden).toBe(true);
    expect(document.getElementById('musicSupporters')!.dataset.state).toBe('unavailable');
    expect(text('#musicSupporters [data-sup="plays"]')).toBe('—');
    expect(text('#musicSupporters [data-sup="status"]')).toContain('unavailable');
  });

  it('keeps the last good totals, marked stale, when a later read fails', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(payload())))
      .mockRejectedValue(new Error('offline'));
    vi.stubGlobal('fetch', fetchMock);
    initMusicSupporters();
    await settle();
    await vi.advanceTimersByTimeAsync(30_000);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(document.getElementById('musicBanner')!.dataset.state).toBe('stale');
    expect(text('#musicSupporters [data-sup="plays"]')).toBe('4,674');
    expect(text('#musicBanner')).toContain('last updated');
    expect(text('#musicSupporters [data-sup="status"]')).toContain('Can’t reach the server');
  });

  it('shows remembered totals straight away on a return visit, then replaces them', async () => {
    vi.stubGlobal('fetch', reply(payload()));
    initMusicSupporters();
    await settle();
    stopMusicSupporters();
    document.body.innerHTML = banner + hero;
    vi.stubGlobal('fetch', vi.fn(() => new Promise(() => {})));
    initMusicSupporters();
    expect(document.getElementById('musicBanner')!.dataset.state).toBe('checking');
    expect(text('#musicSupporters [data-sup="plays"]')).toBe('4,674');
    expect(text('#musicSupporters [data-sup="status"]')).toBe('Checking the chain…');
  });

  it('polls every 30 seconds, highlights new plays and stops when the page leaves home', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(payload())))
      .mockResolvedValueOnce(new Response(JSON.stringify(payload({
        plays: 4676, supporters: 313, microStx: 233800,
        latest: [{txid: hex(5), song: 42, core: 3, payer: 'SP9NEWWALLET', recipient: 'SP1', at: Date.now()}, ...payload().latest.slice(0, 2)]
      }))))
      .mockResolvedValue(new Response(JSON.stringify(payload())));
    vi.stubGlobal('fetch', fetchMock);
    initMusicSupporters();
    await settle();
    await vi.advanceTimersByTimeAsync(30_000);
    expect(text('#musicSupporters [data-sup="plays"]')).toBe('4,676');
    expect(text('#musicBanner')).toContain('4,676 paid plays from 313');
    expect(document.querySelector('.home-sup__rcpt.is-new')!.textContent).toContain('Song #42');
    expect(document.querySelectorAll('.home-sup__rcpt.is-new')).toHaveLength(1);
    const calls = fetchMock.mock.calls.length;
    stopMusicSupporters();
    await vi.advanceTimersByTimeAsync(120_000);
    expect(fetchMock.mock.calls.length).toBe(calls);
  });

  it('asks again every few seconds while the server is still counting, then slows down', async () => {
    const counting = (plays: number, complete = false) => new Response(JSON.stringify(payload({plays, complete})));
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(counting(800))
      .mockResolvedValueOnce(counting(2400))
      .mockResolvedValueOnce(counting(4674, true))
      .mockImplementation(async () => counting(4674, true));
    vi.stubGlobal('fetch', fetchMock);
    initMusicSupporters();
    await settle();
    expect(text('#musicSupporters [data-sup="plays"]')).toBe('800');
    await vi.advanceTimersByTimeAsync(4_000);
    expect(text('#musicSupporters [data-sup="plays"]')).toBe('2,400');
    await vi.advanceTimersByTimeAsync(4_000);
    expect(text('#musicSupporters [data-sup="plays"]')).toBe('4,674');
    expect(document.getElementById('musicBanner')!.dataset.state).toBe('live');
    const calls = fetchMock.mock.calls.length;
    await vi.advanceTimersByTimeAsync(20_000);
    expect(fetchMock.mock.calls.length).toBe(calls); // complete: back to the 30 second rhythm
    await vi.advanceTimersByTimeAsync(10_000);
    expect(fetchMock.mock.calls.length).toBe(calls + 1);
  });

  it('does nothing on pages without the banner or hero', async () => {
    document.body.innerHTML = '<main></main>';
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    initMusicSupporters();
    await settle();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('homepage markup', () => {
  it('shows the banner and hero on the homepage only', () => {
    expect(banner).toContain('home-only');
    expect(hero).toContain('home-only');
    expect(banner).toContain('href="/music/heroes"');
  });
});
