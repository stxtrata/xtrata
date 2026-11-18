// The beta runs on the same origin as production, but never reads, migrates or
// deletes production DAW state. Moving a project between editions is an explicit
// portable-file export/import. Wallet access and Create/Wizard handoffs remain shared.
export const STORAGE_KEYS = Object.freeze({
  legacyProject: "audionaut.beta.v0.2.project",
  settings: "audionaut.beta.v0.2.settings",
  favourites: "audionaut.beta.v0.2.favourites",
  clipLibrary: "audionaut.beta.v0.2.clip-library",
  midi: "audionaut.beta.midi",
  dock: "audionaut.beta.dock",
  view: "audionaut.beta.view",
});
export const ccStorageKey = (synthId) => `audionaut.beta.cc.${synthId}`;
export const PROJECT_DATABASE = "audionaut-beta-projects-v1";
export const HANDOFF_SOURCE = "audionaut-beta";
