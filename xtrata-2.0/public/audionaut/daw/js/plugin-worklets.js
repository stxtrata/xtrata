// plugin-worklets.js — AudioWorklet processors for the dynamics plugins in plugins.js.
//
//   an-gate   sample-accurate noise gate (detector HP/LP, threshold, hysteresis,
//             attack / hold / release, range). Posts {open, level, gain} ~30×/s.
//   an-trans  level-independent transient shaper (fast / slow / slowest envelope
//             followers, gain = f(ratio)). Posts {attackGain, sustainGain} (dB) ~30×/s.
//
// The processors are written as ONE ordinary function (processorsMain) whose source is
// shipped to the worklet scope through a Blob URL, so there is no extra file to host and
// the module also works when the page itself is inlined. The function must stay
// self-contained (it runs in AudioWorkletGlobalScope — no closures over this file).
//
// ensureWorklets(ctx) never throws: it resolves true once the processors are registered
// for that context, false if AudioWorklet / Blob URLs are unavailable or loading failed.
// Plugins that use it keep working (old native path, or passthrough) until it resolves.

function processorsMain() {
  const LN10_20 = Math.LN10 / 20;
  const lin = (db) => Math.exp(db * LN10_20);
  const tcCoef = (sec, sr) => 1 - Math.exp(-1 / Math.max(1, sec * sr));

  // RBJ 2nd-order Butterworth high/low-pass, direct form I per channel.
  function biquadCoefs(kind, f, sr) {
    const w0 = (2 * Math.PI * Math.min(f, sr * 0.45)) / sr;
    const cs = Math.cos(w0);
    const alpha = Math.sin(w0) / (2 * Math.SQRT1_2);
    const a0 = 1 + alpha;
    let b0, b1, b2;
    if (kind === "hp") {
      b0 = (1 + cs) / 2;
      b1 = -(1 + cs);
      b2 = b0;
    } else {
      b0 = (1 - cs) / 2;
      b1 = 1 - cs;
      b2 = b0;
    }
    return [b0 / a0, b1 / a0, b2 / a0, (-2 * cs) / a0, (1 - alpha) / a0];
  }
  class Biquad {
    constructor() {
      this.on = false;
      this.c = [1, 0, 0, 0, 0];
      this.x1 = [0, 0];
      this.x2 = [0, 0];
      this.y1 = [0, 0];
      this.y2 = [0, 0];
    }
    set(kind, f, sr, active) {
      this.on = active;
      if (active) this.c = biquadCoefs(kind, f, sr);
    }
    run(ch, x) {
      if (!this.on) return x;
      const c = this.c;
      const y =
        c[0] * x + c[1] * this.x1[ch] + c[2] * this.x2[ch] - c[3] * this.y1[ch] - c[4] * this.y2[ch];
      this.x2[ch] = this.x1[ch];
      this.x1[ch] = x;
      this.y2[ch] = this.y1[ch];
      this.y1[ch] = y;
      return y;
    }
  }

  // ------------------------------------------------------------------ an-gate
  class AnGate extends AudioWorkletProcessor {
    constructor(options) {
      super();
      this.p = { threshold: -45, hysteresis: 0, attack: 0.005, hold: 0, release: 0.12, range: -80, detHp: 20, detLp: 20000 };
      this.hp = new Biquad();
      this.lp = new Biquad();
      this.ms = 0; // detector: smoothed power
      this.open = false;
      this.holdLeft = 0;
      this.dead = false;
      this.postEvery = Math.max(128, Math.round(sampleRate / 30));
      this.sincePost = 0;
      // Initial state arrives as processorOptions (not a port message): a message posted
      // right after construction can land after an offline render has already started.
      const po = (options && options.processorOptions) || {};
      this.update(Object.assign({}, this.p, po.p));
      this.g = po.init ? po.init.gain : this.rangeLin; // starts closed unless handed a state
      this.open = po.init ? !!po.init.open : false;
      this.port.onmessage = (e) => {
        const m = e.data || {};
        if (m.type === "kill") this.dead = true;
        else if (m.type === "params") this.update(m.p);
      };
    }
    update(p) {
      Object.assign(this.p, p);
      const q = this.p;
      this.thrSq = Math.pow(10, q.threshold / 10);
      this.closeSq = Math.pow(10, (q.threshold - q.hysteresis) / 10);
      this.rangeLin = lin(Math.min(0, q.range));
      this.ca = tcCoef(q.attack, sampleRate);
      this.cr = tcCoef(q.release, sampleRate);
      this.holdN = Math.round(q.hold * sampleRate);
      this.hp.set("hp", q.detHp, sampleRate, q.detHp > 20.5);
      this.lp.set("lp", q.detLp, sampleRate, q.detLp < 19999);
      this.dRise = tcCoef(0.002, sampleRate);
      this.dFall = tcCoef(0.008, sampleRate);
    }
    process(inputs, outputs) {
      if (this.dead) return false;
      const inp = inputs[0];
      const out = outputs[0];
      const n = out[0] ? out[0].length : 128;
      if (!inp || !inp.length) {
        for (const ch of out) ch.fill(0);
        this.g += (this.rangeLin - this.g) * 0.05;
        this.maybePost(n);
        return true;
      }
      const nch = Math.min(inp.length, out.length);
      const det = Math.min(nch, 2);
      let ms = this.ms;
      let g = this.g;
      let open = this.open;
      let holdLeft = this.holdLeft;
      const { thrSq, closeSq, rangeLin, ca, cr, holdN, dRise, dFall } = this;
      for (let i = 0; i < n; i++) {
        let a = 0;
        for (let c = 0; c < det; c++) {
          let x = this.hp.run(c, inp[c][i]);
          x = this.lp.run(c, x);
          const s = x * x;
          if (s > a) a = s;
        }
        ms += (a - ms) * (a > ms ? dRise : dFall);
        if (!open) {
          if (ms > thrSq) {
            open = true;
            holdLeft = holdN;
          }
        } else if (ms > closeSq) holdLeft = holdN;
        else if (holdLeft > 0) holdLeft--;
        else open = false;
        const target = open ? 1 : rangeLin;
        g += (target - g) * (target > g ? ca : cr);
        for (let c = 0; c < nch; c++) out[c][i] = inp[c][i] * g;
      }
      for (let c = nch; c < out.length; c++) out[c].fill(0);
      this.ms = ms;
      this.g = g;
      this.open = open;
      this.holdLeft = holdLeft;
      this.maybePost(n);
      return true;
    }
    maybePost(n) {
      this.sincePost += n;
      if (this.sincePost < this.postEvery) return;
      this.sincePost = 0;
      this.port.postMessage({
        open: this.open,
        level: 10 * Math.log10(this.ms + 1e-16),
        gain: Math.max(0, Math.min(1, this.g)),
      });
    }
  }

  // ----------------------------------------------------------------- an-trans
  // Three rectified-peak followers on the (channel-linked) input:
  //   fast    attack 0.5 ms, release 25 ms
  //   slow    attack 30 ms,  release 120 ms
  //   slowest attack 30 ms,  release 450 ms
  // r1 = dB(fast/slow)    > 0 while a note is rising  (attack portion)
  // r2 = dB(fast/slowest) < 0 while it is decaying    (sustain portion)
  // gain_dB = attack · min(r1⁺, 12) + sustain · min(r2⁻, 12), both ±100 % → ±1.
  // Ratios of followers don't depend on absolute level, so the shaper is level independent.
  // Below ≈ −75 dB the effect fades out so noise floors are not shaped.
  class AnTrans extends AudioWorkletProcessor {
    constructor(options) {
      super();
      this.p = { attack: 0, sustain: 0, speed: 0.5 };
      this.fast = 0;
      this.slow = 0;
      this.slowest = 0;
      this.gdB = 0;
      this.dead = false;
      this.maxA = 0;
      this.maxS = 0;
      this.postEvery = Math.max(128, Math.round(sampleRate / 30));
      this.sincePost = 0;
      const po = (options && options.processorOptions) || {};
      this.update(Object.assign({}, this.p, po.p));
      this.port.onmessage = (e) => {
        const m = e.data || {};
        if (m.type === "kill") this.dead = true;
        else if (m.type === "params") this.update(m.p);
      };
    }
    update(p) {
      Object.assign(this.p, p);
      const s = this.p.speed;
      const T = Math.pow(2, (0.5 - s) * 2); // speed 0 → ×2 slower, 1 → ×0.5 faster
      this.fA = tcCoef(0.0005 * T, sampleRate);
      this.fR = tcCoef(0.025 * T, sampleRate);
      this.sA = tcCoef(0.03 * T, sampleRate);
      this.sR = tcCoef(0.12 * T, sampleRate);
      this.zR = tcCoef(0.45 * T, sampleRate);
      this.gS = tcCoef(0.0003, sampleRate);
      this.atk = this.p.attack / 100;
      this.sus = this.p.sustain / 100;
    }
    process(inputs, outputs) {
      if (this.dead) return false;
      const inp = inputs[0];
      const out = outputs[0];
      const n = out[0] ? out[0].length : 128;
      if (!inp || !inp.length) {
        for (const ch of out) ch.fill(0);
        this.maybePost(n);
        return true;
      }
      const nch = Math.min(inp.length, out.length);
      let { fast, slow, slowest, gdB, maxA, maxS } = this;
      const { fA, fR, sA, sR, zR, gS, atk, sus } = this;
      const active = atk !== 0 || sus !== 0;
      for (let i = 0; i < n; i++) {
        let a = 0;
        for (let c = 0; c < nch; c++) {
          const v = Math.abs(inp[c][i]);
          if (v > a) a = v;
        }
        fast += (a - fast) * (a > fast ? fA : fR);
        slow += (a - slow) * (a > slow ? sA : sR);
        slowest += (a - slowest) * (a > slowest ? sA : zR);
        let target = 0;
        if (active) {
          const fdB = 20 * Math.log10(fast + 1e-5);
          const r1 = fdB - 20 * Math.log10(slow + 1e-5);
          const r2 = fdB - 20 * Math.log10(slowest + 1e-5);
          const sdB = 20 * Math.log10(slowest + 1e-5);
          const fade = Math.max(0, Math.min(1, (sdB + 75) / 15));
          const ga = r1 > 0 ? atk * Math.min(r1, 12) * fade : 0;
          const gs = r2 < 0 ? sus * Math.min(-r2, 12) * fade : 0;
          target = ga + gs;
          if (Math.abs(ga) > Math.abs(maxA)) maxA = ga;
          if (Math.abs(gs) > Math.abs(maxS)) maxS = gs;
        }
        gdB += (target - gdB) * gS;
        const g = Math.exp(gdB * LN10_20);
        for (let c = 0; c < nch; c++) out[c][i] = inp[c][i] * g;
      }
      for (let c = nch; c < out.length; c++) out[c].fill(0);
      this.fast = fast;
      this.slow = slow;
      this.slowest = slowest;
      this.gdB = gdB;
      this.maxA = maxA;
      this.maxS = maxS;
      this.maybePost(n);
      return true;
    }
    maybePost(n) {
      this.sincePost += n;
      if (this.sincePost < this.postEvery) return;
      this.sincePost = 0;
      this.port.postMessage({ attackGain: this.maxA, sustainGain: this.maxS });
      this.maxA = 0;
      this.maxS = 0;
    }
  }

  registerProcessor("an-gate", AnGate);
  registerProcessor("an-trans", AnTrans);
}

const WORKLET_SRC = `(${processorsMain.toString()})();`;
const loads = new WeakMap(); // ctx → Promise<boolean>

export async function ensureWorklets(ctx) {
  try {
    if (!ctx || !ctx.audioWorklet || typeof AudioWorkletNode === "undefined") return false;
    if (typeof Blob === "undefined" || typeof URL === "undefined" || !URL.createObjectURL) return false;
    let p = loads.get(ctx);
    if (!p) {
      p = (async () => {
        let url = "";
        try {
          url = URL.createObjectURL(new Blob([WORKLET_SRC], { type: "text/javascript" }));
          await ctx.audioWorklet.addModule(url);
          return true;
        } catch {
          return false;
        } finally {
          if (url) URL.revokeObjectURL(url);
        }
      })();
      loads.set(ctx, p);
    }
    return await p;
  } catch {
    return false;
  }
}
