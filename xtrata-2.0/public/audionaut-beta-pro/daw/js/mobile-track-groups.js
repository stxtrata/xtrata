// Group membership belongs to the song. Playback uses the ordinary track mute
// flags so the mixer, export, undo and older players hear the same result.
import { store } from './state.js';
import { newId } from './project-model.js';
import { beginTransaction, endTransaction } from './history.js';

const key = 'mobileTrackGroups';
const strings = (v) =>
  Array.isArray(v) ? [...new Set(v.filter((s) => typeof s === 'string'))] : [];
let applying = false;
function groupableTracks() {
  return new Set(
    [...store.project.channels, ...store.project.instruments]
      .filter((t) => !t.assetOnly)
      .map((t) => t.id)
  );
}
export function readGroups() {
  const saved = store.project.extensions?.[key] || {};
  const owners = groupableTracks();
  const list = (Array.isArray(saved.list) ? saved.list : [])
    .filter((g) => typeof g?.id === 'string' && typeof g.name === 'string')
    .map((g) => ({
      id: g.id,
      name: g.name,
      tracks: strings(g.tracks).filter((id) => owners.has(id))
    }));
  return {
    list,
    muted: strings(saved.muted).filter((id) => list.some((g) => g.id === id)),
    restore: strings(saved.restore)
  };
}
function covered({ list, muted }) {
  return new Set(list.filter((g) => muted.includes(g.id)).flatMap((g) => g.tracks));
}
function save(data) {
  store.setProjectProp('extensions', { ...store.project.extensions, [key]: data });
}
function change(edit) {
  const data = readGroups(),
    previous = covered(data),
    restore = new Set(data.restore.filter((id) => previous.has(id)));
  edit(data);
  const next = covered(data);
  beginTransaction();
  applying = true;
  try {
    for (const id of next)
      if (!previous.has(id) && !store.track(id).mute) {
        restore.add(id);
        store.setTrackProp(id, 'mute', true);
      }
    for (const id of restore)
      if (!next.has(id)) {
        if (store.track(id)?.mute) store.setTrackProp(id, 'mute', false);
        restore.delete(id);
      }
    data.restore = [...restore];
    save(data);
  } finally {
    applying = false;
    endTransaction();
  }
}
export function saveGroup(id, name, tracks) {
  name = name.trim();
  const owners = groupableTracks();
  tracks = strings(tracks).filter((track) => owners.has(track));
  if (!name || !tracks.length) throw Error('Name the group and choose at least one track.');
  id ||= newId('group');
  change((data) => {
    if (data.list.some((g) => g.id !== id && g.name.toLowerCase() === name.toLowerCase()))
      throw Error('Choose a different group name.');
    const group = { id, name, tracks: [...tracks] },
      i = data.list.findIndex((g) => g.id === id);
    if (i < 0) data.list.push(group);
    else data.list[i] = group;
  });
  return id;
}
export function removeGroup(id) {
  change((data) => {
    data.list = data.list.filter((g) => g.id !== id);
    data.muted = data.muted.filter((g) => g !== id);
  });
}
export function toggleGroup(id) {
  change((data) => {
    if (!data.list.some((g) => g.id === id)) throw Error('Choose a track group.');
    data.muted = data.muted.includes(id) ? data.muted.filter((g) => g !== id) : [...data.muted, id];
  });
}
// Explicit mute changes in any editor take precedence on release of a group.
for (const event of ['channel', 'instrument'])
  store.on(event, (change) => {
    if (applying || change?.prop !== 'mute' || !store.project.extensions?.[key]) return;
    const id = (event === 'channel' ? store.channel(change.ch) : store.instrument(change.i))?.id;
    const data = readGroups();
    if (data.restore.includes(id)) save({ ...data, restore: data.restore.filter((t) => t !== id) });
  });
