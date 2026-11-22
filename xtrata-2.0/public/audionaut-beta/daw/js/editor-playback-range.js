// Change the active editor loop on the scheduler's clock. Events already submitted
// to Web Audio keep their timestamps, voices and releases.
import { compilePlaybackPlan, secondsToBeat } from './playback-plan.js';

export function applyEditorPlaybackRange(engine, request, now) {
  const project = engine.store.project;
  const options = { buffers: engine.buffers, seed: engine.seed };
  const song = request.kind === 'song' ? compilePlaybackPlan(project, options) : null;
  const target = song
    ? { start: 0, end: song.endBeat }
    : { start: request.start, end: request.end };
  const plan = engine._plan;
  const lastEvent = plan.events[engine._planCursor - 1];
  const lastTime = lastEvent?.time ?? -Infinity;
  // Within the lookahead window the clock can already belong to the next pass.
  const elapsed = Math.max(0, now - engine._planOrigin, lastTime);
  const beat = Math.max(
    secondsToBeat(project, plan.startSeconds + elapsed),
    lastEvent?.beat ?? plan.startBeat
  );
  const unit = request.kind === 'sequence' ? 16 : 4;
  const inside = beat >= target.start && beat < target.end;
  const active = engine._loopRange;
  const finishingLoop =
    request.finishLoop &&
    active &&
    active.end === plan.endBeat &&
    active.end - active.start <= unit;
  const boundary = finishingLoop ? plan.endBeat : (Math.floor(beat / unit) + 1) * unit;
  const end = inside ? target.end : Math.min(plan.endBeat, boundary);

  if (end === plan.endBeat && active?.start === target.start && active.end === target.end) return;
  engine._loopRange = target;
  engine._nextLoopPlan = null;
  if (end === plan.endBeat) return;
  const range = { start: plan.startBeat, end };
  const next =
    song && range.start === 0 && range.end === song.endBeat
      ? song
      : compilePlaybackPlan(project, { ...options, range });
  engine._playRange = range;
  engine._plan = next;
  // Both plans have the same origin. Never schedule a second attack or UI tick
  // for an instant the previous pass already handled.
  const cursor = next.events.findIndex((event) => event.time > lastTime);
  engine._planCursor = cursor < 0 ? next.events.length : cursor;
  const run = engine._transportRuns.at(-1);
  if (run.repeats > 1) {
    run.repeats--;
    engine._transportRuns.push({ ...run, clock: engine._planOrigin, endBeat: end, repeats: 1 });
  } else {
    run.endBeat = end;
  }
}
