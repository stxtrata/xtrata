// Compatibility helper for older local/browser clients. The duration gate is
// temporarily disabled: every playable catalogue entry may request support.
// Keep this exported while older desktop and extension code is in circulation.
export function eligibleSongDuration(_seconds) {
 return true;
}
