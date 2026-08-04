Send as-is. Plain text, no markdown, WhatsApp will render it fine.

Nothing here goes in the repo. He asked for it to stay between you until launch.

───────────────────────────────────────────────

Congratulations mate, that's a proper milestone. First two DeOrganized pieces on chain and they look great.

I did go and have a look. Tokens 2974 and 2975, article at 30,737 bytes and the AVIF at 22,799, both two chunks, both 12,000 microSTX. That's exactly right for two chunks at the current schedule, so your fee math is bang on.

One thing worth passing back though, because it cost you real money and the error code doesn't tell you why.

Your first go at the article aborted. It burned 54,730 microSTX in miner fee and returned u103, which is hash mismatch. I had a dig into it because the cause isn't obvious. Same bytes, same size, same chunking as the one that worked. Only thing different was the hash you declared.

I pulled your content back off chain and checked. The hash in the failed one is the plain SHA-256 of the whole file. The contract doesn't want that. It wants a chained hash, so start with 32 zero bytes, then for every chunk take sha256 of the running hash concatenated with the raw chunk bytes, and the final value is your expected-hash. That's what your second attempt sent, and it went straight through.

So you found it and fixed it yourself. But it's honestly the easiest thing on the whole protocol to get wrong, u103 doesn't tell you whether your hash is wrong or your chunks are, and it costs a burned fee every time you guess. It's written up under "Incremental Hashing (Required)" in the agent skill doc if you want the reference.

That one really belongs in the repo when you write up your lessons. It'll save the next builder the same 0.05 STX and a very confusing afternoon.

Couple of housekeeping bits.

The comment that appeared on #4 and vanished was me. It was the #3 answer posted on the wrong issue so I pulled it. The Clarity 3 point stands and it'll land properly on #3. Answers for #3, #4 and #5 are written and coming shortly. #4 has grown a fair bit since, because your question about the upload expiry window turned up an actual bug at our end. Turns out the window is about 15 hours, not the 30 days our own comment claims, because it was counting Stacks blocks and those got 50 times faster at Nakamoto. Fixed in the candidate by pegging it to Bitcoin blocks instead. Good question to have asked.

And your mainnet address still isn't on the allowlist. Doesn't matter while 3-2-3 is unpaused, which is why your mints went through fine, but it's the pause insurance we talked about before I went away and I haven't done it yet. It's on the list.

Taking you at your word on the testnet, thank you. Still coming, just not this week.
