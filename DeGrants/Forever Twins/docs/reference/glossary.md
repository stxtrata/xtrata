# Glossary

**Adapter**: a separate contract for collections the standard template can't handle.

**Binding**: the helper's record linking an original token id to its twin's Xtrata id.

**Canonical record**: per-token content hash, mime type, size and token-uri, seeded by the owner
and locked forever at finalisation. Defines exactly what each twin will contain.

**Custody**: which contract or wallet actually owns each side of a pair.

**Finalisation**: the one-way step that locks the canonical record and opens the helper for use.

**G1 / G2**: template groups. G1 for plain transfer collections; G2 adds a listing guard for
collections with their own in-contract marketplace.

**Helper**: the per-collection Forever Twins contract.

**Inscription**: data written permanently on-chain through the Xtrata core.

**Manifest**: the published off-chain file listing every token's canonical entry; its sha256 is
stored in the helper.

**Original**: the existing NFT being preserved. Never modified.

**Payees**: the two fixed addresses (Jim, Rapha) that each receive half of every fee.

**Registry**: the public list of helpers and their state.

**Rescue**: the owner-only, time-locked return of a stray token.

**Source**: the original collection's NFT contract.

**Stray**: a token sitting in a helper that shouldn't be there, typically sent directly.

**Swap**: exchanging an original for its twin, or back. Free and never pausable.

**Twin**: the Xtrata inscription NFT carrying the original's art fully on-chain.

**Xtrata core**: `xtrata-v3-2-3`, the live inscription contract that mints twins.
