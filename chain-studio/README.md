# Chain Studio

A local, dependency-free model workbench. Configure an ordered ladder of Codex models and reasoning efforts, start a chain, and inspect or test completed versions while later stages run.

## Start

Requires Node.js 22+ and a signed-in Codex installation (`codex login`).

```sh
cd /Users/melophonic/Documents/GitHub/xtrata/chain-studio
npm start
```

Open **http://127.0.0.1:4317**. Snapshot previews use port 4318. Both servers bind only to loopback. No package installation is needed.

The runner prefers the Codex binary bundled with `/Applications/ChatGPT.app` when present, to match the desktop model capabilities. Otherwise it uses `codex` from PATH. Override with `CHAIN_CODEX_BIN=/absolute/path/to/codex`. Override ports with `PORT` and `PREVIEW_PORT`, and the run directory with `CHAIN_DATA_DIR`.

## Workflow

1. Enter the original request and optional acceptance criteria.
2. Choose **Balanced**, **Light → Ultra**, or **Every option**, then edit, reorder, duplicate, or remove stages. Every option expands all supported effort levels of the visible models. Enable hidden models explicitly to include them. Older models are available only when advertised by your installed Codex catalog.
3. Assign each stage a role: clarify only, build, refine + improve, or read-only review. Models and reasoning levels are independent. A ladder need not be ascending.
4. Start the chain. Activity streams into the workbench. Select any completed stage to view its report, interactive static preview, files, comparison, prompts, or tests.
5. Leave feedback to include in stages that have not yet started. Pause waits for the current stage; Cancel interrupts it. Continue retries a failed stage or advances past a paused completed stage.
6. Download any completed snapshot as a `.tar.gz`. “Reuse setup” creates a fresh draft without starting it. Saved ladders are browser-local preferences.

## Execution and evidence

- Every stage runs a real `codex exec --json` invocation with the selected model and `model_reasoning_effort`. Sign-in is reused by the Codex process, never read by the UI.
- The original request and acceptance criteria are included verbatim in every stage prompt. Working prompts evolve separately. Two recent reports and a bounded actual code diff are passed forward.
- The selected source folder is copied using Git's tracked and unignored file list, including current uncommitted text changes. No source checkout is mutated. Empty source means a fresh workspace. Secrets, symlinks, wallet files, root media, ignored files, and dependency directories are excluded. Large projects are limited to 10,000 files / 100 MB; choose a smaller Git subfolder when needed.
- Each stage edits a distinct working directory, then saves a separate snapshot. Future stages and manual tests use copies. Reports distinguish agent-reported checks from deterministic JavaScript syntax checks and user-command test results. Passing syntax alone does not establish functional correctness.
- Models are discovered from Codex's saved catalog and optionally refreshed through `model/list`. A catalog entry is not a guarantee of account access; provider errors are visible and retryable, never silently replaced with another model.
- Usage is actual reported input/output/cached-input tokens. Cached tokens are included in input totals; reasoning is included in output totals. Failed stages may not return complete usage. Token thresholds are checked between stages and can overshoot by a whole stage. No estimated prices or hard dollar cap are claimed.
- Stage timeouts and cancellation terminate the child process group. A server restart marks unfinished stages as interrupted; Continue retries the unfinished stage from the previous saved snapshot.

## Preview and testing boundaries

Static HTML/CSS/JS runs in a sandboxed iframe on a separate loopback port. Remote resources, network calls, browser storage, popups, and top-level navigation are blocked. Relative local assets are supported. Full backend applications and dependency-based dev servers are **not** launched automatically; inspect/download those projects to run them separately.

Manual and configured automatic test commands run in a disposable snapshot copy with the macOS `sandbox-exec` policy, a minimal environment, no network, and a two-minute timeout. Writes are restricted to that disposable copy. Dependencies are not installed automatically. Command testing currently requires macOS; file review and static preview are portable. Use self-contained checks such as `node --test` for the first run. The app never uses personal wallets or authorizes signing, broadcasting, deployments, or messages.

## Persistence and security

Run records, prompts, logs, and snapshots are stored under ignored `.data/`. Keep this directory private: it contains your project content and prompts. The app exposes no public listener, checks Host/Origin and a per-process request token for writes, and never injects model output as dashboard HTML. Generated HTML is served only from the isolated preview server.

This first version is an explicit sequential ladder. It does not automatically select a winner, claim autonomous intent verification, or implement adaptive early exit. Every completed version remains available for your judgment.

## Tests

```sh
npm test
```

The suite checks model/effort validation, sequential execution and snapshot independence, prompt preservation, pause/resume and feedback, budget boundaries, failed-stage retry, failed-check pauses, cancellation, traversal/symlink handling, process timeout, test-copy isolation, sandbox restrictions, HTTP request protection, preview policy, and snapshot downloads. Test agents are deterministic substitutes; live provider verification is a separate smoke run.
