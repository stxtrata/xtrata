# Preserve Your Collection

*Draft of the Milestone 1.4 guide. For holders and collection communities.*

## Is my collection at risk?

Open a few of your NFTs' metadata links. If the image loads from IPFS, a project's own website or
a cloud bucket, it depends on someone keeping that online. If it already fails to load, the art
may be lost unless a copy exists somewhere.

## If your collection already has a Forever Twins helper

Check the [registry](TBD-registry-link) for your collection.

**To create a twin**
1. Open your collection on the Forever Twins page and connect your wallet.
2. Pick the token. The page shows the preservation fee (1 STX at launch) and the inscription
   cost for that token's art.
3. Confirm. The twin is created and held by the helper, ready to swap.

Anyone can create a twin for any token. Paying for it gives no rights over the original; it
simply puts the art on-chain.

**To swap your original for its twin**
1. On the same page, choose "Swap in" for a token you own that already has a twin.
2. If your collection has its own marketplace (G2 collections), **unlist the NFT there first**.
   The helper refuses listed tokens.
3. Confirm. Your original goes into the helper; the twin comes to your wallet. No fee.

**To get your original back**
Choose "Swap back" while holding the twin. You return the twin and receive the original. No fee.
Whoever holds the twin can do this, so selling the twin sells the right to the original.

## Never send your NFT directly to a helper

Only use the Forever Twins page. If you transfer an NFT straight to a helper's address, the
contract cannot tell it came from you. A slow, public rescue exists while the team can run it,
but it is not guaranteed forever.

## If your collection doesn't have a helper yet

Ask on X @XtrataLayers or [TBD contact]. See [onboarding.md](onboarding.md) for what we need.
Collections are a good fit when their mint has finished, each token's art is 32 MB or smaller,
and the NFT contract uses a standard transfer.

## FAQ

**Does this change my original NFT?** No.

**Who can pause or stop swaps?** Nobody.

**Where does the fee go?** It is split equally between the Forever Twins team and keeps the
service running. The inscription cost goes to storing the art on-chain.

**Can the art in a twin be swapped for something else?** No. Each token's art fingerprint is
locked in the helper before anyone can use it, and the full list is published so anyone can
check.
