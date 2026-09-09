# V3 review and local update — 9 September 2026

The supplied V3 HTML did not meet V2.2.0 parity. The initial targeted run passed 30 checks and failed 8: inverted board colours, 64 board tab stops, missing Home navigation, default practice creation blocked by an empty opponent, rejected V2 protocol, incompatible old game links, missing Xverse BitcoinProvider detection, and the 32-chunk distribution limit.

The updated candidate is `../../X-Chess_3.0/dist/xchess.html`. Its original V3 interface now has targeted fixes and uses V2's wallet and read-transport modules. A dedicated V2 view embeds the exact verified 2.2.0 release, preserving its full feature set and historical protocol. This is explicit compatibility through a separate view, not a claim that every V2 screen has been redesigned.

A new local Clarity contract, `../../X-Chess_3.0/contracts/xchess-core-v3.clar`, supplies permanent rule descriptors, versioned extension bytes, match references, paginated reads, and sponsorship with immutable rebate terms and expiry. It preserves the old append-only log functions. No existing deployed contract was modified.

Validation of the completed candidate:

- 1,686 V2 standard tests passed; 17 existing skips.
- 39 new application/engine/replay checks passed.
- 23 local contract checks passed.
- 5 frontend-to-simnet journey checks passed: connection, opening, confirmed move, clean-page recovery, and no UI exceptions.
- 44 new-arena browser checks and 36 V2 browser checks passed against the final HTML hash, using direct and captured framed runtimes. New-arena checks include repeat document replacement.
- Clarity analysis passed with 19 warnings; no analysis errors.

Final distribution: 352,829 bytes, 22 chunks. SHA-256: `f264eb82f564ca772bd7ad2f38731857a72094c2e8ca7f14d2a681bf41480ac9`.

Read `../../X-Chess_3.0/README.md` for commands, compatibility boundaries, source provenance, and local configuration. `../../X-Chess_3.0/verification.json` and the adjacent machine-readable reports record the executed scope. No real wallet signing, public-network deployment, or inscription was performed. The compressed build requires browser DecompressionStream support. V3 source was recovered from the supplied bundle; the original Downloads file is unchanged.
