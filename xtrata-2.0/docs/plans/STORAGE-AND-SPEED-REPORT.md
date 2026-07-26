# Where Xtrata keeps things, what it costs, and why song pages are slow

A plain-English report on the four places the site stores data (IndexedDB, R2,
D1, and the caches in between), how efficiently we use each one, what bills are
coming, and what to fix first.

Everything with a number attached was **measured against the live site**
(xtrata.xyz) on 26 July 2026, not estimated. Where I'm estimating, I say so.

---

## The short answer

Song pages are slow for three reasons, and none of them is "the blockchain is
slow". In order of how much they hurt:

1. **Every page load downloads 8–11 MB of music nobody asked for.** The
   homepage embeds four live inscription players (3.6 MB) and the radio
   pre-downloads three more songs (6.4 MB measured) *while it is switched off*.
2. **Every media request pays a fixed ~600 ms toll before a single byte
   arrives** — even when the file is already sitting in our own cache. We ask
   the blockchain five questions first, every single time.
3. **Nothing we serve is cached by Cloudflare's network.** Every visitor, every
   time, goes all the way back to our code. I confirmed this: every response
   comes back marked `cf-cache-status: DYNAMIC`.

The storage layers themselves are in good shape. The problem is almost entirely
*how much we ask for* and *how many questions we ask before answering*.

---

## Part 1 — The four kinds of memory, in plain terms

You've got four separate places data lives. They have nothing to do with each
other, they bill differently, and confusing them is how sites get slow.

### 1. IndexedDB — the visitor's own filing cabinet

A database that lives **inside each visitor's browser**, on their own hard
drive. Nothing here costs us a penny — it's their disk, not ours. It survives
them closing the tab and coming back tomorrow.

Think of it as: *a filing cabinet in the visitor's house. We can put things in
it so we don't have to post them again next week. But we don't control the size
of the house, and if it gets full the visitor's browser throws the whole cabinet
out without asking us.*

We currently open **eight separate cabinets** in each visitor's browser:

| Cabinet (database) | What's in it |
|---|---|
| `XtrataCache` | The big one. Five drawers: whole inscriptions (permanent), streamed media (7-day), previews, thumbnails, token summaries |
| `XtrataMarketCache` | Marketplace and NFT activity history |
| `XtrataQueryCache` | Saved answers to routine questions, so a page reload doesn't re-ask |
| `XtrataRelationshipIndex` | The parent/child and dependency graph |
| `XtrataCampaignAssets` | Artwork staged for a campaign before it's inscribed |
| `XtrataMint` | Half-finished mint attempts, so a dropped connection can resume |
| `xtrata-agent-one` | Agent One's own state |
| Opus HTML handoff | Passing a generated player between two pages |

Eight is more than it needs to be, but that's tidiness, not a real cost.

### 2. R2 — our warehouse

Cloudflare's file storage. **This is where the money-saving magic happens.**
When someone asks for song #1101, we don't rebuild it from 230 blockchain reads
— we hand them the copy we already assembled and parked in R2.

Think of it as: *a warehouse where we keep one finished copy of everything we've
ever assembled, so we never assemble it twice.*

R2's killer feature is that **sending files out of it is free**. Most cloud
storage charges you per gigabyte shipped; R2 charges nothing. For a site whose
whole purpose is serving multi-megabyte music files, this is the single best
architectural decision in the stack.

We use two R2 buckets:

- **`RUNTIME_CONTENT_CACHE`** — assembled inscriptions. The important one.
- **`COLLECTION_ASSETS`** (`xtrata-manage-assets`) — artwork uploaded for
  collections before it goes on chain.

🔴 **`RUNTIME_CONTENT_CACHE` does not exist in production.** The live site's own
health endpoint (`/collections/health`) reports it plainly:

```json
"runtimeCache": { "available": false, "binding": null,
  "warningMessage": "Runtime inscription cache storage is not configured..." }
```

The same endpoint lists every setting the site can see. The 5 GB *budget*
(`RUNTIME_CONTENT_CACHE_LIMIT_BYTES`) is there. The *bucket itself* is not.

So the warehouse for assembled songs was designed, built in code, given a
budget — and never actually created. Every `HIT` I measured is coming from the
consolation prize: Cloudflare's edge cache, which is per-data-centre and
evictable. See "The warehouse that was never built" below.

### 3. D1 — our notebook

A small SQL database. It holds **facts about** inscriptions, never the
inscriptions themselves. "Token 1101 is 3.7 MB of HTML, owned by X, sealed,
final hash Y."

Think of it as: *the library's card catalogue. Tiny compared to the books, but
it's how you find anything without walking every shelf.*

This is what makes the radio possible. The radio needs "every song on the
chain". Without D1 that's thousands of blockchain reads. With D1 it's **one
query** — I measured the radio's playlist endpoint at **91 ms**. That's the
system working exactly as intended.

What's in it:

| Table | Purpose |
|---|---|
| `inscription_index` | One row per inscription: owner, size, type, hash |
| `inscription_index_state` | How far the index has caught up |
| `inscription_parents` / `inscription_dependencies` | The relationship graph |
| `radio_verdicts` | Community memory of which tokens aren't playable |
| `telemetry_events` / `telemetry_issues` | Error and journey tracking |
| `collections` | Collection staging and publishing |

### 4. The caches in between — and Worker memory

Two more layers people forget:

- **The edge cache** — Cloudflare's own copy, kept at whichever of their ~300
  data centres served the request. Free and instant, but per-location and
  Cloudflare can evict it whenever it likes.
- **The browser cache** — the visitor's own copy. Free, instant, and the fastest
  thing available. Governed entirely by the `Cache-Control` headers we send.
- **Worker memory (RAM)** — our server code gets ~128 MB of working memory per
  request. Not storage; scratch space. It matters because if we load a whole
  11 MB video into memory to serve it, we've used a tenth of our budget on one
  visitor and we can't start sending until it's all in.

---

## Part 2 — Why song pages take ages (measured)

### Cause 1: we download megabytes nobody asked for

I loaded the live site with a fresh browser and watched every request.

**The homepage embeds four inscription players as live iframes:**

| Embedded | Size |
|---|---|
| `/i/1107` | 0.66 MB |
| `/i/296` | 2.56 MB |
| `/i/394` | 0.38 MB |
| `/i/287` | 0.001 MB |
| **Total** | **3.60 MB** |

Two of them — 1107 and 394 — were fetched **twice** in a single page load,
adding another ~1 MB of pure waste. Worth confirming, but it's in the network
log.

**Then the radio pre-downloads three songs while switched off.** On a fresh
load it fetched:

| Radio preload | Size |
|---|---|
| Token 577 | 2.80 MB |
| Token 689 | 3.25 MB |
| Token 1120 | 0.35 MB |
| **Total** | **6.40 MB** |

The radio was **off**. The visitor had pressed nothing. This is deliberate —
the code comments explain the goal is that the first press of the power button
plays instantly — but it costs every visitor 6.4 MB and several seconds of
competing bandwidth whether they ever touch the radio or not.

**Total: ~10 MB of audio per page load, plus ~1 MB of duplicates.** For
comparison, the page's own code is 337 KB. We are shipping **thirty times more
music than website**, before the visitor asks for any of it.

There's a second, subtler cost. Our HTML music players store their audio *inside
the HTML file* as text (a `data:` URI). To play one, the radio downloads the
whole 3.25 MB HTML into memory as a string, then the browser decodes the audio
out of that string. Peak memory is roughly **two to three times the file size**,
per track, times three preloaded tracks. On an older phone that alone can make
the page stutter.

### Cause 2: a ~600 ms toll on every media request, even on a cache hit

This is the one that surprised me. Measured, live, repeatedly:

| Request | Cache | Time before first byte | Chain reads first |
|---|---|---|---|
| `/inscription/1101` (3.7 MB) | HIT | 690–894 ms | 5 |
| `/inscription/1065` (11.7 MB) | HIT | 842 ms | 5 |
| `/inscription/1065`, first 64 KB only | HIT | **614 ms** | 5 |

Look at the last row. We asked for **64 kilobytes** — and waited 614 ms for it.
The transfer itself was 10 ms. Everything else was the toll.

Here's why. Our cache filing system uses the inscription's content hash as the
label on the box. That's excellent design — the hash can't change, so a cached
copy can never go stale. But it means that **to find the box, we first have to
ask the blockchain what the hash is.** Five questions to the chain, every
request, ~600 ms, before we even look in our own warehouse.

It's like having a perfectly organised warehouse but phoning the manufacturer
for the part number every time someone walks in.

### Cause 3: Cloudflare isn't caching anything we serve

Every single response I measured came back `cf-cache-status: DYNAMIC`. That
means Cloudflare's global network treated it as unique and did not keep a copy.
Every visitor, in every country, on every visit, runs our code and pays the toll
in Cause 2.

We're already *sending* the right instruction — `Cache-Control: public,
max-age=31536000, immutable`, i.e. "keep this forever". Browsers will honour it,
so a returning visitor is fine. But Cloudflare's own network needs to be told
separately to cache function responses, and it hasn't been.

An inscription is immutable. It is the most cacheable object that has ever
existed. It should be served from a data centre near the visitor, in
milliseconds, without our code ever waking up.

### Cause 4 (only on some pages): the browser rebuilds songs the slow way

When you open a song *inside the app* — the fullscreen viewer, say — the app
doesn't use the fast server route. It rebuilds the file in your browser, chunk
by chunk, from the blockchain.

The numbers here are stark:

|  | Chunks per request | Round trips for a 6.45 MB song |
|---|---|---|
| Our server does it | 30 | ~14 |
| Your browser does it | **4** | **~104** |

Chunks are 16 KB. The server reads 30 at a time; the browser reads 4 at a time,
four requests in parallel. That's roughly **26 sequential rounds of waiting**
versus the server's 4.

I checked the history: the browser's batch size of 4 has been there since the
2.0 port and was never deliberately tuned. The contract itself will serve up to
50 per read. There's already automatic back-off code if a read is too expensive,
so raising it has a built-in safety net.

---

## Part 3 — What we're doing right

Genuinely, and worth protecting:

- **R2 with free egress for the heavy files.** Exactly the right choice. Serving
  10 MB songs from most storage providers would be the biggest line on the bill.
- **Content-hash cache keys.** A cached inscription can never be wrong or stale,
  because the key *is* the content. This is why the cache can be set to "keep
  forever" with no risk.
- **The D1 index.** 91 ms for "every playable song on the chain" versus
  thousands of blockchain reads. This is the difference between the radio
  existing and not existing.
- **The edge cache on the index endpoints.** I measured the playlist endpoint
  serving from cache (`age: 38`) in 91 ms.
- **Community dud memory.** When one listener finds an unplayable token, every
  other listener skips it. One person's wasted download saves everybody else's.
- **Range requests work.** Audio seeking doesn't re-download the file.
- **The page shell is fast** — 100 ms, 56 KB. Not the problem.
- **Crowd-warming.** Visitors quietly ask the server to pre-assemble random
  inscriptions into R2, so the expensive first assembly is paid in the
  background rather than by whoever tunes in first. Clever.
- **Failures degrade rather than break.** Cache missing? Rebuild from chain.
  Index behind? Serve what we have. Nothing hard-fails.

---

## Part 4 — What's wasteful, worst first

1. **~10 MB of unrequested audio per page load.** Homepage embeds plus radio
   preloads. Biggest single cause of "takes ages".
2. **~600 ms toll on every media request, cache hit or not.** Five blockchain
   reads before we open our own cupboard.
3. **No Cloudflare edge caching on immutable content.** Every visitor pays full
   price for a file that can never change.
4. **Browser-side rebuilds use batches of 4 instead of 30.** ~7× more waiting
   than necessary.
5. **Duplicate requests** — `/i/1107` and `/i/394` fetched twice per homepage
   load.
6. **Six separate blockchain reads for near-static settings on every page load**
   (`get-admin`, `get-fee-unit`, `is-paused`, `get-royalty-recipient`,
   `get-next-token-id`, `get-last-token-id`). These change rarely; they're
   fetched fresh every time.
7. **The permanent inscription cabinet in each visitor's browser has no size
   limit and no cleanup.** Thumbnails are capped at 4,000; whole inscriptions
   aren't capped at all. It grows until the browser force-evicts **the entire
   origin's storage** — at which point every visitor silently loses every cache
   we built for them and the site gets slower for a while. This will happen to
   heavy users eventually and it will look like a random mystery.
8. **Telemetry writes are expensive per event.** The events table carries nine
   indexes plus a trigger. In database billing, every index counts as another
   row written — so one error event is closer to **ten** billable writes than
   one. On top of that, `/log` sends each event as a separate database
   statement instead of one batch, and runs a cleanup `DELETE` **on every single
   beacon** rather than occasionally.
9. **The index keeps refreshing whether or not anything changed.** Whenever the
   index is more than 60 seconds stale, a page view triggers a background sync,
   which re-reads **12 tokens from the chain and writes 12 rows to D1**. When
   the index is fully caught up and the chain hasn't moved, that work produces
   no new information. It's self-healing by design — transfers and migrations
   fix themselves over traffic — but the cost scales with visitors, not with
   change.
10. **Whole files are loaded into server memory to serve them.** For HTML we
    buffer the entire file to inject one line, so we can't start sending until
    it's all in memory. An 11 MB video is a tenth of the memory budget and a
    delayed start.
11. **The public inscription URL can't reach content that has moved cores, and
    crashes instead of saying so.** See "The two-hop problem" below.

---

## Part 5 — Costs: what's actually billed, and when it bites

Cloudflare bills these on completely different meters. Rates below are the
published ones as I understand them — **re-check current pricing before
budgeting**, but the *shape* is what matters and that won't change.

### R2 (the warehouse) — cheap, and the good kind of cheap

| Meter | Rough rate | Our exposure |
|---|---|---|
| Storage | ~$0.015 / GB / month | 5 GB budget ≈ **7¢/month**. Negligible. |
| Writes | ~$4.50 / million | We write once per inscription, ever. Negligible. |
| Reads | ~$0.36 / million | One per cache hit. 1M plays ≈ **36¢**. |
| **Sending data out** | **$0** | **This is the win.** |

**R2 is not a cost risk.** Even at a hundred times current traffic it's pennies.
Serving that same traffic from a provider that charges egress would be the
largest line on the bill. Don't touch this.

### D1 (the notebook) — the one to actually watch

D1 bills by **rows read** and **rows written**, and *every index counts as a
row written*. Reads are effectively free at our scale. Writes are where it goes
wrong, and we have two write engines running on visitor traffic:

- **Telemetry.** ~10 billable writes per error event (nine indexes plus the
  trigger), each sent as its own statement, plus a cleanup DELETE per beacon.
- **Index refresh.** ~12 token writes plus state updates, triggered by page
  views whenever the index is 60 s stale.

**When does this bite?** Not today. Both are proportional to *traffic*, not to
content, and current traffic is modest. The corner arrives when traffic grows —
and it arrives quietly, as a bill, not as a broken page. My rough shape: it
stays comfortable in the tens of thousands of daily page views and becomes worth
caring about somewhere in the hundreds of thousands. **I would not act on that
number — I'd measure it.** Cloudflare's dashboard shows rows-written per day
directly, and reading it once a week for a month tells you more than any
estimate of mine.

The cheap insurance, well before it matters: drop indexes nobody queries, batch
the telemetry inserts into one statement, and run the cleanup DELETE on 1-in-100
requests instead of all of them. That's most of the exposure gone for very
little work and no behaviour change.

### Workers (running our code) — currently paying for waste

Billed per request and per millisecond of processing. Right now every media
request runs our code for ~600 ms of *waiting on the blockchain* before serving
a file we already had. Fixing the edge caching means most repeat requests never
run our code at all — that's a latency win and a cost win from the same change.

### The Hiro blockchain API — the real hidden dependency

This one isn't on a Cloudflare bill and it's the one I'd worry about most.
Every metadata lookup, every index refresh, every browser-side rebuild is a call
to Hiro's API. The code already handles rate limiting, backs off, rotates
through multiple API keys, and halves batch sizes when reads get too expensive
— which tells me we have hit those limits before.

**Our exposure is that Hiro's rate limits, pricing, or availability are not
under our control.** Every one of the fixes below reduces our dependence on
them, which is worth more than the money it saves.

---

## Part 5b — The two things that need a decision from you

### The warehouse that was never built

**What a "binding" is.** Our website code is not allowed to reach out and grab
any storage it fancies. Cloudflare makes us declare, up front, "this site is
allowed to use this specific bucket, and the code will refer to it by this
name." That declaration is a *binding* — a labelled door between our code and
one specific store. No binding, no door.

Our code contains a complete, working warehouse system for assembled
inscriptions. It has:

- a name it expects the door to be called: `RUNTIME_CONTENT_CACHE`
- a filing scheme (content hash as the label)
- a 5 GB budget, which **is** configured in production
- usage monitoring, warnings at 80% and 95%, and a purge endpoint

Everything except the door. The bucket was never created and never bound.

**How the code reacts.** Deliberately gracefully — which is exactly why nobody
noticed. The relevant function reads: *if there's a bucket, use it; otherwise
use the edge cache.* No error, no warning in normal use. It just quietly works
less well, for a year, in a way that looks like "the blockchain is slow".

**Why the difference matters.** Both layers store the same assembled bytes.
They are not remotely equivalent:

| | R2 warehouse (missing) | Edge cache (what we're using) |
|---|---|---|
| Where the copy lives | One copy, globally reachable | Separately in each data centre that served a request |
| How long it lasts | Until we delete it | Until Cloudflare wants the space back — hours, maybe |
| Reach | A visitor in Sydney benefits from a London visitor's assembly | Sydney gets nothing from London; it reassembles from scratch |
| Guarantee | Durable storage | None. It's a convenience, and Cloudflare says so |
| Our cost | ~7¢/month for 5 GB, free to read from | Free |

**What that means in practice.** Cloudflare has roughly 300 data centres. Right
now, the first person in each one to request a given song pays the full
blockchain-reassembly cost — hundreds of chain reads, several seconds, and for
the big files sometimes a crash. Then that copy quietly expires and the next
person pays it again.

This also explains something that was puzzling me. We built "crowd-warming" —
every visitor asks the server to pre-assemble a couple of random inscriptions in
the background, so nobody has to wait for a cold file. That's a genuinely smart
idea, and **with no warehouse it barely helps**, because it warms one data
centre's short-lived cache. The mechanism is fine; it's been pouring water into
a bucket with no bottom.

**The decision.** There are three options, and they're not close.

1. **Create the bucket and bind it in `wrangler.toml`.** ~7¢/month. Reading from
   R2 is free and sending data out of R2 is free. Assembled songs then persist
   globally and permanently, crowd-warming starts working as designed, and the
   worst-case "cold song" experience largely disappears.
2. Create it in the Cloudflare dashboard only. Works, but it's an invisible
   dependency — the next fresh environment or preview branch comes up without it
   and silently degrades exactly like today. This is likely how it went missing
   in the first place.
3. Leave it. Keep paying for reassembly forever, in latency and in Hiro API
   calls we don't control.

**My recommendation: option 1.** Put it in the config file so it is part of the
code and cannot get lost again. Of everything in this report, this is the
cheapest fix with the largest effect — and unlike the others, it isn't an
optimisation. It's finishing something that was already built.

One caveat so this doesn't get oversold: the warehouse makes *repeat* requests
fast and reliable. It does **not** remove the ~600 ms metadata toll (that's the
separate fix in Part 6, item 3), and it doesn't reduce the ~10 MB of unrequested
audio (item 1). Those three are independent, and you want all three.

### The two-hop problem — why `/inscription/8` fails

**What I actually found.** Token 8 is not broken. Its bytes are fine. I fetched
them: a 1.87 MB video, 115 chunks, served in 1.2 seconds.

The catch is *where* I had to ask:

| Where I asked for token 8 | Result |
|---|---|
| `/inscription/8` — the normal public URL | **502 error after ~5 seconds** |
| Directly from core v3-2-3 | 502 error |
| Directly from core v2-1-0 | 502 error |
| Directly from core v1-1-1 | ✅ works, 1.87 MB, 1.2 s |

**Why.** Inscriptions can migrate to newer versions of the contract. When they
do, they keep their number, but **the actual bytes stay on the contract they
were originally written to.** Token 8 is from the very beginning, so its bytes
live on v1-1-1, while its identity has moved up to v3.

The public URL knows to look one step back: it tries v3, and if that misses it
tries v2. It stops there. Token 8's bytes are two steps back, on v1, so the URL
never finds them.

Interestingly, **the radio gets this right** — it probes all three cores itself
in order, which is why token 8 plays on the radio while its own public URL is
broken. The correct logic already exists in our code; it just lives in the
browser instead of on the server, where every other visitor and every embed and
every external link would benefit from it.

**The second, separate problem: it crashes rather than declining.** When the
lookup fails, we don't return our own tidy "not found" message. The server
itself falls over and Cloudflare substitutes a bare `error code: 502`. I
confirmed this is general, not specific to token 8 — asking for token 999999,
which has never existed, gives the same bare 502 after a second.

Two consequences:

- Anyone linking to an inscription that we can't resolve gets a blank Cloudflare
  error page instead of "this inscription isn't available here". Bad for trust
  on a permanence product.
- A crash is invisible to our own error tracking, because our code never gets to
  the line that would report it. We have a telemetry system that this class of
  failure walks straight past.

**The decision.** Two fixes, and they're independent — you can take either
without the other:

1. **Extend the server's search to the full lineage** (v3 → v2 → v1) instead of
   stopping after one step. Low risk: it only adds attempts where we currently
   fail outright, so nothing that works today can start failing. Cost is one
   extra chain lookup on the rare tokens that need it. This makes every
   early-era inscription reachable by its public URL.
2. **Make a failed lookup return a proper error instead of crashing.** Purely
   defensive, no behaviour change for anything that works. Turns a blank
   Cloudflare page into a real message, and makes these failures show up in
   telemetry so we find out about the next one without you noticing it by hand.

**My recommendation: do both, and do #2 first** — it's smaller, it's pure
safety, and it will immediately start telling us how many *other* inscriptions
are quietly unreachable. Right now we genuinely don't know whether token 8 is
one case or a hundred, because the failures have been invisible. #2 answers that
question, and then #1 fixes what it finds.

---

## Part 6 — What to do, in order

Ordered by benefit-per-risk. The first three are the ones that make the site
feel fast.

### Tier 0 — finish what's already built (do this first)

**0. Create the R2 bucket and bind it as `RUNTIME_CONTENT_CACHE` in
`wrangler.toml`.** See Part 5b. ~7¢/month, no code changes, makes the existing
warehouse and crowd-warming actually work.
*Risk: essentially none. The code path is already written and already tested; it
is currently taking the fallback branch.*

### Tier 1 — big wins, low risk

**1. Stop downloading music nobody asked for.**
Replace the homepage's four embedded live players with a static image plus a
play button that loads the real thing on click. Don't let the radio preload
until the visitor switches it on — or preload exactly one track, not three,
and only after the page has finished loading everything else.
*Expected: ~10 MB → under 1 MB per page load. This is the single biggest change
available.*
*Risk: low. The radio's first press gets slower; everything else gets faster.*

**2. Let Cloudflare's network cache immutable content.**
An inscription's bytes can never change. Configure the edge to keep them.
*Expected: repeat visitors served in tens of milliseconds from a nearby data
centre, with our code never waking up. Cuts Worker cost and Hiro calls too.*
*Risk: low — but this is the change where being careful matters most. Only
sealed content with a content hash may be cached this way. Unsealed or
in-progress inscriptions must keep their current short cache life, or someone
could see a half-finished file forever. The code already distinguishes these
cases; the rule just has to be enforced deliberately.*

**3. Remember the content hash so we stop asking the chain for it.**
The 600 ms toll exists only because the hash lives on-chain. We already have it
in D1, and for sealed inscriptions it can never change. Read it from D1 (or a
short edge-cached lookup) and fall back to the chain only when it's missing.
*Expected: ~600 ms → ~50 ms before first byte. Removes five blockchain calls
per media request.*
*Risk: low, and it fails safe — no D1 row means we do exactly what we do today.*

### Tier 2 — solid wins, slightly more care

**4. Raise the browser's rebuild batch from 4 to nearer 30.**
*Expected: ~104 round trips → ~14 for a 6.45 MB song.*
*Risk: medium-low. Bigger reads cost more per call on Hiro's side, which is
presumably why it's conservative. The automatic halving-on-cost-error logic
already exists as a safety net. Raise it in steps — 4 → 12 → 24 — and watch.*

**5. Prefer the server route over browser rebuilds for audio and video.**
The viewer already points images straight at the fast server route; audio and
video still rebuild in the browser. Point an `<audio>` tag at
`/inscription/<id>` and the browser streams it with range requests, starts
playing after the first few kilobytes, and never holds the whole file in memory.
*Expected: playback starts in under a second instead of after a full rebuild.*
*Risk: low.*

**6. Fix the duplicate fetches and cache the near-static contract settings.**
Six blockchain reads per page load for values that change monthly. Cache them
for a few minutes.
*Risk: very low.*

**7. Put a lid on the browser cabinet.**
Give the permanent inscription store a size budget (say 200–300 MB) and evict
the oldest when it's exceeded, the way thumbnails already do.
*Expected: prevents the browser silently binning every cache we built.*
*Risk: low, and it removes a risk rather than adding one.*

### Tier 3 — cost hygiene, do before it matters

**8. Trim the telemetry indexes, batch the inserts, sample the cleanup DELETE.**
**9. Throttle the index refresh** — trigger on actual change or a longer
interval, not on visitor traffic.
**10. Blocklist known-broken tokens** so nobody waits 4.7 seconds for token 8.

---

## Part 7 — The harness

You asked for something to optimise *thoughtfully*, without back-end risk. Here
is what I'd build first, and it deliberately measures before it changes
anything.

**The principle: never guess. Every change gets a before-and-after number.**

### Step 1 — a measuring script (build this first)

A single command — `npm run perf:report` — that hits the live site and prints a
table. There's already a `scripts/perf-drops.mjs` to model it on.

It should record, for each of a fixed list of pages and inscriptions:

- Total bytes downloaded, and how many of those bytes were audio nobody asked for
- Number of requests, and any duplicates
- Time to first byte, and the `prepared-ms` toll
- Cache status at each layer: our cache, and Cloudflare's
- Number of blockchain calls per request
- Whether anything failed, and how long the failure took

We already emit almost all of this in response headers — the diagnostic work is
done, it just needs collecting into one view.

### Step 2 — a budget file, and a check that fails loudly

A small file saying what "good" means. For example:

```
homepage:      max 1.5 MB, max 25 requests, max 1.5 s to interactive
song request:  max 150 ms to first byte on a cache hit
any page:      0 bytes of audio before user interaction
```

Then a check that compares the measurement to the budget and complains. Run it
before each deploy. This is what stops a fix from quietly regressing in three
months.

### Step 3 — a weekly cost reading

A one-page note recording, each week: D1 rows written, R2 storage and
operations, Worker requests, and Hiro call volume. Four numbers. After a month
you'll have a real trend line, and the cost question in Part 5 stops being my
estimate and becomes your data.

### Step 4 — change one thing at a time

For each item in Part 6: measure, change, measure, record. If a change doesn't
move the number, revert it. Small, reversible, evidenced.

### Guardrails — the "no risk to the back end" part

The back-end risk on this work is genuinely low, because **none of it touches
the blockchain, the contracts, or the inscriptions themselves.** Everything above
is caching and request-shaping. The inscriptions are immutable and permanent;
worst case a change makes the site slower and we revert it.

Two specific rules worth writing down:

- **Only cache what can't change.** Sealed inscriptions with a content hash:
  cache forever. Anything unsealed or in progress: short cache, as now. This is
  the one place where an aggressive change could show someone stale content.
- **Every cache must have a way to be emptied.** There's already a
  `cache-purge` endpoint. Keep it working, and check it after any caching
  change.

---

## The one-page summary

| | |
|---|---|
| **Right** | R2 with free egress; content-hash keys; the D1 index; range requests; graceful failure |
| **Wrong** | ~10 MB of unrequested audio per page load; 600 ms toll before every cached file; no edge caching on immutable content; browser rebuilds 7× slower than they need to be |
| **Cost risk** | Not R2 (pennies). D1 writes from telemetry and index refresh, both scaling with traffic rather than content. Bites at growth, quietly, as a bill. Hiro API dependency is the real one — outside our control |
| **Do first** | Create the missing R2 bucket (~7¢/month, finishes work already built); stop preloading music; cache immutable content at the edge; read the content hash from D1 instead of the chain |
| **Build first** | The measuring script and the budget file, so every change after that is evidenced rather than hoped for |

The encouraging part: the expensive, hard, clever work — permanence, hash-keyed
caching, the index, free egress — is already built and working. What's left is
mostly asking for less, and asking fewer questions before answering.
