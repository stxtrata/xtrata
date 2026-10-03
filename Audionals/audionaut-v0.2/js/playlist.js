import { engine } from "./engine.js";
import { fetchAndDecode } from "./loader.js";
import { LANDMARKS } from "./song-format.js";
import { auditionSong } from "./song-player.js";
import { validateWordSelection } from "./word-index.js";

let active = null;
export function stopPlaylist(stopAudio = true) {
  if (!active) return;
  const session = active;
  active = null;
  session.controller.abort();
  session.state(false);
  session.status("Play all stopped.");
  if (stopAudio) insidePlaylist(() => engine.stopPreview());
}
engine.stopPlaylistPreview = () => stopPlaylist(false);
function insidePlaylist(work) {
  engine._playlistStarting = true;
  try {
    return work();
  } finally {
    engine._playlistStarting = false;
  }
}
export function isPlaylistActive(owner) {
  return active?.owner === owner;
}
function untilEnded(signal, start) {
  return new Promise((resolve, reject) => {
    let finished = false;
    const done = (error) => {
      if (finished) return;
      finished = true;
      signal.removeEventListener("abort", cancel);
      error ? reject(error) : resolve();
    };
    const cancel = () => done();
    signal.addEventListener("abort", cancel, { once: true });
    try {
      Promise.resolve(start(done)).catch(done);
    } catch (error) {
      done(error);
    }
  });
}
export async function playPlaylist(
  items,
  { owner, status = () => {}, state = () => {} } = {},
) {
  engine.stopPreview();
  if (!items.length) {
    status("No results to play.");
    return;
  }
  const session = { owner, status, state, controller: new AbortController() };
  active = session;
  state(true);
  const signal = session.controller.signal;
  let played = 0,
    skipped = 0;
  try {
    await engine.ensureContext().resume();
    for (let i = 0; i < items.length && active === session; i++) {
      const item = items[i],
        prefix = `${i + 1}/${items.length} · ${item.label || "Audio"}`;
      const kind = LANDMARKS[item.source.value]?.kind;
      if (kind && kind !== "song") {
        skipped++;
        status(
          `${prefix} · skipped interactive application (use its original player).`,
        );
        continue;
      }
      try {
        status(`Loading ${prefix}…`);
        if (kind === "song") {
          await untilEnded(signal, (done) =>
            insidePlaylist(() =>
              auditionSong(
                item.source.value,
                (message) => {
                  if (active === session) status(`${prefix} · ${message}`);
                },
                done,
              ),
            ),
          );
        } else {
          const { audioBuffer } = await fetchAndDecode(item.source, { signal });
          if (active !== session || signal.aborted) return;
          const selection = item.selection
            ? validateWordSelection(item.selection, audioBuffer.duration)
            : { start: 0, end: audioBuffer.duration };
          status(`Playing ${prefix}${skipped ? ` · ${skipped} skipped` : ""}`);
          await untilEnded(signal, (done) =>
            insidePlaylist(() =>
              engine.playBuffer(
                audioBuffer,
                selection.start,
                selection.end,
                done,
              ),
            ),
          );
        }
        if (active === session) played++;
      } catch (error) {
        if (signal.aborted || active !== session) return;
        skipped++;
        status(`${prefix} · skipped: ${error.message}`);
      }
    }
    if (active === session)
      status(
        `Play all finished · ${played} played${skipped ? ` · ${skipped} skipped (unavailable audio or interactive applications)` : ""}.`,
      );
  } catch (error) {
    if (active === session) status(`Play all failed: ${error.message}`);
  } finally {
    if (active === session) {
      active = null;
      state(false);
    }
  }
}
