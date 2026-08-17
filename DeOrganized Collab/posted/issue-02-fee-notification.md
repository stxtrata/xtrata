# Issue #2 — Question: fee-schedule change notification practice

Archived verbatim from GitHub. Source of truth, not our drafts.

- **URL:** https://github.com/DeOrganized/builds-with-xtrata/issues/2
- **Opened:** 2026-08-03 by PerrinoProperties
- **State at archive:** open
- **Archived:** 2026-08-17

---

## The question, as they asked it

The fee units (single-tx-fee-unit, base fee-unit, seal-fee) are contract-mutable. Our integration quotes fees at runtime per call (quote-single-tx-fee) with <= post-conditions, so we're protected transactionally — but our product cost math assumes rough fee stability. Question: when fee units change, is there an announcement channel integrators should watch, or is polling the read-onlys the intended practice?

---

## Our reply — 2026-08-04

<!-- comment id 5183811640 -->

Straight answer first. There is no announcement channel today. Polling the read-onlys is the intended practice, and you are right that it is not much of a practice.

But there is more protection already deployed than either of us mentioned, and it is better than a notice period because nobody has to remember it. `assert-valid-fee-update` runs on every fee setter in the live core:

| Guard | Value |
|---|---|
| Absolute ceiling per fee unit | 1 STX. The transaction reverts above it |
| Most a fee can rise in one change | 2x |
| Most a fee can fall in one change | to one tenth |

So no single transaction can more than double a fee, and there is a hard ceiling nobody can cross. From today's `single-tx-fee-unit` of 10,000 microSTX it would take seven separate owner transactions to reach that ceiling.

Current live values, read at Stacks tip 8,702,017:

```
single-tx-fee-unit     10000
upload-chunk-fee-unit   1000
begin-fee-unit        100000
upload-batch-fee-unit 100000
seal-fee-unit         100000
paused                 false
```

A typical article at one chunk quotes 11,000 microSTX single-tx, which matches what you measured.

**What is missing, and what we are doing about it.** Rate limiting is not notice. A change still lands in the block it is sent in, you cannot see it coming, and we cannot take back a mistake.

Rather than promise a notice period, which is only as good as one person's memory, we are looking at putting it in the contract. Increases proposed then confirmed after a wait, decreases instant, a cancel, and a read-only so you can ask the contract whether a change is pending and when it lands.

That last part is what actually answers your question, because it makes the notice machine-readable instead of depending on us posting.

No commitment on timing. It is a proposal, not a promise.

---

## Reply from PerrinoProperties — 2026-08-04

<!-- comment id 5184030523 -->

This is exactly what we hoped the repo would produce — thank you. The assert-valid-fee-update table is honestly the answer: bounded worst-case beats a notice period that depends on someone remembering to post, and it's the kind of thing every integrator should know exists. We'll keep quoting per-call with <= post-conditions as the practice, now with the comfort that drift between quotes is capped at 2× per change.

The propose/confirm/cancel + pending-change read-only shape is the right design — machine-readable notice means our signer's pre-flight can just ask the contract. If it ships, we'll integrate that check the same week. No pressure on timing; the guard already carries the load.

Leaving this open a few days in case others want to add, then closing with your table as the documented answer.
