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

/* Player chrome, in a thumbnail nobody can click.

   The inscribed audio player starts its transport visible on purpose: hiding it
   until a pointer event meant that on a phone the artwork was the only thing you
   could tap, with no visible control to aim at. That is right for a player and
   wrong for a 180px tile, where the waveform, the seek bar and the timestamps
   cover the artwork they are supposed to sit under and none of them can be used.

   Fixed here rather than in the template for two reasons. Changing the template
   would reintroduce the phone bug it was written to fix, and it would do nothing
   for the players already inscribed — they are permanent, and every one of them
   is in this grid.

   [data-player-control] is the template's own marker for its controls, so this
   hides what that author called chrome and cannot touch an inscription that does
   not use it. The artwork, the title and the scrim behind it all stay. */
[data-player-control] {
  display: none !important;
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
