/* Proof of Free — Living Synth v3 · universal engine core.
 * One engine, 1,024 instruments. Requires ProofOfFreeGenome and
 * ProofOfFreePerformance (concatenated ahead of this file in the artifact).
 *
 * Streamlined redesign of the v2 engine:
 *  - mountable factory (many instances, shared AudioContext, voice cap)
 *    instead of a document-takeover singleton, so one mosaic page can host
 *    dormant / preview / full-instrument states without 1,024 audio graphs;
 *  - full genome synth voice (dual osc, drive, filter, ADSR, synced delay);
 *  - deterministic genesis melody on the shared 132 BPM transport;
 *  - tick-based gesture recording, replay, export, import;
 *  - seed auto-boot kept for recursive inscriptions (#pof-seed).
 */
(() => {
  "use strict";
  const G = globalThis.ProofOfFreeGenome;
  const P = globalThis.ProofOfFreePerformance;
  const PROTOCOL = "proof-of-free/engine-api-v3";

  const TICK_SECONDS = 60 / (G.MUSIC.bpm * G.MUSIC.ppq);
  const MAX_ACTIVE = 6;                 // preview cap with oldest-first stealing
  const active = [];
  let sharedContext = null;
  const audio = async () => {
    sharedContext ??= new AudioContext();
    if (sharedContext.state === "suspended") await sharedContext.resume();
    return sharedContext;
  };
  const clamp01 = v => Math.min(1, Math.max(0, Number(v) || 0));

  function makeDistortionCurve(amount) {
    const k = amount * 60, curve = new Float32Array(257);
    for (let i = 0; i < 257; i++) {
      const x = (i / 128) - 1;
      curve[i] = amount <= 0 ? x : ((1 + k) * x) / (1 + k * Math.abs(x));
    }
    return curve;
  }

  class Voice {
    constructor(context, genome, destination) {
      this.context = context;
      this.genome = genome;
      const g = genome;
      this.oscA = context.createOscillator();
      this.oscB = context.createOscillator();
      this.mixA = context.createGain();
      this.mixB = context.createGain();
      this.shaper = context.createWaveShaper();
      this.filter = context.createBiquadFilter();
      this.env = context.createGain();
      this.delay = context.createDelay(2);
      this.feedback = context.createGain();
      this.wet = context.createGain();
      this.out = context.createGain();

      this.oscA.type = g.oscillator.typeA;
      this.oscB.type = g.oscillator.typeB;
      this.oscB.detune.value = g.oscillator.detune;
      this.mixA.gain.value = 1 - g.oscillator.mix;
      this.mixB.gain.value = g.oscillator.mix;
      this.baseDrive = g.effects.distortion;
      this.shaper.curve = makeDistortionCurve(this.baseDrive);
      this.filter.type = g.filter.type;
      this.filter.frequency.value = g.filter.cutoff;
      this.filter.Q.value = g.filter.resonance;
      this.env.gain.value = 0;
      this.delay.delayTime.value = g.effects.delaySteps * G.TICKS_PER_STEP * TICK_SECONDS;
      this.feedback.gain.value = g.effects.feedback;
      this.wet.gain.value = g.effects.wet;
      this.out.gain.value = 0.22;

      this.oscA.connect(this.mixA).connect(this.shaper);
      this.oscB.connect(this.mixB).connect(this.shaper);
      this.shaper.connect(this.filter).connect(this.env);
      this.env.connect(this.out);
      this.env.connect(this.delay).connect(this.wet).connect(this.out);
      this.delay.connect(this.feedback).connect(this.delay);
      this.out.connect(destination || context.destination);
      this.oscA.start();
      this.oscB.start();
    }
    setPitch(midi, when, glide = 0.012) {
      const hz = G.midiToHz(midi);
      this.oscA.frequency.setTargetAtTime(hz, when, glide);
      this.oscB.frequency.setTargetAtTime(hz, when, glide);
    }
    noteOn(midi, velocity, when) {
      const e = this.genome.envelope, t = when ?? this.context.currentTime;
      this.setPitch(midi, t, 0.001);
      const peak = 0.06 + 0.24 * clamp01(velocity);
      this.env.gain.cancelScheduledValues(t);
      this.env.gain.setTargetAtTime(peak, t, Math.max(0.003, e.attack / 3));
      this.env.gain.setTargetAtTime(peak * e.sustain, t + e.attack, Math.max(0.01, e.decay / 3));
    }
    noteOff(when) {
      const t = when ?? this.context.currentTime;
      this.env.gain.cancelScheduledValues(t);
      this.env.gain.setTargetAtTime(0, t, Math.max(0.02, this.genome.envelope.release / 3));
    }
    setCutoffNorm(y, t) { // y: 0 bottom → 1 top of pad
      this.filter.frequency.setTargetAtTime(160 + (y * y) * 11000, t, 0.02);
    }
    setDrive(pressure) {
      this.shaper.curve = makeDistortionCurve(Math.min(1, this.baseDrive + pressure * 0.5));
    }
    dispose() {
      try { this.oscA.stop(); this.oscB.stop(); } catch { /* already stopped */ }
      this.out.disconnect();
    }
  }

  class Instrument {
    constructor(container, options) {
      const opts = options || {};
      this.edition = opts.edition;
      this.engineId = opts.engineId ?? 0;
      this.genome = G.deriveGenome(this.edition);
      this.genomeHash = G.genomeHash(this.genome);
      this.melody = G.deriveMelody(this.genome);
      this.container = container;
      this.mode = opts.mode || "instrument";   // "preview" | "instrument"
      this.voice = null;
      this.timers = [];
      this.schedulerTimer = null;
      this.recording = null;
      this.performance = null;                 // loaded/last performance
      this.pointerDown = false;
      this.resizeObserver = null;
      this.recordingTimer = null;
      this.renderShell();
      if (this.mode === "instrument") this.bindPad();
    }

    /* ---------- lifecycle & voice management ---------- */
    async ensureVoice() {
      const context = await audio();
      if (!this.voice) {
        while (active.length >= MAX_ACTIVE) active.shift().silence(); // steal oldest
        this.voice = new Voice(context, this.genome);
        active.push(this);
      }
      return this.voice;
    }
    silence() {
      this.stopTransport();
      if (this.voice) { this.voice.noteOff(); const v = this.voice; setTimeout(() => v.dispose(), 800); this.voice = null; }
      const i = active.indexOf(this); if (i >= 0) active.splice(i, 1);
      this.setStatus("idle");
    }
    destroy() {
      this.silence();
      this.resizeObserver?.disconnect();
      this.resizeObserver = null;
      this.container.replaceChildren();
    }

    /* ---------- transport ---------- */
    stopTransport() {
      this.timers.forEach(clearTimeout);
      this.timers = [];
      if (this.schedulerTimer) { clearInterval(this.schedulerTimer); this.schedulerTimer = null; }
      if (this.voice) this.voice.noteOff();
      this.playing = null;
    }

    /* Genesis melody: lookahead scheduler on the shared transport. */
    async playMelody() {
      const voice = await this.ensureVoice();
      this.stopTransport();
      this.playing = "melody";
      this.setStatus("genesis loop");
      const context = voice.context;
      const loopSeconds = G.TICKS_PER_LOOP * TICK_SECONDS;
      let loopStart = context.currentTime + 0.06;
      let index = 0;
      const horizon = 0.12;
      this.schedulerTimer = setInterval(() => {
        while (true) {
          if (index >= this.melody.length) { index = 0; loopStart += loopSeconds; }
          const note = this.melody[index];
          const when = loopStart + note.tick * TICK_SECONDS;
          if (when > context.currentTime + horizon) break;
          voice.noteOn(note.midi, note.velocity, when);
          voice.noteOff(when + note.gateSteps * G.TICKS_PER_STEP * TICK_SECONDS * 0.9);
          this.flash(note, when - context.currentTime);
          index++;
        }
      }, 30);
    }

    /* ---------- chaos pad ---------- */
    async gesture(point) {
      const type = ["down", "move", "up"].includes(point?.type) ? point.type : "move";
      const x = clamp01(point?.x), y = clamp01(point?.y), pressure = clamp01(point?.pressure ?? 0.65);
      if (this.recording) {
        if (this.recording.events.length < P.MAX_EVENTS) {
          this.recording.events.push(type === "up"
            ? { tick: this.nowTick(), type }
            : { tick: this.nowTick(), type, x, y, pressure });
        }
        if (this.recording.events.length >= P.MAX_EVENTS) this.stopRecording();
      }
      this.drawGesture(x, y, type);
      if (type === "up") { this.voice?.noteOff(); return; }
      const voice = await this.ensureVoice();
      const t = voice.context.currentTime;
      const midi = G.quantiseX(this.genome, x, 2);
      if (type === "down") voice.noteOn(midi, 0.4 + pressure * 0.6, t);
      else voice.setPitch(midi, t);
      voice.setCutoffNorm(1 - y, t);
      voice.setDrive(pressure);
    }

    /* ---------- recording (gestures, not audio) ---------- */
    nowTick() { return Math.round((performance.now() - this.recordStartMs) / 1000 / TICK_SECONDS); }
    startRecording() {
      this.stopRecording();
      this.recordStartMs = performance.now();
      this.recording = { events: [] };
      this.recordingTimer = setTimeout(
        () => this.stopRecording(),
        P.MAX_DURATION_TICKS * TICK_SECONDS * 1000
      );
      this.setStatus("recording");
    }
    stopRecording() {
      if (!this.recording) return null;
      clearTimeout(this.recordingTimer);
      this.recordingTimer = null;
      const events = this.recording.events.slice(0, P.MAX_EVENTS);
      this.recording = null;
      if (events.length === 0) { this.setStatus("idle"); return null; }
      if (events[events.length - 1].type !== "up") {
        const up = { tick: Math.min(this.nowTick(), P.MAX_DURATION_TICKS), type: "up" };
        if (events.length === P.MAX_EVENTS) events[events.length - 1] = up;
        else events.push(up);
      }
      const durationTicks = Math.max(G.TICKS_PER_LOOP,
        Math.min(P.MAX_DURATION_TICKS,
          Math.ceil(events[events.length - 1].tick / G.TICKS_PER_LOOP) * G.TICKS_PER_LOOP));
      this.performance = P.validate(P.create({
        edition: this.edition,
        genomeHash: this.genomeHash,
        engineVersion: this.genome.engineVersion,
        bpm: G.MUSIC.bpm
      }, events, durationTicks));
      this.setStatus(`captured ${events.length} events`);
      return this.performance;
    }
    loadPerformance(json) {
      this.performance = P.validate(typeof json === "string" ? JSON.parse(json) : json, {
        edition: this.edition, genomeHash: this.genomeHash, engineVersion: this.genome.engineVersion
      });
      return this.performance;
    }
    clearPerformance() {
      this.performance = null;
      this.setStatus("genesis fallback");
    }
    exportPerformance() {
      if (!this.performance) throw new Error("No performance captured yet.");
      return JSON.stringify(this.performance);
    }
    async playPerformance(perf) {
      const target = perf ? this.loadPerformance(perf) : this.performance;
      if (!target) throw new Error("No performance to play.");
      await this.ensureVoice();
      this.stopTransport();
      this.playing = "performance";
      this.setStatus("replaying performance");
      const loopMs = target.durationTicks * TICK_SECONDS * 1000;
      const schedule = () => {
        for (const e of target.events) {
          this.timers.push(setTimeout(() => { void this.gesture(e); }, e.tick * TICK_SECONDS * 1000));
        }
        this.timers.push(setTimeout(schedule, loopMs));
      };
      schedule();
    }

    /* ---------- rendering ---------- */
    renderShell() {
      const g = this.genome, m = g.mosaic;
      const hue = m.hue, accent = (hue + 137) % 360;
      const compact = this.mode === "preview";
      this.container.innerHTML = `
        <div class="pof-instrument" data-protocol="${PROTOCOL}" data-edition="${this.edition}"
             style="height:100%;display:grid;grid-template-rows:${compact ? "1fr" : "auto 1fr auto"};gap:10px;color:#fff;font-family:ui-monospace,monospace">
          ${compact ? "" : `
          <header style="display:flex;justify-content:space-between;align-items:end">
            <div><small style="opacity:.6">PROOF OF FREE / LIVING SYNTH v3</small>
              <h1 style="font-size:clamp(16px,3vw,26px);margin:2px 0 0">Edition ${String(this.edition).padStart(4, "0")}</h1></div>
            <small style="opacity:.6;text-align:right">ENGINE #${this.engineId} · v${g.engineVersion}<br>${this.genomeHash}</small>
          </header>`}
          <div class="pof-pad" role="application" aria-label="Chaos pad, edition ${this.edition}"
            style="position:relative;min-height:${compact ? "72px" : "220px"};overflow:hidden;border:1px solid hsl(${hue} 80% 62% / .6);border-radius:14px;touch-action:none;cursor:crosshair;background:radial-gradient(circle at 50% 45%,hsl(${accent} 80% 52% / ${0.15 + m.brightness * 0.3}),transparent 42%),linear-gradient(135deg,hsl(${hue} 70% ${8 + m.brightness * 14}%),#07070a 60%,hsl(${accent} 60% 12%))">
            <canvas style="position:absolute;inset:0;width:100%;height:100%"></canvas>
          </div>
          ${compact ? "" : `
          <footer style="display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;font-size:11px;opacity:.75">
            <span>${m.role.toUpperCase()} · ${m.palette.toUpperCase()} · TILE ${m.gridX},${m.gridY}</span>
            <span>${g.oscillator.typeA.toUpperCase()}+${g.oscillator.typeB.toUpperCase()} · ROOT ${g.rootNote} · ${G.MUSIC.root} DORIAN ${G.MUSIC.bpm}BPM</span>
            <span class="pof-status">idle</span>
          </footer>`}
        </div>`;
      this.pad = this.container.querySelector(".pof-pad");
      this.canvas = this.container.querySelector("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.statusEl = this.container.querySelector(".pof-status");
      this.resizeObserver = new ResizeObserver(() => this.resize());
      this.resizeObserver.observe(this.canvas);
      this.resize();
    }
    resize() {
      const ratio = Math.min(2, devicePixelRatio || 1);
      const box = this.canvas.getBoundingClientRect();
      this.canvas.width = Math.max(1, Math.round(box.width * ratio));
      this.canvas.height = Math.max(1, Math.round(box.height * ratio));
      this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }
    setStatus(text) { if (this.statusEl) this.statusEl.textContent = text; }
    drawGesture(x, y, type) {
      const box = this.canvas.getBoundingClientRect();
      const hue = (this.genome.mosaic.hue + x * 110) % 360;
      this.ctx.fillStyle = type === "up" ? "rgba(0,0,0,.10)" : `hsla(${hue},90%,68%,.22)`;
      this.ctx.beginPath();
      this.ctx.arc(x * box.width, y * box.height, type === "up" ? 5 : 10 + y * 26, 0, Math.PI * 2);
      this.ctx.fill();
    }
    flash(note, delaySeconds) {
      this.timers.push(setTimeout(() => {
        const box = this.canvas.getBoundingClientRect();
        const x = (note.step % 16) / 16 + 0.03, y = 0.85 - (note.midi - this.genome.rootNote) / 40;
        this.ctx.fillStyle = `hsla(${(this.genome.mosaic.hue + 137) % 360},90%,70%,.5)`;
        this.ctx.beginPath();
        this.ctx.arc(x * box.width, clamp01(y) * box.height, 4 + note.velocity * 8, 0, Math.PI * 2);
        this.ctx.fill();
      }, Math.max(0, delaySeconds * 1000)));
    }
    bindPad() {
      const pointOf = (event, type) => {
        const box = this.pad.getBoundingClientRect();
        return {
          type,
          x: clamp01((event.clientX - box.left) / box.width),
          y: clamp01((event.clientY - box.top) / box.height),
          pressure: clamp01(event.pressure || 0.65)
        };
      };
      this.pad.addEventListener("pointerdown", e => {
        this.pointerDown = true;
        this.pad.setPointerCapture?.(e.pointerId);
        void this.gesture(pointOf(e, "down"));
      });
      this.pad.addEventListener("pointermove", e => { if (this.pointerDown) void this.gesture(pointOf(e, "move")); });
      const up = e => {
        if (!this.pointerDown) return;
        this.pointerDown = false;
        void this.gesture(pointOf(e, "up"));
      };
      this.pad.addEventListener("pointerup", up);
      this.pad.addEventListener("pointercancel", up);
    }
  }

  class ClaimedMosaic {
    constructor(container, options) {
      this.container = container;
      this.options = options;
      this.claimed = new Set();
      this.previews = new Map();
      this.refreshTimer = null;
      this.scanTimer = null;
      this.render();
      void this.refresh();
      this.refreshTimer = setInterval(() => void this.refresh(), options.refreshMs || 30000);
    }
    render() {
      this.container.innerHTML = `
        <main style="height:100%;box-sizing:border-box;padding:14px;display:grid;grid-template-rows:auto 1fr auto;gap:10px;background:#000;color:#fff;font-family:ui-monospace,monospace">
          <header style="display:flex;justify-content:space-between;gap:12px">
            <div><small style="opacity:.6">PROOF OF FREE / CLAIMED MOSAIC</small><br><b>LIVING SYNTH v3</b></div>
            <small class="pof-count" style="opacity:.65;text-align:right">0 / ${G.COLLECTION_SIZE} CLAIMED<br>checking contract…</small>
          </header>
          <canvas width="1024" height="1024" aria-label="32 by 32 claimed synth mosaic"
            style="display:block;width:min(100%,calc(100vh - 120px));max-height:100%;aspect-ratio:1;justify-self:center;background:#000;image-rendering:pixelated;touch-action:none;cursor:default"></canvas>
          <footer style="display:flex;gap:8px;align-items:center">
            <button class="pof-play" disabled style="background:#090909;color:#fff;border:1px solid #282828;padding:7px 10px;font:inherit">▶ PLAY CLAIMED</button>
            <button class="pof-stop" style="background:#090909;color:#fff;border:1px solid #282828;padding:7px 10px;font:inherit">■ STOP</button>
            <small class="pof-message" style="opacity:.6">Unclaimed squares are black and inert.</small>
          </footer>
        </main>`;
      this.canvas = this.container.querySelector("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.count = this.container.querySelector(".pof-count");
      this.message = this.container.querySelector(".pof-message");
      this.playButton = this.container.querySelector(".pof-play");
      this.draw();
      this.canvas.addEventListener("click", event => {
        const edition = this.editionAt(event);
        if (this.claimed.has(edition)) this.toggle(edition);
      });
      this.playButton.addEventListener("click", () => this.playClaimed());
      this.container.querySelector(".pof-stop").addEventListener("click", () => this.stop());
    }
    editionAt(event) {
      const box = this.canvas.getBoundingClientRect();
      const x = Math.min(G.GRID - 1, Math.max(0, ((event.clientX - box.left) / box.width * G.GRID) | 0));
      const y = Math.min(G.GRID - 1, Math.max(0, ((event.clientY - box.top) / box.height * G.GRID) | 0));
      return y * G.GRID + x + 1;
    }
    draw() {
      const tile = this.canvas.width / G.GRID;
      this.ctx.fillStyle = "#000";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      for (const edition of this.claimed) {
        const g = G.deriveGenome(edition), m = g.mosaic;
        this.ctx.fillStyle = `hsl(${m.hue} 88% ${18 + m.brightness * 44}%)`;
        this.ctx.fillRect(m.gridX * tile + 1, m.gridY * tile + 1, tile - 2, tile - 2);
      }
    }
    validateRegistry(value) {
      const o = this.options;
      if (!value || value.protocol !== "proof-of-free/claimed-registry" || value.version !== 1) throw new Error("registry protocol mismatch");
      if (value.contractId !== o.controllerContract || value.campaignId !== o.campaignId) throw new Error("registry contract mismatch");
      if (value.engineId !== o.engineId || value.engineSha256 !== o.engineSha256) throw new Error("registry engine mismatch");
      if (value.maxSupply !== G.COLLECTION_SIZE || value.active !== true) throw new Error("collection is not active");
      if (!value.policy || value.policy.onePerWallet !== true || value.policy.requireBns !== true || value.policy.onePerBns !== true) {
        throw new Error("required claim policy is not active");
      }
      if (!Array.isArray(value.claims) || value.claims.length > G.COLLECTION_SIZE) throw new Error("invalid claim list");
      const editions = new Set(), tokens = new Set();
      for (const claim of value.claims) {
        if (!claim || !Number.isInteger(claim.edition) || claim.edition < 1 || claim.edition > G.COLLECTION_SIZE) throw new Error("invalid claimed edition");
        if (!Number.isSafeInteger(claim.tokenId) || claim.tokenId < 0) throw new Error("invalid claimed token");
        if (editions.has(claim.edition) || tokens.has(claim.tokenId)) throw new Error("duplicate claim");
        editions.add(claim.edition); tokens.add(claim.tokenId);
      }
      return editions;
    }
    async refresh() {
      try {
        const response = await fetch(this.options.registryUrl, { cache: "no-store" });
        if (!response.ok) throw new Error(`registry HTTP ${response.status}`);
        const next = this.validateRegistry(await response.json());
        this.claimed = next;
        this.draw();
        this.count.innerHTML = `${next.size} / ${G.COLLECTION_SIZE} CLAIMED<br>CONTRACT VERIFIED`;
        this.message.textContent = next.size ? "Click a revealed square to trigger its synth." : "No successful claims yet.";
        this.playButton.disabled = next.size === 0;
      } catch (error) {
        /* Fail closed: a registry or policy failure can never reveal an item. */
        this.stop();
        this.claimed = new Set();
        this.draw();
        this.count.innerHTML = `0 / ${G.COLLECTION_SIZE} CLAIMED<br>REGISTRY UNVERIFIED`;
        this.message.textContent = `All squares locked: ${error.message}`;
        this.playButton.disabled = true;
      }
    }
    makePreview(edition) {
      const host = document.createElement("div");
      host.style.cssText = "position:fixed;left:-10000px;width:80px;height:60px";
      document.body.appendChild(host);
      return { host, instrument: new Instrument(host, { edition, engineId: this.options.engineId, mode: "preview" }) };
    }
    toggle(edition) {
      const prior = this.previews.get(edition);
      if (prior) {
        prior.instrument.destroy(); prior.host.remove(); this.previews.delete(edition);
        return;
      }
      const preview = this.makePreview(edition);
      this.previews.set(edition, preview);
      void preview.instrument.playMelody();
      while (this.previews.size > MAX_ACTIVE) {
        const first = this.previews.keys().next().value;
        const old = this.previews.get(first);
        old.instrument.destroy(); old.host.remove(); this.previews.delete(first);
      }
    }
    playClaimed() {
      this.stop();
      const editions = [...this.claimed];
      if (!editions.length) return;
      let cursor = 0;
      const trigger = () => {
        const edition = editions[cursor++ % editions.length];
        this.toggle(edition);
        setTimeout(() => {
          const preview = this.previews.get(edition);
          if (preview) { preview.instrument.destroy(); preview.host.remove(); this.previews.delete(edition); }
        }, 1800);
      };
      trigger();
      this.scanTimer = setInterval(trigger, (60 / G.MUSIC.bpm) * 1000);
    }
    stop() {
      clearInterval(this.scanTimer); this.scanTimer = null;
      for (const { instrument, host } of this.previews.values()) { instrument.destroy(); host.remove(); }
      this.previews.clear();
    }
    destroy() {
      clearInterval(this.refreshTimer);
      this.stop();
      this.container.replaceChildren();
    }
  }

  const api = Object.freeze({
    protocol: PROTOCOL,
    engineVersion: G.ENGINE_VERSION,
    music: G.MUSIC,
    genome: G,
    performance: P,
    mount(container, options) { return new Instrument(container, options); },
    mountMosaic(container, options) { return new ClaimedMosaic(container, options); },
    activeCount() { return active.length; },
    stopAll() { [...active].forEach(i => i.silence()); }
  });
  globalThis.ProofOfFree = api;

  /* Recursive-inscription auto-boot: identical trust shape to v2 seeds. */
  const seedNode = document.getElementById("pof-seed");
  if (seedNode) {
    const seed = JSON.parse(seedNode.textContent || "{}");
    const genome = G.deriveGenome(seed.edition);
    if (
      seed.protocol !== "proof-of-free/seed" || seed.version !== 3 ||
      !Number.isSafeInteger(seed.engineId) || seed.engineId < 0 ||
      seed.engineVersion !== G.ENGINE_VERSION ||
      seed.genomeHash !== G.genomeHash(genome)
    ) throw new Error("Invalid Proof of Free v3 seed");
    document.documentElement.style.cssText = "height:100%;background:#050507";
    document.body.style.cssText = "height:100%;margin:0;padding:14px;box-sizing:border-box;overflow:hidden;background:#050507";
    const rootEl = document.createElement("div");
    rootEl.style.height = "100%";
    document.body.appendChild(rootEl);
    const instrument = api.mount(rootEl, { edition: seed.edition, engineId: seed.engineId });
    rootEl.querySelector(".pof-pad").addEventListener("pointerdown", () => {}, { once: true });
    dispatchEvent(new CustomEvent("proof-of-free:ready", {
      detail: { protocol: PROTOCOL, edition: seed.edition, engineId: seed.engineId, genomeHash: instrument.genomeHash }
    }));
  }
  const masterNode = document.getElementById("pof-master");
  if (masterNode) {
    const config = JSON.parse(masterNode.textContent || "{}");
    if (
      config.protocol !== "proof-of-free/master" || config.version !== 3 ||
      !Number.isSafeInteger(config.engineId) || config.engineId <= 0 ||
      !Number.isInteger(config.campaignId) || config.campaignId < 0 ||
      typeof config.engineSha256 !== "string" || !/^[0-9a-f]{64}$/.test(config.engineSha256) ||
      typeof config.controllerContract !== "string" || !/^S[PT][A-Z0-9]{38,40}\.[a-z0-9-]+$/.test(config.controllerContract) ||
      typeof config.registryUrl !== "string" || !/^https:\/\//.test(config.registryUrl)
    ) throw new Error("Invalid Proof of Free master configuration");
    document.documentElement.style.cssText = "height:100%;background:#000";
    document.body.style.cssText = "height:100%;margin:0;background:#000";
    const rootEl = document.createElement("div");
    rootEl.style.height = "100%";
    document.body.appendChild(rootEl);
    api.mountMosaic(rootEl, config);
  }
})();
