# Player awards: a framed record every player can claim (plan)

Status: plan only, written 2026-11-12. Nothing here is built or deployed. It needs a new contract (Jim deploys it), a
new action in the wallet box (its own security review) and five pieces of art. It does not block the 1,000-player
giveaway: players claimed before this ships can claim their award afterwards.

## What the listener gets

Every starter player can claim one award: a framed record in its class (Diamond, Gold, Silver, Bronze, Classic) with
its own number from the wall, for example "Gold record · Player No. 0412". It is an NFT held by the player itself.
Claiming it is one button in the player and costs about the same as one play.

## Why a small contract of its own

Minting each award as an Xtrata inscription costs about 0.102 STX (single-tx fee 0.1 STX plus 0.002 per chunk, from
the contract source defaults). A Classic player holds 0.0205 STX. A dedicated contract makes a claim an ordinary
cheap call, with no protocol fee, so every class can afford it out of the plays it already has.

The art still lives on Xtrata: five master records are inscribed once, and each award points at the master for its class.

## The contract: `xtrata-music-awards-v1`

A standard NFT (SIP-009) with one public claim function.

- `claim (drop uint) (class uint) (number uint) (signature (buff 65))`
  - The award goes to whoever calls it (`tx-sender`).
  - It checks a signed note from the Xtrata server saying "this address won this class, with this number, in this
    drop". The contract holds the server's public key and rejects anything not signed by it.
  - One award per number per drop, and one per address per drop.
  - It records the drop, class and number against the new token and prints an event.
- Read-only: `get-owner`, `get-last-token-id`, `get-token-uri`, `get-award (id)`, `get-award-of (drop, address)`,
  `get-claimed (drop, number)`.
- `get-token-uri` returns the address of the master record for the token's class (set per drop and class by the owner).
- Owner only: `set-signer` (replace the server's key), `set-class-uri`, `set-paused`, `transfer-contract-ownership`.
- No fee and no STX movement in the contract. The claimer pays only the network fee.

A "drop" is a number (1 = the 1,000-player giveaway), so later giveaways and milestone awards reuse the same contract.

### How the contract knows the class

The server already knows which address claimed which wall spot and what that spot held. When the player asks, the
server signs `{drop, class, number, address}` with a key that does nothing else. The contract verifies the signature
(`secp256k1-recover?` over the hash of the consensus encoding of that tuple).

That key signs notes only. It holds no funds and cannot mint by itself: a note is only good for the one address it
names. If it leaked, someone could claim awards they did not win, but no money is at risk, and `set-signer` replaces it.

## The pieces

| Piece | What | Who |
|---|---|---|
| Art | Five framed records as self-contained HTML, shown first in the player and on the wall | Claude builds, Jim approves |
| Masters | Inscribe the five on Xtrata (five ordinary inscriptions) | Jim |
| Contract | Write, test in simulation, deploy to testnet, then mainnet | Claude writes and tests; Jim deploys |
| Server | `GET /radio/award?wallet=…` returns the signed note for a claimed starter player; new secret `RADIO_AWARD_SIGNER` | Claude builds; Jim sets the secret |
| Wallet box | One new action, "claim award": fixed contract and function, arguments checked, shown to the listener before signing | Claude builds; separate security review; Jim redeploys the box |
| Player | "Claim your Gold record" on the landed screen and in "Make it yours"; afterwards the framed record shows on every return, with a link to see it on-chain | Claude |
| Wall | A claimed disc's panel shows the framed record once it has been claimed | Claude |

Unchanged: the passkey derivation labels and settings, the plays and likes contracts, the wallet box's CSP,
frame-ancestors and arming delay. The wallet box still never trusts xtrata.xyz: it signs the claim only for the fixed
awards contract and shows what it is signing.

## Cost

- Per claim: one contract call. Estimated network fee 300 to 500 microSTX (about one play). To be measured.
- One-off: five master inscriptions, one contract deployment.
- No float, no hot wallet holding funds or NFTs.

## Decisions for Jim

1. **Can an award be moved?** Standard NFTs can be transferred. Options: transferable like any NFT, or fixed to the
   player that won it (a trophy). Recommended: fixed for now, since the wallet box has no "send an NFT" action anyway.
2. **Free to claim at once, or earned?** For example "play 10 songs to unlock your record". The server can hold the
   note back until then; the contract does not need to know.
3. **Who may deploy and own the contract** (which wallet), and which wallet inscribes the masters.
4. **Where "see it on-chain" leads.** A standard NFT shows in Stacks wallets and explorers. The Xtrata explorer shows
   Xtrata inscriptions, so it would need a small addition to show awards.

## Order of work

1. Design the five records; show them in the player and on the wall (no chain needed). Jim approves the look.
2. Contract and its tests in simulation. Measure the fee.
3. Server note endpoint, with tests. Wallet box action, with its review.
4. Testnet run end to end with a disposable player.
5. Jim: inscribe masters, deploy, set the signer secret, redeploy the wallet box. Switch on the Claim button.
