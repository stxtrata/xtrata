/* ParallaX Casino · Fruit Machine Room · THE MACHINE LIST
 *
 * This is the only file you edit to put a new machine in the room.
 *
 *   1. Build the machine as usual so that  public/casino-machines/<id>/pack.json  exists
 *      (the same pack the casino takes: name, description, color, accent, model, game, css).
 *   2. Add ONE line to `machines` below:   { id: '<id>', no: <series number> },
 *   3. Reload the room. The hall grows by one bay for every two machines, the cabinet gets a
 *      name plaque, a floor glow, a place in the Machines list (G) and a cabinet streamed in
 *      when you walk up to it. Nothing else needs to change.
 *
 * Fields (only `id` is required):
 *   id       folder name under `base`, and the machine's game id.
 *   no       series number, shown on the plaque and in the list (default: its position).
 *   name     display name until the pack has loaded (default: the id in Title Case).
 *            The pack's own name replaces it once the cabinet streams in.
 *   accent   '#rrggbb' used by the proxy cabinet and floor glow before the pack has loaded.
 *   folder   full folder if the pack is not under `base` (default: base + id).
 *   labAction  name of the game's own control that opens its bonus preview / test panel,
 *            for a game that has none of the standard ones (the room already knows the usual
 *            five: lab, #labBtn, openTest, #testBtn, preview).
 *   inject   a line of JavaScript run at the very top of the game frame (a test flag).
 *   hidden   true keeps a machine in the file but out of the room.
 *
 * ORDER = LAYOUT. Machines are placed in the order listed, two per bay (left wall, right wall),
 * starting at the entrance and walking towards the back wall.
 */
window.FM_ROOM = {
  title: 'Fruit Machine Room',
  base: '../casino-machines/',

  machines: [
    { id: 'ordinal-rush',        no: 1,  name: 'Ordinal Rush',        accent: '#f7931a' },
    { id: 'snow-crash',          no: 2,  name: 'Snow Crash',          accent: '#ff3ea5' },
    { id: 'genesis-21',          no: 3,  name: 'Genesis 21',          accent: '#5546ff' },
    { id: 'the-archive',         no: 4,  name: 'The Archive',         accent: '#c9a46a' },
    { id: 'plebs-legends',       no: 5,  name: 'Plebs & Legends',     accent: '#ff2b2b', inject: 'window.__PL_TEST__=true' },
    { id: 'robot-factory',       no: 6,  name: 'Robot Factory',       accent: '#7048e8' },
    { id: 'monkey-hash',         no: 7,  name: 'Monkey Hash',         accent: '#d9a300' },
    { id: 'nine-lives',          no: 8,  name: 'Nine Lives',          accent: '#12b5a6' },
    { id: 'degen-city',          no: 9,  name: 'Degen City',          accent: '#e8590c' },
    { id: 'the-stack',           no: 10, name: 'The Stack',           accent: '#fc6432' },
    { id: 'who-is-satoshi',      no: 11, name: 'Who Is Satoshi?',     accent: '#e0b04a' },
    { id: 'rare-pepe-directory', no: 12, name: 'Rare Pepe Directory', accent: '#3fb950' },
    { id: 'rune-pit',            no: 13, name: 'Rune Pit',            accent: '#d64545' },
    { id: 'xtrata-originals',    no: 14, name: 'Xtrata Originals',    accent: '#4675b6' },
    { id: 'the-halving',         no: 15, name: 'The Halving',         accent: '#ffd23f' },
    { id: 'mooneeb',             no: 16, name: 'Mooneeb',             accent: '#c084fc' },
    { id: 'club-x',              no: 17, name: 'Club X',              accent: '#e6ff00' },
    { id: 'rugged',              no: 18, name: 'Rugged',              accent: '#b5532c' },
    { id: 'sat-hunter',          no: 19, name: 'Sat Hunter',          accent: '#00a6fb' },
    { id: 'mempool-madness',     no: 20, name: 'Mempool Madness',     accent: '#14f195' },
    { id: 'dog-army',            no: 24, name: 'DOG Army',            accent: '#e7e5e4' },
    { id: 'hot-wallet',          no: 25, name: 'Hot Wallet',          accent: '#e11d48' }
    // Next machine goes here, for example:   { id: 'corgi-kennel', no: 21 },
  ]
};
