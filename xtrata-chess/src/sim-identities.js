// Identities for simulation mode.
//
// Simulation is only useful as a preview if it looks like the real thing.
// Labels like "BOT-WHITE" told you nothing about how a live board reads, and in
// particular they never exercised the name column, so the one thing you could
// not check in simulation was the thing most visible in play: who moved.
//
// So simulated senders are genuine well-formed mainnet principals, derived
// deterministically from the seed, and some of them carry a name while others
// do not. That is exactly the mix a live board shows.

import { c32address, sha256 } from './clarity.js';

// Mainnet single-sig version byte, so these render as SP… addresses.
const MAINNET_P2PKH = 22;

// Deliberately a partial list: several senders are left anonymous so the board
// is checked in both states.
const NAMES = [
  'openboard.btc',
  'zugzwang.btc',
  'e4addict.btc',
  'knightmare.btc',
  'patzer.btc',
  'enpassant.btc'
];

function principal(label) {
  const digest = sha256(new TextEncoder().encode(`xtrata-chess/sim/${label}`));
  return c32address(MAINNET_P2PKH, digest.slice(0, 20));
}

export class SimIdentities {
  constructor(seed = 1, griefers = 6) {
    this.seed = seed;
    this.you = principal(`you/${seed}`);
    this.white = principal(`white/${seed}`);
    this.black = principal(`black/${seed}`);
    this.griefers = Array.from({ length: griefers }, (_, index) =>
      principal(`griefer/${seed}/${index}`)
    );

    this.names = new Map();

    // Roughly half named, chosen by position rather than at random so a seed
    // always produces the same board.
    const named = [this.you, this.white, ...this.griefers.filter((_, i) => i % 3 === 0)];
    named.forEach((address, index) => {
      if (index < NAMES.length) this.names.set(address, NAMES[index]);
    });
  }

  // Same shape as NameResolver, so displaySender does not care which it has.
  get(address) {
    return this.names.get(address);
  }

  known(address) {
    return this.names.has(address);
  }

  forSide(turn) {
    return turn === 'white' ? this.white : this.black;
  }

  griefer(roll) {
    return this.griefers[Math.floor(roll * this.griefers.length) % this.griefers.length];
  }
}
