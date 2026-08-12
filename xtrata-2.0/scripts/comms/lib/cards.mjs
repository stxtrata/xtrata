//
// Generated image cards for the comms harness.
//
// These exist so that every post has at least one image option even when there
// is nothing to screenshot. A post about reconstruction has no UI to capture,
// but it still competes in a timeline against posts that have pictures.
//
// The rules are the same as the copy rules in comms/registry/voice.md: no hype,
// no decoration for its own sake, state the thing plainly. A card that looks
// like a stock marketing graphic is worse than no card, because it reads as an
// advertisement rather than as a claim somebody is standing behind.

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const SHELL = (main, foot, extraCss = '') => `<!doctype html>
<html><head><meta charset="utf-8"><style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { width: 1200px; height: 675px; }
  body {
    background: #0e0f13;
    color: #e9eaf0;
    font-family: -apple-system, "Helvetica Neue", "Segoe UI", system-ui, sans-serif;
    display: flex; flex-direction: column;
    padding: 68px 80px 58px;
    position: relative; overflow: hidden;
  }
  /* The content takes the space the footer does not, and centres inside it.
     Top-aligning leaves a dead third at the bottom of every card, which reads
     as a template somebody forgot to finish. */
  .main { flex: 1; display: flex; flex-direction: column; justify-content: center; }
  /* A single hairline rule rather than a gradient or a glow. The brand is
     "serious infrastructure", and restraint is the entire visual argument. */
  body::before {
    content: ''; position: absolute; left: 0; right: 0; top: 0; height: 5px;
    background: linear-gradient(90deg, #8fb0ff 0%, #7ee2a8 100%);
  }
  .foot {
    display: flex; align-items: baseline; justify-content: space-between;
    gap: 24px; font-size: 24px; color: #6f7482; letter-spacing: .01em;
  }
  .foot .url { color: #8fb0ff; }
  ${extraCss}
</style></head><body><div class="main">${main}</div>${foot}</body></html>`;

/**
 * A post's own words, set large.
 *
 * Only the leading statement is used, never the whole post. The card is not a
 * screenshot of the tweet, it is the line the tweet is built around, and
 * repeating the full text under the full text reads as a mistake.
 */
export const quoteCard = ({ text, surface, url }) => {
  const lead = String(text)
    .split('\n\n')[0]
    .replace(/https?:\/\/\S+/g, '')
    .trim();

  // Long lines need to stay on one screen without becoming a wall. These
  // breakpoints were tuned against the real corpus rather than guessed.
  const size = lead.length > 150 ? 54 : lead.length > 100 ? 64 : lead.length > 60 ? 76 : 88;

  return SHELL(
    `<div class="quote">${esc(lead)}</div>`,
    `<div class="foot"><span>${esc(surface ?? 'Xtrata')}</span><span class="url">${esc(url ?? 'xtrata.xyz')}</span></div>`,
    `.quote { font-size: ${size}px; line-height: 1.22; font-weight: 600;
       letter-spacing: -0.02em; max-width: 15.5em; }`
  );
};

/**
 * Numbers read from the chain, presented as a table rather than as a boast.
 *
 * Every value here has to come from a harvested signal. A stat card that
 * invents a number is worse than a hype adjective, because it looks checkable.
 */
export const statCard = ({ title, stats, url, footnote }) =>
  SHELL(
    `<div class="title">${esc(title)}</div>
     <div class="grid">
       ${stats
         .map(
           (s) => `<div class="stat">
             <div class="value">${esc(s.value)}</div>
             <div class="label">${esc(s.label)}</div>
           </div>`
         )
         .join('')}
     </div>`,
    `<div class="foot">
       <span>${esc(footnote ?? '')}</span>
       <span class="url">${esc(url ?? 'xtrata.xyz')}</span>
     </div>`,
    `.title { font-size: 40px; font-weight: 600; letter-spacing: -0.01em; margin-bottom: 54px; }
     .grid { display: flex; gap: 72px; flex-wrap: wrap; }
     .value { font-size: 108px; font-weight: 700; letter-spacing: -0.03em; line-height: 1;
       font-variant-numeric: tabular-nums; }
     .label { font-size: 26px; color: #9498a6; margin-top: 14px; }`
  );
