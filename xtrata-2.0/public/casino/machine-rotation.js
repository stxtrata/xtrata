/* ParallaX Casino · THE MACHINE ROTATION
 *
 * Which fruit machines stand on the floor of /casino. The room has room for FIVE designs (two cabinets of each, one on the
 * left wall and one on the right). The five that have always been there are built into index.html. Every other ParallaX
 * series machine (public/casino-machines/<id>/pack.json) can be swapped onto the floor by changing `floor` below. Nothing else
 * needs to change, and no machine has to be put back afterwards.
 *
 *   floor   up to five ids, in wall order from the back of the room to the entrance. An id is either one of the built-in five
 *           ('drop', 'twins', 'ds', 'bf', 'nv') or the folder name of a series machine ('ordinal-rush', 'hot-wallet' ...).
 *           Unknown ids are ignored. If a machine's pack cannot be loaded, the next built-in machine stands in, so a bad
 *           deploy never leaves an empty wall.
 *   ?layout= a link such as /casino/?layout=top14 previews a hand-placed layout (see `layouts` below), also in your own browser only.
 *   ?floor=  a link such as /casino/?floor=ordinal-rush,snow-crash,hot-wallet,drop,twins previews a floor in your own browser
 *           only. It changes nothing for anyone else.
 *
 * What a machine on the floor shares with the rest of the casino (all of it already works, whichever five are standing):
 *   - the casino's own LAYR balance, through window.ParallaxLAYRAccount, the same one the tables use;
 *   - the room service: other people seen at the cabinet, their spins replayed, the round log, levels and the win banner;
 *   - the ONE progressive jackpot: every paid spin on any machine adds to it and has the same chance to win it
 *     (functions/lib/casino-progress.ts). Which machines count is functions/lib/casino-machines.ts, which lists all of them.
 *
 * What stays separate: each machine's own centre-row jackpot meters live inside its unchanged engine (they are part of the
 * 94.38% return, so they are not touched here), and the holder funds are display only.
 */
window.PX_MACHINE_ROTATION = {
  version: 1,
  base: '../casino-machines/',

  // THE LAYOUT. null keeps the classic room (the floor below, two cabinets of each, one on each side wall). A name from `layouts` replaces it.
  layout: null,

  // THE FLOOR. This is the line to edit to rotate machines. These are the five that are on the floor today.
  floor: ['drop', 'twins', 'ds', 'bf', 'nv'],

  // LAYOUTS. A layout places every cabinet by hand: one machine per slot, any mix of designs, at most TWO cabinets of any design (the room
  // service knows two places for each machine). x and z are metres from the middle of the 26 x 22 m floor (x to the right, z towards the
  // entrance, which is at z = +11); `face` is the wall the screen faces: 'N' towards the back wall, 'S' towards the entrance, 'E' / 'W'.
  // Preview one with /casino/?layout=<name>. To make one the room's own, set `layout: '<name>'` above. `dispensers` moves the LAYR exchanges.
  layouts: {
    // TEST LAYOUT, top 14: 14 designs twice each. Side walls 8 + 8, back wall 3, one beside the door, and two pods of four (back to back)
    // either side of the grand approach. LAYR-01 moves to the entrance wall to make room for the right-hand pod.
    top14: {
      name: 'Top 14 (test)',
      dispensers: { 'LAYR-01': { hide: true }, 'LAYR-02': { x: 2.0, z: -10.0 } },   // the entrance exchange is taken out of this plan (it sat in the chess lounge)
      slots: [
      { id: 'twins', x: -12.33, z: -7.4, face: 'E' },
      { id: 'who-is-satoshi', x: -12.33, z: -5.55, face: 'E' },
      { id: 'dog-army', x: -12.33, z: -3.7, face: 'E' },
      { id: 'drop', x: -12.33, z: -1.1, face: 'E' },
      { id: 'rune-pit', x: -12.33, z: 0.75, face: 'E' },
      { id: 'club-x', x: -12.33, z: 2.6, face: 'E' },
      { id: 'the-stack', x: -12.33, z: 5.9, face: 'E' },
      { id: 'mempool-madness', x: -12.33, z: 7.75, face: 'E' },
      { id: 'rune-pit', x: 12.33, z: -7.4, face: 'W' },
      { id: 'mempool-madness', x: 12.33, z: -5.55, face: 'W' },
      { id: 'rare-pepe-directory', x: 12.33, z: -3.7, face: 'W' },
      { id: 'the-stack', x: 12.33, z: -1.1, face: 'W' },
      { id: 'twins', x: 12.33, z: 0.75, face: 'W' },
      { id: 'the-halving', x: 12.33, z: 2.6, face: 'W' },
      { id: 'who-is-satoshi', x: 12.33, z: 5.9, face: 'W' },
      { id: 'dog-army', x: 12.33, z: 7.75, face: 'W' },
      { id: 'the-halving', x: 0.35, z: -10.55, face: 'S' },
      { id: 'rare-pepe-directory', x: -3.45, z: -10.55, face: 'S' },
      { id: 'club-x', x: -1.55, z: -10.55, face: 'S' },
      { id: 'ordinal-rush', x: -5.1, z: 7.45, face: 'N' },
      { id: 'ordinal-rush', x: -3.3, z: 7.45, face: 'N' },
      { id: 'hot-wallet', x: -5.1, z: 8.35, face: 'S' },
      { id: 'hot-wallet', x: -3.3, z: 8.35, face: 'S' },
      { id: 'snow-crash', x: 3.3, z: 7.45, face: 'N' },
      { id: 'snow-crash', x: 5.1, z: 7.45, face: 'N' },
      { id: 'plebs-legends', x: 3.3, z: 8.35, face: 'S' },
      { id: 'plebs-legends', x: 5.1, z: 8.35, face: 'S' }
      ]
    }
  },

  // Every machine that can be put on the floor, with the name the win banner uses when someone else wins on it.
  catalog: [
    { id: 'drop', name: 'The Drop' }, { id: 'twins', name: 'Forever Twins' }, { id: 'ds', name: 'Deep Strata' },
    { id: 'bf', name: 'Block Fortune' }, { id: 'nv', name: 'Neon Vault' },
    { id: 'ordinal-rush', name: 'Ordinal Rush' }, { id: 'snow-crash', name: 'Snow Crash' }, { id: 'genesis-21', name: 'Genesis 21' },
    { id: 'the-archive', name: 'The Archive' }, { id: 'plebs-legends', name: 'Plebs & Legends' }, { id: 'robot-factory', name: 'Robot Factory' },
    { id: 'monkey-hash', name: 'Monkey Hash' }, { id: 'nine-lives', name: 'Nine Lives' }, { id: 'degen-city', name: 'Degen City' },
    { id: 'the-stack', name: 'The Stack' }, { id: 'who-is-satoshi', name: 'Who Is Satoshi?' }, { id: 'rare-pepe-directory', name: 'Rare Pepe Directory' },
    { id: 'rune-pit', name: 'Rune Pit' }, { id: 'xtrata-originals', name: 'Xtrata Originals' }, { id: 'the-halving', name: 'The Halving' },
    { id: 'mooneeb', name: 'Mooneeb' }, { id: 'club-x', name: 'Club X' }, { id: 'rugged', name: 'Rugged' }, { id: 'sat-hunter', name: 'Sat Hunter' },
    { id: 'mempool-madness', name: 'Mempool Madness' }, { id: 'corgi-kennel', name: 'Corgi Kennel' }, { id: 'launchpad', name: 'Launchpad' },
    { id: 'pool-party', name: 'Pool Party' }, { id: 'dog-army', name: 'DOG Army' }, { id: 'hot-wallet', name: 'Hot Wallet' }
  ]
};
