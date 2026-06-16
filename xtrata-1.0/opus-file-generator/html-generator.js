// html-generator.js - Handles Xtrata HTML audio player generation.
(function () {

let audionalBase64 = null;
let audionalVisualBase64 = null;
let audionalMimeType = 'audio/webm; codecs=opus';
let audionalVisualMimeType = 'image/png';
let audionalVisualName = '';
let audionalVisualOriginalBytes = null; // size of the originally-uploaded cover, before any compression
let livePreviewTimer = 0;

const SUPPORTED_VISUAL_PREFIXES = ['image/', 'video/'];
const XTRATA_OPUS_HTML_HANDOFF_KEY = 'xtrata.opusHtmlPlayer.pendingInscription';
const XTRATA_OPUS_HTML_HANDOFF_DB = 'xtrata-opus-html-handoff';
const XTRATA_OPUS_HTML_HANDOFF_STORE = 'pending';

function stripDataURIPrefix(dataString) {
  if (typeof dataString !== 'string') return '';
  const commaIndex = dataString.indexOf(',');
  return commaIndex !== -1 ? dataString.substring(commaIndex + 1) : dataString;
}

function getElement(id) {
  return document.getElementById(id);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
    reader.readAsDataURL(file);
  });
}

function isSupportedVisualFile(file) {
  return Boolean(
    file &&
      SUPPORTED_VISUAL_PREFIXES.some((prefix) =>
        String(file.type || '').startsWith(prefix)
      )
  );
}

function getVisualKind(mimeType) {
  const type = String(mimeType || '').toLowerCase();
  if (type.startsWith('video/')) return 'video';
  if (type.startsWith('image/')) return 'image';
  return '';
}

function getPlayerMode() {
  return document.querySelector('input[name="htmlPlayerMode"]:checked')?.value ===
    'recursive'
    ? 'recursive'
    : 'embedded';
}

function getVisualSourceMode() {
  return document.querySelector('input[name="visualSourceMode"]:checked')?.value ===
    'recursive'
    ? 'recursive'
    : 'embedded';
}

function getRecursiveEndpointMode() {
  return getElement('recursiveEndpointMode')?.value === 'compact'
    ? 'compact'
    : 'readable';
}

function getRecursiveConfig() {
  return {
    audioTokenId: getElement('recursiveAudioTokenId')?.value.trim() || '',
    audioUrl: getElement('recursiveAudioUrl')?.value.trim() || '',
    contractId: getElement('recursiveContractId')?.value.trim() || '',
    endpointMode: getRecursiveEndpointMode(),
    network: getElement('recursiveNetwork')?.value || 'mainnet',
    coverTokenId: getElement('recursiveCoverTokenId')?.value.trim() || '',
    coverUrl: getElement('recursiveCoverUrl')?.value.trim() || '',
    coverKind: getElement('recursiveCoverKind')?.value || 'image'
  };
}

function sanitizeTokenId(value) {
  const text = String(value || '').trim().replace(/^#/, '');
  return /^\d+$/.test(text) ? text : '';
}

function buildDefaultRecursiveUrl(config) {
  const tokenId = sanitizeTokenId(config.audioTokenId);
  if (!tokenId) return '';
  if ((config.network || 'mainnet') === 'mainnet') {
    const route = config.endpointMode === 'compact' ? 'i' : 'inscription';
    return `https://xtrata.xyz/${route}/${tokenId}`;
  }
  if (config.contractId) {
    const params = new URLSearchParams({
      contractId: config.contractId,
      tokenId,
      network: config.network || 'mainnet'
    });
    return `https://xtrata.xyz/runtime/content?${params.toString()}`;
  }
  return `https://xtrata.xyz/inscription/${tokenId}`;
}

function buildDefaultRecursiveCoverUrl(config) {
  const tokenId = sanitizeTokenId(config.coverTokenId);
  if (!tokenId) return '';
  if ((config.network || 'mainnet') === 'mainnet') {
    const route = config.endpointMode === 'compact' ? 'i' : 'inscription';
    return `https://xtrata.xyz/${route}/${tokenId}`;
  }
  if (config.contractId) {
    const params = new URLSearchParams({
      contractId: config.contractId,
      tokenId,
      network: config.network || 'mainnet'
    });
    return `https://xtrata.xyz/runtime/content?${params.toString()}`;
  }
  return `https://xtrata.xyz/inscription/${tokenId}`;
}

function getRecursiveDependencies(config) {
  return Array.from(
    new Set([
      getPlayerMode() === 'recursive' ? sanitizeTokenId(config.audioTokenId) : '',
      getVisualSourceMode() === 'recursive' ? sanitizeTokenId(config.coverTokenId) : ''
    ].filter(Boolean))
  );
}

function setHtmlExportStatus(message, isError = false) {
  const status = getElement('htmlExportStatus');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('error', Boolean(isError));
}

function hasEmbeddedAudio() {
  return typeof audionalBase64 === 'string' && audionalBase64.trim() !== '';
}

function hasRecursiveAudioSource() {
  const config = getRecursiveConfig();
  return Boolean(config.audioUrl || sanitizeTokenId(config.audioTokenId));
}

function isHtmlGenerationReady() {
  return getPlayerMode() === 'recursive' ? hasRecursiveAudioSource() : hasEmbeddedAudio();
}

function updateRecursiveUrlPreview() {
  const preview = getElement('recursiveUrlPreview');
  const config = getRecursiveConfig();
  if (preview) {
    const url = config.audioUrl || buildDefaultRecursiveUrl(config);
    preview.textContent = url || 'Enter an audio token ID or audio URL.';
  }

  const coverPreview = getElement('recursiveCoverUrlPreview');
  if (coverPreview) {
    const coverUrl = config.coverUrl || buildDefaultRecursiveCoverUrl(config);
    coverPreview.textContent =
      coverUrl || 'Upload embedded artwork or enter a cover token ID/URL.';
  }
}

function updateDependencyPreview() {
  const preview = getElement('recursiveDependencyPreview');
  if (!preview) return;
  const deps = getRecursiveDependencies(getRecursiveConfig());
  preview.textContent = deps.length ? deps.join(', ') : 'None yet';
}

function updateHtmlModeUI() {
  const mode = getPlayerMode();
  const visualMode = getVisualSourceMode();
  const embeddedPanel = getElement('embeddedPlayerOptions');
  const recursivePanel = getElement('recursivePlayerOptions');
  const embeddedVisualPanel = getElement('embeddedVisualOptions');
  const recursiveVisualPanel = getElement('recursiveVisualOptions');
  if (embeddedPanel) embeddedPanel.classList.toggle('hidden', mode !== 'embedded');
  if (recursivePanel) recursivePanel.classList.toggle('hidden', mode !== 'recursive');
  if (embeddedVisualPanel) {
    embeddedVisualPanel.classList.toggle('hidden', visualMode !== 'embedded');
  }
  if (recursiveVisualPanel) {
    recursiveVisualPanel.classList.toggle('hidden', visualMode !== 'recursive');
  }
  updateRecursiveUrlPreview();
  updateDependencyPreview();
  checkGenerateButtonState();
  scheduleLivePreviewUpdate();
}

function checkGenerateButtonState() {
  const ready = isHtmlGenerationReady();
  if (window.generateHtmlButton) {
    window.generateHtmlButton.disabled = !ready;
  }
  if (window.previewHtmlButton) {
    window.previewHtmlButton.disabled = !ready;
  }
  const inscribeHtmlButton = getElement('inscribeHtmlButton');
  if (inscribeHtmlButton) {
    inscribeHtmlButton.disabled = !ready;
  }

  const mode = getPlayerMode();
  if (ready) {
    setHtmlExportStatus(
      mode === 'recursive'
        ? 'Recursive player ready. Add metadata, then preview or download.'
        : 'Embedded player ready. Add artwork and metadata, then preview or download.'
    );
    return;
  }
  setHtmlExportStatus(
    mode === 'recursive'
      ? 'Enter the audio inscription token ID or a direct audio URL.'
      : 'Convert an audio file first to generate embedded audio data.'
  );
}

function ensureHtmlGenerationReady() {
  if (!isHtmlGenerationReady()) {
    alert(
      getPlayerMode() === 'recursive'
        ? 'Enter an audio inscription token ID or direct audio URL first.'
        : 'Convert an audio file first so the player can embed the audio data.'
    );
    checkGenerateButtonState();
    return false;
  }
  return true;
}

function collectMetadataFromForm(options = {}) {
  const previewMode = Boolean(options.preview);
  const title = window.titleInput?.value.trim() || '';
  return {
    assetType: getElement('assetTypeInput')?.value || 'song',
    title: title || (previewMode ? 'Untitled audio' : ''),
    artist: getElement('artistInput')?.value.trim() || '',
    album: getElement('albumInput')?.value.trim() || '',
    stemRole: getElement('stemRoleInput')?.value.trim() || '',
    instrument: window.instrumentInput?.value.trim() || '',
    note: window.noteInput?.value.trim() || '',
    frequency: window.frequencyInput?.value.trim() || '',
    description: getElement('descriptionInput')?.value.trim() || '',
    license: getElement('licenseInput')?.value.trim() || '',
    isLoop: Boolean(window.loopCheckbox?.checked),
    bpm: window.loopCheckbox?.checked ? window.bpmInput?.value.trim() || '' : ''
  };
}

function buildTemplateConfig(metadata) {
  const mode = getPlayerMode();
  const visualMode = getVisualSourceMode();
  return {
    mode,
    audioSourceMode: mode,
    visualSourceMode: visualMode,
    metadata,
    audioBase64: mode === 'embedded' ? stripDataURIPrefix(audionalBase64) : '',
    audioMimeType: audionalMimeType,
    visualBase64: visualMode === 'embedded' && audionalVisualBase64
      ? stripDataURIPrefix(audionalVisualBase64)
      : '',
    visualMimeType: audionalVisualMimeType,
    visualName: audionalVisualName,
    imageBase64: visualMode === 'embedded' && audionalVisualBase64
      ? stripDataURIPrefix(audionalVisualBase64)
      : '',
    imageMimeType: audionalVisualMimeType,
    recursive: getRecursiveConfig()
  };
}

function buildGeneratedHtml(metadata) {
  if (!metadata.title) {
    throw new Error('Title is required.');
  }
  if (!isHtmlGenerationReady()) {
    throw new Error('The selected player mode is missing its audio source.');
  }
  if (typeof window.HTML_Template !== 'function') {
    throw new Error('HTML template generation function is missing.');
  }

  const config = buildTemplateConfig(metadata);
  const htmlContent = window.HTML_Template(config);
  if (htmlContent.includes('Error generating Xtrata audio player')) {
    throw new Error('The template could not generate a valid player.');
  }
  return {
    htmlContent,
    config
  };
}

function buildGeneratedHtmlBundle() {
  if (!ensureHtmlGenerationReady()) {
    return null;
  }
  if (window.metadataForm && !window.metadataForm.reportValidity()) {
    return null;
  }
  const metadata = collectMetadataFromForm();
  const { htmlContent, config } = buildGeneratedHtml(metadata);
  const filename = buildGeneratedFilename(metadata.title, config.mode);
  const deps = getRecursiveDependencies(config.recursive);
  return {
    metadata,
    htmlContent,
    config,
    filename,
    dependencies: deps
  };
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[char]);
}

function buildPreviewPlaceholder(message) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: grid;
      place-items: center;
      background: #10120f;
      color: #f8f3e7;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      padding: 18px;
      text-align: center;
    }
    .preview-shell {
      width: min(86vmin, 420px);
      aspect-ratio: 1 / 1;
      display: grid;
      place-items: center;
      border: 1px dashed rgba(248, 243, 231, 0.28);
      border-radius: 8px;
      background: rgba(248, 243, 231, 0.06);
      padding: 18px;
    }
    p {
      max-width: 26ch;
      margin: 0;
      color: rgba(248, 243, 231, 0.72);
      font-weight: 800;
      line-height: 1.35;
    }
  </style>
</head>
<body>
  <div class="preview-shell"><p>${escapeHtml(message)}</p></div>
</body>
</html>`;
}

function setLivePreviewStatus(message, isError = false) {
  const status = getElement('htmlLivePreviewStatus');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('error', Boolean(isError));
}

// Soft ceiling for a comfortable single Ordinal inscription. Used only to tint
// the size readout amber as a heads-up; it never blocks generation.
const INSCRIPTION_SIZE_WARN_BYTES = 4 * 1024 * 1024;

function formatSizeLabel(bytes) {
  if (typeof window.formatBytes === 'function') return window.formatBytes(bytes);
  return `${(bytes / 1024).toFixed(1)} KB`;
}

// Measures the byte size of the actual generated HTML (UTF-8), so the figure
// reflects exactly what gets inscribed/downloaded.
function updateInscriptionSizeReadout(htmlContent, config) {
  const sizeEl = getElement('estInscriptionSize');
  const hintEl = getElement('estInscriptionBreakdown');
  const panel = getElement('inscriptionSizePanel');
  if (!sizeEl) return;

  if (!htmlContent) {
    sizeEl.innerHTML = '&mdash;';
    if (panel) panel.classList.remove('is-warn');
    if (hintEl) {
      hintEl.textContent =
        'Convert audio or add a recursive source to estimate the final HTML size.';
    }
    updateAssetBreakdown(null, 0);
    return;
  }

  let bytes;
  try {
    bytes = new Blob([htmlContent]).size;
  } catch (e) {
    bytes = (typeof TextEncoder === 'function'
      ? new TextEncoder().encode(htmlContent)
      : htmlContent).length;
  }

  sizeEl.textContent = formatSizeLabel(bytes);

  const warn = bytes > INSCRIPTION_SIZE_WARN_BYTES;
  if (panel) panel.classList.toggle('is-warn', warn);
  if (hintEl) {
    const audioNote = config && config.audioSourceMode === 'recursive'
      ? 'audio referenced recursively'
      : 'audio embedded';
    const visualNote = config && config.visualSourceMode === 'recursive'
      ? 'visual referenced recursively'
      : 'visual embedded';
    hintEl.textContent = warn
      ? `Full HTML file size (${audioNote}, ${visualNote}). Large for a single inscription — consider a lower bitrate or recursive sources.`
      : `Full HTML file size (${audioNote}, ${visualNote}).`;
  }

  updateAssetBreakdown(config, bytes);
}

// Number of bytes a base64 string adds to the HTML (1 char = 1 UTF-8 byte).
function base64TextBytes(b64) {
  return typeof b64 === 'string' ? b64.length : 0;
}

// Decoded binary size represented by a base64 string.
function base64BinaryBytes(b64) {
  if (typeof b64 !== 'string' || !b64) return 0;
  const len = b64.length;
  const pad = b64.endsWith('==') ? 2 : b64.endsWith('=') ? 1 : 0;
  return Math.max(0, Math.floor((len * 3) / 4) - pad);
}

function savingsLabel(originalBytes, finalBytes) {
  if (!originalBytes || originalBytes <= 0) return '';
  const pct = ((originalBytes - finalBytes) / originalBytes) * 100;
  if (!Number.isFinite(pct) || Math.abs(pct) < 0.1) return '';
  return pct >= 0 ? ` (−${pct.toFixed(0)}%)` : ` (+${Math.abs(pct).toFixed(0)}%)`;
}

function breakdownRow(label, value, opts = {}) {
  const cls = ['asset-row'];
  if (opts.arrow) cls.push('is-arrow');
  if (opts.total) cls.push('is-total');
  return `<div class="${cls.join(' ')}"><span>${escapeHtml(label)}</span><span>${escapeHtml(value)}</span></div>`;
}

function breakdownGroup(title, tag, tagClass, rowsHtml) {
  return (
    `<div class="asset-group">` +
    `<div class="asset-group__head"><span class="asset-group__title">${escapeHtml(title)}</span>` +
    `<span class="asset-group__tag ${tagClass}">${escapeHtml(tag)}</span></div>` +
    rowsHtml +
    `</div>`
  );
}

// Renders the "what's being inscribed" breakdown: per-asset source mode plus a
// running original → compressed → base64 cost calculation that sums to the
// measured inscription size.
function updateAssetBreakdown(config, htmlBytes) {
  const host = getElement('assetBreakdown');
  if (!host) return;

  if (!config) {
    host.innerHTML =
      '<p class="asset-breakdown__empty">Convert audio or add a recursive source to see the breakdown.</p>';
    return;
  }

  const fmt = (b) => formatSizeLabel(b);
  const recursive = config.recursive || {};
  let html = '';

  // ---- Audio ----
  if (config.audioSourceMode === 'recursive') {
    const ref = recursive.audioUrl || (recursive.audioTokenId ? `Token #${recursive.audioTokenId}` : 'Recursive source');
    html += breakdownGroup('Audio', 'Recursive', 'is-recursive',
      breakdownRow('Reference', ref) +
      breakdownRow('Embedded in HTML', '0 B', { note: true }));
  } else {
    const audioB64 = config.audioBase64 || '';
    const compressedAudioBytes =
      (typeof convertedAudioBlob !== 'undefined' && convertedAudioBlob && convertedAudioBlob.size)
        ? convertedAudioBlob.size
        : base64BinaryBytes(audioB64);
    const originalAudioBytes =
      (typeof selectedFile !== 'undefined' && selectedFile && selectedFile.size) ? selectedFile.size : 0;
    let rows = '';
    if (originalAudioBytes) {
      rows += breakdownRow('Original file', fmt(originalAudioBytes));
      rows += breakdownRow('Compressed audio', fmt(compressedAudioBytes) + savingsLabel(originalAudioBytes, compressedAudioBytes), { arrow: true });
    } else {
      rows += breakdownRow('Compressed audio', fmt(compressedAudioBytes), { arrow: true });
    }
    rows += breakdownRow('Base64 in HTML', fmt(base64TextBytes(audioB64)));
    html += breakdownGroup('Audio', 'Embedded', 'is-embedded', rows);
  }

  // ---- Visual ----
  if (config.visualSourceMode === 'recursive') {
    const ref = recursive.coverUrl || (recursive.coverTokenId ? `Token #${recursive.coverTokenId}` : 'Recursive source');
    html += breakdownGroup('Visual', 'Recursive', 'is-recursive',
      breakdownRow('Reference', ref) +
      breakdownRow('Embedded in HTML', '0 B'));
  } else {
    const imgB64 = config.imageBase64 || config.visualBase64 || '';
    if (!imgB64) {
      html += breakdownGroup('Visual', 'None', 'is-none',
        breakdownRow('Cover art', 'No image embedded'));
    } else {
      const embeddedImgBytes = base64BinaryBytes(imgB64);
      let rows = '';
      if (audionalVisualOriginalBytes) {
        rows += breakdownRow('Original file', fmt(audionalVisualOriginalBytes));
        rows += breakdownRow('Embedded image', fmt(embeddedImgBytes) + savingsLabel(audionalVisualOriginalBytes, embeddedImgBytes), { arrow: true });
      } else {
        rows += breakdownRow('Embedded image', fmt(embeddedImgBytes), { arrow: true });
      }
      rows += breakdownRow('Base64 in HTML', fmt(base64TextBytes(imgB64)));
      html += breakdownGroup('Visual', 'Embedded', 'is-embedded', rows);
    }
  }

  // ---- Cost calculation ----
  const audioTextBytes = config.audioSourceMode === 'embedded' ? base64TextBytes(config.audioBase64 || '') : 0;
  const imageTextBytes = config.visualSourceMode === 'embedded' ? base64TextBytes(config.imageBase64 || config.visualBase64 || '') : 0;
  const overhead = Math.max(0, htmlBytes - audioTextBytes - imageTextBytes);
  let costRows = '';
  if (audioTextBytes) costRows += breakdownRow('Audio base64', fmt(audioTextBytes));
  if (imageTextBytes) costRows += breakdownRow('Image base64', fmt(imageTextBytes));
  costRows += breakdownRow('Player template + markup', fmt(overhead));
  costRows += breakdownRow('Total inscription size', fmt(htmlBytes), { total: true });
  html += breakdownGroup('Cost calculation', 'HTML', 'is-none', costRows);

  host.innerHTML = html;
}

function updateLivePreview() {
  const frame = getElement('htmlPlayerLivePreview');
  if (!frame) return;

  if (!isHtmlGenerationReady()) {
    frame.srcdoc = buildPreviewPlaceholder(
      getPlayerMode() === 'recursive'
        ? 'Enter a recursive audio token ID or URL to preview the player.'
        : 'Convert audio first to preview the standalone player.'
    );
    setLivePreviewStatus('Waiting for an audio source.');
    updateInscriptionSizeReadout(null);
    return;
  }

  if (typeof window.HTML_Template !== 'function') {
    frame.srcdoc = buildPreviewPlaceholder('The player template is still loading.');
    setLivePreviewStatus('Template loading.');
    updateInscriptionSizeReadout(null);
    return;
  }

  try {
    const metadata = collectMetadataFromForm({ preview: true });
    const config = buildTemplateConfig(metadata);
    const htmlContent = window.HTML_Template(config);
    frame.srcdoc = htmlContent;
    setLivePreviewStatus(
      `${config.audioSourceMode === 'recursive' ? 'Recursive audio' : 'Embedded audio'} with ${
        config.visualSourceMode === 'recursive' ? 'recursive visual' : 'embedded visual'
      } preview.`
    );
    updateInscriptionSizeReadout(htmlContent, config);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    frame.srcdoc = buildPreviewPlaceholder(message);
    setLivePreviewStatus(`Preview failed: ${message}`, true);
    updateInscriptionSizeReadout(null);
  }
}

function scheduleLivePreviewUpdate() {
  if (livePreviewTimer) window.clearTimeout(livePreviewTimer);
  livePreviewTimer = window.setTimeout(() => {
    livePreviewTimer = 0;
    updateLivePreview();
  }, 180);
}

function buildGeneratedFilename(title, mode) {
  const safeTitle = title.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  return `Xtrata_Audio_Player_${safeTitle || 'Song'}_${mode}_${timestamp}.html`;
}

function openHtmlPreview(htmlContent) {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank', 'noopener,noreferrer');
  window.setTimeout(() => URL.revokeObjectURL(url), 60000);
  return blob.size;
}

function downloadHtmlFile(htmlContent, filename) {
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
  return blob.size;
}

function openHtmlHandoffDb() {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not available in this browser.'));
      return;
    }
    const request = window.indexedDB.open(XTRATA_OPUS_HTML_HANDOFF_DB, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(XTRATA_OPUS_HTML_HANDOFF_STORE)) {
        db.createObjectStore(XTRATA_OPUS_HTML_HANDOFF_STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => {
      reject(request.error || new Error('Could not open inscription handoff storage.'));
    };
  });
}

function waitForTransaction(transaction) {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onerror = () => {
      reject(transaction.error || new Error('Storage transaction failed.'));
    };
    transaction.onabort = () => {
      reject(transaction.error || new Error('Storage transaction was aborted.'));
    };
  });
}

async function storeHtmlHandoff(bundle) {
  const createdAt = new Date().toISOString();
  const id = `opus-html-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const summary = {
    id,
    storage: 'indexeddb',
    source: 'xtrata-opus-file-generator',
    createdAt,
    filename: bundle.filename,
    mimeType: 'text/html',
    metadata: bundle.metadata,
    mode: bundle.config.mode,
    dependencies: bundle.dependencies
  };
  const record = {
    ...summary,
    htmlBlob: new Blob([bundle.htmlContent], { type: 'text/html;charset=utf-8' })
  };

  let db = null;
  try {
    db = await openHtmlHandoffDb();
    const transaction = db.transaction(XTRATA_OPUS_HTML_HANDOFF_STORE, 'readwrite');
    transaction.objectStore(XTRATA_OPUS_HTML_HANDOFF_STORE).put(record);
    await waitForTransaction(transaction);
    window.localStorage.setItem(
      XTRATA_OPUS_HTML_HANDOFF_KEY,
      JSON.stringify(summary)
    );
    return summary;
  } catch (error) {
    const fallback = {
      ...summary,
      storage: 'localStorage',
      html: bundle.htmlContent
    };
    window.localStorage.setItem(
      XTRATA_OPUS_HTML_HANDOFF_KEY,
      JSON.stringify(fallback)
    );
    return fallback;
  } finally {
    if (db) db.close();
  }
}

function finishGeneration(action) {
  try {
    const bundle = buildGeneratedHtmlBundle();
    if (!bundle) return;
    const size =
      action === 'preview'
        ? openHtmlPreview(bundle.htmlContent)
        : downloadHtmlFile(bundle.htmlContent, bundle.filename);
    const deps = bundle.dependencies.join(', ') || 'none';
    setHtmlExportStatus(
      `${action === 'preview' ? 'Preview opened' : 'Downloaded'} ${bundle.filename} (${formatBytes(
        size
      )}). Dependencies: ${deps}.`
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('HTML generation failed:', error);
    setHtmlExportStatus(`HTML generation failed: ${message}`, true);
    alert(`HTML generation failed: ${message}`);
  }
}

function handleMetadataSubmit(event) {
  event.preventDefault();
  finishGeneration('download');
}

function handleDownloadClick() {
  finishGeneration('download');
}

function handlePreviewClick() {
  finishGeneration('preview');
}

async function prepareGeneratedHtmlForInscription() {
  let inscribeWindow = null;
  try {
    const bundle = buildGeneratedHtmlBundle();
    if (!bundle) return;
    inscribeWindow = window.open('', 'xtrata-inscriber');
    const handoff = await storeHtmlHandoff(bundle);
    const url = new URL('../', window.location.href);
    url.searchParams.set('handoff', 'opus-player');
    url.searchParams.set('handoffId', handoff.id);
    url.hash = 'inscribe';
    setHtmlExportStatus(
      `Sent ${bundle.filename} to the Xtrata inscriber. Add parents, then prepare it there.`
    );
    if (inscribeWindow) {
      inscribeWindow.location.href = url.toString();
      inscribeWindow.focus();
    } else {
      window.open(url.toString(), 'xtrata-inscriber');
    }
  } catch (error) {
    if (inscribeWindow && inscribeWindow.location.href === 'about:blank') {
      inscribeWindow.close();
    }
    const message = error instanceof Error ? error.message : String(error);
    console.error('HTML inscription handoff failed:', error);
    setHtmlExportStatus(`Could not prepare inscription: ${message}`, true);
    alert(`Could not prepare inscription: ${message}`);
  }
}

function updateaudionalBase64(base64Data, mimeType) {
  audionalBase64 = base64Data;
  if (mimeType) audionalMimeType = mimeType;
  checkGenerateButtonState();
  scheduleLivePreviewUpdate();
}

function setStandaloneArtworkStatus(message, isError = false) {
  const status = getElement('standaloneArtworkStatus');
  if (!status) return;
  status.textContent = message;
  status.classList.toggle('error', Boolean(isError));
}

function resetStandaloneArtworkPreview(message = 'No artwork selected.', isError = false) {
  const preview = getElement('standaloneArtworkPreview');
  const clearButton = getElement('clearStandaloneArtworkButton');
  const output = getElement('standaloneArtworkBase64Output');
  if (preview) {
    preview.innerHTML = '<span>No visual selected</span>';
  }
  if (output) output.value = '';
  if (clearButton) clearButton.disabled = true;
  setStandaloneArtworkStatus(message, isError);
}

function renderStandaloneArtworkPreview(dataUrl, fileInfo = {}) {
  const preview = getElement('standaloneArtworkPreview');
  const clearButton = getElement('clearStandaloneArtworkButton');
  if (!preview) return;

  preview.innerHTML = '';
  const kind = getVisualKind(fileInfo.mimeType || audionalVisualMimeType);
  const media = document.createElement(kind === 'video' ? 'video' : 'img');
  media.src = dataUrl;
  if (kind === 'video') {
    media.controls = true;
    media.muted = true;
    media.loop = true;
    media.playsInline = true;
    media.preload = 'metadata';
  } else {
    media.alt = fileInfo.name || 'Player artwork';
  }
  preview.appendChild(media);
  if (clearButton) clearButton.disabled = false;

  const sizeText =
    typeof fileInfo.size === 'number' && typeof window.formatBytes === 'function'
      ? ` (${window.formatBytes(fileInfo.size)})`
      : '';
  setStandaloneArtworkStatus(
    `${fileInfo.name || 'Visual media'}${sizeText} embedded as ${
      fileInfo.mimeType || audionalVisualMimeType
    }.`
  );
}

function updateaudionalVisualBase64(base64Data, mimeType, fileName = '', options = {}) {
  const output = getElement('standaloneArtworkBase64Output');
  audionalVisualBase64 = base64Data;
  if (mimeType) audionalVisualMimeType = mimeType;
  audionalVisualName = fileName || '';
  if (output) output.value = base64Data ? stripDataURIPrefix(base64Data) : '';
  if (!base64Data) {
    audionalVisualName = '';
    audionalVisualOriginalBytes = null;
    if (options.renderPreview !== false) resetStandaloneArtworkPreview();
  } else if (options.renderPreview !== false) {
    const dataUrl = String(base64Data).startsWith('data:')
      ? base64Data
      : `data:${audionalVisualMimeType};base64,${stripDataURIPrefix(base64Data)}`;
    renderStandaloneArtworkPreview(dataUrl, {
      name: audionalVisualName || 'Visual media',
      mimeType: audionalVisualMimeType
    });
  }
  checkGenerateButtonState();
  scheduleLivePreviewUpdate();
}

async function handleStandaloneArtworkChange(event) {
  const input = event.currentTarget;
  const file = input.files?.[0] || null;
  if (!file) {
    updateaudionalVisualBase64(null);
    return;
  }

  if (!isSupportedVisualFile(file)) {
    input.value = '';
    updateaudionalVisualBase64(null, '', '', { renderPreview: false });
    resetStandaloneArtworkPreview('Use an image, GIF, or video file.', true);
    return;
  }

  setStandaloneArtworkStatus(`Reading ${file.name}...`);
  audionalVisualOriginalBytes = file.size;
  try {
    const dataUrl = await readFileAsDataUrl(file);
    updateaudionalVisualBase64(dataUrl, file.type, file.name, {
      renderPreview: false
    });
    renderStandaloneArtworkPreview(dataUrl, {
      name: file.name,
      size: file.size,
      mimeType: file.type
    });
  } catch (error) {
    console.error('Artwork conversion failed:', error);
    input.value = '';
    updateaudionalVisualBase64(null, '', '', { renderPreview: false });
    resetStandaloneArtworkPreview(
      error instanceof Error ? error.message : 'Artwork conversion failed.',
      true
    );
  }
}

function clearStandaloneArtwork() {
  const input = getElement('standaloneArtworkInput');
  if (input) input.value = '';
  updateaudionalVisualBase64(null);
}

function inithtmlGenerator() {
  if (
    !window.generateHtmlButton ||
    !window.metadataForm ||
    !window.titleInput ||
    !window.loopCheckbox ||
    !window.bpmInput
  ) {
    console.error('HTML generator elements not found. Check HTML IDs.');
    if (window.generateHtmlButton) window.generateHtmlButton.disabled = true;
    return;
  }

  window.generateHtmlButton.addEventListener('click', handleDownloadClick);
  window.metadataForm.addEventListener('submit', handleMetadataSubmit);
  if (window.previewHtmlButton) {
    window.previewHtmlButton.addEventListener('click', handlePreviewClick);
  }
  const inscribeHtmlButton = getElement('inscribeHtmlButton');
  if (inscribeHtmlButton) {
    inscribeHtmlButton.addEventListener('click', prepareGeneratedHtmlForInscription);
  }

  document.querySelectorAll('input[name="htmlPlayerMode"]').forEach((radio) => {
    radio.addEventListener('change', updateHtmlModeUI);
  });

  document.querySelectorAll('input[name="visualSourceMode"]').forEach((radio) => {
    radio.addEventListener('change', updateHtmlModeUI);
  });

  window.metadataForm.addEventListener('input', scheduleLivePreviewUpdate);
  window.metadataForm.addEventListener('change', scheduleLivePreviewUpdate);

  const standaloneArtworkInput = getElement('standaloneArtworkInput');
  if (standaloneArtworkInput) {
    standaloneArtworkInput.addEventListener('change', handleStandaloneArtworkChange);
  }

  const clearStandaloneArtworkButton = getElement('clearStandaloneArtworkButton');
  if (clearStandaloneArtworkButton) {
    clearStandaloneArtworkButton.addEventListener('click', clearStandaloneArtwork);
  }

  [
    'recursiveAudioTokenId',
    'recursiveAudioUrl',
    'recursiveContractId',
    'recursiveEndpointMode',
    'recursiveNetwork',
    'recursiveCoverTokenId',
    'recursiveCoverUrl',
    'recursiveCoverKind'
  ].forEach((id) => {
    const input = getElement(id);
    if (input) input.addEventListener('input', updateHtmlModeUI);
    if (input && input.tagName === 'SELECT') {
      input.addEventListener('change', updateHtmlModeUI);
    }
  });

  document.addEventListener('audionalBase64Generated', function (event) {
    updateaudionalBase64(event.detail.base64Data, event.detail.mimeType);
  });

  document.addEventListener('audionalVisualBase64Generated', function (event) {
    updateaudionalVisualBase64(event.detail.base64Data, event.detail.mimeType);
  });

  updateHtmlModeUI();
  scheduleLivePreviewUpdate();
  console.log('HTML Generator initialized.');
}

document.addEventListener('DOMContentLoaded', inithtmlGenerator);

window.updateaudionalBase64 = updateaudionalBase64;
window.updateaudionalVisualBase64 = updateaudionalVisualBase64;
window.updateHtmlGenerateButtonState = function () {
  checkGenerateButtonState();
  scheduleLivePreviewUpdate();
};
window.updateHtmlLivePreview = scheduleLivePreviewUpdate;
})();
