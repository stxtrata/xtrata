import { store, stepVal, MAX_SEQUENCES } from './state.js';
import { applyEditorPlaybackRange } from './editor-playback-range.js';
import { engine } from './engine.js';
import { createTrackControls, refreshTrackControls, openStepEditor } from './ui.js';
import { readGroups, toggleGroup } from './mobile-track-groups.js';
import { createTrackBank } from './mobile-track-bank.js';
import { openExpandedKeyboard } from './expanded-keyboard.js';
import { editGroups } from './mobile-group-editor.js';
import { setMidiTarget } from './midi-input.js';
import { el, action, field } from './pro-ui.js';
import { startLesson, endMobileLesson } from './pro-guide.js';

export function mount(host) {
  host.classList.add('mobile-editor');
  let trackId = store.project.channels.find((c) => c.source)?.id,
    bar = 0,
    accent = false,
    edit = false;
  let following = true,
    scope = null,
    pendingRange = null;
  const followKey = 'audionaut.beta-pro.mobile.follow';
  try {
    following = localStorage.getItem(followKey) !== 'off';
  } catch {}
  function setFollowing(value) {
    following = value;
    try {
      localStorage.setItem(followKey, value ? 'on' : 'off');
    } catch {}
  }
  const timeline = () => store.project.timeline;
  const patternClips = () =>
    timeline().clips.filter((c) => !c.muted && c.type === 'pattern' && c.trackId === trackId);
  function editRange(wholeSequence = false) {
    const offset = wholeSequence ? 0 : bar * 4,
      length = wholeSequence ? 16 : 4;
    const start = store.project.currentSequence * 16 + offset;
    if (!timeline().enabled) return { start, end: start + length };
    const beat = engine.getMusicalPosition().beat;
    return patternClips()
      .filter((c) => c.sequenceId === store.seq.id)
      .map((c) => ({
        start: Math.max(c.start, c.start + offset - c.offset),
        end: Math.min(c.start + c.duration, c.start + offset + length - c.offset)
      }))
      .filter((r) => r.start < r.end)
      .sort(
        (a, b) =>
          Math.max(a.start - beat, beat - a.end, 0) - Math.max(b.start - beat, beat - b.end, 0)
      )[0];
  }
  const transport = {
    applyPendingRange(now) {
      if (pendingRange) applyEditorPlaybackRange(engine, pendingRange, now);
      pendingRange = null;
    },
    startBeat: () => scope?.start ?? editRange()?.start,
    loop: (songEnd) =>
      scope?.kind === 'song'
        ? { enabled: true, start: 0, end: songEnd }
        : scope && { enabled: true, start: scope.start, end: scope.end }
  };
  engine.editorTransport = transport;
  function browse() {
    if (engine.isPlaying) setFollowing(false);
  }
  const channel = () => store.project.channels.findIndex((c) => c.id === trackId);
  const instrument = () => store.project.instruments.findIndex((c) => c.id === trackId);
  const sequence = el('select'),
    track = el('select', null, { id: 'mobile-track' });
  const bars = el('div', null, {
    className: 'mobile-bars',
    role: 'group',
    'aria-label': 'Bar to edit'
  });
  const pads = el('div', null, {
    className: 'mobile-pads',
    role: 'group',
    'aria-label': 'Sixteen steps'
  });
  const tools = el('div', null, { className: 'mobile-actions' });
  const heading = el('div', null, { className: 'mobile-heading' });
  const beat = action('Add beat', () => document.querySelector('#btn-beats').click(), {
    title: 'Add a beat layer to the selected sequence'
  });
  const guide = action('Guide me', () => startLesson('beat'), {
    title: 'Learn to play and change this beat'
  });
  heading.append(el('h2', 'Step sequencer'), beat, guide);
  const selectors = el('div', null, { className: 'mobile-selectors' });
  let groupId = null;
  const remembered = new Map();
  const groupsRow = el('div', null, {
    className: 'mobile-groups',
    role: 'group',
    'aria-label': 'Track groups'
  });
  const chips = el('div', null, { className: 'mobile-group-chips' });
  const manage = action('Groups', () => editGroups(host, groupId, trackId, chooseGroup), {
    title: 'Create or edit track groups'
  });
  groupsRow.append(chips);
  function tracksInGroup() {
    const group = groupId && readGroups().list.find((g) => g.id === groupId);
    return [...store.project.channels, ...store.project.instruments].filter(
      (c) => !c.assetOnly && (!group || group.tracks.includes(c.id))
    );
  }
  const bank = createTrackBank((id) => {
    const owner = store.track(id);
    if (!owner) return;
    if (owner.mute) store.setTrackProp(id, 'mute', false);
    selectTrack(id);
  });
  function selectTrack(id) {
    if (!id) return;
    trackId = id;
    if (groupId) remembered.set(groupId, id);
    track.value = id;
    bank.reveal(id);
    if (instrument() >= 0) setMidiTarget(instrument());
    updateStrip();
    syncPosition();
    paint();
  }
  function chooseGroup(id) {
    groupId = id;
    const available = tracksInGroup();
    const last = remembered.get(id);
    const target =
      available.find((t) => t.id === last) ||
      available.find((t) => t.id === trackId) ||
      available[0];
    if (target) selectTrack(target.id);
    rebuild();
  }
  function hop(direction) {
    const owners = tracksInGroup(),
      i = owners.findIndex((t) => t.id === trackId);
    if (owners.length) selectTrack(owners[(i + direction + owners.length) % owners.length].id);
  }
  const previous = action('‹', () => hop(-1), {
    'aria-label': 'Previous track',
    title: 'Previous track in this group'
  });
  const next = action('›', () => hop(1), {
    'aria-label': 'Next track',
    title: 'Next track in this group'
  });
  const switcher = el('div', null, { className: 'mobile-track-switch' });
  switcher.append(previous, field('Track', track), next);
  selectors.append(field('Sequence', sequence), switcher);
  const inspector = el('section', null, {
    className: 'mobile-inspector',
    'aria-label': 'Selected track controls'
  });
  const source = el('span', '', { className: 'mobile-source' });
  const context = el('div', null, { className: 'mobile-track-context' });
  context.append(source, manage);
  inspector.append(selectors, context, groupsRow);
  let strip;
  function updateStrip() {
    const i = channel(),
      isSynth = i < 0,
      owner = store.track(trackId);
    if (!owner) return;
    if (
      strip?.dataset.trackId !== trackId ||
      +strip.dataset.ownerIndex !== (isSynth ? instrument() : i)
    ) {
      strip?.remove();
      strip = createTrackControls(trackId, { patternTools: false, playbackRate: false });
      strip.classList.add('mobile-strip');
      const mix = el('div', null, { className: 'mobile-mix' });
      const devices = el('div', null, { className: 'mobile-devices' });
      function moveButton(selector, caption, parent, id) {
        const button = strip.querySelector(selector);
        if (!button) return;
        button.textContent = caption;
        button.setAttribute('aria-label', caption + ' · ' + owner.name);
        if (id) button.id = id;
        parent.append(button);
      }
      moveButton('.solo', 'Solo', mix);
      moveButton('.mute', 'Mute', mix);
      moveButton('.preview', 'Preview', mix);
      const volume = strip.querySelector('.ch-vol');
      mix.append(field('Level', volume));
      if (isSynth) {
        devices.append(strip.querySelector('.synth-picker'));
        devices.append(action('Expand keyboard', (button) => openExpandedKeyboard(instrument(), button), {'aria-haspopup': 'dialog'}));
        moveButton('.panel-open', 'Synth panel', devices);
        moveButton('.roll-open', 'Piano roll', devices);
      } else {
        moveButton('.load', 'Load sound', devices, 'mobile-load');
        moveButton('.trim', 'Trim', devices, 'mobile-trim');
      }
      moveButton('.ins', 'Inserts', devices);
      moveButton('.fxb', 'Effects', devices, 'mobile-effects');
      strip.append(mix, devices);
      inspector.append(strip);
    }
    refreshTrackControls(strip);
    source.textContent = isSynth
      ? 'Instrument'
      : owner.sampleName || owner.source?.label || 'No sample loaded';
    source.title = source.textContent;
    source.hidden = isSynth;
    tools.hidden = pads.hidden = isSynth;
  }
  const playback = el('div', null, { className: 'mobile-playback' });
  const position = el('span', '', { className: 'mobile-position' });
  const follow = action(
    'Follow playback',
    () => {
      setFollowing(!following);
      syncPosition();
    },
    { title: 'Move the pads to the playing bar. Turn off to keep editing here.' }
  );
  async function playHere(kind) {
    const range = editRange(kind === 'sequence');
    if (!range && kind !== 'song') return;
    const start = range?.start ?? 0;
    const previousKind = scope?.kind;
    const destination = 'sequence ' + (store.project.currentSequence + 1) +
      (kind === 'bar' ? ', bar ' + (bar + 1) : '');
    scope = { kind, start, end: range?.end, destination };
    if (engine.isPlaying) {
      pendingRange = { ...scope, finishLoop: previousKind === kind && kind !== 'song' };
    } else {
      pendingRange = null;
      await engine.play({ fromBeat: start });
    }
    paint();
  }
  const song = action('Play song', () => playHere('song'), {
    title: 'Continue through the song. When stopped, start at the displayed bar.'
  });
  const loopBar = action('Loop bar', () => playHere('bar'), {
    title: 'Repeat this bar on the beat. Choose another bar to loop it next.'
  });
  const loopSeq = action('Loop sequence', () => playHere('sequence'), {
    title: 'Repeat this sequence. Choose another sequence to play it next.'
  });
  playback.append(position, follow, song, loopBar, loopSeq);
  const editor = el('div', null, { className: 'mobile-edit-area' });
  editor.append(heading, inspector, bars, pads, playback, tools);
  host.append(editor, bank.region);
  const welcomeKey = 'audionaut.beta-pro.mobile.introduction';
  let firstVisit = true;
  try {
    firstVisit = !localStorage.getItem(welcomeKey);
  } catch {}
  if (firstVisit) {
    guide.hidden = true;
    const welcome = el('div', null, { className: 'mobile-introduction' });
    const dismiss = () => {
      guide.hidden = false;
      welcome.remove();
      try {
        localStorage.setItem(welcomeKey, 'seen');
      } catch {}
    };
    welcome.append(
      el('span', 'Play the sequence, then tap a pad to change the beat.'),
      action('Show me', () => {
        dismiss();
        return startLesson('beat');
      }),
      action('Dismiss', dismiss)
    );
    heading.after(welcome);
  }
  function selectEdit(sequenceChanged = false) {
    if (!engine.isPlaying) {
      scope = null;
      const range = editRange();
      if (range) engine.seekBeat(range.start);
    } else if (scope?.kind === 'bar' || (sequenceChanged && scope?.kind === 'sequence')) {
      void playHere(scope.kind);
    }
    paint();
  }
  sequence.onchange = () => {
    browse();
    store.selectSequence(Number(sequence.value));
    selectEdit(true);
  };
  track.onchange = () => {
    selectTrack(track.value);
  };
  const mode = action(
    'Accent',
    () => {
      accent = !accent;
      edit = false;
      paint();
    },
    { title: 'Tap a pad to set or clear its accent' }
  );
  const detail = action(
    'Edit step',
    () => {
      edit = !edit;
      accent = false;
      paint();
    },
    { title: 'Tap a pad to open its step editor' }
  );
  tools.append(mode, detail);
  for (let i = 0; i < 4; i++)
    bars.append(
      action('Bar ' + (i + 1), () => {
        browse();
        bar = i;
        selectEdit();
      })
    );
  for (let i = 0; i < 16; i++)
    pads.append(
      action('', () => {
        const step = bar * 16 + i;
        if (channel() < 0) return;
        if (edit) {
          setFollowing(false);
          paint();
          openStepEditor(channel(), step);
          return;
        }
        store.cycleStep(channel(), step, accent);
      })
    );
  function sourcePosition() {
    if (!engine.isPlaying || engine.currentStep < 0) return null;
    const index = engine.playingSequence,
      step = engine.currentStep;
    if (!timeline().enabled) return { index, step };
    const beat = index * 16 + step / 4;
    const clips = patternClips().filter((c) => c.start <= beat && beat < c.start + c.duration);
    if (clips.length !== 1) return null;
    const clip = clips[0],
      sourceStep = Math.floor((beat - clip.start + clip.offset) * 4);
    const sourceIndex = store.project.sequences.findIndex((s) => s.id === clip.sequenceId);
    return sourceIndex < 0 || sourceStep < 0 || sourceStep >= 64
      ? null
      : { index: sourceIndex, step: sourceStep };
  }
  function playhead(pos = sourcePosition()) {
    for (let i = 0; i < pads.children.length; i++)
      pads.children[i].classList.toggle(
        'playing',
        pos?.index === store.project.currentSequence && pos.step === bar * 16 + i
      );
    let label = engine.isPlaying
      ? (timeline().enabled
          ? 'Timeline bar ' + (engine.playingSequence * 4 + Math.floor(engine.currentStep / 16) + 1)
          : 'Playing sequence ' +
            (engine.playingSequence + 1) +
            ' · Bar ' +
            (Math.floor(engine.currentStep / 16) + 1)) +
        (timeline().enabled && !pos ? ' · No single step pattern' : '')
      : 'Editing sequence ' + (store.project.currentSequence + 1) + ' · Bar ' + (bar + 1);
    if (engine.isPlaying && scope && scope.kind !== 'song') {
      const playingBeat = engine.playingSequence * 16 + engine.currentStep / 4;
      if (playingBeat < scope.start || playingBeat >= scope.end) label += ' · Queued ' + scope.destination;
    }
    if (position.textContent !== label) position.textContent = label;
    follow.setAttribute('aria-pressed', String(following));
  }
  function syncPosition() {
    const pos = sourcePosition();
    if (following && pos && store.project.sequences[pos.index]) {
      const nextBar = Math.floor(pos.step / 16),
        changed = nextBar !== bar;
      bar = nextBar;
      if (pos.index !== store.project.currentSequence) store.selectSequence(pos.index);
      else if (changed) paint();
    }
    playhead(pos);
  }
  function paint() {
    const ch = channel(),
      track = store.track(trackId);
    [...bars.children].forEach((node, i) => node.setAttribute('aria-pressed', String(i === bar)));
    [...pads.children].forEach((node, i) => {
      const step = bar * 16 + i,
        value = stepVal(store.seq.steps[ch]?.[step]);
      node.textContent = String(i + 1);
      node.setAttribute('aria-label', 'Step ' + (step + 1) + (value === 2 ? ', accented' : ''));
      node.setAttribute('aria-pressed', String(!!value));
      node.classList.toggle('accent', value === 2);
    });
    sequence.value = String(store.project.currentSequence);
    loopBar.disabled = !editRange();
    loopSeq.disabled = !editRange(true);
    for (const [button, kind] of [
      [loopBar, 'bar'],
      [loopSeq, 'sequence'],
      [song, 'song']
    ])
      button.setAttribute('aria-pressed', String(scope?.kind === kind));
    detail.setAttribute('aria-pressed', String(edit));
    mode.setAttribute('aria-pressed', String(accent));
    host.style.setProperty(
      '--track-color',
      track?.color || strip?.style.getPropertyValue('--ch-color') || '#56d8cf'
    );
    playhead();
  }
  function rebuild() {
    const { list, muted } = readGroups();
    if (!list.some((g) => g.id === groupId && g.tracks.length)) groupId = null;
    const available = tracksInGroup();
    previous.disabled = next.disabled = available.length < 2;
    const groups = [
      available.filter((t) => t.kind === 'sample'),
      available.filter((t) => t.kind === 'instrument')
    ];
    // Keep focused performance buttons mounted while playback advances.
    groupsRow.hidden = !list.length;
    const signature = JSON.stringify([list, groupId, muted]);
    if (chips.dataset.signature !== signature) {
      const focused =
        chips.contains(document.activeElement) &&
        (document.activeElement.getAttribute('aria-label') || document.activeElement.textContent);
      chips.replaceChildren();
      if (list.length)
        chips.append(
          action('All tracks', () => chooseGroup(null), { 'aria-pressed': String(!groupId) })
        );
      for (const g of list) {
        const pair = el('span', null, { className: 'mobile-group-pair' });
        const pick = action(g.name, () => chooseGroup(g.id), {
          'aria-label': 'Select group ' + g.name,
          'aria-pressed': String(groupId === g.id)
        });
        pick.disabled = !g.tracks.length;
        const mutedNow = muted.includes(g.id);
        const mute = action(mutedNow ? 'Muted' : 'Mute', () => toggleGroup(g.id), {
          'aria-label': 'Mute group ' + g.name,
          'aria-pressed': String(mutedNow),
          title: (mutedNow ? 'Release ' : 'Mute ') + g.name
        });
        mute.disabled = !g.tracks.length && !mutedNow;
        pair.append(pick, mute);
        chips.append(pair);
      }
      chips.dataset.signature = signature;
      if (focused)
        [...chips.querySelectorAll('button')]
          .find((b) => (b.getAttribute('aria-label') || b.textContent) === focused)
          ?.focus({ preventScroll: true });
    }
    if (!groups.some((group) => group.some((c) => c.id === trackId)))
      trackId = (groups[0][0] || groups[1][0])?.id;
    sequence.replaceChildren(
      ...store.project.sequences.map((s, i) => new Option(String(i + 1), String(i)))
    );
    if (store.project.sequences.length < MAX_SEQUENCES)
      sequence.append(new Option('+ Add sequence', String(store.project.sequences.length)));
    track.replaceChildren(
      ...groups.map((owners, index) => {
        const group = el('optgroup', null, { label: index ? 'Instruments' : 'Samples' });
        group.append(...owners.map((c) => new Option(c.name, c.id)));
        return group;
      })
    );
    track.value = trackId;
    bank.rebuild(available, trackId, engine.anySolo(), !!groupId);
    updateStrip();
    paint();
  }
  function trackChanged(change) {
    if (!change?.prop || ['name', 'assetOnly', 'source'].includes(change.prop)) return rebuild();
    const owner = change.ch === undefined ? store.instrument(change.i) : store.channel(change.ch);
    if (['mute', 'solo', 'color', 'synthId'].includes(change.prop))
      bank.refresh(owner, engine.anySolo());
    if (owner?.id === trackId) updateStrip();
  }
  host.addEventListener('sample-lesson', ({ detail: lesson }) => {
    if (lesson === 'layer' && groupId) chooseGroup(null);
    if (channel() >= 0) return;
    chooseGroup(null);
    selectTrack(store.project.channels.find((c) => !c.assetOnly)?.id);
  });
  const cleanup = [
    store.on('load', ({ restore }) => {
      host.querySelector('dialog[open]')?.close();
      if (!restore) {
        groupId = null;
        remembered.clear();
        pendingRange = null;
        scope = null;
        bar = 0;
      }
      rebuild();
    }),
    store.on('timeline', rebuild),
    store.on('channels', rebuild),
    store.on('instruments', rebuild),
    store.on('instrument', trackChanged),
    store.on('channel', trackChanged),
    store.on('sequence', rebuild),
    store.on('step', paint),
    store.on('project', (change) => (change?.prop === 'extensions' ? rebuild() : paint()))
  ];
  document.addEventListener('audionaut-display-step', syncPosition);
  document.addEventListener('transport', syncPosition);
  rebuild();
  syncPosition();
  return () => {
    if (engine.editorTransport === transport) delete engine.editorTransport;
    endMobileLesson();
    cleanup.forEach((fn) => fn());
    document.removeEventListener('audionaut-display-step', syncPosition);
    document.removeEventListener('transport', syncPosition);
  };
}
