# Standing up a testnet Xtrata for the milestone 1 lifecycle proof

Checked 17 August 2026. Short answer: yes, it is easy, roughly half a day, and most
pieces already exist. But read section 3 first, because there is a better option for
the milestone evidence specifically.

---

## 1. What already exists

| Piece | Where | State |
|---|---|---|
| `[TESTNET]` trait pair in the core | `contracts/drafts/v3.2.4/xtrata-v3.2.4-candidate.clar:40-42` | Written, commented out, ready to uncomment |
| SIP-009 trait definition | `contracts/clarinet/contracts/sip009-nft-trait.clar` | 507 bytes, deployable as is |
| A test source collection | `contracts/clarinet/contracts/mock-ipfs-collection.clar` | 84 lines, SIP-009, IPFS token URIs, `mint (id recipient token-uri)` so you control every field |
| SDK deploy script | `scripts/mainnet-deploy-contract.mjs` | 280 lines, per-contract Clarity version pinning, `--broadcast` flag |
| Deployment order | `contracts/drafts/v3.2.4/steps.json`, phase T | T1 to T4 already spell it out |
| Testnet itself | `api.testnet.hiro.so` | Alive, tip height 97,469 |

`mock-ipfs-collection` is the important one. It is exactly the source collection a twin
helper needs: ordinary SIP-009, real IPFS URIs, and you can mint any token id to any
recipient with any URI. Nothing new has to be written to have something to twin.

---

## 2. The gotchas, in the order you would hit them

**1. The `[TESTNET]` trait address does not exist.** The commented line points at
`ST1NXBK3K5YYMD6FD41MVNP3JS1GABZ8TRVX023PT.nft-trait`, which returns 404 on the current
testnet for both the interface and the source endpoint. Testnet resets wipe deployed
contracts and that address is from a previous era.

Fix: deploy `sip009-nft-trait.clar` yourself as your first testnet transaction, then
point the `[TESTNET]` lines at your own testnet address. Ten minutes once you know. An
afternoon of confusion if you meet it cold with a failing 1,811-line deploy.

**2. The deploy script is mainnet-only.** It imports `StacksMainnet`, signs with
`TransactionVersion.Mainnet`, and reads `XTRATA_MAINNET_*` environment variables. The
structure is clean and the contract registry already carries a per-contract
`clarityVersion`, so this is a contained change: add a network flag, swap the network
class and transaction version, and rename the env lookups. Call it 30 lines.

**3. Deploy with Clarity 3, from the SDK, never from a wallet UI.** T1 is explicit about
why: the wallet forces Clarity 4, and under Clarity 4 the `as-contract` call in the
migration path does not resolve. The script already supports pinning, so this is a flag,
not a problem. Same trap recorded in the deployer-derivation notes.

**4. Fee unit updates are bounded.** Each change must be at most double and at least a
tenth of the current value, so moving testnet fees to the mainnet targets takes several
calls rather than one. Not hard, just more transactions than expected.

**5. Testnet STX.** An 1,811-line contract deploy is not free. The mainnet script
defaults to 750,000 microSTX for a deploy fee. Budget from the faucet accordingly and
request before you start rather than mid-sequence.

**6. Testnet gets reset.** This is the one that matters for the milestone. A testnet
contract id is not durable evidence. If testnet resets in October, the artefact named in
milestone 1 has evaporated and the reviewer in November has a dead link.

**7. The core cannot be deployed to testnet on its own.** Found while testing the
deploy script, and it is the largest single cost in this whole exercise.

The v3.2.4 candidate references three predecessor cores by same-deployer principal, in
its `migrate-from-*` functions:

```
.xtrata-v1-1-1   (10 references)
.xtrata-v2-1-0   (10 references)
.xtrata-v3-2-3   (11 references)
```

Clarity type-checks those at deploy time, so **every one of them must already exist at
the deploying address or the deploy aborts during analysis.** On mainnet that is
invisible, because the production deployer holds all three. On testnet the address holds
none of them.

The full chain, verified: `xtrata-v1-1-1` has no dependencies, `xtrata-v2-1-0`
references v1-1-1, `xtrata-v3-2-3` references v1-1-1 and v2-1-0, and v3-2-4 references
all three. So a faithful testnet core means **four large contract deploys in strict
order**, each with the trait pair toggled, each around 1,600 lines.

The deploy script now surfaces this as a "Requires first:" line during preflight rather
than letting you discover it from a failed broadcast.

Three ways to handle it:

- **Deploy all four.** Faithful, and it is what the cutover's phase T eventually needs
  anyway. But it is four deploys and a chunk of faucet STX before you can twin anything.
- **Deploy a stripped testnet core** with the migrate functions removed. Deploys
  standalone and exercises exactly the surface a twin helper uses, which is
  `quote-single-tx-fee`, `mint-single-tx` and `transfer`. Fine for rehearsing the twin,
  useless for rehearsing the migration.
- **Do the twin proof on mainnet instead**, per section 3, where v3-2-3 already exists
  and the dependency chain is somebody else's solved problem.

**The twin helper never touches the migrate path.** It calls three functions, none of
them migration. So for milestone 1 specifically, the whole dependency chain is avoidable
work.

---

## 3. The better option for the milestone evidence

**You do not need v3.2.4, and you do not need testnet, to prove the twin lifecycle. The
mainnet core is live and unpaused right now.**

`SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3` responds on its interface
endpoint and its last `set-paused` call set it to `false` in June. So the full lifecycle
can be proven on mainnet, today, against the real core:

1. Deploy `mock-ipfs-collection` to mainnet under a clearly named contract, for example
   `xtrata-twin-testbed-v1`.
2. Mint three to five tokens pointing at real IPFS art.
3. Deploy a twin helper pinned to `xtrata-v3-2-3` and the testbed collection.
4. Seed canonical, finalise, inscribe, swap out, swap back.

**Cost.** The protocol fee is 10,000 + 1,000 per chunk microSTX, so a single-chunk mint
is 0.011 STX. Two contract deploys plus roughly ten transactions. Two to five STX all
in, including miner fees at a sane rate.

**Why this is better for a milestone artefact**

- **Permanent.** A mainnet contract id and transaction ids still resolve in November,
  and in 2030. That is what the evidence is for.
- **No cutover dependency.** It proves the template against the core that exists rather
  than one that does not, so milestone 1 stops being coupled to unpaid work.
- **More convincing.** "Here is the escrow invariant holding on mainnet" is a stronger
  claim than the same sentence about a testnet that may no longer exist.

**The cost of doing it this way.** It leaves a throwaway mock collection on mainnet
permanently. That is untidy. Mitigate by naming it unambiguously as a testbed, listing
it in the registry as such, and saying in the docs what it is for. Nobody is misled by a
contract called `xtrata-twin-testbed-v1`.

---

## 4. Recommended: do both, for different jobs

**Testnet is for iteration.** Free, disposable, and where you will get the seed and
finalise sequence wrong the first few times. `finalize-canonical` is irreversible, so
rehearsing it somewhere consequence-free is worth real money. Build the testnet
environment first and break things in it.

**Mainnet is for the milestone artefact.** One clean run, permanent transaction ids,
cited in the blueprint evidence.

That split also matches how the cutover plan already treats phase T, which exists to
rehearse rather than to produce deliverables.

---

## 5. Blueprint wording change

Milestone 1 currently names "a testnet twin contract id that has been through the full
lifecycle". Given the reset risk, change it to allow the stronger artefact:

> A twin contract that has been through the full lifecycle of seed, finalise, inscribe,
> swap out and swap back, with the contract id and every transaction id published.
> Rehearsed on testnet and evidenced on mainnet against the live core.

Same work, better evidence, and it removes a dependency on a network that periodically
deletes itself.

---

## 6. Ordered setup, once decided

The deploy script now takes `--network`, so the tooling side is done. Mainnet
behaviour with no flags is unchanged.

**Testnet environment, for iteration**

1. Request testnet STX from the faucet for the deployer address. Budget for four to
   five deploys at 0.75 STX each if you take the faithful route.
2. Deploy the trait and note the address it lands at:
   ```bash
   node scripts/mainnet-deploy-contract.mjs sip009-nft-trait --network testnet --broadcast
   ```
3. Point the `[TESTNET]` trait lines in the core at that address and uncomment them.
   Comment out the `[MAINNET]` pair. Preflight fails loudly if you forget either half.
4. Decide the core route from gotcha 7: all four cores in order
   (v1-1-1, v2-1-0, v3-2-3, v3-2-4), or a stripped core without the migrate functions.
   ```bash
   node scripts/mainnet-deploy-contract.mjs xtrata-v3-2-4 --network testnet --broadcast
   ```
5. Set the five fee units, in several calls each if the bounds require it.
6. `set-paused false`.
7. Deploy the source collection and mint a few tokens with real IPFS URIs:
   ```bash
   node scripts/mainnet-deploy-contract.mjs mock-ipfs-collection --network testnet \
     --trait-deployer ST<your-testnet-address> --broadcast
   ```
8. Deploy the twin helper pinned to the testnet core and that collection.
9. Run the lifecycle. Break it, fix it, run it again. This is what testnet is for, and
   `finalize-canonical` being irreversible is why rehearsing it matters.

**Mainnet evidence run, for the milestone artefact**

10. Deploy the testbed collection under a name that says what it is:
    ```bash
    node scripts/mainnet-deploy-contract.mjs mock-ipfs-collection \
      --as xtrata-twin-testbed-v1 --trait-deployer SP<deployer> --broadcast
    ```
11. Deploy the twin helper pinned to `xtrata-v3-2-3` and the testbed.
12. One clean lifecycle. Record every transaction id.

Steps 1 to 6 are the T phase of the cutover plan, so that part is not grant overhead.
It has to happen for the core migration regardless. Steps 10 to 12 are the only ones
milestone 1 actually depends on, and they need none of the rest.
