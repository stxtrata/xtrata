import { Kit as runtime } from "./runtime.js";
import { lazyFaces } from "../lazy-faces.js";
export const Kit = lazyFaces(runtime, {
  "eq3": () => import("./eq3.js"),
  "tilt": () => import("./tilt.js"),
  "comp": () => import("./comp.js"),
  "opto": () => import("./opto.js"),
  "limiter": () => import("./limiter.js"),
  "clipper": () => import("./clipper.js"),
  "gate": () => import("./gate.js"),
  "transient": () => import("./transient.js"),
  "filter": () => import("./filter.js"),
  "formant": () => import("./formant.js"),
  "drive": () => import("./drive.js"),
  "tape": () => import("./tape.js"),
  "dist": () => import("./dist.js"),
  "crush": () => import("./crush.js"),
  "chorus": () => import("./chorus.js"),
  "flanger": () => import("./flanger.js"),
  "phaser": () => import("./phaser.js"),
  "trem": () => import("./trem.js"),
  "delaySend": () => import("./delay.js"),
  "reverbSend": () => import("./reverb.js")
});
