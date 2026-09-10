# X Chess 2.3.2 — display and read-recovery fixes

This is a new standalone board candidate, not yet inscribed. Inscription #3037
cannot be edited: publish the new HTML to make these changes available on chain.
The old board and all existing games remain readable. No new chess or peer
registry contract is needed; no deployment, game creation or inscription was
performed for this update.

| Update | What changes for players | Verification |
|---|---|---|
| Player labels and rule recovery | When a tournament manifest supplies the verified rules, the board immediately replays the game under those rules. Player names, legal moves and seat permissions agree without Refresh. Old replay positions are cleared, and a delayed response cannot alter a different game. | Deferred-rule recovery and stale-response regression tests. |
| Leaderboard loading and retry | A preparation message appears before the first read. Repeated clicks share the ongoing operation. Initial failure exposes an enabled Retry verification button; a failed read preserves the previous table. Successful chain recovery clears the associated stale error. | Initial failure → retry → success, overlapping clicks and incomplete-history tests. |
| Explorer paging | Loading is explicit and navigation is disabled while fetching. A failed request keeps the previous rows and cursor together, with a retry instruction. The next attempt loads the intended page; Refresh returns to the newest games. | Failed/delayed page, double-click, retry and existing multi-page regressions. |
| Tournament summaries | Every scored redraw refreshes the freshness message and saved picker state from the same results used by the filters and standings. Targeted refreshes update their read time. Partial scoring does not claim that all games have finished. | Completed/partial display tests and targeted tournament-poll regressions. |
| Registry and help | Quick Play supplies the deployed mainnet registry and current setup guidance. Selecting another network clears that mainnet default. Built-in Help explains signed play, manual fallback, recovery, publication and advisory clocks, and identifies the embedded manual as legacy guidance. | Registry network switching, Help copy and native peer browser checks. |
| Repeated leaderboard reads | Concurrent manifest users await one shared read. Completed eligible replays are retained in memory across retries and reused only after a fresh game row matches exactly. Changed rows are replayed again. Missing rows or short histories stop publication of the new table. | Interrupted-walk reuse, row-change invalidation and incomplete-data regressions. |

The existing shared endpoint queue continues to pace and coalesce HTTP requests.
The new reuse is local to this board session and is discarded on reload. It does
not remove public endpoint rate limits, and a full rating verification still
visits every ranked index and reads current game rows. Ratings retain their
original order, eligibility rules and checkpoint provenance.

## Existing peer registry

On Mainnet the default is:

```text
SPARQA0T0GWJZADHRMGNVTJ51D014V8P7XPDSTNH.xchess-peer-v1
```

The source was deployed and verified during the #3037 acceptance test. Each named
player signs one setup transaction; moves use local game keys. Direct WebRTC and
manual signed-message exchange both work without a mandatory managed service.
Make an encrypted recovery save before relying on browser storage.

At checkmate, automatic draw or signed resignation, either player can download
the public archive and upload it to Xtrata. No loser countersignature is required.
Clocks remain advisory; disconnection and expiry do not prove a win. Archives
prove the supplied signed line, not the absence of other signed branches.

## Inscription file and checks

Use `releases/2.3.2/xchess.html` as the board inscription payload. It includes its
engine, scripts, styling and peer support; do not inscribe the source directory,
the ZIP or the contract source as the board. The release manifest records the
exact SHA-256, Xtrata rolling hash and chunk count. The validation report includes
suite results and an independent rebuild from the packaged source.

Both legacy protocol fingerprints and the peer crypto/protocol/store/transport
and contract sources are unchanged from 2.3.1. The original #3038 signed archive
still verifies with the new bundled verifier. Browser checks exercise native
WebRTC, manual fallback, recovery, offline viewing, captured Xtrata runtime and
mobile layout. Wallet signing uses test stubs; real extension signing and the
new inscription's final sealed-byte read-back remain post-inscription checks.
