import { AppConfig, UserSession, showConnect } from "@stacks/connect";
import { CONFIG, contractConfigured } from "./config";
import {
  getRecordingHistory,
  getRecordingPolicy,
  loadAllMosaicPages,
  loadEngineBundle,
  loadRecording,
  registerRecording,
  type MosaicCell
} from "./contract-client";
import { EngineSandbox } from "./engine-sandbox";
import {
  MAX_GESTURE_POINTS,
  MAX_LOOP_MS,
  MIN_LOOP_MS,
  createRecording,
  downloadRecording,
  type GesturePoint,
  type LivingRecording
} from "./recording";
import "./styles.css";

const $ = <T extends Element>(selector: string) => document.querySelector<T>(selector)!;
const mosaic = $("#mosaic");
const panel = $("#instrument");
const pad = $<HTMLElement>("#pad");
const message = $("#message");
const recordingInput = $("#recording-id") as HTMLInputElement;
const recordButton = $("#record") as HTMLButtonElement;
const saveButton = $("#save") as HTMLButtonElement;
const registerButton = $("#register") as HTMLButtonElement;
const recordingFee = $("#recording-fee");
const recordingHistory = $("#recording-history");
const chainStatus = $("#chain-status");
const session = new UserSession({ appConfig: new AppConfig(["store_write"]) });
const engine = new EngineSandbox(pad);
const cells = new Map<number, MosaicCell>();
const recordingCache = new Map<number, LivingRecording>();

let selected: MosaicCell | null = null;
let points: GesturePoint[] = [];
let recording: LivingRecording | null = null;
let recordingStarted = 0;
let recordingActive = false;
let engineReadyForEdition: number | null = null;

const formatStx = (microStx: number) => `${(microStx / 1_000_000).toLocaleString(undefined, {
  minimumFractionDigits: 3,
  maximumFractionDigits: 6
})} STX`;

function connectedMainnetAddress() {
  if (!session.isUserSignedIn()) return null;
  const profile = session.loadUserData().profile as { stxAddress?: { mainnet?: string } };
  return profile.stxAddress?.mainnet ?? null;
}

function captureEngineGesture(point: Omit<GesturePoint, "at">) {
  if (!recordingActive) return;
  const elapsed = Math.round(performance.now() - recordingStarted);
  if (elapsed > MAX_LOOP_MS || points.length >= MAX_GESTURE_POINTS) {
    finishRecording("Recording stopped automatically at the safety limit.");
    return;
  }
  points.push({ at: elapsed, ...point });
}

function finishRecording(prefix = "") {
  engine.stopLoop();
  if (!recordingActive || selected?.nftId === null || selected?.nftId === undefined) return;
  recordingActive = false;
  const loopMs = Math.min(MAX_LOOP_MS, Math.max(MIN_LOOP_MS, Math.round(performance.now() - recordingStarted)));
  if (points.length === 0) {
    saveButton.disabled = true;
    message.textContent = prefix || "No gestures were captured.";
    return;
  }
  recording = createRecording(
    selected.nftId,
    selected.edition,
    loopMs,
    points,
    `${CONFIG.xtrata.address}.${CONFIG.xtrata.name}`
  );
  saveButton.disabled = false;
  message.textContent = `${prefix ? `${prefix} ` : ""}${points.length} gesture points captured in a ${(loopMs / 1000).toFixed(2)} second loop.`;
}

async function playInscription(recordingId: number, nftId: number, edition: number, isDefault: boolean) {
  let remote = recordingCache.get(recordingId);
  if (!remote) {
    remote = await loadRecording(recordingId, { nftId, edition });
    recordingCache.set(recordingId, remote);
  }
  if (selected?.edition !== edition || engineReadyForEdition !== edition) return;
  recording = remote;
  engine.playLoop(remote);
  $("#voice-label").textContent = `Living recording #${recordingId}${isDefault ? " · mosaic default" : ""}`;
  message.textContent = isDefault
    ? "Playing the newest validated child recording used by the mosaic."
    : `Playing earlier validated child recording #${recordingId}.`;
}

async function renderRecordingHistory(cell: MosaicCell) {
  recordingHistory.replaceChildren();
  if (cell.nftId === null || !contractConfigured()) return;
  const ids = await getRecordingHistory(cell.nftId);
  if (selected?.edition !== cell.edition) return;
  if (ids.length === 0) {
    recordingHistory.textContent = "No child recordings yet.";
    return;
  }
  const label = document.createElement("p");
  label.className = "history-label";
  label.textContent = `All child recordings (${ids.length})`;
  const list = document.createElement("div");
  list.className = "history-list";
  ids.forEach((id, index) => {
    const button = document.createElement("button");
    const isDefault = index === 0 && id === cell.activeRecording;
    button.className = `history-button${isDefault ? " default" : ""}`;
    button.textContent = `#${id}${isDefault ? " · latest / default" : ""}`;
    button.addEventListener("click", async () => {
      try {
        await playInscription(id, cell.nftId!, cell.edition, isDefault);
      } catch (error) {
        message.textContent = error instanceof Error ? error.message : "Could not load this recording.";
      }
    });
    list.append(button);
  });
  recordingHistory.append(label, list);
}

function seedCell(edition: number): MosaicCell {
  return { edition, nftId: null, recordingCount: 0, activeRecording: null, revision: 0 };
}

function renderInitialMosaic() {
  const fragment = document.createDocumentFragment();
  for (let edition = 1; edition <= CONFIG.collectionSize; edition += 1) {
    const button = document.createElement("button");
    button.className = "cell";
    button.dataset.edition = String(edition);
    button.style.setProperty("--hue", String((edition * 137.508) % 360));
    button.title = `Edition ${edition}`;
    button.setAttribute("aria-label", `Edition ${edition}`);
    button.addEventListener("click", () => openCell(cells.get(edition) ?? seedCell(edition)));
    fragment.append(button);
  }
  mosaic.append(fragment);
}

function paintCell(cell: MosaicCell) {
  cells.set(cell.edition, cell);
  const element = $<HTMLButtonElement>(`.cell[data-edition="${cell.edition}"]`);
  element.classList.toggle("registered", cell.nftId !== null);
  element.classList.toggle("recorded", cell.activeRecording !== null);
  element.title = `Edition ${cell.edition}${cell.nftId !== null ? ` · NFT ${cell.nftId}` : " · unregistered"}${cell.activeRecording !== null ? ` · recording ${cell.activeRecording}` : ""}`;
}

async function openCell(cell: MosaicCell) {
  selected = cell;
  engineReadyForEdition = null;
  recordingActive = false;
  engine.stopLoop();
  document.querySelectorAll(".cell.active").forEach(item => item.classList.remove("active"));
  $<HTMLButtonElement>(`.cell[data-edition="${cell.edition}"]`).classList.add("active");
  $("#edition-label").textContent = `Edition ${cell.edition}${cell.nftId !== null ? ` / Xtrata #${cell.nftId}` : " / not registered"}`;
  $("#voice-label").textContent = cell.activeRecording !== null ? `Living recording #${cell.activeRecording}` : "Original seeded voice";
  panel.classList.add("open");
  recordButton.disabled = true;
  registerButton.disabled = cell.nftId === null || !contractConfigured();
  recordingHistory.replaceChildren();
  message.textContent = "";
  if (cell.nftId === null) {
    pad.replaceChildren(Object.assign(document.createElement("p"), {
      className: "engine-placeholder",
      textContent: "This edition will become playable when its Xtrata NFT is registered."
    }));
    return;
  }
  if (!contractConfigured()) {
    recordingFee.textContent = "Child registration fee unavailable until contracts are configured.";
    return;
  }
  try {
    message.textContent = "Verifying the on-chain engine and seeded NFT inscription…";
    const [policy, bundle] = await Promise.all([
      getRecordingPolicy(),
      loadEngineBundle(cell.nftId, cell.edition)
    ]);
    if (selected?.edition !== cell.edition) return;
    engine.mount(
      bundle.edition.text,
      bundle.engine.text,
      { edition: cell.edition, engineId: bundle.state.engineId! },
      captureEngineGesture
    );
    engineReadyForEdition = cell.edition;
    recordButton.disabled = false;
    recordingFee.textContent = `Child registration fee: ${formatStx(policy.microStx)} → ${policy.recipient}`;
    await renderRecordingHistory(cell);
    if (selected?.edition !== cell.edition) return;
    if (cell.activeRecording !== null) await playInscription(cell.activeRecording, cell.nftId, cell.edition, true);
    else message.textContent = "Playing the verified seeded engine. Touch or drag the pad to perform.";
  } catch (error) {
    pad.replaceChildren(Object.assign(document.createElement("p"), {
      className: "engine-placeholder",
      textContent: "The verified engine could not be loaded."
    }));
    message.textContent = error instanceof Error ? error.message : "Could not load the on-chain engine.";
  }
}

recordButton.addEventListener("click", () => {
  if (selected?.nftId === null || selected?.nftId === undefined || engineReadyForEdition !== selected.edition) {
    message.textContent = "A verified registered edition must be loaded before recording.";
    return;
  }
  points = [];
  recording = null;
  recordingStarted = performance.now();
  recordingActive = true;
  saveButton.disabled = true;
  message.textContent = `Recording gestures… maximum ${MAX_GESTURE_POINTS} points / ${MAX_LOOP_MS / 1000} seconds.`;
});

$("#stop").addEventListener("click", () => finishRecording());

$("#play").addEventListener("click", () => {
  if (recording) engine.playLoop(recording);
  else message.textContent = "Record a loop or select an NFT with a validated recording first.";
});

saveButton.addEventListener("click", () => recording && downloadRecording(recording));
$("#close").addEventListener("click", () => {
  panel.classList.remove("open");
  recordingActive = false;
  engine.stopLoop();
});

registerButton.addEventListener("click", async () => {
  const cell = selected;
  const id = Number(recordingInput.value);
  if (!cell || cell.nftId === null || !Number.isSafeInteger(id) || id < 0) {
    message.textContent = "Enter a valid Xtrata recording inscription ID.";
    return;
  }
  const sender = connectedMainnetAddress();
  if (!sender) {
    message.textContent = "Connect the NFT owner wallet before registering a child.";
    return;
  }
  try {
    message.textContent = "Downloading and validating the complete recording inscription before opening the wallet…";
    const [, policy] = await Promise.all([
      loadRecording(id, { nftId: cell.nftId, edition: cell.edition }),
      getRecordingPolicy()
    ]);
    if (selected?.edition !== cell.edition) throw new Error("The selected edition changed during validation.");
    message.textContent = `Opening wallet with an exact ${formatStx(policy.microStx)} STX spend condition.`;
    await registerRecording(cell.nftId, id, policy.microStx, sender, policy.recipient);
    message.textContent = "Transaction submitted. Once confirmed, this newest child becomes the mosaic default; every earlier child remains playable here.";
  } catch (error) {
    message.textContent = error instanceof Error ? error.message : "Registration was cancelled.";
  }
});

$("#connect").addEventListener("click", () => showConnect({
  appDetails: { name: "Proof of Free Living Synth", icon: `${location.origin}/icon.svg` },
  userSession: session,
  onFinish: () => { $("#connect").textContent = "Wallet connected"; }
}));

if (connectedMainnetAddress()) $("#connect").textContent = "Wallet connected";
renderInitialMosaic();
if (contractConfigured()) {
  chainStatus.textContent = "Loading contract mosaic…";
  loadAllMosaicPages(page => page.forEach(paintCell))
    .then(() => { chainStatus.textContent = "Contract mosaic live"; })
    .catch(error => { chainStatus.textContent = error instanceof Error ? error.message : "Contract unavailable"; });
} else {
  chainStatus.textContent = "Deploy, then set registry + gateway addresses in src/config.ts";
}
