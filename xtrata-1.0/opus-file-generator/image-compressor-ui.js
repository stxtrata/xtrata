/**
 * image-compressor-ui.js
 * ----------------------
 * Wires the client-side image compressor into Step 2 (Visual / Cover art).
 *
 * When the user picks a still image for the embedded cover, an "Optimise image"
 * panel expands inline under the upload. They can tune balance / format / size,
 * see a live original-vs-compressed comparison, and then:
 *   - "Use compressed version"  -> feeds the result into the existing
 *                                  window.updateaudionalVisualBase64 state so the
 *                                  rest of the wizard (preview, HTML export,
 *                                  base64 textarea) just works, or
 *   - "Download .ext"           -> save the optimised file, or
 *   - "Copy base64"             -> copy the pure base64 string.
 *
 * Self-contained: injects its own markup using existing app CSS classes, so no
 * changes to index.html's Step 2 body are required beyond loading this module.
 */

import { compressImage, isCompressibleImage, humanSize } from './image-compressor.js';

let currentFile = null;       // the original File selected for the cover
let lastResult = null;        // last successful CompressResult
let debounceTimer = null;
let els = {};                 // cached panel elements

function buildPanel() {
  const wrap = document.createElement('div');
  wrap.id = 'imageCompressorPanel';
  wrap.className = 'compact-box';
  wrap.style.display = 'none';
  wrap.style.marginTop = '10px';
  wrap.innerHTML = `
    <h3>Optimise image <small style="font-weight:600;color:var(--muted);text-transform:none;">— shrink before embedding</small></h3>
    <div class="form-stack">
      <div class="settings-grid">
        <label class="field" for="ic-mode">
          <span>Balance</span>
          <select id="ic-mode">
            <option value="high">High quality</option>
            <option value="balanced" selected>Balanced</option>
            <option value="small">Smallest file</option>
          </select>
        </label>
        <label class="field" for="ic-format">
          <span>Output format</span>
          <select id="ic-format">
            <option value="auto" selected>Auto best</option>
            <option value="same">Same as source</option>
            <option value="webp">WebP</option>
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
          </select>
        </label>
        <label class="field" for="ic-edge">
          <span>Max long edge</span>
          <select id="ic-edge">
            <option value="0" selected>Original size</option>
            <option value="2048">2048 px</option>
            <option value="1600">1600 px</option>
            <option value="1200">1200 px</option>
            <option value="800">800 px</option>
          </select>
        </label>
        <label class="field" for="ic-skip">
          <span>If output is larger</span>
          <select id="ic-skip">
            <option value="1" selected>Keep original</option>
            <option value="0">Use compressed anyway</option>
          </select>
        </label>
      </div>

      <div class="standalone-artwork-grid">
        <div class="standalone-artwork-preview" id="ic-preview"><span>Compressed preview</span></div>
        <div>
          <p class="standalone-artwork-status" id="ic-status">Adjust settings to preview.</p>
          <div class="info-summary-section" id="ic-stats" style="margin-top:6px;"></div>
        </div>
      </div>

      <div class="button-row" style="display:flex;gap:8px;flex-wrap:wrap;">
        <button type="button" id="ic-use" class="button" disabled>Use compressed version</button>
        <button type="button" id="ic-download" class="button-small" disabled>Download</button>
        <button type="button" id="ic-copy" class="button-small" disabled>Copy base64</button>
        <button type="button" id="ic-revert" class="button-small" disabled>Revert to original</button>
      </div>
    </div>
  `;
  return wrap;
}

function readSettings() {
  return {
    mode: els.mode.value,
    outputFormat: els.format.value,
    maxLongEdge: parseInt(els.edge.value, 10) || 0,
    skipLarger: els.skip.value === '1',
  };
}

function statPill(label, value, tone = '') {
  const color = tone === 'good' ? 'var(--success)'
    : tone === 'bad' ? 'var(--error)'
    : tone === 'warn' ? 'var(--amber)' : 'var(--ink)';
  return `<p>${label} <span class="preview-value" style="color:${color};font-weight:700;">${value}</span></p>`;
}

function showStats(report) {
  const pct = Number(report.savedPercent || 0);
  const changeTone = report.wouldSkip ? 'warn' : pct >= 0 ? 'good' : 'bad';
  const changeText = pct >= 0
    ? `Saved ${humanSize(report.savedBytes)} (${pct.toFixed(1)}%)`
    : `Larger by ${humanSize(-report.savedBytes)} (${Math.abs(pct).toFixed(1)}%)`;
  els.stats.innerHTML =
    statPill('Original', `${humanSize(report.originalBytes)} · ${report.originalWidth}×${report.originalHeight}`) +
    statPill('Compressed', `${humanSize(report.compressedBytes)} · ${report.compressedWidth}×${report.compressedHeight} · ${report.format}`) +
    statPill('Change', changeText, changeTone);
}

async function recompress() {
  if (!currentFile) return;
  els.status.textContent = 'Compressing…';
  els.use.disabled = els.download.disabled = els.copy.disabled = true;

  let result;
  try {
    result = await compressImage(currentFile, readSettings());
  } catch (err) {
    els.status.textContent = `Error: ${err.message}`;
    els.status.classList.add('error');
    return;
  }
  els.status.classList.remove('error');

  if (result.status === 'skipped') {
    lastResult = null;
    els.preview.innerHTML = '<span>Original is already smaller</span>';
    els.status.textContent = 'Compressed output would be larger — original kept.';
    showStats(result.report);
    return;
  }
  if (result.status === 'error') {
    lastResult = null;
    els.status.textContent = `Could not compress: ${result.report.detail}`;
    return;
  }

  lastResult = result;
  els.preview.innerHTML = `<img src="${result.dataUrl}" alt="Compressed preview">`;
  els.status.textContent = result.report.detail;
  showStats(result.report);
  els.use.disabled = els.download.disabled = els.copy.disabled = false;
}

function recompressDebounced(delay = 250) {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(recompress, delay);
}

function onArtworkSelected(file) {
  if (file && isCompressibleImage(file)) {
    currentFile = file;
    els.panel.style.display = 'block';
    els.revert.disabled = false;
    recompressDebounced(60);
  } else {
    // Video / animated GIF / unsupported -> hide the optimiser, leave embed as-is.
    currentFile = null;
    lastResult = null;
    els.panel.style.display = 'none';
  }
}

function useCompressed() {
  if (!lastResult || typeof window.updateaudionalVisualBase64 !== 'function') return;
  const baseName = (currentFile.name || 'cover').replace(/\.[^/.]+$/, '');
  window.updateaudionalVisualBase64(lastResult.dataUrl, lastResult.mime, `${baseName}${lastResult.ext}`);
  els.status.textContent = 'Compressed version is now the cover art.';
}

function revertOriginal() {
  if (!currentFile || typeof window.updateaudionalVisualBase64 !== 'function') return;
  const reader = new FileReader();
  reader.onload = () => {
    window.updateaudionalVisualBase64(reader.result, currentFile.type, currentFile.name);
    els.status.textContent = 'Reverted to the original image.';
  };
  reader.readAsDataURL(currentFile);
}

function downloadCompressed() {
  if (!lastResult) return;
  const baseName = (currentFile.name || 'cover').replace(/\.[^/.]+$/, '');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(lastResult.blob);
  a.download = `${baseName}_compressed${lastResult.ext}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

async function copyBase64() {
  if (!lastResult) return;
  const pure = String(lastResult.dataUrl).split(',')[1] || '';
  try {
    await navigator.clipboard.writeText(pure);
    const t = els.copy.textContent;
    els.copy.textContent = 'Copied!';
    setTimeout(() => { els.copy.textContent = t; }, 1500);
  } catch (_) {
    els.status.textContent = 'Clipboard unavailable — use Download instead.';
  }
}

export function initImageCompressorUI() {
  const input = document.getElementById('standaloneArtworkInput');
  const embeddedBox = document.getElementById('embeddedVisualOptions');
  if (!input || !embeddedBox) return; // Step 2 markup not present.

  const panel = buildPanel();
  const formStack = embeddedBox.querySelector('.form-stack') || embeddedBox;
  formStack.appendChild(panel);

  els = {
    panel,
    mode: panel.querySelector('#ic-mode'),
    format: panel.querySelector('#ic-format'),
    edge: panel.querySelector('#ic-edge'),
    skip: panel.querySelector('#ic-skip'),
    preview: panel.querySelector('#ic-preview'),
    status: panel.querySelector('#ic-status'),
    stats: panel.querySelector('#ic-stats'),
    use: panel.querySelector('#ic-use'),
    download: panel.querySelector('#ic-download'),
    copy: panel.querySelector('#ic-copy'),
    revert: panel.querySelector('#ic-revert'),
  };

  // React to the existing upload input (runs alongside the app's own handler).
  input.addEventListener('change', (e) => onArtworkSelected(e.target.files?.[0] || null));

  ['mode', 'format', 'edge', 'skip'].forEach((k) =>
    els[k].addEventListener('change', () => recompressDebounced(120)));

  els.use.addEventListener('click', useCompressed);
  els.download.addEventListener('click', downloadCompressed);
  els.copy.addEventListener('click', copyBase64);
  els.revert.addEventListener('click', revertOriginal);

  console.log('Image compressor UI initialised.');
}
