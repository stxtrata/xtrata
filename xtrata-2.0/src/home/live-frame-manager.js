// Live HTML-frame manager for the public grid (src/home/main.js).
// Extracted so it can be tested in a real browser: scripts/test-live-frame-manager.mjs.

// ------------------------------------------------------------------
// Live HTML-frame manager (phase one: execution gate + budget + poster)
//
// HTML inscriptions (e.g. embedded X-Board apps) are expensive: each one
// runs its own scripts, network fetches and ~hundreds of slot renders. The
// byte-hydration queue throttles *fetching*; this manager throttles
// *executing*. A tile's iframe srcdoc is only set when the tile is in the
// viewport AND within MAX_LIVE_HTML_FRAMES. Everything else shows a static
// poster the user can click to force-render.
//
// Trusted lane (phase two): a board that completes the embed handshake is
// marked trusted and exempted from the budget, because it self-throttles
// internally. Trusted status persists for the session so scroll-back is
// cheap. See docs/grid-embed-contract.md.
// ------------------------------------------------------------------
//
// Priority (phase three): the inscription the viewer has selected gets the machine.
//  - Heavy tiles (big HTML, or a recursive loader that reads other inscriptions'
//    chunks at runtime, like the arcade parent) never auto-run in the grid. They
//    show a poster; a tap runs one, and only one heavy tile runs at a time.
//  - The tile of the selected inscription never runs: it is already running,
//    full size, in the preview.
//  - While the preview is loading, and for a few seconds after, no grid tile
//    starts. Then waiting tiles start one at a time, a moment apart.
//  - While the fullscreen viewer is open, every grid tile is paused.
// ------------------------------------------------------------------
const HEAVY_HTML_BYTES = 512 * 1024;
const PREVIEW_FOCUS_MAX_MS = 15_000; // longest the grid waits for a preview to load
const PREVIEW_SETTLE_MS = 4_000; // quiet time after the preview document has loaded
const GRID_STAGGER_MS = 250; // gap between grid tiles starting
export const isHeavyGridHtml = (html, byteLength, limit = HEAVY_HTML_BYTES) =>
  (Number(byteLength) || 0) >= limit ||
  String(html || '').length >= limit ||
  /['"]get-chunk['"]/.test(String(html || ''));
const formatGridBytes = (n) =>
  n >= 1024 * 1024 ? `${(n / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`;

export const createLiveHtmlFrameManager = ({ injectHtml, maxLiveFrames, mimeLabel }) => {
  const tiles = new Map(); // thumbElement -> record
  let observer = null;
  const focus = { key: null, until: 0 };
  let suspended = false; // fullscreen viewer open
  const waiting = new Set(); // records allowed to run, in arrival order
  let pumpTimer = null;

  const now = () =>
    typeof performance !== 'undefined' && performance.now
      ? performance.now()
      : Date.now();

  const liveCount = () => {
    let n = 0;
    tiles.forEach((r) => {
      if (r.active && !r.trusted) n += 1;
    });
    return n;
  };

  const setPosterHint = (record, text) => {
    if (record.hint) record.hint.textContent = text;
  };
  const posterHint = (record) =>
    record.key && record.key === focus.key
      ? 'Running in the preview'
      : record.clickThrough
      ? 'Tap to open'
      : record.heavy
      ? `${record.recursive ? 'Loads other inscriptions' : record.sizeLabel} · Tap to run`
      : 'Tap to load';

  const activate = (record) => {
    waiting.delete(record);
    if (record.active || !record.frame.isConnected) return;
    record.frame.srcdoc = injectHtml(record.html);
    record.active = true;
    record.activatedAt = now();
    if (record.poster) record.poster.hidden = true;
  };

  const deactivate = (record) => {
    waiting.delete(record);
    if (!record.active) return;
    record.frame.srcdoc = '';
    record.active = false;
    // NB: record.trusted persists for the session so a known-good board is
    // not budget-blocked when scrolled back into view.
    setPosterHint(record, posterHint(record));
    if (record.poster) record.poster.hidden = false;
  };

  // May this tile start by itself (no tap)?
  const autoRunAllowed = (record) =>
    !record.gated && !record.heavy && !suspended && !(record.key && record.key === focus.key);

  // Start waiting tiles one at a time, never while the preview is still loading.
  const pump = () => {
    if (pumpTimer) return;
    const wait = Math.max(0, focus.until - now());
    pumpTimer = setTimeout(() => {
      pumpTimer = null;
      if (suspended) return;
      if (focus.until > now()) { pump(); return; }
      for (const record of waiting) {
        waiting.delete(record);
        if (!record.intersecting || record.active || !autoRunAllowed(record) || !record.frame.isConnected) continue;
        activate(record);
        break;
      }
      if (waiting.size) pump();
    }, wait || (waiting.size ? GRID_STAGGER_MS : 0));
  };

  // Oldest active, non-trusted tile to evict so a visible tile can run.
  const pickEvictable = (exclude, allowIntersecting) => {
    let victim = null;
    tiles.forEach((r) => {
      if (r === exclude || !r.active || r.trusted) return;
      if (!allowIntersecting && r.intersecting) return;
      if (!victim || r.activatedAt < victim.activatedAt) victim = r;
    });
    return victim;
  };

  const requestActivation = (record) => {
    if (record.active) return;
    // Gated tiles (e.g. relationship pair/child thumbs), heavy tiles and the
    // selected inscription's own tile never auto-activate; they stay as a
    // poster until the user clicks (forceActivate).
    if (!autoRunAllowed(record)) {
      setPosterHint(record, posterHint(record));
      return;
    }
    // Every other on-screen HTML inscription runs without a click, started one
    // at a time (and not while the preview is loading). Off-screen tiles are
    // still deactivated by the IntersectionObserver.
    waiting.add(record);
    pump();
  };

  const fillFreeSlots = () => {
    tiles.forEach((r) => {
      if (r.active || !r.intersecting) return;
      requestActivation(r);
    });
  };

  const forceActivate = (record) => {
    if (record.active) return;
    if (!record.trusted && liveCount() >= maxLiveFrames) {
      const victim = pickEvictable(record, true);
      if (victim) deactivate(victim);
    }
    // One heavy tile at a time: running a second one stops the first.
    if (record.heavy) tiles.forEach((r) => { if (r !== record && r.heavy && r.active) deactivate(r); });
    activate(record);
  };

  /**
   * The selected inscription (grid key) is being shown in the preview. `frame` is
   * the preview's iframe when it is HTML (the grid stays quiet while it loads),
   * or null for any other kind.
   */
  const focusPreview = (key, frame) => {
    const previous = focus.key;
    focus.key = key || null;
    focus.until = frame ? now() + PREVIEW_FOCUS_MAX_MS : 0;
    if (frame) {
      const settle = () => {
        if (focus.key !== key) return;
        focus.until = Math.min(focus.until, now() + PREVIEW_SETTLE_MS);
        if (pumpTimer) { clearTimeout(pumpTimer); pumpTimer = null; }
        pump();
      };
      frame.addEventListener('load', settle, { once: true });
    }
    tiles.forEach((r) => {
      if (focus.key && r.key === focus.key) deactivate(r);
      // A heavy tile the viewer tapped earlier yields to a heavy preview.
      else if (frame && r.heavy && r.active) deactivate(r);
      else if (previous && r.key === previous && r.intersecting) requestActivation(r);
      if (!r.active) setPosterHint(r, posterHint(r));
    });
    if (pumpTimer) { clearTimeout(pumpTimer); pumpTimer = null; }
    pump();
  };

  /** Fullscreen viewer open: pause every grid tile; closed: start them again. */
  const setSuspended = (value) => {
    suspended = !!value;
    if (suspended) {
      tiles.forEach((r) => deactivate(r));
      return;
    }
    focus.until = Math.max(focus.until, now() + PREVIEW_SETTLE_MS);
    fillFreeSlots();
  };

  const ensureObserver = () => {
    if (observer || typeof IntersectionObserver !== 'function') {
      return observer;
    }
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const record = tiles.get(entry.target);
          if (!record) continue;
          record.intersecting = entry.isIntersecting;
          if (entry.isIntersecting) {
            requestActivation(record);
          } else {
            deactivate(record);
          }
        }
        fillFreeSlots();
      },
      { root: null, rootMargin: '300px', threshold: 0 }
    );
    return observer;
  };

  // Phase-two receiver: a cooperating board posts {type:'xtrata:embed:hello'}
  // once its script runs. We mark that frame trusted (exempt from budget)
  // and ack so it can switch into lite/embedded rendering.
  if (typeof window !== 'undefined' && window.addEventListener) {
    window.addEventListener('message', (event) => {
      const data = event && event.data;
      if (!data || data.type !== 'xtrata:embed:hello') return;
      tiles.forEach((record) => {
        if (
          record.frame.contentWindow &&
          record.frame.contentWindow === event.source
        ) {
          record.trusted = true;
          if (record.poster) record.poster.hidden = true;
          if (event.source && typeof event.source.postMessage === 'function') {
            event.source.postMessage(
              {
                type: 'xtrata:embed:ack',
                mode: 'grid-thumbnail',
                budget: 'trusted'
              },
              '*'
            );
          }
        }
      });
    });
  }

  const register = (thumbElement, media, options = {}) => {
    const existing = tiles.get(thumbElement);
    if (existing) {
      if (observer) observer.unobserve(thumbElement);
      tiles.delete(thumbElement);
    }

    const frame = document.createElement('iframe');
    frame.title = 'inscription-preview';
    frame.sandbox = 'allow-scripts';
    frame.referrerPolicy = 'no-referrer';
    frame.loading = 'lazy';
    // Click-through tiles (the main grid) are pictures: the page runs inside the
    // tile but never takes a click or focus, so a click always selects the card.
    const clickThrough = !!options.clickThrough;
    if (clickThrough) {
      frame.tabIndex = -1;
      frame.setAttribute('aria-hidden', 'true');
    }

    const poster = document.createElement('div');
    poster.className = clickThrough
      ? 'token-thumb-gate token-thumb-gate--static'
      : 'token-thumb-gate';
    const label = document.createElement('div');
    label.className = 'token-thumb-gate__label';
    label.textContent = mimeLabel(media.mimeType ?? null) || 'HTML';
    const hint = document.createElement('div');
    hint.className = 'token-thumb-gate__hint';
    hint.textContent = 'Tap to load';
    poster.append(label, hint);

    const byteLength = media.bytes?.length ?? options.byteLength ?? 0;
    const heavyLimit = Number(options.heavyBytes) > 0 ? Number(options.heavyBytes) : HEAVY_HTML_BYTES;
    const record = {
      frame,
      poster,
      hint,
      html: media.html,
      key: options.key ?? null,
      clickThrough,
      heavy: isHeavyGridHtml(media.html, byteLength, heavyLimit),
      recursive: /['"]get-chunk['"]/.test(String(media.html || '')) && byteLength < heavyLimit,
      sizeLabel: formatGridBytes(Math.max(byteLength, String(media.html || '').length)),
      active: false,
      intersecting: false,
      trusted: false,
      gated: !!options.gated,
      activatedAt: 0
    };
    hint.textContent = posterHint(record);

    if (!clickThrough) {
      poster.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        forceActivate(record);
      });
    }

    tiles.set(thumbElement, record);
    thumbElement.append(frame, poster);

    const obs = ensureObserver();
    if (obs) {
      obs.observe(thumbElement);
    } else {
      // No IntersectionObserver: activate now, still bounded by budget.
      record.intersecting = true;
      requestActivation(record);
    }
  };

  // A tab that was hidden while the grid rendered gets NO IntersectionObserver
  // callbacks at all, so every tile stays on its poster with nothing to nudge it.
  // Re-observing on the way back delivers fresh entries for whatever is on screen.
  if (typeof document !== 'undefined' && document.addEventListener) {
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState !== 'visible' || !observer) return;
      tiles.forEach((_record, element) => {
        observer.unobserve(element);
        observer.observe(element);
      });
    });
  }

  const reset = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (pumpTimer) { clearTimeout(pumpTimer); pumpTimer = null; }
    waiting.clear();
    tiles.forEach((record) => {
      record.frame.srcdoc = '';
    });
    tiles.clear();
  };

  // True when the preview is not loading and the fullscreen viewer is closed:
  // the grid may start fetching and running small pages.
  const isQuiet = () => !suspended && focus.until <= now();

  return { register, reset, focusPreview, setSuspended, isQuiet };
};
