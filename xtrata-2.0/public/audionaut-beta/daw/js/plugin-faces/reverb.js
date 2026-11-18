import { Kit } from "./runtime.js";
/* reverbSend — Reverb send (shared return). Face: Liquidity — the tail drawn as a DEX depth chart.
   Decay is pool depth, shape is the bonding curve, pre-delay is the lockup before liquidity arrives,
   damping is the haircut taken off the highs, width is the spread between the two sides of the book. */
(function () {
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const SANS = "'Helvetica Neue',Helvetica,Arial,sans-serif";
  const MONO = "ui-monospace,'SFMono-Regular',Menlo,Consolas,monospace";
  const VIO = "#a78bfa", TEAL = "#2dd4bf", ROSE = "#fb7185";

  const presets = [
    { name: "Stock Pool", values: { decay: 2.2, shape: 3, predelay: 0, damp: 20000, width: 1, ret: 1, amount: 0.25 } },
    { name: "Tight Room", values: { decay: 0.6, shape: 4.5, predelay: 0, damp: 6000, width: 0.8, ret: 1, amount: 0.22 } },
    { name: "Plate", values: { decay: 1.6, shape: 3, predelay: 10, damp: 12000, width: 1, ret: 1, amount: 0.25 } },
    { name: "Hall", values: { decay: 3.4, shape: 2.5, predelay: 25, damp: 7000, width: 1, ret: 1, amount: 0.25 } },
    { name: "Cathedral", values: { decay: 6.5, shape: 2, predelay: 40, damp: 4500, width: 1, ret: 0.9, amount: 0.22 } },
    { name: "Dark Tank", values: { decay: 2.8, shape: 2.8, predelay: 8, damp: 2200, width: 0.9, ret: 1, amount: 0.3 } },
    { name: "Snap Gate", values: { decay: 0.9, shape: 6, predelay: 0, damp: 20000, width: 1, ret: 1, amount: 0.3 } },
    { name: "Mono Vault", values: { decay: 2.4, shape: 3, predelay: 15, damp: 5000, width: 0, ret: 1, amount: 0.25 } },
    { name: "Init", values: {} },
  ];

  function fit(cv) {
    const g = cv.getContext("2d");
    g.setTransform(cv.width / (cv.clientWidth || cv.width), 0, 0, cv.height / (cv.clientHeight || cv.height), 0, 0);
    return g;
  }
  const fq = (f) => (f >= 1000 ? (f / 1000).toFixed(f >= 10000 ? 0 : 1).replace(/\.0$/, "") + "k" : String(Math.round(f)));

  function wire(root, P) {
    root.querySelectorAll("[data-p]").forEach((el) => P.bind(el, el.dataset.p, { abs: true, axis: "x" }));
    root.querySelectorAll("[data-t]").forEach((el) => P.text(el, el.dataset.t));
    root.querySelectorAll("[data-byp]").forEach((el) => P.bind(el, "__bypass"));
    const n = P.presets.length;
    let idx = -1;
    P.onPreset((i) => {
      idx = i;
      root.querySelectorAll("[data-pl]").forEach((e) => e.classList.toggle("on", +e.dataset.pl === i));
    });
    root.querySelectorAll("[data-prev]").forEach((b) => b.addEventListener("click", () => P.loadPreset((idx - 1 + n) % n)));
    root.querySelectorAll("[data-next]").forEach((b) => b.addEventListener("click", () => P.loadPreset((idx + 1) % n)));
    root.querySelectorAll("[data-pl]").forEach((b) => b.addEventListener("click", () => P.loadPreset(+b.dataset.pl)));
  }

  function build(root, P) {
    const sl = (k, l, sub) =>
      `<div class="sl"><div class="lb"><span>${l}</span><i>${sub}</i><b data-t="${k}"></b></div><div class="tr" data-p="${k}"><u></u><s></s></div></div>`;
    root.innerHTML = `<style>
      .f{position:absolute;inset:0;overflow:hidden;color:#dfe6ff;font-family:${SANS};
        background:radial-gradient(90% 70% at 85% 0%,rgba(167,139,250,.18),transparent 60%),radial-gradient(80% 60% at 0% 100%,rgba(45,212,191,.12),transparent 60%),#070a1a}
      .wm{position:absolute;left:24px;top:14px;font:300 40px/1 ${SANS};letter-spacing:.02em;color:#eef0ff;text-shadow:0 0 22px rgba(167,139,250,.55)}
      .wm b{font-weight:800;color:${VIO}}
      .sub{position:absolute;left:27px;top:60px;font:600 10px ${MONO};letter-spacing:.2em;color:#7d86c4;text-transform:uppercase}
      .stat{position:absolute;left:330px;top:16px;font:600 11px ${MONO};color:#7d86c4;line-height:1.55}
      .stat b{color:${TEAL};font-weight:700}
      .byp{all:unset;position:absolute;right:24px;top:20px;cursor:pointer;font:800 12px ${MONO};letter-spacing:.14em;padding:8px 16px;border:1.5px solid ${VIO};border-radius:20px;color:${VIO};background:#0b0f26}
      .byp.on{background:${VIO};color:#10102a;box-shadow:0 0 18px rgba(167,139,250,.55)}
      .rail{position:absolute;left:20px;top:92px;width:170px;display:flex;flex-direction:column;gap:6px}
      .rail h3{margin:0 0 2px;font:700 9px ${MONO};letter-spacing:.2em;color:#7d86c4}
      .tk{all:unset;cursor:pointer;display:block;padding:7px 12px;font:600 12px ${SANS};background:#0d1230;border:1px solid #232a5a;border-radius:16px;color:#a3acec}
      .tk:hover{border-color:#4a53a0}.tk.on{color:#10102a;background:linear-gradient(90deg,${VIO},${TEAL});border-color:transparent}
      .nav{display:flex;gap:6px}.nav button{all:unset;cursor:pointer;flex:1;text-align:center;padding:5px;border:1px solid #232a5a;color:${VIO};font:800 12px ${MONO};border-radius:16px}
      .nav button:hover{background:#151b44}
      .disp{position:absolute;left:212px;top:92px;width:688px;height:262px;background:#050716;border:1px solid #2a3170;border-radius:10px;box-shadow:inset 0 0 50px rgba(167,139,250,.08)}
      .disp canvas{position:absolute;inset:0;width:100%;height:100%}
      .sls{position:absolute;left:212px;top:372px;width:688px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px 24px}
      .sl .lb{display:flex;align-items:baseline;gap:6px;margin-bottom:3px;font:700 11px ${SANS};letter-spacing:.05em;text-transform:uppercase;color:#cfd6ff}
      .sl .lb i{font:500 9px ${MONO};font-style:normal;color:#5a63a4;text-transform:none;letter-spacing:0}
      .sl .lb b{margin-left:auto;text-transform:none;font:700 12px ${MONO};color:${TEAL}}
      .tr{position:relative;height:22px;cursor:ew-resize;touch-action:none}
      .tr u{position:absolute;left:0;right:0;top:9px;height:4px;background:#171d48;border-radius:2px}
      .tr:before{content:'';position:absolute;left:0;top:9px;height:4px;width:calc(var(--v)*100%);background:linear-gradient(90deg,${TEAL},${VIO});border-radius:2px}
      .tr s{position:absolute;top:3px;width:14px;height:16px;margin-left:-7px;left:calc(var(--v)*100%);background:#eef0ff;border-radius:8px;box-shadow:0 0 12px rgba(167,139,250,.8);text-decoration:none}
    </style>
    <div class="f">
      <div class="wm"><b>LIQUIDITY</b></div><div class="sub">reverb send · shared return</div>
      <div class="stat">pool depth <b id="pd">0 s</b> · lockup <b id="lk">0 ms</b><br>haircut <b id="hc">off</b> · spread <b id="sp">0%</b></div>
      <button class="byp" data-byp>DEEP</button>
      <div class="rail"><h3>POOLS</h3>${P.presets.map((p, i) => `<button class="tk" data-pl="${i}">${p.name}</button>`).join("")}
        <div class="nav"><button data-prev>&lsaquo;</button><button data-next>&rsaquo;</button></div></div>
      <div class="disp"><canvas id="cv" width="1376" height="524"></canvas></div>
      <div class="sls">${sl("decay", "Depth", "decay")}${sl("shape", "Bonding curve", "shape")}${sl("predelay", "Lockup", "pre-delay")}
        ${sl("damp", "Haircut", "damping")}${sl("width", "Spread", "width")}${sl("ret", "LP share", "return level")}${sl("amount", "Deposit", "this send")}</div>
    </div>`;
    const $ = (s) => root.querySelector(s);
    wire(root, P);
    P.sub("__bypass", (on) => {
      const b = $(".byp");
      b.textContent = on ? "DEEP" : "DRAINED";
      b.classList.toggle("on", !!on);
    });
    const cv = $("#cv");
    let axis = 3, glow = 0;
    P.raf((t) => {
      const decay = P.get("decay"), shape = P.get("shape"), pre = P.get("predelay") / 1000, damp = P.get("damp"), width = P.get("width");
      const g = fit(cv), w = 688, h = 262;
      g.clearRect(0, 0, w, h);
      const mid = 134, x0 = 56, x1 = w - 22, span = x1 - x0, half = 100;
      axis += (Math.max(2.5, pre + decay) * 1.1 - axis) * 0.2;
      const X = (s) => x0 + (s / axis) * span;
      // grid + time ticks
      g.font = "600 9px " + MONO; g.textBaseline = "alphabetic";
      for (let s = 0; s <= axis; s += axis > 5 ? 1 : 0.5) {
        const x = X(s);
        g.strokeStyle = "rgba(125,134,196,.12)"; g.lineWidth = 1; g.beginPath(); g.moveTo(x, 12); g.lineTo(x, h - 20); g.stroke();
        g.fillStyle = "#5a63a4"; g.fillText(s.toFixed(s % 1 ? 1 : 0) + "s", x - 6, h - 6);
      }
      g.strokeStyle = "rgba(223,230,255,.35)"; g.beginPath(); g.moveTo(x0, mid); g.lineTo(x1, mid); g.stroke();
      // lockup (pre-delay) hatch
      if (pre > 0.002) {
        const xe = X(pre);
        g.fillStyle = "rgba(167,139,250,.09)"; g.fillRect(x0, 14, xe - x0, h - 36);
        g.strokeStyle = "rgba(167,139,250,.5)"; g.setLineDash([3, 4]); g.beginPath(); g.moveTo(xe, 14); g.lineTo(xe, h - 22); g.stroke(); g.setLineDash([]);
        g.fillStyle = VIO; g.fillText("LOCKUP", Math.min(xe + 4, w - 60), 24);
      }
      // cumulative depth of the tail, drawn as stepped order-book levels (above: left side, below: right side)
      const K = 56, lowerScale = 0.2 + 0.8 * width;
      const energy = (s) => { const u = (s - pre) / decay; return u <= 0 || u >= 1 ? 0 : Math.pow(1 - u, shape); };
      const lv = [];
      let acc = 0;
      for (let k = K - 1; k >= 0; k--) { const s = pre + ((k + 0.5) / K) * decay; acc += energy(s) ** 2; lv[k] = acc; }
      const top = lv[0] || 1;
      const bright = damp > 19999 ? 1 : clamp(Math.log(damp / 800) / Math.log(25), 0.25, 1);
      const draw = (sign, scale, rgb) => {
        const gr = g.createLinearGradient(x0, 0, x1, 0);
        gr.addColorStop(0, `rgba(${rgb},${0.55 * bright + 0.1})`); gr.addColorStop(1, `rgba(${rgb},0.04)`);
        g.fillStyle = gr; g.strokeStyle = `rgba(${rgb},${0.55 + 0.4 * bright})`; g.lineWidth = 1.6;
        g.beginPath(); g.moveTo(X(pre), mid);
        for (let k = 0; k < K; k++) {
          const xa = X(pre + (k / K) * decay), xb = X(pre + ((k + 1) / K) * decay), y = mid - sign * (lv[k] / top) * half * scale;
          g.lineTo(xa, y); g.lineTo(xb, y);
        }
        g.lineTo(X(pre + decay), mid); g.closePath(); g.fill(); g.stroke();
      };
      draw(1, 1, "45,212,191");
      draw(-1, lowerScale, "251,113,133");
      g.fillStyle = TEAL; g.fillText("L", 14, mid - 40); g.fillStyle = ROSE; g.fillText("R", 14, mid + 48);
      // the live surface: what the return is adding right now, rippling along the axis
      const d = P.busData();
      glow = Math.max(clamp(P.busPeak() * 2.5, 0, 1), glow - 0.03);
      g.strokeStyle = `rgba(238,240,255,${0.35 + 0.6 * glow})`; g.lineWidth = 1.6; g.shadowColor = VIO; g.shadowBlur = 4 + 14 * glow; g.beginPath();
      if (d) {
        const n = 1024, off = d.length - n;
        for (let i = 0; i < n; i++) { const x = x0 + (i / (n - 1)) * span, y = mid + clamp(d[off + i] * 6, -1, 1) * 32; i ? g.lineTo(x, y) : g.moveTo(x, y); }
      } else { g.moveTo(x0, mid); g.lineTo(x1, mid); }
      g.stroke(); g.shadowBlur = 0;
      // inset: how the haircut dims the highs (start of the tail and its end)
      const ix = w - 190, iy = 18, iw = 168, ih = 62;
      g.fillStyle = "rgba(5,7,22,.82)"; g.fillRect(ix, iy, iw, ih); g.strokeStyle = "rgba(125,134,196,.3)"; g.strokeRect(ix + 0.5, iy + 0.5, iw, ih);
      g.fillStyle = "#5a63a4"; g.fillText("highs, start vs end of tail", ix + 6, iy + 11);
      [[damp, "rgba(45,212,191,.95)"], [damp * 0.25, "rgba(251,113,133,.85)"]].forEach(([fc, col]) => {
        g.strokeStyle = col; g.lineWidth = 1.4; g.beginPath();
        for (let i = 0; i <= 60; i++) {
          const f = 20 * Math.pow(1000, i / 60);
          const a = damp > 19999 && fc === damp ? 1 : 1 / Math.sqrt(1 + (f / Math.max(fc, 1)) ** 2);
          const y = iy + 16 + (1 - clamp(1 + Math.log10(a) / 1.2, 0, 1)) * (ih - 22), x = ix + 8 + (i / 60) * (iw - 16);
          i ? g.lineTo(x, y) : g.moveTo(x, y);
        }
        g.stroke();
      });
      // read-outs
      $("#pd").textContent = decay.toFixed(1) + " s";
      $("#lk").textContent = Math.round(pre * 1000) + " ms";
      $("#hc").textContent = damp > 19999 ? "off" : fq(damp) + "Hz";
      $("#sp").textContent = Math.round(width * 100) + "%";
    });
  }

  Kit.register("reverbSend", {
    fonts: "",
    w: 920,
    h: 540,
    presets,
    faces: [{ key: "A", name: "Liquidity", accent: VIO, w: 920, h: 540, build }],
  });
})();
