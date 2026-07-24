/* Proof of Free Living Synth recursive engine v2.
 * Immutable shared runtime. Edition identity is supplied by #pof-seed.
 */
(() => {
  "use strict";

  const PROTOCOL = "proof-of-free/engine-api-v2";
  const WAVEFORMS = ["sine", "triangle", "sawtooth", "square"];
  const PALETTES = [
    "Infrared", "Ember", "Amber", "Solar",
    "Lime", "Verdant", "Aqua", "Cyan",
    "Azure", "Cobalt", "Violet", "Ultraviolet",
    "Magenta", "Rose", "Silver", "Lunar"
  ];
  const ROOT_NOTES = [
    "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2",
    "G#2", "A2", "A#2", "B2", "C3", "C#3", "D3", "D#3"
  ];
  const clamp = value => Math.max(0, Math.min(1, Number(value) || 0));

  function deriveTraits(edition) {
    const slot = (((edition - 1) * 733) + 421) & 1023;
    const rootIndex = (slot >>> 2) & 15;
    return {
      profile: slot + 1,
      hue: Number(((slot * 360) / 1024).toFixed(6)),
      palette: PALETTES[(slot >>> 6) & 15],
      rootNote: ROOT_NOTES[rootIndex],
      rootMidi: 36 + rootIndex,
      waveform: WAVEFORMS[slot & 3]
    };
  }

  function readSeed() {
    const node = document.getElementById("pof-seed");
    if (!node) throw new Error("Missing #pof-seed");
    const seed = JSON.parse(node.textContent || "{}");
    if (
      seed.protocol !== "proof-of-free/seed" ||
      seed.version !== 2 ||
      !Number.isInteger(seed.edition) ||
      seed.edition < 1 ||
      seed.edition > 1024 ||
      !Number.isSafeInteger(seed.engineId) ||
      seed.engineId < 0 ||
      JSON.stringify(seed.traits) !== JSON.stringify(deriveTraits(seed.edition))
    ) {
      throw new Error("Invalid Proof of Free seed");
    }
    return seed;
  }

  const seed = readSeed();
  const traits = Object.freeze(seed.traits);
  const hue = traits.hue;
  const accent = (hue + 137) % 360;
  const root = 440 * 2 ** ((traits.rootMidi - 69) / 12);
  const waveform = traits.waveform;

  document.documentElement.style.cssText = "height:100%;background:#050507";
  document.body.style.cssText = "height:100%;margin:0;overflow:hidden;background:#050507;color:#fff;font-family:ui-monospace,monospace";
  document.body.insertAdjacentHTML("afterbegin", `
    <main id="proof-of-free" style="height:100%;display:grid;grid-template-rows:auto 1fr auto;gap:12px;padding:16px;box-sizing:border-box">
      <header style="display:flex;justify-content:space-between;align-items:end">
        <div><small style="opacity:.65">PROOF OF FREE / LIVING SYNTH</small><h1 style="font-size:clamp(18px,4vw,32px);margin:4px 0 0">Edition ${seed.edition.toString().padStart(4, "0")}</h1></div>
        <small style="opacity:.65">ENGINE #${seed.engineId}</small>
      </header>
      <div id="kaoss-pad" role="application" aria-label="Proof of Free playable XY synthesizer"
        style="position:relative;min-height:220px;overflow:hidden;border:1px solid hsl(${hue} 80% 65% / .65);border-radius:16px;touch-action:none;cursor:crosshair;background:radial-gradient(circle at 50% 50%,hsl(${accent} 80% 55% / .42),transparent 38%),linear-gradient(135deg,hsl(${hue} 70% 18%),#08080b 58%,hsl(${accent} 65% 15%));box-shadow:inset 0 0 80px #0008,0 20px 70px #0008">
        <canvas id="pof-canvas" style="position:absolute;inset:0;width:100%;height:100%"></canvas>
        <div id="pof-cursor" style="position:absolute;left:50%;top:50%;width:22px;height:22px;margin:-11px;border:2px solid #fff;border-radius:50%;box-shadow:0 0 24px hsl(${accent} 90% 70%);pointer-events:none;opacity:.45"></div>
      </div>
      <footer style="display:flex;justify-content:space-between;gap:12px;font-size:11px;opacity:.7"><span>PROFILE ${traits.profile.toString().padStart(4, "0")} · ${traits.palette.toUpperCase()}</span><span>${waveform.toUpperCase()} · ROOT ${traits.rootNote}</span></footer>
    </main>
  `);

  const pad = document.getElementById("kaoss-pad");
  const rootElement = document.getElementById("proof-of-free");
  const cursor = document.getElementById("pof-cursor");
  const canvas = document.getElementById("pof-canvas");
  const context2d = canvas.getContext("2d");
  let audioContext;
  let oscillator;
  let filter;
  let gain;
  let active = false;
  rootElement.dataset.protocol = PROTOCOL;
  rootElement.dataset.edition = String(seed.edition);
  rootElement.dataset.engineId = String(seed.engineId);
  rootElement.dataset.traitProfile = String(traits.profile);
  pad.dataset.engineReady = "true";

  function resize() {
    const ratio = Math.min(2, globalThis.devicePixelRatio || 1);
    const box = canvas.getBoundingClientRect();
    canvas.width = Math.max(1, Math.round(box.width * ratio));
    canvas.height = Math.max(1, Math.round(box.height * ratio));
    context2d.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  function draw(x, y, gate) {
    const box = canvas.getBoundingClientRect();
    context2d.fillStyle = gate === "off" ? "rgba(0,0,0,.08)" : `hsla(${(hue + x * 110) % 360},90%,70%,.2)`;
    context2d.beginPath();
    context2d.arc(x * box.width, y * box.height, gate === "off" ? 6 : 12 + y * 34, 0, Math.PI * 2);
    context2d.fill();
    cursor.style.left = `${x * 100}%`;
    cursor.style.top = `${y * 100}%`;
    cursor.style.opacity = gate === "off" ? ".35" : "1";
  }

  async function ensureAudio() {
    audioContext ??= new AudioContext();
    if (audioContext.state === "suspended") await audioContext.resume();
    if (!oscillator) {
      oscillator = audioContext.createOscillator();
      filter = audioContext.createBiquadFilter();
      gain = audioContext.createGain();
      oscillator.type = waveform;
      filter.type = "lowpass";
      gain.gain.value = 0;
      oscillator.connect(filter).connect(gain).connect(audioContext.destination);
      oscillator.start();
    }
  }

  async function gesture(point) {
    const gate = ["on", "move", "off"].includes(point?.gate) ? point.gate : "move";
    const x = clamp(point?.x);
    const y = clamp(point?.y);
    const pressure = clamp(point?.pressure ?? 0.65);
    draw(x, y, gate);
    if (gate === "off") {
      active = false;
      if (audioContext && gain) gain.gain.setTargetAtTime(0, audioContext.currentTime, 0.025);
      return;
    }
    await ensureAudio();
    active = true;
    const now = audioContext.currentTime;
    oscillator.frequency.setTargetAtTime(root * 2 ** (x * 5), now, 0.015);
    filter.frequency.setTargetAtTime(160 + (1 - y) ** 2 * 12_000, now, 0.02);
    gain.gain.setTargetAtTime(0.025 + pressure * 0.13, now, 0.01);
  }

  function stop() {
    if (!active) return;
    active = false;
    if (audioContext && gain) gain.gain.setTargetAtTime(0, audioContext.currentTime, 0.025);
  }

  function pointFromEvent(event, gate) {
    const box = pad.getBoundingClientRect();
    return {
      x: clamp((event.clientX - box.left) / box.width),
      y: clamp((event.clientY - box.top) / box.height),
      pressure: clamp(event.pressure || 0.65),
      gate
    };
  }

  let pointerDown = false;
  pad.addEventListener("pointerdown", event => {
    pointerDown = true;
    pad.setPointerCapture?.(event.pointerId);
    void gesture(pointFromEvent(event, "on"));
  });
  pad.addEventListener("pointermove", event => {
    if (pointerDown) void gesture(pointFromEvent(event, "move"));
  });
  const release = event => {
    if (!pointerDown) return;
    pointerDown = false;
    void gesture(pointFromEvent(event, "off"));
  };
  pad.addEventListener("pointerup", release);
  pad.addEventListener("pointercancel", release);
  addEventListener("resize", resize);
  resize();

  globalThis.ProofOfFree = Object.freeze({
    protocol: PROTOCOL,
    edition: seed.edition,
    engineId: seed.engineId,
    traits,
    gesture,
    stop
  });
  dispatchEvent(new CustomEvent("proof-of-free:ready", {
    detail: { protocol: PROTOCOL, edition: seed.edition, engineId: seed.engineId, traits }
  }));
})();
