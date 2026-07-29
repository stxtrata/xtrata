const GRID_PREVIEW_MARKER = 'data-xtrata-grid-preview';
const GRID_PREVIEW_SCRIPT_MARKER = 'data-xtrata-grid-fit-script';
const INTERACTIVE_PREVIEW_MARKER = 'data-xtrata-interactive-preview';

const buildGridPreviewStyle = () => `<style ${GRID_PREVIEW_MARKER}="true">
/* A tiny HTML inscription that brings no styles of its own — "Library",
   "Music", a title and nothing else — used to render on the browser's default
   white canvas, so it sat in the grid as a white card among black ones.
   color-scheme is the right tool rather than a background declaration: it moves
   only the UA DEFAULT, so an inscription that paints its own background is
   untouched. :where() keeps the specificity at zero, so any rule the
   inscription itself declares wins regardless of source order — this can
   never repaint someone's artwork. */
:where(:root) {
  color-scheme: dark;
}

html, body {
  margin: 0 !important;
  padding: 0 !important;
  width: 100% !important;
  height: 100% !important;
  min-width: 0 !important;
  min-height: 100% !important;
  overflow: hidden !important;
}

body {
  position: relative !important;
  transform-origin: top left !important;
}

body > main:only-child,
body > div:only-child,
body > canvas:first-of-type,
body > svg:first-of-type,
body > img:first-of-type,
body > video:first-of-type {
  position: absolute !important;
  left: 50% !important;
  top: 50% !important;
  transform: translate(-50%, -50%) !important;
  transform-origin: center center !important;
  min-width: 0 !important;
  min-height: 0 !important;
  max-width: 100% !important;
  max-height: 100% !important;
}
</style>`;

const buildGridPreviewScript = () => `<script ${GRID_PREVIEW_SCRIPT_MARKER}="true">
(() => {
  const applyXtrataGridPreviewScale = () => {
    const body = document.body;
    if (!body) return;
    body.style.transform = '';
    body.style.width = '100%';
    body.style.height = '100%';
    const viewportWidth = Math.max(1, window.innerWidth || document.documentElement.clientWidth || 1);
    const viewportHeight = Math.max(1, window.innerHeight || document.documentElement.clientHeight || 1);
    const contentWidth = Math.max(
      body.scrollWidth,
      document.documentElement.scrollWidth,
      body.offsetWidth,
      viewportWidth
    );
    const contentHeight = Math.max(
      body.scrollHeight,
      document.documentElement.scrollHeight,
      body.offsetHeight,
      viewportHeight
    );
    const compactAppLike = contentHeight <= viewportHeight * 1.5;
    const scale = compactAppLike
      ? Math.min(1, viewportWidth / contentWidth, viewportHeight / contentHeight)
      : Math.min(1, viewportWidth / contentWidth);
    body.style.transformOrigin = 'top left';
    body.style.transform = \`scale(\${scale})\`;
    body.style.width = \`\${100 / scale}%\`;
    body.style.height = compactAppLike ? \`\${100 / scale}%\` : 'auto';
  };
  const schedule = () => requestAnimationFrame(() => {
    applyXtrataGridPreviewScale();
    setTimeout(applyXtrataGridPreviewScale, 120);
    setTimeout(applyXtrataGridPreviewScale, 500);
  });
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule, { once: true });
  } else {
    schedule();
  }
  window.addEventListener('load', schedule, { once: true });
  window.addEventListener('resize', schedule);
})();
</script>`;

const insertAfterTag = (html: string, tagName: string, content: string) => {
  const regex = new RegExp(`<${tagName}[^>]*>`, 'i');
  const match = html.match(regex);
  if (!match || match.index === undefined) {
    return null;
  }
  const index = match.index + match[0].length;
  return `${html.slice(0, index)}${content}${html.slice(index)}`;
};

const injectPreviewContent = (html: string, marker: string, content: string) => {
  if (!html || html.includes(marker)) {
    return html;
  }
  if (html.includes('</head>')) {
    return html.replace('</head>', `${content}</head>`);
  }
  const afterHead = insertAfterTag(html, 'head', content);
  if (afterHead) {
    return afterHead;
  }
  const afterBody = insertAfterTag(html, 'body', content);
  if (afterBody) {
    return afterBody;
  }
  return `${content}${html}`;
};

export const injectGridThumbnailHtml = (html: string) => {
  const style = `${buildGridPreviewStyle()}${buildGridPreviewScript()}`;
  return injectPreviewContent(html, GRID_PREVIEW_MARKER, style);
};

const PLAYBACK_SHIM_MARKER = 'data-xtrata-playback-shim';

/**
 * Rescues already-inscribed audio players that cannot play on a phone.
 *
 * Players generated from 2026-07-03 onward decode the WHOLE track to raw PCM at load,
 * purely to draw a waveform. One minute of 48 kHz stereo float32 is ~23 MB, so a long
 * track runs to hundreds of megabytes. Desktop absorbs it; a phone does not, and when
 * the decode blows the frame's memory the <audio> element beside it dies too — the
 * player sits at 0:00 reading "ready to play" and the tap does nothing.
 *
 * The template is fixed going forward, but inscriptions are PERMANENT: every player
 * already on chain would stay broken on mobile forever. This is the one lever we have.
 *
 * Why it is safe rather than a rewrite of someone's artwork:
 *   - the inscribed bytes are untouched, and so is the content hash. This changes the
 *     runtime environment the player is given, exactly as a browser polyfill does, and
 *     the page already injects into <head> for preview styling.
 *   - the player's own decode chain ends in `.catch()`, whose documented behaviour is
 *     "on any failure the seeded placeholder remains". Failing the decode therefore
 *     takes a branch THE AUTHOR WROTE. We are not inventing a fallback.
 *   - it only engages on a memory-constrained device AND an oversized buffer, so
 *     desktop rendering is bit-for-bit what it was.
 *
 * Playback is the product. A waveform is decoration.
 */
const buildPlaybackShim = () => `<script ${PLAYBACK_SHIM_MARKER}="true">
(function () {
  try {
    var Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx || !Ctx.prototype || typeof Ctx.prototype.decodeAudioData !== 'function') return;
    var memory = navigator.deviceMemory;
    var constrained =
      (typeof memory === 'number' && memory <= 4) ||
      /iPhone|iPad|iPod|Android/i.test(navigator.userAgent || '');
    if (!constrained) return;
    var MAX_DECODE_BYTES = 3000000;
    var original = Ctx.prototype.decodeAudioData;
    Ctx.prototype.decodeAudioData = function (buffer) {
      if (buffer && buffer.byteLength > MAX_DECODE_BYTES) {
        return Promise.reject(
          new Error('xtrata: waveform decode skipped so playback survives on this device')
        );
      }
      return original.apply(this, arguments);
    };
  } catch (_error) {
    /* a shim must never be the reason a player fails to start */
  }
})();
<\/script>`;

export const injectMobilePlaybackShim = (html: string) =>
  injectPreviewContent(html, PLAYBACK_SHIM_MARKER, buildPlaybackShim());

export const injectInteractivePreviewHtml = (html: string) =>
  injectPreviewContent(
    html,
    INTERACTIVE_PREVIEW_MARKER,
    `<style ${INTERACTIVE_PREVIEW_MARKER}="true">
.click-hint {
  display: flex !important;
}
</style>`
  );
