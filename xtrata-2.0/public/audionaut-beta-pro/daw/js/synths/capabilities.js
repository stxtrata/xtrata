export function synthOversampling(id, params = {}) {
  return id === 'morph' || id === 'jibass' && params.drive > 0 || id === 'tonewheel' && params.drive > .01 || id === 'kit' && (params.drive > .01 || params.kit === 'lofi') ? 2 : 1;
}
export function synthVoiceCapabilities(id, synth, params = {}) {
  const rendered = ['fm4','kiln','anneal','palinode'].includes(id) || id === 'texture' && params.model === 'cloud';
  return { protocolVersion: 2, heldMode: synth.live?.oneShot ? 'one-shot' : rendered ? 'crossfaded sustain region' : synth.live?.naturalDecay ? 'natural decay with release' : 'native open gate', parameterMode: 'bound AudioParams or 20 ms graph crossfade', oversampling: synthOversampling(id,params) };
}
