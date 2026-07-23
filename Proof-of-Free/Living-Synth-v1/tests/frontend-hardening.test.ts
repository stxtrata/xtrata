import { describe, expect, it } from "vitest";
import { recordingPostConditions } from "../src/contract-client";
import { sandboxDocument } from "../src/engine-sandbox";
import {
  MAX_GESTURE_POINTS,
  isLivingRecording,
  validateLivingRecording,
  type LivingRecording
} from "../src/recording";

const SENDER = "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X";
const RECIPIENT = "SP000000000000000000002Q6VF78";

const validRecording = (): LivingRecording => ({
  protocol: "proof-of-free/living-recording",
  version: 1,
  parent: { xtrataContract: `${SENDER}.xtrata-v3-2-3`, nftId: 0, edition: 1 },
  engine: { sampleRate: 48_000, loopMs: 1_000, waveform: "sawtooth" },
  gestures: [
    { at: 0, x: 0.1, y: 0.2, pressure: 0.6, gate: "on" },
    { at: 1_000, x: 0.8, y: 0.7, pressure: 0.5, gate: "off" }
  ],
  createdAt: "2026-07-23T00:00:00.000Z"
});

describe("Living Synth frontend hardening", () => {
  it("accepts only bounded recordings for the selected NFT and edition", () => {
    const recording = validRecording();
    expect(validateLivingRecording(recording, {
      nftId: 0,
      edition: 1,
      xtrataContract: `${SENDER}.xtrata-v3-2-3`
    })).toBe(recording);
    expect(isLivingRecording(recording)).toBe(true);

    expect(() => validateLivingRecording({ ...recording, gestures: [
      { ...recording.gestures[0], at: 900 },
      { ...recording.gestures[1], at: 800 }
    ] })).toThrow(/ordered/);
    expect(() => validateLivingRecording({ ...recording, gestures: [
      { ...recording.gestures[0], x: 1.01 }
    ] })).toThrow(/between 0 and 1/);
    expect(() => validateLivingRecording({
      ...recording,
      gestures: Array.from({ length: MAX_GESTURE_POINTS + 1 }, () => recording.gestures[0])
    })).toThrow(/1–4096/);
    expect(() => validateLivingRecording(recording, {
      nftId: 1,
      edition: 1,
      xtrataContract: `${SENDER}.xtrata-v3-2-3`
    })).toThrow(/selected NFT/);
  });

  it("pins an exact STX spend and explicitly pins zero for self-payment", () => {
    expect(recordingPostConditions(SENDER, RECIPIENT, 100_000)).toEqual([{
      type: "stx-postcondition",
      address: SENDER,
      condition: "eq",
      amount: "100000"
    }]);
    expect(recordingPostConditions(SENDER, SENDER, 100_000)[0]).toMatchObject({
      condition: "eq",
      amount: "0"
    });
  });

  it("reconstructs inscriptions inside a script-only, network-denied sandbox", () => {
    const document = sandboxDocument(
      '<!doctype html><html><head></head><body><div id="kaoss-pad"></div><script src="../engine.js"></script></body></html>',
      'function play(x,y,drag){}function point(event,drag){}'
    );
    expect(document).toContain("default-src 'none'");
    expect(document).toContain("connect-src 'none'");
    expect(document).toContain("globalThis.__proofOfFreePlay");
    expect(document).not.toContain('src="../engine.js"');
    expect(document.match(/<script>/g)).toHaveLength(2);
    expect(document.match(/<\/script>/g)).toHaveLength(2);
  });
});
