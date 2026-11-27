// Inscribe page layout: drop a song, check the live player, inscribe. Everything optional lives in
// collapsible sections that show their current value in one line. This only moves existing elements
// (ids and handlers unchanged) and adds the "found in your file" chips and same-drop cover and lyrics.
(function () {
  'use strict';
  const $ = (s) => document.querySelector(s);
  const card = $('.card');
  const workspace = $('.music-design-workspace');
  const preview = $('#preview');
  const appearance = window.musicAppearance;
  if (!card || !workspace || !preview || !appearance) return;

  // Sections: [key, title, nodes to move in].
  const lossy = $('#musicLossyWarning') && $('#musicLossyWarning').closest('p');
  const plan = [
    ['details', 'Song details, artwork and lyrics', [$('#editWrap')]],
    ['look', 'Player look', [$('#musicAppearancePanel')]],
    ['extras', 'Player extras', [appearance.parts && appearance.parts.extras]],
    ['sound', 'Sound and size', [$('.music-format-picker'), $('.music-audio-options'), $('#formatHelp'), lossy]],
    ['fees', 'Network fees and receipt', [$('.music-fee-choice'), $('#receiptWrap')]],
    ['links', 'Parent and links', [$('#relWrap')]]
  ];
  const side = document.createElement('div');
  side.className = 'mx-side';
  const summary = document.createElement('section');
  summary.className = 'mx-summary';
  summary.setAttribute('aria-label', 'Ready to inscribe');
  summary.innerHTML =
    '<div class="mx-ready-head"><span class="mx-kicker">Ready to inscribe</span><h2 id="mxName"></h2><p class="muted" id="mxLead">We filled in what we found in your file. Inscribe it as it is, or open any section below to change it.</p></div><div class="mx-chips" id="mxFound"></div>';
  const review = [...card.querySelectorAll(':scope > p.muted')].find((p) => /Review before you inscribe/.test(p.textContent));
  summary.append(...[$('#quote'), review, $('#go'), $('#hint'), $('#prog'), $('#result')].filter(Boolean));
  const sections = document.createElement('div');
  sections.className = 'mx-sections';
  const secs = {};
  for (const [key, title, nodes] of plan) {
    const d = document.createElement('details');
    d.className = 'mx-sec mx-sec-' + key;
    d.innerHTML = `<summary><span class="mx-dot" aria-hidden="true"></span><span class="mx-sum"><b>${title}</b><small data-sum></small></span></summary><div class="mx-body"></div>`;
    d.querySelector('.mx-body').append(...nodes.filter(Boolean));
    sections.append(d);
    secs[key] = d;
  }
  if (secs.extras) {
    const badge = document.createElement('span');
    badge.className = 'mx-new';
    badge.textContent = 'New';
    secs.extras.querySelector('summary b').append(' ', badge);
  }
  // The appearance panel's own heading repeats the section title, so the section keeps only the controls.
  const heading = $('#musicAppearancePanel .music-appearance-heading');
  if (heading) heading.hidden = true;
  side.append(summary, sections);
  // Preview on the left, everything else on the right. The workspace follows the drop zone and batch list.
  workspace.replaceChildren(preview, side);
  ($('#musicBatch') || $('#drop')).after(workspace);
  const setup = document.createElement('p');
  setup.className = 'mx-setup muted';
  setup.textContent = 'Optional: set these before you drop, or change them after.';
  sections.before(setup);

  // Visibility: a section shows only when what it holds is on screen.
  const hide = (node, v) => {
    if (node && node.hidden !== v) node.hidden = v;
  };
  const shown = (node) => !!node && node.style.display !== 'none' && !node.hidden;
  const text = (sel) => {
    const n = $(sel);
    return n ? (n.selectedOptions ? n.selectedOptions[0].textContent : n.value).trim() : '';
  };
  function refresh() {
    const batch = shown($('#musicBatch'));
    const track = preview.style.display === 'block';
    const working = $('#prog').classList.contains('show') || $('#result').classList.contains('show');
    document.body.classList.toggle('mx-track', track);
    document.body.classList.toggle('mx-batch', batch);
    document.body.classList.toggle('mx-idle', !track && !batch && !working);
    hide(secs.details, !shown($('#editWrap')));
    hide(secs.links, !shown($('#relWrap')));
    hide(secs.look, !shown($('#musicAppearancePanel')));
    hide(secs.extras, secs.look.hidden);
    hide(setup, track || batch);
    const a = appearance.get(),
      d = window.XtrataMusicAppearance.describe(a);
    const sum = (key, value) => {
      if (secs[key]) secs[key].querySelector('[data-sum]').textContent = value;
    };
    sum('details', [text('#eTitle'), text('#eArtist'), text('#eAlbum')].filter(Boolean).join(' · ') || 'Title, artist, artwork, lyrics and credits');
    sum('look', d.look);
    sum('extras', d.extras.length ? d.extras.length + ' on · ' + d.extras.slice(0, 4).join(', ') + (d.extras.length > 4 ? '…' : '') : 'All off · waveform styles, visualiser, full-screen art, synced lyrics…');
    secs.extras.classList.toggle('mx-on', d.extras.length > 0);
    const format = $('input[name=musicReleaseFormat]:checked');
    sum('sound', [format ? format.closest('label').querySelector('strong').textContent : '', text('#musicQuality').replace(/\s*\(default\)/, '')].filter(Boolean).join(' · '));
    sum('fees', text('#musicFeeMode') + ($('#receiptToggle') && $('#receiptToggle').checked ? ' · on-chain receipt' : ''));
    const parent = text('#sParent'),
      deps = text('#sDeps');
    sum('links', parent || deps ? [parent && 'parent #' + parent, deps && 'links ' + deps].filter(Boolean).join(' · ') : 'Optional · make this a child of an inscription you own');
  }
  let queued = 0;
  const later = () => {
    if (!queued) queued = requestAnimationFrame(() => ((queued = 0), refresh()));
  };
  new MutationObserver(later).observe(card, {
    subtree: true,
    attributes: true,
    attributeFilter: ['style', 'class', 'hidden']
  });
  document.addEventListener('input', later);
  document.addEventListener('change', later);

  // "Found in your file" chips, filled after every build of the single song.
  const chip = (label, ok) => `<span class="mx-chip${ok ? ' ok' : ''}">${label}${ok ? ' ✓' : ''}</span>`;
  const esc = (v) => String(v || '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
  const before = window.prefillEdits;
  if (typeof before === 'function') {
    window.prefillEdits = function (r) {
      before(r);
      applyDropExtras();
      $('#mxName').textContent = r.title || (FILE && FILE.name) || 'Your song';
      const tagged = !!(r.found && r.found.tags);
      $('#mxFound').innerHTML =
        r.format === 'audio'
          ? chip('Audio only · no player', true)
          : [
              chip('Title', tagged && !!r.title),
              chip('Artist', !!r.artist),
              chip('Album', !!r.album),
              chip(r.coverSource === 'upload' ? 'Cover added' : r.coverSource === 'linked' ? 'Cover linked' : 'Cover', r.hasCover),
              chip(window.XtrataMusicPlayer.syncedLines(r.lyrics).length ? 'Synced lyrics' : 'Lyrics', !!r.lyrics)
            ].join('');
      $('#mxLead').innerHTML = tagged
        ? 'We filled in what we found in your file. Inscribe it as it is, or open any section below to change it.'
        : 'Your file had no song details, so the title comes from its name. Add the artist and more under <b>Song details</b>, or inscribe it as it is.';
      later();
    };
  }

  // One drop can carry the song plus its cover (image) and lyrics (.lrc or .txt). Dropped on their
  // own after a song is loaded, a cover or lyrics file is added to that song.
  const isImage = (f) => /^image\/(png|jpeg|webp|gif)$/.test(f.type);
  const isLyrics = (f) => /\.(lrc|txt)$/i.test(f.name);
  const readAs = (f, how) =>
    new Promise((ok, fail) => {
      const rd = new FileReader();
      rd.onload = () => ok(String(rd.result));
      rd.onerror = () => fail(rd.error);
      how === 'text' ? rd.readAsText(f) : rd.readAsDataURL(f);
    });
  let pending = null; // { cover: {b64, mime}, lyrics } waiting for the next single-song build
  async function companions(files) {
    const image = files.find(isImage),
      words = files.find(isLyrics),
      audio = files.filter((f) => !isImage(f) && !isLyrics(f));
    const extra = {};
    if (image && image.size <= 4 * 1048576) {
      const url = await readAs(image, 'url');
      extra.cover = { b64: url.slice(url.indexOf(',') + 1), mime: image.type };
    }
    if (words && words.size <= 262144) extra.lyrics = (await readAs(words, 'text')).trim();
    return { audio, extra, skipped: image && !extra.cover ? 'That cover is over 4 MiB, so it was left out.' : '' };
  }
  function applyDropExtras() {
    if (!pending) return;
    if (pending.cover) {
      COVER_OVERRIDE = { b64: pending.cover.b64, mime: pending.cover.mime };
      $('#eCoverThumb').src = 'data:' + pending.cover.mime + ';base64,' + pending.cover.b64;
    }
    pending = null;
  }
  // Overrides for the first build of a dropped song (read by pickFile through window.musicDropOverrides).
  window.musicDropOverrides = () => {
    if (!pending) return {};
    const o = {};
    if (pending.cover) Object.assign(o, { coverB64: pending.cover.b64, coverMime: pending.cover.mime });
    if (pending.lyrics) o.lyrics = pending.lyrics;
    return o;
  };
  window.musicRouteDrop = async (files, route) => {
    const { audio, extra, skipped } = await companions(files);
    if (!audio.length && (extra.cover || extra.lyrics) && FILE && !SB.active) {
      // Add to the song already loaded, then rebuild the preview and quote.
      if (extra.cover) {
        COVER_OVERRIDE = { b64: extra.cover.b64, mime: extra.cover.mime };
        $('#eCoverThumb').src = 'data:' + extra.cover.mime + ';base64,' + extra.cover.b64;
      }
      if (extra.lyrics) $('#eLyrics').value = extra.lyrics;
      markEditsDirty();
      secs.details.open = true;
      await $('#applyEdits').onclick();
      return;
    }
    pending = audio.length === 1 && !SB.active && (extra.cover || extra.lyrics) ? extra : null;
    route(audio.length ? audio : files);
    if (skipped) $('#hint').innerHTML = '<span style="color:var(--warn)">' + esc(skipped) + '</span>';
  };

  // ---- Changes apply by themselves ----
  // Every edit (song details, artwork, lyrics, player look, extras) goes through one queue: the
  // preview and quote rebuild shortly after the last change, and Inscribe stays locked until they
  // have. Nothing is lost if a change lands while a rebuild is already running.
  const live = document.createElement('p');
  live.id = 'mxLive';
  live.className = 'mx-live muted';
  live.setAttribute('role', 'status');
  $('#go').after(live);
  const setLive = (text, ok) => {
    live.textContent = text;
    live.classList.toggle('ok', !!ok);
    const st = $('#musicStyleStatus');
    if (st) st.textContent = text;
  };
  let applyTimer = 0,
    applyRunning = false,
    applyAgain = false;
  const baseDirty = window.markEditsDirty;
  async function runApply() {
    clearTimeout(applyTimer);
    if (applyRunning || building) {
      applyAgain = true;
      if (!applyRunning) applyTimer = setTimeout(runApply, 400);
      return;
    }
    if (!FILE || SB.active || musicJobActive()) return;
    if (!EDITS_DIRTY) baseDirty();
    applyRunning = true;
    applyAgain = false;
    setLive('Updating your preview and quote…');
    try {
      await $('#applyEdits').onclick();
    } finally {
      applyRunning = false;
    }
    if (applyAgain) return runApply();
    if (EDITS_DIRTY) setLive('Could not update the preview. Check the message under Song details.');
    else setLive(EST ? '✓ Preview and quote are up to date' : 'Preview updated. The quote will refresh in a moment.', true);
  }
  function scheduleApply(delay) {
    if (!FILE || SB.active || musicJobActive()) return;
    clearTimeout(applyTimer);
    setLive('Updating your preview and quote…');
    applyTimer = setTimeout(runApply, delay == null ? 900 : delay);
  }
  window.musicScheduleApply = scheduleApply;
  if (typeof baseDirty === 'function')
    window.markEditsDirty = function () {
      baseDirty.apply(this, arguments);
      scheduleApply();
    };
  const editPanel = $('#editPanel');
  if (editPanel) {
    editPanel.addEventListener('input', (e) => {
      if (e.target.matches('input[type=text],textarea')) scheduleApply(1200);
    });
    editPanel.addEventListener('change', () => scheduleApply(300));
  }

  // ---- Parent: a picture of the chosen inscription, to check it is the right one ----
  const parentCheck = $('#sParentCheck');
  const parentThumb = document.createElement('div');
  parentThumb.id = 'sParentThumb';
  parentThumb.className = 'mx-parent-preview';
  parentThumb.hidden = true;
  if (parentCheck) parentCheck.before(parentThumb);
  let shownParent = '';
  window.musicParentThumb = (id) => {
    if (id === shownParent) return;
    shownParent = id;
    if (!id) {
      parentThumb.hidden = true;
      parentThumb.innerHTML = '';
      return;
    }
    const url = (typeof REF_BASE === 'string' ? REF_BASE : '') + '/inscription/' + id;
    parentThumb.hidden = false;
    parentThumb.innerHTML =
      '<div class="mx-parent-frame"><img alt="Inscription #' + esc(id) + '"></div><div class="mx-parent-meta"><b>#' + esc(id) + '</b><span class="muted">Check this is the one you mean.</span><a href="' + esc(url) + '" target="_blank" rel="noopener">Open full size ↗</a></div>';
    const frame = parentThumb.querySelector('.mx-parent-frame'),
      img = frame.querySelector('img');
    // Images show directly. Anything else (a player, a page, a video) shows in a sealed, scaled-down frame.
    img.onerror = () => {
      if (shownParent !== id) return;
      frame.innerHTML = '<iframe sandbox="allow-scripts" loading="lazy" tabindex="-1" title="Inscription #' + esc(id) + '"></iframe>';
      frame.firstChild.src = url;
      frame.classList.add('framed');
    };
    img.src = url;
  };
  // A note by the Inscribe button whenever a parent is set: two sends, and what comes back.
  const parentNote = document.createElement('p');
  parentNote.className = 'mx-parent-note';
  parentNote.hidden = true;
  live.after(parentNote);
  const noteParent = () => {
    const id = String(($('#sParent') && $('#sParent').value) || '').trim();
    const show = /^\d+$/.test(id) && !musicJobActive();
    if (parentNote.hidden !== !show) parentNote.hidden = !show;
    const text = show
      ? 'With a parent you approve two sends: the payment, then parent #' + id + '. Both are only held for the inscription: #' + id + ', your new song and any unused STX come back to your wallet.'
      : '';
    if (parentNote.textContent !== text) parentNote.textContent = text;
  };
  document.addEventListener('input', noteParent);
  setInterval(noteParent, 1500);

  // ---- On-chain upload panel: chunks and batches, always in view while a job runs ----
  const CHUNK = 16384,
    BATCH = 32;
  const best = {};
  const upMap = $('#upMap');
  const fmtSize = (n) => (n >= 1048576 ? (n / 1048576).toFixed(2) + ' MB' : Math.max(1, Math.round(n / 1024)) + ' KB');
  window.musicUploadMap = (job, status) => {
    if (!upMap || !job) return;
    const st = job.status;
    const liveStates = ['AWAITING_DEPOSIT', 'AWAITING_PARENT', 'FUNDED', 'INSCRIBING', 'FEE_WAITING', 'INSCRIBED', 'DELIVERING'];
    if (!liveStates.includes(st)) {
      upMap.hidden = true;
      return;
    }
    const items = Array.isArray(job.items) && job.items.length ? job.items : null;
    const curIdx = items ? items.findIndex((i) => i.status === 'INSCRIBING') : -1;
    const cur = items ? (curIdx >= 0 ? items[curIdx] : null) : job;
    const bytes = cur ? cur.bytes || 0 : job.bytes || 0;
    const total = (cur && (cur.uploadTotal || cur.chunks)) || Math.ceil(bytes / CHUNK) || 0;
    const single = cur ? (cur.single != null ? !!cur.single : total <= BATCH) : false;
    const batches = Math.max(1, Math.ceil(total / BATCH));
    const key = job.jobId + ':' + (items ? curIdx : 'one');
    const m = /(?:uploading|upload started|resuming upload)\s*·\s*(\d+)\s*\/\s*(\d+)/i.exec(job.progress || '');
    if (m && +m[2] === total) best[key] = Math.max(best[key] || 0, +m[1]);
    const after = ['INSCRIBED', 'DELIVERING'].includes(st);
    let done = after ? total : best[key] || 0;
    const sealing = !single && done >= total && total > 0 && st === 'INSCRIBING';
    const waiting = ['AWAITING_DEPOSIT', 'AWAITING_PARENT', 'FUNDED'].includes(st) && !done;
    const curBatch = Math.min(batches, Math.floor(done / BATCH) + 1);
    let now;
    if (st === 'AWAITING_DEPOSIT') now = 'Waiting for your payment';
    else if (st === 'AWAITING_PARENT') now = 'Waiting for your parent';
    else if (st === 'FUNDED') now = 'Starting the upload';
    else if (st === 'FEE_WAITING') now = 'Paused for network fees';
    else if (st === 'INSCRIBED') now = 'Sealed ✓ — finishing';
    else if (st === 'DELIVERING') now = 'Sending it all back to you';
    else if (single) now = 'Sending one transaction';
    else if (sealing) now = 'Sealing the inscription';
    else now = 'Uploading batch ' + curBatch + ' of ' + batches;
    const segs = [];
    for (let b = 0; b < (single ? 1 : batches); b++) {
      const lo = b * BATCH,
        hi = Math.min(total, lo + BATCH);
      const filled = single ? (after ? 1 : 0) : Math.max(0, Math.min(1, (done - lo) / (hi - lo || 1)));
      const state = filled >= 1 ? 'done' : !waiting && !after && (single || b === curBatch - 1) && st === 'INSCRIBING' ? 'now' : 'todo';
      segs.push('<i class="' + state + '" title="' + (single ? 'All ' + total + ' chunks in one transaction' : 'Batch ' + (b + 1) + ': chunks ' + (lo + 1) + '–' + hi) + '"><em style="width:' + Math.round(filled * 100) + '%"></em></i>');
    }
    const songs = items
      ? '<div class="mx-up-songs"><span>Song ' + (curIdx >= 0 ? curIdx + 1 : items.filter((i) => i.tokenId).length) + ' of ' + items.length + '</span>' +
        items.map((i) => '<i class="' + (i.tokenId ? 'done' : i.status === 'INSCRIBING' ? 'now' : /FAIL|SKIP/.test(i.status || '') ? 'bad' : 'todo') + '"></i>').join('') +
        '</div>'
      : '';
    const html =
      '<div class="mx-up-head"><span class="mx-kicker">On-chain upload</span><span>' + (bytes ? fmtSize(bytes) : '') + '</span></div>' +
      songs +
      '<div class="mx-up-stats"><div><b>' + total + '</b><small>chunks of 16 KB</small></div><div><b>' + (single ? '1' : batches) + '</b><small>' + (single ? 'transaction, no batches' : 'batches of up to ' + BATCH) + '</small></div><div><b>' + done + '</b><small>on-chain so far</small></div><div><b>' + (total ? Math.round((100 * done) / total) : 0) + '%</b><small>uploaded</small></div></div>' +
      '<div class="mx-up-bar" aria-hidden="true">' + segs.join('') + '</div>' +
      '<div class="mx-up-now"><span class="mx-up-dot"></span>' + esc(now) + '</div>';
    if (upMap.__html !== html) {
      upMap.innerHTML = html;
      upMap.__html = html;
    }
    upMap.hidden = !total;
  };
  refresh();
})();
