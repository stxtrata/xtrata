import "./mint-preview.css";
import { COLLECTION_SIZE, deriveTraits } from "./traits";

const $ = <T extends Element>(selector: string) => {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing element: ${selector}`);
  return element;
};

const mosaic = $<HTMLDivElement>("#mint-mosaic");
const player = $<HTMLIFrameElement>("#mint-player");
const picker = $<HTMLInputElement>("#edition-picker");
let selectedEdition = 1;

function serial(edition: number) {
  return String(edition).padStart(4, "0");
}

function showEdition(edition: number) {
  const nextEdition = Math.max(1, Math.min(COLLECTION_SIZE, Math.trunc(edition)));
  const traits = deriveTraits(nextEdition);

  mosaic.querySelector(".mint-cell.selected")?.classList.remove("selected");
  mosaic.querySelector<HTMLButtonElement>(`[data-edition="${nextEdition}"]`)?.classList.add("selected");
  selectedEdition = nextEdition;
  picker.value = String(nextEdition);
  $("#mint-number").textContent = `Simulated mint #${serial(nextEdition)}`;
  $("#trait-title").textContent = `${traits.palette} / ${traits.rootNote} / ${traits.waveform}`;
  $("#trait-list").innerHTML = [
    ["Profile", serial(traits.profile)],
    ["Palette", traits.palette],
    ["Unique hue", `${traits.hue}°`],
    ["Root note", traits.rootNote],
    ["Waveform", traits.waveform]
  ].map(([label, value]) => `<div><dt>${label}</dt><dd>${value}</dd></div>`).join("");
  player.title = `Playable simulated Proof of Free synth, edition ${nextEdition}`;
  player.src = `/simulated-mints/${serial(nextEdition)}.html`;
}

for (let edition = 1; edition <= COLLECTION_SIZE; edition += 1) {
  const traits = deriveTraits(edition);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "mint-cell";
  button.dataset.edition = String(edition);
  button.style.setProperty("--cell-hue", String(traits.hue));
  button.title = `Edition ${serial(edition)} · ${traits.palette} · ${traits.rootNote} · ${traits.waveform}`;
  button.setAttribute("aria-label", button.title);
  button.addEventListener("click", () => showEdition(edition));
  mosaic.append(button);
}

picker.addEventListener("input", () => {
  const edition = Number(picker.value);
  if (Number.isInteger(edition) && edition >= 1 && edition <= COLLECTION_SIZE) showEdition(edition);
});
$("#previous").addEventListener("click", () => showEdition(selectedEdition - 1));
$("#next").addEventListener("click", () => showEdition(selectedEdition + 1));
showEdition(1);
