const GRID_PREVIEW_MARKER = 'data-xtrata-grid-preview';
const GRID_PREVIEW_SCRIPT_MARKER = 'data-xtrata-grid-fit-script';

const buildGridPreviewStyle = () => `<style ${GRID_PREVIEW_MARKER}="true">
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
    const scale = Math.min(1, viewportWidth / contentWidth, viewportHeight / contentHeight);
    body.style.transformOrigin = 'top left';
    body.style.transform = \`scale(\${scale})\`;
    body.style.width = \`\${100 / scale}%\`;
    body.style.height = \`\${100 / scale}%\`;
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

export const injectGridThumbnailHtml = (html: string) => {
  if (!html || html.includes(GRID_PREVIEW_MARKER)) {
    return html;
  }
  const style = `${buildGridPreviewStyle()}${buildGridPreviewScript()}`;
  if (html.includes('</head>')) {
    return html.replace('</head>', `${style}</head>`);
  }
  const afterHead = insertAfterTag(html, 'head', style);
  if (afterHead) {
    return afterHead;
  }
  const afterBody = insertAfterTag(html, 'body', style);
  if (afterBody) {
    return afterBody;
  }
  return `${style}${html}`;
};
