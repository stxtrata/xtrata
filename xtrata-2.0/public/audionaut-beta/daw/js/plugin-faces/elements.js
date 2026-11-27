import { Kit } from "./runtime.js";
/* ELEMENTS suite faces — NEON, IRON, TITANIUM, CARBON, HELIUM, MERCURY (a nod to Lost Element).
 * One deliberately consistent layout: a periodic-table tile, a large live display you can drag
 * on, and rows of knobs. Each effect has its own display. Real params come from PLUGIN_TYPES;
 * selects are face-native indices; presets use option VALUES. */
(function () {
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const FMIN = 20, FMAX = 20000, LR = Math.log(FMAX / FMIN);
  const fx = (f, W) => (Math.log(clamp(f, FMIN, FMAX) / FMIN) / LR) * W;
  const xf = (x, W) => FMIN * Math.exp((x / W) * LR);
  const hidpi = (cv, w, h) => { cv.width = w * 2; cv.height = h * 2; cv.style.width = w + "px"; cv.style.height = h + "px"; const c = cv.getContext("2d"); c.setTransform(2, 0, 0, 2, 0, 0); return c; };
  const W = 840, H = 250;
  const TILE = {
    neon: { n: 10, s: "Ne", mass: "20.180" }, iron: { n: 26, s: "Fe", mass: "55.845" }, titanium: { n: 22, s: "Ti", mass: "47.867" },
    carbon: { n: 6, s: "C", mass: "12.011" }, helium: { n: 2, s: "He", mass: "4.0026" }, mercury: { n: 80, s: "Hg", mass: "200.59" }
  };

  const css = (accent) => `<style>
 .el{position:absolute;inset:0;background:linear-gradient(180deg,#0e1117,#090b10);color:#dfe6ee;font-family:'Space Grotesk','Segoe UI',Arial,sans-serif;--ac:${accent}}
 .el>*{position:absolute}
 .tile{left:20px;top:12px;width:52px;height:52px;border:2px solid var(--ac);border-radius:6px;background:#141922;box-shadow:0 0 18px ${accent}33}
 .tile i{position:absolute;left:5px;top:3px;font:600 10px 'JetBrains Mono',monospace;color:var(--ac);font-style:normal}
 .tile b{position:absolute;left:0;right:0;top:12px;text-align:center;font:700 24px/1 'Space Grotesk',Arial,sans-serif;color:#fff}
 .tile small{position:absolute;left:0;right:0;bottom:3px;text-align:center;font:500 8px 'JetBrains Mono',monospace;color:#8b97a6}
 .ttl{left:86px;top:14px}.ttl b{display:block;font:700 26px/1 'Space Grotesk',Arial,sans-serif;letter-spacing:.14em;color:#fff}
 .ttl span{display:block;margin-top:5px;font:500 10px 'JetBrains Mono',monospace;letter-spacing:.24em;color:#8b97a6}
 .pre{left:420px;top:20px;display:flex;align-items:center;gap:8px}
 .pre button{all:unset;cursor:pointer;width:26px;height:26px;text-align:center;line-height:26px;border:1px solid #2a3240;border-radius:4px;color:#aab6c4}
 .pre button:hover{border-color:var(--ac);color:#fff}
 .pre b{min-width:190px;text-align:center;font:600 12px 'JetBrains Mono',monospace;color:#fff;background:#141922;border:1px solid #2a3240;border-radius:4px;padding:6px 8px}
 .byp{right:20px;top:20px;cursor:pointer;padding:6px 14px;border-radius:4px;border:1px solid var(--ac);font:600 11px 'JetBrains Mono',monospace;letter-spacing:.12em;color:#0b0d12;background:var(--ac)}
 .byp:not(.on){background:transparent;color:#8b97a6;border-color:#2a3240}
 .disp{left:20px;top:76px;width:${W}px;height:${H}px;border:1px solid #232a36;border-radius:8px;background:#07090d;overflow:hidden}
 .disp canvas{position:absolute;left:0;top:0;touch-action:none}
 .hint{right:28px;top:${76 + H - 20}px;font:500 9px 'JetBrains Mono',monospace;color:#5c6878;letter-spacing:.08em;pointer-events:none}
 .rows{left:20px;top:340px;width:${W}px;height:170px;display:flex;gap:12px}
 .grp{position:relative;flex:1 1 auto;border:1px solid #232a36;border-radius:8px;background:#0d1016;padding:22px 8px 8px;display:flex;flex-wrap:wrap;gap:4px 2px;justify-content:center;align-content:flex-start}
 .grp h5{position:absolute;left:10px;top:6px;margin:0;font:600 9px 'JetBrains Mono',monospace;letter-spacing:.22em;color:var(--ac)}
 .kn{width:64px;text-align:center}
 .k{position:relative;width:40px;height:40px;margin:2px auto 0;border-radius:50%;background:radial-gradient(circle at 40% 35%,#2b3342,#151a23);border:1px solid #333d4d;cursor:ns-resize}
 .k:before{content:"";position:absolute;inset:-5px;border-radius:50%;background:conic-gradient(from 225deg,var(--ac) calc(var(--v,0)*270deg),#1d232e 0 270deg,transparent 0);-webkit-mask:radial-gradient(circle,transparent 24px,#000 25px);mask:radial-gradient(circle,transparent 24px,#000 25px)}
 .k:after{content:"";position:absolute;left:calc(50% - 1.5px);top:4px;width:3px;height:13px;border-radius:2px;background:#fff;transform-origin:50% 16px;transform:rotate(calc(-135deg + var(--v,0)*270deg))}
 .kv{font:600 10px 'JetBrains Mono',monospace;color:#fff;margin-top:5px;white-space:nowrap}
 .kl{font:500 8.5px 'JetBrains Mono',monospace;color:#8b97a6;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap}
 .sel{display:flex;flex-wrap:wrap;gap:4px;justify-content:center;width:100%}
 .sel button{all:unset;cursor:pointer;padding:5px 8px;border-radius:4px;border:1px solid #2a3240;font:600 9.5px 'JetBrains Mono',monospace;color:#aab6c4}
 .sel button.on{background:var(--ac);border-color:var(--ac);color:#0b0d12}
 </style>`;

  /* ---------------- shared wiring: knobs, selects, presets, bypass ---------------- */
  function wire(root, P) {
    root.querySelectorAll("[data-p]").forEach((el) => P.bind(el, el.dataset.p, {}));
    root.querySelectorAll("[data-t]").forEach((el) => P.text(el, el.dataset.t));
    const byId = {};
    root.querySelectorAll("[data-sel]").forEach((b) => { (byId[b.dataset.sel] = byId[b.dataset.sel] || []).push(b); b.addEventListener("click", () => P.set(b.dataset.sel, +b.dataset.i)); });
    Object.keys(byId).forEach((id) => P.sub(id, (v) => byId[id].forEach((b) => b.classList.toggle("on", +b.dataset.i === v))));
    const n = P.presets.length; let idx = -1;
    P.onPreset((i, nm) => { idx = i; root.querySelectorAll("[data-pname]").forEach((e) => { e.textContent = nm || "PRESETS"; }); });
    root.querySelector("[data-prev]")?.addEventListener("click", () => n && P.loadPreset((idx - 1 + n) % n));
    root.querySelector("[data-next]")?.addEventListener("click", () => n && P.loadPreset((idx + 1) % n));
    const byp = root.querySelector("[data-byp]");
    byp.addEventListener("click", () => P.bypass.toggle());
    P.bypass.sub((on) => { byp.classList.toggle("on", on); byp.textContent = on ? "ACTIVE" : "BYPASSED"; });
    if (idx < 0 && n) P.loadPreset(0);
  }
  const knob = (id, label) => `<div class="kn"><div class="k" data-p="${id}"></div><div class="kv" data-t="${id}"></div><div class="kl">${label}</div></div>`;
  const choice = (P, id) => { const d = P.def(id); return `<div class="sel">${d.options.map((o, i) => `<button data-sel="${id}" data-i="${i}">${o}</button>`).join("")}</div>`; };

  function frame(root, P, typeId, spec) {
    const t = TILE[typeId];
    root.innerHTML = `${css(spec.accent)}<div class="el">
      <div class="tile"><i>${t.n}</i><b>${t.s}</b><small>${t.mass}</small></div>
      <div class="ttl"><b>${spec.title}</b><span>ELEMENTS · ${spec.role}</span></div>
      <div class="pre"><button data-prev title="Previous preset">‹</button><b data-pname></b><button data-next title="Next preset">›</button></div>
      <div class="byp on" data-byp title="Bypass">ACTIVE</div>
      <div class="disp"><canvas></canvas></div><div class="hint">${spec.hint || ""}</div>
      <div class="rows">${spec.groups.map((g) => `<div class="grp" style="flex-basis:${g.w || 0}px"><h5>${g.title}</h5>${g.items.map((it) => (it.sel ? choice(P, it.sel) : knob(it[0], it[1]))).join("")}</div>`).join("")}</div>
    </div>`;
    wire(root, P);
    const cv = root.querySelector(".disp canvas"), c = hidpi(cv, W, H);
    return { c, cv };
  }
  const grid = (c, accent) => {
    c.fillStyle = "#07090d"; c.fillRect(0, 0, W, H);
    c.strokeStyle = "#141a23"; c.lineWidth = 1; c.font = "500 9px 'JetBrains Mono',monospace"; c.fillStyle = "#4b5666";
    for (const f of [50, 100, 200, 500, 1000, 2000, 5000, 10000]) { const x = fx(f, W); c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); c.fillText(f >= 1000 ? f / 1000 + "k" : String(f), x + 3, H - 6); }
  };
  const spectrum = (c, P, color, n = 180) => {
    const sp = P.freqData("out", n, FMIN, FMAX);
    c.beginPath(); c.moveTo(0, H);
    for (let i = 0; i < n; i++) c.lineTo(((i + 0.5) / n) * W, H - clamp((sp[i] + 96) / 96, 0, 1) * H * 0.9);
    c.lineTo(W, H); c.closePath(); c.fillStyle = color; c.fill();
  };
  // Pointer drag inside the display: hits = [{x, y, r, drag(nx, ny)}]
  function dragHandles(cv, P, hits, onWheel) {
    let active = null;
    const pos = (e) => { const b = cv.getBoundingClientRect(); return [((e.clientX - b.left) / b.width) * W, ((e.clientY - b.top) / b.height) * H]; };
    cv.addEventListener("pointerdown", (e) => {
      const [x, y] = pos(e);
      active = hits().map((h) => ({ h, d: Math.hypot(h.x - x, (h.y ?? y) - y) })).filter((m) => m.d < (m.h.r || 18)).sort((a, b) => a.d - b.d)[0]?.h || null;
      if (active) { cv.setPointerCapture(e.pointerId); e.preventDefault(); }
    });
    cv.addEventListener("pointermove", (e) => { if (!active) return; const [x, y] = pos(e); active.drag(clamp(x / W, 0, 1), clamp(1 - y / H, 0, 1), e.shiftKey); });
    const up = () => { active = null; };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
    if (onWheel) cv.addEventListener("wheel", (e) => { const [x, y] = pos(e); const h = hits().find((m) => Math.hypot(m.x - x, (m.y ?? y) - y) < (m.r || 18)); if (h && onWheel(h, e)) e.preventDefault(); }, { passive: false });
  }

  /* ---------------- NEON · EQ curve with draggable bands ---------------- */
  function buildNeon(root, P) {
    const accent = "#ff4fd8";
    const { c, cv } = frame(root, P, "neon", {
      title: "NEON", role: "PARAMETRIC EQ", accent, hint: "DRAG A BAND · WHEEL FOR Q",
      groups: [
        { title: "LOW CUT", w: 120, items: [["hpFreq", "freq"], { sel: "hpSlope" }] },
        { title: "SHELVES", w: 150, items: [["lsFreq", "low f"], ["lsGain", "low"], ["hsFreq", "high f"], ["hsGain", "high"]] },
        { title: "BELLS", w: 330, items: [["p1Freq", "1 f"], ["p1Gain", "1 dB"], ["p1Q", "1 Q"], ["p2Freq", "2 f"], ["p2Gain", "2 dB"], ["p2Q", "2 Q"], ["p3Freq", "3 f"], ["p3Gain", "3 dB"], ["p3Q", "3 Q"]] },
        { title: "OUT", w: 110, items: [["lpFreq", "high cut"], ["out", "output"]] }
      ]
    });
    const N = 240, freqs = new Float32Array(N);
    for (let i = 0; i < N; i++) freqs[i] = FMIN * Math.exp((i / (N - 1)) * LR);
    const yOf = (db) => H / 2 - (db / 18) * (H / 2 - 12);
    const bands = [
      { f: "hpFreq", label: "LC", col: "#7aa2ff" }, { f: "lsFreq", g: "lsGain", label: "LS", col: "#53e0c2" },
      { f: "p1Freq", g: "p1Gain", q: "p1Q", label: "1", col: "#ffd35a" }, { f: "p2Freq", g: "p2Gain", q: "p2Q", label: "2", col: "#ff8f5a" },
      { f: "p3Freq", g: "p3Gain", q: "p3Q", label: "3", col: "#ff5a8f" }, { f: "hsFreq", g: "hsGain", label: "HS", col: "#b98bff" }, { f: "lpFreq", label: "HC", col: "#7aa2ff" }
    ];
    const hits = () => bands.map((b) => ({ b, x: fx(P.real(b.f), W), y: b.g ? yOf(P.real(b.g)) : H / 2, r: 16,
      drag: (nx, ny) => { P.set(b.f, clamp(xf(nx * W, W), P.def(b.f).min, P.def(b.f).max)); if (b.g) P.setNorm(b.g, clamp(0.5 + ((ny - 0.5) * (H / 2)) / (H / 2 - 12), 0, 1)); } }));
    dragHandles(cv, P, hits, (h, e) => { if (!h.b.q) return false; P.setNorm(h.b.q, P.norm(h.b.q) - e.deltaY * 0.001); return true; });
    P.raf(() => {
      grid(c); spectrum(c, P, accent + "26");
      c.strokeStyle = "#1e2530"; c.beginPath(); c.moveTo(0, H / 2); c.lineTo(W, H / 2); c.stroke();
      const R = P.response(freqs);
      if (R) {
        c.beginPath(); for (let i = 0; i < N; i++) { const x = (i / (N - 1)) * W, y = yOf(clamp(R[i], -24, 24)); i ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.strokeStyle = accent; c.lineWidth = 2.4; c.shadowColor = accent; c.shadowBlur = 10; c.stroke(); c.shadowBlur = 0;
      }
      for (const h of hits()) { c.beginPath(); c.arc(h.x, h.y, 8, 0, 6.3); c.fillStyle = h.b.col; c.fill(); c.fillStyle = "#07090d"; c.font = "700 8px 'JetBrains Mono',monospace"; c.textAlign = "center"; c.fillText(h.b.label, h.x, h.y + 3); c.textAlign = "left"; }
    });
  }

  /* ---------------- IRON · gain-reduction trace + transfer curve ---------------- */
  function history(len, fill = 0) { const a = new Float32Array(len).fill(fill); let i = 0; return { push(v) { a[i] = v; i = (i + 1) % len; }, at(k) { return a[(i + k) % len]; }, len }; }
  function buildIron(root, P) {
    const accent = "#9fb4c8";
    const { c } = frame(root, P, "iron", {
      title: "IRON", role: "COMPRESSOR", accent, hint: "LEVEL · GAIN REDUCTION · TRANSFER CURVE",
      groups: [
        { title: "DETECTOR", w: 300, items: [["threshold", "threshold"], ["ratio", "ratio"], ["knee", "knee"], ["attack", "attack"], ["release", "release"]] },
        { title: "CHARACTER", w: 230, items: [{ sel: "character" }] },
        { title: "OUTPUT", w: 200, items: [["makeup", "makeup"], ["mix", "mix"], ["out", "output"]] }
      ]
    });
    const lvl = history(560), gr = history(560), TW = 560;
    P.raf(() => {
      const m = P.meter();
      lvl.push(clamp((P.toDb(m.inPeak || 0) + 60) / 60, 0, 1)); gr.push(clamp(-(m.reduction || 0) / 24, 0, 1));
      c.fillStyle = "#07090d"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#3a4656"; for (let k = 0; k < TW; k++) { const v = lvl.at(k); c.fillRect(k, H - v * H, 1, v * H); }
      c.beginPath(); for (let k = 0; k < TW; k++) { const y = gr.at(k) * H; k ? c.lineTo(k, y) : c.moveTo(k, y); }
      c.strokeStyle = accent; c.lineWidth = 2; c.stroke();
      const thr = P.real("threshold"), ratio = P.real("ratio"), knee = P.real("knee");
      c.strokeStyle = "#ff7a3d88"; c.setLineDash([4, 4]); const ty = H - ((thr + 60) / 60) * H; c.beginPath(); c.moveTo(0, ty); c.lineTo(TW, ty); c.stroke(); c.setLineDash([]);
      // Transfer curve panel
      const X0 = TW + 20, S = Math.min(W - X0 - 20, H - 20), Y0 = 10, map = (db) => clamp((db + 60) / 60, 0, 1) * S;
      c.strokeStyle = "#232a36"; c.strokeRect(X0, Y0, S, S);
      c.beginPath();
      for (let i = 0; i <= 60; i++) {
        const x = -60 + i, over = x - thr; let y;
        if (2 * over < -knee) y = x; else if (2 * Math.abs(over) <= knee && knee > 0) y = x + ((1 / ratio - 1) * (over + knee / 2) ** 2) / (2 * knee); else y = thr + over / ratio;
        const px = X0 + map(x), py = Y0 + S - map(y); i ? c.lineTo(px, py) : c.moveTo(px, py);
      }
      c.strokeStyle = accent; c.lineWidth = 2; c.stroke();
      c.fillStyle = "#fff"; c.font = "600 12px 'JetBrains Mono',monospace"; c.fillText(`GR ${(m.reduction || 0).toFixed(1)} dB`, 12, 20);
    });
  }

  /* ---------------- TITANIUM · loudness history with ceiling ---------------- */
  function buildTitanium(root, P) {
    const accent = "#d8e4ee";
    const { c } = frame(root, P, "titanium", {
      title: "TITANIUM", role: "LOOKAHEAD LIMITER", accent, hint: "OUTPUT PEAK · RMS · GAIN REDUCTION",
      groups: [
        { title: "DRIVE", w: 220, items: [["gain", "input"], ["ceiling", "ceiling"]] },
        { title: "RELEASE", w: 160, items: [["release", "release"]] },
        { title: "STYLE", w: 300, items: [{ sel: "style" }] }
      ]
    });
    const pk = history(W, -120), rm = history(W, -120), gr = history(W);
    const yOf = (db) => clamp(-db / 36, 0, 1) * (H - 20) + 10;
    P.raf(() => {
      const m = P.meter(), t = P.timeData ? P.timeData("out") : null;
      let s = 0; if (t) { for (let i = 0; i < t.length; i++) s += t[i] * t[i]; s = Math.sqrt(s / t.length); }
      pk.push(P.toDb(m.outPeak || 0)); rm.push(P.toDb(s || 0)); gr.push(m.reduction || 0);
      c.fillStyle = "#07090d"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#4b5666"; c.font = "500 9px 'JetBrains Mono',monospace";
      for (const db of [0, -6, -12, -18, -24, -30]) { const y = yOf(db); c.fillStyle = "#141a23"; c.fillRect(0, y, W, 1); c.fillStyle = "#4b5666"; c.fillText(db + " dB", 4, y - 2); }
      c.fillStyle = "#3a4656"; for (let k = 0; k < W; k++) { const y = yOf(pk.at(k)); c.fillRect(k, y, 1, H - y); }
      c.beginPath(); for (let k = 0; k < W; k++) { const y = yOf(rm.at(k)); k ? c.lineTo(k, y) : c.moveTo(k, y); } c.strokeStyle = "#7ef0ff"; c.lineWidth = 1.5; c.stroke();
      c.beginPath(); for (let k = 0; k < W; k++) { const y = 10 + clamp(-gr.at(k) / 12, 0, 1) * 60; k ? c.lineTo(k, y) : c.moveTo(k, y); } c.strokeStyle = "#ff7a3d"; c.lineWidth = 2; c.stroke();
      const cy = yOf(P.real("ceiling")); c.strokeStyle = accent; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(0, cy); c.lineTo(W, cy); c.stroke(); c.setLineDash([]);
      c.fillStyle = "#fff"; c.font = "600 12px 'JetBrains Mono',monospace";
      c.fillText(`PEAK ${Math.max(-60, pk.at(W - 1)).toFixed(1)}   RMS ${Math.max(-60, rm.at(W - 1)).toFixed(1)}   GR ${(m.reduction || 0).toFixed(1)} dB`, 12, H - 12);
    });
  }

  /* ---------------- CARBON · three bands on the spectrum, drag the splits ---------------- */
  function buildCarbon(root, P) {
    const accent = "#ff7a3d";
    const { c, cv } = frame(root, P, "carbon", {
      title: "CARBON", role: "MULTIBAND SATURATION", accent, hint: "DRAG THE SPLITS",
      groups: [
        { title: "LOW", w: 130, items: [["lowDrive", "drive"], ["lowGain", "level"]] },
        { title: "MID", w: 130, items: [["midDrive", "drive"], ["midGain", "level"]] },
        { title: "HIGH", w: 130, items: [["highDrive", "drive"], ["highGain", "level"]] },
        { title: "STYLE · SPLITS · OUT", w: 330, items: [{ sel: "style" }, ["xLow", "split 1"], ["xHigh", "split 2"], ["mix", "mix"], ["out", "output"]] }
      ]
    });
    const hits = () => ["xLow", "xHigh"].map((id) => ({ x: fx(P.real(id), W), y: null, r: 14, drag: (nx) => P.set(id, clamp(xf(nx * W, W), P.def(id).min, P.def(id).max)) }));
    dragHandles(cv, P, hits);
    const cols = ["#ff9f43", "#ff6b3d", "#ff3d6b"];
    P.raf((t) => {
      grid(c);
      const a = fx(P.real("xLow"), W), b = fx(P.real("xHigh"), W), edges = [[0, a], [a, b], [b, W]];
      ["lowDrive", "midDrive", "highDrive"].forEach((id, i) => {
        const d = P.real(id), [x0, x1] = edges[i], g = c.createLinearGradient(0, H, 0, 0);
        g.addColorStop(0, cols[i] + Math.round(30 + d * 140).toString(16).padStart(2, "0")); g.addColorStop(1, cols[i] + "00");
        c.fillStyle = g; c.fillRect(x0, H * (0.6 - d * 0.5) + Math.sin(t / 300 + i) * d * 6, x1 - x0, H);
      });
      spectrum(c, P, "#ffffff22");
      for (const x of [a, b]) { c.fillStyle = accent; c.fillRect(x - 1, 0, 2, H); c.beginPath(); c.arc(x, H / 2, 7, 0, 6.3); c.fill(); }
    });
  }

  /* ---------------- HELIUM · decay over time and frequency ---------------- */
  function buildHelium(root, P) {
    const accent = "#7ef0ff";
    const { c } = frame(root, P, "helium", {
      title: "HELIUM", role: "REVERB", accent, hint: "TAIL: LOW (SOLID) · HIGH (DASHED) · LIVE OUTPUT",
      groups: [
        { title: "SPACE", w: 300, items: [{ sel: "space" }, ["size", "size"], ["decay", "decay"]] },
        { title: "TONE", w: 230, items: [["predelay", "pre-delay"], ["damping", "damping"], ["lowcut", "low cut"]] },
        { title: "OUTPUT", w: 200, items: [["width", "width"], ["mix", "mix"], ["out", "output"]] }
      ]
    });
    const out = history(W);
    P.raf(() => {
      const decay = P.real("decay"), pre = P.real("predelay") / 1000, damp = P.real("damping"), span = Math.max(1, decay * 1.5 + pre), size = P.real("size");
      c.fillStyle = "#07090d"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#4b5666"; c.font = "500 9px 'JetBrains Mono',monospace";
      for (let s = 0; s <= span; s += span > 6 ? 2 : span > 3 ? 1 : 0.5) { const x = (s / span) * W; c.fillStyle = "#141a23"; c.fillRect(x, 0, 1, H); c.fillStyle = "#4b5666"; c.fillText(s.toFixed(1) + " s", x + 3, 14); }
      const curve = (highFactor, dash) => {
        c.beginPath();
        for (let x = 0; x <= W; x += 3) {
          const t = (x / W) * span - pre; let db = -96;
          if (t >= 0) { const hf = highFactor ? Math.exp(-t / (decay * 0.7)) * damp / 20000 : 1; db = (-60 * t) / decay + (highFactor ? 20 * Math.log10(Math.max(1e-4, hf)) : 0); }
          const y = clamp(-db / 72, 0, 1) * (H - 20) + 10; x ? c.lineTo(x, y) : c.moveTo(x, y);
        }
        c.setLineDash(dash ? [5, 4] : []); c.strokeStyle = dash ? "#b98bff" : accent; c.lineWidth = 2; c.stroke(); c.setLineDash([]);
      };
      curve(false, false); curve(true, true);
      c.fillStyle = accent; for (let k = 0; k < 7; k++) { const x = ((pre + (0.005 + k * 0.011) * size) / span) * W; c.fillRect(x, 10, 2, 24 - k * 2); }
      out.push(P.level ? P.level("out") : 0);
      c.beginPath(); for (let k = 0; k < W; k++) { const y = H - 10 - out.at(k) * 60; k ? c.lineTo(k, y) : c.moveTo(k, y); } c.strokeStyle = "#ffffff33"; c.lineWidth = 1; c.stroke();
      c.fillStyle = "#fff"; c.font = "600 12px 'JetBrains Mono',monospace"; c.fillText(`RT60 ${decay.toFixed(2)} s`, W - 130, 22);
    });
  }

  /* ---------------- MERCURY · repeats on a tempo grid ---------------- */
  function buildMercury(root, P) {
    const accent = "#c3c9d6";
    const { c } = frame(root, P, "mercury", {
      title: "MERCURY", role: "TEMPO DELAY", accent, hint: "REPEATS · LEFT ABOVE, RIGHT BELOW",
      groups: [
        { title: "TIME", w: 330, items: [{ sel: "time" }, ["ms", "free ms"], ["feedback", "feedback"], ["pingpong", "ping-pong"]] },
        { title: "FEEDBACK TONE", w: 230, items: [["hp", "low cut"], ["lp", "high cut"], ["drive", "drive"], ["wow", "wow"]] },
        { title: "OUTPUT", w: 150, items: [["mix", "mix"], ["out", "output"]] }
      ]
    });
    P.raf((t) => {
      const m = P.meter(), secs = m.seconds || 0.375, fb = P.real("feedback"), pp = P.real("pingpong"), span = Math.max(1, secs * 12);
      c.fillStyle = "#07090d"; c.fillRect(0, 0, W, H);
      c.fillStyle = "#141a23"; c.fillRect(0, H / 2, W, 1);
      c.fillStyle = "#4b5666"; c.font = "500 9px 'JetBrains Mono',monospace"; c.fillText(`${(secs * 1000).toFixed(0)} ms`, 8, 16);
      let amp = 1;
      for (let k = 0; k < 24 && amp > 0.003; k++) {
        const x = ((k * secs) / span) * W + (k ? Math.sin(t / 500 + k) * P.real("wow") * 4 : 0);
        if (x > W) break;
        const left = k === 0 ? 1 : (pp > 0.5 ? k % 2 === 1 : true), h = amp * (H / 2 - 16);
        c.fillStyle = k === 0 ? "#ffffff" : accent;
        if (k === 0 || left || pp <= 0.5) c.fillRect(x - 3, H / 2 - h, 6, h);
        if (k === 0 || !left || pp <= 0.5) c.fillRect(x - 3, H / 2, 6, h);
        if (k > 0) amp *= fb;
      }
    });
  }

  const fonts = "family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@500;600;700";
  const reg = (id, title, accent, build, presets) => Kit.register(id, { fonts, presets, faces: [{ key: "A", name: title, accent, w: 880, h: 520, build }] });
  reg("neon", "NEON", "#ff4fd8", buildNeon, [
    { name: "Flat", values: {} },
    { name: "Vocal Air", values: { hpFreq: 90, p2Freq: 320, p2Gain: -2.5, p2Q: 1.2, p3Freq: 3200, p3Gain: 1.5, hsFreq: 10000, hsGain: 3.5 } },
    { name: "Kick Weight", values: { hpFreq: 28, hpSlope: "24", lsFreq: 60, lsGain: 3, p1Freq: 380, p1Gain: -4, p1Q: 1.6, p3Freq: 3500, p3Gain: 2 } },
    { name: "Bass Tuck", values: { hpFreq: 35, p1Freq: 180, p1Gain: -3, p1Q: 2, p2Freq: 800, p2Gain: 2, lpFreq: 9000 } },
    { name: "Synth Bright", values: { lsFreq: 150, lsGain: -2, p3Freq: 5000, p3Gain: 3, p3Q: 0.7, hsGain: 2 } },
    { name: "Telephone", values: { hpFreq: 400, hpSlope: "24", p2Freq: 1500, p2Gain: 6, p2Q: 0.9, lpFreq: 3400 } }
  ]);
  reg("iron", "IRON", "#9fb4c8", buildIron, [
    { name: "Gentle Glue", values: {} },
    { name: "Drum Bus Punch", values: { threshold: -20, ratio: 4, attack: 0.02, release: 0.12, character: "punch", makeup: 4 } },
    { name: "Vocal Opto", values: { threshold: -24, ratio: 3, attack: 0.008, release: 0.3, character: "opto", makeup: 5 } },
    { name: "Vintage Squash", values: { threshold: -30, ratio: 8, attack: 0.003, release: 0.08, character: "vintage", makeup: 8, mix: 0.6 } },
    { name: "Parallel Smash", values: { threshold: -40, ratio: 20, attack: 0.001, release: 0.1, makeup: 14, mix: 0.35 } }
  ]);
  reg("titanium", "TITANIUM", "#d8e4ee", buildTitanium, [
    { name: "Safety -1 dB", values: {} },
    { name: "Master Loud", values: { gain: 6, ceiling: -0.8, style: "loud" } },
    { name: "Punchy Bus", values: { gain: 3, ceiling: -1, style: "punchy", release: 0.08 } },
    { name: "Transparent Master", values: { gain: 4, ceiling: -1, style: "transparent", release: 0.25 } }
  ]);
  reg("carbon", "CARBON", "#ff7a3d", buildCarbon, [
    { name: "Clean", values: {} },
    { name: "Warm Mix", values: { lowDrive: 0.25, midDrive: 0.2, highDrive: 0.05, style: "tube" } },
    { name: "Tape Bus", values: { lowDrive: 0.35, midDrive: 0.25, highDrive: 0.15, highGain: -1, style: "tape" } },
    { name: "Bass Grit", values: { xLow: 150, lowDrive: 0.1, midDrive: 0.7, midGain: -2, style: "hard" } },
    { name: "Air Sizzle", values: { xHigh: 6000, highDrive: 0.6, highGain: 1.5, style: "tube" } },
    { name: "Parallel Crunch", values: { lowDrive: 0.8, midDrive: 0.9, highDrive: 0.6, style: "hard", mix: 0.35 } }
  ]);
  reg("helium", "HELIUM", "#7ef0ff", buildHelium, [
    { name: "Medium Hall", values: {} },
    { name: "Vocal Plate", values: { space: "plate", decay: 1.8, predelay: 30, damping: 9000, lowcut: 200, mix: 0.25 } },
    { name: "Tight Room", values: { space: "room", size: 0.7, decay: 0.7, predelay: 4, damping: 6000, mix: 0.22 } },
    { name: "Prog Cathedral", values: { space: "hall", size: 1.8, decay: 7.5, predelay: 60, damping: 5000, lowcut: 180, mix: 0.4 } },
    { name: "Drum Chamber", values: { space: "chamber", size: 0.9, decay: 1.2, predelay: 10, damping: 8000, mix: 0.18 } }
  ]);
  reg("mercury", "MERCURY", "#c3c9d6", buildMercury, [
    { name: "Dotted Eighth", values: {} },
    { name: "Trance Ping-Pong", values: { time: "1/8.", feedback: 0.55, pingpong: 1, hp: 300, lp: 5000, mix: 0.28 } },
    { name: "Quarter Throw", values: { time: "1/4", feedback: 0.35, pingpong: 0.2, mix: 0.3 } },
    { name: "Tape Echo", values: { time: "1/8", feedback: 0.6, pingpong: 0, lp: 3200, wow: 0.45, drive: 0.4, mix: 0.3 } },
    { name: "Slapback", values: { time: "free", ms: 95, feedback: 0.1, pingpong: 0, mix: 0.25 } },
    { name: "Wash", values: { time: "1/2", feedback: 0.8, pingpong: 0.6, hp: 400, lp: 2500, mix: 0.35 } }
  ]);
})();
