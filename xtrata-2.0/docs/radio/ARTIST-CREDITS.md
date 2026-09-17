# Radio artist display credits

Source: user-supplied `song-assignments.csv` from Audionauts-NFT-v9.0.0,
provided 17 September 2026. It contains 111 edition assignments, deduplicated by
`song_inscription_id` into 43 non-empty artist credits. Repeated IDs agreed.
Artist spelling/capitalisation is retained exactly, including BotCupid/botcupid.

`src/lib/radio/artist-credits.mjs` is the shared display-credit registry. Exact
inscription IDs override extracted artist metadata. The radio namespace is the
existing mainnet Xtrata song catalogue; do not reuse this mapping for unrelated
contracts or networks. Blank artist entries (1091, 1731, 2969, 2983, 2989) do not
erase existing names. No title matching or artist inference is performed.

Consumers: main radio/widget (including dedicated page and embed state), confirmed
favourites, catalogue endpoint, private statistics metadata, and local companion
catalogue. Local payment history prefers current catalogue credits over older
saved display names. The source distribution includes the shared registry.

This changes display credits only. Inscription contents, ownership, recipient
addresses, payment amounts, titles, albums and BPM remain unchanged. Deployment
is required for the public site. Restart the companion for its new catalogue
logic; rebuilding/downloading the package includes the same corrections.
