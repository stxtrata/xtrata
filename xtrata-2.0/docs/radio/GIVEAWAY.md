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

## Two giveaways, two addresses

| Address | What it gives away | How | List name |
|---|---|---|---|
| `xtrata.xyz/giveaway` | the album drop | one link at a time, a pause between | (none: leave `list` out) |
| `xtrata.xyz/players` | the 1,000 free starter players | a wall: every spot on show, pick any free one | `players` |

They are separate: each has its own links, counts and pause, and nothing done to one touches the other. Every operator
action below works on the album drop unless it says `"list":"players"`, for example
`call '{"action":"status","list":"players"}'` or
`pbpaste | jq -Rs '{action:"add", list:"players", shuffle:true, text:.}' | curl ... -d @-`.

### The players wall (`public/players.html`)

- `GET /radio/giveaway/players`: every spot as one character (free, being claimed, gone, or the class of a claimed
  one), the counts, and how many of each class nobody has found yet. Never a link, and never the class of an unclaimed spot.
- `POST /radio/giveaway/players/pick {spot}`: holds that spot for three minutes for the connection that asked and
  returns its link. Nobody else can pick it meanwhile; unclaimed, it goes back on the wall.
- `GET /radio/giveaway/players/spot/<n>`: a claimed spot's class, plays, player address and time.
- Limits: a connection holds one spot at a time and can pick 6 in 24 hours (`PICKS_PER_IP`), on top of the claim
  limits in `docs/radio/GIFTS.md`. The hold is 3 minutes (`HOLD_MS`).
- Operator actions that apply: `add` (use `shuffle:true`), `pause`, `resume`, `archive`, `status`. `gap`, `skip`,
  `now` and `held` belong to the one-at-a-time drop and do nothing useful here.
- Spot numbers follow the order the links were loaded in. Load the whole drop shuffled in one go where you can;
  links added later take the next numbers.

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
call '{"action":"archive"}'                                 # close the drop in the list: withdraw what is left, reset the counts and the wall
jq -Rs '{action:"add", shuffle:true, text:.}' links.txt | ...   # load in a random order (a lottery of player classes)
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

## Starting a new drop

`archive` closes whatever drop is in the list. Links not yet given away are withdrawn from the page; the claimed
count, the wall and "held" go back to nothing; nothing is deleted. The gifts themselves are untouched: a link
someone already holds still works, and an unclaimed one refunds to whoever paid for it when it expires. An archived
link cannot be added again. With nothing loaded the page says the players are on their way.

The page is the free-player giveaway (see docs/music/HANDBOOK.md, section 4a). `GET /radio/giveaway` also returns
`kind`, `plays`, and for a lottery `lottery` (range, what is left of each class, the class of each claimed player).
