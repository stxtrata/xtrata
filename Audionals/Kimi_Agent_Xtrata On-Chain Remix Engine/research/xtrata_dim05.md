# Xtrata Research — Dimension 05: NON-MUSIC Pain Points in Digital Permanence, Provenance & Platform Risk

**Date:** 2026-07-21 · **Prepared for:** Xtrata (xtrata.xyz) ideation — fully on-chain object platform on Stacks/Bitcoin
**Method:** Desk research; 12 search sessions / ~40 queries across the 7 assigned domains + incumbent-solution shortfalls. All claims below carry Claim / Source / URL / Date / Excerpt / Confidence. Citations are numbered [n] and listed at the end.
**Scope note:** Music is deliberately excluded. Each domain ends with (a) why incumbents fall short and (b) Xtrata feature-fit (object graphs, sponsored free claims, Bitcoin finality, on-chain reply threads, wallet-native ownership + market, open SDK).

---

## 1. Link Rot & Web Decay

### Evidence

**E1.1 — A quarter of the web (2013–2023) is gone.**
- **Claim:** 25% of all webpages that existed between 2013 and 2023 are no longer accessible; 38% of pages from 2013 have vanished. 23% of news pages and 21% of government pages contain at least one broken link; 54% of Wikipedia pages have at least one dead reference link; ~20% of tweets become inaccessible within months.
- **Source:** Pew Research Center, "When Online Content Disappears" (May 2024), via ISSN summary [1]; corroborated by CJR [5] and multiple secondary analyses [2][3]
- **URL:** https://www.issn.org/newsletter_issn/when-online-content-disappears/
- **Date:** 2024-06-19 (summary); study May 2024
- **Excerpt:** "Between 2013 and 2023, 25% of webpages vanished, with 38% from 2013 now inaccessible. Government and news websites frequently contain broken links, affecting 21% and 23% of pages, respectively. Wikipedia has 54% of pages with at least one dead reference link."
- **Confidence:** High (primary research institution, ~1M-page Common Crawl sample)

**E1.2 — Two-thirds of backlinks rot within ~a decade; citation rot infects law and academia.**
- **Claim:** Ahrefs (2024): 66.5% of links built since 2013 across 2M+ domains are dead (74.5% incl. errors). Zittrain/Albert/Lessig (Harvard): ~50% of URLs in U.S. Supreme Court opinions dead; ~70% of Harvard Law Review citations suffer reference rot; NYT deep links: 25% dead overall, 72% for 1998 URLs.
- **Source:** Ahrefs study summarized [2]; Zittrain et al. via [3]
- **URL:** https://www.tryanalyze.ai/blog/link-rot-study ; https://broken-links-checker.com/blog/how-often-check-broken-links
- **Date:** 2024 (Ahrefs); 2014/2021 (Harvard/NYT)
- **Excerpt:** "Ahrefs found that at least 66.5% of links pointing to more than 2 million sampled websites have rotted since January 2013… about 50% of URLs in U.S. Supreme Court opinions no longer led readers to the originally cited material."
- **Confidence:** High

**E1.3 — The Internet Archive itself is a single point of failure (attacks, breach, litigation, crawler decay).**
- **Claim:** Oct 2024: data breach of 31M user accounts + DDoS took archive.org/Wayback Machine offline; restored only in "provisional, read-only" mode (no new captures) for a period [4]. 2024–2025: repeated outages (May 2024 DDoS [5]; Mar 2025 power outage; Dec 2025 full outage) and a reported ~87% collapse in snapshots of major news homepages between May–Oct 2025 [7]. Legal pressure: 2nd Circuit ruled against controlled digital lending (Sept 2024) → permanent injunction, 500,000+ titles removed from lending; a $621M record-label suit over the Great 78 Project settled Sept 2025 [6].
- **Source:** The Verge [4]; Columbia Journalism Review [5]; ObscureIQ breach dossier [6]; CyberSec Guru [7]
- **URL:** https://www.theverge.com/2024/10/14/24269741/internet-archive-online-read-only-data-breach-outage ; https://www.cjr.org/the_media_today/internet-archive-attack-offline-history-library-wayback-machine-ddos.php
- **Date:** 2024-10-14; 2024-10; 2025-12
- **Excerpt:** "A data breach and DDoS attack kicked the site offline on October 9th, with a user authentication database containing 31 million unique records also stolen… back online in a 'provisional, read-only manner'… you can't currently capture an existing web page into the archive." [4]
- **Confidence:** High for breach/outages/litigation; Medium for the 87% crawler-decline figure (single trade-press source citing Nieman Lab)

**E1.4 — U.S. government data deletions (2025): thousands of pages and datasets removed on political instruction.**
- **Claim:** In the first days after Jan 20, 2025, >8,000 web pages across 12+ federal sites were taken down (vaccines, veterans' care, hate crimes, scientific research) per NYT analysis [8]; on Jan 31, 2025 CDC/FDA/HHS abruptly deleted health data (youth-risk surveillance, HIV prevention, contraception) [9][10]; >2,000 datasets disappeared from data.gov; globalchange.gov shut down; climate.gov stopped publishing after its staff was terminated; the CEJST environmental-justice tool was removed [12][13]. Courts intervened: TRO Feb 11, 2025; on July 3, 2025 Judge John Bates vacated the removal directives as "arbitrary and capricious" — but restoration was partial and carried political disclaimers [11].
- **Source:** NYT via SEJ [8]; Harvard T.H. Chan SPH [9]; Democracy 2025 tracker [10]; Fierce Healthcare [11]; Freie Universität Berlin library bulletin [12]; NPR [13]
- **URL:** https://www.sej.org/headlines/thousands-us-government-web-pages-have-been-taken-down-friday ; https://www.fiercehealthcare.com/regulatory/judge-vacates-trump-administrations-removal-health-web-pages ; https://www.npr.org/2025/08/08/nx-s1-5495338/climate-change-environment-websites-trump
- **Date:** 2025-02-02; 2025-07-07; 2025-08-08
- **Excerpt:** "More than 8,000 web pages across more than a dozen U.S. government websites have been taken down since Friday afternoon… The purges have removed information about vaccines, veterans' care, hate crimes and scientific research." [8] / "More than 2,000 datasets have disappeared from data.gov." [12]
- **Confidence:** High

### Why existing solutions fall short (Domain 1)
- **Cloud/hosting:** decay is the default — 25%/decade loss even without malice (E1.1); hosting bills stop, domains lapse, CMSs reorganize.
- **Internet Archive:** nonprofit single point of failure — DDoS/breach took it offline and read-only; litigation already forced removal of 500k+ books; crawlers degraded (E1.3). It also honors removal/modification at the source and gives no cryptographic proof of what a page said at time T.
- **Government restores:** court-ordered restorations are partial and can be captioned with disclaimers or re-removed later (E1.4); preservation depends on which administration holds power.
- **IPFS:** content persists only while someone pins it; nodes garbage-collect; "upload and share the CID" routinely rots (see Cross-cutting E8.1).
- **Arweave:** permanence is an untested-at-scale economic endowment with mining centralization and content cherry-picking concerns (E8.2), and it has no native ownership/graph/market semantics.

### Xtrata feature-fit (Domain 1)
- **Bitcoin finality + full-content inscription:** at-risk public records/datasets inscribed as objects become un-deletable by any agency, court order to a platform, or attacker — the 2025 purges are the canonical use case. Stacks-settled, Bitcoin-anchored permanence removes the "nonprofit under attack" failure mode.
- **Object graphs:** mirror a government site or dataset family as parent/child objects (collection → dataset → version), preserving structure and provenance, not just blobs; dependencies-without-ownership lets third parties (universities, NGOs) reference the canonical on-chain copy.
- **Sponsored free claims:** "rescueathons" (like Harvard's Jan 31 datathon) can inscribe at scale without volunteers buying STX — a killer adoption lever for civic data rescue.
- **Reply threads:** provenance disputes ("this version was altered") attach directly to the object, in-place, forever.
- **Open SDK:** lets EDGI/End-of-Term-style crawlers write directly on-chain.

---

## 2. Journalism & Censorship

### Evidence

**E2.1 — Platforms delete war-crime evidence at industrial scale.**
- **Claim:** YouTube's machine-learning removals erased an estimated 120,000–150,000 Syrian-conflict videos/channels documented by Syrian Archive; prominent documentation channel Shaam Network was terminated up to five times; even clearly newsworthy attack-footage was repeatedly removed without explanation.
- **Source:** WITNESS written submission to the UN Special Rapporteur (OHCHR), citing Syrian Archive [14]; academic chapter on Syrian Archive/Abounaddara [15]
- **URL:** https://www.ohchr.org/Documents/Issues/Opinion/ContentRegulation/Witness.pdf
- **Date:** 2017–2018 (submission); events 2017
- **Excerpt:** "…were being removed by YouTube at an astonishing pace—at the time, the Archive put the number between 120-150 thousand, and we continue to document removals… These removals are hampering some of the best documentation of war crimes and human rights abuses in Syria."
- **Confidence:** High (UN-published submission by the leading video-evidence NGO)

**E2.2 — Evidence standards now demand preservation-before-deletion + integrity hashing — infrastructure that doesn't exist at the point of upload.**
- **Claim:** The Berkeley Protocol on Digital Open Source Investigations (OHCHR + UC Berkeley HRC, launched Dec 1, 2020; updated 2022) is the first global standard for using social-media content as evidence in international criminal/human-rights investigations; it is actively used by Ukrainian prosecutors documenting Russian war crimes. It prescribes capturing content before deletion, cryptographic hashing for integrity, and chain-of-custody — today done ad hoc by NGOs.
- **Source:** UC Berkeley Human Rights Center [16]; UNRIC [17]
- **URL:** https://humanrights.berkeley.edu/berkeley-protocol-digital-open-source-investigations
- **Date:** 2020-12-01 launch; page accessed 2025-03
- **Excerpt:** "The Berkeley Protocol is actively in use by Ukrainian prosecutors documenting Russian war crimes… minimum professional standards for the identification, collection, preservation, verification, and analysis of digital open source information."
- **Confidence:** High

**E2.3 — Litigation and ownership changes scrub published journalism.**
- **Claim:** After the Thiel-funded Hogan verdict bankrupted Gawker, Univision bought the sites and in Sept 2016 deleted six posts across Gawker Media properties with the note "subject of pending litigation"; the bankruptcy settlement required three "true stories" to be "removed from the web"; lawyers objected that Thiel's later bid for Gawker.com's ~200,000-article archive was motivated by a desire to purge or eradicate it.
- **Source:** CBS/AP [18]; Variety [19]; Gawker Media history with Politico citation [20]
- **URL:** https://www.cbsnews.com/sanfrancisco/news/gawker-hulk-hogan-sex-tape-legal-settlement/ ; https://variety.com/2018/digital/news/tech-billionaire-peter-thiel-ends-bid-to-buy-gawker-com-1202786359/
- **Date:** 2016-09/2016-11; 2018-04
- **Excerpt:** "…as part of the settlement, three 'true stories' — about Hogan and two others who had also filed suit — are being 'removed from the web.'" [18]
- **Confidence:** High

**E2.4 — SLAPP suits are a documented, growing takedown industry.**
- **Claim:** CASE/Daphne Caruana Galizia Foundation 2025 report: 1,303 documented SLAPPs in Europe since 2010 (167 added in 2024), acknowledged "tip of the iceberg" because most censorship happens via pre-litigation threats; Croatia alone has 945 active lawsuits against media with €5.4M claimed. India, Sept 6, 2025: Adani Enterprises won an ex parte gag order forcing named journalists to delete articles within 36 hours and letting Adani flag further URLs for takedown without court vetting. UK Post Office/Horizon: 2015 legal threats to Computer Weekly delayed exposure of a national scandal for years.
- **Source:** Malta Independent on CASE 2025 report [21]; Inventiva on Adani order [22]; CASE European SLAPP Contest [23]; UK Parliament speech [24]
- **URL:** https://www.independent.com.mt/articles/2026-01-31/local-news/91-SLAPP-cases-filed-in-Malta-in-the-years-2010-2024-6736286856 ; https://www.inventiva.co.in/stories/the-game-of-defamation-in-the-biggest-democratic-nation-when-telling-the-truth-gets-you-a-lawsuit/
- **Date:** 2025 (CASE report); 2025-09-06 (Adani); 2024-11-21 (Commons speech)
- **Excerpt:** "[The order] demanded that existing articles and posts be taken down within 36 hours, and even empowered Adani to flag additional URLs for takedown without further court vetting." [22]
- **Confidence:** High for CASE counts and Horizon letters; Medium-High for Adani order details (single outlet, though widely reported)

**E2.5 — Post-publication integrity failure is real: fabrication discovered years later, archives patched with disclaimers.**
- **Claim:** Der Spiegel's Claas Relotius fabricated content across ~60 articles (at least 14 with significant fabrications) over years; the magazine kept articles online with disclaimers after the Dec 2018 exposure — an ad-hoc, centralized integrity fix.
- **Source:** Factual America dossier [25]; The Telegraph
- **URL:** https://www.factualamerica.com/byline-blunders/claas-relotius-der-spiegels-fabrication-scandal-shakes-journalisms-foundations
- **Date:** 2018-12 (scandal); dossier 2024-09
- **Excerpt:** "Der Spiegel made all of Relotius' articles available online with disclaimers about their compromised integrity."
- **Confidence:** High (widely documented scandal)

### Why existing solutions fall short (Domain 2)
- **Platforms (YouTube/Meta):** automated extremist-content classifiers destroy evidence faster than NGOs can mirror it (E2.1); takedown demands and ownership changes delete journalism (E2.3, E2.4).
- **Wayback Machine:** capturable only when online (read-only during the Oct 2024 crisis, E1.3), honors deletions, and is itself attackable/litigable; snapshots lack court-grade integrity proofs.
- **NGO archives (Syrian Archive, Mnemonic):** heroic but centralized, funding-fragile, and re-hosting strips native provenance; Berkeley-Protocol-grade hashing (E2.2) is bolted on, not native.
- **Legal remedies:** anti-SLAPP laws cover a minority of jurisdictions (only 8.5% of EU SLAPPs are cross-border under the directive) and do nothing for pre-litigation threat deletions.

### Xtrata feature-fit (Domain 2)
- **Permanence against compelled deletion:** an inscribed article/footage object cannot be 36-hour-gag-ordered off a server, ML-classified away, or deleted by a new owner. Directly answers E2.1, E2.3, E2.4.
- **Object graphs:** evidence packages as machine-readable chains — raw upload → hashed original → geolocation/verification metadata → translation → court exhibit — mirroring Berkeley Protocol requirements natively (E2.2). Dependencies-without-ownership let prosecutors cite a journalist's object without taking custody of it.
- **Reply threads:** corrections, right-of-reply, verification notes, and retraction/integrity flags attach to the original object instead of silently editing it (the anti-stealth-editing primitive; also the honest fix for E2.5).
- **Sponsored free claims:** newsrooms/NGOs can sponsor inscription for sources and whistleblowers who cannot (or safely cannot) hold crypto — critical in war zones and authoritarian contexts.
- **Wallet-native ownership:** authorship/attribution is a wallet signature at inscription time — provenance that survives platform death.

---

## 3. Science: Data Availability, Replication & Retraction

### Evidence

**E3.1 — Research data decays ~17% per year; "available on request" is a fiction.**
- **Claim:** Vines et al. (Current Biology, 2014), 516 studies aged 2–22 years: the odds of a dataset being extant fall ~17% per year; broken emails and obsolete storage were the main obstacles. A decade later, requests still mostly fail: replications of Wicherts et al. confirm "researchers are not keen on sharing data for reanalysis."
- **Source:** Vines et al. 2014 as summarized by Tampere University RDM guide [26]; PLOS ONE 2023 replication of Wicherts [28]
- **URL:** https://research.tuni.fi/uploads/2020/10/1e12eb53-research-data-management_basics_20200104_v2.pdf ; https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0284243
- **Date:** 2014 (study); 2023-04-13 (replication)
- **Excerpt:** "Timothy H. Vines et al. examined the availability of data from 516 studies between 2 and 22 years old and found that availability of the data was strongly affected by article age. 17% decline in data availability per year. Broken e-mails and obsolete storage devices were the main obstacles." [26]
- **Confidence:** High (landmark, widely replicated finding)

**E3.2 — Even with modern mandates, only about half of papers have actually accessible data.**
- **Claim:** Tedersoo et al. (2021): across journals, an average of only 54.2% of articles had accessible data prior to contact; >45% of non-badged microbiome papers claim "data available upon reasonable request" that "often never materialize."
- **Source:** Tedersoo et al. 2021 as cited in bioRxiv 2025 FAIR-standards paper [27]
- **URL:** https://www.biorxiv.org/content/10.1101/2025.02.06.636914v3.full
- **Date:** 2021 (study); 2025-07-01 (citing paper)
- **Excerpt:** "…consistent with proportions of data availability previously reported by Tedersoo et al. (2021), in which an average of only 54.2% articles had accessible data prior to contact."
- **Confidence:** High

**E3.3 — Retractions are surging, and retracted work keeps being cited as valid.**
- **Claim:** Retraction share rose from ~0.04% of publications in the early 2010s to ~0.2% by 2024; Retraction Watch Database holds ~55,000 retraction entries; 10,995 articles from publication-year 2022 alone had been retracted by May 2025. Post-retraction, 82% of biomedical retracted articles continue to be cited; only 4–6% of those citations acknowledge the retraction; >94% treat the work as still valid.
- **Source:** JMLIS review [29]; BMJ commentary [30]; Retraction Watch [31]; bioRxiv bibliometrics paper [32]
- **URL:** https://journals.sbmu.ac.ir/jmlis/article/download/48705/35366/254299 ; https://retractionwatch.com/2024/12/26/a-look-back-at-2024-at-retraction-watch-and-forward-to-2025/
- **Date:** 2024-12-26 (RW); review recent (2025)
- **Excerpt:** "…the proportion of retracted publications [rose] from about 0.04% in the early 2010s to 0.2% by 2024… Sharma et al. found that 82% of retracted articles in the biomedical sciences continued to be cited after their retraction… only 4% to 6% of such citations explicitly acknowledge the article's retracted status." [29]
- **Confidence:** High

### Why existing solutions fall short (Domain 3)
- **Institutional/lab storage:** dies with email accounts, grants, laptops — the 17%/yr decay is measured exactly there (E3.1).
- **Repositories (Dryad, Zenodo, ICPSR, OSF):** help only when used; "available on request" papers bypass them (E3.2); repository funding/policy can change; retraction metadata propagates inconsistently (E3.3: databases and link resolvers hide retraction status).
- **Publisher platforms:** the party that retracts also controls the record; preprints can be removed by server operators; version history is opaque.
- **IPFS/Arweave:** store bytes but have no native paper→data→code→review object model, no retraction layer, no identity of record.

### Xtrata feature-fit (Domain 3)
- **Object graphs are the core differentiator:** paper ↔ dataset ↔ code ↔ replication ↔ erratum as linked objects (parent/child with ownership for authors' outputs; dependencies without ownership for citing/replicating labs) — a machine-readable provenance graph that repositories approximate with DOI glue.
- **Reply threads as living retraction/errata layer:** a retraction notice attached as a reply to the original object is inseparable from it — attacks the "cited-as-valid" problem (E3.3) at the object level rather than hoping metadata propagates.
- **Permanence + Bitcoin finality:** datasets inscribed at publication can't succumb to the 17%/yr bit-rot (E3.1); timestamped preregistrations prove hypotheses existed before results.
- **Sponsored free claims:** journals, funders, or universities sponsor inscription fees for authors — removes the "who pays gas" barrier for global-south researchers.
- **Market/ownership:** optional data-licensing primitives (paid access to datasets with provenance) are native.

---

## 4. Legal / Notarization & Evidence

### Evidence

**E4.1 — Blockchain evidence is already admissible and used at scale in China; cost advantage is ~100x.**
- **Claim:** June 28, 2018: Hangzhou Internet Court (Huatai Yimei v. Daotong Technology) became the first to accept blockchain-preserved evidence (hashes anchored to Factom + Bitcoin) in a copyright case; Sept 2018: China's Supreme People's Court codified admissibility of e-evidence "collected through electronic signature, trusted timestamping, hash value verification, blockchain" across internet courts; June 2018–Aug 2023: 1,430 IP cases involved blockchain evidence. Cost: notarizing 100 pages ≈ RMB 1,000–2,000 (US$140–280) vs blockchain deposition ≈ RMB 10 (US$1.4).
- **Source:** China Justice Observer [33]; Duke Judicature [34]; Managing IP [35]; ScienceDirect study [36]
- **URL:** https://www.chinajusticeobserver.com/a/how-chinese-courts-review-electronic-evidence-stored-on-blockchain ; https://www.managingip.com/article/2a5bqo2drurt0bwowkq20/china-patent-courts-respond-positively-to-blockchain-evidence
- **Date:** 2018-06-28 (case); 2018-09 (SPC provisions); 2024 (1,430-case study)
- **Excerpt:** "Notarisation of 100 pages of documents or screenshots of webpages could cost at least RMB 1,000 to 2,000 (USD140 to 280), while blockchain deposition services would cost as little as RMB 10 (USD1.4)." [35]
- **Confidence:** High

**E4.2 — U.S. states and the EU give blockchain timestamps legal force.**
- **Claim:** Vermont 12 V.S.A. §1913 makes blockchain records self-authenticating with a qualified-person declaration; Arizona HB 2417 and statutes in Nevada/Delaware/Texas recognize blockchain records/signatures; under FRE 901(b)(9)/902(13)-(14), blockchain evidence is admitted with authentication (machine-generated ledger data treated as non-hearsay per Lizarraga-Tirado). EU eIDAS Art. 41 gives qualified electronic timestamps a legal presumption of accuracy and integrity; Guardtime aligned KSI timestamping with eIDAS qualified requirements.
- **Source:** TRM Labs admissibility guide [37]; PubScience [38]; Theseus thesis on KSI [40]
- **URL:** https://www.trmlabs.com/resources/blog/building-strong-cases-with-blockchain-evidence-admissibility-chain-of-custody-experts-and-court-ready-reporting ; https://www.pubscience.org/blog/blockchain-evidence-in-court
- **Date:** 2026 (guides); statutes 2016–2021
- **Excerpt:** "Under Vermont law, a digital record stored in a blockchain would be considered to be self-authenticating if it is accompanied by a written declaration from a 'qualified person' made under oath." (also at [37])
- **Confidence:** High

**E4.3 — Production precedent: Estonia has run national records on Guardtime KSI since 2008/2012.**
- **Claim:** Estonia uses KSI blockchain for integrity verification of healthcare (>1M patient records), property, business, succession, e-court, surveillance, and state-gazette registries; Guardtime KSI has run continuously since April 2008; the model anchors hashes, not personal data, turning auditability into a cryptographic property.
- **Source:** GlobeNewswire/Guardtime [39]; AIMultiple case-study roundup; Theseus thesis [40]
- **URL:** https://www.globenewswire.com/news-release/2016/03/03/1202115/0/en/Estonian-Government-Guardtime-Accelerate-Adoption-of-Blockchain-Technology-to-Secure-1M-Patient-Health-Records.html
- **Date:** 2016-03-03 (announcement); KSI in production since 2008/2012
- **Excerpt:** "Guardtime's KSI blockchain has been continuously running since April 2008, and is purpose-built for massive-scale integrity instrumentation of any type of data at rest."
- **Confidence:** High

**E4.4 — Commercial timestamping is a proven business (OriginStamp: 60M+ timestamps).**
- **Claim:** OriginStamp reports 60+ million blockchain timestamps created since 2013 across 100,000+ transactions, anchored to Bitcoin and Ethereum, marketed for legal proof, AI provenance, and compliance; it argues centralized RFC 3161 TSAs are weak because validity dies with the issuing authority.
- **Source:** OriginStamp product page [41]; OriginStamp TSA explainer [42]
- **URL:** https://originstamp.com/en/timestamp
- **Date:** accessed 2025-09+
- **Excerpt:** "60+ Mio. blockchain timestamps created since 2013… A TSA timestamp is only valid as long as the issuing authority's public key remains secure and recognized. A blockchain timestamp outlives any single organization." [41][42]
- **Confidence:** High (vendor self-report for the volume claim; directionally reliable)

### Why existing solutions fall short (Domain 4)
- **Traditional notaries/TSAs:** expensive per-document (~100x, E4.1), business-hours, jurisdiction-bound, cannot detect altered interior pages of a document, and their certificates expire with the authority (E4.4).
- **Hash-only blockchain notarization (PoE, OriginStamp, OpenTimestamps, KSI):** proves existence/integrity of a hash — but the content itself still lives in a CLM, server, or government DB that can be lost, breached, or deleted; the "proof" then authenticates nothing anyone can still retrieve.
- **Private/permissioned chains (KSI, judicial chains):** vendor- and state-controlled validators; collusion/compromise of the operator undermines the trust model (noted in academic critiques of e-Estonia deployments).

### Xtrata feature-fit (Domain 4)
- **Content + timestamp on-chain, not just hash:** Xtrata inscribes the object itself with Bitcoin finality — evidence is self-retrieving decades later, a strict superset of PoE/OpenTimestamps semantics, on a public chain (vs. permissioned KSI).
- **Object graphs = chain of custody as data:** custody transfers, attestations, and versions become machine-readable links instead of PDF certificates filed in email.
- **Reply threads:** counterparty attestation, challenges, and judicial annotations attach to the object.
- **Sponsored transactions:** a law firm or platform can sponsor clients' notarizations — users never touch crypto, matching the "zero blockchain expertise" pitch that made OriginStamp successful.
- **Wallet-native ownership:** dual function as ownership registry (IP priority, contracts) with transfer/market built in.

---

## 5. AI Provenance & Synthetic Media

### Evidence

**E5.1 — Deepfake fraud is exploding; detection is losing.**
- **Claim:** Deepfake-enabled fraud incidents rose ~40x between 2022 and 2024 (Sumsub); Deloitte projects U.S. genAI-facilitated fraud losses of $40B/yr by 2027 (from $12.3B in 2023); fintech deepfake incidents +700% YoY in 2023; documented losses: Arup HK$200M/US$25M video-conference scam (2024); FBI IC3 2025 report: 4,400 investment-fraud complaints referencing AI with $632M losses (first dedicated AI section).
- **Source:** arXiv "Why Media Forensics Needs Social Theories" [45]; arXiv AI-incident classification (IC3 data) [46]; arXiv identity-verification paper
- **URL:** https://arxiv.org/html/2605.09007v1 ; https://arxiv.org/html/2604.21412v3
- **Date:** 2024–2026 (papers); underlying reports 2023–2025
- **Excerpt:** "…deepfake-enabled fraud incidents rose roughly 40-fold between 2022 and 2024, with projected losses from generative AI-facilitated fraud in the United States alone expected to reach $40 billion annually by 2027." [45]
- **Confidence:** High for Arup/IC3; Medium-High for the 40x and $40B figures (industry reports cited academically)

**E5.2 — C2PA signing has scaled, but the provenance record dies in distribution.**
- **Claim:** By Jan 2026 the Content Authenticity Initiative counts 6,000+ members (3,500+ orgs by 2025); C2PA signing is shipping in Leica/Sony/Nikon/Canon cameras, Google Pixel 10 (first smartphone at top-tier C2PA conformance), Samsung Galaxy S25 (AI edits), Adobe CC/Firefly, Microsoft M365, OpenAI; TikTok labeled 1.3B+ videos. But: social platforms strip embedded metadata — including C2PA manifests — during upload/transcoding, creating "the largest gap between signing infrastructure and verification reality in any major technical standard."
- **Source:** AIBuzz 2026 adoption analysis [43]; Webcite developer guide [44]; arXiv provenance-signals paper
- **URL:** https://aibuzz.blog/ai-watermarking-vs-metadata-vs-fingerprinting/ ; https://webcite.co/blog/c2pa-content-credentials-developer-guide/
- **Date:** 2026-06-21; 2026-01-26
- **Excerpt:** "Social media platforms strip embedded metadata — including C2PA manifests — during upload, transcoding, and re-encoding… Most platforms strip embedded metadata during processing, removing C2PA manifests before viewers see them." [43]
- **Confidence:** Medium-High (specialist blogs; consistent with academic assessments of C2PA fragility)

**E5.3 — Courts now force AI companies to preserve data they promised to delete.**
- **Claim:** In NYT v. OpenAI (filed Dec 2023): April 2025 — judge denied OpenAI's motion to dismiss; May 13, 2025 — Magistrate Judge Ona T. Wang ordered OpenAI to "preserve and segregate all output log data that would otherwise be deleted," covering deleted/temporary chats for hundreds of millions of users (disclosed to users only June 5); OpenAI was separately ordered to hand over 20M de-identified ChatGPT logs; Oct 9, 2025 — the forward-looking order was lifted, but everything already preserved remains accessible to NYT.
- **Source:** VentureBeat [47]; PCMag [48]; Raymond James legal-tech digest [49]; MK.com.au analysis
- **URL:** https://venturebeat.com/ai/sam-altman-calls-for-ai-privilege-as-openai-clarifies-court-order-to-retain-temporary-and-deleted-chatgpt-sessions/ ; https://www.pcmag.com/news/you-can-now-permanently-delete-your-chatgpt-conversations-again
- **Date:** 2025-06-06; 2025-10-11
- **Excerpt:** "The order… requires OpenAI to 'preserve and segregate all output log data that would otherwise be deleted on a going forward basis,' including chats deleted by user request or due to privacy obligations." [47]
- **Confidence:** High

### Why existing solutions fall short (Domain 5)
- **C2PA/Content Credentials:** the manifest is metadata — stripped by the very platforms where fakes spread (E5.2); no canonical, independent registry of record; "signed" is meaningless if verifiers can't find the manifest.
- **Watermarking/SynthID:** vendor-specific, degradable, non-public verification.
- **Detection models:** losing the arms race (accuracy drops on new generators, E5.1 sources); post-hoc probabilistic judgment instead of positive provenance.
- **Platform data retention:** the NYT order shows "delete" doesn't mean delete (E5.3) — user-facing permanence promises are unverifiable and legally voidable; conversely there is no user-owned permanent copy.
- **Hash-only anchoring:** proves a hash existed but the media file still lives on perishable infra.

### Xtrata feature-fit (Domain 5)
- **On-chain manifest of record:** inscribe the content hash + C2PA-equivalent claims as an object — immune to metadata stripping, publicly verifiable forever, no dependence on any camera vendor, platform, or CA.
- **Human-made-content proof:** creators sign at capture/publication from their wallet → a positive "verifiably human-authored" claim with timestamp; pairs with a native market where provenance-rich (human) works can command a premium.
- **Object graphs:** edit lineage (original → edit → composite) and AI-disclosure children (model, prompt class, license) as machine-readable structure; dependencies-without-ownership let platforms reference the canonical object.
- **Reply threads:** community fact-checks and provenance disputes co-locate with the object.
- **Sponsored free claims:** camera apps, news wires, or UGC platforms sponsor inscription so provenance is default-on for users.

---

## 6. Gaming & Digital Goods

### Evidence

**E6.1 — The Crew: a paid product erased; sparked lawsuits and a 1.3M-signature EU citizens' initiative.**
- **Claim:** Ubisoft delisted The Crew (Dec 2023), killed its servers (Mar 31, 2024), then revoked licenses from owners' accounts without refunds (Apr 2024) — position: customers bought "limited access," not ownership. Consequences: Nov 2024 U.S. class action; Mar 2026 UFC-Que Choisir (France's top consumer group) lawsuit alleging misleading sale and abusive clauses; Stop Killing Games ECI passed 1.3M verified signatures → mandatory European Commission review (findings expected ~end of July 2026) and an EU Parliament hearing. California passed a law forcing storefronts to disclose that buyers get licenses, not ownership.
- **Source:** GameDeveloper/Reuters [50]; Eurogamer [51]; Culture.org on Ubisoft shareholder meeting [52]; MassivelyOP on CA law [59]
- **URL:** https://www.gamedeveloper.com/business/french-consumer-group-sues-ubisoft-over-shutdown-of-the-crew ; https://www.eurogamer.net/ubisoft-sued-over-controversial-the-crew-shutdown
- **Date:** 2024-11-12; 2026-03-31/04-01
- **Excerpt:** "In April 2024, players started to receive a notification that their game license was being revoked without issuing refunds… A citizens' initiative was launched in 2024 and presented to the European Commission last month with more than 1.3 [million] signatures." [50]
- **Confidence:** High

**E6.2 — 87% of classic games are commercially unavailable — worse than silent film.**
- **Claim:** VGHF + Software Preservation Network (2023, n=1,500, ±2.5%): only 13.27% of pre-2010 U.S. games remain in print; Commodore 64: 4.5%; pre-1985: 2.59%; the 3DS eShop closure alone wiped out more than half of commercially available Game Boy games. "For accessing nearly 9 in 10 classic games, there are few options: …vintage hardware, …a library, or… piracy."
- **Source:** Video Game History Foundation study page [53]; Game World Observer [54]; AV Club
- **URL:** https://gamehistory.org/87percent/
- **Date:** 2023-07
- **Excerpt:** "87% of classic video games released in the United States are critically endangered… Just 13% of video game history is being represented in the current marketplace."
- **Confidence:** High (rigorous sampling methodology, widely cited)

**E6.3 — Platform death kills whole media forms: Flash.**
- **Claim:** Adobe Flash EOL (Dec 31, 2020) orphaned an entire creative era; volunteer-run Flashpoint had archived 38,000+ games by early 2020 (288GB) and reports 200,000+ games/animations preserved across 100+ web technologies by 2025 — preservation depends entirely on unpaid volunteers operating in a copyright gray zone, with opt-out takedowns honored.
- **Source:** BleepingComputer [55]; Boing Boing [56]
- **URL:** https://www.bleepingcomputer.com/news/gaming/38-000-flash-games-archived-for-offline-play-and-preservation/ ; https://boingboing.net/2025/06/16/old-adobe-flash-games-preserved-by-flashpoint-archive.html
- **Date:** 2020; 2025-06-16
- **Excerpt:** "Since December 2017, over 200,000 games and animations have been preserved across more than a hundred browser plugins and web technologies." [56]
- **Confidence:** High

**E6.4 — P.T.: even a free, critically acclaimed artifact can be made un-reacquirable.**
- **Claim:** Konami delisted P.T. (Silent Hills demo) from PSN on Apr 29, 2015 and engineered a block on re-downloads for existing owners; PS4s with P.T. installed sold for $1,000–$1,500; fan remakes are routinely shut down; PS5 transfer path was also cut.
- **Source:** Den of Geek [57]; GamingBolt (with ex-Konami staffer account) [58]
- **URL:** https://www.denofgeek.com/games/silent-hills-is-the-best-video-game-never-made/ ; https://gamingbolt.com/remembering-p-t-the-incredible-horror-teaser
- **Date:** 2015 (events); articles 2022–2024
- **Excerpt:** "'We'd already gone through a lot to get it set up… And then to add the request to block redownload? More engineering workarounds.' …PS4 consoles that had the demo installed were selling for $1000 to $1500 online." [58]
- **Confidence:** High

### Why existing solutions fall short (Domain 6)
- **The market won't preserve (E6.2):** rights-holders delist when licensing/servers cost more than revenue; EULAs formalize revocability (E6.1).
- **Libraries/archives:** blocked by copyright law (DMCA anti-circumvention; ESA lobbying) — VGHF explicitly frames it as "policy failure," not market failure.
- **Fan preservation (Flashpoint, private servers):** legally gray, takedown-vulnerable, volunteer-fragile, and provenance-poor (which build? whose mod?).
- **Cloud gaming/streaming:** maximizes platform risk — the artifact never touches user hardware at all.
- **IPFS/Arweave:** can host ROMs but solve neither legitimacy (ownership proof) nor discovery/trust; no distinction between authentic original and tampered build; no marketplace for verifiably owned items.

### Xtrata feature-fit (Domain 6)
- **Wallet-native ownership + market is the headline here:** on-chain items survive publisher shutdown and remain transferable/sellable — the direct counterfactual to license revocation (E6.1) and to the $1,500-PS4 absurdity (E6.4). "Stop Killing Games" is fundamentally an ownership-permanence demand.
- **Object graphs:** game → patch → DLC → mod → fan-restoration lineage with clear ownership vs. dependency links — provenance for preservation (which is the authentic build?) that torrents and Flashpoint lack.
- **Sponsored free claims:** preservation groups (VGHF-style) or studios can sponsor claims so players/archivists preserve at zero cost — important for mass ingestion of at-risk catalogs.
- **Reply threads:** community verification, compatibility notes, restoration instructions co-located with the object.
- **Caveat:** Xtrata can't legalize hosting others' IP; strongest near-term angle is provenance/ownership layer + preservation of own-rights content (indie devs inscribing their own games, demos, source drops).

---

## 7. Personal Legacy & Digital Estate

### Evidence

**E7.1 — Without advance setup, families are locked out; court orders are slow and "not always successful."**
- **Claim:** Apple iCloud data (photos, messages) without a pre-designated Legacy Contact requires a court order — "a process that can take months and is not always successful"; Google/Meta offer legacy tools only if configured before death; Microsoft/Yahoo have no true legacy contact. MFA on the deceased's phone is the practical wall: lose the device/SIM and you're locked out regardless of passwords.
- **Source:** Legacy Options estate-practice guide [60]; Afterloss UK platform guide [61]
- **URL:** https://www.legacyoptions.com/post/managing-digital-accounts-after-a-death ; https://www.afterloss.uk/guides/digital-legacy
- **Date:** 2026-07 (guides); laws/policies current
- **Excerpt:** "Without that advance designation, access requires a court order, a process that can take months and is not always successful." [60] / "If the phone is wiped, returned to a network provider, or the SIM is cancelled, you lose access to that second factor. At that point, you are locked out of most accounts regardless of whether you have the password." [61]
- **Confidence:** High (consistent across estate-law and official platform documentation)

**E7.2 — "Priceless family memories are permanently lost" is the documented default outcome; licenses die with the buyer.**
- **Claim:** UK estate case study: executor locked out of deceased's iCloud → "The result: priceless family memories are permanently lost." Australia's eSafety Commissioner: "Many assets in digital form don't actually belong to you, even though you may have paid real money for them. You may have just bought a licence for the term of your life." RUFADAA limits executors without prior written authorization to "catalogue" access (metadata, not content).
- **Source:** Town & Country Law [62]; eSafety Commissioner [73]; Legacy Options on RUFADAA [60]
- **URL:** https://townandcountrylaw.legal/what-happens-to-your-digital-photos-emails-and-online-accounts-after-you-die-in-the-uk/ ; https://www.esafety.gov.au/key-topics/digital-wellbeing/what-happens-to-your-digital-accounts-after-you-die
- **Date:** 2025-09-02; 2023-11
- **Excerpt:** "Emma passes away, leaving thousands of family photos stored on her Apple iCloud account… Despite requests, Apple refuses access without a prior arrangement. The result: priceless family memories are permanently lost." [62]
- **Confidence:** High (illustrative case study + official regulator guidance)

**E7.3 — Dead-man's-switch demand is real (journalists, whistleblowers, crypto holders) but today's implementations are fragile.**
- **Claim:** DMS services run a check-in loop that auto-delivers encrypted files on missed check-ins; documented user classes include investigative journalists (release research if silenced/imprisoned/killed), whistleblowers, and crypto holders passing seed phrases. Failure modes: false triggers (travel/hospital/spam filters) and privacy concentration (your most sensitive documents sit in one vendor's store awaiting release). Password managers don't solve inheritance: LastPass/Bitwarden require the recipient to be a user and use timers, not death detection; Dashlane removed emergency access; 1Password relies on a printed Emergency Kit. Attackers now exploit the inheritance flow itself (Oct 2025 phishing campaign faking death notices against LastPass legacy requests); LastPass's 2022 breach already exposed encrypted vaults.
- **Source:** Killswitch guides [63][64]; Funeral.com consumer guide [65]; Malwarebytes [66]
- **URL:** https://killswitch.app/blog/what-is-a-deadman-switch-a-complete-guide-to-digital-estate-planning ; https://www.malwarebytes.com/blog/news/2025/10/phishing-scam-uses-fake-death-notices-to-trick-lastpass-users
- **Date:** 2026-01-21; 2025-10-27
- **Excerpt:** "Journalists protecting sensitive sources use deadman switches as insurance. If a journalist is silenced, imprisoned, or killed, their research and source materials automatically release to editors or legal counsel." [63]
- **Confidence:** High (mechanics and threats well documented; vendor-authored for feature comparisons — used only for factual mechanics)

**E7.4 — ~4 million BTC are estimated lost forever, much of it via death/lost keys.**
- **Claim:** Chainalysis (2017) concluded nearly 4 million of 21M bitcoins are lost forever; Fortune's follow-up describes "lost whales" — early holders who "have likely died or lost the key to their wallets."
- **Source:** Fortune (China edition), Oct 2018, citing Chainalysis [67]
- **URL:** http://www.fortunechina.com/investing/c/2018-10/22/content_317942.htm
- **Date:** 2018-10-22 (study Nov 2017)
- **Excerpt:** "a study by Chainalysis concluded that nearly 4 million Bitcoins, of a total supply that will one day equal 21 million, are lost forever."
- **Confidence:** Medium-High (2017-era estimate; directionally accepted)

### Why existing solutions fall short (Domain 7)
- **Platform legacy tools:** opt-in, per-platform, revocable by ToS change, and worthless if unconfigured (E7.1, E7.2); content is licensed, not owned, so it dies with the subscriber (E7.2).
- **Password managers:** credentials ≠ estate; recipients must be users; no file delivery, no incapacitation detection (E7.3).
- **DMS startups:** the service must outlive the user — a startup's shutdown silently kills the switch; plaintext-at-vendor risk; email deliverability as single failure channel (E7.3).
- **Self-custody:** no provider to compel; seed lost = assets lost (E7.4); heirs face a hostile UX.
- **IPFS/Arweave:** no ownership transfer semantics, no beneficiary logic, no dead-man trigger; a pinned folder is not an estate plan.

### Xtrata feature-fit (Domain 7)
- **Permanence that outlives vendors:** legacy letters, photo archives, wills' hash proofs, and instructions inscribed as objects can't be lost when a startup dies or a platform locks an account.
- **Wallet-native ownership:** the inheritance primitive — assets and objects transfer by key/beneficiary arrangements (multisig, heir wallets) rather than by petitioning Apple with a death certificate; pairs naturally with the on-chain market for assets of value.
- **Sponsored free claims:** estate lawyers/services sponsor client inscriptions — no crypto UX for grieving families.
- **Object graphs:** an estate as a structured tree (person → documents → assets → instructions) instead of a shoebox of PDFs.
- **Reply threads:** executors/family annotations over time.
- **Caveat:** Xtrata has no native dead-man trigger — it needs an oracle/service layer (the trigger stays off-chain); this is an SDK opportunity, not a core-protocol feature. Honest scoping matters here.

---

## 8. Cross-Cutting: Why the Incumbent Storage Stack Falls Short (evidence)

**E8.1 — IPFS does not guarantee persistence.**
- **Claim:** Content on IPFS survives only while pinned; node restarts, automatic garbage collection, and misconfigured pin types routinely make "permanent" CIDs unavailable. Professional pinning = recurring cost and re-centralization.
- **Source:** Tarlo pinning troubleshooting [69]; Filebase "Stop Misusing IPFS" [70]
- **URL:** https://tarlo.app/blog/why-ipfs-pins-keep-disappearing/ ; https://filebase.com/blog/stop-misusing-ipfs-5-real-mistakes-and-how-to-actually-avoid-them/
- **Date:** 2025-08-12; 2025-04-18
- **Excerpt:** "content only stays available as long as someone is actively pinning it… If every node that has your content decides to unpin it or goes offline, your content disappears—even though the hash still exists." [69]
- **Confidence:** High (matches IPFS's own documented model)

**E8.2 — Arweave's "pay once, store forever" is an unproven economic bet with centralization and content-selection issues.**
- **Claim:** Criticisms: storage endowment "untested at scale"; mining-pool concentration; Proof-of-Access can incentivize cherry-picking popular data, deprioritizing less popular content; growing blockweave raises node hardware requirements; permanent illegal-content exposure creates regulatory risk.
- **Source:** BestDapps deep dive [71]
- **URL:** https://bestdapps.com/blogs/news/a-deepdive-into-ar-2025
- **Date:** 2025-01-22
- **Excerpt:** "Arweave's 'pay once, store forever' model hinges on upfront fees sustained by its 'Storage Endowment.' Critics argue that this economic model remains untested at scale… miners [may] cherry-pick stored data that optimizes access rewards, potentially deprioritizing less popular yet valuable content."
- **Confidence:** Medium (single analytical source; consistent with common critiques)
- **Xtrata contrast:** permanence rides on Bitcoin's security budget (the most battle-tested finality in existence) rather than a bespoke endowment; object ownership, graphs, threads, and a market are native rather than nonexistent.

**E8.3 — Traditional notarization vs. blockchain timestamping.**
- **Claim:** Traditional notary: $5–$25+/document, appointments, business hours, signature-page scope only, no interior-tamper detection, records die with the notary/registry. Blockchain timestamp: ~free/instant/24-7, whole-file scope, independently verifiable.
- **Source:** Evercert comparison [72]; Managing IP cost data [35]
- **URL:** https://evercert.io/blog/blockchain-notarization-vs-traditional
- **Date:** 2026-02-16
- **Excerpt:** "Blockchain timestamping does not verify the identity of the person who created or submitted the document… only that the exact file existed at the recorded time."
- **Confidence:** Medium-High (vendor comparison; consistent with [35] court-cost data)

---

## 9. Most Promising Non-Music Use-Case Domains for Xtrata (ranked)

Ranking weighs: documented acuteness of pain (evidence above), fit of Xtrata's *specific* features (not generic "blockchain"), willingness/ability to pay or sponsor, competitive vacuum, and timing.

### #1 — Journalism & human-rights evidence preservation (war-zone evidence, SLAPP-resistant publishing)
**Why:** The pain is existential and documented at scale (120–150k evidence videos deleted [E2.1]; gag orders with 36-hour takedowns [E2.4]; bought-and-purged archives [E2.3]). Incumbents are structurally unable to solve it: platforms cause the deletions; the Wayback Machine is attackable and litigation-bound; NGO archives are centralized and funding-fragile. Xtrata's full stack maps 1:1 — permanence against compelled deletion, object graphs as native Berkeley-Protocol evidence chains [E2.2], reply threads as corrections/right-of-reply, wallet signatures as authorship. **Sponsored free claims are decisive** here: sources/activists cannot be asked to buy crypto. Timing: EU anti-SLAPP directive transposition deadline May 2026 keeps the topic hot. *Watch-out:* unmoderatable permanence demands a clear abuse/illegal-content policy story.

### #2 — Civic/government data rescue and public-record permanence
**Why:** 2025 proved that public data is politically perishable: 8,000+ pages [E1.4a], 2,000+ datasets [E1.4b], agency tools and sites shut down — with court-ordered restorations partial and disclaimered. The rescue infrastructure (End of Term Archive, EDGI, datathons) exists and is motivated but writes to perishable storage. Xtrata = the un-deletable target for rescue crawls, with graphs preserving dataset families/versions and sponsored claims enabling mass volunteer ingestion. Adjacent: Estonia-KSI-style integrity anchoring [E4.3] shows governments themselves buy this property. *Watch-out:* data size limits; position for high-value, small-footprint public-interest records first.

### #3 — Legal notarization, timestamping & evidence-of-record (content-inclusive)
**Why:** Proven, paying market: 60M+ OriginStamp timestamps [E4.4], Chinese courts at 1,430 cases with ~100x cost advantage over notaries [E4.1], self-authenticating statutes in Vermont/Arizona [E4.2]. Xtrata's differentiator vs. all incumbents: the *content itself* on-chain with Bitcoin finality (evidence is self-retrieving, not hash-pointing-to-a-lost-file), plus graphs as machine-readable chain-of-custody and reply threads as attestation. Open SDK slots into DMS/CLM/e-discovery tools; sponsored transactions make client-facing notarization crypto-free. *Watch-out:* per-object cost/size constraints vs. hash-only competitors; target high-value documents where full-content permanence justifies cost.

### #4 — Scientific record: datasets, preregistration, and the retraction layer
**Why:** Decay (17%/yr [E3.1]), 54% accessibility [E3.2], and the retracted-but-cited-as-valid problem (82%, only 4–6% flag retraction [E3.3]) are measured, unsolved failures. The paper→data→code→replication graph is Xtrata's object-graph home turf; reply threads = inseparable errata/retraction notices; sponsor = journal/funder. *Watch-out:* academic adoption cycles are slow; storage cost limits raw-data scope — best entry is preregistrations, replication packages, and high-value small datasets.

### #5 — AI-era provenance: on-chain manifest of record + verifiable human-made content
**Why:** Fraud economics are enormous ($40B by 2027 projection [E5.1]) and C2PA's fatal gap — manifests stripped in distribution [E5.2] — is exactly what an on-chain manifest of record fixes. Positive provenance ("provably human-authored, signed at time T") is a new asset class with a native market on Xtrata. *Watch-out:* crowded standards landscape (C2PA/SynthID); Xtrata should position as the neutral persistence/verification anchor for C2PA manifests rather than a competing metadata standard.

### #6 — Gaming/digital-goods ownership & preservation layer
**Why:** Passionate, mobilized demand (1.3M-signature ECI [E6.1]) and catastrophic cultural loss (87% unavailable [E6.2]; Flash era [E6.3]; P.T. [E6.4]). Xtrata's wallet-native ownership + market is the only stack that directly answers license revocation. *Watch-out:* IP law blocks hosting others' games; realistic wedge = ownership/provenance of on-chain-native items and indie devs inscribing their own works, plus preservation metadata/lineage graphs. Ranked below #1–5 on near-term feasibility despite massive sentiment.

### #7 — Personal legacy / digital estate objects
**Why:** Real, universal pain (court orders, locked iClouds, lost photo archives [E7.1–E7.2]; ~4M lost BTC [E7.4]) and a natural ownership-transfer story. *Watch-out:* no native dead-man trigger (oracle/SDK layer needed), consumer trust and key-management UX are hard, and incumbents' tools are "good enough" only if pre-configured. Best approached via partners (estate services sponsoring claims) rather than direct-to-consumer. Ranked last on execution risk, not on pain.

---

## 10. Numbered Citations

1. ISSN, "When Online Content Disappears" (Pew Research Center study summary), 2024-06-19 — https://www.issn.org/newsletter_issn/when-online-content-disappears/
2. TryAnalyze, "Link Rot: Analysis Shows 66.5% of Links Are Dead" (Pew + Ahrefs data), accessed 2026 — https://www.tryanalyze.ai/blog/link-rot-study
3. Broken-Links-Checker, "How Often Should You Check for Broken Links?" (Zittrain/Harvard, NYT deep-link rot), accessed 2026 — https://broken-links-checker.com/blog/how-often-check-broken-links
4. The Verge, "The Internet Archive is back as a read-only service after cyberattacks," 2024-10-14 — https://www.theverge.com/2024/10/14/24269741/internet-archive-online-read-only-data-breach-outage
5. Columbia Journalism Review, "The organization that safeguards the internet's history is under attack," 2024-10 — https://www.cjr.org/the_media_today/internet-archive-attack-offline-history-library-wayback-machine-ddos.php
6. ObscureIQ, "Internet Archive (Wayback Machine) Breach (2024)" dossier, 2026 — https://www.obscureiq.com/circulating-data-breach/internet-archive-2024-m8i/
7. The CyberSec Guru, "Internet Archive Down: Wayback Machine Offline Amid New Outage," 2025-12-22 — https://thecybersecguru.com/news/internet-archive-down-wayback-machine-outage/
8. Society of Environmental Journalists (citing NYT analysis), "Thousands of U.S. Government Web Pages Have Been Taken Down Since Friday," 2025-02-03 — https://www.sej.org/headlines/thousands-us-government-web-pages-have-been-taken-down-friday
9. Harvard T.H. Chan School of Public Health, "As health data disappear from government websites, experts push back," 2025-02-05 — https://hsph.harvard.edu/news/as-health-data-disappear-from-government-websites-experts-push-back/
10. Democracy 2025 Response Center, "Removal of health data from CDC, FDA, HHS websites," 2025-01-31 — https://www.democracy2025.org/response-center/lvc43m
11. Fierce Healthcare, "Judge vacates Trump administration's removal of health web pages," 2025-07-07 — https://www.fiercehealthcare.com/regulatory/judge-vacates-trump-administrations-removal-health-web-pages
12. Freie Universität Berlin (Earth Sciences Library), "Disappearing data – Trump administration removes climate information from government websites," 2025-03-06 — https://www.geo.fu-berlin.de/en/bibliotheken/Aktuelles/Verschwindende-Daten---Trump-Administration-entfernt-Klimainformationen-von-Regierungswebsites.html
13. NPR, "More environmental data is deleted in Trump's second term," 2025-08-08 — https://www.npr.org/2025/08/08/nx-s1-5495338/climate-change-environment-websites-trump
14. WITNESS, written submission to the UN Special Rapporteur on freedom of expression (content regulation), via OHCHR — https://www.ohchr.org/Documents/Issues/Opinion/ContentRegulation/Witness.pdf
15. "From Amateur Video to New Documentary Formats: Citizen Journalism…" (Syrian Archive / Abounaddara), academic chapter — https://g-city.sass.org.cn/_upload/article/files/a0/28/9458caaf4b528aae0514fd6484ad/9a576c99-81f9-41cd-b398-848c6c2fc7c8.pdf
16. UC Berkeley Human Rights Center, "Developing the Berkeley Protocol," accessed 2025 — https://humanrights.berkeley.edu/berkeley-protocol-digital-open-source-investigations
17. UNRIC, "Berkeley Protocol on Digital Open Source Investigations" (launch notice), 2020-12 — https://unric.org/en/unric-info-point-library-newsletter-december-2020/
18. CBS News/AP, "Gawker, Hulk Hogan Settle Sex Tape Legal Fight For $31 Million," 2016-11-02 — https://www.cbsnews.com/sanfrancisco/news/gawker-hulk-hogan-sex-tape-legal-settlement/
19. Variety, "Peter Thiel Ends Bid to Buy Gawker," 2018-04-25 — https://variety.com/2018/digital/news/tech-billionaire-peter-thiel-ends-bid-to-buy-gawker-com-1202786359/
20. Gawker Media history (Univision deletion of six posts, citing Politico/Gizmodo reports), accessed 2026 — https://ultimatepopculture.fandom.com/wiki/Gawker_Media
21. The Malta Independent, "91 SLAPP cases filed in Malta in the years 2010-2024" (CASE/Daphne Foundation 2025 report), 2026-01-31 — https://www.independent.com.mt/articles/2026-01-31/local-news/91-SLAPP-cases-filed-in-Malta-in-the-years-2010-2024-6736286856
22. Inventiva, "The Game Of Defamation… When Telling The Truth Gets You A Lawsuit!" (Adani gag order), 2025-12-15 — https://www.inventiva.co.in/stories/the-game-of-defamation-in-the-biggest-democratic-nation-when-telling-the-truth-gets-you-a-lawsuit/
23. Coalition Against SLAPPs in Europe (CASE), "The European SLAPP Contest 2024" (Croatia: 945 lawsuits), 2024-01-19 — https://www.the-case.eu/latest/the-european-slapp-contest-2024/
24. Julian Lewis MP, Commons speech: "Horizon IT Scandal & SLAPPs," 2024-11-21 — https://www.julianlewis.net/commons-speeches/horizon-it-scandal-strategic-lawsuits-against-public-participation-slapps
25. Factual America, "Claas Relotius Scandal: Der Spiegel's Fake News Crisis," 2024-09-08 — https://www.factualamerica.com/byline-blunders/claas-relotius-der-spiegels-fabrication-scandal-shakes-journalisms-foundations
26. Tampere University, "Basics of research data management" (summarizing Vines et al. 2014, Current Biology 24:94-97), 2020 — https://research.tuni.fi/uploads/2020/10/1e12eb53-research-data-management_basics_20200104_v2.pdf
27. bioRxiv, "Tier-based standards for FAIR sequence data and metadata sharing in microbiome research" (citing Tedersoo et al. 2021: 54.2%), 2025-07-01 — https://www.biorxiv.org/content/10.1101/2025.02.06.636914v3.full
28. PLOS ONE, "Data sharing upon request and statistical consistency errors in psychology: A replication of Wicherts, Bakker and Molenaar (2011)," 2023-04-13 — https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0284243
29. Journal of Modern Medical Information Sciences, "The Problem of Continued Citation of Retracted Publications," 2025 — https://journals.sbmu.ac.ir/jmlis/article/download/48705/35366/254299
30. BMJ, "Retractions of biological and medical science research articles" (Key messages), 2023 — https://www.bmj.com/bmj/section-pdf/1084161?path=/bmj/381/8388/Comment.full.pdf
31. Retraction Watch, "A look back at 2024…" (database ~55,000 entries), 2024-12-26 — https://retractionwatch.com/2024/12/26/a-look-back-at-2024-at-retraction-watch-and-forward-to-2025/
32. bioRxiv, "Gaming the Metrics? Bibliometric Anomalies…" (10,995 articles from 2022 retracted by May 2025), 2025-05-12 — https://www.biorxiv.org/content/10.1101/2025.05.09.653229v1.full-text
33. China Justice Observer, "How Chinese Courts Review Electronic Evidence Stored on Blockchain?", 2021-08-29 — https://www.chinajusticeobserver.com/a/how-chinese-courts-review-electronic-evidence-stored-on-blockchain
34. Judicature (Duke), "China's E-Justice Revolution," accessed 2025 — https://judicature.duke.edu/articles/chinas-e-justice-revolution/
35. Managing Intellectual Property, "China patent: Courts respond positively to blockchain evidence" (cost comparison), 2022-06-13 — https://www.managingip.com/article/2a5bqo2drurt0bwowkq20/china-patent-courts-respond-positively-to-blockchain-evidence
36. ScienceDirect (Computer Law & Security Review), "Research on the application and examination of electronic evidence preserved on the blockchain in Chinese copyright judicial practice" (1,430 cases), 2024 — https://www.sciencedirect.com/science/article/abs/pii/S0267364923001012
37. TRM Labs, "Building Strong Cases with Blockchain Evidence: Admissibility…" (Vermont §1913, Arizona HB 2417, FRE), 2026 — https://www.trmlabs.com/resources/blog/building-strong-cases-with-blockchain-evidence-admissibility-chain-of-custody-experts-and-court-ready-reporting
38. PubScience, "Blockchain Evidence in Court: Admissibility Standards" (FRE 901/902, eIDAS Art. 41), 2026-04-03 — https://www.pubscience.org/blog/blockchain-evidence-in-court
39. GlobeNewswire, "Estonian Government, Guardtime Accelerate Adoption of Blockchain Technology to Secure 1M Patient Health Records," 2016-03-03 — https://www.globenewswire.com/news-release/2016/03/03/1202115/0/en/Estonian-Government-Guardtime-Accelerate-Adoption-of-Blockchain-Technology-to-Secure-1M-Patient-Health-Records.html
40. N. Iqbal thesis (Theseus), section on "Estonia: Integrity anchoring across state registries" (KSI + eIDAS alignment) — https://www.theseus.fi/bitstream/10024/901002/3/Iqbal_Naveed.pdf
41. OriginStamp, "Blockchain Timestamping" product page (60M+ timestamps since 2013), accessed 2025 — https://originstamp.com/en/timestamp
42. OriginStamp, "Trusted Timestamping: TSA, Blockchain & eIDAS," 2025-12-19 — https://originstamp.com/en/blog/reader/trusted-timestamping-explained
43. AIBuzz, "AI Watermarking 2026: C2PA, Metadata and Fingerprinting" (adoption vs. stripping gap), 2026-06-21 — https://aibuzz.blog/ai-watermarking-vs-metadata-vs-fingerprinting/
44. Webcite, "C2PA Content Credentials: Developer Guide" (3,500+ CAI orgs; device/platform adoption), 2026-01-26 — https://webcite.co/blog/c2pa-content-credentials-developer-guide/
45. arXiv, "Why Media Forensics Needs Social Theories" (40-fold rise 2022–24; Deloitte $40B by 2027; Arup $25.5M), 2026 — https://arxiv.org/html/2605.09007v1
46. arXiv, "A Pragmatic Classification Framework for AI Incident Monitoring" (FBI IC3 2025: $632M AI-referenced investment fraud), 2026 — https://arxiv.org/html/2604.21412v3
47. VentureBeat, "Sam Altman calls for 'AI privilege' as OpenAI clarifies court order to retain… ChatGPT sessions," 2025-06-06 — https://venturebeat.com/ai/sam-altman-calls-for-ai-privilege-as-openai-clarifies-court-order-to-retain-temporary-and-deleted-chatgpt-sessions/
48. PCMag, "You Can Now Permanently Delete Your ChatGPT Conversations Again," 2025-10-11 — https://www.pcmag.com/news/you-can-now-permanently-delete-your-chatgpt-conversations-again
49. Raymond James, "European Legal Tech Services Insight" (Apr 4, 2025: judge denies OpenAI's dismissal motion) — https://www.raymondjames.com/-/media/rj/dotcom/files/corporations-and-institutions/investment-banking/industry-insight/european-legal-tech-services-insight.pdf
50. GameDeveloper (Reuters), "French consumer group sues Ubisoft over shutdown of The Crew," 2026-04-01 — https://www.gamedeveloper.com/business/french-consumer-group-sues-ubisoft-over-shutdown-of-the-crew
51. Eurogamer, "Ubisoft sued over controversial The Crew shutdown" (class action), 2024-11-12 — https://www.eurogamer.net/ubisoft-sued-over-controversial-the-crew-shutdown
52. Culture.org, "Ubisoft CEO Addresses Game Shutdown Petition and Sales Issues," 2025-07-28 — https://culture.org/gaming/ubisoft-ceo-confronted-with-game-shutdown-petition-and-sales-questions/
53. Video Game History Foundation, "87% Missing: the Disappearance of Classic Video Games," 2023-07 — https://gamehistory.org/87percent/
54. Game World Observer, "87% of classic video games at risk…," 2023-07-11 — https://gameworldobserver.com/2023/07/11/87-percent-classic-video-games-unavailable-study-preservation
55. BleepingComputer, "38,000 Flash Games Archived for Offline Play and Preservation," 2020 — https://www.bleepingcomputer.com/news/gaming/38-000-flash-games-archived-for-offline-play-and-preservation/
56. Boing Boing, "Old Adobe Flash games preserved by Flashpoint Archive" (200,000+ items), 2025-06-16 — https://boingboing.net/2025/06/16/old-adobe-flash-games-preserved-by-flashpoint-archive.html
57. Den of Geek, "Silent Hills Is the Best Video Game Never Made" (P.T. delisting chronology), 2024-08-23 — https://www.denofgeek.com/games/silent-hills-is-the-best-video-game-never-made/
58. GamingBolt, "Remembering P.T., the Incredible Horror Teaser" (redownload block; $1,000–1,500 consoles), 2022-08-21 — https://gamingbolt.com/remembering-p-t-the-incredible-horror-teaser
59. MassivelyOP, "Ubisoft faces proposed class action lawsuit over shutdown of The Crew" (California license-disclosure law), 2024-11-12 — https://massivelyop.com/2024/11/12/ubisoft-faces-proposed-class-action-lawsuit-over-shutdown-of-the-crew/
60. Legacy Options, "Managing a Loved One's Digital Accounts After Death" (Apple court orders; RUFADAA catalogue vs content), 2026-07-14 — https://www.legacyoptions.com/post/managing-digital-accounts-after-a-death
61. Afterloss UK, "Digital Legacy Guide" (MFA/device lockout; platform timeframes), 2026-07-12 — https://www.afterloss.uk/guides/digital-legacy
62. Town & Country Law, "What Happens to Your Digital Photos, Emails and Online Accounts After You Die (UK)" ("Lost Photo Archive" case), 2025-09-02 — https://townandcountrylaw.legal/what-happens-to-your-digital-photos-emails-and-online-accounts-after-you-die-in-the-uk/
63. Killswitch, "What Is a Dead Man's Switch? Complete Guide" (user classes incl. journalists/whistleblowers), 2026-01-21 — https://killswitch.app/blog/what-is-a-deadman-switch-a-complete-guide-to-digital-estate-planning
64. Killswitch, "Password Managers Don't Solve the Inheritance Problem" (LastPass/1Password/Bitwarden/Dashlane mechanics), 2026-04-13 — https://killswitch.app/blog/lastpass-vs-killswitch-password-managers-dont-solve-inheritance
65. Funeral.com, "Dead Man's Switch Emails: How They Work, Safer Alternatives" (false triggers; privacy concentration), 2026-01-20 — https://funeral.com/blogs/the-journal/dead-man-s-switch-emails-how-they-work-safer-alternatives-and-when-to-use-them
66. Malwarebytes, "Phishing scam uses fake death notices to trick LastPass users," 2025-10-27 — https://www.malwarebytes.com/blog/news/2025/10/phishing-scam-uses-fake-death-notices-to-trick-lastpass-users
67. Fortune (China), on Chainalysis "lost bitcoin" and "lost whales" (~4M BTC lost forever), 2018-10-22 — http://www.fortunechina.com/investing/c/2018-10/22/content_317942.htm
68. Hello Sunset, "RUFADAA and Digital Assets After Death" (platform pathways; self-custody: no provider to compel), accessed 2026 — https://learn.hellosunset.com/rufadaa-digital-assets-crypto-probate
69. Tarlo, "Why Your IPFS Pins Keep Disappearing (And How to Fix It)," 2025-08-12 — https://tarlo.app/blog/why-ipfs-pins-keep-disappearing/
70. Filebase, "Stop Misusing IPFS: 5 Real Mistakes," 2025-04-18 — https://filebase.com/blog/stop-misusing-ipfs-5-real-mistakes-and-how-to-actually-avoid-them/
71. BestDapps, "A Deepdive into AR – 2025" (Arweave criticisms), 2025-01-22 — https://bestdapps.com/blogs/news/a-deepdive-into-ar-2025
72. Evercert, "Blockchain Notarization vs Traditional Notarization," 2026-02-16 — https://evercert.io/blog/blockchain-notarization-vs-traditional
73. eSafety Commissioner (Australia), "What happens to your digital accounts after you die" (licenses, not ownership), 2023-11 — https://www.esafety.gov.au/key-topics/digital-wellbeing/what-happens-to-your-digital-accounts-after-you-die

*Method note: 12 search sessions, ~40 queries (Pew/Ahrefs link rot; Internet Archive outages & litigation; 2025 U.S. gov data deletions; Syria/YouTube evidence removals; Berkeley Protocol; Gawker deletions; SLAPP reports (CASE/Adani/Horizon); Relotius; Vines/Tedersoo/Wicherts data availability; retraction citation studies; Hangzhou court + SPC rules; Vermont/Arizona/eIDAS; Estonia KSI; OriginStamp; C2PA adoption/stripping; deepfake fraud stats; NYT v OpenAI preservation orders; The Crew/Stop Killing Games; VGHF 87% study; Flashpoint; P.T.; digital estate/RUFADAA; dead-man's-switch services & threats; lost Bitcoin; IPFS pinning failures; Arweave critiques). Confidence levels reflect source authority and corroboration; medium-confidence items are flagged inline.*
