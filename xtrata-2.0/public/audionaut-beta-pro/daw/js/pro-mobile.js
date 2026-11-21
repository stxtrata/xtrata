import { store, stepVal, MAX_SEQUENCES } from './state.js';
import { engine } from './engine.js';
import { openLoader, openTrim, openChain, openStepEditor } from './ui.js';
import { el, action, field } from './pro-ui.js';
import { startLesson, endMobileLesson } from './pro-guide.js';

export function mount(host) {
  host.classList.add('mobile-editor');
  let trackId = store.project.channels.find((c) => c.source)?.id,
    bar = 0,
    accent = false,
    edit = false;
  let following = true,
    scope = null;
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
  const channel = () =>
    Math.max(
      0,
      store.project.channels.findIndex((c) => c.id === trackId)
    );
  const sequence = el('select'),
    track = el('select');
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
  selectors.append(field('Sequence', sequence), field('Sample channel', track));
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
    if (engine.isPlaying) engine.pause();
    scope = { kind, start, end: range?.end };
    await engine.play({ fromBeat: start });
    paint();
  }
  const song = action('Play song', () => playHere('song'), {
    title: 'Play through the song from this bar'
  });
  const loopBar = action('Loop bar', () => playHere('bar'), {
    title: 'Jump to the displayed bar and repeat it'
  });
  const loopSeq = action('Loop sequence', () => playHere('sequence'), {
    title: 'Jump to the displayed sequence and repeat it'
  });
  playback.append(position, follow, song, loopBar, loopSeq);
  host.append(heading, selectors, bars, pads, playback, tools);
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
  function selectEdit() {
    // Browsing while paused sets the next start. During playback it only moves the editor.
    if (!engine.isPlaying) {
      scope = null;
      const range = editRange();
      if (range) engine.seekBeat(range.start);
    }
    paint();
  }
  sequence.onchange = () => {
    browse();
    store.selectSequence(Number(sequence.value));
    selectEdit();
  };
  track.onchange = () => {
    trackId = track.value;
    syncPosition();
    paint();
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
  tools.append(
    mode,
    detail,
    action('Load sound', () => openLoader(channel()), { id: 'mobile-load' }),
    action('Trim sound', () => openTrim(channel()), { id: 'mobile-trim' }),
    action('Effects', () => openChain(channel(), false, 'fx'), { id: 'mobile-effects' })
  );
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
    const label = engine.isPlaying
      ? (timeline().enabled
          ? 'Timeline bar ' + (engine.playingSequence * 4 + Math.floor(engine.currentStep / 16) + 1)
          : 'Playing sequence ' +
            (engine.playingSequence + 1) +
            ' · Bar ' +
            (Math.floor(engine.currentStep / 16) + 1)) +
        (timeline().enabled && !pos ? ' · No single step pattern' : '')
      : 'Editing sequence ' + (store.project.currentSequence + 1) + ' · Bar ' + (bar + 1);
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
      track = store.channel(ch);
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
    host.style.setProperty('--track-color', track?.color || '#56d8cf');
    playhead();
  }
  function rebuild() {
    trackId = store.channel(channel())?.id;
    sequence.replaceChildren(
      ...store.project.sequences.map((s, i) => new Option(String(i + 1), String(i)))
    );
    if (store.project.sequences.length < MAX_SEQUENCES)
      sequence.append(new Option('+ Add sequence', String(store.project.sequences.length)));
    track.replaceChildren(
      ...store.project.channels.map((c, i) => new Option(i + 1 + ' · ' + c.name, c.id))
    );
    track.value = trackId;
    paint();
  }
  const cleanup = [
    store.on('load', ({ restore }) => {
      if (!restore) {
        scope = null;
        bar = 0;
      }
      rebuild();
    }),
    store.on('timeline', rebuild),
    store.on('channels', rebuild),
    store.on('channel', rebuild),
    store.on('sequence', rebuild),
    store.on('step', paint),
    store.on('project', paint)
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
