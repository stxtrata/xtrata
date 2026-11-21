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
  const channel = () =>
    Math.max(
      0,
      store.project.channels.findIndex((c) => c.id === trackId)
    );
  const sequence = el('select'),
    track = el('select');
  const bars = el('div', null, { className: 'mobile-bars', role: 'group', 'aria-label': 'Bar to edit' });
  const pads = el('div', null, {
    className: 'mobile-pads',
    role: 'group',
    'aria-label': 'Sixteen steps'
  });
  const tools = el('div', null, { className: 'mobile-actions' });
  const heading = el('div', null, { className: 'mobile-heading' });
  const beat = action('Choose beat', () => document.querySelector('#btn-beats').click(), {
    title: 'Browse and load a beat into this project'
  });
  const guide = action('Guide me', () => startLesson('beat'), {
    title: 'Learn to play and change this beat'
  });
  heading.append(el('h2', 'Step sequencer'), beat, guide);
  const selectors = el('div', null, { className: 'mobile-selectors' });
  selectors.append(field('Sequence', sequence), field('Sample channel', track));
  host.append(heading, selectors, bars, pads, tools);
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
  sequence.onchange = () => store.selectSequence(Number(sequence.value));
  track.onchange = () => {
    trackId = track.value;
    paint();
  };
  const loop = action(
    'Loop sequence',
    () => store.setProjectProp('continuous', !store.project.continuous),
    { title: 'Repeat the selected sequence during sequence playback' }
  );
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
    loop,
    mode,
    detail,
    action('Load sound', () => openLoader(channel()), { id: 'mobile-load' }),
    action('Trim sound', () => openTrim(channel()), { id: 'mobile-trim' }),
    action('Effects', () => openChain(channel(), false, 'fx'), { id: 'mobile-effects' })
  );
  for (let i = 0; i < 4; i++)
    bars.append(
      action('Bar ' + (i + 1), () => {
        bar = i;
        paint();
      })
    );
  for (let i = 0; i < 16; i++)
    pads.append(
      action('', () => {
        const step = bar * 16 + i;
        if (edit) {
          openStepEditor(channel(), step);
          return;
        }
        store.cycleStep(channel(), step, accent);
      })
    );
  function playhead() {
    [...pads.children].forEach((node, i) =>
      node.classList.toggle(
        'playing',
        engine.isPlaying &&
          engine.playingSequence === store.project.currentSequence &&
          engine.currentStep === bar * 16 + i
      )
    );
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
    loop.setAttribute('aria-pressed', String(!store.project.continuous));
    loop.disabled = !!store.project.timeline.enabled;
    loop.title = loop.disabled
      ? 'The saved Timeline arrangement controls playback'
      : 'Repeat the selected sequence';
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
    store.on('load', rebuild),
    store.on('channels', rebuild),
    store.on('channel', rebuild),
    store.on('sequence', rebuild),
    store.on('step', paint),
    store.on('project', paint)
  ];
  document.addEventListener('audionaut-display-step', playhead);
  document.addEventListener('transport', playhead);
  rebuild();
  return () => {
    endMobileLesson();
    cleanup.forEach((fn) => fn());
    document.removeEventListener('audionaut-display-step', playhead);
    document.removeEventListener('transport', playhead);
  };
}
