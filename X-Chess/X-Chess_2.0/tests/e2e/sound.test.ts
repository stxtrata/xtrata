// The sound, on a real board, including the case it was asked for.
//
// A chess game on a chain has minutes between moves, so the moment that matters
// is the one where somebody is NOT looking at the page: the opponent's move
// confirms, and the only thing that can reach them is a noise and the tab's
// title. That is what these hold down - not that a function returns a string,
// but that a board left alone in a background tab still says something when its
// turn arrives.
//
// The other half is the cost. Reading a tab nobody is looking at spends a
// public endpoint's allowance, so it happens only when it was asked for, only
// while there is a live game, and at a slower rate. All three are tested,
// because each one is a reason the spending is defensible.

import { JSDOM } from 'jsdom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChessApp } from '../../packages/ui/app.js';
import { mountShell, resetForTests } from '../../packages/ui/boot.js';
import { MockChain } from '../../packages/chain/mock.js';
import { Sound } from '../../packages/ui/audio.js';
import { rulesHash } from '../../packages/protocol/canonical.js';
import { DEFAULT_RULES, normaliseRules } from '../../packages/protocol/rules.js';
import { installFakeAudio } from '../ui/fake-audio.js';
import type { SoundEvent } from '../../packages/ui/sounds.js';

const ALICE = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const BOB = 'SP1CVH5EWQPTH2J7CWZ7JBHEJPDHA0G4C4QKXFF6W';
const RULES = normaliseRules({ ...DEFAULT_RULES, white: ALICE, black: BOB });

/** A Sound that still makes its nodes, and remembers what it was asked for. */
class Recording extends Sound {
  readonly heard: SoundEvent[] = [];
  override play(event: SoundEvent): void {
    this.heard.push(event);
    super.play(event);
  }
  forget(): void {
    this.heard.length = 0;
  }
}

let dom: JSDOM;
let hidden = false;

beforeEach(() => {
  resetForTests();
  hidden = false;
  // Every test here is about what a board does over minutes of a chain, so the
  // clock is driven rather than waited on. Installed before anything schedules
  // a poll, because a timer set on the real clock would never be advanced.
  vi.useFakeTimers();
  dom = new JSDOM('<!doctype html><html><head><title>X Chess</title></head><body></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
  installFakeAudio(dom.window as unknown as Window);
  // jsdom reports a document nothing can hide. The whole point here is the tab
  // that is NOT in front, so the property is made answerable.
  Object.defineProperty(dom.window.document, 'visibilityState', {
    configurable: true,
    get: () => (hidden ? 'hidden' : 'visible')
  });
  dom.window.localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
  dom.window.close();
});

const tick = async (ms = 10): Promise<void> => {
  await vi.advanceTimersByTimeAsync(ms);
};

/** A board loaded on game 1, connected as `me`, with a recording ear. */
async function board(me: string): Promise<{ app: ChessApp; chain: MockChain; sound: Recording }> {
  const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
  chain.as(ALICE);
  await chain.openGame(rulesHash(RULES), false);

  mountShell(dom.window.document);
  const sound = new Recording({ document: dom.window.document });
  sound.unlock();

  const app = new ChessApp({
    chain,
    document: dom.window.document,
    sound,
    build: { network: 'devnet', contract: chain.contractId },
    connect: async () => ({ address: me })
  });
  (dom.window.document.getElementById('connect') as HTMLButtonElement).click();
  await tick(30);
  await app.load(1);
  await tick(30);
  sound.forget();
  return { app, chain, sound };
}

/** Play a move as somebody, straight onto the chain, behind the board's back. */
async function movedOnChain(chain: MockChain, who: string, uci: string): Promise<void> {
  chain.as(who);
  await chain.submit(1, uci);
}

describe('a board that is being watched', () => {
  it('says nothing at all for the game it just opened', async () => {
    // Opening a forty move game replays forty moves. Announcing them would be
    // forty noises for the act of opening a page.
    const chain = new MockChain({ balances: { [ALICE]: 100_000_000n, [BOB]: 100_000_000n } });
    chain.as(ALICE);
    await chain.openGame(rulesHash(RULES), false);
    for (const [who, uci] of [[ALICE, 'e2e4'], [BOB, 'e7e5'], [ALICE, 'g1f3']] as const) {
      await movedOnChain(chain, who, uci);
    }

    mountShell(dom.window.document);
    const sound = new Recording({ document: dom.window.document });
    const app = new ChessApp({
      chain,
      document: dom.window.document,
      sound,
      connect: async () => ({ address: BOB })
    });
    await app.load(1);
    await tick(30);

    expect(sound.heard).toEqual([]);
    app.stopPolling();
  });

  it('announces the turn when the opponent move confirms', async () => {
    const { app, chain, sound } = await board(BOB);

    await movedOnChain(chain, ALICE, 'e2e4');
    await app.readNow();

    expect(sound.heard).toEqual(['your-turn']);
    app.stopPolling();
  });

  it('tells the mover it moved, not that it is their turn', async () => {
    const { app, chain, sound } = await board(ALICE);

    await movedOnChain(chain, ALICE, 'e2e4');
    await app.readNow();

    expect(sound.heard).toEqual(['move']);
    app.stopPolling();
  });

  it('plays one sound for a read that brings back two moves', async () => {
    const { app, chain, sound } = await board(BOB);

    await movedOnChain(chain, ALICE, 'e2e4');
    await movedOnChain(chain, BOB, 'e7e5');
    await movedOnChain(chain, ALICE, 'g1f3');
    await app.readNow();

    expect(sound.heard).toHaveLength(1);
    expect(sound.heard[0]).toBe('your-turn');
    app.stopPolling();
  });

  it('makes no noise for a read that changed nothing', async () => {
    const { app, sound } = await board(BOB);
    await app.readNow();
    await app.readNow();
    expect(sound.heard).toEqual([]);
    app.stopPolling();
  });

  it('respects the master switch on a real move', async () => {
    const { app, chain, sound } = await board(BOB);
    sound.setMaster(false);
    sound.forget();

    await movedOnChain(chain, ALICE, 'e2e4');
    await app.readNow();

    // The board still SAYS what happened - it simply does not play it.
    expect(sound.heard).toEqual(['your-turn']);
    expect(dom.window.document.getElementById('sound-toggle')?.textContent).toBe('Sound off');
    app.stopPolling();
  });
});

describe('a board in a background tab', () => {
  it('does not read a hidden tab when it has been switched off', async () => {
    // Background listening DEFAULTS ON now, so this test says what it always
    // meant to: the switch works. Turning it off must stop the reads dead, or
    // the setting is decoration and somebody who asked for quiet does not get
    // it. The default is asserted in tests/ui/sound-panel.test.ts.
    const { app, chain, sound } = await board(BOB);
    sound.setBackground(false);
    hidden = true;

    let reads = 0;
    const original = chain.getAllEntries.bind(chain);
    chain.getAllEntries = ((game: number) => {
      reads += 1;
      return original(game);
    }) as typeof chain.getAllEntries;

    await movedOnChain(chain, ALICE, 'e2e4');
    reads = 0;
    // Long enough for several of any polling rate this board uses.
    await vi.advanceTimersByTimeAsync(90_000);

    expect(reads, 'a hidden tab must not read on its own').toBe(0);
    expect(sound.heard).toEqual([]);
    app.stopPolling();
  });

  it('keeps reading, and announces the turn, when it was asked to', async () => {
    // The case this was built for: the tab is behind something else, and the
    // opponent's move confirms.
    const { app, chain, sound } = await board(BOB);
    sound.setBackground(true);
    hidden = true;

    await movedOnChain(chain, ALICE, 'e2e4');
    await vi.advanceTimersByTimeAsync(90_000);

    expect(sound.heard).toContain('your-turn');
    app.stopPolling();
  });

  it('puts the turn in the title as well, and takes it out when it is seen', async () => {
    // The half that survives a browser throttling the audio, or a muted tab.
    const { app, chain, sound } = await board(BOB);
    sound.setBackground(true);
    hidden = true;

    await movedOnChain(chain, ALICE, 'e2e4');
    await vi.advanceTimersByTimeAsync(90_000);
    expect(dom.window.document.title).toContain('your turn');

    hidden = false;
    dom.window.document.dispatchEvent(new dom.window.Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(50);

    expect(dom.window.document.title).toBe('X Chess');
    app.stopPolling();
  });

  it('reads a hidden tab more slowly than one in front', async () => {
    // The whole cost of this feature is somebody else's rate limit, so a
    // background board must never read at the rate a watched one does.
    const { app, chain, sound } = await board(BOB);
    sound.setBackground(true);

    let reads = 0;
    const original = chain.getAllEntries.bind(chain);
    chain.getAllEntries = ((game: number) => {
      reads += 1;
      return original(game);
    }) as typeof chain.getAllEntries;

    hidden = false;
    await vi.advanceTimersByTimeAsync(60_000);
    const watched = reads;

    reads = 0;
    hidden = true;
    await vi.advanceTimersByTimeAsync(60_000);
    const background = reads;

    expect(background).toBeGreaterThan(0);
    expect(background, `${background} background reads vs ${watched} watched`).toBeLessThan(watched);
    app.stopPolling();
  });

  it('stops reading a hidden tab once the game is over', async () => {
    // Nothing can happen and nothing needs announcing, so the spending stops.
    const { app, chain, sound } = await board(BOB);
    sound.setBackground(true);

    for (const [who, uci] of [
      [ALICE, 'f2f3'],
      [BOB, 'e7e5'],
      [ALICE, 'g2g4'],
      [BOB, 'd8h4']
    ] as const) {
      await movedOnChain(chain, who, uci);
    }
    await app.readNow();
    expect(app.replayState?.status).toBe('over');

    let reads = 0;
    const original = chain.getAllEntries.bind(chain);
    chain.getAllEntries = ((game: number) => {
      reads += 1;
      return original(game);
    }) as typeof chain.getAllEntries;

    hidden = true;
    await vi.advanceTimersByTimeAsync(90_000);

    expect(reads).toBe(0);
    app.stopPolling();
  });
});
