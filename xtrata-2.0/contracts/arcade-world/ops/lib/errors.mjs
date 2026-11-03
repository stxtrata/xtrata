// Contract error codes in words, so a failed call says what went wrong.
export const WORLD_ERRORS = {
  200: 'not authorised (caller is not the admin / room owner / publisher)', 201: 'world contract is paused', 202: 'not found (room, look or scene)',
  203: 'invalid value', 204: 'already exists', 205: 'bad look (hidden, not approved, wrong kind, or door rules broken)', 206: 'inscription check failed',
  207: "the bay's timeline is full (48); run compact-bay", 208: 'no pending hand-over', 209: 'locked', 210: 'bad link (unknown or hidden room, or path not allowed)',
  211: 'no such bay in this room', 212: 'too many cover, sound or light layers (one of each per scene)',
};
export const POSTER_ERRORS = {
  100: 'not authorised (not admin or whitelisted publisher; community posters only; no evergreen)', 101: 'poster contract is paused', 102: 'not found',
  103: 'invalid value', 104: 'bad window (start must be after today, end after start, at most 3650 days)', 105: 'weight out of range (core 1-100, community 1-20)',
  106: 'inscription check failed', 107: "daily cap reached for this publisher", 108: 'live cap reached for this publisher', 109: 'too soon after your last write (min gap)',
  110: 'the live set is full', 111: 'no pending hand-over', 112: 'locked', 113: 'pin list full', 114: 'suppress list full',
};
export function explain(which, code) {
  const t = which === 'world' ? WORLD_ERRORS : POSTER_ERRORS;
  return `u${code}: ${t[code] || 'unknown error'}`;
}
// Errors where retrying the same call can never help; the bot stops on these.
export const POSTER_STOP = new Set([100, 101, 107, 108, 109, 110]);
