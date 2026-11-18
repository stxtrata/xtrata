import { store } from "./state.js";
import { engine } from "./engine.js";
import { exportProject, autosave } from "./persistence.js";
import { downloadBlob } from "./audio-utils.js";
import { renderMix } from "./render-mix.js";
import { classifyCreateFiles, storeCreateHandoff, takeCreateHandoff, createHandoffUrl } from "../../../create-routing.js";

const $ = selector => document.querySelector(selector);
const filename = name => (String(name || "Audionaut project").replace(/[^\w\- ]+/g, "").trim() || "Audionaut project");

export async function prepareInscription(file) {
  const decision = classifyCreateFiles([file]);
  const id = await storeCreateHandoff([file], { reason: decision.reason, source: "audionaut" });
  return createHandoffUrl(decision.destination === "wizard" ? "/wizard/" : "/inscribe", id, "audionaut");
}

export function initPublish({ samplesReady = async () => {} } = {}) {
  const modal = $("#modal-publish");
  let prepared = null, controller = null;
  const status = message => { $("#publish-status").textContent = message; };
  const clear = () => {
    controller?.abort(); controller = null; prepared = null;
    $("#publish-download").disabled = true;
    $("#publish-continue").disabled = true;
    status("Prepare a file, download it if you wish, then continue to review inscription costs.");
  };
  $("#btn-publish").addEventListener("click", () => { clear(); modal.classList.remove("hidden"); });
  $("#publish-close").addEventListener("click", () => { clear(); modal.classList.add("hidden"); });
  for (const id of ["publish-format", "publish-scope", "publish-tail"])
    $("#" + id).addEventListener("change", clear);
  // A prepared file is a snapshot. Edits require preparation again, so an old mix
  // cannot be mistaken for the project currently visible in the workstation.
  store.on("dirty", () => { if (prepared) clear(); });
  store.on("load", clear);
  $("#publish-prepare").addEventListener("click", async () => {
    clear();
    const mine = controller = new AbortController();
    const button = $("#publish-prepare"); button.disabled = true;
    try {
      await samplesReady();
      const project = structuredClone(store.project);
      const kind = $("#publish-format").value;
      const revision = store.project;
      let changed = false;
      const unsubscribe = store.on("dirty", () => { changed = true; });
      let blob;
      try {
        status(kind === "audio" ? "Rendering the mix with its synths and effects…" : "Preparing the portable project…");
        blob = kind === "audio"
          ? await renderMix(project, engine.buffers.slice(), {
            scope: $("#publish-scope").value, tail: +$("#publish-tail").value, signal: mine.signal,
          })
          : new Blob([exportProject({ project, compact: true })], { type: "application/json" });
      } finally { unsubscribe(); }
      if (mine.signal.aborted || controller !== mine) return;
      if (changed || store.project !== revision) throw new Error("The project changed during preparation. Prepare it again to include the latest edits.");
      prepared = new File([blob], `${filename(project.projectName)}.${kind === "audio" ? "wav" : "json"}`, { type: blob.type });
      status(`${prepared.name} · ${(prepared.size / 1024 / 1024).toFixed(2)} MB. ${kind === "audio" ? "Stereo WAV mix, including the selected effect tail." : "Editable project with embedded local audio; remote audio keeps its source references."} Continue opens the inscription review; you choose whether to publish there.`);
      $("#publish-download").disabled = false;
      $("#publish-continue").disabled = false;
    } catch (error) {
      if (error.name !== "AbortError") status(`Preparation failed: ${error.message}`);
    } finally { button.disabled = false; }
  });
  $("#publish-download").addEventListener("click", () => prepared && downloadBlob(prepared, prepared.name));
  $("#publish-continue").addEventListener("click", async () => {
    if (!prepared) return;
    const button = $("#publish-continue"); button.disabled = true;
    const file = prepared, preparation = controller;
    let handoffId = null;
    const unchanged = () => prepared === file && controller === preparation && !preparation?.signal.aborted;
    try {
      await autosave({ force: true });
      if (!unchanged()) throw new Error("The prepared file changed while saving. Prepare the current project again.");
      const url = await prepareInscription(file);
      handoffId = new URL(url, location.origin).searchParams.get("handoffId");
      if (!unchanged()) throw new Error("The project changed before the inscription review opened. Prepare it again.");
      // Same-origin handoff reuses the established Create/Wizard review and wallet flow.
      window.location.assign(url);
    } catch (error) {
      // A canceled navigation must not leave a potentially large WAV orphaned in handoff storage.
      if (handoffId) await takeCreateHandoff(handoffId).catch(() => {});
      status(`Could not continue: ${error.message}. Download the file and keep this project open.`);
      button.disabled = !prepared;
    }
  });
}
