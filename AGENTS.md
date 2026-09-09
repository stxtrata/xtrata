# Repository instructions

## Media stays local by default

The user requires that images, audio and video are not staged, committed or pushed to GitHub unless they explicitly request the specific assets. This includes Bootcamp captures, screenshots, renders, narration, soundtracks and recordings. Keep local media files on disk. The entire root `media/` directory, including its scripts and notes, must remain ignored unless the user specifically requests an exception.

The root `.gitignore` excludes common media extensions at every depth, including uppercase variants. Do not bypass these rules with broad force-adds or negation rules. For a specifically authorised exception, stage only the exact approved paths and document that approval in the change notes.

Git ignores do not apply to already tracked files. Before committing or pushing, inspect staged and outgoing changes for media additions/modifications and omit any that have not been specifically authorised. Do not remove existing tracked application assets or rewrite history merely to enforce the new default; that requires a separately scoped request. Treat `.ts` and `.mts` as source-code extensions here, and inspect ambiguous files by content when necessary.

Source code, scripts, captions, notes and documents are not excluded merely because they support media production. An explicitly requested standalone application HTML may embed its assets; this policy does not prevent delivering that requested application.
