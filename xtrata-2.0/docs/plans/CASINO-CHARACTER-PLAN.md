# ParallaX Casino: cube characters

Status: **on `casino-fable`, not pushed, not deployed.** The characters were built 2026-11-12 (first commit); sections 8 and 9
(inscriptions on the screens, the front included; reactions and gestures) are the second pass, 12 and 13 November (second commit). Page `/casino`
(`public/casino/index.html`, `cube-avatars.js`, `character.js`), room client `src/casino-room/main.ts` (`room.js`), room Worker
(`workers/casino-room/index.ts`, `functions/lib/casino-look.ts`, `casino-screens.ts`, `casino-room.ts`, `casino-progress.ts`), and one
Pages Function (`functions/casino/room/screens.ts`). Part of the overhaul in `CASINO-OVERHAUL-PLAN.md`.

**The ask.** Bring the cube-headed characters of the "Xtrata Cube Comparison & Material Lab" (edition 2.2) into the casino as player
characters: a player chooses the humanoid or the floating cube as their profile, customises it, and is seen as it by everyone in the
room. Work out selection, persistence and how a look reaches other players; keep it light for phones and cheap for the room Worker.

## 1. What a player gets

- **Three bodies.** The classic human figure (as before, and still the default), the **humanoid cube** and the **floating cube**.
  The lab's third body, the Classic CubeBot (cube as torso and head), is not offered: the brief asked for the humanoid and the
  floating cube. It can be added as a fourth body later with no change to the room (see section 6).
- **For the cubes:** the frame (the lab's eight material presets, or any colour), the accent colour (the screens' graphics and the
  body's lights), the face on the front screen (six), the screens' finish (the lab's six) and the walk (natural, swagger, tipsy).
- **A live preview** in the panel: the character turns, stands and walks on the spot; drag to turn it.
- **Where to find it:** Menu, You, **Your character**; and a line under ENTER THE CASINO on the welcome card ("Your character:
  you are the classic figure · change").
- **Who sees it.** Everyone in the room, at seats, at machines and walking. A guest (not signed in) sees their own choice on
  themselves in the behind-you view and keeps it for when they join.
- **A look from the lab.** The panel takes the lab's "Material settings / JSON" and uses its frame colour (as a preset when it is
  one) and its front screen's finish. The JSON is parsed as data and nothing in it is run.

## 2. The look is one short code

`<body><frame><finish><face><gait>-<accent>[-<frame colour>]`, for example `h000n-4ed5bd` or `fx40n-b48cff-2a1a4a`.
At most 19 characters, one pattern (`LOOK_PATTERN`), and nothing a player types ever reaches another player's page: the
room refuses anything that is not exactly this shape, and the page parses it again before drawing.

| Part | Values |
| --- | --- |
| body | `p` human figure · `h` humanoid cube · `f` floating cube |
| frame | `0`-`7` porcelain, titanium, obsidian, copper, carbon, walnut, mint, cobalt · `x` own colour (the last part) |
| finish | `0`-`5` glass, satin, matte, frosted, smoked, CRT |
| face | `0`-`5` happy, calm, wink, wow, cool, focus |
| gait | `n` natural · `s` swagger · `t` tipsy |
| accent | six hex digits |

The lists live twice, once for the room (`functions/lib/casino-look.ts`) and once for the page (`public/casino/cube-avatars.js`,
a plain script); `functions/lib/__tests__/casino-look.test.ts` loads the page's file and fails if they differ.

## 3. Where a look lives, and how it reaches other players

1. **This browser** (`localStorage` `parallax.look.v1`), so the choice exists before anyone signs in.
2. **The player's room profile** (`lk` on the `p:` record the room already keeps for levels and missions), once they are signed in.
   So it follows the wallet to another device.
3. **The connection** (`lk` in the socket's attachment, which survives hibernation), so the room can list it without reading storage.

The messages, all small:

- Page to room: `{ t: 'look', v: '<code>' | null }` (null: back to the human figure). Only sent on Save, only when the room lists the
  `look` feature and the player is signed in.
- Room to everyone who can see the room: `{ t: 'look', a: '<address>', v }`; to the sender, the same with `mine: true` as the receipt.
- On arrival, every player in the `room` message's `players` list carries `lk` when they are a cube; when a cube player joins, the
  others get one `look` after the `join`, the way `lvl` already follows it.

Which copy wins: the room's, on arrival, unless this browser holds a change the room has not confirmed (`parallax.look.unsent.v1`),
which is sent first. That covers choosing a look as a guest and then joining, and a room that was unreachable when Save was pressed.

## 4. What it costs

**The room Worker.** Nothing while nobody changes their look: the code is read with the profile the room already reads when a
player connects (no extra read), and rides in the attachment. A change is one profile read, one profile write and one small message
to each connection. Changes have their own limit (one every 1.5 s, twelve a minute), so they cannot slow seats or chat. No timers.

**The page.** Measured in the real room (headless Chromium, software rendering, so counts are exact and frame times are not):

| | Humanoid cube | Floating cube | Human figure |
| --- | --- | --- | --- |
| Draw calls | 11 | 3 (with its floor glow) | (a 163-bone skinned mesh) |
| Triangles | about 6,500 (5,800 on phones) | about 470 | |
| Own texture | one, 768 x 512 (384 x 256 on phones) | the same | shares the 2048 px skin |
| Shadow passes | 2 meshes | 1 mesh | all of it |

Eight characters on the floor (four of each) added 56 draw calls and 28,000 triangles to a 2,100-call, 580,000-triangle frame. Every character
shares the same vertex data; only a small colour table and the screen texture are its own. On phones and tablets (LITE) the bodies
are lit per vertex, the screens are plain textures, and cubes cast no shadows.

**No human figure is built for a cube player.** Seats and walkers for cubes have their own entries, so a phone that draws at most
6 human figures can also draw up to 12 cubes (desktop: 16 and 24). A room of cubes is the light case, not the heavy one.

**Why not the lab's own runtime.** It is about 1 MB, brings its own copy of three.js (r170; the casino runs r128), and gives every
character six 512 px canvases and about a hundred meshes. `cube-avatars.js` is 59 KB (39 KB before the screens and gestures of
sections 8 and 9) and draws to the lab's measurements instead.

## 5. What is faithful to the lab, and what is not

Faithful: the cube (1.02, radius 0.072), bezels and screens (0.948 and 0.9); the humanoid's pelvis, tapered chest, collar, shoulder
fairings, neck gimbal and rear yoke, with the cube head at 0.87; the six default screens (face, name and wave, energy, network,
ring, dot grid); the eight frame presets' colours, roughness and metalness; the six finishes; idle, walk, run, the wave, and the
swagger and tipsy styles; the floating cube's bob, pitch into its travel and bank into a turn.

Not carried over: frame **textures** (brushed, carbon weave, hammered, wood grain: only the colour and the metal come across),
per-face finishes and tints (one finish for all six screens), video and uploaded images on the screens (inscriptions a player
holds are shown: section 8), the hands' fingers, leg-length presets, the seated stool, jump, present and acknowledge, GLB export.
The lab remains the place for those.

Scale: the lab's humanoid is 2.94 units tall. In the room it stands 1.65 m, a little shorter than the human figures (about
1.8 m), because its head is half a metre across: at 1.92 m a seated neighbour's head covered a third of the screen at a table.
Seated on a 0.57 m stool it sits tall (1.91 m to the top of the head), because its legs are short. Name tags follow the head.
The floating cube is 0.51 m across with its centre 1.22 m up.

**Never in the way.** A cube whose head is within 1.5 m of the camera is drawn as a faint ghost, and not at all within 0.55 m. So
your own cube at a table (the camera sits a metre behind your seat) never covers the felt or the cards, and nobody's cube can fill
your screen by standing close.

## 6. Decisions for Jim

1. **The Classic CubeBot as a fourth body?** Not built (the brief named two). Adding it is page-only: a new letter in the code.
2. **The player's name on the back screen.** The back screen shows the BNS name or short address (the lab shows "CUBE"). Keep, or
   put the lab's panel back?
3. **Cubes close to the camera are ghosts** (see section 5). The alternative for your own cube at a table is a higher camera for
   cube players; I did not change the table cameras, which were tuned so the cards are never covered.
4. **Looks for guests.** A guest cannot be seen, so their look is theirs alone until they join. No change proposed.
5. **What may be shown on a screen (section 8).** Any still image the player's wallet holds is shown to everyone in the room,
   and nobody looks at it first. What exists: only the holder can show it; every visitor can hide all inscriptions for themselves
   (Menu, View and sound); and one Pages variable switches the feature off for everyone (`CASINO_SCREENS_DISABLED = "1"`). If you
   want more than that before it is public (an allow-list of collections, or hiding the screens of a player somebody has
   blocked or reported), say which and it is a small addition.

## 7. Tests (the characters)

- Unit (`casino-look.test.ts`, 13 tests): the code's shape, the limit, the room's rules, that the page and the room agree.
- End to end (the real page, the real room code, headless Chromium): a player picks a cube and a second player sees a cube where
  they stand, with no human figure built; the look is in the profile; a later arrival and a guest get it from the `room` message;
  seated; a change to the floating cube; back to the human figure (a human figure is built again); a second device takes the
  room's copy. Touch-emulated phone: the panel opened from the menu, a body and a face chosen and saved by taps.
- Looked at (screenshots): the panel on desktop and phone; a room of cube and human players, walking and seated; the behind-you
  view of your own cube; a table with a cube neighbour and your own cube as a ghost.
- Not tested: a real phone or tablet (frame rate, memory), two real devices, real wallets.

## 8. Programmable screens: inscriptions a player holds

**What a player gets.** All six screens (front, back, left side, right side, top, underneath) can each show an Xtrata
inscription from the player's wallet. **The front is programmable like the rest:** an inscription there takes the place of the
face (so that cube does not blink), a reaction's emoji still covers it for its moment, and taking it off brings the face back.
In Your character (cubes only) there is a new part, "Inscriptions on your screens": six slots, and under them the wallet's
inscriptions as tiles. Tap a tile and it goes on the chosen screen; the picker then moves on to the next empty one, filling the
back and sides first and the front last, so a face is only replaced when the player picks the Front slot. "Take it off", "Clear
all", and a box to type an inscription's number (for a wallet with more than 200, or when the wallet cannot be listed). The
preview shows the result at once. Save checks the chain and tells the room.

**Which inscriptions.** The newest Xtrata core on mainnet only (`SCREENS_CONTRACT`, read from `src/data/contract-registry.json`,
so it follows the "newest only" rule by itself). The casino's identity is a testnet address; the wallet that counts is the
mainnet address of the same key, as for the Salon's BNS names.

**What is drawn.** A still image: this site's stored thumbnail when there is one (`/thumb`), else the inscription itself
(`/runtime/content`) when it is a PNG, JPEG, WebP, GIF, AVIF or BMP of at most 3 MB (300 KB on phones and tablets). Everything
else (sound, video, pages, SVG, anything bigger) is a numbered tile ("#7 · AUDIO"). Nothing is ever run: a picture is drawn onto
the screen texture and that is all. The picture is cropped square, reduced to the screen's size (256 px, 128 px on phones) and
the original is let go, so a large image costs a quarter of a megabyte while it is on a cube. At most 96 are kept (40 on phones).

**The string.** `<face><token id>[,...]`, for example `f9,b12,l340,t7`: faces `f b l r t u`, each at most once, at most 65 characters,
one pattern (`SCREENS_PATTERN` in `functions/lib/casino-screens.ts`; the page's copy is in `cube-avatars.js` and a test fails if
they differ).

**Who may show what: only the holder, checked on the chain.**

1. The page posts the string to `POST /casino/room/screens` (a Pages Function; it needs the room session cookie).
2. The Function reads `get-owner` on the core contract for each token (at most six reads, through Hiro, with the site's key).
   The owner must be the mainnet twin of the signed-in address.
3. Three answers, never two: held (the room is told); not held (`409`, with the numbers: the panel takes them off and says so);
   **could not check** (`503`: nothing is changed, and the panel says so). A failed read is never treated as "not held".
   One ask per player every 3 seconds (`429`), so the endpoint cannot be used to hammer the chain API.
4. Only then does the Function post the string to the room (`/screens`, reachable only through the binding, like the
   WebSocket's trusted headers). The room never reads the chain and never sees a picture.

**Keeping it true.** The room keeps the string and when it was last checked (`sc`, `scAt` on the profile). The holder's page asks
again when the last check is more than 20 hours old (on arrival, and for a page left open), so a sold or transferred inscription
leaves the screens at the holder's next visit: the room is told the rest. A player who stays away keeps their choice, but the
room stops showing screens not checked for 7 days until their page has asked again (it does, by itself, when they come back).
So the longest a sold inscription can stay on a cube is until its old holder next opens the casino, or 7 days.

**How it reaches other players.** `sc` rides with the look: on each cube player in the `room` message, and in `look {a, v, sc}`
when it changes (`sc: null` clears). A player drawn as the human figure has no screens listed; they come back with the cube.

**Each visitor's switch.** Menu, View and sound, "Inscriptions on cubes": Shown or Hidden (kept in this browser). Hidden means
every cube shows its own graphics and no picture is fetched.

**Switching it off for everyone.** Pages variable `CASINO_SCREENS_DISABLED = "1"`: nobody can put an inscription on (clearing
still works), and no page re-checks. Screens already saved stay on until they are 7 days old. Removing them at once needs a
room change (stop listing `sc`), which is a few lines and is not built.

**What it costs.** The room: one profile read and one write per save or daily re-check, one small message to each connection; the
`room` message grows by at most 65 characters per cube player with screens. No timers. Pages: at most six `call-read`s per save
or re-check. The page: one `/index/page` request for each batch of new tokens it sees and one small image per token.

**Tests.** Unit (`casino-screens.test.ts`, 22): the string, that the page and the room agree, `get-owner` read as owner / nobody /
failed, the check (held, not held with numbers, could not check, switched off, nothing to check), the room's rules. End to end
(the real page, the real room code and the real check against a pretend chain): saved, in the profile, drawn by a second player's
page with the right picture on the right screen (read back from the screen texture); a thumbnail, a picture with no thumbnail and
a song; somebody else's inscription refused by number; a chain that cannot be read changes nothing; switched off; the viewer's
switch; a later arrival; a change of body; a sold inscription leaving at the next visit; screens older than 7 days waiting for a
fresh check and not lost by a failed one; clearing; a guest. All six at once, with the front: it keeps its inscription through
the moments a face would blink, a reaction covers it and it returns, the viewer's switch and taking it off bring the face back.
The picker by clicks (1280 x 720) and by taps (390 x 844, touch).
**Not tested:** real inscriptions and real thumbnails from the live index, the live Hiro API, a real wallet's holdings.

## 9. Reactions and gestures

- **A cube wears the reaction.** The emoji a player sends appears on their cube's face for as long as the bubble over their head,
  and the body does something that fits. Before, a cube only waved, whatever the reaction.
- **Twelve gestures** (`GESTURES` in `cube-avatars.js`): greet, win, nod, look, lose, raise, clap, laugh, wow, dance, heart, bow,
  each for the humanoid (standing and seated) and for the floating cube. They also play for the room's own moments: a win, a
  level, the jackpot, a drink received.
- **Three more reactions:** heart, dance, bow (eleven in all). The room lists `react-more`; a page offers the new three only to a
  room that lists it, and an older page shows them as a thumbs-up. The human figure plays its nearest existing gesture for them.
- **Timing by the clock.** A gesture and the face both run by real time, so on a phone that draws slowly a wave still takes as
  long as a wave.
- **Tests.** One player sends each of the eleven and a second player's page shows the right gesture and face on the first one's
  cube; they end by themselves; the floating cube; the human figure unchanged; a contact sheet of all twelve poses was looked at.
