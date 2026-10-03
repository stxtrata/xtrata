import { store, stepVal } from "./state.js";
import {
  fetchAndDecode,
  assignDecodedSample,
  ordinalId,
  reserveSampleAssignment,
} from "./loader.js";
import { validateWordSelection } from "./word-index.js";
import { selectionBounds } from "./audio-utils.js";

export async function importSelection(
  ch,
  source,
  selection = null,
  { signal = null, step = null, sequence = store.seq } = {},
) {
  if (selection) {
    validateWordSelection(selection);
    if (
      source.type !== "ordinal" ||
      ordinalId(source.value) !== selection.ordinalId.toLowerCase()
    )
      throw new Error("The word timing belongs to a different audio source.");
  }
  if (step !== null && (!Number.isInteger(step) || step < 0 || step >= 64))
    throw new Error("Choose a step from 1 to 64.");
  const project = store.project,
    channel = store.channel(ch);
  if (!channel) throw new Error("Choose an available sample channel.");
  const stillCurrent = reserveSampleAssignment(ch);
  const result = await fetchAndDecode(source, { signal });
  if (
    signal?.aborted ||
    !stillCurrent() ||
    project !== store.project ||
    channel !== store.channel(ch) ||
    !project.sequences.includes(sequence)
  )
    throw new DOMException("The destination changed.", "AbortError");
  const bounds = selection
    ? selectionBounds(result.audioBuffer, selection.start, selection.end)
    : null;
  const same =
    channel.source?.type === source.type &&
    channel.source.value === source.value;
  assignDecodedSample(ch, source, result, { reset: !same });
  if (bounds) {
    const metadata = {
      ordinalId: ordinalId(source.value),
      text: selection.text,
      start: bounds.start,
      end: bounds.end,
    };
    const region = {
      trimStart: bounds.start / result.audioBuffer.duration,
      trimEnd: bounds.end / result.audioBuffer.duration,
    };
    if (step === null) {
      Object.assign(channel, region, {
        wordSelection: metadata,
        pitch: 1,
        reverse: false,
      });
    } else {
      const old = sequence.steps[ch][step];
      sequence.steps[ch][step] = {
        v: stepVal(old) || 1,
        ...region,
        pitch: 1,
        rev: false,
        wordSelection: metadata,
      };
    }
  }
  if (step !== null && !bounds) sequence.steps[ch][step] = 1;
  if (bounds && step === null && sequence.steps[ch].every((s) => !stepVal(s)))
    sequence.steps[ch][0] = 1;
  store.emit("channel", { ch, prop: "wordSelection" });
  store.emit("sequence", store.project.currentSequence);
  return result;
}
