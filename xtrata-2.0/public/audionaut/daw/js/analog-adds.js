// Extra hits layered onto selected grooves in the Analog collection only, so that the rarer
// recordings of the Analog Kit (half-open and foot hats, splashes, rimshots, cajón, low bongos,
// timpani-style kicks, ...) each have a natural home in at least one beat. The Studio and L1 sets
// are untouched. Shape: { recipeId: { ROLE: "16 or 32 step pattern" } }; each entry creates that
// role in the groove (none of them replaces a role the groove already plays).
export const ANALOG_ADDS = {
  // rimshot accents and cross sticks
  "country-honky-tonk": { RS: ".... .... .... ...x" },
  "soul-stax-backbeat": { RS: ".... .... .... ...x" },
  "jazz-hard-bop": { RS: "...x .... .... ....", SP: ".... .... .... x...", F1: ".... .... .... ..x.", T1: ".... .... ..x. ...." },
  "jazz-big-band-shout": { RS: ".... .... ..x. ....", F1: ".... ..x. .... ....", F2: ".... .... .... x..." },
  "orch-heroic-march": { RS: "x... .... .... ...." },
  "stomp-and-clap": { SS: ".... x... .... x..." },
  "orch-cinematic-pulse": { SS: ".... x... .... x..." },
  // half-open and loose hats
  "funk-sly-pocket": { HH: ".... ..x. .... ...." },
  "disco-funk-bounce": { HH: ".... .... ..x. ...." },
  "blues-rock-shuffle": { HH: ".... .... .... ..x." },
  "boom-bap": { HH: ".... .... ..x. ...." },
  "hh-crunk-stomp": { HH: ".... ..x. .... ...." },
  "soul-memphis-pocket": { HH: ".... ..x. .... ...." },
  "dancehall-riddim": { HH: "..x. .... ..x. ...." },
  // concert kit hats (the Concert kit has its own hi-hat recordings)
  "ebm-pulse": {
    H: "x.x. x.x. x.x. x.x.",
    O: ".... .... .... ..x.",
    HH: "..x. .... ..x. ....",
    HP: ".... x... .... x...",
  },
  // pedal and foot hats
  "slow-blues": { HP: ".... x... .... x..." },
  "highlife-bounce": { HP: ".... x... .... x..." },
  // splashes and chinas
  "rock-arena-toms": { SP: "x... .... .... ...." },
  "kuduro-rush": { SP: "x... .... .... ....", CH: ".... .... x... ...." },
  "drumline-paradiddle": { SP: "x... .... .... ...." },
  "soukous-sebene": { SP: ".... .... x... ...." },
  // hand drums
  "latin-mambo-bell": { BL: "x.x. ..x. x.x. ..x." },
  "latin-bolero": { BL: ".... x... .... x..." },
  "flamenco-rumba-cajon": { CJ: "x..x ..x. x..x ..x.", CM: "..x. .x.. ..x. .x.." },
  // timpani-style concert kicks under the orchestral grooves
  "orch-trailer-hits": { K: "X... .... X... ...." },
  "orch-epic-slow-build": { K: "x... .... .... ...." },
  "orch-suspense-ticks": { K: "x... .... x... ...." },
  "orch-battle-charge": { K: "X... .... X... ...." },
  "saidi-darbuka": { DB: ".... x... .... x..." },
  "brazil-pagode": { WB: "x.x. ..x. x.x. ..x." },
};
