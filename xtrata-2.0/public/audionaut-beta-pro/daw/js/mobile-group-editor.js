import { el, field, action } from './pro-ui.js';
import { store } from './state.js';
import { readGroups, saveGroup, removeGroup } from './mobile-track-groups.js';

export function editGroups(host, current, trackId, onChoose) {
  const dialog = el('dialog', null, {
    className: 'mobile-group-editor',
    'aria-label': 'Track groups'
  });
  const select = el('select'),
    name = el('input', null, { type: 'text', maxLength: 32 }),
    members = el('fieldset');
  const error = el('span', '', { role: 'status' }),
    groups = readGroups().list;
  select.append(new Option('New group', ''), ...groups.map((g) => new Option(g.name, g.id)));
  select.value = current || '';
  const remove = action('Remove group', () => {
    removeGroup(select.value);
    dialog.close();
    onChoose(null);
  });
  const commit = action('Save group', () => {
    const ids = [...members.querySelectorAll('input:checked')].map((input) => input.value);
    try {
      const id = saveGroup(select.value, name.value, ids);
      dialog.close();
      onChoose(id);
    } catch (e) {
      error.textContent = e.message;
    }
  });
  function render() {
    const group = groups.find((g) => g.id === select.value);
    name.value = group?.name || '';
    members.replaceChildren(el('legend', 'Tracks'));
    for (const [kind, owners] of [
      ['Samples', store.project.channels],
      ['Instruments', store.project.instruments]
    ]) {
      members.append(el('strong', kind));
      for (const track of owners.filter((t) => !t.assetOnly)) {
        const input = el('input', null, { type: 'checkbox', value: track.id });
        input.checked = group ? group.tracks.includes(track.id) : track.id === trackId;
        const label = el('label');
        label.append(input, document.createTextNode(track.name));
        members.append(label);
      }
    }
    remove.hidden = !group;
    error.textContent = '';
  }
  select.onchange = render;
  const buttons = el('div', null, { className: 'mobile-devices' });
  buttons.append(
    commit,
    action('Cancel', () => dialog.close()),
    remove
  );
  dialog.append(
    el('h2', 'Track groups'),
    field('Group', select),
    field('Group name', name),
    members,
    error,
    buttons
  );
  render();
  host.append(dialog);
  dialog.addEventListener('close', () => dialog.remove(), { once: true });
  dialog.showModal();
}
