# Pool Party

**ParallaX Casino · machine 23 · Series Bible 2.1 · standalone test build**

**Version 2.1.1 — reel-animation correction, 3 November 2026.** The offscreen game now schedules its single animation loop on the visible cabinet window. This prevents a browser pausing the hidden frame from leaving accepted spins frozen. Spin and scene timestamps still use the game's own clock. The initial loading transition uses the same scheduler. The canonical engine, stored account format and committed-round recovery are unchanged.

A playable Stacks DeFi rooftop-pool fruit machine with a real 3D cabinet, a mechanical diving-board lever, five spring-loaded deck controls, and complete themed bonuses. It uses the exact Block Fortune v2 engine from the supplied DOG Army reference.

## Open and play

Open **`index.html`** in a current browser. The page contains the renderer, packed cabinet, game, official artwork and dated data; it does not need the other files to play. It starts with **100,000 test LAYR** in a clearly marked standalone account stub. These are play credits. The Reset button replenishes that test balance; it does not silently rewrite a pending result.

If your browser restricts local files, serve this directory with `python3 -m http.server 8765` and open `http://localhost:8765/`. No npm install or development server is needed to play.

- **Cabinet:** drag to orbit; wheel to zoom; click the lever or physical deck keys.
- **Screen:** a camera fit at pitch 0.16 shows the complete glass and the controls deck.
- **Fullscreen:** the game fills the viewport, including its own bottom control bar and dialogs. A fixed viewport layer works when the browser has no Fullscreen API.
- **SWAP:** spin. **±SLIPPAGE:** change the total bet. **AUTO-SWAP:** select autoplay. **POOLS:** pays, rules and the public Bonus preview.
- **Bonus Lab:** choose any feature, bet and optional seed. Replay and Run all are included. Practice chips and state are separate from the real test account.
- **Keyboard:** Space spins in cabinet/screen views; F toggles fullscreen; L opens the Lab in the test build; S skips a bonus; 1–9 choose a lounger; M mutes; Esc closes a panel or exits fullscreen. Fullscreen spins use the bottom-bar button.

Use Sound and volume on the fullscreen bar, or Settings, for the original water effects and lounge arrangement. Reduced motion is available in Settings and follows the system preference.

## Design

The cabinet uses glazed white pool tiles, a turquoise stripe, chrome ladder rails, a cream/turquoise awning, an underwater-window screen and official token marks on floating rings along the sides. A purple/white STX ring turns on a water jet above the marquee. The diving-board lever eases down, rests against its stop, returns and bounces; the water jet reacts to the pull. Each cap and its label move together along the deck's local z axis.

The marquee shows the selected Casino Jackpot meter and the Machine Fund, including the period end and last-period pay per twin when available. The lower door uses the supplied XLOGO vector, unchanged, with **DEFI ON BITCOIN, SINCE 2021**. The canonical ParallaX wordmark appears at souvenir scale.

| Engine slot | Pool Party treatment |
| --- | --- |
| cherry | USDA, official Arkadiko artwork |
| lemon | DIKO, official Arkadiko artwork |
| chip | CHA, official Charisma artwork |
| block | VELAR, official Velar artwork |
| artifact | ALEX, official ALEX artwork |
| bitcoin | STX, official Stacks artwork and jackpot symbol |
| wild | A real LP-token record on a swim-ring card |
| scatter | A successful, dated swap transaction |
| vault | A dated real-pool yield card; unavailable APR is explicitly labelled |
| chain | A real trading pair, with protocol/wrapper attribution |

### Bonus presentation

**Happy Hour** turns the pool into a sunset scene with pool lights and bobbing rings. **Yield Farm** opens nine sun loungers, of which the player reveals three. **Deep Liquidity** fills 15 animated pool lanes through hold-and-respin play. **Cannonball** celebrates a centre-row STX jackpot or a full pool with the largest water sequence. **Stake or Swap** uses an animated pool buoy for its even gamble. Each feature has a trigger, intro, animated play and summary, with the relevant action available on the game canvas and fullscreen bar.

Skip reveals the committed feature result. In Yield Farm, remaining skipped picks are opened in index order; a comparison with manual play therefore uses the same three choices. Selecting different loungers may legitimately pay a different amount because all nine independent prizes were dealt before the feature began.

## Engine and account integrity

`src/engine.js` is copied byte for byte from the supplied reference; `STATE_VERSION` stays **2**. Its full-file SHA-256 is:

`7f619182ada01119a713c64874eb1a7e024d7c210e0dca0ec2e8afc05c143168`

The finished game contains the unchanged 11,429-character `const BF` block with SHA-256:

`203f8735007d8df9c2058be24c8e65fe269abac341438c0217128baef69f9bed`

The design RTP is **94.38%**, not a certified RTP. Two fresh five-million-paid-spin checks returned **94.137040%** and **94.454737%**. Both fall within the requested ±0.3 percentage-point band. All bonus tails were completed, including free spins awarded by the final paid spin. See `RESULTS.md` and the machine-readable reports in `checks/results/`.

The game has five 32-stop reels, 20 fixed lines, total bets 20/40/100/200/500, eight initial free spins, four-spin retriggers up to 24, independently drawn pick prizes, and the unchanged hold-and-respin and jackpot rules. The canonical free-spin multiplier doubles **line and scatter wins**. Separate pick and hold prizes retain their canonical 1× values; the treatment's broader “all wins 2×” phrase cannot override the engine.

Each paid result and its `jackpot: {level, hit}` metadata are saved before animation. Reload settlement uses that same pending round. The machine obtains account actions through the one `ParallaxLAYRAccount` interface. The standalone host supplies the test stub; the packed production game does not contain that host stub.

The public preview uses an independent pristine `PX_PURE` engine and separate practice state. Account saving, external logging, real jackpot calls and fund accrual are excluded during preview. Forcing functions are inside the game closure. `PoolParty` diagnostics exist only behind `PX_STANDALONE_TEST` and expose observations, not result-forcing methods. Leaving or reconnecting the machine ends practice and restores the account.

## Jackpot and Fund scope

The unchanged engine owns five local jackpot meters until the shared Casino Service is available. Each starts at 500× its bet level and receives 2% of paid bets. `casinoJackpot.get`, `contribute` and `settle` are the explicit service-adapter boundary; the latter two acknowledge work already done by the core, avoiding double contributions or settlement.

`fund.json` declares type W, all live Forever Twins collections, weekly periods beginning Monday 00:00 UTC, and no split. The local display accrues 1% of paid stakes from the house share. It never deducts from a player win. Unknown eligible-twin counts and last-period shares say **Checking**. Snapshot creation, claims, shared jackpot settlement and refunds are named future service stubs, as required by the brief; no on-chain payout is connected.

There is no outside-token-holder reward, token minimum, wallet-linking flow or cameo record. Nothing on the reels is required to play.

## Art and source evidence

`art/sources.json` is the authoritative source manifest. The package includes exact publisher assets, their hashes, the exact token contracts, original API responses and the 3 November 2026 read log. There are 18 records in each bundled family: LP tokens, swaps, trading pairs and yield cards. The game makes no live data request while playing.

Verified APR was unavailable. Yield cards say **APR UNAVAILABLE** with their pool, protocol and snapshot date; an APY field has not been relabelled as APR. Stale/unavailable service data never becomes an invented zero or rate. The machine has no NFT artwork, so a NOT YET FOREVER stamp is not applicable to its token/record symbols.

Permissions before public use remain outstanding for the six third-party marks: **Arkadiko USDA, Arkadiko DIKO, Charisma CHA, Velar VELAR, ALEX and Stacks STX**. No permission request has been sent. Xtrata and ParallaX artwork came from the supplied project materials. Sound is an original procedural water and lounge arrangement; no third-party recording is bundled. Listening approval is still owed.

## Files and rebuild

| File or directory | Purpose |
| --- | --- |
| `index.html` | Complete offline-capable standalone test page |
| `pack.json` | One room-compatible `PX_MACHINE_PACKS` entry |
| `fund.json` | Required type-W weekly Fund declaration |
| `src/host.html` | Editable standalone studio, test account, camera solver and raycast controls |
| `src/cabinet.js` | Three r128 model, materials, textures, named roles and action meshes |
| `src/game.a.js` | Theme identity, state references and original procedural sound |
| `src/game.b.js` | Official art, data cards and 480 px reel tiles |
| `src/game.c.js` | Fund/jackpot adapters, canvas, live marquee and effects |
| `src/game.scenes.js` | Pool scenery and the distinct bonus environments |
| `src/game.d.js` | Spin presentation and bonus/Skip/gamble controller |
| `src/game.e.js` | Panels, safe preview/Lab, fullscreen and host API |
| `src/game.css`, `src/game-body.html` | Responsive DOM, controls and dialogs |
| `src/engine.js`, `engine.sha256` | Exact canonical core and its recorded hash |
| `src/layr.js`, `compat.js`, `xlogo.js`, `software.js`, `canvasengine.js` | Unchanged supplied account/compatibility/rendering helpers |
| `art/`, `data/` | Intact assets, provenance, reviewed snapshot and raw evidence |
| `build/model.json` | Current packed cabinet source data |
| `tools/` | Rebuild, validation, source-fetch and return-simulation tools |
| `checks/` | Reproducible browser and pure-engine checks, with recorded results |
| `INTEGRATION.md` | Room handoff instructions; no room files were edited |

Rebuild the HTML and pack with **Node.js**:

```sh
node tools/build-pack.mjs
node tools/check-engine.mjs
node checks/engine-data.mjs
node checks/engine-data-art.mjs
```

To regenerate the model, install Python Playwright and Chromium, serve this folder, then run:

```sh
GAME_ONLY=1 node tools/build-pack.mjs
python3 -m http.server 8765
# In a second terminal, from this same folder:
CHROME=/path/to/chromium python3 tools/build-cabinet.py
node tools/build-pack.mjs
```

`POOLPARTY_BASE` overrides the builder's server URL. `NO_PREVIEWS=1` omits the optional cabinet PNG exports. The build does not download game assets. `tools/fetch-pool-sources.py` refreshes primary evidence into a staging folder for review; it never silently replaces the reviewed snapshot.

Browser checks require Python Playwright. `python3 checks/run-browser-checks.py` finds Chromium, or accepts `CHROME`, and supplies the browser path consistently to every suite. The browser suites start their own local HTTP server, so no separate server process is needed. Full visual evidence may be supplied as a separate archive to keep the playable/source package small; the JSON results remain with this package. `RESULTS.md` records the exact scope and remaining hardware/listening sign-offs.
