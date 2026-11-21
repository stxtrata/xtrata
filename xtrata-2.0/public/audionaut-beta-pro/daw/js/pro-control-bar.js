import { el, action } from './pro-ui.js';
import { openHelp } from './pro-guide.js';

const find = (selector) => document.querySelector(selector);
function menu(label, id, nodes, hint) {
  const panel = el('div', null, { id, popover: 'auto', className: 'studio-menu', 'aria-label': label });
  const button = el('button', label, {
    type: 'button',
    popovertarget: id,
    'aria-controls': id,
    'aria-expanded': 'false',
    title: hint
  });
  button.className = 'studio-disclosure';
  panel.append(...nodes);
  document.body.append(panel);
  function place() {
    if (!panel.matches(':popover-open')) return;
    const rect = button.getBoundingClientRect();
    panel.style.left = Math.max(8, Math.min(innerWidth - panel.offsetWidth - 8, rect.left)) + 'px';
    panel.style.top = Math.min(innerHeight - 80, rect.bottom + 5) + 'px';
    panel.style.maxHeight = Math.max(68, innerHeight - parseFloat(panel.style.top) - 8) + 'px';
  }
  panel.addEventListener('toggle', () => {
    const open = panel.matches(':popover-open');
    button.setAttribute('aria-expanded', String(open));
    if (open) {
      place();
      window.addEventListener('resize', place);
    } else window.removeEventListener('resize', place);
  });
  panel.addEventListener(
    'click',
    (event) => {
      // Close before the action opens a modal, so focus can move into its editor.
      if (event.target.closest('button') && !event.target.closest('#performance-bar'))
        panel.hidePopover();
    },
    true
  );
  return button;
}
export function initControlBar(nav) {
  const files = find('.file-ops'),
    metadata = find('.project-meta'),
    bar = find('#top-bar');
  const save = find('#save-state'),
    name = find('#project-name'),
    artist = find('#artist-name');
  const artistLabel = el('label', 'Artist');
  artistLabel.append(artist);
  const templates = el('div', null, { className: 'studio-templates' });
  templates.append(el('h3', 'Start from a template'), find('#btn-starter'), find('#starter-select'));
  templates.querySelector('#btn-starter').textContent = 'Default starter song';
  const project = menu(
    'Project',
    'studio-project',
    [
      artistLabel,
      find('#btn-new'),
      find('#btn-load'),
      find('#btn-save'),
      find('#btn-projects'),
      templates,
      find('#btn-settings')
    ],
    'New, open, save, recover or start from a template'
  );
  project.id = 'studio-project-button';
  metadata.replaceChildren(project, name, save);
  const source = find('#source-bar'),
    performance = find('#performance-bar');
  source.querySelector('.source-badge')?.remove();
  source.querySelector('.dim-note')?.remove();
  source.prepend(find('#btn-beats'));
  const library = menu('Library', 'studio-library', [source], 'Beats, samples, loops and audio tools');
  const groove = find('#swing').closest('.lcd-row');
  const setup = menu(
    'Play setup',
    'studio-setup',
    [groove, performance],
    'Live instrument, MIDI, arpeggiator and panic'
  );
  const help = action('Help', openHelp, {
    id: 'studio-help',
    title: 'Studio guide, step-by-step lessons and keyboard shortcuts'
  });
  files.append(library, setup, find('#btn-publish'), help);
  find('#btn-publish').textContent = 'Export';
  const extraTabs = [...nav.querySelectorAll('[data-workspace]')].filter(
    (t) => !['mobile', 'sequence', 'timeline', 'mixer'].includes(t.dataset.workspace)
  );
  const commands = nav.lastElementChild;
  const more = menu(
    'More views',
    'studio-views',
    [...extraTabs, commands],
    'Automation, recording, sampler, instruments, publishing and commands'
  );
  nav.append(more);
  const viewsPanel = find('#studio-views');
  const tabs = el('div', null, {
    role: 'tablist',
    'aria-label': 'Additional workspaces',
    className: 'studio-extra-tabs'
  });
  tabs.append(...extraTabs);
  viewsPanel.prepend(tabs);
  tabs.onkeydown = (event) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const i = extraTabs.indexOf(document.activeElement);
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? extraTabs.length - 1
          : (i + (event.key === 'ArrowDown' ? 1 : -1) + extraTabs.length) % extraTabs.length;
    event.preventDefault();
    extraTabs[next].focus();
  };
  const reflect = () => {
    const active = extraTabs.find((t) => t.getAttribute('aria-selected') === 'true');
    more.textContent = active?.textContent || 'More views';
    more.classList.toggle('selected-view', !!active);
  };
  new MutationObserver(reflect).observe(document.body, {
    attributes: true,
    attributeFilter: ['data-workspace']
  });
  bar.after(nav);
  const sequenceTools = find('.seq-tools');
  sequenceTools.append(
    menu(
      'Edit',
      'studio-sequence-tools',
      [
        find('#chk-choke').closest('label'),
        find('#fade-ms').closest('label'),
        find('#btn-copy-seq'),
        find('#btn-paste-seq'),
        find('#btn-clear-seq')
      ],
      'Copy, paste, clear, choke and fade this sequence'
    )
  );
  for (const [selector, label] of [
    ['#workspace-tab-mobile', 'Edit one bar at a time with touch pads'],
    ['#workspace-tab-sequence', 'Edit the current four-bar sequence as steps or waveforms'],
    ['#workspace-tab-timeline', 'Arrange the whole song and reveal automation'],
    ['#workspace-tab-mixer', 'Adjust levels, pan, routing and sends']
  ])
    find(selector).title = label;
}
