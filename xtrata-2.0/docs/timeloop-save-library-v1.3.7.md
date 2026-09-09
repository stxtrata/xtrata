# Timeloop v1.3.7: wallet checkpoint library and funded verification

The Timeloop game now has a separate Save / Load dialog with an always-available
entry point, automatic wallet checkpoint discovery, latest-found selection,
historical checkpoints, and JSON/manual inscription tools under Advanced.
The standalone game remains a separately inscribed artifact; this deployment
only adds the corresponding narrow viewer bridge support.

## Live viewer change

- Add the read-only `xtrata_listGameSaves` bridge method. It reads ten Xtrata
  holdings per page for the connected wallet, then filters candidates using
  their publishing wallet, current NFT owner, JSON schema and content hash.
- Return a continuation cursor for larger histories. The game labels the
  newest discovered token as “Latest found”; indexer ordering is not treated as
  proof that the entire wallet has been searched.
- Require both the original creator and the current `get-owner` result to
  match the connected wallet. Recheck ownership after reading the chunks and
  preserve the existing preview/session guards across all asynchronous work.
- Propagate network failures instead of claiming a wallet has no saves.
- Reject STX self-transfers before wallet approval. Stacks mainnet rejects them;
  the old optional memo flow cannot succeed. The v1.3.7 game shows the save
  contract publisher as the recipient of its optional 1-microSTX memo transfer,
  requests a 3,000-microSTX mining fee, and still requires explicit approval.
- The game no longer offers arbitrary ID or pasted-file restoration. Manual
  JSON publication is still supported; after publication the checkpoint is
  discovered and loaded through the same ownership checks. Ordinary local
  browser autosave remains available where the viewer permits storage.

The ownership rule is enforced by the official viewer, not encryption or DRM:
inscribed JSON remains public blockchain data.

## Scope and compatibility

No smart contracts, contract configuration, café payment recipients, mint pricing,
general inscription flow, grid layout, wallet selection, or unrelated apps are
changed. Discovery reuses the existing wallet holdings reader. Save publication
remains pinned to `SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`,
using `mint-single-tx-recursive`, a 512 KiB publication maximum and original game dependency
#3040. The new artifact retains case/save schema version 1.3.5 compatibility.
Owned manual backups up to 4,000,000 bytes load through four-chunk batch reads,
with the same integrity and ownership checks.
Existing v1.3.6 direct saves remain usable; its immutable UI is not rewritten.

Only viewer source, targeted tests and these text notes belong in this commit.
Game artifacts, local QA fixtures, wizard configuration and media remain outside
the commit. The other agent's X-Chess working changes are untouched.

## Real funded mainnet round trip — 9 September 2026

Only Archivist (`SP1MDNJ5G13C9S3GN4V5AZPN7H68H4ZG9VKG251KM`) signed.
The signer used the existing wizard CLI with an explicit nonce, spend ceiling,
1 STX reserve and a transaction journal written before broadcast. No personal
wallet extensions were connected. The UI recovery host used the public wizard
identity and real chain reads with signing disabled.

| Operation | Result | Cost |
| --- | --- | --- |
| Café purchase | Confirmed at block 8951804 | 1 STX + 0.003 STX fee |
| Checkpoint inscription | Confirmed #3044 at block 8951810 | 0.011 STX protocol + 0.030 STX fee |
| Original memo self-transfer | Rejected by node; no fee charged | 0 |
| Corrected optional memo | Confirmed at block 8951842 | 0.000001 STX + 0.003 STX fee |

Actual total: **1.047001 STX**. Balance: **4.271 → 3.223999 STX**.

- Café transaction: `0x1fd295b8ad63826870186519f5e6b8a4ec1bce62f723473127ef18c904063539`
- Save transaction: `0xb6d01f72b2e9e7c14ebf320de7f24448199eb6252171075a2213729c418040c2`
- Memo transaction: `0xb6804db0233d99a053212111fdd5c68e452fdc636d04b2642a7324ee72a12445`
- Save: https://xtrata.xyz/i/3044
- Save running hash: `107a104e2906f5649b491db4f382f50ef0be09eb2b712a0be03de447bc53db3a`
- Exact save size: 867 UTF-8 bytes, one chunk.

Verified byte-for-byte reconstruction, full game-state equality (world,
knowledge, linked notes, settings, café receipt), dependency #3040, duplicate
publication without another charge, rejection under another wizard identity,
and real API café receipt recovery/history search. The new library discovered
#3044 automatically among Archivist's seven holdings. Browser restoration
returned the game to 08:15 and displayed its Security note and café receipt.

The funded checkpoint was generated with the game serializer and published by
the actual production save service using a wizard signing adapter. This is not
a claim to have tested a personal Xverse/Leather extension signing dialog.

## Validation

- Viewer/wallet/client regression suite: 265 tests passed.
- Final save/bridge focused suite: 43 tests passed, including a backup larger than
  the publication limit and incomplete batch rejection.
- Host production build, including prebuild/postbuild: passed.
- Game suite: 124 tests passed, including historical selection, wallet changes,
  ownership failures, uncertain submissions, no second payment, JSON byte
  preservation and opaque-viewer recovery state.
- Game typecheck and standalone production build: passed.
- Desktop and 390px mobile browser checks; no console warnings/errors observed.
- v1.3.6 standalone SHA-256 remains
  `a9b3ccb3e9134beb766444f9f199a85f4378e2174aaeccc2dc672283ed8c0db9`.

The repository-wide TypeScript command still reports the existing Vitest
`ExpectStatic` declaration conflicts and existing sponsored-option diagnostics.
No new production source diagnostic was found in the changed viewer modules.
