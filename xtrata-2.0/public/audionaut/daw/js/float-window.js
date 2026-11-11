// float-window.js — a tiny window manager for panels that can leave their dock.
//
//   const fw = makeFloatable(el, { handle, key, minW, minH, onChange });
//   fw.float(rect?)   take the element out of the layout: fixed, draggable, resizable
//   fw.dock()         put it back (the element keeps its place in the DOM the whole time)
//   fw.floating       true while floating
//   fw.rect()         { x, y, w, h } of the floating window
//
// The element is never moved in the DOM — it only gains the `floating` class and inline
// left/top/width/height — so any CSS and event handlers written for the docked panel keep working.
// Several floatables can coexist: a click on one raises it above the others (z-index 40–47, under
// the modals at 50). Geometry is kept inside the viewport, also after a browser resize, and is
// remembered per `key` in localStorage as a per-browser convenience (storage can fail — the window
// then just opens at its default place).
const Z_BASE = 40;
const Z_SPAN = 8;
const stack = []; // floating elements, back to front
const EDGES = ["n", "e", "s", "w", "ne", "nw", "se", "sw"];
const clamp = (v, a, b) => Math.min(Math.max(v, a), Math.max(a, b));

function restack() {
  stack.forEach((el, i) => (el.style.zIndex = String(Z_BASE + Math.min(i, Z_SPAN - 1))));
}
function raise(el) {
  const i = stack.indexOf(el);
  if (i >= 0) stack.splice(i, 1);
  stack.push(el);
  restack();
}

export function makeFloatable(el, { handle, key = null, minW = 420, minH = 260, onChange = null } = {}) {
  let floating = false;
  let r = { x: 0, y: 0, w: 640, h: 380 };
  const grips = [];

  const load = () => {
    try {
      const v = JSON.parse(localStorage.getItem(`audionaut.float.${key}`) || "null");
      return v && [v.x, v.y, v.w, v.h].every(Number.isFinite) ? v : null;
    } catch {
      return null;
    }
  };
  const save = () => {
    if (!key) return;
    try {
      localStorage.setItem(`audionaut.float.${key}`, JSON.stringify(r));
    } catch {
      /* storage unavailable */
    }
  };
  const fit = () => {
    const vw = window.innerWidth, vh = window.innerHeight;
    r.w = clamp(r.w, Math.min(minW, vw), vw);
    r.h = clamp(r.h, Math.min(minH, vh), vh);
    r.x = clamp(r.x, 0, vw - r.w);
    r.y = clamp(r.y, 0, vh - r.h);
  };
  const paint = () => {
    el.style.left = `${r.x}px`;
    el.style.top = `${r.y}px`;
    el.style.width = `${r.w}px`;
    el.style.height = `${r.h}px`;
  };
  const changed = (final) => {
    onChange?.(final);
    if (final) save();
  };

  // drag by the handle's own background (buttons, tabs and inputs inside it keep working)
  const onHandleDown = (e) => {
    if (!floating || e.button !== 0) return;
    if (e.target.closest("button, input, select, textarea, a, [role=tab]")) return;
    e.preventDefault();
    const sx = e.clientX, sy = e.clientY, ox = r.x, oy = r.y;
    handle.setPointerCapture?.(e.pointerId);
    const move = (m) => {
      r.x = ox + m.clientX - sx;
      r.y = oy + m.clientY - sy;
      fit();
      paint();
    };
    const up = () => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", up);
      changed(true);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
  };

  const onGripDown = (e) => {
    if (!floating || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const dir = e.currentTarget.dataset.edge;
    const g = e.currentTarget;
    const sx = e.clientX, sy = e.clientY, o = { ...r };
    const vw = window.innerWidth, vh = window.innerHeight;
    g.setPointerCapture?.(e.pointerId);
    const move = (m) => {
      const dx = m.clientX - sx, dy = m.clientY - sy;
      let { x, y, w, h } = o;
      if (dir.includes("e")) w = clamp(o.w + dx, minW, vw - o.x);
      if (dir.includes("s")) h = clamp(o.h + dy, minH, vh - o.y);
      if (dir.includes("w")) { const nx = clamp(o.x + dx, 0, o.x + o.w - minW); w = o.w + (o.x - nx); x = nx; }
      if (dir.includes("n")) { const ny = clamp(o.y + dy, 0, o.y + o.h - minH); h = o.h + (o.y - ny); y = ny; }
      r = { x, y, w, h };
      paint();
      changed(false);
    };
    const up = () => {
      g.removeEventListener("pointermove", move);
      g.removeEventListener("pointerup", up);
      g.removeEventListener("pointercancel", up);
      changed(true);
    };
    g.addEventListener("pointermove", move);
    g.addEventListener("pointerup", up);
    g.addEventListener("pointercancel", up);
  };

  const onResize = () => {
    if (!floating) return;
    fit();
    paint();
    changed(true);
  };
  const onRaise = () => floating && raise(el);

  return {
    get floating() {
      return floating;
    },
    rect: () => ({ ...r }),
    float(rect) {
      if (floating) return;
      const saved = rect || load();
      if (saved) r = { x: saved.x, y: saved.y, w: saved.w, h: saved.h };
      else {
        // first time: where the docked panel sits now, lifted a little so the page below shows
        const b = el.getBoundingClientRect();
        r = { x: Math.max(0, b.left + 24), y: Math.max(0, b.top - 40), w: Math.min(b.width - 48, 900), h: Math.max(minH, b.height) };
      }
      fit();
      floating = true;
      el.classList.add("floating");
      grips.push(
        ...EDGES.map((edge) => {
          const g = document.createElement("div");
          g.className = `fw-grip fw-${edge}`;
          g.dataset.edge = edge;
          g.addEventListener("pointerdown", onGripDown);
          el.appendChild(g);
          return g;
        }),
      );
      paint();
      raise(el);
      handle?.addEventListener("pointerdown", onHandleDown);
      el.addEventListener("pointerdown", onRaise, true);
      window.addEventListener("resize", onResize);
      changed(true);
    },
    dock() {
      if (!floating) return;
      floating = false;
      save();
      el.classList.remove("floating");
      for (const p of ["left", "top", "width", "height", "zIndex"]) el.style[p] = "";
      grips.splice(0).forEach((g) => g.remove());
      const i = stack.indexOf(el);
      if (i >= 0) stack.splice(i, 1);
      restack();
      handle?.removeEventListener("pointerdown", onHandleDown);
      el.removeEventListener("pointerdown", onRaise, true);
      window.removeEventListener("resize", onResize);
      changed(true);
    },
  };
}
