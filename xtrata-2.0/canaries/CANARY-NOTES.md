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

## snes-catalogue (added 2026-10-09, build v1)
- Temporary-wallet float must cover every call it signs, including the refusal probes, hand-back, stranger step and sweep (`callsFor`); an early version under-counted and needed two top-up transfers.
- Temporary-wallet transactions (sweep included) use the 0.02 STX fee floor; the mock node rejects anything lower.
- `get-chunk-batch` returns a plain list, `mint-single-tx` returns `(ok {existed, token-id})`, and the admin is not automatically a publisher.
