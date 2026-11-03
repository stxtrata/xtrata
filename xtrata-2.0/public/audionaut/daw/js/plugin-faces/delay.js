import { Kit } from "./runtime.js";
import { store } from "../state.js";
/* delaySend — Delay send (shared return). Face: Blocktime — every echo is a block on a chain.
   Echo time is the block interval, feedback is how many confirmations an echo survives, ping-pong forks
   the chain between a left and a right lane, tone is the fee filter that dims each re-broadcast. */
(function () {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
  const MONO = "ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace";
  const DIVS = [0.25, 0.5, 0.75, 1, 1.5, 2, 4]; // beats, same order as the time options
  const ORANGE = "#f7931a", HOT = "#ffb24d";

  const presets = [
    { name: "Dotted Eighth", values: { time: "1/8.", feedback: 0.35, tone: 4000, spread: 0, ret: 1, amount: 0.25 } },
    { name: "Slapback", values: { time: "1/16", feedback: 0.12, tone: 5500, spread: 0, ret: 1, amount: 0.2 } },
    { name: "Ping-Pong Eighths", values: { time: "1/8", feedback: 0.45, tone: 5000, spread: 0.85, ret: 1, amount: 0.28 } },
    { name: "Dub Echo", values: { time: "1/4.", feedback: 0.62, tone: 1800, spread: 0.2, ret: 1, amount: 0.35 } },
    { name: "Long Haul", values: { time: "1/2", feedback: 0.5, tone: 3500, spread: 0.6, ret: 1, amount: 0.25 } },
    { name: "Runaway", values: { time: "1/8.", feedback: 0.86, tone: 2200, spread: 0.4, ret: 0.9, amount: 0.3 } },
    { name: "Tape Quarter", values: { time: "1/4", feedback: 0.4, tone: 2600, spread: 0, ret: 1, amount: 0.3 } },
    { name: "Init", values: {} },
  ];

  const hex = (n) => (Math.imul(n + 1, 2654435761) >>> 0).toString(16).padStart(8, "0");
  const db = (x) => 20 * Math.log10(Math.max(x, 1e-6));

  function fit(cv) {
    const g = cv.getContext("2d");
    g.setTransform(cv.width / (cv.clientWidth || cv.width), 0, 0, cv.height / (cv.clientHeight || cv.height), 0, 0);
    return g;
  }

  // the chain of echoes the current settings produce
  function chain(P) {
    const fb = P.get("feedback"), spread = P.get("spread"), tone = P.get("tone");
    const ms = ((60 / (store.project.bpm || 120)) * DIVS[P.get("time")] * 1000) | 0;
    const blocks = [];
    let amp = 1;
    for (let n = 1; n <= 16; n++) {
      blocks.push({ n, amp, ms: ms * n, bright: Math.pow(tone / 16000, 0.1 * (n - 1)), side: n % 2 ? -1 : 1 });
      amp *= fb;
      if (amp < 0.001) break;
    }
    return { blocks, ms, spread, fb };
  }

  function wire(root, P) {
    root.querySelectorAll("[data-p]").forEach((el) => P.bind(el, el.dataset.p, { abs: true, axis: "x" }));
    root.querySelectorAll("[data-t]").forEach((el) => P.text(el, el.dataset.t));
    root.querySelectorAll("[data-byp]").forEach((el) => P.bind(el, "__bypass"));
    const n = P.presets.length;
    let idx = -1;
    P.onPreset((i, nm) => {
      idx = i;
      root.querySelectorAll("[data-pl]").forEach((e) => e.classList.toggle("on", +e.dataset.pl === i));
      root.querySelectorAll("[data-pname]").forEach((e) => (e.textContent = nm || "Custom"));
    });
    root.querySelectorAll("[data-prev]").forEach((b) => b.addEventListener("click", () => P.loadPreset((idx - 1 + n) % n)));
    root.querySelectorAll("[data-next]").forEach((b) => b.addEventListener("click", () => P.loadPreset((idx + 1) % n)));
    root.querySelectorAll("[data-pl]").forEach((b) => b.addEventListener("click", () => P.loadPreset(+b.dataset.pl)));
  }

  function build(root, P) {
    const sl = (k, l, sub) =>
      `<div class="sl"><div class="lb"><span>${l}</span><i>${sub}</i><b data-t="${k}"></b></div><div class="tr" data-p="${k}"><u></u><s></s></div></div>`;
    const pills = P.def("time").options.map((o, i) => `<button class="pill" data-i="${i}">${o}</button>`).join("");
    root.innerHTML = `<style>
      .f{position:absolute;inset:0;overflow:hidden;color:#f3e6d3;font-family:${SANS};
        background:radial-gradient(120% 90% at 20% 0%,#1f160c 0%,#0d0a07 60%),#0d0a07}
      .f:before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(247,147,26,.035) 0 1px,transparent 1px 4px);pointer-events:none}
      .wm{position:absolute;left:24px;top:14px;font:800 38px/1 ${SANS};letter-spacing:.04em;color:${ORANGE};text-shadow:0 0 18px rgba(247,147,26,.45)}
      .sub{position:absolute;left:27px;top:58px;font:600 10px ${MONO};letter-spacing:.2em;color:#b88a52;text-transform:uppercase}
      .stat{position:absolute;left:330px;top:16px;font:600 11px ${MONO};color:#b88a52;line-height:1.55}
      .stat b{color:${HOT};font-weight:700}
      .byp{all:unset;position:absolute;right:24px;top:20px;cursor:pointer;font:800 12px ${MONO};letter-spacing:.14em;padding:8px 16px;border:1.5px solid ${ORANGE};border-radius:3px;color:${ORANGE};background:#150f08}
      .byp.on{background:${ORANGE};color:#1a1005;box-shadow:0 0 16px rgba(247,147,26,.5)}
      .rail{position:absolute;left:20px;top:92px;width:170px;display:flex;flex-direction:column;gap:6px}
      .rail h3{margin:0 0 2px;font:700 9px ${MONO};letter-spacing:.2em;color:#b88a52}
      .tk{all:unset;cursor:pointer;display:block;padding:7px 10px;font:700 12px ${SANS};background:#15100a;border:1px solid #3a2a16;border-radius:3px;color:#c9a672}
      .tk:hover{border-color:#7a5628}.tk.on{color:#1a1005;background:${ORANGE};border-color:${ORANGE}}
      .nav{display:flex;gap:6px}.nav button{all:unset;cursor:pointer;flex:1;text-align:center;padding:5px;border:1px solid #3a2a16;color:${ORANGE};font:800 12px ${MONO};border-radius:3px}
      .nav button:hover{background:#2a1c0c}
      .disp{position:absolute;left:212px;top:92px;width:688px;height:262px;background:#0a0805;border:1px solid #4a3418;border-radius:4px;box-shadow:inset 0 0 40px rgba(247,147,26,.07)}
      .disp canvas,.scope canvas{position:absolute;inset:0;width:100%;height:100%}
      .scope{position:absolute;left:212px;top:362px;width:688px;height:36px;background:#0a0805;border:1px solid #4a3418;border-radius:4px}
      .scope span{position:absolute;left:8px;top:3px;font:700 9px ${MONO};letter-spacing:.16em;color:#7a5628;z-index:2}
      .pills{position:absolute;left:212px;top:408px;width:688px;display:flex;gap:6px;align-items:center}
      .pills em{font:700 9px ${MONO};letter-spacing:.16em;color:#b88a52;font-style:normal;margin-right:6px;width:92px}
      .pill{all:unset;cursor:pointer;flex:1;text-align:center;padding:6px 0;border:1px solid #3a2a16;border-radius:3px;font:800 12px ${MONO};color:#c9a672;background:#15100a}
      .pill.on{background:${ORANGE};border-color:${ORANGE};color:#1a1005}
      .sls{position:absolute;left:212px;top:448px;width:688px;display:grid;grid-template-columns:repeat(3,1fr);gap:8px 24px}
      .sl .lb{display:flex;align-items:baseline;gap:6px;margin-bottom:2px;font:800 11px ${SANS};letter-spacing:.05em;text-transform:uppercase;color:#e9d3b2}
      .sl .lb i{font:500 9px ${MONO};font-style:normal;color:#7a5628;text-transform:none;letter-spacing:0}
      .sl .lb b{margin-left:auto;text-transform:none;font:700 12px ${MONO};color:${HOT}}
      .tr{position:relative;height:20px;cursor:ew-resize;touch-action:none}
      .tr u{position:absolute;left:0;right:0;top:8px;height:4px;background:#2a1c0c;border-radius:2px}
      .tr s{position:absolute;top:2px;width:10px;height:16px;margin-left:-5px;left:calc(var(--v)*100%);background:${ORANGE};border-radius:2px;box-shadow:0 0 10px rgba(247,147,26,.6);text-decoration:none}
      .tr:before{content:'';position:absolute;left:0;top:8px;height:4px;width:calc(var(--v)*100%);background:linear-gradient(90deg,#6b3d0a,${ORANGE});border-radius:2px}
    </style>
    <div class="f">
      <div class="wm">BLOCKTIME</div><div class="sub">delay send · shared return</div>
      <div class="stat">confirmations <b id="cf">0</b><br>block interval <b id="iv">0 ms</b> · tail <b id="tl">0.0 s</b></div>
      <button class="byp" data-byp>BROADCASTING</button>
      <div class="rail"><h3>SAVED CHAINS</h3>${P.presets.map((p, i) => `<button class="tk" data-pl="${i}">${p.name}</button>`).join("")}
        <div class="nav"><button data-prev>&lsaquo;</button><button data-next>&rsaquo;</button></div></div>
      <div class="disp"><canvas id="cv" width="1376" height="524"></canvas></div>
      <div class="scope"><span>RETURN ACTIVITY</span><canvas id="sc" width="1376" height="72"></canvas></div>
      <div class="pills"><em>BLOCK INTERVAL</em>${pills}</div>
      <div class="sls">${sl("feedback", "Confirmations", "feedback")}${sl("tone", "Fee filter", "tone")}${sl("spread", "Fork", "ping-pong")}${sl("ret", "Relay", "return level")}${sl("amount", "Broadcast", "this send")}<div></div></div>
    </div>`;
    const $ = (s) => root.querySelector(s);
    wire(root, P);
    P.sub("__bypass", (on) => {
      const b = $(".byp");
      b.textContent = on ? "BROADCASTING" : "OFFLINE";
      b.classList.toggle("on", !!on);
    });
    const pillEls = [...root.querySelectorAll(".pill")];
    pillEls.forEach((b) => b.addEventListener("click", () => P.set("time", +b.dataset.i)));
    P.sub("time", (v) => pillEls.forEach((b) => b.classList.toggle("on", +b.dataset.i === v)));

    const cv = $("#cv"), sc = $("#sc");
    let glow = 0;
    P.raf((t) => {
      const C = chain(P), g = fit(cv), w = 688, h = 262;
      g.clearRect(0, 0, w, h);
      const mid = h / 2 + 4, laneGap = 62 * C.spread;
      // lanes
      g.font = "700 9px " + MONO;
      g.textBaseline = "middle";
      if (C.spread > 0.02) {
        for (const s of [-1, 1]) {
          const y = mid + s * laneGap;
          g.strokeStyle = `rgba(247,147,26,${0.1 + 0.15 * C.spread})`;
          g.setLineDash([3, 5]);
          g.beginPath(); g.moveTo(40, y); g.lineTo(w - 10, y); g.stroke();
          g.setLineDash([]);
          g.fillStyle = "#7a5628"; g.fillText(s < 0 ? "L" : "R", 14, y);
        }
      } else { g.strokeStyle = "rgba(247,147,26,.12)"; g.setLineDash([3, 5]); g.beginPath(); g.moveTo(40, mid); g.lineTo(w - 10, mid); g.stroke(); g.setLineDash([]); }
      const N = C.blocks.length, x0 = 62, avail = w - x0 - 28;
      const step = Math.min(110, avail / Math.max(N, 1));
      const bw = Math.min(step * 0.66, 70);
      const bx = (i) => x0 + (i + 0.5) * step; // i=0 is the first echo
      const by = (b) => mid + b.side * laneGap;
      // genesis (the dry hit)
      g.save(); g.translate(30, mid); g.rotate(Math.PI / 4);
      g.fillStyle = "#f3e6d3"; g.shadowColor = "#fff"; g.shadowBlur = 12; g.fillRect(-8, -8, 16, 16); g.restore();
      g.fillStyle = "#b88a52"; g.textAlign = "center"; g.fillText("TX", 30, mid + 24); g.textAlign = "left";
      // links
      let prevX = 38, prevY = mid;
      C.blocks.forEach((b, i) => {
        const x = bx(i), y = by(b);
        g.strokeStyle = `rgba(247,147,26,${0.25 + 0.5 * b.amp})`; g.lineWidth = 2;
        g.beginPath(); g.moveTo(prevX, prevY); g.lineTo(x - bw / 2, y); g.stroke();
        prevX = x + bw / 2; prevY = y;
      });
      // blocks
      C.blocks.forEach((b, i) => {
        const x = bx(i), y = by(b), bh = 26 + b.amp * 110;
        const a = 0.18 + 0.7 * b.amp;
        g.fillStyle = `rgba(247,147,26,${a * b.bright})`;
        g.strokeStyle = `rgba(255,178,77,${0.35 + 0.65 * b.amp})`; g.lineWidth = 1.5;
        const r = 5;
        g.beginPath(); g.roundRect ? g.roundRect(x - bw / 2, y - bh / 2, bw, bh, r) : g.rect(x - bw / 2, y - bh / 2, bw, bh);
        g.fill(); g.stroke();
        g.fillStyle = b.amp > 0.35 ? "#1a1005" : "#f3e6d3";
        g.textAlign = "center";
        g.font = "800 11px " + MONO; g.fillText("#" + b.n, x, y - bh / 2 + 12);
        if (bw > 44) { g.font = "600 9px " + MONO; g.fillText(db(b.amp).toFixed(1) + " dB", x, y + 2); }
        if (bh > 56 && bw > 56) { g.font = "500 8px " + MONO; g.fillText("0x" + hex(b.n * 977 + P.get("tone")).slice(0, 5), x, y + bh / 2 - 8); }
        g.fillStyle = "#b88a52"; g.font = "600 9px " + MONO;
        g.fillText("+" + b.ms + "ms", x, y + bh / 2 + 12 > h - 6 ? y - bh / 2 - 8 : y + bh / 2 + 12);
        g.textAlign = "left";
      });
      // a transaction hopping block to block at the real block interval
      const per = Math.max(0.05, C.ms / 1000);
      const ph = (t / 1000 / per) % (N + 1);
      const k = Math.floor(ph), fr = ph - k;
      const pts = [{ x: 30, y: mid }, ...C.blocks.map((b, i) => ({ x: bx(i), y: by(b) }))];
      const A = pts[Math.min(k, pts.length - 1)], B = pts[Math.min(k + 1, pts.length - 1)];
      const e = fr * fr * (3 - 2 * fr);
      const px = A.x + (B.x - A.x) * e, py = A.y + (B.y - A.y) * e;
      const gr = g.createRadialGradient(px, py, 0, px, py, 16);
      gr.addColorStop(0, "rgba(255,230,180,.95)"); gr.addColorStop(1, "rgba(247,147,26,0)");
      g.fillStyle = gr; g.beginPath(); g.arc(px, py, 16, 0, 7); g.fill();
      // live glow from what the return is actually adding
      glow = Math.max(clamp(P.busPeak() * 3, 0, 1), glow - 0.03);
      g.strokeStyle = `rgba(247,147,26,${glow * 0.8})`; g.lineWidth = 3; g.strokeRect(1.5, 1.5, w - 3, h - 3);
      $("#cf").textContent = String(N);
      $("#iv").textContent = C.ms + " ms";
      $("#tl").textContent = ((N * C.ms) / 1000).toFixed(1) + " s";

      // activity strip
      const s = fit(sc), sw = 688, sh = 36;
      s.clearRect(0, 0, sw, sh);
      const d = P.busData();
      s.strokeStyle = HOT; s.lineWidth = 1.5; s.shadowColor = ORANGE; s.shadowBlur = 6; s.beginPath();
      if (d) {
        const n = 1024, off = d.length - n;
        for (let i = 0; i < n; i++) { const x = (i / (n - 1)) * sw, y = sh / 2 - clamp(d[off + i] * 4, -1, 1) * (sh * 0.46); i ? s.lineTo(x, y) : s.moveTo(x, y); }
      } else { s.moveTo(0, sh / 2); s.lineTo(sw, sh / 2); }
      s.stroke(); s.shadowBlur = 0;
    });
  }

  Kit.register("delaySend", {
    fonts: "",
    w: 920,
    h: 540,
    presets,
    faces: [{ key: "A", name: "Blocktime", accent: ORANGE, w: 920, h: 540, build }],
  });
})();
