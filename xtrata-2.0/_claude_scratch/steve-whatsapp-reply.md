# Draft WhatsApp reply to Steve

Not sent. Everything below was read off mainnet, which Steve clearly expects
("so you hear it from me and not from your own contract state").

Nothing here goes in the repo. He asked for it to stay between you until launch.

---

Congratulations, that is a real milestone. First two DeOrganized pieces on chain.

I did go and look. Tokens 2974 and 2975, the article at 30,737 bytes and the AVIF at 22,799, both two chunks, both 12,000 microSTX protocol fee. That is exactly right for two chunks at the current schedule, so your fee math is spot on.

One thing worth having, since it cost you real money. Your first attempt at the article aborted, tx `0x87dc6267`, and it burned 54,730 microSTX in miner fee. The contract returned `u103`, which is ERR-HASH-MISMATCH.

I dug into why, because the cause is not obvious from the error. Same bytes, same size, same chunking as the successful one. The only difference was the hash you declared.

The failed transaction declared `0xdc8df3ca...`. I pulled your content back off chain and that value is the plain SHA-256 of the whole file.

The contract does not want that. It wants a chained hash: start with 32 zero bytes, then for each chunk `sha256(running_hash || chunk_bytes)`, and the final running value is `expected-hash`. That is `0x7b728531...`, which is what your second attempt sent.

So you found it and fixed it yourself. But it is the single easiest thing to get wrong on the whole protocol, the error code does not tell you which of the two mistakes you made, and it costs a burned miner fee every time. It is written up under "Incremental Hashing (Required)" in the agent skill doc if it helps to have the reference.

That one belongs in the repo as a pattern, whenever you write up your lessons. It will save the next builder the same 0.05 STX and a confusing afternoon.

Two housekeeping things.

The comment you saw appear on #4 and vanish was mine. It was the #3 answer posted on the wrong issue, so I deleted it. The Clarity 3 point stands and it will land properly on #3. Answers for #3, #4 and #5 are written and coming shortly. #4 grew a bit since, because your question about the expiry window turned up an actual bug at our end.

And your mainnet address still is not on the allowlist. It does not matter while 3-2-3 is unpaused, which is why your mints went through fine, but it is the pause insurance we talked about and I have not done it yet. It is on the list.

Taking you at your word on the testnet, thank you. It is still coming, just not this week.
