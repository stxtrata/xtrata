import type { GesturePoint, LivingRecording } from "./recording";
import { canonicalEngineSource, validateSeedHtml } from "./seed";

const BRIDGE_PROTOCOL = "proof-of-free/engine-bridge-v2";
const ENGINE_PROTOCOL = "proof-of-free/engine-api-v2";

type EngineIdentity = { edition: number; engineId: number };

function bridgeSource(identity: EngineIdentity) {
  return `
(() => {
  "use strict";
  const bridgeProtocol = ${JSON.stringify(BRIDGE_PROTOCOL)};
  const engineProtocol = ${JSON.stringify(ENGINE_PROTOCOL)};
  const expected = ${JSON.stringify(identity)};
  const runtime = globalThis.ProofOfFree;
  const pad = document.getElementById("kaoss-pad");
  if (!runtime || runtime.protocol !== engineProtocol || runtime.edition !== expected.edition ||
      runtime.engineId !== expected.engineId || typeof runtime.gesture !== "function" ||
      typeof runtime.stop !== "function" || !pad) {
    throw new Error("Inscribed engine does not expose the Proof of Free v2 runtime.");
  }
  const point = (event, gate) => {
    const box = pad.getBoundingClientRect();
    parent.postMessage({ protocol: bridgeProtocol, type: "gesture", point: {
      x: Math.max(0, Math.min(1, (event.clientX - box.left) / box.width)),
      y: Math.max(0, Math.min(1, (event.clientY - box.top) / box.height)),
      pressure: Math.max(0, Math.min(1, event.pressure || 0.65)),
      gate
    } }, "*");
  };
  let down = false;
  pad.addEventListener("pointerdown", event => { down = true; point(event, "on"); });
  pad.addEventListener("pointermove", event => { if (down) point(event, "move"); });
  pad.addEventListener("pointerup", event => { if (down) point(event, "off"); down = false; });
  pad.addEventListener("pointercancel", event => { if (down) point(event, "off"); down = false; });
  addEventListener("message", event => {
    const message = event.data;
    if (!message || message.protocol !== bridgeProtocol) return;
    if (message.type === "play-point") void runtime.gesture(message.point);
    if (message.type === "stop") runtime.stop();
  });
  parent.postMessage({ protocol: bridgeProtocol, type: "ready", identity: expected }, "*");
})();
`;
}

function escapeInlineScript(source: string) {
  return source.replace(/<\/script/gi, "<\\/script");
}

export function sandboxDocument(
  editionHtml: string,
  engineSource: string,
  identity: EngineIdentity
) {
  validateSeedHtml(editionHtml, identity);
  if (!/<head>/i.test(editionHtml)) throw new Error("Seed inscription is missing its head element.");
  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; media-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'">`;
  const engineTag = `<script>${escapeInlineScript(engineSource)}</script><script>${escapeInlineScript(bridgeSource(identity))}</script>`;
  const withCsp = editionHtml.replace(/<head>/i, `<head>${csp}`);
  const expectedTag = `<script src="${canonicalEngineSource(identity.engineId)}"></script>`;
  if (!withCsp.includes(expectedTag)) throw new Error("Seed inscription does not reference the locked engine.");
  return withCsp.replace(expectedTag, engineTag);
}

export class EngineSandbox {
  private frame: HTMLIFrameElement | null = null;
  private loopTimers: number[] = [];
  private ready = false;
  private identity: EngineIdentity | null = null;
  private onGesture: (point: Omit<GesturePoint, "at">) => void = () => undefined;

  constructor(private readonly host: HTMLElement) {
    window.addEventListener("message", this.handleMessage);
  }

  mount(
    editionHtml: string,
    engineSource: string,
    identity: EngineIdentity,
    onGesture: (point: Omit<GesturePoint, "at">) => void
  ) {
    this.stopLoop();
    this.onGesture = onGesture;
    this.ready = false;
    this.identity = identity;
    this.frame?.remove();
    const frame = document.createElement("iframe");
    frame.className = "engine-frame";
    frame.title = `Inscribed Proof of Free engine, edition ${identity.edition}`;
    frame.sandbox.add("allow-scripts");
    frame.referrerPolicy = "no-referrer";
    frame.srcdoc = sandboxDocument(editionHtml, engineSource, identity);
    this.host.replaceChildren(frame);
    this.frame = frame;
  }

  playLoop(recording: LivingRecording) {
    this.stopLoop();
    const schedule = () => {
      recording.gestures.forEach(point => {
        this.loopTimers.push(window.setTimeout(() => this.playPoint(point), point.at));
      });
      this.loopTimers.push(window.setTimeout(schedule, recording.engine.loopMs));
    };
    schedule();
  }

  stopLoop() {
    this.loopTimers.forEach(window.clearTimeout);
    this.loopTimers = [];
    if (this.ready && this.frame?.contentWindow) {
      this.frame.contentWindow.postMessage({ protocol: BRIDGE_PROTOCOL, type: "stop" }, "*");
    }
  }

  destroy() {
    this.stopLoop();
    window.removeEventListener("message", this.handleMessage);
    this.frame?.remove();
    this.frame = null;
  }

  private playPoint(point: GesturePoint) {
    if (!this.ready || !this.frame?.contentWindow) return;
    this.frame.contentWindow.postMessage({
      protocol: BRIDGE_PROTOCOL,
      type: "play-point",
      point
    }, "*");
  }

  private readonly handleMessage = (event: MessageEvent) => {
    if (!this.frame || event.source !== this.frame.contentWindow) return;
    const message = event.data;
    if (!message || message.protocol !== BRIDGE_PROTOCOL) return;
    if (message.type === "ready") {
      if (
        message.identity?.edition === this.identity?.edition &&
        message.identity?.engineId === this.identity?.engineId
      ) this.ready = true;
      return;
    }
    if (message.type !== "gesture") return;
    const point = message.point as Partial<Omit<GesturePoint, "at">> | undefined;
    if (!point || !["on", "move", "off"].includes(String(point.gate))) return;
    if (![point.x, point.y, point.pressure].every(value =>
      Number.isFinite(value) && Number(value) >= 0 && Number(value) <= 1
    )) return;
    this.onGesture({
      x: Number(point.x),
      y: Number(point.y),
      pressure: Number(point.pressure),
      gate: point.gate as GesturePoint["gate"]
    });
  };
}
