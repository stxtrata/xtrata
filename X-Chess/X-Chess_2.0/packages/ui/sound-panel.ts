// The controls, generated from both tables.
//
// One row per event, and in each row a picker holding the whole library. Adding
// an event adds its row; adding a voice adds an option to every picker at once.
// Neither list is written by hand, so neither can fall behind the tables that
// define them - the same argument as the piece sizing CSS.
//
// Built with document methods and never with innerHTML. Every label in here
// comes from a table, and the day somebody puts an apostrophe or a bracket in
// one of those strings is not the day the sound panel should break.

import { EVENTS, SOUND_EVENTS, VOICES, voicesByFamily } from './sounds.js';
import type { Sound } from './audio.js';
import type { SoundEvent, VoiceId } from './sounds.js';

export interface SoundPanel {
  /** Bring the controls back in line with the settings, without rebuilding. */
  refresh(): void;
}

const pct = (value: number): string => String(Math.round(value * 100));

/**
 * The library, as a set of options, grouped by family.
 *
 * Two dozen names in one flat list is a list nobody reads past the first five.
 * The groups say what a voice sounds LIKE rather than what it might be for,
 * because what it is for is exactly the decision being handed over.
 */
function fillPicker(select: HTMLSelectElement): void {
  for (const group of voicesByFamily()) {
    if (!group.voices.length) continue;
    const optgroup = document.createElement('optgroup');
    optgroup.label = group.family;
    for (const id of group.voices) {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = VOICES[id].label;
      optgroup.appendChild(option);
    }
    select.appendChild(optgroup);
  }
}

/**
 * Draw the per-event rows into a container.
 *
 * Returns a refresh rather than redrawing on every change, and that is not an
 * optimisation. Rebuilding the rows while somebody is dragging a slider
 * replaces the element under their finger, which ends the drag - so the volume
 * control would work only for people who click rather than drag.
 */
export function renderSoundPanel(root: HTMLElement, sound: Sound): SoundPanel {
  root.replaceChildren();

  const controls: {
    event: SoundEvent;
    on: HTMLInputElement;
    pick: HTMLSelectElement;
    gain: HTMLInputElement;
  }[] = [];

  for (const event of SOUND_EVENTS) {
    const spec = EVENTS[event];
    const setting = sound.state.events[event];

    const row = document.createElement('div');
    row.className = 'snd';

    const name = document.createElement('label');
    name.className = 'snd-name';

    const on = document.createElement('input');
    on.type = 'checkbox';
    on.checked = setting.on;
    on.addEventListener('change', () => sound.setEvent(event, { on: on.checked }));
    name.appendChild(on);
    name.appendChild(document.createTextNode(` ${spec.label}`));

    const pick = document.createElement('select');
    pick.className = 'snd-pick';
    fillPicker(pick);
    pick.value = setting.voice;
    pick.setAttribute('aria-label', `Sound for ${spec.label}`);
    pick.addEventListener('change', () => {
      sound.setEvent(event, { voice: pick.value as VoiceId });
      // Played the moment it is chosen. Picking a sound from a list of names
      // and then having to find a separate button to hear it is how somebody
      // ends up assigning by guesswork.
      sound.audition(pick.value as VoiceId);
    });

    const gain = document.createElement('input');
    gain.type = 'range';
    gain.className = 'snd-gain';
    gain.min = '0';
    gain.max = '100';
    gain.step = '5';
    gain.value = pct(setting.gain);
    // Named for a screen reader, which cannot see the row this sits in.
    gain.setAttribute('aria-label', `${spec.label} volume`);
    gain.addEventListener('input', () => sound.setEvent(event, { gain: Number(gain.value) / 100 }));

    const test = document.createElement('button');
    test.type = 'button';
    test.className = 'action snd-test';
    test.textContent = 'Play';
    // Previewing plays the sound even when the event is switched off, so
    // somebody can hear what they are turning on before they turn it on. It
    // doubles as the gesture that unlocks the audio context.
    test.setAttribute('aria-label', `Play the sound assigned to ${spec.label}`);
    test.addEventListener('click', () => sound.preview(event));

    const say = document.createElement('div');
    say.className = 'snd-say small muted';
    say.textContent = spec.say;

    row.append(name, pick, gain, test, say);
    root.appendChild(row);
    controls.push({ event, on, pick, gain });
  }

  const refresh = (): void => {
    const live = sound.enabled;
    for (const control of controls) {
      const setting = sound.state.events[control.event];
      control.on.checked = setting.on;
      // Not hidden when the master is off. A greyed row still says what the set
      // contains and what would happen if it were switched back on; a vanished
      // one says the feature is gone.
      control.on.disabled = !live;
      control.pick.disabled = !live;
      control.pick.value = setting.voice;
      control.gain.disabled = !live || !setting.on;
      if (document.activeElement !== control.gain) control.gain.value = pct(setting.gain);
    }
    root.classList.toggle('snd-list--off', !live);
  };

  refresh();
  return { refresh };
}

/** What the master button in the top bar should say right now. */
export function soundToggleLabel(sound: Sound): string {
  return sound.enabled ? 'Sound on' : 'Sound off';
}

/**
 * The one line under the panel's master row.
 *
 * Four states, and the second is the reason this function exists. A browser
 * that has not been touched yet will not make a sound, and a person looking at
 * a panel that says everything is switched on has no way to know that. Silence
 * with no explanation reads as a broken feature.
 */
export function soundNote(sound: Sound): string {
  if (!sound.enabled) return 'Sound is off. Nothing on this board will make a noise.';
  if (sound.waitingForATap) {
    return 'Your browser will not play a sound until you have touched the page. ' +
      'Press Play on any row below, or make a move, and it will start working.';
  }
  const assign = `Any of the ${Object.keys(VOICES).length} sounds can go on any event. ` +
    'Pick one and it plays straight away.';
  if (sound.background) {
    return `${assign} This board keeps reading the chain while the tab is in the background, so ` +
      'you will hear your turn while you are doing something else. Browsers slow background tabs ' +
      'down, so it can be a little late; it will not be missed.';
  }
  return `${assign} Sounds play while this tab is in front. Turn on background listening to hear ` +
    'your turn while you are looking at something else.';
}
