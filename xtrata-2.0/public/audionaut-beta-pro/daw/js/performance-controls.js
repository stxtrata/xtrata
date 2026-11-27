import { store } from "./state.js";
import { getMidiTarget, setMidiTarget, midiStatus, setMidiEnabled } from "./midi-input.js";
import { getArpSettings, setArpSettings, getVoicing, setVoicing, panic } from "./live-keys.js";

export function initPerformanceControls() {
  const $ = id => document.getElementById(id);
  const target = $("live-instrument");
  const syncTarget = () => {
    const selected = getMidiTarget();
    target.replaceChildren(...Array.from({ length: store.project.instruments.length }, (_, i) =>
      new Option(`${i + 1} · ${store.instrument(i).name}`, String(i))));
    target.value = String(selected);
    document.querySelectorAll(".channel.instrument").forEach(row => {
      const active = +row.dataset.inst === selected;
      row.classList.toggle("midi-target", active);
      row.dataset.midiTarget = String(active);
    });
    const cfg = getArpSettings(selected);
    $("arp-enabled").checked = cfg.enabled;
    $("arp-rate").value = String(cfg.rate);
    $("arp-mode").value = cfg.mode;
    $("arp-octaves").value = String(cfg.octaves);
    $("arp-gate").value = cfg.gate;
    $("arp-gate-value").value = `${Math.round(cfg.gate * 100)}%`;
    const voicing = getVoicing(selected);
    $("voice-mode").value = voicing.mode;
    $("voice-glide").value = voicing.glide;
    $("voice-glide").disabled = voicing.mode === "poly";
    $("voice-glide-value").value = `${Math.round(voicing.glide * 1000)} ms`;
  };
  const syncMidi = () => {
    const state = midiStatus();
    $("live-midi").textContent = state.on ? "MIDI on" : "Enable MIDI";
    $("live-midi").setAttribute("aria-pressed", String(state.on));
    $("live-midi-status").textContent = state.error || (state.on
      ? state.names.length ? state.names.join(", ") : "MIDI on · connect a controller"
      : "MIDI off · mouse and computer keys are ready");
  };
  target.addEventListener("change", () => setMidiTarget(+target.value));
  $("live-midi").addEventListener("click", () => setMidiEnabled(!midiStatus().on));
  $("live-panic").addEventListener("click", () => {
    panic();
    document.dispatchEvent(new CustomEvent("audionaut-panic"));
  });
  for (const [id, key, event] of [["arp-enabled", "enabled", "change"], ["arp-rate", "rate", "change"], ["arp-mode", "mode", "change"], ["arp-octaves", "octaves", "change"], ["arp-gate", "gate", "input"]]) {
    $(id).addEventListener(event, () => {
      const input = $(id);
      const value = key === "enabled" ? input.checked : key === "mode" ? input.value : +input.value;
      setArpSettings(getMidiTarget(), { [key]: value });
    });
  }
  document.addEventListener("instrument-target", syncTarget);
  $("voice-mode").addEventListener("change", () => setVoicing(getMidiTarget(), { mode: $("voice-mode").value }));
  $("voice-glide").addEventListener("input", () => setVoicing(getMidiTarget(), { glide: +$("voice-glide").value }));
  document.addEventListener("voicing-settings", syncTarget);
  document.addEventListener("arp-settings", syncTarget);
  document.addEventListener("midi-status", syncMidi);
  store.on("load", syncTarget);
  store.on("instrument", syncTarget);
  store.on('instruments',syncTarget);
  syncTarget(); syncMidi();
}
