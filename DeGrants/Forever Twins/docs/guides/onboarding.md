# Onboarding a collection

*Draft of the Milestone 1.5 onboarding documentation. For collection teams and community members
proposing a collection.*

## Eligibility

A collection can use the standard helper if:

- its mint has **finished** (tokens minted later are not covered)
- every token's art is **512 KB or smaller**
- its contract's `transfer` requires the current owner, `get-owner` is read-only, and nothing
  can move a token out of the helper without the helper's signature (profile tier S)
- the art can still be obtained, from the original host or a verifiable backup

If the contract has its own marketplace (`list-in-ustx` / `buy-in-ustx`), it uses the G2
template, which adds a listing guard. Collections that don't fit need an adapter and are handled
case by case.

## What we need from you

- Contract address and a link to the collection
- Where the art and metadata are hosted today
- Any original art files or backups the team holds
- A community contact for announcements and questions

## What happens

1. **Screening**: we run our checks on the contract and confirm the group (G1 or G2).
2. **Manifest**: we fetch every token's art, record its fingerprint, file type and size, and
   publish the manifest.
3. **Deploy and seed**: we deploy the helper and load the record.
4. **Review window**: the manifest is public before finalisation so the community can check it.
5. **Finalise**: the record is locked for good.
6. **Launch**: the collection appears in the registry and on the preservation page.

## After launch

- Holders create twins and swap whenever they like; nothing expires.
- The fee is shown on the page and in the contract (`get-fee`).
- Please share the "never send your NFT directly to the helper" warning with your community.
