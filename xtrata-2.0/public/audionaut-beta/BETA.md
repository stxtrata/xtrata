# AudioNaut beta

The community beta at `/audionaut-beta/` is an independent snapshot of beta-pro release `d6ae247b8793` on 21 November 2026. It includes the same workstation, instruments, effects, Timeline, mixer, automation and historical song importer.

Both editions verify the same Audionaut membership. Beta retains its existing browser project database and preferences. Later beta-pro edits reach beta only through another explicit promotion. To move a song between editions, export a portable project and open it in the other edition.

Build beta with `npm run build:audionaut-beta` from `xtrata-2.0`. Run the browser and audio checks with `node public/audionaut-beta/tools/pro-suite.mjs`.
