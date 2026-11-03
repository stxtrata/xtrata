# Free album drop (the giveaway page)

`https://xtrata.xyz/giveaway` (`public/giveaway.html`) shows ONE free-album gift link at a time. The links are held on the
server, nobody can read the list, and when the link on show has been claimed and its funds have reached the new wallet, a
pause follows and the next link appears. The default pause is **ten minutes** so a crowd never turns into a rush. The page
polls by itself and shows a countdown.

The page is on the main site on purpose: the radio host (`radio.xtrata.xyz`) serves every static page sandboxed except the
radio's own. The claim button opens `https://radio.xtrata.xyz/radio.html#gift=CODE`, the normal gift link.

## How it fits together

- The links are ordinary album gift links from the Albums (admin) batch maker. Nothing about claiming changed.
- `radio_giveaway_links` keeps each code in order (a gift row only stores a hash, and the page has to show the code).
  `radio_giveaway_state` is one row: which link is on show, when the next may appear, pause, and the pace.
- Whether a link is still free is always read from `radio_gifts`, never copied: a claim that fails and goes back to `live`
  shows the same link again; an expired, refunded or missing link is stepped over at once with no pause.
- `functions/lib/radio-giveaway.ts` `advance()` does all the moving. Every public read runs it, and so does the
  scheduled gift sweep (`POST /radio/gift/sweep`, every 5 minutes), so it keeps moving with nobody on the page.
  It is safe under many readers: each change is a conditional update.
- `GET /radio/giveaway` returns only: state (`live | taken | waiting | paused | done`), the one code on show, the album
  (title, listed songs, cover; never a hidden track), and the counts. The edge reuses an answer for 3 seconds.
- The pause runs **from the moment the link is claimed** (not from when its funds land, which can take a while on the
  chain). The next link appears when BOTH the countdown is over AND the claim has settled. The pause is drawn once per claim
  (between the minimum and maximum; both are 600 s by default, so it is exactly ten minutes), so every reader sees the same time.
- While a claim is in flight (`taken`) and after it (`waiting`), the page congratulates the new wallet (its address
  shortened to the first and last five characters; addresses are public on the chain anyway) and counts down to the next
  link, on the server's clock (`now` and `nextAt` in the answer).

## Setup (once)

1. A long random secret (24+ characters) for the operator route:
   `npx wrangler pages secret put RADIO_GIVEAWAY_SECRET --project-name xtrata`
   (applies to the next deployment, so redeploy after setting it). `RADIO_GIFT_ENABLED=1` must already be on.
2. No migration needed: the tables are created on first use (`ensureGiveawayTables`).

## Running it

All operator actions are one POST. Without the right secret the route answers 404 like any other missing page.

```bash
SECRET=...   # RADIO_GIVEAWAY_SECRET
call() { curl -s -X POST https://xtrata.xyz/radio/giveaway/admin -H "Authorization: Bearer $SECRET" -H 'content-type: application/json' -d "$1"; echo; }

# Load the links: any text with links or bare codes in it (one per line is easiest). Run it more than once safely.
jq -Rs '{action:"add", text:.}' links.txt | curl -s -X POST https://xtrata.xyz/radio/giveaway/admin -H "Authorization: Bearer $SECRET" -H 'content-type: application/json' -d @-

call '{"action":"status"}'                                  # counts, which link is on show (its number, never its code), pace
call '{"action":"gap","minSeconds":600,"maxSeconds":600}'   # pause between links (default 600 s = ten minutes; a range gives a random pause)
call '{"action":"pause"}'   ;   call '{"action":"resume"}'  # the page says "taking a short break"
call '{"action":"skip"}'                                    # retire the link on show, never offer it again
call '{"action":"now"}'                                     # show the next link without waiting out the pause
```

`add` keeps only codes that are real, live gifts and tells you the positions (1 = first in what you pasted) of any it left
out: `notFound` (not a gift link we know) and `notLive` (already claimed, expired…). It never prints a code back.
Adding links shows the first one straight away unless you `pause` first.

## Things to know

- The link on show is public, so a bot could grab it. The normal claim checks still apply (the human check, one
  gift per network address, one copy of an album per passkey), but it is a first-come giveaway by design.
- Gifts expire 30 days after they were made. A link that expires before it is shown is skipped.
- When the list runs out the page says it is all done and shows the final counts.
- A link `skip`ped or lost still belongs to its gift: the funds go back to the treasury by the usual expiry path.
