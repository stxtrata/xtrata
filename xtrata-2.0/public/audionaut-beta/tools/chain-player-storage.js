// Frozen with the standalone player so existing chain references retain their digest.
export const STORAGE_KEYS = Object.freeze({
  legacyProject: "audionaut.beta-pro.v0.2.project",
  settings: "audionaut.beta-pro.v0.2.settings",
  favourites: "audionaut.beta-pro.v0.2.favourites",
  clipLibrary: "audionaut.beta-pro.v0.2.clip-library",
  midi: "audionaut.beta-pro.midi",
  dock: "audionaut.beta-pro.dock",
  view: "audionaut.beta-pro.view",
});
export const ccStorageKey = (synthId) => `audionaut.beta-pro.cc.${synthId}`;
export const PROJECT_DATABASE = "audionaut-beta-pro-projects-v1";
export const HANDOFF_SOURCE = "audionaut-beta-pro";
