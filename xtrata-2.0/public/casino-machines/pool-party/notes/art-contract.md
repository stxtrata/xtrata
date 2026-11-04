# Pool Party art and data contract

Machine `pool-party`, ParallaX Casino machine23. Global art payload: `window.POOLPARTY_ART={data,files}`. The builder embeds every asset; no network request is required during play.

Six unmodified publisher marks map to USDA, DIKO, CHA, VELAR, ALEX and STX. The exact contracts, download dates, source URLs, SHA-256 values and permission status are in `art/sources.json`. Xtrata uses the supplied XLOGO vector code. The canonical ParallaX wordmark is supplied artwork.

`data/pool-party-snapshots.json` contains18 `poolPairs`,18 `lpTokens`,18 `swaps` and18 `yields`, with original record identifiers, protocol/wrapper attribution and read dates. Raw API responses and a read log are bundled. Yields have `apr:null` and `status:unavailable`; API APY fields are preserved as evidence and are never substituted for APR.

The game picks cosmetic data cards after the engine commits a result, using separate cosmetic randomness. Card art and data can never change a strip, prize or feature outcome. LP-token records are the wild; successful swaps are scatters; real pool yield cards trigger picks; real trading pairs trigger hold-and-respin. Every record is visibly stamped SNAPSHOT with its date. No Forever Twin or NFT artwork appears, and no cameo records exist.

`tools/fetch-pool-sources.py` fetches new evidence into a review-only staging folder. It records failures and changed logo hashes. Updating the reviewed snapshot and source manifest is a conscious follow-up build, not a background mutation during play.
