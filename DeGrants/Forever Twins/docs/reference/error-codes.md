# Helper error codes (v3)

| Code | Name | Meaning |
|---|---|---|
| u200 | NO-SUCH-TOKEN | The source reports no owner for this token |
| u201 | ALREADY-INSCRIBED | Token already has a twin (or twin id collision) |
| u202 | NOT-INSCRIBED | No twin exists for this token yet |
| u203 | WRONG-STATE | Swap in the wrong direction for the current state |
| u204 | NOT-AUTHORIZED | Caller is not the owner (or not the proposed owner) |
| u206 | NOT-CANONICAL | Token is not in the canonical record |
| u207 | FINALIZED | Record already finalised: no more seeding or finalising |
| u208 | NOT-FINALIZED | Record not finalised yet: no inscribing |
| u209 | COUNT-MISMATCH | Expected count doesn't match the seeded count |
| u210 | CUSTODY | Real ownership doesn't match what the swap requires |
| u211 | PAUSED | Retired in v3 (no pause) |
| u212 | NO-RESCUE | Not a stray, no rescue pending, or the stray side changed |
| u213 | TIMELOCK | Rescue delay not yet passed |
| u214 | FEE-CAP | Fee above `MAX-FEE` |
| u215 | BAD-CANONICAL | A seeded entry is invalid (size 0 or over 512 KB, empty mime or URI) |
| u216 | RESCUE-DISABLED | Helper deployed without rescue |
| u217 | LISTED | G2 only: the source reports a listing on this token |
| u218 | FEE-ODD | v3: fee must be even |
| u219 | NO-PENDING-OWNER | v3: no ownership proposal to accept or cancel |

Errors from the source collection and the Xtrata core pass through unchanged (for example the
Gamma family's u106 for a listed token).
