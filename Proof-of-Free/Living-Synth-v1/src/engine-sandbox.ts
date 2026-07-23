import type { GesturePoint, LivingRecording } from "./recording";

const PROTOCOL = "proof-of-free/engine-bridge-v1";

const bridgeSource = `
(() => {
  "use strict";
  const protocol = ${JSON.stringify(PROTOCOL)};
  const pad = document.getElementById("kaoss-pad");
  if (!pad) throw new Error("Inscribed engine did not create #kaoss-pad");
  const point = (event, gate) => {
    const box = pad.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
    const y = Math.max(0, Math.min(1, (event.clientY - box.top) / box.height));
    parent.postMessage({ protocol, type: "gesture", point: {
      x, y, pressure: event.pressure || 0.65, gate
    } }, "*");
  };
  let down = false;
  pad.addEventListener("pointerdown", event => { down = true; point(event, "on"); });
  pad.addEventListener("pointermove", event => { if (down) point(event, "move"); });
  pad.addEventListener("pointerup", event => { if (down) point(event, "off"); down = false; });
  pad.addEventListener("pointercancel", event => { if (down) point(event, "off"); down = false; });
  addEventListener("message", event => {
    const message = event.data;
    if (!message || message.protocol !== protocol || message.type !== "play-point") return;
    const incoming = message.point;
    if (!incoming || typeof globalThis.__proofOfFreePlay !== "function") return;
    globalThis.__proofOfFreePlay(incoming);
  });
  parent.postMessage({ protocol, type: "ready" }, "*");
})();
`;

function escapeInlineScript(source: string) {
  return source.replace(/<\/script/gi, "<\\/script");
}

function instrumentEngine(source: string) {
  const marker = "function point(event,drag){";
  if (!source.includes(marker)) throw new Error("The engine inscription does not expose the expected Kaoss runtime.");
  return source.replace(
    marker,
    `globalThis.__proofOfFreePlay=point=>{const x=Math.max(0,Math.min(1,Number(point.x))),y=Math.max(0,Math.min(1,Number(point.y)));if(point.gate!=="off")play(x,y,point.gate==="move");};${marker}`
  );
}

export function sandboxDocument(editionHtml: string, engineSource: string) {
  const csp = `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; media-src 'none'; frame-src 'none'; base-uri 'none'; form-action 'none'">`;
  const instrumented = escapeInlineScript(instrumentEngine(engineSource));
  const bridge = escapeInlineScript(bridgeSource);
  const engineTag = `<script>${instrumented}</script><script>${bridge}</script>`;
  const withCsp = editionHtml.replace(/<head>/i, `<head>${csp}`);
  const replaced = withCsp.replace(
    /<script\s+src=["'][^"']*engine\.js["']\s*><\/script>/i,
    engineTag
  );
  if (replaced === withCsp) throw new Error("Edition inscription does not reference the shared engine.");
  return replaced;
}

export class EngineSandbox {
  private frame: HTMLIFrameElement | null = null;
  private loopTimers: number[] = [];
  private ready = false;
  private onGesture: (point: Omit<GesturePoint, "at">) => void = () => undefined;

  constructor(private readonly host: HTMLElement) {
    window.addEventListener("message", this.handleMessage);
  }

  mount(
    editionHtml: string,
    engineSource: string,
    onGesture: (point: Omit<GesturePoint, "at">) => void
  ) {
    this.stopLoop();
    this.onGesture = onGesture;
    this.ready = false;
    this.frame?.remove();
    const frame = document.createElement("iframe");
    frame.className = "engine-frame";
    frame.title = "Inscribed Proof of Free Kaoss engine";
    frame.sandbox.add("allow-scripts");
    frame.referrerPolicy = "no-referrer";
    frame.srcdoc = sandboxDocument(editionHtml, engineSource);
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
  }

  destroy() {
    this.stopLoop();
    window.removeEventListener("message", this.handleMessage);
    this.frame?.remove();
    this.frame = null;
  }

  private playPoint(point: GesturePoint) {
    if (!this.ready || !this.frame?.contentWindow) return;
    this.frame.contentWindow.postMessage({ protocol: PROTOCOL, type: "play-point", point }, "*");
  }

  private readonly handleMessage = (event: MessageEvent) => {
    if (!this.frame || event.source !== this.frame.contentWindow) return;
    const message = event.data;
    if (!message || message.protocol !== PROTOCOL) return;
    if (message.type === "ready") {
      this.ready = true;
      return;
    }
    if (message.type !== "gesture") return;
    const point = message.point as Partial<Omit<GesturePoint, "at">> | undefined;
    if (!point || !["on", "move", "off"].includes(String(point.gate))) return;
    if (![point.x, point.y, point.pressure].every(value => Number.isFinite(value) && Number(value) >= 0 && Number(value) <= 1)) return;
    this.onGesture({
      x: Number(point.x),
      y: Number(point.y),
      pressure: Number(point.pressure),
      gate: point.gate as GesturePoint["gate"]
    });
  };
}
