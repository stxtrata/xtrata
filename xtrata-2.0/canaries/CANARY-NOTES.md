# Writing a launch canary: notes for agents

A canary is a single-file browser page the owner opens with their wallet. It does one on-chain
launch step by step, checks each step, and can be re-run safely. These notes are the things that
have been missed before. Read them before writing or changing one. Add to them when you learn
something new.

## Inscribing: use the fewest transactions

The Xtrata core (`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3`) has two routes.

| Route | Calls | Use when |
|---|---|---|
| One transaction | `mint-single-tx`, `mint-single-tx-recursive`, `mint-single-tx-with-relationships` | The file is at most 32 chunks of 16 KB (512 KB) |
| Staged | `begin-or-get`, then `add-chunk-batch` (up to 30 per tx), then `seal-inscription` / `seal-recursive` / `seal-with-relationships` | The file is over 32 chunks, or an upload session is already half done |

- **Default to the one-transaction route.** It is one wallet signature instead of three or more.
  `mint-single-tx-with-relationships` takes the same `dependencies` and `parents` lists as
  `seal-with-relationships`, so a file that needs "child of #N" or dependencies still fits.
- Arguments of `mint-single-tx-with-relationships`: expected hash (32 bytes), mime, total size,
  list of chunks (max 32), token-uri, dependencies (max 50), parents (max 50).
- The expected hash is the chain hash: start from 32 zero bytes, then `sha256(previous || chunk)`
  for each 16 KB chunk. It is not the plain sha256 of the file.
- Quote the fee before signing: `quote-single-tx-fee(size, chunks)` returns `total-fee`
  (mainnet: 0.01 STX plus 0.001 STX per chunk). The staged route uses `quote-staged-fee`
  (`begin-fee`, `seal-fee`). Put the quoted total in a deny-mode post-condition as a "send at most"
  limit, and count it in the preflight balance check.
- Keep the staged route as a fallback so a re-run can resume a half-finished upload
  (`get-upload-state` is not none) and so files over 512 KB still work.
- Never describe the cost as "3 signatures per file" in docs or UI unless the staged route is
  really used. State the real count per route.

## Re-runs must be safe and catch up

- A canary may be used in an earlier session or an older build, then re-run from empty. Every step should
  recognise from the chain that its work is done and send nothing. Do not rely on local progress. In
  particular, a step that "opens" something must not reopen it after a later step has closed it.

- Before sending anything, look the file up by its chain hash (`get-id-by-hash`) and check that it
  is sealed. If it is, re-use it and send nothing.
- After every transaction, wait for the chain to show the result (poll the read-only function or
  `/extended/v1/tx/<id>`), not for the wallet's reply. Wallets return a txid before the block.
- Check who inscribed it. If another address sealed identical bytes, say so; do not claim it.
- Every step reports `pass` / `fail` with a plain sentence the owner can paste back to us.

## Many owner-only calls (26 boards, 25 seed batches, anything over about 4 signatures)

**Default to this method whenever a launch needs more than a handful of calls that only the contract owner can make.**
A wallet prompt per call does not scale (the arcade boards needed 26; seeding a 2,500-token Forever Twins helper needs
25 batches of 100). Worked examples: `arcade-launch` (`propose-owner` / `accept-owner`) and `forever-twins-launch`
(`propose-ownership` / `accept-ownership`, steps `tempwallet`, `handover`, `seed`, `handback`).

A throwaway wallet cannot sign owner-only calls, so hand it ownership for the run:

- The canary creates a temporary wallet in the browser. The owner `propose-owner`s it, it `accept-owner`s, it signs
  everything, then it proposes back and the owner accepts. The owner signs about 4 times (fund, propose, accept back,
  plus any one-way step such as finalise) however many calls there are. Check that the contract has a two-step owner
  transfer before relying on this, and which function names it uses.
- Keep the one-way or high-stakes calls (finalise, anything irreversible) with the owner's own wallet, after hand-back.
- Save the temporary key to a file and ask for confirmation before the hand-over. If a contract has no other
  admin, losing that key loses the contract. Say in the step text what the key could do while it owns the contract
  (for the helper: seed, set the fee up to its ceiling, propose a rescue that the owner can cancel).
- Read progress from the chain (`get-owner`, `get-pending-owner`, the records or boards themselves), never from page
  state alone, so every phase can resume. Give the owner a recovery button that hands ownership back from any point,
  and a button that saves the key file again.
- **Resume from whatever is on chain, whoever put it there.** Work out what is still missing from the chain, then batch
  only that, in the chosen batch size. Do not assume earlier batches used the same size or even the same wallet. For
  ordered data, three reads (first present, last-expected present, next missing) prove "the first N are done"; anything
  else falls back to reading every item.
- A failed transaction still costs its fee. After a stop the float is usually short, so the hand-over step must top it
  up (ask the owner for exactly the shortfall), not refuse.
- After the last call, clear any pending hand-over to the temporary wallet and sweep its balance. The hand-back step
  must also succeed when ownership is already back (send nothing).
- Send the calls one after another and wait for each to confirm. Stacks allows about 25 unconfirmed
  transactions per sender, so do not pipeline a long list without batching.
- Price each temporary-wallet transaction from its real serialised size (a 100-record seed is about 20 KB; use at
  least twice the size in micro-STX, with a floor of 0.02 STX) and size the float as calls x fee + hand-over + hand-back +
  sweep + margin.
- Xverse cannot sign a plain STX transfer from a page: fall back to showing the address and amount, and wait for the
  balance to arrive.
- Test it in the mock: raw transaction broadcast from the temporary key, an interrupt halfway (a forced on-chain
  failure), recovery with the hand-back button, a resume that sends only what is missing, a start from pre-seeded
  state with a different batch size, and a second run from empty progress that sends nothing.

## Wallet and transactions

- Pass post-conditions in deny mode. For fees, "send at most X". For a score entry fee, "send
  exactly X". Never allow open-ended transfers.
- Do not send a `sender` field to wallets. Send bare-hex Clarity arguments.
- Xverse and Leather expose different providers. Offer a chooser when both are installed.
- Fund and sweep any throwaway wallet a test uses, and report its final balance.

## Pinning and releases

- The build script pins the exact release (`PINNED_RELEASE`). A changed pack or shell changes the
  pin: rebuild, read the printed sha256, set it, rebuild again.
- Inscribe only what changed. Unchanged packs are found by hash and re-used.
- Parts the canary does not inscribe must be verified on chain before it relies on them.

## Testing

- Every canary has a mock-chain test (`mock-chain-test.cjs` in `arcade-launch` is the model). When
  you add a contract function to the canary, add it to the mock in the same change, with the same
  argument order and error codes as the real contract, or the test proves nothing.
- The mock must run the whole thing twice: once from empty, once after forgetting local progress.
  The second run must send nothing and pay nothing.
- Check the real contract's functions first, not memory or old canaries:
  `https://api.hiro.so/v2/contracts/interface/<address>/<name>` lists every public function and its
  arguments.

## Docs

- State the signature count and the STX cost per step in the README, and keep them true when the
  route changes.
- End the canary with an "audit" step that lists the repo and site edits still to make (redirects,
  tiles, id lists) so nothing is forgotten after the launch.

## Learned on the arcade v2 launch (`arcade-v2-launch`)

### Deploy and build from the wallet that will own it

- Read the contract's ownership model before choosing who deploys. `xtrata-world-v2` makes the deployer the root owner and
  the treasury, and a space belongs to whoever is named at creation; handing root over later leaves the new owner unable to
  build in the deployer's spaces, and moving a space bumps its epoch (scheduled states and grants drop). So the canary pins the
  final owner per network, refuses any other wallet at preflight (and in every sending step), and explains why in the UI.
- End with an ownership step that reads every role back: owner, pending owner, treasury, admins, fee recipients, publishers.
  An admin map cannot be listed; check every address the contract's `admin-set` events ever named (Hiro's
  `/extended/v1/contract/<id>/events`) plus the addresses the canary itself used.

### A temporary admin instead of 24 prompts

- When the owner-only calls have a narrow admin role (here `set-admin … u2`, KINDS only), give the temporary wallet that role
  instead of the whole contract: fund it, `set-admin`, it signs, `set-admin … u0`, sweep. Three owner signatures instead of 24,
  and the owner can remove the role at any time without the temporary key. Say what the role can do while it is held, and what
  it leaves behind (each kind records the temporary wallet in its `owner` field).

### Replay a planner, do not re-derive it

- When the ops tools already plan the calls, bundle their pure planner into the page (`ops/lib/v2-plan.mjs` has no imports)
  and replay its list. A local copy drifts. If the planner predicts ids (a shared `next-id` counter), judge every planned call
  against the chain before sending, and stop if something is on chain under an id the plan did not predict: the later
  arguments would point at the wrong objects. Before each id-taking call check the counter is where the plan expects it
  (`get-kind-count` for kinds). Finish with the planner's own read-back (`verifyManifest`).
- Use the contract's light reads. A node caps a read-only call at about 30 map reads; a full `get-objects` page is 32.

### Pins that are a one-line update

- Keep every pin in one table, one line per pin, and make the build print the exact replacement lines when a pin is stale (and
  all of them with `--print-pins`). A contract change is then: rebuild, paste, rebuild.

### Test against the real contracts

- `@stacks/clarinet-sdk` simnet deploys contracts at any address, mainnet ones included (`deployContract(name, src,
  { clarityVersion }, 'SP…')`), so the mock chain can run the real core, the leaderboard and the new contracts at the exact
  ids the canary uses. Use an empty Clarinet project and deploy everything from the test. Mute `console.log` / `stdout` around
  simnet calls: it prints every Clarity `print`. Ids are whatever the chain hands out, so recreate mainnet ids with the core's
  one-time `set-next-id` and filler inscriptions (3,000 mints take a few seconds).
- Make the core's fee recipient someone other than the signer in the mock, or "send at most" post-conditions never see STX.
  Check every call's STX events against its post-conditions in deny mode.
- Run the testnet rehearsal in the mock too, from an empty chain. It found that the arcade engine only pilots mainnet-form
  addresses (a testnet run must be flown as the key's mainnet form; the leaderboard checks only the hash160), and that the
  recursive parent is a mainnet artifact (it hard-codes the mainnet core and API), so a testnet boot check must point those
  reads at the testnet core.

### Testnet needs its own fixtures

- A fresh testnet core has none of mainnet's inscriptions. Make the canary create what the release depends on (the bundle,
  read from mainnet's own copy and used only if it hashes to the pin, and a stand-in for the parent inscription), find each by
  its chain hash on a re-run, and never offer those steps on mainnet. The core itself needs the testnet SIP-009 trait and the
  two older contracts it reads, deployed first, at Clarity 3 (`as-contract` is gone in Clarity 4).

### A headless runner shares the engine, not the page

- Keep the steps in a module with no DOM and pass the page's abilities in (wallet, file save, confirm, the browser-only checks).
  A Node runner then supplies a key-file signer and runs the same steps; steps that need the page (anything that flies a run in
  the embedded arcade, and everything gated on it) are marked and refused by the runner.
- Testnet only, behind the ops guard (`--execute`, `XA_OPS_CONFIRM`, a key that is not the admin's, no KILL file), checked
  again before every transaction. Refuse mainnet before reading anything.
- `@stacks/transactions` v6 cannot build a Clarity 4 deploy ("Cannot recognize ClarityVersion: 4"); a wallet does it for the
  page, but a key-file signer must use v7 (as the ops tools do). The runner test found this; test the runner too, with `fetch`
  answered by the same mock chain.

## Inscribing files you own, with zero wallet prompts (`somewhere-else-inscribe`)

When a job is "inscribe N files, some of which embed the IDs of the others, then hand them over", do not ask the owner to
approve N transactions. The page creates a temporary wallet, the owner funds it once by hand, the wallet signs every
`mint-single-tx` and `transfer`, and the page finishes by sweeping the leftover STX to the owner. The owner signs nothing
in the page and the only wallet action is one plain send. Worked example: `canaries/somewhere-else-inscribe`.

- **The chain is the memory.** Look a file up with `get-id-by-hash` (rolling hash) before every mint; found means reuse it
  (after checking size, mime and sealed), never re-send. Anything that depends on earlier IDs (an article that embeds image
  IDs, a reader pinned to the article's hash) is rebuilt from the chain by a pure function, so "Forget local progress" and a
  cleared browser still resume. Pending transactions are remembered by label and waited on after a reload instead of re-sent.
- **Build order is dictated by the hashes**: images, then the document that carries their IDs and hashes, then the loader
  that is pinned to that document's ID and hash. Each is one `mint-single-tx` (at most 32 chunks, 512 KB).
- **Deny-mode post-conditions on everything.** A mint carries one STX `LessEqual` condition equal to the live
  `quote-single-tx-fee` total; a transfer carries one NFT `Sends` condition for that id. A wrong fee or a wrong id aborts
  instead of overpaying or moving the wrong token.
- **Miner fee from the real size**: the serialised transaction length x the network floor of 1 micro-STX per byte x a
  multiplier (default 1.5; live uploads have run 1.0x to 2.9x the floor), minimum 5,000 micro-STX. Do not use
  `/v2/fees/transfer` for this: it is the per-byte rate for plain transfers (24 on 2026-10-29) and would overprice a 226 KB
  mint 24 times. `/v2/fees/transaction` cannot take a body over 1 MiB, so big transactions are priced from their size.
  Broadcast large transactions to Hiro directly first; the proxy is the fallback.
- **Funding target** = miner fees + protocol fees + hand-over + sweep, plus 15% and 0.1 STX, recomputed for what is
  *left* (zero when everything is done). While minting keep a tail back (about 0.14 STX) so the hand-over can always be paid.
  If the balance runs short mid-run the page shows exactly how much more to send and waits.
- **Say what the chain will record**: the creator of every inscription is the temporary wallet; only the owner field moves.
- Owner address: typed twice, validated with the C32 checksum, confirmed in a dialog, optionally baked in at build time
  (`--owner`). Recovery buttons: send everything to the owner now, save the key again, restore a key, forget pending
  transactions, forget local progress, export report.
- Mock test (`mock-chain-test.cjs`) covers: two-stage funding, re-run after forgetting progress sends nothing, a rejected
  broadcast, a transaction left pending across a reload, rescue after an interruption, a corrupted chunk on read-back,
  an identical file already on chain from someone else, owner validation, a tampered asset refused at build.
