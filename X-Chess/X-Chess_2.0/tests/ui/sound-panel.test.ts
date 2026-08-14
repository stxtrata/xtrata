// The switches, and the browser rule that makes them harder than they look.
//
// A browser will not make a sound until the page has been touched. The sound
// this whole module exists for - your opponent moved, it is your turn - arrives
// from the chain with nobody touching anything. So the unlocking, and the panel
// SAYING it is waiting to be unlocked, are as much of the feature as the sounds
// are, and both are held down here.
//
// The other thing under test is that the panel is generated from the voice
// table. A row written by hand is a row that gets forgotten when a sound is
// added, and then the sound exists with no way to turn it off.

import { JSDOM } from 'jsdom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { BLACK_TRANSPOSE, Sound, defaultState } from '../../packages/ui/audio.js';
import { renderSoundPanel, soundNote, soundToggleLabel } from '../../packages/ui/sound-panel.js';
import { EVENTS, SOUND_EVENTS, VOICES, VOICE_IDS } from '../../packages/ui/sounds.js';
import { FakeAudioContext, installFakeAudio } from './fake-audio.js';

let dom: JSDOM;
let latest: () => FakeAudioContext | null;

beforeEach(() => {
  dom = new JSDOM('<!doctype html><html><head></head><body><div id="list"></div></body></html>', {
    url: 'https://example.test/'
  });
  (globalThis as unknown as Record<string, unknown>).document = dom.window.document;
  latest = installFakeAudio(dom.window as unknown as Window);
  FakeAudioContext.built = 0;
  dom.window.localStorage.clear();
});

afterEach(() => {
  dom.window.close();
});

const list = (): HTMLElement => dom.window.document.getElementById('list') as HTMLElement;
const rows = (): HTMLElement[] => [...list().querySelectorAll('.snd')] as HTMLElement[];

/** A sound that has already been allowed to make a noise. */
function unlocked(): Sound {
  const sound = new Sound({ document: dom.window.document });
  sound.unlock();
  return sound;
}

describe('the settings', () => {
  it('starts with sound on, and listening in the background too', () => {
    // Background listening was off, on the argument that reading a tab nobody
    // is looking at spends somebody's rate limit. The proxy carries an API key
    // now, and correspondence chess is played in other tabs by definition - a
    // board that only tells you your opponent moved while you are staring at it
    // is telling you something you can already see. Off is one click away.
    const state = defaultState();
    expect(state.master).toBe(true);
    expect(state.background).toBe(true);
    expect(state.volume).toBeGreaterThan(0);
  });

  it('remembers what was set, across a whole new board', () => {
    const first = new Sound({ document: dom.window.document });
    first.setVolume(0.25);
    first.setBackground(true);
    first.setEvent('capture', { on: false });

    const second = new Sound({ document: dom.window.document });
    expect(second.state.volume).toBeCloseTo(0.25);
    expect(second.state.background).toBe(true);
    expect(second.state.events.capture.on).toBe(false);
    expect(second.state.events.move.on).toBe(true);
  });

  it('keeps its defaults when the stored settings are from another version', () => {
    // A stored blob is written by whatever build was running then. A later one
    // with a new sound in the table must not be broken by an older blob that
    // has never heard of it, and an older build must not choke on a newer one.
    dom.window.localStorage.setItem(
      'xchess.sound.v1',
      JSON.stringify({ master: false, volume: 0.3, events: { 'not-a-sound': { on: true } } })
    );
    const sound = new Sound({ document: dom.window.document });
    expect(sound.enabled).toBe(false);
    expect(sound.state.volume).toBeCloseTo(0.3);
    for (const name of SOUND_EVENTS) {
      expect(sound.state.events[name].on).toBe(EVENTS[name].on);
      expect(sound.state.events[name].voice).toBe(EVENTS[name].voice);
    }
  });

  it('survives a store that refuses to be written to', () => {
    // Private browsing throws on setItem. The board still has to play chess.
    Object.defineProperty(dom.window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('nope');
      }
    });
    const sound = new Sound({ document: dom.window.document });
    expect(() => sound.setMaster(false)).not.toThrow();
    expect(sound.enabled).toBe(false);
  });

  it('ignores a corrupt store rather than failing to start', () => {
    dom.window.localStorage.setItem('xchess.sound.v1', '{not json');
    const sound = new Sound({ document: dom.window.document });
    expect(sound.enabled).toBe(true);
  });
});

describe('making a sound', () => {
  it('builds one voice per layer in the table', () => {
    const sound = unlocked();
    const ctx = latest()!;
    ctx.forget();

    sound.play('your-turn');
    expect(ctx.voices).toBe(VOICES[EVENTS['your-turn'].voice].layers.length);
    // Every one is stopped. An oscillator left running is a tone that never
    // ends, and a long game would make thousands of them.
    for (const osc of ctx.oscillators) {
      expect(osc.started).not.toBeNull();
      expect(osc.stopped).not.toBeNull();
      expect(osc.stopped!).toBeGreaterThan(osc.started!);
    }
  });

  it('says nothing at all when the master switch is off', () => {
    const sound = unlocked();
    const ctx = latest()!;
    sound.setMaster(false);
    ctx.forget();

    for (const name of SOUND_EVENTS) sound.play(name);
    expect(ctx.voices).toBe(0);
  });

  it('says nothing for a sound whose own switch is off', () => {
    const sound = unlocked();
    const ctx = latest()!;
    sound.setEvent('capture', { on: false });
    ctx.forget();

    sound.play('capture');
    expect(ctx.voices).toBe(0);
    sound.play('move');
    expect(ctx.voices).toBeGreaterThan(0);
  });

  it('scales a sound by its own volume and the master together', () => {
    const sound = unlocked();
    const ctx = latest()!;

    sound.setVolume(1);
    sound.setEvent('move', { gain: 1 });
    ctx.forget();
    sound.play('move');
    const loud = Math.max(...ctx.gains.map((g) => g.gain.peak()));

    sound.setVolume(0.5);
    sound.setEvent('move', { gain: 0.5 });
    ctx.forget();
    sound.play('move');
    const quiet = Math.max(...ctx.gains.map((g) => g.gain.peak()));

    expect(quiet).toBeCloseTo(loud * 0.25, 5);
  });

  it('makes no sound at zero volume rather than an inaudible one', () => {
    const sound = unlocked();
    const ctx = latest()!;
    sound.setVolume(0);
    ctx.forget();
    sound.play('your-turn');
    expect(ctx.voices).toBe(0);
  });

  it('plays a preview even for a sound that is switched off, and leaves it off', () => {
    // So somebody can hear what they are turning on before turning it on.
    const sound = unlocked();
    const ctx = latest()!;
    sound.setEvent('select', { on: false });
    ctx.forget();

    sound.preview('select');
    expect(ctx.voices).toBeGreaterThan(0);
    expect(sound.state.events.select.on, 'previewing must not switch it on').toBe(false);
  });

  it('builds the noise buffer once, however many sounds are played', () => {
    const sound = unlocked();
    const ctx = latest()!;
    for (let i = 0; i < 20; i++) sound.play('move');
    expect(ctx.buffers).toBe(1);
  });

  it('does nothing at all in a browser with no Web Audio', () => {
    // Not hypothetical: this is every locked-down or very old browser, and the
    // board has to keep working in one.
    delete (dom.window as unknown as Record<string, unknown>).AudioContext;
    const sound = new Sound({ document: dom.window.document });
    expect(() => sound.play('your-turn')).not.toThrow();
    expect(sound.waitingForATap).toBe(true);
  });
});

describe('waiting for a tap', () => {
  it('says it is waiting until the page has been touched', () => {
    const sound = new Sound({ document: dom.window.document });
    sound.listen();
    expect(sound.waitingForATap).toBe(true);
    // The whole point of saying so: silence with no explanation reads as a
    // broken feature rather than a browser waiting for permission.
    expect(soundNote(sound)).toContain('touched the page');
  });

  it('takes the first tap anywhere on the page as permission', async () => {
    const sound = new Sound({ document: dom.window.document });
    sound.listen();

    dom.window.document.dispatchEvent(new dom.window.Event('pointerdown', { bubbles: true }));
    await Promise.resolve();

    expect(FakeAudioContext.built).toBe(1);
    expect(latest()!.state).toBe('running');
    expect(sound.waitingForATap).toBe(false);
    expect(soundNote(sound)).not.toContain('touched the page');
  });

  it('builds exactly one context however many times it is unlocked', () => {
    const sound = new Sound({ document: dom.window.document });
    sound.listen();
    for (let i = 0; i < 5; i++) {
      dom.window.document.dispatchEvent(new dom.window.Event('pointerdown', { bubbles: true }));
    }
    sound.unlock();
    expect(FakeAudioContext.built).toBe(1);
  });

  it('treats switching sound on as the interaction it is', () => {
    const sound = new Sound({ document: dom.window.document });
    sound.setMaster(false);
    expect(FakeAudioContext.built).toBe(0);
    sound.setMaster(true);
    expect(FakeAudioContext.built).toBe(1);
  });
});

describe('the panel', () => {
  it('draws a row for every sound in the library, and no others', () => {
    // Generated, so a sound added to the table arrives with its switch, its
    // slider and its preview already attached. A hand-written list is a list
    // that gets forgotten, and then a sound exists with no way to silence it.
    const sound = new Sound({ document: dom.window.document });
    renderSoundPanel(list(), sound);
    expect(rows()).toHaveLength(SOUND_EVENTS.length);

    const labels = rows().map((row) => row.querySelector('.snd-name')?.textContent?.trim());
    for (const name of SOUND_EVENTS) expect(labels).toContain(EVENTS[name].label);
  });

  it('explains what each sound means, under the row', () => {
    const sound = new Sound({ document: dom.window.document });
    renderSoundPanel(list(), sound);
    const said = rows().map((row) => row.querySelector('.snd-say')?.textContent ?? '');
    for (const name of SOUND_EVENTS) expect(said).toContain(EVENTS[name].say);
  });

  it('turns a sound off from its own switch', () => {
    const sound = new Sound({ document: dom.window.document });
    renderSoundPanel(list(), sound);

    const row = rows()[SOUND_EVENTS.indexOf('capture')];
    const box = row.querySelector('input[type=checkbox]') as HTMLInputElement;
    expect(box.checked).toBe(true);
    box.checked = false;
    box.dispatchEvent(new dom.window.Event('change'));

    expect(sound.state.events.capture.on).toBe(false);
    // And it survives a reload, which is the point of a switch.
    expect(new Sound({ document: dom.window.document }).state.events.capture.on).toBe(false);
  });

  it('sets one sound volume without touching the others', () => {
    const sound = new Sound({ document: dom.window.document });
    renderSoundPanel(list(), sound);

    const row = rows()[SOUND_EVENTS.indexOf('your-turn')];
    const slider = row.querySelector('input[type=range]') as HTMLInputElement;
    slider.value = '40';
    slider.dispatchEvent(new dom.window.Event('input'));

    expect(sound.state.events['your-turn'].gain).toBeCloseTo(0.4);
    expect(sound.state.events.move.gain).toBeCloseTo(1);
  });

  it('previews a sound from its own button', () => {
    const sound = unlocked();
    const ctx = latest()!;
    renderSoundPanel(list(), sound);
    ctx.forget();

    const row = rows()[SOUND_EVENTS.indexOf('check')];
    (row.querySelector('.snd-test') as HTMLButtonElement).click();
    expect(ctx.voices).toBe(VOICES[EVENTS.check.voice].layers.length);
  });

  it('dims the rows when the master is off, and keeps them', () => {
    // A panel that empties itself says the feature went away rather than that
    // it is switched off.
    const sound = new Sound({ document: dom.window.document });
    const panel = renderSoundPanel(list(), sound);
    sound.setMaster(false);
    panel.refresh();

    expect(rows()).toHaveLength(SOUND_EVENTS.length);
    expect(list().classList.contains('snd-list--off')).toBe(true);
    for (const row of rows()) {
      expect((row.querySelector('input[type=checkbox]') as HTMLInputElement).disabled).toBe(true);
    }
    expect(soundToggleLabel(sound)).toBe('Sound off');
  });

  it('puts everything back with one reset', () => {
    const sound = new Sound({ document: dom.window.document });
    const panel = renderSoundPanel(list(), sound);
    sound.setEvent('your-turn', { on: false, gain: 0.1 });
    sound.setVolume(0.05);

    sound.reset();
    panel.refresh();

    expect(sound.state.events['your-turn'].on).toBe(true);
    expect(sound.state.events['your-turn'].gain).toBe(1);
    expect(sound.state.volume).toBe(defaultState().volume);
    const row = rows()[SOUND_EVENTS.indexOf('your-turn')];
    expect((row.querySelector('input[type=checkbox]') as HTMLInputElement).checked).toBe(true);
  });

  it('offers the whole library on every event', () => {
    // The upgrade, in one assertion. Every row can reach every sound, so there
    // is no event with a shorter menu than any other.
    const sound = new Sound({ document: dom.window.document });
    renderSoundPanel(list(), sound);

    for (const row of rows()) {
      const pick = row.querySelector('.snd-pick') as HTMLSelectElement;
      const offered = [...pick.querySelectorAll('option')].map((o) => o.value);
      expect(offered.sort()).toEqual([...VOICE_IDS].sort());
    }
  });

  it('groups the library so the list can be read', () => {
    const sound = new Sound({ document: dom.window.document });
    renderSoundPanel(list(), sound);
    const pick = rows()[0].querySelector('.snd-pick') as HTMLSelectElement;
    const groups = [...pick.querySelectorAll('optgroup')].map((g) => g.label);
    expect(groups.length).toBeGreaterThan(1);
    // Every option lives under a heading rather than loose at the top.
    expect(pick.querySelectorAll(':scope > option')).toHaveLength(0);
  });

  it('shows each event set to the sound it will actually play', () => {
    const sound = new Sound({ document: dom.window.document });
    renderSoundPanel(list(), sound);
    for (const [i, name] of SOUND_EVENTS.entries()) {
      const pick = rows()[i].querySelector('.snd-pick') as HTMLSelectElement;
      expect(pick.value, `${name} shows the wrong sound`).toBe(sound.voiceFor(name));
    }
  });

  it('puts any sound on any event, and plays what was chosen', () => {
    const sound = unlocked();
    const ctx = latest()!;
    renderSoundPanel(list(), sound);

    const row = rows()[SOUND_EVENTS.indexOf('your-turn')];
    const pick = row.querySelector('.snd-pick') as HTMLSelectElement;
    pick.value = 'clunk';
    pick.dispatchEvent(new dom.window.Event('change'));

    expect(sound.voiceFor('your-turn')).toBe('clunk');
    ctx.forget();
    sound.play('your-turn');
    // The layer count is the fingerprint: it is the assigned voice being built,
    // not the one the table shipped with.
    expect(ctx.voices).toBe(VOICES.clunk.layers.length);
    expect(ctx.voices).not.toBe(VOICES[EVENTS['your-turn'].voice].layers.length);
  });

  it('lets one sound sit on several events at once', () => {
    // Nothing claims a voice. Somebody who wants one bell for everything is
    // allowed to have exactly that.
    const sound = new Sound({ document: dom.window.document });
    for (const name of SOUND_EVENTS) sound.setEvent(name, { voice: 'bell' });
    for (const name of SOUND_EVENTS) expect(sound.voiceFor(name)).toBe('bell');
  });

  it('plays the sound the moment it is picked, without a second click', () => {
    // Choosing from a list of names and then hunting for a button to hear it is
    // how somebody ends up assigning by guesswork.
    const sound = unlocked();
    const ctx = latest()!;
    renderSoundPanel(list(), sound);
    ctx.forget();

    const pick = rows()[0].querySelector('.snd-pick') as HTMLSelectElement;
    pick.value = 'rasp';
    pick.dispatchEvent(new dom.window.Event('change'));
    expect(ctx.voices).toBe(VOICES.rasp.layers.length);
  });

  it('auditions a sound even when the event it lands on is muted', () => {
    // The question being asked is what this one sounds like. Answering through
    // a muted event would answer with silence.
    const sound = unlocked();
    const ctx = latest()!;
    sound.setEvent('capture', { on: false, gain: 0 });
    ctx.forget();

    sound.audition('bell');
    expect(ctx.voices).toBe(VOICES.bell.layers.length);
  });

  it('remembers an assignment across a whole new board', () => {
    const first = new Sound({ document: dom.window.document });
    first.setEvent('move', { voice: 'ping' });
    expect(new Sound({ document: dom.window.document }).voiceFor('move')).toBe('ping');
  });

  it('refuses a sound name that is not in the library', () => {
    // From a hand-edited store, or from a build that had a voice this one does
    // not. Taking it would leave the event pointing at nothing, which is
    // silence that no control on the panel could explain or undo.
    const sound = new Sound({ document: dom.window.document });
    sound.setEvent('move', { voice: 'harpsichord' as never });
    expect(sound.voiceFor('move')).toBe(EVENTS.move.voice);

    dom.window.localStorage.setItem(
      'xchess.sound.v1',
      JSON.stringify({ events: { move: { voice: 'harpsichord' } } })
    );
    expect(new Sound({ document: dom.window.document }).voiceFor('move')).toBe(EVENTS.move.voice);
  });

  it('puts the assignments back with the same reset', () => {
    const sound = new Sound({ document: dom.window.document });
    const panel = renderSoundPanel(list(), sound);
    sound.setEvent('your-turn', { voice: 'thud' });
    sound.reset();
    panel.refresh();

    expect(sound.voiceFor('your-turn')).toBe(EVENTS['your-turn'].voice);
    const pick = rows()[SOUND_EVENTS.indexOf('your-turn')].querySelector(
      '.snd-pick'
    ) as HTMLSelectElement;
    expect(pick.value).toBe(EVENTS['your-turn'].voice);
  });

  it('leaves both sides alone until the sides switch is on', () => {
    const sound = unlocked();
    const ctx = latest()!;

    ctx.forget();
    sound.play('move', 'white');
    const white = ctx.oscillators.map((o) => o.frequency.value);
    ctx.forget();
    sound.play('move', 'black');
    const black = ctx.oscillators.map((o) => o.frequency.value);

    expect(black).toEqual(white);
  });

  it('pitches Black below White once it is on, and by a musical interval', () => {
    // The point is following a game by ear. Two sides that differ by an amount
    // nobody can hear would be a setting that does nothing.
    const sound = unlocked();
    const ctx = latest()!;
    sound.setSides(true);

    ctx.forget();
    sound.play('move', 'white');
    const white = ctx.oscillators.map((o) => o.frequency.value);
    ctx.forget();
    sound.play('move', 'black');
    const black = ctx.oscillators.map((o) => o.frequency.value);

    expect(black).toHaveLength(white.length);
    for (const [i, hz] of black.entries()) {
      expect(hz).toBeCloseTo(white[i] * BLACK_TRANSPOSE, 4);
      expect(hz, 'Black must be lower, not merely different').toBeLessThan(white[i]);
    }
    // A major third. Far enough to hear at a glance, close enough to stay music.
    expect(BLACK_TRANSPOSE).toBeCloseTo(2 ** (-4 / 12), 6);
  });

  it('moves every layer of a voice together, noise included', () => {
    // One multiplier does the whole job because a voice is described in Hz
    // throughout. Moving the tones and leaving the noise band behind is what
    // would turn a transposed knock into a different, broken sound.
    const sound = unlocked();
    const ctx = latest()!;
    sound.setSides(true);
    sound.setEvent('capture', { voice: 'thump' });

    ctx.forget();
    sound.play('capture', 'black');
    // Thump is noise plus two tones; the sources are made for every layer.
    expect(ctx.voices).toBe(VOICES.thump.layers.length);
    const tones = ctx.oscillators.map((o) => o.frequency.value).sort((a, b) => a - b);
    const expected = VOICES.thump.layers
      .filter((l) => l.wave !== 'noise')
      .map((l) => l.from * BLACK_TRANSPOSE)
      .sort((a, b) => a - b);
    for (const [i, hz] of tones.entries()) expect(hz).toBeCloseTo(expected[i], 4);
  });

  it('gives no colour to a sound no side caused', () => {
    // Picking a piece up was nobody's move. Colouring it would be inventing an
    // actor, and on a local sound there is not one.
    const sound = unlocked();
    const ctx = latest()!;
    sound.setSides(true);
    sound.setEvent('select', { on: true });

    ctx.forget();
    sound.play('select', null);
    const loose = ctx.oscillators.map((o) => o.frequency.value);
    ctx.forget();
    sound.play('select', 'white');
    expect(loose).toEqual(ctx.oscillators.map((o) => o.frequency.value));
  });

  it('remembers the sides switch, and puts it back on reset', () => {
    const first = new Sound({ document: dom.window.document });
    first.setSides(true);
    expect(new Sound({ document: dom.window.document }).state.sides).toBe(true);
    first.reset();
    expect(first.state.sides).toBe(false);
  });

  it('gives the two new events their own rows and pickers', () => {
    // They are events like any other: assignable, switchable, adjustable.
    const sound = new Sound({ document: dom.window.document });
    renderSoundPanel(list(), sound);
    for (const name of ['decided', 'draw-offered'] as const) {
      const row = rows()[SOUND_EVENTS.indexOf(name)];
      expect(row, `${name} has no row`).toBeTruthy();
      expect(row.querySelector('.snd-name')?.textContent?.trim()).toBe(EVENTS[name].label);
      const pick = row.querySelector('.snd-pick') as HTMLSelectElement;
      expect(pick.value).toBe(EVENTS[name].voice);
      expect([...pick.querySelectorAll('option')]).toHaveLength(VOICE_IDS.length);
    }
  });

  it('says what background listening will and will not do', () => {
    const sound = unlocked();
    expect(soundNote(sound)).toContain('background');
    sound.setBackground(true);
    // Honest about the limit rather than quiet about it: browsers throttle a
    // background tab, so a turn can arrive late.
    expect(soundNote(sound)).toContain('late');
  });
});
