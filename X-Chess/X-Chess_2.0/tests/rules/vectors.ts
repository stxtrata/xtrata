// The rule sets the golden vectors are built from.
//
// Shared between the generator and the test so that neither can drift from the
// other. Adding a vector here and regenerating is fine; CHANGING one is not —
// an existing vector's bytes are a permanent protocol artefact.

import type { Rules } from '../../packages/protocol/rules.js';
import { DEFAULT_RULES } from '../../packages/protocol/rules.js';

const ALICE = 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7';
const BOB = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const CAROL = 'SP15T1W26JTNS26VG17HM468KW7TQD3124KTYA9EJ';

export interface Vector {
  name: string;
  rules: Rules;
}

export const VECTORS: Vector[] = [
  {
    name: 'open board — the defaults, committing to nothing',
    rules: { ...DEFAULT_RULES }
  },
  {
    name: 'two named players, ranked',
    rules: { ...DEFAULT_RULES, white: ALICE, black: BOB, ranked: true }
  },
  {
    name: 'two named players, unranked',
    rules: { ...DEFAULT_RULES, white: ALICE, black: BOB }
  },
  {
    name: 'one against the world — anyone-else',
    rules: { ...DEFAULT_RULES, white: ALICE, black: 'anyone-else' }
  },
  {
    name: 'allow list of three, given out of order',
    rules: { ...DEFAULT_RULES, allow: [CAROL, ALICE, BOB] }
  },
  {
    name: 'allow list of three, given in order',
    rules: { ...DEFAULT_RULES, allow: [ALICE, BOB, CAROL] }
  },
  {
    name: 'cooldown of three moves',
    rules: { ...DEFAULT_RULES, cooldown: 3 }
  },
  {
    name: 'no consecutive moves',
    rules: { ...DEFAULT_RULES, noConsecutive: true }
  },
  {
    name: 'a set-up starting position',
    rules: {
      ...DEFAULT_RULES,
      white: ALICE,
      black: BOB,
      startFen: '4k3/8/8/8/8/8/4P3/4K3 w - - 0 1'
    }
  },
  {
    name: 'everything at once',
    rules: {
      ...DEFAULT_RULES,
      white: ALICE,
      black: 'anyone-else',
      allow: [ALICE, BOB, CAROL],
      cooldown: 2,
      noConsecutive: true,
      ranked: false,
      startFen: '8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1'
    }
  }
];
