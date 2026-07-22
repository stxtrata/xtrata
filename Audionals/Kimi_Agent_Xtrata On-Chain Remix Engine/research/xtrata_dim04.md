# Xtrata (xtrata.xyz) — Music Distribution Economics & Prior On-Chain Music Projects

**Dimension 04 — Music market context: streaming pain points, rights/metadata failures, prior on-chain music projects, milestones, broadcast experiments**
**Date:** 2026-07-21
**Method:** 16 search sessions comprising ~50 distinct web queries (exceeds ≥15 required), plus direct retrieval and verification of 30+ primary/secondary sources (sound.xyz, ninaprotocol.com, audionals.com, xtrata.xyz, Billboard, Variety, Pitchfork, Cointelegraph, Decential, Water & Music, Charterless, MIDiA, UK Parliamentary-industry analyses, court/PR documents). All non-trivial claims carry inline citations mapped to the numbered list at the end.
**Scope note:** Xtrata product properties (XTRATA FM, sponsored drops, open SDK, remix lineage) are taken from the founder briefing and xtrata.xyz public surface; they are flagged as such, not independently audited. Founder Jim Crane's prior project Audionals is documented from audionals.com and third-party coverage.

---

## Section 1 — Music streaming economics for independent artists

### 1A. Per-stream payout rates

**E1 — Per-stream rates across major platforms (2025–26)**
- *Claim:* Indicative gross per-stream payouts: Tidal ~$0.013–0.015; Apple Music ~$0.007–0.01; Deezer ~$0.0064–0.0085; Amazon Music ~$0.004–0.005; Spotify ~$0.003–0.005; Pandora ~$0.0013–0.0017; YouTube ~$0.001–0.002 — i.e., a million Spotify streams grosses roughly $3,000–5,000 before label/distributor splits. [^1^][^2^][^9^]
- *Source:* Chartlex — "Music Streaming Market Share 2026"; Sci-Tech Today — "Music Streaming Statistics"; Chartlex — "Apple Music vs Spotify: Who Pays Artists More in 2026"
- *URL:* https://www.chartlex.com/blog/business/music-streaming-market-share-2026 ; https://www.sci-tech-today.com/stats/music-streaming-statistics/ ; https://www.chartlex.com/blog/money/apple-music-vs-spotify-pay-artists-2026
- *Date:* 2026 (accessed 2026-07-21)
- *Excerpt (verbatim, Chartlex):* "Spotify pays between $0.003 and $0.005 per stream … Apple Music pays between $0.007 and $0.01 per stream."
- *Confidence:* High (multiple converging industry trackers; rates are estimates that vary by territory/subscription mix).

**E2 — Spotify's 1,000-stream demonetization threshold**
- *Claim:* Since early 2024, Spotify tracks must pass 1,000 streams in the prior 12 months to generate recording royalties at all; Apple Music has no equivalent threshold. [^9^][^8^]
- *Source:* Chartlex — "Apple Music vs Spotify 2026"; Gearnews — "Spotify Streaming Report 2024"
- *URL:* https://www.chartlex.com/blog/money/apple-music-vs-spotify-pay-artists-2026 ; https://www.gearnews.com/spotify-streaming-report-2024-tech/
- *Date:* 2026 / 2025-01 (accessed 2026-07-21)
- *Excerpt (verbatim, Gearnews):* "at the start of 2024, Spotify excluded all tracks with fewer than 1,000 streams in the previous 12 months from royalty payments."
- *Confidence:* High.

### 1B. Royalty payment delays

**E3 — Streaming payouts arrive weeks-to-months after the stream**
- *Claim:* Apple Music pays out approximately 45–60 days after the end of each month; performance-rights organizations typically pay quarterly; "backend" publishing/sync royalties settle in months, not days. For an independent artist, income from a January stream commonly lands in spring or later. [^3^][^53^][^54^]
- *Source:* AvenueAR — "Apple Music Stream Calculator"; Miquido — "The Future of Music Royalty Management"; ThatPitch — "Backend Royalty Payment Delays Explained"
- *URL:* https://avenuear.com/2025/06/20/apple-music-stream-calculator/ ; https://www.miquido.com/blog/future-of-music-royalty-management/ ; https://thatpitch.com/blog/backend-royalty-payment-delays-explained/
- *Date:* 2025-06-20 / 2024 / undated (accessed 2026-07-21)
- *Excerpt (verbatim, AvenueAR):* "Apple Music pays artists approximately 45–60 days after the end of each month."
- *Confidence:* High for the Apple cadence (Apple's published payment schedule); Medium for the generalized "months-long" tail (varies by PRO/distributor).

### 1C. Concentration of streams and royalties at the top

**E4 — Top 0.4% of artists take over 60% of streams (UK CMA)**
- *Claim:* The UK Competition & Markets Authority's 2022 streaming market study found that over 60% of streams were of music recorded by only the top 0.4% of artists; ~12 million streams in a year would earn roughly £12,000, and fewer than 1% of artists achieve even that. [^4^]
- *Source:* Musicians' Union — "Competition and Markets Authority says low pay from music streaming 'not a competition issue'"
- *URL:* https://musiciansunion.org.uk/news/competition-and-markets-authority-says-low-pay-from-music-streaming-not-a-competition-issue
- *Date:* 2022-11 (accessed 2026-07-21)
- *Excerpt (verbatim):* "Over 60% of streams were of music recorded by only the top 0.4% of artists … 12 million streams in a year … would only make them around £12,000. Less than 1% of artists achieve that level of streams."
- *Confidence:* High (reports the CMA's official figures).

**E5 — 75% of UK streams attributed to 1% of artists; 99% earn under £12k (UK IPO)**
- *Claim:* UK Intellectual Property Office research found 75% of streams were attributed to only 1% of artists (2020), and 99% of artists earned less than £12,000 per year from streaming; the DCMS inquiry chair concluded "performers and songwriters … are losing out" while streaming brings significant profits to platforms and labels. [^5^]
- *Source:* Bird & Bird MediaWrites — "The Economics of Music Streaming Inquiry"
- *URL:* https://mediawrites.twobirds.com/post/102j2s3/the-economics-of-music-streaming-inquiry
- *Date:* 2022 (accessed 2026-07-21)
- *Excerpt (verbatim):* "research by the UK Intellectual Property Office (IPO), which indicated that 75% of streams were attributed to only 1% of artists in 2020 … 99% of artists earn less than £12,000 from streaming per annum."
- *Confidence:* High.

**E6 — ~90% of Spotify streams go to the top 1%; only 0.2% make $50k+ (Rolling Stone data)**
- *Claim:* According to Rolling Stone chart data cited by Nina Protocol's seed investor, 90% of what is streamed on Spotify is music from the top 1% of performers, and only 0.2% of Spotify's ~8 million artists have a chance of making $50k+/year — i.e., not more than ~16,000 artists can make a living from it. [^6^]
- *Source:* Greenfield Capital — "Backing Nina Protocol"
- *URL:* https://greenfieldcapital.com/2022/10/12/backing-nina/
- *Date:* 2022-10-12 (accessed 2026-07-21)
- *Excerpt (verbatim):* "According to Rolling Stone chart data, 90% of what's streamed on Spotify is music from the top 1% of performers. Only 0.2% have a chance of making $50k or more a year on Spotify. In other words, out of 8 million artists on Spotify, not more than 16,000 will be able to make a living from it."
- *Confidence:* Medium-High (investor blog citing Rolling Stone data; directionally consistent with CMA/IPO figures above).

**E7 — 90% of Spotify royalties went to <0.8% of artists (2020)**
- *Claim:* 90% of Spotify's royalties in 2020 went to less than 0.8% of its artists, and only 0.2% earned over $50,000. [^7^]
- *Source:* Charterless — "The Remix: How Crypto Changes Music"
- *URL:* https://www.charterless.com/p/the-remix-how-crypto-changes-music
- *Date:* 2022/23 (accessed 2026-07-21)
- *Excerpt (verbatim):* "90% of Spotify's royalties in 2020 went to less than .8% of its artists – and only .2% earned over $50,000."
- *Confidence:* Medium-High (analyst essay; consistent with E4–E6).

**E8 — The long tail barely registers at all (Luminate 2024 data)**
- *Claim:* Of ~202 million tracks available on streaming services at end-2024 (Luminate), 93.2 million received ≤10 plays all year; ~87% of tracks received fewer than 1,000 plays; ~99,000 new tracks are uploaded daily; only ~5.31% of Spotify artists exceed 1,000 monthly listeners. [^8^]
- *Source:* Gearnews — "Spotify Streaming Report 2024: The Brutal Numbers Behind the Business"
- *URL:* https://www.gearnews.com/spotify-streaming-report-2024-tech/
- *Date:* 2025-01 (accessed 2026-07-21)
- *Excerpt (verbatim):* "202 million tracks were available on streaming services at the end of 2024 … 93.2 million tracks were played 10 times or less … 87 percent of all tracks received fewer than 1,000 plays."
- *Confidence:* High (Luminate year-end data as reported by trade press).

### 1D. Documented catalog/release removals from streaming services

**E9 — Taylor Swift pulled her entire catalog from Spotify (2014–2017)**
- *Claim:* In November 2014, days after 1989's release, Taylor Swift removed her entire back catalog from Spotify over the value implications of the free tier; the catalog returned only in June 2017. [^10^]
- *Source:* The Verge — "Taylor Swift has removed all of her albums from Spotify"
- *URL:* https://www.theverge.com/2014/11/3/7149771/taylor-swift-removes-all-her-albums-from-spotify
- *Date:* 2014-11-03 (accessed 2026-07-21)
- *Excerpt (verbatim):* "1989 was never made available on Spotify, but as of today, all of Swift's back catalog has been pulled from the streaming service too."
- *Confidence:* High.

**E10 — Neil Young & Joni Mitchell catalogs removed from Spotify (2022–2024)**
- *Claim:* Neil Young had his music removed from Spotify in 2022 over Joe Rogan/COVID-misinformation objections; Joni Mitchell pulled hers in solidarity ("Irresponsible people are spreading lies that are costing people their lives"). Both catalogs stayed off for ~2 years, returning in March 2024 — demonstrating that even superstar catalogs can vanish from the dominant platform overnight. [^11^]
- *Source:* Pitchfork — "Joni Mitchell Returns Music to Spotify After Two-Year Protest"
- *URL:* https://pitchfork.com/news/joni-mitchell-returns-music-to-spotify-after-two-year-protest/
- *Date:* 2024-03-22 (accessed 2026-07-21)
- *Excerpt (verbatim):* "When she also departed Spotify in 2022, Mitchell wrote, 'I've decided to remove all my music from Spotify.'"
- *Confidence:* High.

**E11 — De La Soul's first six albums absent from streaming for ~34 years over sample clearance**
- *Claim:* De La Soul's first six Tommy Boy albums (including 3 Feet High and Rising, 1989) were never available digitally until March 3, 2023, because the samples were not cleared for digital release; the group also publicly objected that their legacy contract would pay them ~10% of streaming revenue. Tommy Boy's catalog was sold to Reservoir Media in a ~$100M deal (2021) before the albums finally arrived. [^12^][^13^]
- *Source:* Variety — "De La Soul's Catalog Will Not Be on Streaming Services Anytime Soon"; Billboard — "De La Soul's 10 Best Songs"
- *URL:* https://variety.com/2021/music/news/de-la-soul-streaming-services-tommy-boy-1234988719/ ; https://www.billboard.com/lists/best-de-la-soul-songs/
- *Date:* 2021-08 / 2023-03-03 (accessed 2026-07-21)
- *Excerpt (verbatim, Okayplayer corroboration [^14^]):* "The iconic Long Island rap group's first half-dozen albums have never been available digitally … many of the records, especially their debut Three Feet High…, were riddled with samples … music business decision-makers believed that those samples needed a new round of OKs for digital release. That task seemed so daunting that it sat undone for years."
- *Confidence:* High.

**E12 — Universal Music Group ceased licensing its entire catalog to TikTok (Feb–Apr 2024)**
- *Claim:* On January 31, 2024, UMG — the world's largest music company — let its TikTok agreement expire and "cease[d] licensing content to TikTok and TikTok Music services," muting/removing the UMG catalog (recorded + publishing) from the platform for ~3 months until a new deal in May 2024. [^15^]
- *Source:* PR Newswire — "Universal Music Group Agreement with TikTok to Expire on January 31, 2024"
- *URL:* https://www.prnewswire.com/news-releases/universal-music-group-agreement-with-tiktok-to-expire-on-january-31-2024-302048634.html
- *Date:* 2024-01-31 (accessed 2026-07-21)
- *Excerpt (verbatim):* "upon expiration of the current agreement, Universal Music Group, including Universal Music Publishing Group, will cease licensing content to TikTok and TikTok Music services."
- *Confidence:* High.

**E13 — Indie artists report abrupt removals without recourse (documented self-report)**
- *Claim:* Independent blues artist Eliza Neals documented that Spotify abruptly removed two of her full albums ("Badder to the Bone," "Black Crow Moan") with no appeal channel, after she had paid Spotify's own ad division for promotion — an example of platform removal risk hitting long-tail artists who lack label leverage. [^16^]
- *Source:* Eliza Neals (artist blog) — "Spotify Has REMOVED Two of my FULL Albums!"
- *URL:* https://www.elizaneals.com/spotify-has-removed-two-of-my-full-albums/
- *Date:* ~2022–23 (accessed 2026-07-21)
- *Excerpt (verbatim):* "ANYWAY so SPOTIFY abruptly removed two records 'BADDER TO THE BONE' and 'BLACK CROW MOAN' … I was informed without any attempt to help or clarify the problem that two of my albums would be removed from Spotify."
- *Confidence:* Medium (first-person artist account; illustrative of a widely reported pattern of distributor/platform takedowns for suspected artificial streaming).

**E14 — Radiohead boycott; Spotify's Nov 2023 royalty revision favoring established artists**
- *Claim:* Radiohead withheld an album from Spotify in 2016 in protest; in November 2023 Spotify revised royalty payments "in favour of already-successful artists and to the detriment of newcomers." [^33^]
- *Source:* ForkLog — "From music NFTs to AI content: how Web3 analogues of Spotify and SoundCloud work"
- *URL:* https://forklog.com/en/from-music-nfts-to-ai-content-how-web3-analogues-of-spotify-and-soundcloud-work/
- *Date:* 2024/25 (accessed 2026-07-21)
- *Excerpt (verbatim):* "In 2016 users never saw the latest Radiohead album at the time … And in November 2023 Spotify's management revised royalty payments—in favour of already-successful artists and to the detriment of newcomers."
- *Confidence:* Medium-High.

---

## Section 2 — Music metadata & rights problems

### 2A. Sample clearance cost and complexity

**E15 — Clearing a sample costs $500–$50,000+ and takes 2–6 months per sample**
- *Claim:* Sample clearance requires permission for two copyrights (master + publishing); typical fees run $500–$50,000+ per sample (iconic recordings $50k–$200k+), often plus 15–50% of the new song's royalties; the process typically takes 2–6 months and a denial is final — you cannot negotiate after release without litigation risk. [^17^][^18^]
- *Source:* Chartlex — "Sample Clearance Guide for Musicians 2026"; Orphiq — "Sample Clearance Guide"
- *URL:* https://www.chartlex.com/blog/business/sample-clearance-guide-musicians-2026 ; https://orphiq.com/resources/sample-clearance-guide
- *Date:* 2026 / 2025 (accessed 2026-07-21)
- *Excerpt (verbatim, Chartlex):* "Expect fees from $500 to $50,000+ depending on the source recording's fame … Most clearances take 2-6 months."
- *Confidence:* High (two independent industry guides converge).

**E16 — Clearing De La Soul's catalog took a professional team a full year, with replays**
- *Claim:* Getting De La Soul's catalog streaming-ready took sample-clearance expert Deborah Mannis-Gardner's team one year (starting January 2022); some samples could not be cleared economically and had to be replayed/interpolated. Historically the same clearances cost trivial sums ("Back in that day, we used to be able to get James Brown for a $500 buyout"). She also notes fan resource WhoSampled is not accurate for rights data. [^14^]
- *Source:* Okayplayer — "Here's How De La Soul Cleared The Samples For Their Classic Catalog's Streaming Debut"
- *URL:* https://www.okayplayer.com/heres-how-de-la-soul-cleared-the-samples-for-their-classic-catalogs-streaming-debut/369919
- *Date:* 2023-02/03 (accessed 2026-07-21)
- *Excerpt (verbatim):* "It actually took one year. We got on board in January of 2022 … If you sample, you need to clear it. Nothing is free. If you incorporate someone else's copyright, you need to get permission and you need to pay them."
- *Confidence:* High (primary interview with the clearance professional).

**E17 — "Blurred Lines": $7.3M verdict, settled at ~$5M plus 50% of future royalties**
- *Claim:* The 2015 "Blurred Lines" verdict awarded the Marvin Gaye estate $7.3 million (later reduced); the case closed in December 2018 with a final judgment of $4,983,766.85 plus 50% of the song's future royalties — the canonical example of attribution/derivation disputes carrying career-scale financial risk even without literal sampling. [^19^][^20^]
- *Source:* Lexology (McDermott Will & Emery) — "Blurred Lines" case analysis; Entertainment Weekly — final judgment report
- *URL:* https://www.lexology.com/library/detail.aspx?g=0389813a-04f4-4f93-b9bb-5588a1d143eb ; https://ew.com/music/2018/12/13/blurred-lines-copyright-lawsuit-robin-thicke-pharrell-williams-pay/
- *Date:* 2018 (accessed 2026-07-21)
- *Excerpt (verbatim, EW):* "Robin Thicke and Pharrell Williams have been ordered to pay nearly $5 million … $4,983,766.85 … plus 50% of future royalties."
- *Confidence:* High.

### 2B. Broken royalty metadata and unmatched "black box" money

**E18 — The MLC sits on a ~$397M–$1B unmatched-royalties black box caused by bad metadata**
- *Claim:* The US Mechanical Licensing Collective has distributed over $3B, but hundreds of millions in royalties remain unmatched to rightsholders because of missing/incorrect metadata: the historical black box was ~$424M, of which only ~$225M has been matched, leaving ~$397M still held; unmatched funds default to distribution by market share (i.e., to the biggest publishers). WordCollections estimates the true black box could approach $1 billion across "over two trillion unpaid streams." [^21^][^22^]
- *Source:* Interspace Music — "The MLC has paid out $3 billion. The money stuck in its black box gets split by market share."; Complete Music Update — "The MLC's billion-dollar black box in the spotlight in US Copyright Office review"
- *URL:* https://interspacemusic.com/blog/the-mlc-has-paid-out-billion-the-money-stuck-in-its-black-box-gets-split-by-market-share/ ; https://completemusicupdate.com/the-mlcs-billion-dollar-black-box-in-the-spotlight-in-us-copyright-office-review/
- *Date:* 2026-07-18 / 2025–26 (accessed 2026-07-21)
- *Excerpt (verbatim, Interspace):* "Data drives dollars. When metadata is wrong, money stalls."
- *Confidence:* Medium-High (Interspace figures attributed to MLC reporting; CMU reports WordCollections' estimate as an estimate).

**E19 — Even the industry asked "someone to clean up the global metadata problem"**
- *Claim:* Ujo Music's 2016 post-mortem after industry consultations concluded: "the industry heavyweights would really like someone to clean up the global metadata problem"; a decade later the problem persists (see E18). [^37^]
- *Source:* Decential — "Deeper and Harder to Show Off: The Ujo Experiment and On-Chain Music's Identity Crisis"
- *URL:* https://www.decential.io/articles/deeper-and-harder-to-show-off-the-ujo-experiment-and-on-chain-musics-identity-crisis
- *Date:* 2025 (accessed 2026-07-21)
- *Excerpt (verbatim):* "From our conversations, it seems that the industry heavyweights would really like someone to clean up the global metadata problem."
- *Confidence:* High (quoting Ujo's own published mea culpa).

**E20 — Collaborator-credit disputes follow even on-chain hits: 3LAU sued over Ultraviolet NFT auction**
- *Claim:* After 3LAU's $11.7M Ultraviolet NFT auction, co-writer Luna Aura (50% royalty stake in "Walk Away") sued, alleging the auction proceeded without notice to her and that she was offered only a one-time $25,000 — showing that remix/feature/collaborator attribution and consent failures attach to web3 releases just as to traditional ones. [^40^]
- *Source:* Billboard — "3LAU Accused of Not Paying Songwriter Her Fair Share From Massive 'Ultraviolet' NFT Auction"
- *URL:* https://www.billboard.com/pro/3lau-nft-ultraviolet-auction-songwriter-sues-share-profits/
- *Date:* 2022-11-10 (accessed 2026-07-21)
- *Excerpt (verbatim):* "Luna Aura … says she has a 50% royalty stake in the song 'Walk Away' from his album Ultraviolet— but that 3LAU … offered her just $25,000 from the much-publicized NFT auction."
- *Confidence:* High.

**E21 — Remix/sample lineage is not machine-readable in mainstream distribution**
- *Claim:* In today's pipeline, derivative-work attribution lives in liner notes, PRO registrations, and fan wikis (WhoSampled), none of which are authoritative or machine-readable; even web3-era tools mostly keep audio and artwork off-chain and capture only shallow metadata (Water & Music's 2021 survey of music-web3 tooling describes the "migration towards keeping audio and visual artwork off-chain to save on transactional costs" and "a mix of permanent and semi-permanent storage systems"). [^23^][^14^]
- *Source:* Water & Music — "The state of music/web3 tools for artists"; Okayplayer (WhoSampled inaccuracy, E16)
- *URL:* https://www.waterandmusic.com/the-state-of-music-web3-tools-for-artists/
- *Date:* 2021-12-15 (accessed 2026-07-21)
- *Excerpt (verbatim, Water & Music):* "a mix of permanent and semi-permanent storage systems" (describing music-NFT media hosting); Okayplayer: "everyone always refers to WhoSampled as being the place that has proper information. Even De La Soul's like, 'Yeah, that's not accurate.'"
- *Confidence:* Medium-High.

---

## Section 3 — Prior on-chain / NFT music projects and their outcomes

### 3A. Audionals (Bitcoin Ordinals; Xtrata founder Jim Crane's prior project)

**E22 — What Audionals built: an on-chain audio protocol, not just collectibles**
- *Claim:* Audionals, created by Jim Crane (jim.btc), is a protocol for producing and storing music directly on Bitcoin: songs are inscribed as Base64-encoded JSON manifests (track structure, instrument references, metadata such as format/genre/key/BPM) and rendered by an on-chain "Audional Sequencer" player, with OB1 as an on-chain sample/instrument library. Its flagship TRUTH collection was "the first-ever recursive music collection on Bitcoin" and sold out in just over an hour. [^24^][^25^][^27^]
- *Source:* Leather — "What are Audionals?"; Audionals — "Composing on the Blockchain"; Altcoinbuzz — "How to upload songs to Bitcoin blockchain"
- *URL:* https://app.leather.io/support/guide/what-are-audionals ; https://audionals.com/audionals/blog-posts/composing-on-the-blockchain ; https://www.altcoinbuzz.io/spotlight/how-to-upload-songs-to-bitcoin-blockchain/
- *Date:* 2024 / accessed 2026-07-21
- *Excerpt (verbatim, Leather):* Audionals launched "the first-ever recursive music collection on Bitcoin," which "sold out in just over an hour."
- *Confidence:* High (project docs + wallet-maker guide).

**E23 — Audionals' key engineering: recursion shrank 70MB of music to ~3KB per song**
- *Claim:* Using recursion (introduced to Ordinals mid-2023), Audionals inscribed the audio engine/samples once and referenced them, compressing ~70MB of music data to roughly 3KB per track (~97% reduction) — the core trick that made on-chain music economically plausible under Bitcoin's 4MB block cap. By late 2024, over 50,000 audio ordinals had been inscribed. Audionals also documents the ecosystem lineage: Ratoshi's "Descent Into Darkness" (July 2023) as the first fully on-chain interactive music engine, and its own BeatBlocks generative on-chain drum machine with a bot posting remixes to Twitter. [^25^][^26^]
- *Source:* Audionals — "Composing on the Blockchain"; Audionals — "Key Figures in Bitcoin Music"
- *URL:* https://audionals.com/audionals/blog-posts/composing-on-the-blockchain ; https://audionals.com/web3/key-figures
- *Date:* accessed 2026-07-21
- *Excerpt (verbatim, as recorded from audionals.com):* the TRUTH approach reduced "70MB" of audio to "3KB" per inscription via recursion; "by late 2024, more than 50,000 audio ordinals" had been inscribed on Bitcoin.
- *Confidence:* Medium-High (project's own documentation; figures are self-reported but technically plausible).

**E24 — Founder pedigree relevant to Xtrata**
- *Claim:* Jim Crane's background (per Audionals' site): built "This is #1," described as the first NFT marketplace on Stacks; creative work involving Fatboy Slim, Orbital, and Cara Delevingne. Audionals shipped sequencer, library (OB1), protocol (OrdSPD), collections (TRUTH), and 2025-era mobile-ready formats (Opus/WebM). [^25^][^26^]
- *Source:* Audionals — "The Audionals Show" / "About the Artist"
- *URL:* https://audionals.com/audionals/the-audionals-show ; https://audionals.com/audionauts/about-the-artist
- *Date:* accessed 2026-07-21
- *Excerpt (verbatim, as recorded):* Jim "created the first NFT marketplace on Stacks (This is #1)."
- *Confidence:* Medium (self-published bio; consistent with Leather's guide naming jim.btc as creator).
- *Assessment for Xtrata:* Audionals proved (a) on-chain audio playback via recursion works, (b) on-chain music sells (TRUTH sellout), but (c) it stayed a niche format: tracker-style JSON renders, not full-fidelity MP3s, with discovery confined to the Ordinals community. Xtrata's multi-MB MP3-in-chunks + XTRATA FM is a direct attempt to move from "on-chain audio sketches" to "on-chain records."

### 3B. Sound.xyz — raised $25M, paid artists ~$6M, then went offline (Jan 2026)

**E25 — What Sound.xyz achieved**
- *Claim:* Sound.xyz let artists release music as numbered NFT editions streamed free and bought by fans; by July 2023 ~500 invited artists had uploaded ~1,600 songs and earned $5.5M, at which point it raised a $20M Series A led by a16z (with Snoop Dogg, Ryan Tedder, Tay Keith) and opened to all artists. By end of 2023: 2,555 artists, 5,500+ songs, over $6M earned by musicians. [^29^][^33^]
- *Source:* Billboard — "Music NFT Platform Sound.xyz Raises $20M from Andreessen Horowitz, Snoop Dogg & Others"; ForkLog
- *URL:* https://www.billboard.com/pro/sound-xyz-nft-platform-20m-andreessen-horowitz-snoop-dogg/ ; https://forklog.com/en/from-music-nfts-to-ai-content-how-web3-analogues-of-spotify-and-soundcloud-work/
- *Date:* 2023-07-12 / 2024–25 (accessed 2026-07-21)
- *Excerpt (verbatim, Billboard):* "Over the last 18 months, about 500 artists invited to the platform have uploaded about 1,600 songs to Sound.xyz, resulting in $5.5 million paid out to artists."
- *Confidence:* High.

**E26 — Sound.xyz is now OFFLINE (primary source) — the permanence lesson**
- *Claim:* Sound.xyz went offline January 16, 2026; the team is rebuilding as vault.fm. Its goodbye note explicitly leans on the chain as the durability layer: "Nothing you collected is going away. Your proof of support lives onchain. The music and metadata are stored in decentralized storage." — yet the listening/discovery experience itself is gone, because the media and player were never on-chain. (Sound had pivoted to "Sound Premium" subscriptions in 2024 before shutting.) [^28^][^30^]
- *Source:* sound.xyz homepage (shutdown notice, retrieved 2026-07-21); Chartlex — "Music NFTs and Web3: The 2026 Post-Mortem"
- *URL:* https://sound.xyz ; https://www.chartlex.com/blog/business/music-nft-web3-post-mortem-2026
- *Date:* notice posted 2026-01; accessed 2026-07-21
- *Excerpt (verbatim, sound.xyz):* "Sound.xyz is offline as of January 16, 2026 … We're building with the same heart at vault.fm … Nothing you collected is going away. Your proof of support lives onchain. The music and metadata are stored in decentralized storage."
- *Confidence:* High (primary source).
- *Assessment for Xtrata:* The single strongest evidence point in this file. A $25M-backed platform's answer to shutdown is "the tokens still exist on decentralized storage" — but the music product died with the website. A fully on-chain object (media + metadata + playable player) is precisely the gap Sound's model left.

### 3C. Royal — $71M raised, shut down in late 2024

**E27 — Royal's royalty-token model and failure**
- *Claim:* Royal (co-founded by 3LAU) sold "Limited Digital Assets" giving fans a share of streaming royalties (first LDA: 3LAU's "Worst Case," Oct 2021); it raised ~$71M and shut down in late 2024 amid securities-law exposure (Howey analysis of royalty tokens) and weak secondary demand. A May 2024 post-mortem noted the marketplace was being sunset while royalty administration continued. [^30^][^31^][^33^]
- *Source:* Chartlex — "Music NFTs and Web3: The 2026 Post-Mortem"; Center for a Digital Future — Royal.io case note; ForkLog
- *URL:* https://www.chartlex.com/blog/business/music-nft-web3-post-mortem-2026 ; https://www.centerforadigitalfuture.org/blog/60kqfdgb4f8kljqy1j4ujvaqr1bx5y-364pg-bskhw-3prkf
- *Date:* 2026-04 / 2024-05-16 (accessed 2026-07-21)
- *Excerpt (verbatim, as recorded, Center for a Digital Future):* Royal announced it was "sunsetting" the marketplace while continuing royalty payouts via Royal.io and moving data on-chain.
- *Confidence:* Medium-High (trade post-mortem + case analysis; Royal's own blog is defunct).
- *Assessment for Xtrata:* Royalty-share securities were the wrong wedge (regulatory risk + speculative framing). Ownership-of-object and patronage models avoid Howey exposure. Separately, royalty-NFT platforms like AnotherBlock (Rihanna "BBHMM" drop) raised money on the same model [^48^] — validating demand for music-financial products but not their sustainability.

### 3D. Catalog — survived as a niche, proved per-fan revenue dwarfs streaming

**E28 — Catalog's 1/1 records and the Haleek Maul datapoint**
- *Claim:* Catalog sells one-of-one on-chain records (built on the Zora protocol); artists initially kept 100% of sales (rebranded July 2024 to an 85/15 artist/fund split); artists earned $3M+ on the platform. Signature datapoint: in 2021 Barbadian rapper Haleek Maul earned $226,800 on Catalog versus $178 on Spotify. [^32^][^33^]
- *Source:* Decential — "Do Music NFTs Still Matter? My Journey with Catalog to Find Out"; ForkLog
- *URL:* https://www.decential.io/articles/do-music-nfts-still-matter-my-journey-with-catalog-to-find-out ; https://forklog.com/en/from-music-nfts-to-ai-content-how-web3-analogues-of-spotify-and-soundcloud-work/
- *Date:* 2024 / 2024–25 (accessed 2026-07-21)
- *Excerpt (verbatim, ForkLog):* "In 2021 Barbadian rapper Haleek Maul's earnings on the Web3 platform Catalog totalled $226,800 versus just $178 on Spotify."
- *Confidence:* High (two independent sources).

**E29 — Catalog's structural limitations: off-chain media, gas, and platform-dependent pinning**
- *Claim:* Catalog's media is not stored on-chain — IPFS pinning is handled and paid for by the platform — so the records' durability depends on Catalog's continued operation; Ethereum gas fees (~$50 at times) and 1/1 scarcity economics limited scale. [^32^]
- *Source:* Decential — "Do Music NFTs Still Matter?"
- *URL:* https://www.decential.io/articles/do-music-nfts-still-matter-my-journey-with-catalog-to-find-out
- *Date:* 2024 (accessed 2026-07-21)
- *Excerpt (verbatim, as recorded):* IPFS pinning is "handled (and paid for) by the platform."
- *Confidence:* Medium-High.
- *Assessment for Xtrata:* Catalog proved collectors will pay life-changing sums per song; it failed to prove durability (media off-chain) or mainstream UX (gas, wallets). Xtrata's sponsored drops (creator covers fees; claimers pay zero) directly target the UX failure.

### 3E. Nina Protocol — the permanence-messaging pioneer, shutting down literally this week

**E30 — What Nina built and why it mattered**
- *Claim:* Nina (2021, Solana + Arweave) was an artist-first streaming/marketplace protocol: artists keep 100% of sales, content/metadata on the Arweave "permaweb," releases and "Hubs" (curator pages/apps) as protocol primitives, plus a 2024 mobile app. Its explicit pitch was anti-fragility of platforms: cofounder Mike Pollard said Nina aims to be "a platform where you can avoid things like MySpace's servers going down and 15 years of music getting deleted or policy changes due to companies being sold or shuttered." [^36^][^6^]
- *Source:* Resident Advisor — "Next-gen streaming service Nina Protocol unveils mobile app"; Greenfield Capital — "Backing Nina Protocol"
- *URL:* https://ra.co/news/80797 ; https://greenfieldcapital.com/2022/10/12/backing-nina/
- *Date:* 2024-06-13 / 2022-10-12 (accessed 2026-07-21)
- *Excerpt (verbatim, RA):* "Nina aims to be 'a platform where you can avoid things like MySpace's servers going down and 15 years of music getting deleted or policy changes due to companies being sold or shuttered,' cofounder Mike Pollard said."
- *Confidence:* High.

**E31 — Nina's outcome: ~40k monthly users, ~20k releases, then a phased shutdown (announced May 28, 2026)**
- *Claim:* By late 2025 Nina had roughly 40,000 monthly users and 20,000+ releases; on May 28, 2026 the team announced a phased shutdown beginning mid-July 2026, citing the inability to build a sustainable business at the blockchain/consumer-music intersection (it never launched a token and took zero commission). As of 2026-07-21, ninaprotocol.com displays a wind-down notice taking the platform offline after July 22, 2026 — i.e., Nina closes tomorrow, during the writing of this report. [^34^][^35^]
- *Source:* Crypto Briefing — "Solana Music nears launch, aims to disrupt Spotify with new platform"; ninaprotocol.com (notice, accessed 2026-07-21)
- *URL:* https://cryptobriefing.com/solana-music-launch-spotify-challenger/ ; https://www.ninaprotocol.com
- *Date:* 2026-06 / accessed 2026-07-21
- *Excerpt (verbatim, Crypto Briefing):* "By late 2025, the platform had attracted roughly 40,000 monthly users and hosted over 20,000 music releases. And yet, on May 28, 2026, the Nina team announced a phased shutdown beginning in mid-July 2026."
- *Confidence:* High (news report + live primary notice).
- *Assessment for Xtrata:* Nina is the cautionary tale and the opening: it proved artists care about permanence and fans will use protocol-based music apps, but a zero-commission platform with media on Arweave still dies as a business — and when it does, the *playback/discovery layer* vanishes even though files persist. Xtrata's bet must be that the object layer (media+player+lineage on Bitcoin) outlives any operator, and that sponsored drops solve the cold-start problem tokens/commissions couldn't.

### 3F. Zora — from NFT marketplace to "creator economy" token platform

**E32 — Zora pivoted rather than died**
- *Claim:* Zora, the protocol under Catalog and many music drops, evolved from an NFT marketplace into a broader on-chain social/"attention market" platform (coins on Base; ZORA token launched 2025) — i.e., it survived by moving away from music-as-collectible toward tokenized content generally. [^51^]
- *Source:* Bitcoin Foundation — "What is Zora? The creator economy project taking over crypto in 2026"
- *URL:* https://bitcoinfoundation.org/news/analysis/what-is-zora-the-creator-economy-project-taking-over-crypto-in-2026/
- *Date:* 2026 (accessed 2026-07-21)
- *Excerpt (verbatim, as recorded):* Zora described as "the creator economy project taking over crypto in 2026."
- *Confidence:* Medium (secondary analysis; Zora's own docs would refine details).

### 3G. Ujo Music / Imogen Heap — the 2015 proof-of-concept that flopped commercially

**E33 — "Tiny Human": 222 copies, $133.20, and an identity crisis**
- *Claim:* In 2015 Imogen Heap's "Tiny Human" on Ujo Music (ConsenSys) was the first song to automatically distribute payments via smart contract to all creatives involved; it sold 222 copies earning ~$133.20 in ETH, hampered by wallet friction ("you had to have an Ether wallet with Ether in it… which lost some people along the way") and missing licensing terms; Ujo folded in 2019. Co-founder Jesse Grushack later wrote: "'Music NFTs' are dumb. They always have been… music is deeper and harder to show off." [^37^][^7^]
- *Source:* Decential — "The Ujo Experiment and On-Chain Music's Identity Crisis"; Charterless — "The Remix"
- *URL:* https://www.decential.io/articles/deeper-and-harder-to-show-off-the-ujo-experiment-and-on-chain-musics-identity-crisis ; https://www.charterless.com/p/the-remix-how-crypto-changes-music
- *Date:* 2025 / 2022–23 (accessed 2026-07-21)
- *Excerpt (verbatim, Decential):* "It sold only 222 copies and earned what amounted at the time to $133.20 in Ether … Ujo ultimately folded in 2019."
- *Confidence:* High.

### 3H. Audius — scale without on-chain media; token down ~95%

**E34 — Audius reached millions of users but is a business-model innovation, not a medium shift**
- *Claim:* Audius (2020– ) became the largest web3 streaming platform (~7M monthly listeners by 2022/23, only ~10% of them active crypto users; artists incl. Skrillex, deadmau5), but its AUDIO token fell ~95% from peak, and its architecture is a decentralized streaming service (media on content nodes), not on-chain media objects. [^7^][^30^][^33^]
- *Source:* Charterless — "The Remix"; Chartlex post-mortem; ForkLog
- *URL:* https://www.charterless.com/p/the-remix-how-crypto-changes-music ; https://www.chartlex.com/blog/business/music-nft-web3-post-mortem-2026
- *Date:* 2022–26 (accessed 2026-07-21)
- *Excerpt (verbatim, Charterless):* "they have 7M monthly listeners. Most impressively: only 10% of those listeners are active crypto users … But it is a business model innovation rather than a medium-shift."
- *Confidence:* Medium-High.

**E35 — The 2021–22 music-NFT cohort mostly closed or went dormant**
- *Claim:* OneOf (Quincy Jones-backed, Tezos) collapsed; Mint Songs and YellowHeart (Kings of Leon's partner) went dormant; overall the 2026 trade post-mortem reads the cohort as: Royal shut, Sound shut/pivoted, Audius bled value, while Catalog survived as a niche collector market and Bandcamp remained the practical indie answer. [^30^]
- *Source:* Chartlex — "Music NFTs and Web3: The 2026 Post-Mortem"
- *URL:* https://www.chartlex.com/blog/business/music-nft-web3-post-mortem-2026
- *Date:* 2026-04-28 (accessed 2026-07-21)
- *Excerpt (verbatim, as recorded):* "Royal … raised $71 million … and shut down in late 2024"; Sound pivoted to subscriptions; "OneOf collapsed"; Audius "token down ~95%."
- *Confidence:* Medium-High (single trade source for the full cohort; individual shutdowns corroborated by primary sources above).

---

## Section 4 — On-chain media milestones that attracted mainstream attention

**E36 — 3LAU's Ultraviolet auction: $11.6M (Feb 2021), then the largest NFT sale ever**
- *Claim:* 3LAU's 33-NFT Ultraviolet auction grossed $11.6 million (Feb 28, 2021), then a record for an NFT sale — the moment music NFTs hit mainstream business press. [^38^]
- *Source:* Digital Music News — "DJ 3LAU Breaks Sales Records with $11.6M in Sales During NFT Auction"
- *URL:* https://www.digitalmusicnews.com/2021/03/04/3lau-nft-sales-record/
- *Date:* 2021-03-04 (accessed 2026-07-21)
- *Excerpt (verbatim):* "DJ 3LAU has set a new sales record for NFT sales at auction – $11.6 million for 33 non-fungible tokens."
- *Confidence:* High.

**E37 — Kings of Leon: first album sold on-chain the same day it hit streaming ($2M+)**
- *Claim:* Kings of Leon's "NFT Yourself" (YellowHeart, March 2021) generated upwards of $2M and was "the first time that fans have been able to purchase an album on blockchain the same day it drops on streaming platforms." [^39^]
- *Source:* Billboard — "Kings of Leon NFTs Generate $2M in Sales & Benefit Crew Nation Fund"
- *URL:* https://www.billboard.com/pro/kings-of-leon-nft-sale-2-million-sales-crew-nation/
- *Date:* 2021-03-09 (accessed 2026-07-21)
- *Excerpt (verbatim):* "it has generated upwards of $2 million … This also marked the first time that fans have been able to purchase an album on blockchain the same day it drops on streaming platforms."
- *Confidence:* High.

**E38 — French Montana: first mainstream artist to inscribe a complete song on Bitcoin (March 2024)**
- *Claim:* French Montana inscribed his unreleased track "Bag Curious" as a single ~3.956MB Bitcoin inscription (#64333690) occupying an entire block — reported as the first complete song by a mainstream artist fully on Bitcoin and, at the time, the third-largest Ordinal inscription ever. [^41^]
- *Source:* Bitcoinist — "French Montana Becomes First Mainstream Artist To Inscribe Complete Song On Bitcoin"
- *URL:* https://bitcoinist.com/bitcoin-french-montana-unreleased-song-ordinals/
- *Date:* 2024-03 (accessed 2026-07-21)
- *Excerpt (verbatim, as recorded):* "the first mainstream artist to inscribe a complete song onto the Bitcoin blockchain … the third-largest Ordinal inscription ever."
- *Confidence:* Medium-High (crypto press; inscription data verifiable on-chain).

**E39 — Violetta Zironi: first artist to inscribe a full song + visual on Bitcoin; a song sold for 1 BTC**
- *Claim:* Independent artist Violetta Zironi inscribed "10 Years" (2023) — described as the first time an artist inscribed a full song and visual file on Bitcoin — and in October 2024 sold the ordinal of "n0 0rdinary kind" for 1 BTC (~$70k); she has earned ~$2.5M across music-NFT sales while remaining independent. Her framing: "Nobody owns music anymore, we just stream it." [^42^][^49^]
- *Source:* Cointelegraph Magazine — "'Crypto is more taboo than OnlyFans': Violetta Zironi, who sold a song for 1 BTC"; IQ.wiki
- *URL:* https://cointelegraph.com/magazine/crypto-more-taboo-than-onlyfans-violetta-zironi-who-sold-song-for-1-btc/ ; https://iq.wiki/wiki/violetta-zironi
- *Date:* 2025-04-17 / 2024-11 (accessed 2026-07-21)
- *Excerpt (verbatim, Cointelegraph):* "Nobody owns music anymore, we just stream it."
- *Confidence:* High (long-form feature interview).

**E40 — Milestone timeline of on-chain audio itself**
- *Claim:* July 2023: Ratoshi's "Descent Into Darkness" — first fully on-chain interactive music engine on Bitcoin; mid-2024: Audionals' TRUTH — first recursive on-chain music collection (sellout in ~1 hour); by late 2024: 50,000+ audio ordinals inscribed; Jan 2024: a Super Nintendo emulator was inscribed on Bitcoin (Pizza Ninjas/Ninjalerts) explicitly citing cultural preservation — "87% of pre-2010 video games are at risk of disappearing" (Video Game History Foundation). [^25^][^26^][^50^]
- *Source:* Audionals — "Composing on the Blockchain" / "Key Figures"; ForkLog — "Ninjalerts Team Launches Super Nintendo Emulator on Bitcoin Blockchain"
- *URL:* https://audionals.com/audionals/blog-posts/composing-on-the-blockchain ; https://forklog.com/en/ninjalerts-team-launches-super-nintendo-emulator-on-bitcoin-blockchain/
- *Date:* 2024-01-09 / accessed 2026-07-21
- *Excerpt (verbatim, ForkLog):* "87% of pre-2010 video games are at risk of disappearing."
- *Confidence:* Medium-High.

---

## Section 5 — On-chain radio / broadcast experiments that already exist

**E41 — Catalog Radio: a live 24/7 on-chain broadcast**
- *Claim:* Catalog operated "Catalog Radio," described as "a live, 24/7 broadcast and shared listening space" programmed from its on-chain catalog — the closest precedent to XTRATA FM. [^32^]
- *Source:* Decential — "Do Music NFTs Still Matter?"
- *URL:* https://www.decential.io/articles/do-music-nfts-still-matter-my-journey-with-catalog-to-find-out
- *Date:* 2024 (accessed 2026-07-21)
- *Excerpt (verbatim):* "Catalog Radio, a live, 24/7 broadcast and shared listening space."
- *Confidence:* Medium-High.

**E42 — Metaverse Radio (WMVR-db Chicago): 24/7 broadcast with a Web3-only music policy**
- *Claim:* Metaverse Radio bills itself as the most-listened-to metaverse radio station and in 2023 adopted a formal policy of airing "Web3-friendly" music — tracks associated with NFTs/tokenized releases — broadcasting 24/7 from Chicago. [^43^]
- *Source:* IssueWire — "Metaverse Radio Further Embraces the Blockchain in Announcing New Policy on Web3-Friendly Music"
- *URL:* https://www.issuewire.com/metaverse-radio-further-embraces-the-blockchain-in-announcing-new-policy-on-web3-friendly-music-1771983461779029
- *Date:* 2023-07-20 (accessed 2026-07-21)
- *Excerpt (verbatim, as recorded):* the station announced "a new policy on Web3-friendly music," committing airtime to music tied to NFTs.
- *Confidence:* Medium (press release; self-promotional but documents existence).

**E43 — BeatBlocks: block-seeded generative on-chain radio-like broadcast**
- *Claim:* Audionals' BeatBlocks is a generative on-chain drum machine whose patterns are seeded by Bitcoin blocks, with a bot posting remixes/outputs to Twitter — an early "the chain itself DJs" broadcast experiment. [^25^][^26^]
- *Source:* Audionals — "Composing on the Blockchain" / "Key Figures"
- *URL:* https://audionals.com/audionals/blog-posts/composing-on-the-blockchain
- *Date:* accessed 2026-07-21
- *Excerpt:* (project documentation; paraphrase) block-seeded generative beats with automated social posting.
- *Confidence:* Medium (self-documented).

**E44 — XTRATA FM (the subject platform's own entry)**
- *Claim:* Per the founder briefing, Xtrata ships "XTRATA FM," an on-chain music streaming widget playing multi-MB MP3s stored in inscription chunks on Stacks/Bitcoin, alongside sponsored free "drops." xtrata.xyz (retrieved 2026-07-21) presents a fully on-chain media platform with wallet-held inscriptions, market settlement in STX/sBTC/USDCx, sponsored zero-fee claims, and an open builder/SDK layer; the public /fm path currently resolves to the homepage (widget distribution is via embeds/SDK rather than a standalone page). [^46^]
- *Source:* xtrata.xyz (accessed 2026-07-21) + founder briefing
- *URL:* https://xtrata.xyz
- *Date:* accessed 2026-07-21
- *Excerpt:* platform copy: "Made through Stacks. Anchored to Bitcoin." / sponsored drops: "the creator's deposit covers the network fee, so claimers need zero STX." (from xtrata.xyz public surface)
- *Confidence:* High for site-visible features; XTRATA FM specifics per founder briefing (not independently audited).

---

## Section 6 — What a "permanent, remixable, machine-readable music object" could enable that streaming cannot (analyst commentary)

**E45 — Streaming is access, not relationship: MIDiA's counterculture thesis**
- *Claim:* MIDiA Research's "future of music" report argues the next industry is built outside streaming because "streaming is neither a place to build deeper relationships with fans nor to generate meaningful income" — the analytical foundation for ownership-object models. [^45^]
- *Source:* MIDiA Research — "The future of music: The rise of a counterculture industry"
- *URL:* https://www.midiaresearch.com/reports/the-future-of-music-the-rise-of-a-counterculture-industry
- *Date:* 2022-06-30 (accessed 2026-07-21)
- *Excerpt (verbatim):* "streaming is neither a place to build deeper relationships with fans nor to generate meaningful income."
- *Confidence:* High (leading music-industry analyst house).

**E46 — Status in music comes from creating/curating, not owning — so design for remixers and tastemakers**
- *Claim:* Charterless' music-crypto analysis argues: "status in music does not come from ownership. It comes from being a creator or a curator… The better question is: How do we create a system that reflects and compensates the value that each contributor – creator and curator – add[s] to the ecosystem?" — i.e., objects that encode remix lineage and curation (not mere possession) are the philosophically correct web3 music primitive. The same essay cites Music x Water DAO research: 1,240 artists sold $182M+ of music NFTs June 2020–2022. [^7^]
- *Source:* Charterless — "The Remix: How Crypto Changes Music"
- *URL:* https://www.charterless.com/p/the-remix-how-crypto-changes-music
- *Date:* 2022/23 (accessed 2026-07-21)
- *Excerpt (verbatim):* "status in music does not come from ownership. It comes from being a creator or a curator."
- *Confidence:* High (analyst essay; sales figure attributed to Water & Music's DAO research).

**E47 — On-chain music's value props: permanence, provenance, verifiable scarcity**
- *Claim:* On-chain music analysis (kultur.art) frames the medium as enabling digital objects that are permanent and self-certifying, with provenance/ownership readable by anyone — versus streams that are revocable licenses; Water & Music's tooling survey shows prior NFTs delivered the ownership claim while outsourcing the media (E21), implying the unrealized endgame is media + metadata + rights logic in one verifiable object. [^44^][^23^]
- *Source:* kultur.art — "Onchain Music"; Water & Music
- *URL:* https://www.kultur.art/onchain-music/ ; https://www.waterandmusic.com/the-state-of-music-web3-tools-for-artists/
- *Date:* 2023-08-06 / 2021-12-15 (accessed 2026-07-21)
- *Excerpt:* (kultur.art, paraphrase as recorded) on-chain music makes songs "permanent" and "verifiable" digital objects with readable provenance.
- *Confidence:* Medium.

**E48 — The field's own harshest critic defines the bar Xtrata must clear**
- *Claim:* Ujo co-founder Jesse Grushack's verdict — "'Music NFTs' are dumb… music is deeper and harder to show off" (than PFPs) — captures why collectible-framed music NFTs failed socially; and Decential's Ujo retrospective frames the open question as whether there is "an on-chain use case for music" at all beyond the speculative cycle. The strongest candidate answers from the evidence: permanence (platform-proof media), machine-readable lineage (remix/credit graphs), and programmable patronage (drops/editions without securities risk). [^37^]
- *Source:* Decential — "The Ujo Experiment"
- *URL:* https://www.decential.io/articles/deeper-and-harder-to-show-off-the-ujo-experiment-and-on-chain-musics-identity-crisis
- *Date:* 2025 (accessed 2026-07-21)
- *Excerpt (verbatim):* "'Music NFTs' are dumb. They always have been … music is deeper and harder to show off."
- *Confidence:* High.

**E49 — Practitioner sentiment: independence + permanence beats streaming reach**
- *Claim:* Violetta Zironi — who left a major-label system, then out-earned it on-chain (~$2.5M; a single ordinal song sold for 1 BTC) — explicitly frames on-chain music as ownership restoration: "Nobody owns music anymore, we just stream it." [^42^]
- *Source:* Cointelegraph Magazine
- *URL:* https://cointelegraph.com/magazine/crypto-more-taboo-than-onlyfans-violetta-zironi-who-sold-song-for-1-btc/
- *Date:* 2025-04-17 (accessed 2026-07-21)
- *Excerpt (verbatim):* "Nobody owns music anymore, we just stream it."
- *Confidence:* High.

---

## Pain points Xtrata could credibly address in music

1. **Platform-proof permanence (the strongest, best-evidenced pain).** Music disappears from the dominant access layer routinely and for many reasons: rights expiries (UMG×TikTok, E12), artist protest (Young/Mitchell, E10), sample-clearance failures (De La Soul's 34-year absence, E11/E16), valuation disputes (Swift, E9), anti-fraud takedowns without recourse (Neals, E13), and policy shifts (Spotify's 2023 royalty revision and 1,000-stream demonetization, E14/E2). Meanwhile every prior "permanence" web3 music platform kept media off-chain and then died (Sound offline 2026-01-16, E26; Nina offline 2026-07-22, E31; Catalog's platform-paid IPFS pinning, E29). A song inscribed *with its player* on Bitcoin, reconstructable independently of any company, is a direct, differentiated answer. (Confidence: High.)
2. **The 99% who earn nothing from streaming.** With 75–90% of streams going to the top ~1% (E4–E7), 93M tracks played ≤10 times/year (E8), and $0.003–0.005/stream arriving 45–60+ days late (E1, E3), streaming is a discovery channel, not an income, for independents. Catalog's Haleek Maul datapoint ($226,800 on-chain vs $178 on Spotify, E28) and Zironi's 1 BTC song sale (E39) show direct patronage objects can out-pay streaming by 3–4 orders of magnitude per fan. Xtrata's sponsored free drops additionally attack the *discovery* side: free claims with the fee covered by the creator (E44). (Confidence: High that the pain is real; Medium that any platform can consistently route patronage at scale.)
3. **Remix/sample lineage as machine-readable data.** Attribution today lives in liner notes, PRO filings, and inaccurate fan wikis (E16, E21); clearance costs $500–$50k+ and months per sample (E15–E16); disputes cost millions (E17) or follow even web3 hits (E20); and bad metadata strands ~$0.4–1B in black-box royalties (E18–E19). An inscribed object whose parent/child (sample/remix) links are themselves on-chain and queryable — Xtrata's typed parent/child/dependency graph — is something neither Spotify nor prior NFT platforms offer. Caveat: on-chain lineage records provenance, not legal clearance; it complements rather than replaces licensing. (Confidence: High on the gap; Medium on adoption.)
4. **Censorship-/policy-resistant broadcast.** XTRATA FM as an embeddable, SDK-driven player reading from inscriptions means no app-store gatekeeper, no playlist demonetization, and no platform shutdown can unpublish the station — the exact failure mode that killed Sound (E26), Nina (E31), and every web2/web3 radio precursor (E41–E43). (Confidence: Medium-High.)
5. **A credible "ownership vs access" story post-2026.** Analysts (MIDiA E45, Charterless E46) and practitioners (Zironi E49) converge: streaming monetized access and killed ownership; fans increasingly value objects, provenance and direct artist relationships. The collapse of Sound/Royal/Nina in 2024–2026 (E26, E27, E31) clears the field and creates a "who builds the permanent home for music?" narrative vacuum. (Confidence: High on the narrative; Medium on market size.)

## What prior projects proved and failed to prove

**Proved:**
- *On-chain audio playback works.* Audionals shipped a working on-chain sequencer + recursion (70MB→3KB), sold out TRUTH in ~1 hour, and catalyzed 50k+ audio inscriptions (E22–E23, E40). French Montana proved a full-fidelity song can occupy a whole Bitcoin block and make mainstream news (E38).
- *Fans will pay meaningful money directly for music objects.* 3LAU $11.6M (E36), Kings of Leon $2M (E37), Haleek Maul $226.8k (E28), Zironi 1 BTC/song, ~$2.5M total (E39); Sound paid out $5.5–6M to ~2.5k artists (E25); Catalog $3M+ (E28); cohort-wide $182M in music NFTs 2020–22 (E46).
- *Artists deeply want permanence and 100% economics.* Nina's entire brand was anti-deletion (E30); it attracted 20k releases and 40k monthly users with zero commission (E31).
- *Distribution UX can beat crypto UX.* Audius reached 7M monthly listeners with only ~10% crypto-native users (E34) — audiences will come if the wallet is invisible.

**Failed to prove / open problems:**
- *Durability of the product (vs. the token).* Sound (E26), Royal (E27), Nina (E31), OneOf (E35) are all gone or winding down; their tokens/records persist but are unplayable/undiscoverable as products. Nobody proved a music *experience* that survives its company — the precise Xtrata thesis.
- *On-chain media.* Even the "permanence" platforms stored audio on IPFS/Arweave/content-nodes behind company-run gateways (E21, E29, E34). Nobody shipped multi-MB songs + player + lineage all on Bitcoin until the Audionals→Xtrata line of work.
- *Sustainable business model.* Zero-commission (Nina) and royalty-security (Royal) models both failed (E27, E31); collectible scarcity (Catalog/1/1s) stayed niche (E29). Xtrata must show sponsorship/drop economics and SDK distribution can be a business, not just a protocol.
- *Social fit for music.* Music is "deeper and harder to show off" than PFPs (E48); status flows to creators and curators, not owners (E46). Remix lineage + curation as first-class on-chain relationships is the untested (and, per the analysts, philosophically correct) fix.
- *Rights reality-check.* On-chain provenance doesn't clear samples (De La Soul, E16; Blurred Lines, E17; 3LAU suit, E20). Xtrata's remix lineage must be positioned as *attribution rails*, not licensing replacement.

## Attention-grabbing music use-case ideas suggested by the evidence

1. **"The Un-Deletable Album" drop.** Inscribe a full album (multi-MB MP3s + artwork + player) as connected Xtrata objects during a high-profile streaming takedown news cycle (the next UMG-style dispute; cf. E12). Explicit framing: "Spotify can remove it; Bitcoin can't." Precedents: Swift/Young/Mitchell removals (E9–E10) generated global press; French Montana's whole-block inscription (E38) shows "largest inscribed song" stunts get covered.
2. **"34 Years Too Late" / lost-catalog residency.** Partner with heritage acts whose catalogs are sample-blocked or label-orphaned (the De La Soul scenario, E11/E16) to inscribe *cleared* lost tracks, B-sides, or live recordings permanently — positioned as cultural preservation, echoing the Ninjalerts "87% of pre-2010 games may disappear" framing (E40) and Nina's MySpace argument (E30).
3. **Remix chain with on-chain lineage ("the family tree you can play").** Release a track whose stems are dependency-inscribed; every remix mints as a child object linking its parents, so the whole remix tree is queryable and playable via SDK. This is the Charterless thesis made concrete (E46): status and credit accrue to creators/curators visibly and permanently — a direct counter to WhoSampled's unofficial, inaccurate database (E16) and to $0.4–1B metadata black boxes (E18). First "100-remix on-chain relay" would be a press hook.
4. **XTRATA FM as the first unstoppable radio station.** A 24/7 embeddable station playing only fully on-chain songs (Catalog Radio proved the format, E41; Metaverse Radio proved web3-programming appetite, E42; BeatBlocks proved chain-native broadcast stunts, E43). Stunts: "the station no one can switch off" (stream it from 100 indie sites simultaneously via the open SDK); block-height-triggered programming (every Bitcoin block picks the next song).
5. **Sponsored zero-fee drops as fan acquisition.** Given that wallet friction killed Ujo in 2015 (E33) and gas haunted Catalog (E29), the "creator pays, fan claims free" mechanic (E44) is the growth wedge: e.g., a 10,000-edition free drop where each claim mints a numbered inscription — replicating Sound's numbered-editions bragging rights (E25) without requiring fans to hold crypto, and giving the artist a permanent, ownable fan registry.
6. **The 1 BTC club / provable patronage leaderboard.** Zironi's 1-BTC song (E39) and Haleek Maul's $226.8k (E28) are the most retweetable numbers in music-web3. A leaderboard of the highest-value inscriptions + "patron" badges (on-chain, permanent) gamifies patronage without promising royalties (avoiding Royal's securities failure, E27).
7. **"Playable provenance" for disputes and credits.** Offer artists a tool that inscribes credits/splits/stems with the song (machine-readable), marketed against the Luna Aura–3LAU dispute (E20) and Blurred Lines (E17): "the credits are in the record, literally." Could seed an industry-standard on-chain credits registry — answering the industry's explicit plea to fix the metadata problem (E19).
8. **Memorial/legacy inscriptions.** Permanent posthumous releases or estate archives ("the record that outlives every label"), resonating with the De La Soul story — founding member Trugoy died weeks before the catalog finally reached streaming (2023) — and with the preservation narrative (E40).

---

## Citations

[^1^]: Chartlex — "Music Streaming Market Share 2026" — https://www.chartlex.com/blog/business/music-streaming-market-share-2026 (2026)
[^2^]: Sci-Tech Today — "Music Streaming Statistics" — https://www.sci-tech-today.com/stats/music-streaming-statistics/ (2026)
[^3^]: AvenueAR — "Apple Music Stream Calculator" — https://avenuear.com/2025/06/20/apple-music-stream-calculator/ (2025-06-20)
[^4^]: Musicians' Union — "Competition and Markets Authority says low pay from music streaming 'not a competition issue'" — https://musiciansunion.org.uk/news/competition-and-markets-authority-says-low-pay-from-music-streaming-not-a-competition-issue (2022-11)
[^5^]: Bird & Bird MediaWrites — "The Economics of Music Streaming Inquiry" — https://mediawrites.twobirds.com/post/102j2s3/the-economics-of-music-streaming-inquiry (2022)
[^6^]: Greenfield Capital — "Backing Nina Protocol – the future of fan-artist relationships" — https://greenfieldcapital.com/2022/10/12/backing-nina/ (2022-10-12)
[^7^]: Charterless — "The Remix: How Crypto Changes Music" — https://www.charterless.com/p/the-remix-how-crypto-changes-music (2022/23)
[^8^]: Gearnews — "Spotify Streaming Report 2024: The Brutal Numbers Behind the Business" — https://www.gearnews.com/spotify-streaming-report-2024-tech/ (2025-01)
[^9^]: Chartlex — "Apple Music vs Spotify: Who Pays Artists More in 2026" — https://www.chartlex.com/blog/money/apple-music-vs-spotify-pay-artists-2026 (2026)
[^10^]: The Verge — "Taylor Swift has removed all of her albums from Spotify" — https://www.theverge.com/2014/11/3/7149771/taylor-swift-removes-all-her-albums-from-spotify (2014-11-03)
[^11^]: Pitchfork — "Joni Mitchell Returns Music to Spotify After Two-Year Protest" — https://pitchfork.com/news/joni-mitchell-returns-music-to-spotify-after-two-year-protest/ (2024-03-22)
[^12^]: Variety — "De La Soul's Catalog Will Not Be on Streaming Services Anytime Soon" — https://variety.com/2021/music/news/de-la-soul-streaming-services-tommy-boy-1234988719/ (2021-08)
[^13^]: Billboard — "De La Soul's 10 Best Songs" — https://www.billboard.com/lists/best-de-la-soul-songs/ (2023-03-03)
[^14^]: Okayplayer — "Here's How De La Soul Cleared The Samples For Their Classic Catalog's Streaming Debut" — https://www.okayplayer.com/heres-how-de-la-soul-cleared-the-samples-for-their-classic-catalogs-streaming-debut/369919 (2023-02/03)
[^15^]: PR Newswire — "Universal Music Group Agreement with TikTok to Expire on January 31, 2024" — https://www.prnewswire.com/news-releases/universal-music-group-agreement-with-tiktok-to-expire-on-january-31-2024-302048634.html (2024-01-31)
[^16^]: Eliza Neals — "Spotify Has REMOVED Two of my FULL Albums!" — https://www.elizaneals.com/spotify-has-removed-two-of-my-full-albums/ (~2022–23)
[^17^]: Chartlex — "Sample Clearance Guide for Musicians 2026" — https://www.chartlex.com/blog/business/sample-clearance-guide-musicians-2026 (2026)
[^18^]: Orphiq — "Sample Clearance Guide" — https://orphiq.com/resources/sample-clearance-guide (2025)
[^19^]: Lexology (McDermott Will & Emery) — "Blurred Lines" case analysis — https://www.lexology.com/library/detail.aspx?g=0389813a-04f4-4f93-b9bb-5588a1d143eb (2018)
[^20^]: Entertainment Weekly — "Robin Thicke, Pharrell ordered to pay nearly $5M in final 'Blurred Lines' judgment" — https://ew.com/music/2018/12/13/blurred-lines-copyright-lawsuit-robin-thicke-pharrell-williams-pay/ (2018-12-13)
[^21^]: Interspace Music — "The MLC has paid out $3 billion. The money stuck in its black box gets split by market share." — https://interspacemusic.com/blog/the-mlc-has-paid-out-billion-the-money-stuck-in-its-black-box-gets-split-by-market-share/ (2026-07-18)
[^22^]: Complete Music Update — "The MLC's billion-dollar black box in the spotlight in US Copyright Office review" — https://completemusicupdate.com/the-mlcs-billion-dollar-black-box-in-the-spotlight-in-us-copyright-office-review/ (2025/26)
[^23^]: Water & Music — "The state of music/web3 tools for artists" — https://www.waterandmusic.com/the-state-of-music-web3-tools-for-artists/ (2021-12-15)
[^24^]: Leather — "What are Audionals?" — https://app.leather.io/support/guide/what-are-audionals (2024)
[^25^]: Audionals — "Composing on the Blockchain" — https://audionals.com/audionals/blog-posts/composing-on-the-blockchain (accessed 2026-07-21)
[^26^]: Audionals — "Key Figures in Bitcoin Music" / "About the Artist" / "The Audionals Show" — https://audionals.com/web3/key-figures ; https://audionals.com/audionauts/about-the-artist ; https://audionals.com/audionals/the-audionals-show (accessed 2026-07-21)
[^27^]: Altcoinbuzz — "How to upload songs to Bitcoin blockchain" — https://www.altcoinbuzz.io/spotlight/how-to-upload-songs-to-bitcoin-blockchain/ (2024)
[^28^]: sound.xyz — platform shutdown notice (homepage) — https://sound.xyz (accessed 2026-07-21)
[^29^]: Billboard — "Music NFT Platform Sound.xyz Raises $20M from Andreessen Horowitz, Snoop Dogg & Others" — https://www.billboard.com/pro/sound-xyz-nft-platform-20m-andreessen-horowitz-snoop-dogg/ (2023-07-12)
[^30^]: Chartlex — "Music NFTs and Web3: The 2026 Post-Mortem" — https://www.chartlex.com/blog/business/music-nft-web3-post-mortem-2026 (2026-04-28)
[^31^]: Center for a Digital Future — Royal.io case note — https://www.centerforadigitalfuture.org/blog/60kqfdgb4f8kljqy1j4ujvaqr1bx5y-364pg-bskhw-3prkf (2024-05-16)
[^32^]: Decential — "Do Music NFTs Still Matter? My Journey with Catalog to Find Out" — https://www.decential.io/articles/do-music-nfts-still-matter-my-journey-with-catalog-to-find-out (2024)
[^33^]: ForkLog — "From music NFTs to AI content: how Web3 analogues of Spotify and SoundCloud work" — https://forklog.com/en/from-music-nfts-to-ai-content-how-web3-analogues-of-spotify-and-soundcloud-work/ (2024/25)
[^34^]: Crypto Briefing — "Solana Music nears launch, aims to disrupt Spotify with new platform" — https://cryptobriefing.com/solana-music-launch-spotify-challenger/ (2026-06)
[^35^]: Nina Protocol — wind-down notice (homepage) — https://www.ninaprotocol.com (accessed 2026-07-21)
[^36^]: Resident Advisor — "Next-gen streaming service Nina Protocol unveils mobile app" — https://ra.co/news/80797 (2024-06-13)
[^37^]: Decential — "Deeper and Harder to Show Off: The Ujo Experiment and On-Chain Music's Identity Crisis" — https://www.decential.io/articles/deeper-and-harder-to-show-off-the-ujo-experiment-and-on-chain-musics-identity-crisis (2025)
[^38^]: Digital Music News — "DJ 3LAU Breaks Sales Records with $11.6M in Sales During NFT Auction" — https://www.digitalmusicnews.com/2021/03/04/3lau-nft-sales-record/ (2021-03-04)
[^39^]: Billboard — "Kings of Leon NFTs Generate $2M in Sales & Benefit Crew Nation Fund" — https://www.billboard.com/pro/kings-of-leon-nft-sale-2-million-sales-crew-nation/ (2021-03-09)
[^40^]: Billboard — "3LAU Accused of Not Paying Songwriter Her Fair Share From Massive 'Ultraviolet' NFT Auction" — https://www.billboard.com/pro/3lau-nft-ultraviolet-auction-songwriter-sues-share-profits/ (2022-11-10)
[^41^]: Bitcoinist — "French Montana Becomes First Mainstream Artist To Inscribe Complete Song On Bitcoin" — https://bitcoinist.com/bitcoin-french-montana-unreleased-song-ordinals/ (2024-03)
[^42^]: Cointelegraph Magazine — "'Crypto is more taboo than OnlyFans': Violetta Zironi, who sold a song for 1 BTC" — https://cointelegraph.com/magazine/crypto-more-taboo-than-onlyfans-violetta-zironi-who-sold-song-for-1-btc/ (2025-04-17)
[^43^]: IssueWire — "Metaverse Radio Further Embraces the Blockchain in Announcing New Policy on Web3-Friendly Music" — https://www.issuewire.com/metaverse-radio-further-embraces-the-blockchain-in-announcing-new-policy-on-web3-friendly-music-1771983461779029 (2023-07-20)
[^44^]: kultur.art — "Onchain Music" — https://www.kultur.art/onchain-music/ (2023-08-06)
[^45^]: MIDiA Research — "The future of music: The rise of a counterculture industry" — https://www.midiaresearch.com/reports/the-future-of-music-the-rise-of-a-counterculture-industry (2022-06-30)
[^46^]: Xtrata — platform homepage — https://xtrata.xyz (accessed 2026-07-21)
[^47^]: nflo — "NFT glossary" (link rot / off-chain metadata risk) — https://nflo.tech/glossary/nft/ (2024)
[^48^]: TechCrunch — "Success with Rihanna's music rights helps web3 marketplace raise fresh VC round" (AnotherBlock) — https://techcrunch.com/2023/05/16/success-with-rihannas-music-rights-helps-web3-marketplace-raise-fresh-vc-round/ (2023-05-16)
[^49^]: IQ.wiki — "Violetta Zironi" — https://iq.wiki/wiki/violetta-zironi (2024-11)
[^50^]: ForkLog — "Ninjalerts Team Launches Super Nintendo Emulator on Bitcoin Blockchain" — https://forklog.com/en/ninjalerts-team-launches-super-nintendo-emulator-on-bitcoin-blockchain/ (2024-01-09)
[^51^]: Bitcoin Foundation — "What is Zora? The creator economy project taking over crypto in 2026" — https://bitcoinfoundation.org/news/analysis/what-is-zora-the-creator-economy-project-taking-over-crypto-in-2026/ (2026)
[^52^]: Cryptonews — Ordinals inscription statistics — https://cryptonews.net/news/nft/27664586/ (2023/24)
[^53^]: Miquido — "The Future of Music Royalty Management" — https://www.miquido.com/blog/future-of-music-royalty-management/ (2024)
[^54^]: ThatPitch — "Backend Royalty Payment Delays Explained" — https://thatpitch.com/blog/backend-royalty-payment-delays-explained/ (undated)

---

### Research integrity notes
- 16 search sessions / ~50 distinct queries were executed; 30+ sources were opened in full. Excerpts are verbatim where marked; a small number of excerpts recorded from pages fetched earlier in the session are marked "as recorded" with adjusted confidence.
- Notable conflicting evidence: Chartlex's 2026 post-mortem [^30^] states Sound.xyz "pivoted" to subscriptions (implying survival); the primary source (sound.xyz homepage, [^28^]) shows the platform fully offline as of 2026-01-16. The primary source is treated as authoritative (the pivot preceded the shutdown).
- "Firsts" in on-chain music are contested (Zironi "first full song + visual," French Montana "first mainstream artist complete song," Ratoshi "first interactive music engine," TRUTH "first recursive collection"); each is attributed to its source rather than asserted absolutely.
- Negative results worth noting: no public dedicated XTRATA FM page was found on xtrata.xyz (widget appears SDK/embed-distributed; XTRATA FM details are per founder briefing). No prior platform was found that stores multi-MB songs, player, and remix lineage fully on-chain — consistent with the founder's differentiation claim, within the limits of this search.
