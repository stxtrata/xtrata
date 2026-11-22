# AudioNaut beta

The community beta at `/audionaut-beta/` is an independent snapshot of beta-pro release `bfabf8363092` (PR #744). The Mobile step sequencer, track pads and mute groups, beat previews, seamless bar and sequence loops, one-tap live synth player, touch Timeline and effect automation are included. The main transport has larger green Play and red Stop buttons.

Both editions verify the same Audionaut membership. Beta retains its existing browser project database and preferences. Later beta-pro edits reach beta only through another explicit promotion. To move a song between editions, export a portable project and open it in the other edition.

Build beta with `npm run build:audionaut-beta` from `xtrata-2.0`. Run the browser and audio checks with `node public/audionaut-beta/tools/pro-suite.mjs`.
