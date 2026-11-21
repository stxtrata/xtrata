import { action, el, status } from './pro-ui.js';
import { openWorkspace } from './pro-workspace.js';

const topics = [
  [
    'Getting started',
    'A first phone visit opens Mobile with the starter session. Tap Play, then tap a numbered pad to change the beat. Your next visit opens the workspace you last selected.'
  ],
  [
    'Sequences and Timeline',
    'Sequences shows one four-bar phrase. Switch between waveforms and steps with Grid or Waves. Timeline lays the same song out horizontally. Drag a region to move it or drag either edge to trim. Use the ruler to seek.'
  ],
  [
    'Mobile steps and layers',
    'Select a sample channel and a bar. Each of the 16 pads represents one sixteenth note. Tap to add or remove a hit. Accent sets stronger hits. Choose another channel to layer a second sound on the same beat. Follow playback shows the playing bar. Turn it off or pick another bar to keep editing while the song plays. Loop bar or Loop sequence jumps playback to your edit. Play song continues through the arrangement from here.'
  ],
  [
    'Samples and editing',
    'Load sound opens the library for the selected channel. Select a category and sample, audition it, then choose Load. Trim sound sets the channel’s start and end. Edit step applies changes to one hit. Library also holds the L1 catalogue, Samples & Loops and audio analysis tools.'
  ],
  [
    'Templates and beats',
    'Open Project for a blank song or a complete starter template. A starter replaces the song. For drum patterns, open Library → Beats or tap Add beat in Mobile. Browse freely, then choose Apply beat for the displayed destination. It uses the song tempo. Another beat replaces untouched beat parts in that sequence. Edited tracks and other sounds stay in place. Undo reverses an application.'
  ],
  [
    'Playback and MIDI',
    'Play pauses and resumes. Stop returns the transport to the start. Change BPM for tempo or Swing for alternating step timing. Play setup selects the live instrument, MIDI controller and arpeggiator. Panic releases sounding notes.'
  ],
  [
    'Mixer and effects',
    'Open Mixer for volume, meters, pan, routing and sends. In Mobile choose Effects for the selected sample channel. Pick an effect and press Add. Use its controls to adjust the sound and Done to return.'
  ],
  [
    'Automation',
    'Reveal Automation in Timeline, choose a parameter on a track and edit its points. Hide the overlay to resume region editing. Use More views → Automation for detailed curves and writing modes.'
  ],
  [
    'Recording, sampler and instruments',
    'More views contains Record & takes for input and punch recording, Sampler for processing and slicing a source, and New instruments for choosing sound generators. Open Play setup to choose the active keyboard instrument.'
  ],
  [
    'Save, restore and open older songs',
    'Project → Save downloads an editable project. Projects opens browser recovery and saved versions for this edition. Load opens current files and supported earlier Audional JSON, gzip and AUDX songs. Keep a portable copy when moving between devices or editions.'
  ],
  [
    'Export and on-chain publishing',
    'Export renders audio or prepares a project for inscription. More views → On-chain publishing verifies library and runtime references before preparing a draft. A browser save and a prepared draft are local until you publish.'
  ],
  [
    'Shortcuts and diagnostics',
    'Space plays or pauses. Use Command or Control with Z to undo. More views → Commands searches actions and edits shortcuts. Performance shows audio status, meters and diagnostics.'
  ]
];
const lessons = {
  beat: [
    'Play and edit a beat',
    [
      ['#btn-play', 'Tap Play to hear the current session. If it is already playing, tap to pause.'],
      ['.mobile-pads', 'Tap any step to add or remove a hit on this channel.'],
      ['.mobile-bars', 'Select a bar to edit another part of this sequence.']
    ]
  ],
  sample: [
    'Load and place a sample',
    [
      ['#mobile-load', 'Open the sample library for this channel.'],
      ['#modal-loader [data-tab="library"]', 'Choose the Library tab to browse the sample catalogue.'],
      ['#library-sample', 'Choose a sample. You can audition it before loading.', 'change'],
      ['#loader-load', 'Load the selected sound onto this channel.', 'audionaut-sample-ready'],
      ['.mobile-pads', 'Tap an unlit step to place the sample.']
    ]
  ],
  trim: [
    'Trim a sample',
    [
      ['#mobile-trim', 'Open the sample editor for this channel.'],
      ['#trim-start', 'Adjust the start point. Use Preview to hear the change.', 'input'],
      ['#trim-close', 'Choose Done to return to the beat.']
    ]
  ],
  layer: [
    'Layer a second channel',
    [
      ['.mobile-selectors label:last-child select', 'Select another sample channel.', 'change'],
      ['.mobile-pads', 'Tap an unlit step to add a hit to the second layer.'],
      ['#btn-play', 'Use the transport to hear the layers together or pause playback.']
    ]
  ],
  fx: [
    'Add a channel effect',
    [
      ['#mobile-effects', 'Open the effects chain for this channel.'],
      ['#chain-add-type', 'Choose an effect for this sound.', 'change'],
      ['#chain-add-btn', 'Add the selected effect. You can adjust its controls here.'],
      ['#chain-close', 'Choose Done to return to the sequence.']
    ]
  ]
};
let endLesson,
  launch = 0;
export async function startLesson(id) {
  const attempt = ++launch;
  endLesson?.();
  const [title, steps] = lessons[id];
  if (!document.querySelector('.mobile-editor')) await openWorkspace('mobile');
  if (attempt !== launch || document.body.dataset.workspace !== 'mobile') return;
  const panel = el('aside', null, { className: 'studio-lesson', 'aria-label': title });
  const copy = el('span', null, { 'aria-live': 'polite' }),
    skip = action('Next', advance, { title: 'Skip this instruction' }),
    close = action('End lesson', finish);
  panel.append(copy, skip, close);
  let index = -1,
    target,
    eventName,
    observedModal;
  const changed = new MutationObserver(() => {
    if (document.body.dataset.workspace !== 'mobile' || observedModal?.classList.contains('hidden'))
      finish();
  });
  changed.observe(document.body, { attributes: true, attributeFilter: ['data-workspace'] });
  for (const modal of document.querySelectorAll('.modal'))
    changed.observe(modal, { attributes: true, attributeFilter: ['class'] });
  function detach() {
    target?.classList.remove('studio-target');
    target?.removeEventListener(eventName, advance);
  }
  function loading() {
    if (eventName !== 'audionaut-sample-ready') return;
    observedModal = null;
    document.querySelector('.mobile-editor')?.prepend(panel);
    copy.textContent = 'Loading the selected sound…';
  }
  const loader = document.querySelector('#loader-load');
  loader.addEventListener('audionaut-sample-loading', loading);
  loader.addEventListener('audionaut-sample-failed', finish);
  function finish() {
    loader.removeEventListener('audionaut-sample-loading', loading);
    loader.removeEventListener('audionaut-sample-failed', finish);
    detach();
    changed.disconnect();
    panel.remove();
    if (endLesson === finish) endLesson = null;
  }
  function advance() {
    detach();
    if (++index === steps.length) {
      finish();
      status(title + ' lesson complete.');
      return;
    }
    const [selector, hint, event = 'click'] = steps[index];
    target = document.querySelector(selector);
    eventName = event;
    if (!target) {
      finish();
      return;
    }
    skip.hidden = !['input', 'change'].includes(event);
    observedModal = target.closest('.modal');
    // Keep lesson controls in the active dialog, including its focus order.
    const anchor =
      observedModal?.querySelector('.modal-box') || document.querySelector('.mobile-editor');
    anchor.prepend(panel);
    copy.textContent = index + 1 + ' / ' + steps.length + ' · ' + hint;
    target.classList.add('studio-target');
    target.addEventListener(eventName, advance);
    if (target.getClientRects().length) target.scrollIntoView({ block: 'nearest' });
  }
  endLesson = finish;
  advance();
}
export function endMobileLesson() {
  endLesson?.();
}

export function openHelp() {
  endMobileLesson();
  const dialog = el('dialog', null, {
      className: 'pro-dialog studio-help',
      'aria-label': 'Studio guide'
    }),
    opener = document.activeElement;
  const close = () => dialog.close();
  dialog.addEventListener('close', () => {
    dialog.remove();
    opener?.focus();
  });
  const heading = el('header');
  heading.append(el('h2', 'Studio guide'), action('Close', close));
  dialog.append(heading);
  const search = el('input', null, {
    type: 'search',
    placeholder: 'Find a workflow…',
    'aria-label': 'Search the guide'
  });
  const lessonsBox = el('div', null, { className: 'studio-lessons' }),
    articles = el('div');
  for (const [id, [title]] of Object.entries(lessons))
    lessonsBox.append(
      action(title, () => {
        close();
        return startLesson(id);
      })
    );
  const currentTopic = {
    mobile: 'Mobile steps and layers',
    sequence: 'Sequences and Timeline',
    timeline: 'Sequences and Timeline',
    mixer: 'Mixer and effects',
    automation: 'Automation',
    recording: 'Recording, sampler and instruments',
    sampler: 'Recording, sampler and instruments',
    devices: 'Recording, sampler and instruments',
    chain: 'Export and on-chain publishing',
    performance: 'Shortcuts and diagnostics'
  }[document.body.dataset.workspace || 'sequence'];
  function filter() {
    const query = search.value.trim().toLowerCase();
    articles.replaceChildren();
    for (const [title, body] of topics.filter((item) => item.join(' ').toLowerCase().includes(query))) {
      const details = el('details');
      details.open = !!query || title === currentTopic;
      details.append(el('summary', title), el('p', body));
      articles.append(details);
    }
    if (!articles.childElementCount)
      articles.append(el('p', 'No matching topics. Try “sample”, “save” or “MIDI”.'));
  }
  dialog.append(el('h3', 'Guided lessons'), lessonsBox, el('h3', 'Reference'), search, articles);
  const reading = el('p');
  dialog.append(reading);
  const handbook = el('a', 'Open the studio handbook', {
    href: 'studio-guide.html',
    target: '_blank',
    rel: 'noopener'
  });
  reading.append(handbook);
  search.addEventListener('input', filter);
  filter();
  document.body.append(dialog);
  dialog.showModal();
  search.focus();
}
