# AudioNaut beta-pro: chain-ready devices

This is the first six-device stage of the instrument/effect roadmap. The original
AudioNaut and AudioNaut beta directories and their project storage are unchanged.
The beta-pro editor still requires the existing Audionaut membership gate.

## New instruments

- **Drum Rack:** 16 pads (default MIDI notes 36–51), imported samples, velocity,
  tuning, gain, pan, note-gated/one-shot playback and independent choke groups.
- **Sample Granulator:** grains from a real selected audio buffer; seeded
  playback, position, density, grain size, pitch, spray, spread and freeze controls.
- **Concert Piano:** key/velocity multisample zones, optional sample loops,
  sustain/release ownership and velocity-sensitive playback. Its included starter
  is an original modeled piano, not recordings of a concert grand.

All three appear in the normal instrument picker and the **New instruments**
workspace. Imported sources use ordinary sample tracks, so recording, recovery,
portable exports and chain bindings share one audio source graph. Original
generated starters require only the runtime code. No commercial sample library,
remote sound service or downloaded third-party DSP engine was added.

## New effects

- **Dynamic Parametric EQ:** four adjustable bands, positive/negative dynamic
  range, independent thresholds and an optional external sidechain.
- **Hybrid Reverb:** convolution early reflections plus a diffuse algorithmic
  tail; imported impulse responses up to 10 seconds/16 MiB; sample-rate conversion
  and transactional, crossfaded IR changes. Failed replacements retain the old
  sound and surface an error.
- **Mastering Limiter:** stereo-linked lookahead, fixed latency compensation,
  release control and estimated intersample peak protection. This is not a claim
  of certified true-peak compliance for every possible signal.

These have new IDs. Existing Orderbook, Liquidity and Stoploss settings and sounds
remain available, so old projects do not silently change to a new algorithm.
The catalogue now contains **31 instruments and 23 effects**.

## Instructions and chain dependencies

The **On-chain publishing** workspace prepares two separate layers:

1. A reusable playback runtime and the exact audio dependencies. The runtime is
   one self-contained HTML file with bundled workers, DSP, Stacks reconstruction
   code and third-party licence notices. Each sound has an independent SHA-256.
   Duplicate audio is included once. Existing chain sources can be reused.
2. An `audionaut-chain-song/1` JSON document containing the editable musical
   instructions and an explicit `audionaut-chain-manifest/1`. Every dependency
   identifies its network, contract, inscription ID, byte length, media type and
   whole-payload SHA-256. The runtime also has a version identifier.

The whole-payload SHA-256 is separate from Xtrata's rolling chunk hash. The
standalone player verifies both the protocol reconstruction and the manifest
bytes. Gateway URLs are transport choices, not sound identities.

Use **Prepare dependencies**, save/download the publishing draft, and review
the dependency inscriptions through the existing Create/Wizard flow. Enter
confirmed inscription IDs, then **Verify and prepare song**. Only a successful
read and byte verification enables a publishable instruction file. Publishing drafts and confirmed IDs are saved in a separate browser database;
changes to the song invalidate verification, while matching dependency IDs survive
re-preparation. **Review song
inscription** opens the usual explicit cost and wallet review. Nothing in this
feature signs, funds or broadcasts transactions automatically.

WebKit may reject Blob/File storage used by the shared wizard handoff. In that
case beta-pro preserves the draft, explains how to download/extract the dependency
package (or download the instruction JSON), and offers an explicit manual-upload
review link. The original shared routing and other AudioNaut editions are unchanged.

The strict chain export rejects missing/local-only dependencies, unknown resource
locators, mixed networks, malformed IDs, conflicting identities, corrupted bytes
and unsupported runtime builds. Older onboard sample packs are collected as
audio dependencies; their presence on the website is not mistaken for inscription.
Validated historic clip provenance remains inert metadata, while the actual
playable audio is bound separately.

Ordinary portable project exports continue to work as before. The new chain
format is an additional publishing option. New devices are not promised to open
in older AudioNaut editions; beta-pro continues to import supported older songs.

## Standalone reconstruction

Run `npm run build:audionaut-beta-pro` to build the gated page and reproducible
`chain-runtime/player.html` plus its byte/hash manifest. These generated files are
ignored by Git and recreated during site builds. The build fails if a bundled
dependency lacks its redistribution notice.

The player can load an instruction file or reconstruct that file from a supplied
chain reference. It talks to a configurable Stacks API endpoint and needs no
Xtrata website, sound CDN, wallet or local asset cache. The currently executing
runtime script must exactly match the script in the verified pinned runtime;
sharing a version label is insufficient. Classic self-contained workers support
downloaded `file://` playback as well as hosted playback. When using a gateway,
request the unmodified runtime (`raw=1` on Xtrata runtime-content routes); a gateway
that rewrites its executable script cannot satisfy the exact-code check.

Actual inscriptions remain a separate, user-reviewed step. A build manifest's
`prepared-not-inscribed` status must never be represented as an on-chain receipt.

## Verification and remaining roadmap

Focused suites cover the new instruments/effects at 44.1, 48 and 96 kHz in
Chromium, Firefox and WebKit; live audio/cleanup; sample mappings; limiter
measurements; IR transactions; export tails; old sampler velocity formats;
chain parser/cache/transport failures; and isolated cold-player reconstruction.
The cold reconstruction tests use simulated read-only RPC responses, never
wallet signing or paid inscriptions. Existing compatibility, recovery, export,
gate and endurance tests remain in `tools/pro-suite.mjs`.

Recorded piano libraries, additional drum layers/outputs, EQ spectrum/M-S tools
and the other fourteen roadmap devices remain future stages. Any added sample
library must be suitable for redistribution in the intended inscription package,
and all playback bytes/code must be captured in its immutable dependency graph.
