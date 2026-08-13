# Changelog

Newest first. The version shown in the app header comes from `APP_VERSION` in
[`src/frontend/js/core.js`](src/frontend/js/core.js) — bump it there, add an entry here, and commit.

**Major and minor track the folder name.** This is `V13.2.0`, so every version here is
`13.2.x` and only the patch number moves, however big the change. A new lineage means a new
folder: clone to `V13.3.0` and its first version is `13.3.0`. That way the badge always tells
you which folder you are running out of, and a version number can never name a folder that
holds something else.

No build step, so a hard refresh (Cmd+Shift+R) is all that is needed to see a new version.

---

## 13.2.7 — 2026-08-13

**Added — swapped-voice safety check**

Cue names are assigned to voice slots in order of first appearance in the manuscript, which
has nothing to do with which voice you chose for which slot. Get it backwards and the whole
book narrates in swapped voices, and the only symptom is the finished audio.

Two independent defences, because neither is sufficient alone:

1. **The book is asked who the characters are.** `detectCharacterGender` in `core.js` counts
   gendered pronouns near each lead's name. In a dual-POV novel each lead is narrated in
   first person in their own chapters and in third person in the other's, so the signal is
   everywhere. Works in English, French, Spanish, Italian, Portuguese, German and Dutch, and
   returns `unknown` rather than guessing when evidence is thin or close to even.
2. **A plain second look.** Whenever the two voices differ in sex, the pairing is shown for
   confirmation regardless of what step 1 concluded. This one cannot be fooled, because it
   does not try to be clever.

**Added — one-click correction**

- **⇄ Swap the two voices** exchanges the ElevenLabs voices while leaving the character names
  in place, then re-points every ungenerated segment. Already-generated audio keeps the voice
  it was made with, and you are told so before the swap.
- **Pairing is correct** dismisses the check for the current pairing.
- Generation is gated: a detected contradiction must be confirmed or corrected before any
  money is spent.
- The check re-runs when you pick a voice by hand, not only after analysis.

On the manuscript that prompted this, the book refers to Logan as male in 81% of the
gendered pronouns near his name while he was set to a female voice. The warning names the
character, the evidence and the fix.

**Detection notes.** Ambiguous pronouns are deliberately excluded: French `lui` and Italian
`gli` are dative and serve both sexes, German `sie` is also "they" and formal "you". French
impersonals like `il y a` and `il faut` are stripped, since they start with a gendered-looking
pronoun but name nobody. Only the first pronoun after each mention votes, so one long sentence
is one vote rather than six. Five unit tests cover the confident cases, the refusals and both
traps.

---

## 13.2.6 — 2026-08-13

**Added**

- Analysis now states which character got which voice, and the sex of that voice:
  `Voice 1: Logan will be read by Jessica Anne Bogart - Conversations (female).`
  POV cue names are assigned to slots in order of first appearance, and nothing in the app
  can know a character's sex, so a male lead could land on a female voice with no complaint.
  The only previous clue was the colour of the segment badges, which reads as "the colours
  are wrong" rather than "the voices are swapped".
- A warning when the voice switch token appears inside a chapter that already names its POV
  in the heading. Such a chapter is single-speaker by construction, so a token inside it is
  far more likely to be a scene break. The token is still honoured, since books that
  alternate mid-chapter depend on it, but the split is no longer silent.

**Not changed**

- Badge colours. They already come from `labels.gender` as reported by ElevenLabs, via
  `getVoiceGender`, and were correct: a character shown in pink is on a female voice. The
  fix for a wrong-looking colour is to fix the pairing, not the palette.

---

## 13.2.5 — 2026-08-13

**Fixed**

- `core.js` held two raw control characters — a literal NUL and a literal `0x1F` — inside the
  control-character regex in `toReadableFilename`, where the escapes `\x00` and `\x1f` were
  meant. The code worked, since JavaScript accepts literal control characters in a regex
  character class, but the raw NUL made every tool treat the file as **binary**: `git diff`
  reported `Bin 8445 bytes` with no lines, and `grep` silently matched nothing in it.
- That mattered more than it looks. `core.js` is where `APP_VERSION` lives, so every future
  version bump would have been an unreviewable binary blob in the history.

Both bytes are now written as escapes. Same characters, same range, no behaviour change:
verified that `toReadableFilename` still strips NUL, `0x1F` and `0x07` from a filename. This
predates the session, and `core.js` was the only one of the 23 tracked files affected.

This commit still shows as binary because the version in HEAD is the binary side. Diffs from
here on are readable.

---

## 13.2.4 — 2026-08-13

**Changed**

- **New Project** moved out of the Load modal and into the header, so the group reads
  New · Save · Load. It was previously reachable only by opening Load first, which is an
  odd place to look for it.
- The Load modal footer now points at both header buttons instead of holding the button.

Same `createProjectFromSettings()` behind it, confirmation dialog included, so a stray
click still cannot wipe unsaved text. No JavaScript change was needed: the function ends
with `closeProjectModal()`, which only removes a CSS class and is a no-op when no modal
is open.

**Versioning correction.** This entry was briefly numbered 13.3.0, which collided with the
folder-naming scheme: a future `V13.3.0` folder would have been a different thing from a
`13.3.0` running inside `V13.2.0`. Major and minor now follow the folder and only the patch
number moves. Renumbered before this reached anything outside the working tree.

---

## 13.2.3 — 2026-08-13

**Fixed**

- Creating a new project carried the previous project's spend into the receipt, so a
  blank project could open reading `$84.68 / $0.00`. `createProjectFromSettings` reset
  chapters, manuscript, ID, metadata, notes and the summary panel, but never the spend.
- The same stale figure was checked against your budget limit before every segment, so a
  new project could refuse to generate with "Budget Exceeded" and nothing on screen
  explaining why.

Spend is per-project: `loadProject` already restores it from the project file, so a new
project starting at zero is what the rest of the app assumes. Re-analysing a project and
saving it as a new version both keep their spend, which is correct in both cases.

---

## 13.2.2 — 2026-08-13

**Fixed**

- Connecting to ElevenLabs logged a bare `Connection failed` no matter what went
  wrong, so a mistyped key, a revoked key, a key ID pasted instead of the key, and a
  key lacking the right permission were all indistinguishable. The console panel now
  reports the HTTP status and the real message, e.g. `401 Invalid API key`.
- The fetch wrapper only understood our own backend's `{error}` error shape. ElevenLabs
  replies with `{detail:{status,message}}`, which came out as a useless "Request failed".
  Both shapes are now read.
- `fetchVoices` names the missing permission when a key is valid but not scoped for
  `voices_read`, which is easy to hit with a key created as text-to-speech only.

---

## 13.2.1 — 2026-08-13

**Added**

- Version badge in the header, next to the Narrate.AI Studio wordmark. Hovering it
  shows the build date and a one-line note about what changed.
- This changelog.

The version lives in exactly one place, `core.js`. `index.html` ships an empty badge
that `script.js` fills at startup, so there is no second copy to fall out of sync.

---

## 13.2.0 — baseline

The tree as imported into git. Only source is tracked; generated audio, logs and
working manuscripts are ignored.
