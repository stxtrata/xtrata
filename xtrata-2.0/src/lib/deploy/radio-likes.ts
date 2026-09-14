export const RADIO_LIKES_NAME = 'xtrata-radio-likes-v1-0';
export const RADIO_LIKES_SOURCE = 'contracts/live/xtrata-radio-likes-v1.0.clar';
export const RADIO_LIKES_SHA256 = '7e7fca966af587f48b2923adc081710b36b80c4bf4fef351b9499d9584d378db';
export function inspectRadioLikesSource(code:string,sha256:string):string[] {
 return sha256===RADIO_LIKES_SHA256 && new TextEncoder().encode(code).length===2543 ? [] : ['Radio likes source differs from the tested release. Do not deploy edited bytes.'];
}
