# How long funded copies last, and extending them

Built 16 Nov 2026. Applies to every prefunded batch: wall players, album drops, and artists' sponsored copies.

- **90 days by default.** A batch's copies stay claimable for 90 days from the moment its payment confirms
  (`RADIO_GIFT_BATCH_DAYS`, 1 to 365, on the `xtrata` Pages project; unset means 90). Batches made before this keep the
  deadline they had until they are extended.
- **Extending is one signature, no payment.** In the batch list each live batch shows its days left with `+30` and
  `+90`; under the list, "Extend them all" does every live batch of the connected wallet with one signature
  (`POST /radio/gift/batch/extend`, signed by the wallet that paid; `batch` is an id or `all`).
- **What moves:** only copies still waiting to be claimed. Each one's deadline becomes its current one plus the days;
  a copy whose time has just run out but has not been refunded yet starts again from now. Never more than 365 days
  ahead. Claimed, refunding and refunded copies are untouched, and a signed request works once.
- **Getting the money back** is unchanged: let a batch run out and its unclaimed copies are refunded to the wallet
  that paid. There is no "never expires", on purpose: the deadline is what returns unclaimed money.
