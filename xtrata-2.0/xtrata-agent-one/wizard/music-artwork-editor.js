// Review image optimisation before applying to single or batch releases.
(function () {
  const A = window.XtrataMusicArtwork,
    dialog = document.createElement('dialog');
  dialog.id = 'musicArtworkDialog';
  dialog.setAttribute('aria-labelledby', 'artworkHeading');
  dialog.innerHTML =
    '<h2 id="artworkHeading">Prepare player artwork</h2><p>Start with <b>512 × 512 px and 50–100 KB</b>. Non-square images keep their proportions. Smaller covers save more space but may lose fine text and detail.</p><p id="artworkSource"></p><p id="artworkWarning" role="status"></p><label for="artworkPreset">Size and quality</label><select id="artworkPreset"><option value="standard">Recommended · 512 px · target under 100 KB</option><option value="small">Smaller · 256 px · target under 30 KB</option><option value="tiny">Smallest · 128 px · target under 12 KB</option><option value="detailed">Detailed · 1024 px · target under 200 KB</option><option value="original">Keep original artwork</option></select><div class="artwork-comparison"><figure><img id="artworkBefore" alt="Original cover"/><figcaption>Original</figcaption></figure><figure><img id="artworkAfter" alt="Prepared cover"/><figcaption id="artworkResult">Preparing…</figcaption></figure></div><p id="artworkSavings" role="status"></p><p class="muted">Exports a still cover image. Compression is lossy; compare fine text and edges before applying. Transparency is preserved. Size targets are guidance, not guarantees. Keeping original audio also keeps any artwork embedded in that audio file; this editor changes the separate player cover.</p><div class="music-toolbar"><button type="button" class="btn" id="artworkApply" disabled>Use prepared artwork</button><button type="button" class="btn ghost" id="artworkCancel">Cancel</button></div>';
  document.body.append(dialog);
  const el = (id) => dialog.querySelector('#' + id),
    kb = (n) => (n / 1024).toFixed(1) + ' KB';
  let source,
    result,
    apply,
    run = 0,
    urls = [];
  function cleanup() {
    run++;
    urls.forEach(URL.revokeObjectURL);
    urls = [];
    source = null;
    result = null;
  }
  dialog.addEventListener('close', cleanup);
  el('artworkCancel').onclick = () => dialog.close();
  async function prepare() {
    const generation = ++run;
    result = null;
    el('artworkApply').disabled = true;
    el('artworkSavings').textContent = 'Preparing artwork on this device…';
    try {
      const next = await A.optimise(source, el('artworkPreset').value);
      if (generation !== run || !dialog.open) return;
      result = next;
      const url = URL.createObjectURL(next.file);
      urls.push(url);
      el('artworkAfter').src = url;
      el('artworkSource').textContent =
        'Original: ' +
        next.original.width +
        ' × ' +
        next.original.height +
        ' px · ' +
        kb(next.original.bytes);
      el('artworkWarning').textContent = [
        ...A.warnings(next.original.width, next.original.height, next.original.bytes),
        ...next.warnings
      ]
        .filter((v, i, a) => a.indexOf(v) === i)
        .join(' ');
      el('artworkResult').textContent =
        next.width +
        ' × ' +
        next.height +
        ' px · ' +
        kb(next.bytes) +
        ' · ' +
        next.file.type.replace('image/', '');
      const saved = next.original.bytes - next.bytes;
      el('artworkSavings').textContent =
        saved > 0
          ? 'Saves ' + kb(saved) + ' (' + Math.round((saved / next.original.bytes) * 100) + '%).'
          : saved < 0
            ? 'This version is ' + kb(-saved) + ' larger. Try another preset or keep the original.'
            : 'Original size retained; this image is already efficient.';
      el('artworkApply').disabled = false;
    } catch (e) {
      if (generation === run) {
        el('artworkSavings').textContent = e.message;
        el('artworkResult').textContent = 'Could not prepare image';
      }
    }
  }
  el('artworkPreset').onchange = prepare;
  el('artworkApply').onclick = async () => {
    if (!result) return;
    const next = result,
      callback = apply;
    dialog.close();
    await callback(next);
  };
  function open(file, callback) {
    if (musicJobActive() || building || SB.busy) return;
    cleanup();
    source = file;
    apply = callback;
    el('artworkPreset').value = 'standard';
    el('artworkWarning').textContent = '';
    el('artworkSource').textContent = '';
    const url = URL.createObjectURL(file);
    urls.push(url);
    el('artworkBefore').src = url;
    dialog.showModal();
    prepare();
  }
  async function useSingle(next) {
    markEditsDirty();
    const b64 = await sbReadB64(next.file);
    COVER_OVERRIDE = { b64, mime: next.file.type };
    $('#eCoverThumb').src = 'data:' + next.file.type + ';base64,' + b64;
    markEditsDirty();
    await $('#applyEdits').onclick();
    refreshAdvice();
  }
  const field = $('#eCoverBtn').closest('.efield'),
    advice = document.createElement('p');
  advice.id = 'musicArtworkAdvice';
  advice.className = 'muted';
  field.append(advice);
  const optimise = document.createElement('button');
  optimise.type = 'button';
  optimise.id = 'musicOptimiseArtwork';
  optimise.className = 'btn ghost';
  optimise.textContent = 'Optimise current artwork…';
  field.append(optimise);
  function current() {
    const b64 = COVER_OVERRIDE !== undefined ? COVER_OVERRIDE.b64 : META?.coverB64,
      mime = COVER_OVERRIDE !== undefined ? COVER_OVERRIDE.mime : META?.coverMime;
    return b64 ? A.fromBase64(b64, mime) : null;
  }
  let adviceRun = 0;
  async function refreshAdvice() {
    const generation = ++adviceRun,
      file = current();
    optimise.disabled = !file;
    advice.textContent =
      'Recommended: 512 × 512 px, around 50–100 KB. Choose smaller dimensions for a smaller inscription.';
    if (!file) return;
    try {
      const d = await A.inspect(file);
      if (generation !== adviceRun) return;
      advice.textContent =
        'Current artwork: ' +
        d.width +
        ' × ' +
        d.height +
        ' px · ' +
        kb(d.bytes) +
        '. ' +
        (d.warnings.join(' ') || 'A compact cover helps keep the inscription small.');
      advice.className = d.warnings.length ? 'artwork-warning' : 'muted';
    } catch {
      if (generation === adviceRun)
        advice.textContent =
          'Could not inspect this artwork. Replace it with a valid still PNG, JPEG or WebP.';
    }
  }
  optimise.onclick = () => {
    const file = current();
    if (file) open(file, useSingle);
  };
  $('#eCoverPick').onchange = () => {
    const file = $('#eCoverPick').files[0];
    $('#eCoverPick').value = '';
    if (file) open(file, useSingle);
  };
  const previousRow = sbRow;
  sbRow = function (it, i) {
    return (
      previousRow(it, i) +
      (it.info?.artworkInfo?.warnings?.length
        ? '<p class="artwork-warning">' + esc(it.info.artworkInfo.warnings.join(' ')) + '</p>'
        : '')
    );
  };
  const previousPrefill = prefillEdits;
  prefillEdits = function (r) {
    previousPrefill(r);
    refreshAdvice();
  };
  const previousPreview = showMusicPreview;
  showMusicPreview = function (r) {
    previousPreview(r);
    refreshAdvice();
  };
  const remove = $('#musicRemoveArt').onclick;
  $('#musicRemoveArt').onclick = () => {
    remove();
    refreshAdvice();
  };
  async function useBatch(it, next) {
    it.status = 'building';
    SB.EST = null;
    ++SB.quoteRun;
    sbRender();
    it.overrides = {
      ...it.overrides,
      format: 'artwork',
      coverB64: await sbReadB64(next.file),
      coverMime: next.file.type
    };
    it.status = 'queued';
    SB.EST = null;
    ++SB.quoteRun;
    await sbProcess();
  }
  $('#sbArtPick').onchange = () => {
    const file = $('#sbArtPick').files[0],
      it = SB.items[sbArtTarget];
    $('#sbArtPick').value = '';
    if (file && it) open(file, (p) => useBatch(it, p));
  };
  window.musicOptimiseTrackArt = (i) => {
    const it = SB.items[i];
    if (it?.info?.coverB64)
      open(A.fromBase64(it.info.coverB64, it.info.coverMime), (p) => useBatch(it, p));
  };
})();
