import { Kit as runtime } from "./runtime.js";
import { lazyFaces } from "../lazy-faces.js";
export const Kit = lazyFaces(runtime, {
  "fm4": () => import("./fm4.js"),
  "vox": () => import("./vox.js"),
  "pluck": () => import("./pluck.js"),
  "jibass": () => import("./jibass.js"),
  "ensemble": () => import("./ensemble.js"),
  "tine": () => import("./tine.js"),
  "kit": () => import("./kit.js"),
  "tonewheel": () => import("./tonewheel.js"),
  "morph": () => import("./morph.js"),
  "texture": () => import("./texture.js"),
  "winds": () => import("./winds.js"),
  "modal": () => import("./modal.js"),
  "lantern": () => import("./lantern.js"),
  "prism": () => import("./prism.js")
});
