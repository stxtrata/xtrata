# Paid listen receipt, format 1

From macOS standard/legacy 1.0.4 and Windows 1.0.7, the bundled desktop player
requests support after an audible listening threshold, rather than at start.
The deployed `xtrata-radio-plays-v1-0::play` contract is unchanged. Its total is
therefore a mixture of older start payments and newer threshold-listen payments.
Other older clients and the legacy web bridge can still record start payments.

The 16-byte receipt uses these fields (integers are big-endian):

| Bytes | Meaning |
|---|---|
| 0–1 | `58 4d` (`XM`) |
| 2 | Format version, `01` |
| 3 | 1 macOS, 2 Windows, 3 Linux, 4 local/development |
| 4–5 | App version: major × 10000 + minor × 100 + patch |
| 6 | bit 0 threshold listen; bit 1 unknown duration; bit 2 threshold under 30 seconds |
| 7–8 | Reported audible seconds, floored and capped at 65535 |
| 9 | Threshold in seconds, 1–30 |
| 10–15 | Six cryptographically random bytes |

The signer regenerates the random part on a collision in the payer's journal;
100 consecutive collisions fail closed. The running platform's staged version,
not a renderer field, supplies platform/version. Fee replacements keep the receipt.

The shared `public/radio/paid-receipt.mjs` decoder is used by public activity and
read-only reports. Non-XM receipts are labelled legacy starts. Unknown or invalid
XM formats are labelled unknown rather than presented as verified listens.
A random legacy receipt could match the XM/version prefix (about 1 in 16.7 million);
additional field validation reduces accidental interpretation but cannot eliminate it.

**Audible seconds are reported by the client, not verified on-chain.** The server
checks registration, local media, elapsed time and session admission rate. This
is not proof that a human listened or that sound reached physical speakers.
The contract proves its recorded payment and receipt, not listening behaviour.
