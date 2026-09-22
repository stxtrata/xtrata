// Shared with the local browser script. Keep paid-start eligibility explicit:
// unknown duration is never eligible, and exactly sixty seconds is eligible.
export function eligibleSongDuration(seconds) {
 return Number.isFinite(seconds)&&seconds>=60;
}
