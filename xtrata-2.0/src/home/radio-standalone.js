// Standalone Xtrata Radio bundle for side pages (wizard, forever twins,
// migrate, /g galleries…). Built to public/xtrata-radio.js by
// vite.radio.config.ts and included with <script src="/xtrata-radio.js" defer>.
// The homepage keeps its module import; the double-init guard in radio.js
// makes the two safe together, and localStorage continuity means a song
// started on one page resumes where it left off on the next.
import { initXtrataRadio } from './radio.js';
import { CURATED_GALLERIES } from './config.js';

initXtrataRadio({
  tokenIds: CURATED_GALLERIES.find((gallery) => gallery.id === 'jim-music')?.tokenIds ?? [],
  stationName: 'XTRATA FM'
});
