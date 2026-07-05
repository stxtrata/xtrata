// optimize-image.js — automatic "smallest sensible" still-image optimiser for the wizard.
//
// Browser port of the opus tool's Smart Image Compressor (see
// opus-file-generator/image-compressor.js). Reformats a still image to the SMALLEST of
// WebP / JPEG / PNG at balanced quality, keeping the original resolution — the same
// "best quality, smallest size" idea the audio path applies with Opus. Everything runs
// in the browser via the Canvas API + canvas.toBlob(): no server, no upload, exactly
// like the FFmpeg-WASM audio path. EXIF/ICC is dropped by canvas encoding (desirable —
// smaller cover art). Fail-safe: any decode/encode problem returns the original untouched.
//
// Public API mirrors XtrataAudioOptimizer so the batch can treat audio & images the same:
//   window.XtrataImageOptimizer = { optimize, isCandidate }
//   optimize(file, onStatus, opts) → always resolves:
//     { file, originalBytes, optimizedBytes }          — reformatted, smaller
//     { file, originalBytes, skipped: <reason> }        — original kept
(function () {
  'use strict';

  // Product decision: balanced quality, auto format, keep resolution.
  const PROFILE = { jpeg: 0.82, webp: 0.82 };
  const MIN_BYTES = 8 * 1024;   // below this the saving isn't worth a format change
  const KEEP_RATIO = 0.97;      // must save at least 3% or the original is kept

  // Still images canvas can faithfully re-encode. Animated GIF (one frame only) and
  // SVG (vector) are intentionally excluded — they pass through untouched.
  const STILL_MIME = /^image\/(png|jpeg|jpg|webp|bmp|tiff|x-icon|heic|heif|avif)$/i;
  const STILL_EXT = /\.(png|jpe?g|webp|bmp|tiff?|heic|heif|avif)$/i;
  const EXCLUDE = /(\.(gif|svg)$)|(image\/(gif|svg))/i;

  const EXT_FOR = { JPEG: '.jpg', PNG: '.png', WEBP: '.webp' };
  const MIME_FOR = { JPEG: 'image/jpeg', PNG: 'image/png', WEBP: 'image/webp' };

  const baseName = (name) => String(name || 'image').replace(/\.[^.]+$/, '');

  function isCandidate(name, size) {
    const n = String(name || '');
    if (EXCLUDE.test(n)) return false;
    if (!STILL_EXT.test(n)) return false;
    return (size || 0) >= MIN_BYTES;
  }

  async function decodeImage(file) {
    if (typeof createImageBitmap === 'function') {
      try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); }
      catch (_) { try { return await createImageBitmap(file); } catch (_2) { /* fall through */ } }
    }
    return await new Promise((resolve, reject) => {
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('decode failed')); };
      img.src = url;
    });
  }
  const natW = (d) => d.width || d.naturalWidth || 0;
  const natH = (d) => d.height || d.naturalHeight || 0;

  function drawToCanvas(decoded, w, h) {
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(decoded, 0, 0, w, h);
    return canvas;
  }

  function canvasHasAlpha(canvas) {
    try {
      const { data } = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
      const step = 4 * Math.max(1, Math.floor(data.length / 4 / 200000));
      for (let i = 3; i < data.length; i += step) if (data[i] < 255) return true;
      return false;
    } catch (_) { return false; }
  }

  function looksGraphic(decoded) {
    try {
      const tw = Math.max(1, Math.min(128, natW(decoded) || 128));
      const th = Math.max(1, Math.min(128, natH(decoded) || 128));
      const c = drawToCanvas(decoded, tw, th);
      const { data } = c.getContext('2d').getImageData(0, 0, c.width, c.height);
      const colors = new Set();
      for (let i = 0; i < data.length; i += 4) {
        colors.add((data[i] << 16) | (data[i + 1] << 8) | data[i + 2]);
        if (colors.size > 512) return false;
      }
      return colors.size <= 512;
    } catch (_) { return false; }
  }

  // auto format selection (ports the Python candidate_formats): try the likely-smallest
  // encoders and keep whichever blob is smallest.
  function candidateFormats(alpha, graphic) {
    if (alpha) return ['WEBP', 'PNG'];
    if (graphic) return ['WEBP', 'PNG', 'JPEG'];
    return ['WEBP', 'JPEG'];
  }

  const toBlob = (canvas, mime, q) => new Promise((res) => canvas.toBlob((b) => res(b), mime, q));

  function flattened(srcCanvas) {
    const c = document.createElement('canvas');
    c.width = srcCanvas.width; c.height = srcCanvas.height;
    const ctx = c.getContext('2d');
    ctx.fillStyle = 'rgb(255,255,255)'; ctx.fillRect(0, 0, c.width, c.height);
    ctx.drawImage(srcCanvas, 0, 0);
    return c;
  }

  async function encodeOne(canvas, fmt, alpha, graphic) {
    if (fmt === 'JPEG') return toBlob(flattened(canvas), 'image/jpeg', PROFILE.jpeg);
    if (fmt === 'WEBP') return toBlob(canvas, 'image/webp', (alpha || graphic) ? 1.0 : PROFILE.webp);
    if (fmt === 'PNG') return toBlob(canvas, 'image/png');   // lossless; quality arg ignored
    return null;
  }

  async function optimize(file, onStatus, _opts) {
    const originalBytes = file.size;
    const name = file.name || 'image';
    const type = file.type || '';
    if (EXCLUDE.test(name) || EXCLUDE.test(type)) return { file, originalBytes, skipped: 'not-compressible' };
    if (!STILL_EXT.test(name) && !STILL_MIME.test(type)) return { file, originalBytes, skipped: 'not-image' };
    if (originalBytes < MIN_BYTES) return { file, originalBytes, skipped: 'too-small' };

    let decoded;
    try {
      onStatus && onStatus('reformatting to a smaller image…');
      decoded = await decodeImage(file);
    } catch (_) { return { file, originalBytes, skipped: 'failed' }; }

    try {
      const w = natW(decoded), h = natH(decoded);
      if (!w || !h) { if (decoded.close) decoded.close(); return { file, originalBytes, skipped: 'failed' }; }
      const canvas = drawToCanvas(decoded, w, h);
      if (decoded.close) decoded.close();
      const alpha = canvasHasAlpha(canvas);
      const graphic = looksGraphic(canvas);

      let best = null; // { fmt, blob }
      for (const fmt of candidateFormats(alpha, graphic)) {
        let blob = null;
        try { blob = await encodeOne(canvas, fmt, alpha, graphic); } catch (_) { /* skip format */ }
        if (blob && (!best || blob.size < best.blob.size)) best = { fmt, blob };
      }
      if (!best) return { file, originalBytes, skipped: 'failed' };
      if (best.blob.size >= originalBytes * KEEP_RATIO) return { file, originalBytes, skipped: 'already-efficient' };

      const optimized = new File([best.blob], baseName(name) + EXT_FOR[best.fmt], {
        type: MIME_FOR[best.fmt], lastModified: Date.now(),
      });
      return { file: optimized, originalBytes, optimizedBytes: optimized.size, format: best.fmt };
    } catch (_) {
      return { file, originalBytes, skipped: 'failed' };
    }
  }

  window.XtrataImageOptimizer = { optimize, isCandidate };
})();
