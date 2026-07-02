/**
 * image-compressor.js
 * -------------------
 * Client-side image compression engine for the Audional Art Tools wizard.
 *
 * This is a browser port of the Python/Pillow "Smart Image Compressor" so that
 * compression runs entirely in the user's browser (no server, no upload) -- the
 * same privacy guarantee as the FFmpeg-WASM audio path.
 *
 * Public API:
 *   - QUALITY_PROFILES
 *   - compressImage(file, settings)  -> Promise<CompressResult>
 *   - humanSize(bytes)               -> string
 *
 * A CompressResult looks like:
 *   {
 *     status: 'ok' | 'skipped' | 'error',
 *     blob, mime, ext, dataUrl,           // null when skipped/error
 *     report: { originalBytes, compressedBytes, savedBytes, savedPercent,
 *               format, ext, originalWidth, originalHeight,
 *               compressedWidth, compressedHeight, wouldSkip, detail }
 *   }
 *
 * Settings (all optional, sensible defaults applied):
 *   {
 *     mode: 'high' | 'balanced' | 'small',          // default 'balanced'
 *     outputFormat: 'auto'|'same'|'jpeg'|'png'|'webp', // default 'auto'
 *     maxLongEdge: number,   // 0 = keep original size; default 0
 *     skipLarger: boolean,   // default true
 *     jpegBackground: [r,g,b] // default white, used when flattening alpha to JPEG
 *   }
 */

// Quality profiles mirror encode_profile() in the Python original.
// (PNG color-quantization from the "small" profile is not available natively
// in the browser, so PNG is always lossless here; WebP/JPEG normally win in
// "auto" mode anyway.)
export const QUALITY_PROFILES = {
  high:     { jpeg: 0.90, webp: 0.92 },
  balanced: { jpeg: 0.82, webp: 0.82 },
  small:    { jpeg: 0.72, webp: 0.72 },
};

const EXT_FOR_FORMAT = { JPEG: '.jpg', PNG: '.png', WEBP: '.webp' };
const MIME_FOR_FORMAT = { JPEG: 'image/jpeg', PNG: 'image/png', WEBP: 'image/webp' };

// File types we will attempt to compress as still images.
// Animated GIF / video are intentionally excluded (canvas only captures one frame).
const STILL_IMAGE_TYPES = /^image\/(png|jpeg|jpg|webp|bmp|tiff|x-icon|heic|heif|avif)$/i;

export function isCompressibleImage(file) {
  if (!file) return false;
  if (file.type && STILL_IMAGE_TYPES.test(file.type)) return true;
  // Fall back to extension when the browser reports no/odd MIME type.
  return /\.(png|jpe?g|webp|bmp|tiff?|heic|heif|avif)$/i.test(file.name || '');
}

export function humanSize(num) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let n = Number(num) || 0;
  for (let i = 0; i < units.length; i++) {
    if (n < 1024 || i === units.length - 1) {
      return units[i] === 'B' ? `${Math.round(n)} B` : `${n.toFixed(1)} ${units[i]}`;
    }
    n /= 1024;
  }
  return `${num} B`;
}

function defaults(settings = {}) {
  return {
    mode: settings.mode || 'balanced',
    outputFormat: (settings.outputFormat || 'auto').toLowerCase(),
    maxLongEdge: Math.max(0, parseInt(settings.maxLongEdge, 10) || 0),
    skipLarger: settings.skipLarger !== false,
    jpegBackground: settings.jpegBackground || [255, 255, 255],
  };
}

// ---- Decoding -------------------------------------------------------------

async function decodeImage(file) {
  // Prefer createImageBitmap (fast, off-thread, honours orientation when asked).
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file, { imageOrientation: 'from-image' });
    } catch (_) {
      try {
        return await createImageBitmap(file);
      } catch (_) { /* fall through */ }
    }
  }
  // Fallback: HTMLImageElement via object URL.
  return await new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Could not decode image.')); };
    img.src = url;
  });
}

function naturalSize(decoded) {
  const w = decoded.width || decoded.naturalWidth;
  const h = decoded.height || decoded.naturalHeight;
  return { w, h };
}

function drawToCanvas(decoded, targetW, targetH) {
  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(decoded, 0, 0, targetW, targetH);
  return canvas;
}

// ---- Analysis (ports has_alpha + looks_graphic) --------------------------

function canvasHasAlpha(canvas) {
  try {
    const ctx = canvas.getContext('2d');
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    // Sample every 4th pixel for speed on large images.
    const step = 4 * Math.max(1, Math.floor(data.length / 4 / 200000));
    for (let i = 3; i < data.length; i += step) {
      if (data[i] < 255) return true;
    }
    return false;
  } catch (_) {
    return false;
  }
}

function looksGraphic(decoded) {
  try {
    const tw = Math.min(128, naturalSize(decoded).w || 128);
    const th = Math.min(128, naturalSize(decoded).h || 128);
    const c = drawToCanvas(decoded, Math.max(1, tw), Math.max(1, th));
    const { data } = c.getContext('2d').getImageData(0, 0, c.width, c.height);
    const colors = new Set();
    for (let i = 0; i < data.length; i += 4) {
      // Pack RGB into one int; cap the set to bail out early.
      colors.add((data[i] << 16) | (data[i + 1] << 8) | data[i + 2]);
      if (colors.size > 512) return false;
    }
    return colors.size <= 512;
  } catch (_) {
    return false;
  }
}

// ---- Format selection (ports candidate_formats) --------------------------

function candidateFormats(alpha, graphic, requested, sourceType) {
  const src = (sourceType || '').toLowerCase();
  if (requested === 'same') {
    if (src.includes('png')) return ['PNG'];
    if (src.includes('jpeg') || src.includes('jpg')) return ['JPEG'];
    if (src.includes('webp')) return ['WEBP'];
    return ['WEBP'];
  }
  if (requested === 'jpeg') return ['JPEG'];
  if (requested === 'png') return ['PNG'];
  if (requested === 'webp') return ['WEBP'];

  // auto
  if (alpha) return ['WEBP', 'PNG'];
  if (graphic) return ['WEBP', 'PNG', 'JPEG'];
  return ['WEBP', 'JPEG'];
}

// ---- Encoding -------------------------------------------------------------

function toBlob(canvas, mime, quality) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mime, quality);
  });
}

function flattenedCanvas(srcCanvas, background) {
  const c = document.createElement('canvas');
  c.width = srcCanvas.width;
  c.height = srcCanvas.height;
  const ctx = c.getContext('2d');
  ctx.fillStyle = `rgb(${background[0]},${background[1]},${background[2]})`;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(srcCanvas, 0, 0);
  return c;
}

async function encodeOne(srcCanvas, fmt, profile, opts) {
  if (fmt === 'JPEG') {
    const flat = flattenedCanvas(srcCanvas, opts.jpegBackground);
    return toBlob(flat, 'image/jpeg', profile.jpeg);
  }
  if (fmt === 'WEBP') {
    // Graphics/alpha at high quality approximate the Python "lossless" path.
    const q = (opts.alpha || opts.graphic) && (opts.mode === 'high' || opts.mode === 'balanced')
      ? 1.0
      : profile.webp;
    return toBlob(srcCanvas, 'image/webp', q);
  }
  if (fmt === 'PNG') {
    // PNG is lossless; browsers ignore the quality argument.
    return toBlob(srcCanvas, 'image/png');
  }
  return null;
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Could not read compressed blob.'));
    reader.readAsDataURL(blob);
  });
}

// ---- Public entry point ---------------------------------------------------

export async function compressImage(file, settings = {}) {
  const opts = defaults(settings);
  const originalBytes = file.size;

  const report = {
    source: file.name,
    status: 'error',
    originalBytes,
    compressedBytes: 0,
    savedBytes: 0,
    savedPercent: 0,
    format: null,
    ext: null,
    originalWidth: null,
    originalHeight: null,
    compressedWidth: null,
    compressedHeight: null,
    wouldSkip: false,
    detail: '',
  };

  let decoded;
  try {
    decoded = await decodeImage(file);
  } catch (err) {
    report.detail = err.message || 'Decode failed.';
    return { status: 'error', blob: null, mime: null, ext: null, dataUrl: null, report };
  }

  const { w: ow, h: oh } = naturalSize(decoded);
  report.originalWidth = ow;
  report.originalHeight = oh;

  // Resize (ports resize_if_needed).
  let tw = ow, th = oh;
  if (opts.maxLongEdge > 0 && Math.max(ow, oh) > opts.maxLongEdge) {
    const scale = opts.maxLongEdge / Math.max(ow, oh);
    tw = Math.max(1, Math.round(ow * scale));
    th = Math.max(1, Math.round(oh * scale));
  }
  report.compressedWidth = tw;
  report.compressedHeight = th;

  const srcCanvas = drawToCanvas(decoded, tw, th);
  if (decoded.close) decoded.close();

  const alpha = canvasHasAlpha(srcCanvas);
  const graphic = looksGraphic(srcCanvas);
  const profile = QUALITY_PROFILES[opts.mode] || QUALITY_PROFILES.balanced;
  const candidates = candidateFormats(alpha, graphic, opts.outputFormat, file.type);
  const encodeOpts = { ...opts, alpha, graphic };

  let best = null; // { fmt, blob }
  for (const fmt of candidates) {
    let blob = null;
    try {
      blob = await encodeOne(srcCanvas, fmt, profile, encodeOpts);
    } catch (_) { /* skip this format */ }
    if (blob && (!best || blob.size < best.blob.size)) {
      best = { fmt, blob };
    }
  }

  if (!best) {
    report.detail = 'No supported encoder could save this image.';
    return { status: 'error', blob: null, mime: null, ext: null, dataUrl: null, report };
  }

  const compressedBytes = best.blob.size;
  const saved = originalBytes - compressedBytes;
  const pct = originalBytes ? (saved / originalBytes) * 100 : 0;
  const wouldSkip = opts.skipLarger && compressedBytes >= originalBytes;

  report.compressedBytes = compressedBytes;
  report.savedBytes = saved;
  report.savedPercent = pct;
  report.format = best.fmt;
  report.ext = EXT_FOR_FORMAT[best.fmt];
  report.wouldSkip = wouldSkip;
  report.detail = saved >= 0
    ? `${best.fmt} · saved ${humanSize(saved)} (${pct.toFixed(1)}%)`
    : `${best.fmt} · larger by ${humanSize(-saved)} (${Math.abs(pct).toFixed(1)}%)`;

  if (wouldSkip) {
    report.status = 'skipped';
    return { status: 'skipped', blob: null, mime: null, ext: null, dataUrl: null, report };
  }

  report.status = 'ok';
  const mime = MIME_FOR_FORMAT[best.fmt];
  const dataUrl = await blobToDataUrl(best.blob);
  return { status: 'ok', blob: best.blob, mime, ext: EXT_FOR_FORMAT[best.fmt], dataUrl, report };
}
