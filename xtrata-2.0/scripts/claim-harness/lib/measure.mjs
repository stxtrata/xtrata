// Turns the recorded events of one run into the numbers the ratchet tracks. Lower is better for all of them.
export function measure(events, { playable, claims }) {
  const taps = events.filter((e) => e.kind === 'tap');
  const panels = events.filter((e) => e.kind === 'panel');
  const create = events.filter((e) => e.kind === 'webauthn' && e.op === 'create').length;
  const get = events.filter((e) => e.kind === 'webauthn' && e.op === 'get').length;
  const reached = events.find((e) => e.kind === 'playable');
  const m = {
    taps: taps.length,
    prompts: create + get,          // times the device itself asked for a face, finger or PIN
    passkeys: create,               // passkeys made for this person, counted as they are made (must be 1)
    panels: new Set(panels.map((p) => p.title)).size,
    claims,
    jargon: new Set(events.filter((e) => e.kind === 'jargon').map((e) => e.word)).size, // crypto words a music listener had to read
    playable: !!playable,
    msToPlayable: reached ? reached.t : null
  };
  m.score = m.taps + m.prompts + m.jargon + 10 * Math.max(0, m.passkeys - 1) + (m.playable ? 0 : 50);
  return m;
}
export const LOWER_IS_BETTER = ['taps', 'prompts', 'passkeys', 'panels', 'jargon', 'score'];
