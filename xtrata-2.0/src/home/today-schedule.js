// "Today on Xtrata": the daily feature that holds the first slot of the homepage Living Wall
// during the campaign. EVERYTHING you would edit lives in this file: the launch date, the
// length, and one entry per day. today-on-xtrata.js works out which day it is, wall-rotation.js
// gives the card the first big slot, today-card.js draws it.
//
// To launch: set TODAY_LAUNCH_DATE to the Monday you want Day 1 to run (a UK calendar date).
// To swap a pick: edit that day's entry. To queue more days: raise TODAY_DAYS and add entries.
// Before the launch date and after the last day the wall rotates exactly as it always did.
//
// Entry fields
//   day        1-based position in the campaign (must run 1..TODAY_DAYS with no gaps)
//   id         unique, becomes the tile id
//   feature    short label shown above the title (the thing being featured)
//   title      the headline
//   copy       one short line. Day 14 swaps in the live champion, see `action.champion`
//   credit     optional "by <creator>" line
//   tone       one of the home-tone colours: lime violet amber orange cyan pink teal
//   image      art for the card, position/pixelated optional
//   action     the ONE primary button:
//                { type: 'link', label, href, newTab? }   opens a page
//                { type: 'song', label, tokenId, title, artist }   plays the song on the site radio
//                { type: 'champion', label, href, fallbackCopy }    link, copy filled from /api/arcade-champion
//   also       optional second, quieter link { label, href, newTab? }
//   tracks     optional list of songs shown as numbered play chips (the rest of an album). Playing any of them
//              puts the site radio in album mode so the songs play in this order, then loop
//   albumTitle optional name shown on the radio while the album plays
//   avoid      wall tile ids that must not appear anywhere on the wall that day, so the same
//              feature is never shown twice (wall tile ids: astro-blaster, audionauts-stream,
//              forever-twins, kp-loops, giveaway, xtrata-arcade, chess)
//   avoidSongs song token ids that must not also appear as a small song tile that day
//   note       for the team only, never shown: what was verified and what still needs a decision

// Monday 9 November 2026, UK time. Must be a Monday (a test checks this).
export const TODAY_LAUNCH_DATE = '2026-11-09';
export const TODAY_TIMEZONE = 'Europe/London';
export const TODAY_DAYS = 14;

const ASTRO = '/i/3075';
const APHELION = '/i/3087';

export const TODAY_SCHEDULE = Object.freeze([
  Object.freeze({
    day: 1, id: 'today-astro-crown', feature: 'Astro Blaster 3',
    title: 'Take a run at the champion.',
    copy: 'Beat the all-time #1 and your name takes the crown. We check who holds it on the second Sunday.',
    tone: 'cyan', image: '/home/wall/astro-blaster-3075.webp', position: 'center 30%',
    action: { type: 'link', label: 'Take the crown', href: ASTRO, newTab: true },
    avoid: ['astro-blaster'],
    note: 'Verified: /i/3075 is the live game, /api/arcade-champion answers.'
  }),
  Object.freeze({
    day: 2, id: 'today-song-opening', feature: 'Xtrata Music',
    title: 'A song worth stopping for.',
    copy: 'Roar Kitty Roar hits full volume from the first second. Press play and see if you can walk away.',
    credit: 'by Thommy Ai Production',
    tone: 'pink', image: '/radio/artwork?id=3570',
    action: { type: 'song', label: 'Play the track', tokenId: 3570, title: 'Roar Kitty Roar', artist: 'Thommy Ai Production' },
    avoidSongs: [3570],
    note: 'Verified #3570 exists and has artwork. Chosen by measuring: its first 5 seconds are as loud as the whole track (-14.6 dB), the others open 5 to 10 dB quieter. EDITORIAL: swap if you would rather lead with another song.'
  }),
  Object.freeze({
    day: 3, id: 'today-bitcoin-birds', feature: 'Bitcoin Birds',
    title: 'One bird, two lives.',
    copy: 'Bird #0 as an on-chain Forever Twin: the exact same image, kept on Bitcoin\'s Stacks layer instead of an outside host.',
    tone: 'cyan', image: '/inscription/mainnet/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-v3-2-3/3129', pixelated: true,
    action: { type: 'link', label: 'Meet the twin', href: '/forever-twins/collection/bitcoin-birds' },
    avoid: ['forever-twins'],
    note: 'Verified: twin is inscription #3129; its SHA-256 equals the original image hash in /ft/bitcoin-birds/0.json. The original lives on an IPFS folder, which this card does not load, so it shows the twin only.'
  }),
  Object.freeze({
    day: 4, id: 'today-instrument', feature: 'Play',
    title: 'Play an on-chain instrument.',
    copy: 'Layer three drum loops into a groove on the KP Loops station. No wallet, no sign-up.',
    credit: 'by Kieron Pepper',
    tone: 'pink', image: '/home/kp-loops.webp', position: 'left center',
    action: { type: 'link', label: 'Make some noise', href: '/kp-loops/#kp-loops' },
    avoid: ['kp-loops'],
    note: 'EDITORIAL: the only instrument in Play is the KP Loops drum station, which has no pitched notes, so the challenge is three layered loops instead of a three-note tune. Swap if you have a pitched instrument that works without a wallet.'
  }),
  Object.freeze({
    day: 5, id: 'today-meet-audionaut', feature: 'Audionauts',
    title: 'Meet an Audionaut.',
    copy: 'Aphelion is one of 111 explorers, and every one hides a star that opens a song. Tomorrow we go hunting.',
    tone: 'teal', image: '/home/daily/audionaut-aphelion-3087.webp', pixelated: true,
    action: { type: 'link', label: 'Meet the explorer', href: APHELION, newTab: true },
    avoid: ['audionauts-stream'],
    note: 'Verified: edition 15 "Aphelion" is inscription #3087. The engine (#3060) maps it to hidden song #315 "Entertainment" by melophonic, and it is the only edition with an extra bonus track (#139).'
  }),
  Object.freeze({
    day: 6, id: 'today-find-star', feature: 'Audionauts',
    title: 'Find the tiny white star.',
    copy: 'Aphelion is wearing one. Watch the helmet, catch the glint and tap it to open a hidden Stacks song.',
    tone: 'teal', image: '/home/daily/audionaut-aphelion-3087.webp', pixelated: true,
    action: { type: 'link', label: 'Find the song', href: APHELION, newTab: true },
    avoid: ['audionauts-stream'],
    note: 'Same explorer as Friday. The star glints once in the first minute, then one to three more times.'
  }),
  Object.freeze({
    day: 7, id: 'today-opus', feature: 'Audionauts on Bitcoin L1',
    title: 'Opus of Efficiency.',
    copy: 'The original track behind the Audionauts, streamed straight from Bitcoin. Then slip back and say hello to Aphelion.',
    tone: 'teal', image: '/home/wall/audionauts-3059.webp',
    action: { type: 'link', label: 'Hear the original', href: 'https://ordinals.com/inscription/95768432', newTab: true },
    also: { label: 'Back to Friday\'s explorer', href: APHELION, newTab: true },
    avoid: ['audionauts-stream'],
    note: 'Title and inscription 95768432 come from the existing Audionauts copy and AUDIONAUTS_ORDINAL_HREF. ordinals.com was not reachable from the build sandbox, so open the link once before launch.'
  }),
  Object.freeze({
    day: 8, id: 'today-fresh', feature: 'Fresh off the chain',
    title: 'Fresh off the chain.',
    copy: 'Continue Screen, one of the newest songs on Xtrata. Press play and hear what just landed.',
    credit: 'by Xtrata Arcade',
    tone: 'lime', image: '/radio/artwork?id=3646',
    action: { type: 'song', label: 'Try the new inscription', tokenId: 3646, title: 'Continue Screen', artist: 'Xtrata Arcade' },
    avoidSongs: [3646],
    note: 'EDITORIAL, SWAP ON SUNDAY 15 NOV: placeholder using the newest playable inscription found on 5 Nov (#3646). Replace with whatever is freshest and most fun to try that day, and credit its creator.'
  }),
  Object.freeze({
    day: 9, id: 'today-linked-artwork', feature: 'Xtrata Music',
    title: 'A song with something attached.',
    copy: 'Wonderland by melophonic. Its cover art is a separate inscription linked in, not copied. Play it, then open the artwork.',
    credit: 'by melophonic',
    tone: 'violet', image: '/radio/artwork?id=3600',
    action: { type: 'song', label: 'Play and explore', tokenId: 3600, title: 'Wonderland', artist: 'melophonic' },
    also: { label: 'Open the linked artwork (#134)', href: '/i/134', newTab: true },
    avoidSongs: [3600],
    note: 'Verified: #3600 declares dependency 134 as its artwork and is on the 2007 EP. Lyrics are empty on every song checked, so artwork is the link on offer.'
  }),
  Object.freeze({
    day: 10, id: 'today-megapont', feature: 'Megapont Ape Club',
    title: 'What survived.',
    copy: 'Ape #3 now has a Forever Twin: the same picture, held on-chain in case the links behind the original ever fade.',
    tone: 'violet', image: '/inscription/mainnet/SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X/xtrata-v3-2-3/3104', pixelated: true,
    action: { type: 'link', label: 'Open the preserved ape', href: '/forever-twins/collection/megapont-ape-club' },
    avoid: ['forever-twins'],
    note: 'Verified: hero twin is inscription #3104 and the collection page is live. No "Somewhere Else" destination exists anywhere in the repo, so there is no extra link. EDITORIAL: send the URL if there is one.'
  }),
  Object.freeze({
    day: 11, id: 'today-reuse', feature: 'Inscriptions',
    title: 'One inscription, two ways to use it.',
    copy: 'Audionaut 029 is a page under 1 KB. It borrows the shared engine (#3060) that powers every explorer. Open both.',
    credit: 'by Audionals',
    tone: 'orange', image: '/home/daily/audionaut-aphelion-3087.webp',
    action: { type: 'link', label: 'See what it became', href: '/i/3082', newTab: true },
    also: { label: 'See the engine (#3060)', href: '/i/3060', newTab: true },
    note: 'Verified: #3082 is "Audionaut 029", a ~1 KB page whose only script is /i/3060 (same pattern verified on #3087). #3060 serves text/javascript. Replaces the earlier audio example (#8 into #319) so Day 9 (artwork) and Day 11 (code) are different kinds of reuse. EDITORIAL: the card reuses Aphelion artwork; swap for a #3082 screenshot if you want its own picture.'
  }),
  Object.freeze({
    day: 12, id: 'today-album', feature: 'Xtrata Music',
    title: 'One album, front to back.',
    copy: 'Audionals - The Opera in seven songs. Start at track one, or jump to any song below.',
    credit: 'by Audionals',
    tone: 'amber', image: '/radio/artwork?id=2883',
    action: { type: 'song', label: 'Start the album', tokenId: 2883, title: 'Let The Score Remember All', artist: 'Audionals' },
    albumTitle: 'Audionals - The Opera',
    tracks: [
      { tokenId: 2883, title: 'Let The Score Remember All', artist: 'Audionals' },
      { tokenId: 2895, title: 'It Was Only Midnight', artist: 'Audionals' },
      { tokenId: 2910, title: 'MORE LIKE THIS', artist: 'Audionals' },
      { tokenId: 2896, title: 'When the Server Falls', artist: 'Audionals' },
      { tokenId: 2892, title: 'A Thousand Small Percentages', artist: 'Audionals' },
      { tokenId: 2885, title: 'NEVER ENEMIES', artist: 'Audionals' },
      { tokenId: 2889, title: 'Where Every Note Remains', artist: 'Audionals' }
    ],
    avoidSongs: [2883, 2885, 2889, 2892, 2895, 2896, 2910],
    note: 'Running order confirmed by Jim on 7 Nov from the album list (Audionals - The Opera, 1st Edition, 7 songs). Plays one song at a time on the free site radio; public albums have no deep link yet.'
  }),
  Object.freeze({
    day: 13, id: 'today-parallax', feature: 'ParallaX Casino',
    title: 'One spin.',
    copy: 'The ParallaX casino has a fresh set of slot machines. Walk in, pick one and take a spin.',
    tone: 'amber',
    action: { type: 'link', label: 'Play the machine', href: '/casino/', newTab: true },
    avoid: ['casino'],
    note: 'Opens the regular casino (/casino/), which now has the simple setup with the new slot machines. Not a deep link to one cabinet. No screenshot art (the casino needs WebGL), so the card uses a CSS slot motif.'
  }),
  Object.freeze({
    day: 14, id: 'today-crown-check', feature: 'Astro Blaster 3',
    title: 'Who holds the crown?',
    copy: 'The crown is up for grabs. Beat the all-time #1 and take it.',
    tone: 'cyan', image: '/home/wall/astro-blaster-3075.webp', position: 'center 30%',
    action: {
      type: 'champion', label: 'Challenge the champion', href: ASTRO, newTab: true,
      fallbackCopy: 'The crown is up for grabs. Beat the all-time #1 and take it.'
    },
    avoid: ['astro-blaster'],
    note: 'Copy is replaced by the live champion (name and points) from /api/arcade-champion; if that read fails the fallback copy stays.'
  })
]);
