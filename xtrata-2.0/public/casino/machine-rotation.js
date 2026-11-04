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

  // THE FLOOR. This is the line to edit to rotate machines. These are the five that are on the floor today.
  floor: ['drop', 'twins', 'ds', 'bf', 'nv'],

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
