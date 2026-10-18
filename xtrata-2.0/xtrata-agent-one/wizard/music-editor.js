// Music editor integration. Drafts contain files and descriptive fields only; never jobs or wallet keys.
let musicPreviewUrl = null,
  musicTrackIndex = null;
const musicExtraFields = {
  version: 'Version',
  trackNumber: 'Track number',
  featuredArtists: 'Featured artists',
  songwriters: 'Songwriters',
  performers: 'Performers',
  producer: 'Producer',
  engineer: 'Engineer',
  genre: 'Genre',
  releaseDate: 'Release date',
  language: 'Language',
  musicalKey: 'Musical key',
  isrc: 'Existing ISRC',
  rightsHolder: 'Rights holder'
};
function showMusicPreview(r) {
  if (musicPreviewUrl) {
    URL.revokeObjectURL(musicPreviewUrl);
    musicPreviewUrl = null;
  }
  const frame = $('#previewFrame');
  const previewSizes = document.querySelector('.music-preview-sizes');
  if (previewSizes) previewSizes.hidden = !r.html;
  let raw = $('#musicRawPreview');
  if (!raw) {
    raw = document.createElement('div');
    raw.id = 'musicRawPreview';
    raw.innerHTML =
      '<div style="aspect-ratio:1;display:grid;place-content:center;text-align:center;border:1px solid var(--line);border-radius:12px;background:#121613"><div style="font-size:80px;color:var(--acc)">♫</div><p>Audio only</p></div><audio controls style="width:100%;margin-top:12px"></audio><p class="muted" style="font-size:12px">No extra player or metadata will be inscribed. Browser playback support varies by format.</p>';
    frame.after(raw);
  }
  frame.style.display = r.html ? 'block' : 'none';
  raw.hidden = !!r.html;
  if (r.html) {
    frame.srcdoc = r.html;
    raw.querySelector('audio').removeAttribute('src');
  } else {
    frame.removeAttribute('srcdoc');
    musicPreviewUrl = URL.createObjectURL(r.playerFile);
    raw.querySelector('audio').src = musicPreviewUrl;
  }
  $('#preview').style.display = 'block';
}
function musicBusy(busy) {
  for (const el of document.querySelectorAll(
    '#musicFeeMode,input[name=musicReleaseFormat],#musicAppearancePanel input,#musicAppearancePanel select,#musicAppearancePanel button,#picker,#refAudioPanel input,#refAudioPanel button,#musicFormat,#musicQuality,#editPanel input,#editPanel textarea,#editPanel select,#editPanel button,#trackEditor input,#trackEditor select,#trackEditor button,#sbBulk input,#sbBulk button,#sbList .sb-link input,#sbList .sb-link button'
  ))
    el.disabled = busy || !!musicJobActive();
  // Title and artist boxes on each song stay editable while other songs build; only a job locks them.
  for (const el of document.querySelectorAll('#sbList .sb-quick input'))
    el.disabled = !!musicJobActive();
}
function musicUnlockJob() {
  musicBusy(false);
}
function musicLockJob() {
  for (const el of document.querySelectorAll(
    '#musicFeeMode,input[name=musicReleaseFormat],#musicAppearancePanel input,#musicAppearancePanel select,#musicAppearancePanel button,#picker,#refAudioPanel input,#refAudioPanel button,#musicFormat,#musicQuality,#editPanel input,#editPanel textarea,#editPanel select,#editPanel button,#trackEditor input,#trackEditor select,#trackEditor button,#sbBulk input,#sbBulk button,#sbList .sb-link input,#sbList .sb-link button'
  ))
    el.disabled = true;
  for (const el of document.querySelectorAll('#sbList .sb-quick input')) el.disabled = true;
  updateGo();
}
$('#drop').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    if (!building && !SB.busy && !musicJobActive()) picker.click();
  }
});
window.musicAppearance = window.XtrataMusicAppearance.init();
const oldCollect = collectEdits;
collectEdits = function () {
  const o = oldCollect();
  for (const key of Object.keys(musicExtraFields)) o[key] = $('#music-' + key).value;
  o.appearance = window.musicAppearance.get();
  return o;
};
const extra = document.createElement('div');
extra.className = 'metadata-grid';
for (const [key, label] of Object.entries(musicExtraFields)) {
  const group = document.createElement('div');
  group.className = 'efield';
  const l = document.createElement('label');
  l.htmlFor = 'music-' + key;
  l.textContent = label;
  const input = document.createElement('input');
  input.id = l.htmlFor;
  input.maxLength = 300;
  input.addEventListener('input', markEditsDirty);
  group.append(l, input);
  extra.append(group);
}
$('#moreMetaPanel').append(extra);
const artOptions = document.createElement('div');
artOptions.className = 'music-toolbar';
artOptions.innerHTML =
  '<button type="button" class="btn ghost" id="musicRemoveArt">Remove artwork</button>';
$('#eCoverBtn').parentElement.parentElement.append(artOptions);
$('#musicRemoveArt').onclick = () => {
  COVER_OVERRIDE = { b64: null, mime: null };
  $('#eCoverThumb').removeAttribute('src');
  markEditsDirty();
};

const oldPrefill = prefillEdits;
prefillEdits = function (r) {
  oldPrefill(r);
  window.musicAppearance.set(r.appearance);
  for (const key of Object.keys(musicExtraFields)) $('#music-' + key).value = r[key] || '';
  for (const key of ['bpm', 'note', 'license', 'description'])
    $('#e' + key[0].toUpperCase() + key.slice(1)).value = r[key] || '';
  $('#editPanel').style.display = 'block';
  musicFormatHelp();
};
function musicFormatHelp() {
  if (window.musicAppearance) window.musicAppearance.visibility();
  const format = $('#musicFormat').value,
    quality = $('#musicQuality').value;
  $('#musicLossyWarning').hidden = quality === 'original' || !!REF_AUDIO;
  document.querySelectorAll('input[name=musicReleaseFormat]').forEach((input) => {
    input.checked = input.value === format;
  });
  document
    .querySelectorAll(
      '#musicStyleControls [data-option="artFit"],#musicStyleControls [data-option="position"]'
    )
    .forEach((input) => {
      input.closest('label').hidden = format !== 'artwork' && !SB.active;
    });
  $('#editToggle').textContent =
    format === 'artwork' ? 'Edit artwork, metadata and lyrics' : 'Edit metadata and lyrics';
  $('#formatHelp').textContent =
    format === 'audio'
      ? 'Only the audio file is inscribed. Existing tags and embedded artwork remain inside original files; no additional metadata or player is added.'
      : format === 'details'
        ? 'A playable release with optional details and lyrics. No cover image is added, even if your file has artwork.'
        : 'A playable release with your cover, lyrics and credits. Artwork inside your files is used automatically; you can replace or remove it.';
  $('#formatHelp').textContent +=
    ' ' +
    (REF_AUDIO
      ? 'The audio plays from inscription #' +
        REF_AUDIO.id +
        ', so nothing is converted or stored again.'
      : quality === 'original'
        ? 'Original audio bytes are preserved.'
        : quality === 'compact'
          ? 'Audio is converted to Opus at 48 kbps VBR. Smaller files, with a greater loss of detail — audition before inscribing.'
          : quality === 'high'
            ? 'Audio is converted to Opus at 128 kbps VBR for high quality music.'
            : quality === 'premium'
              ? 'Audio is converted to Opus at 160 kbps VBR for extra detail, with larger files.'
              : 'Audio is converted to Opus at 96 kbps VBR, balancing quality and file size.');
  $('#editWrap').style.display = FILE && format !== 'audio' && !SB.active ? 'block' : 'none';
  $('#eCoverBtn').closest('.efield').style.display = format === 'artwork' ? 'block' : 'none';
}
document.querySelectorAll('input[name=musicReleaseFormat]').forEach((input) => {
  input.addEventListener('change', () => {
    if (!input.checked || building || SB.busy || musicJobActive()) return;
    $('#musicFormat').value = input.value;
    $('#musicFormat').dispatchEvent(new Event('change'));
  });
});
for (const id of ['#musicFormat', '#musicQuality'])
  $(id).onchange = () => {
    if (musicJobActive()) return;
    musicFormatHelp();
    if (SB.active) {
      SB.EST = null;
      ++SB.quoteRun;
      for (const it of SB.items) {
        it.overrides = {
          ...it.overrides,
          format: $('#musicFormat').value,
          quality: $('#musicQuality').value
        };
        it.status = 'queued';
      }
      musicFormatHelp();
      sbProcess();
    } else if (FILE) {
      markEditsDirty();
      $('#applyEdits').click();
    }
  };
// Prevent an old quote from authorising a changed output.
const oldDirty = markEditsDirty;
markEditsDirty = function () {
  EST = null;
  oldDirty();
  $('#qPay').textContent = 'Apply changes to refresh quote';
};
const quoteDetails = document.createElement('div');
quoteDetails.id = 'musicQuoteDetails';
$('#quote').append(quoteDetails);
const batchDetails = document.createElement('div');
batchDetails.id = 'musicBatchDetails';
$('#sbQuoteBox').append(batchDetails);
function musicQuoteDetails(est, target) {
  if (!est) {
    target.textContent = '';
    return;
  }
  const rows = [
    ['Protocol fees', est.protocolFee ?? est.sumProtocol],
    ['Network fee reserve', est.minerReserve ?? est.sumMiner],
    ['Delivery reserve', est.deliveryReserve],
    ['Parent return reserve', est.parentReserve],
    ['Optional receipt protocol fee', est.receiptProtocol],
    ['Optional receipt network reserve', est.receiptMiner],
    ['Service fee (' + (est.agentFeePct ?? 0) + '%)', est.agentFeeUstx]
  ];
  target.innerHTML =
    '<details><summary>Cost breakdown</summary>' +
    rows
      .filter(([, v]) => v != null && BigInt(v) > 0n)
      .map(
        ([label, v]) =>
          '<div class="kv"><span>' + label + '</span><span>' + stx(v) + '</span></div>'
      )
      .join('') +
    '<p class="muted">Funding includes reserves and rounding. Actual network costs vary; unused funds return to the funding wallet.</p></details>';
}
new MutationObserver(() => musicQuoteDetails(EST, quoteDetails)).observe($('#qPay'), {
  childList: true
});
new MutationObserver(() => musicQuoteDetails(SB.EST, batchDetails)).observe($('#sbPay'), {
  childList: true
});
// Per-song editor for the batch. It opens directly under the song being edited, in sections, and only
// writes the details you actually changed — so it can never undo a bulk change made after it opened.
const editor = document.createElement('section');
editor.id = 'trackEditor';
editor.className = 'sb-ed';
editor.hidden = true;
$('#musicBatch').prepend(editor);
let editingItem = null,
  editorInitial = {},
  editorGather = null,
  previewRun = 0;
const FIELD_LABELS = {
  featuredArtists: 'Featured artists',
  songwriters: 'Songwriters',
  performers: 'Performers',
  releaseDate: 'Release date',
  trackNumber: 'Track number',
  musicalKey: 'Musical key',
  rightsHolder: 'Rights holder',
  isrc: 'ISRC',
  bpm: 'BPM'
};
const EDITOR_SECTIONS = [
  ['Song', ['title', 'artist', 'album', 'trackNumber', 'genre', 'releaseDate'], true],
  [
    'Credits and rights',
    [
      'featuredArtists',
      'songwriters',
      'performers',
      'producer',
      'engineer',
      'rightsHolder',
      'license',
      'isrc',
      'language'
    ],
    false
  ],
  ['Description and notes', ['description', 'version', 'bpm', 'musicalKey', 'note'], false],
  ['Lyrics', ['lyrics'], false]
];
const fieldLabel = (key) =>
  FIELD_LABELS[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
const parkEditor = () => {
  ++previewRun;
  const frame = editor.querySelector('.music-track-preview');
  if (frame) frame.srcdoc = '';
  editor.hidden = true;
  $('#musicBatch').prepend(editor);
};
const editingIndex = () => (editingItem ? SB.items.indexOf(editingItem) : -1);
window.musicEditingIndex = editingIndex;
// Which details were changed in the open editor (field name → new value).
const editorChanges = () => {
  if (editor.hidden || !editorGather) return {};
  const now = editorGather(),
    out = {};
  for (const k of Object.keys(now)) if (now[k] !== editorInitial[k]) out[k] = now[k];
  return out;
};
window.musicEditorDirty = () => !editor.hidden && Object.keys(editorChanges()).length > 0;
const editorSay = (msg) => {
  const el = editor.querySelector('#trackStatus');
  if (el) el.textContent = msg || '';
};
const closeEditor = () => {
  editingItem = null;
  parkEditor();
  sbRender();
};
// Bring the editor's untouched fields up to date with the song (e.g. after "Apply to all").
const syncEditor = () => {
  if (editor.hidden || !editingItem || !editorGather) return;
  const values = { ...editingItem.info, ...editingItem.overrides };
  for (const key of window.XtrataMusic.FIELDS) {
    const input = $('#track-' + key);
    if (!input || input.value !== (editorInitial[key] ?? '')) continue; // the user is editing this one
    const next = values[key] == null ? '' : String(values[key]);
    input.value = next;
    editorInitial[key] = next;
  }
};
const renderBeforeEditor = sbRender;
sbRender = function () {
  const hadFocus = editor.contains(document.activeElement) ? document.activeElement : null,
    at =
      hadFocus && 'selectionStart' in hadFocus
        ? [hadFocus.selectionStart, hadFocus.selectionEnd]
        : null;
  if (!editor.hidden) {
    editor.remove(); // keep the open editor out of the list while it is rewritten
    $('#musicBatch').prepend(editor);
  }
  renderBeforeEditor();
  const index = editingIndex();
  if (editingItem && index < 0) {
    editingItem = null;
    parkEditor();
    return;
  }
  if (!editor.hidden) {
    const row = $('#sbList').children[index];
    if (row) row.after(editor);
    syncEditor();
    if (hadFocus && hadFocus.isConnected) {
      hadFocus.focus();
      try {
        if (at) hadFocus.setSelectionRange(at[0], at[1]);
      } catch (_e) {
        /* not a text box */
      }
    }
  }
};
window.musicEditTrack = (i) => {
  if (musicJobActive()) return;
  const it = SB.items[i];
  if (!it || it.status !== 'ready') return;
  if (editingItem === it) {
    if (window.musicEditorDirty()) {
      editorSay('You have unsaved changes — apply them or close to discard.');
      return;
    }
    closeEditor();
    return;
  }
  if (editingItem && window.musicEditorDirty()) {
    editorSay('You have unsaved changes on this song — apply them or close first.');
    editor.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    return;
  }
  editingItem = it;
  musicTrackIndex = i;
  ++previewRun;
  const values = { ...it.info, ...it.overrides };
  editor.innerHTML =
    '<div class="sb-ed-head"><h3>All details · song ' +
    (i + 1) +
    '</h3><p class="muted">Anything you change here applies to this song only.</p></div><div id="trackSections"></div><p id="trackStatus" class="muted" role="status"></p><div class="music-toolbar"><button class="btn" id="saveTrack">Apply changes to this song</button><button class="btn ghost" id="shareTrack" title="Copies this song’s artist and album — and its artwork, if it has any — to every song">Use this artist, album and artwork for all songs</button><button class="btn ghost" id="closeTrack">Close</button></div>';
  const known = new Set(EDITOR_SECTIONS.flatMap(([, keys]) => keys));
  const sections = EDITOR_SECTIONS.map(([name, keys, open]) => [name, keys, open]);
  const leftovers = window.XtrataMusic.FIELDS.filter((k) => !known.has(k));
  if (leftovers.length) sections.push(['More details', leftovers, false]);
  const host = $('#trackSections');
  for (const [name, keys, open] of sections) {
    const d = document.createElement('details');
    d.className = 'sb-ed-sec';
    d.open = open;
    const sum = document.createElement('summary');
    sum.textContent = name;
    const grid = document.createElement('div');
    grid.className = keys.length === 1 ? 'sb-ed-grid one' : 'sb-ed-grid';
    d.append(sum, grid);
    for (const key of keys) {
      if (!window.XtrataMusic.FIELDS.includes(key)) continue;
      const g = document.createElement('div');
      g.className = 'efield';
      const l = document.createElement('label');
      l.htmlFor = 'track-' + key;
      l.textContent = fieldLabel(key);
      const input = document.createElement(key === 'lyrics' ? 'textarea' : 'input');
      input.id = l.htmlFor;
      if (key === 'lyrics') input.rows = 8;
      input.value = values[key] == null ? '' : String(values[key]);
      g.append(l, input);
      grid.append(g);
    }
    host.append(d);
  }
  const lead = host.querySelector('details');
  if (lead && window.XtrataMusic.FIELDS.includes('title')) {
    // keep the section order stable but open the first one
    lead.open = true;
  }
  // Player and audio settings live in their own section, closed by default.
  const player = document.createElement('details');
  player.className = 'sb-ed-sec';
  player.innerHTML =
    '<summary>Player style and audio</summary><div class="music-options"><label>Release format<select id="trackFormat"><option value="audio">Audio only</option><option value="details">Song with details</option><option value="artwork">Song with artwork</option></select></label><label>Audio quality<select id="trackQuality"><option value="original">Keep original file</option><option value="compact">Smallest · Opus 48 kbps VBR</option><option value="optimised" selected>Balanced · Opus 96 kbps VBR (default)</option><option value="high">High quality · Opus 128 kbps VBR</option><option value="premium">Extra quality · Opus 160 kbps VBR</option></select></label></div><div id="trackStyleHost"></div>';
  host.append(player);
  $('#trackFormat').value = values.format || $('#musicFormat').value;
  $('#trackQuality').value = values.quality || $('#musicQuality').value;
  const styleHost = $('#trackStyleHost');
  const preview = document.createElement('iframe');
  preview.className = 'music-track-preview';
  preview.title = 'Track style preview';
  preview.setAttribute('sandbox', 'allow-scripts');
  styleHost.after(preview);
  const previewNote = document.createElement('p');
  previewNote.className = 'muted';
  preview.after(previewNote);
  const gatherFields = () =>
    Object.fromEntries(
      window.XtrataMusic.FIELDS.filter((k) => $('#track-' + k)).map((k) => [
        k,
        $('#track-' + k).value
      ])
    );
  const settings = () => ({
    format: $('#trackFormat').value,
    quality: $('#trackQuality').value,
    appearance: JSON.stringify(trackAppearance.get())
  });
  let trackAppearance;
  const previewBuild = async () => {
    const run = ++previewRun;
    previewNote.textContent = 'Updating preview…';
    try {
      const r = await window.XtrataMusic.build(it.file, () => {}, {
        ...it.overrides,
        ...editorChanges(),
        format: $('#trackFormat').value,
        quality: $('#trackQuality').value,
        appearance: trackAppearance.get(),
        artFit: undefined
      });
      if (run !== previewRun || editor.hidden) return;
      preview.hidden = !r.html;
      preview.srcdoc = r.html || '';
      previewNote.textContent = r.html
        ? 'Style preview · Apply changes to save and refresh the quote.'
        : 'Audio only has no inscribed player style.';
    } catch (error) {
      if (run === previewRun) previewNote.textContent = error.message;
    }
    sbUpdateGo();
  };
  trackAppearance = window.XtrataMusicAppearance.mount(styleHost, values.appearance, previewBuild);
  preview.hidden = !it.info?.html;
  preview.srcdoc = it.info?.html || '';
  previewNote.textContent = 'Apply changes to save the appearance and refresh the quote.';
  // Dirty tracking: the editor only writes what differs from what it opened with.
  const initialSettings = settings();
  editorGather = () => ({ ...gatherFields(), ...settings() });
  editorInitial = { ...gatherFields(), ...initialSettings };
  const save = async (shared) => {
    if (musicJobActive() || editingItem !== it) return;
    if (it.status !== 'ready') {
      editorSay('This song is still being prepared — try again in a moment.');
      return;
    }
    const changes = editorChanges(),
      all = gatherFields();
    const edits = { ...changes };
    if ('appearance' in changes) edits.appearance = trackAppearance.get();
    else delete edits.appearance;
    it.overrides = { ...it.overrides, ...edits, artFit: undefined };
    it.status = 'queued';
    if (shared)
      for (const row of SB.items) {
        row.overrides = {
          ...row.overrides,
          artist: all.artist,
          album: all.album,
          ...(it.info?.coverB64
            ? { format: 'artwork', coverB64: it.info.coverB64, coverMime: it.info.coverMime }
            : {})
        };
        row.status = 'queued';
      }
    editingItem = null;
    parkEditor();
    SB.EST = null;
    ++SB.quoteRun;
    sbRender();
    await sbProcess();
  };
  $('#saveTrack').onclick = () => save(false);
  $('#shareTrack').onclick = () => save(true);
  $('#closeTrack').onclick = closeEditor;
  editor.oninput = editor.onchange = () => {
    editorSay('');
    sbUpdateGo();
  };
  editor.hidden = false;
  sbRender();
  const row = $('#sbList').children[i];
  if (row) row.scrollIntoView({ block: 'start', behavior: 'smooth' });
  const first = $('#track-title');
  if (first) first.focus({ preventScroll: true });
  sbUpdateGo();
};
const oldBatchGo = sbUpdateGo;
sbUpdateGo = function () {
  oldBatchGo();
  if (window.musicEditorDirty()) {
    $('#sbGo').disabled = true;
    $('#sbGo').textContent = 'Apply or close the song editor before inscribing';
  }
};
// Draft storage deliberately excludes the agent's job records and funding material.
const toolbar = document.createElement('div');
toolbar.className = 'music-toolbar';
toolbar.innerHTML =
  '<button class="btn ghost" id="saveMusicDraft">Save draft on this device</button><button class="btn ghost" id="restoreMusicDraft">Restore saved draft</button><button class="btn ghost" id="clearMusicDraft">Delete saved draft</button><span id="draftStatus" role="status"></span>';
$('#drop').after(toolbar);
function draftDb() {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open('xtrata-music-drafts', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('drafts');
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
async function draftAccess(mode, action) {
  const db = await draftDb();
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction('drafts', mode),
        req = action(tx.objectStore('drafts'));
      tx.oncomplete = () => resolve(req.result);
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error);
    });
  } finally {
    db.close();
  }
}
$('#saveMusicDraft').onclick = async () => {
  try {
    if (!FILE && !SB.items.length) throw new Error('Choose audio first.');
    if (building || SB.busy || musicJobActive())
      throw new Error('Wait for the current operation to finish.');
    const items = SB.active
      ? SB.items.map((it) => ({ file: it.file, overrides: it.overrides || {} }))
      : [{ file: FILE, overrides: collectEdits() }];
    await draftAccess('readwrite', (s) =>
      s.put(
        {
          version: 1,
          appearance: window.musicAppearance.get(),
          format: $('#musicFormat').value,
          quality: $('#musicQuality').value,
          items
        },
        'current'
      )
    );
    $('#draftStatus').textContent = 'Draft saved locally. This device stores the selected files.';
  } catch (e) {
    $('#draftStatus').textContent = e.message;
  }
};
$('#restoreMusicDraft').onclick = async () => {
  try {
    if (building || SB.busy || musicJobActive())
      throw new Error('Finish the current operation first.');
    const d = await draftAccess('readonly', (s) => s.get('current'));
    if (!d) throw new Error('No saved draft on this device.');
    window.musicAppearance.set(d.appearance || d.items[0]?.overrides?.appearance);
    $('#musicFormat').value = d.format;
    $('#musicQuality').value = d.quality;
    musicFormatHelp();
    if (d.items.length === 1) {
      sbResetUI();
      await pickFile(d.items[0].file);
      const o = d.items[0].overrides;
      for (const k of [
        'title',
        'artist',
        'album',
        'lyrics',
        'bpm',
        'note',
        'license',
        'description'
      ])
        $('#e' + k[0].toUpperCase() + k.slice(1)).value = o[k] || '';
      for (const k of Object.keys(musicExtraFields)) $('#music-' + k).value = o[k] || '';
      COVER_OVERRIDE =
        o.coverB64 !== undefined ? { b64: o.coverB64, mime: o.coverMime } : undefined;
      window.musicAppearance.set(o.appearance || { artFit: o.artFit || 'contain' });
      markEditsDirty();
      await $('#applyEdits').onclick();
    } else {
      SB.items = d.items.map((it) => ({ ...it, status: 'queued', player: null, info: null }));
      sbEnterUI();
      await sbProcess();
    }
    $('#draftStatus').textContent = 'Draft restored. Review the new preview and quote.';
  } catch (e) {
    $('#draftStatus').textContent = e.message;
  }
};
$('#clearMusicDraft').onclick = async () => {
  try {
    await draftAccess('readwrite', (s) => s.delete('current'));
    $('#draftStatus').textContent = 'Saved draft deleted.';
  } catch (e) {
    $('#draftStatus').textContent = e.message;
  }
};
const faq = document.createElement('section');
faq.className = 'music-faq';
faq.innerHTML =
  '<details><summary>What will be stored?</summary><p>Audio only stores your selected audio file. The other formats store a self-contained HTML player containing your audio and chosen details. Artwork is optional. Each track in a batch is a separate inscription.</p></details><details><summary>Can I edit it later?</summary><p>On-chain bytes cannot be replaced. Check the audio, lyrics and credits before paying. A corrected release requires a new inscription.</p></details><details><summary>What happens if I close this tab?</summary><p>Keep the tab open during inscription. Reopen this page on the same device and browser to resume an unfinished job. Use the recovery action if shown. Drafts are local to this browser and are separate from funded jobs.</p></details><details><summary>Is this an album release?</summary><p>Multiple tracks are inscribed separately. An ordered album player, editions, sales and royalty tools are not part of this page.</p></details>';
$('.card').append(faq);
musicFormatHelp();
