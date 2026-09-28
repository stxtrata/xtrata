// ---------------------------------------------------------------------------
// Game data: sectors, enemies, weapons, upgrade cards.
// ---------------------------------------------------------------------------

var SECTORS = [
  { name: 'Perimeter Drift', boss: 'warden', hazard: null,
    pool: { dart: 5, weaver: 4, swarmer: 3, gunship: 2 } },
  { name: 'Ember Belt', boss: 'hive', hazard: 'rocks',
    pool: { dart: 4, weaver: 3, swarmer: 3, gunship: 2, splitter: 3, minelayer: 2 } },
  { name: 'Nebula Veil', boss: 'twins', hazard: 'fog',
    pool: { dart: 3, weaver: 3, swarmer: 3, gunship: 2, splitter: 2, sniper: 3, bearer: 3 } },
  { name: 'Glass Reef', boss: 'leviathan', hazard: 'crystals',
    pool: { dart: 3, weaver: 2, swarmer: 3, gunship: 2, sniper: 2, bearer: 2, mirror: 3, turret: 2 } },
  { name: 'Storm Corridor', boss: 'prism', hazard: 'lightning',
    pool: { dart: 3, weaver: 2, swarmer: 3, gunship: 2, splitter: 2, sniper: 2, mirror: 2, turret: 2, carrier: 2 } },
  { name: 'The Source', boss: 'signal', hazard: 'mixed',
    pool: { dart: 3, weaver: 2, swarmer: 3, gunship: 3, splitter: 2, minelayer: 2, sniper: 2, bearer: 2, mirror: 2, turret: 2, carrier: 2 } }
];

// hp: base hit points; r: hit radius; score: base points; scrap: orbs dropped
var ENEMIES = {
  dart:      { hp: 2,  r: 9,  score: 100, scrap: 1 },
  weaver:    { hp: 4,  r: 10, score: 150, scrap: 1 },
  gunship:   { hp: 14, r: 15, score: 400, scrap: 3 },
  splitter:  { hp: 9,  r: 14, score: 250, scrap: 2 },
  minelayer: { hp: 10, r: 14, score: 350, scrap: 2 },
  bearer:    { hp: 12, r: 15, score: 400, scrap: 3 },
  sniper:    { hp: 8,  r: 11, score: 350, scrap: 2 },
  swarmer:   { hp: 2,  r: 8,  score: 80,  scrap: 1 },
  carrier:   { hp: 60, r: 26, score: 1200, scrap: 6 },
  turret:    { hp: 36, r: 18, score: 700, scrap: 4 },
  mirror:    { hp: 12, r: 13, score: 450, scrap: 3 },
  rock:      { hp: 6,  r: 16, score: 60,  scrap: 1, hazard: true },
  pebble:    { hp: 2,  r: 9,  score: 30,  scrap: 0, hazard: true },
  crystal:   { hp: 1,  r: 14, score: 0,   scrap: 0, hazard: true, invuln: true }
};

var WEAPONS = ['pulse', 'scatter', 'lance', 'swarm'];
var WEAPON_NAMES = { pulse: 'Pulse', scatter: 'Scatter', lance: 'Lance', swarm: 'Swarm' };

// Module caps
var MODULE_MAX = { drone: 2, shield: 2, magnet: 3, over: 3, after: 3, graze: 2, bomb: 3, chain: 3 };
var MODULE_INFO = {
  drone:  ['Wing Drone', 'A drone flies beside you and fires your weapon at half power.'],
  shield: ['Shield Cell', 'Blocks one hit. Recharges one cell after each wave.'],
  magnet: ['Magnet', 'Pulls scrap in from further away.'],
  over:   ['Overcharge', 'Fire 15% faster.'],
  after:  ['Afterburner', 'Move 12% faster.'],
  graze:  ['Graze Field', 'Wider graze zone: more points and bomb charge from near misses.'],
  bomb:   ['Nova Rack', '+1 bomb now and +1 bomb capacity.'],
  chain:  ['Chain Battery', 'Your kill chain lasts half a second longer.']
};

var BOSSES = {
  warden:    { name: 'Warden', hp: 520 },
  hive:      { name: 'Hive Mother', hp: 760 },
  twins:     { name: 'Twin Lancers', hp: 430 },   // per ship
  leviathan: { name: 'Leviathan', hp: 70 },       // per segment (12 segments)
  prism:     { name: 'Prism Core', hp: 1300 },
  signal:    { name: 'The Signal', hp: 2100 }
};

// Input commands (discrete, one frame).
var CMD = {
  NONE: 0, BOMB: 1,
  CARD1: 2, CARD2: 3, CARD3: 4,
  DOCK1: 5, DOCK2: 6, DOCK3: 7, DOCK4: 8, DOCK_LEAVE: 9
};
