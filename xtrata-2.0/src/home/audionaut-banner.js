// The Audionaut banner on the homepage: the THE / AUDIONAUT wordmark drawn as SVG and revealed
// with animation 35 from the typeface studies ("Twin Eclipses"): each letter opens as a circle of
// light, alternate letters from opposite sides. Plays once when the banner scrolls into view and
// again on hover or keyboard focus. With reduced motion the wordmark just shows.
const NS = 'http://www.w3.org/2000/svg';

// Typeface study 1, "Architectural": light-on-black, Gill Sans with system fallbacks (no font files).
const FONT = 'Gill Sans, Gill Sans MT, Calibri, Arial, sans-serif';
const WEIGHT = 600;
const SPACING = 3;
const STRETCH = 1.06;
const CENTER = 700;

// Animation 35 timing. SPEED is the study's playback-speed setting (1 = as designed).
const DURATION_MS = 3900;
const STAGGER_MS = 260;
const SPEED = 0.06;
const EASING = 'cubic-bezier(.22,1,.36,1)';

const el = (tag, attrs, parent) => {
  const node = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
  parent.appendChild(node);
  return node;
};

/** Draws the two-tier lockup and returns the letter groups in reading order. */
export const drawWordmark = (group, measure) => {
  const letters = [];
  const line = (word, size, y, maxWidth, tracking) => {
    const items = [];
    let total = 0;
    for (const ch of word) {
      const w = ch === 'A' ? size * 0.72 : measure(ch, size);
      items.push({ ch, x: total, w });
      total += w + tracking;
    }
    total -= tracking;
    const scaleX = STRETCH * Math.min(1, maxWidth / (total * STRETCH));
    const x0 = CENTER - (total * scaleX) / 2;
    const g = el('g', { transform: `translate(${x0.toFixed(3)} 0) scale(${scaleX.toFixed(6)} 1)` }, group);
    for (const { ch, x, w } of items) {
      const wrapper = el('g', { 'data-letter': ch }, g);
      letters.push(wrapper);
      if (ch === 'A') {
        // The signature A: a drawn shape, so both As match at any size.
        const left = x + size * 0.035;
        const right = x + w - size * 0.035;
        const peak = (left + right) / 2;
        const apex = y - size * 0.73;
        const thick = size * 0.165;
        el('path', {
          d: `M ${left} ${y} L ${peak - thick * 0.13} ${apex} L ${peak + thick * 0.13} ${apex} L ${right} ${y} L ${right - thick} ${y} L ${peak} ${apex + thick * 1.55} L ${left + thick} ${y} Z`,
          fill: 'white'
        }, wrapper);
      } else {
        const t = el('text', {
          x: x.toFixed(3), y, 'font-family': FONT, 'font-weight': WEIGHT, 'font-size': size, fill: 'white'
        }, wrapper);
        t.textContent = ch;
      }
    }
  };
  line('THE', 52, 65, 400, SPACING * 0.7);
  line('AUDIONAUT', 156, 218, 1320, SPACING);
  return letters;
};

/** Animation 35: circle of light per letter, alternate letters from opposite sides. */
export const twinEclipseFrames = (k) => {
  const side = k % 2 ? '100% 50%' : '0% 50%';
  return [
    { opacity: 0, clipPath: `circle(0% at ${side})` },
    { opacity: 1, clipPath: `circle(180% at ${side})`, filter: 'none' }
  ];
};

let mounted = null;

export const initAudionautBanner = () => {
  const banner = document.getElementById('audionautBanner');
  const svg = document.getElementById('audionautWordmark');
  const group = svg?.querySelector('.aud-banner__mark');
  if (!banner || !svg || !group || svg.dataset.ready === '1') return;
  svg.dataset.ready = '1';

  const ctx = document.createElement('canvas').getContext('2d');
  const letters = drawWordmark(group, (ch, size) => {
    ctx.font = `${WEIGHT} ${size}px ${FONT}`;
    return ctx.measureText(ch).width;
  });
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if (reduced || typeof letters[0]?.animate !== 'function') return;

  let animations = [];
  const play = () => {
    animations.forEach((a) => a.cancel());
    animations = letters.map((node, k) => {
      const a = node.animate(twinEclipseFrames(k), {
        duration: DURATION_MS, delay: (k % 2) * STAGGER_MS, easing: EASING, fill: 'both'
      });
      a.playbackRate = SPEED;
      return a;
    });
  };
  // Hold every letter hidden until the banner is on screen.
  play();
  animations.forEach((a) => a.pause());
  // The caption under the wordmark fades in slowly alongside the reveal: it starts once the
  // letters are all showing (about a third of the way through) and finishes a little before the end.
  banner.classList.add('aud-banner--reveal');
  const total = (DURATION_MS + STAGGER_MS) / SPEED;
  banner.style.setProperty('--aud-cap-delay', `${Math.round(total * 0.3)}ms`);
  banner.style.setProperty('--aud-cap-fade', `${Math.round(total * 0.6)}ms`);
  const start = () => {
    animations.forEach((a) => a.play());
    banner.classList.add('aud-banner--done');
  };

  if ('IntersectionObserver' in window) {
    const seen = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        seen.disconnect();
        start();
      }
    }, { threshold: 0.4 });
    seen.observe(banner);
    mounted = seen;
  } else {
    start();
  }
  const replay = () => {
    if (animations.every((a) => a.playState === 'finished')) play();
  };
  banner.addEventListener('pointerenter', replay);
  banner.addEventListener('focus', replay);
};

export const stopAudionautBanner = () => {
  mounted?.disconnect();
  mounted = null;
};
