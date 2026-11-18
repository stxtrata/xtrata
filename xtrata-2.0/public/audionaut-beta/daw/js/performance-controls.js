import { store, NUM_INSTRUMENTS } from "./state.js";
import { getMidiTarget, setMidiTarget, midiStatus, setMidiEnabled } from "./midi-input.js";
import { getArpSettings, setArpSettings, panic } from "./live-keys.js";

export function initPerformanceControls() {
  const $ = id => document.getElementById(id);
  const target = $("live-instrument");
  const syncTarget = () => {
    const selected = getMidiTarget();
    target.replaceChildren(...Array.from({ length: NUM_INSTRUMENTS }, (_, i) =>
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
  document.addEventListener("arp-settings", syncTarget);
  document.addEventListener("midi-status", syncMidi);
  store.on("load", syncTarget);
  store.on("instrument", syncTarget);
  syncTarget(); syncMidi();
}
