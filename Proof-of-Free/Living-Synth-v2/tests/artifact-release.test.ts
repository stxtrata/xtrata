import { describe, expect, it } from "vitest";
import {
  buildReleaseModel,
  buildSeedHtml,
  canonicalEngineSrc,
  deriveTraits,
  parseSeedHtml,
  traitProfileKey,
  validateSeedHtml
} from "../scripts/release-lib.mjs";
import {
  deriveTraits as deriveBrowserTraits,
  traitProfileKey as browserTraitProfileKey
} from "../src/traits";

describe("recursive release artifacts", () => {
  it("builds 1,024 deterministic, unique seeds depending on one engine", async () => {
    const first = await buildReleaseModel(12_345);
    const second = await buildReleaseModel(12_345);
    expect(first.manifest).toEqual(second.manifest);
    expect(first.children).toHaveLength(1_024);
    expect(new Set(first.children.map(child => child.sha256)).size).toBe(1_024);
    expect(new Set(first.children.map(child => traitProfileKey(child.traits))).size).toBe(1_024);
    expect(new Set(first.children.map(child => child.traits.hue)).size).toBe(1_024);
    expect(first.children.every(child =>
      JSON.stringify(child.traits) === JSON.stringify(deriveBrowserTraits(child.edition)) &&
      traitProfileKey(child.traits) === browserTraitProfileKey(child.traits)
    )).toBe(true);
    expect(first.children.every(child =>
      child.dependencies.length === 1 && child.dependencies[0] === "12345"
    )).toBe(true);
    expect(first.children.every(child => child.parents.length === 0)).toBe(true);
  });

  it("binds seed bytes to the edition, engine id, and canonical /i route", () => {
    const html = buildSeedHtml(512, 12_345);
    expect(canonicalEngineSrc(12_345)).toBe("/i/12345");
    expect(parseSeedHtml(html)).toMatchObject({
      payload: {
        protocol: "proof-of-free/seed",
        version: 2,
        edition: 512,
        engineId: 12_345,
        traits: deriveTraits(512)
      },
      engineSrc: "/i/12345"
    });
    expect(() => validateSeedHtml(html, { edition: 511, engineId: 12_345 })).toThrow(/identity/);
    expect(() => buildSeedHtml(512, 12_345, "https://example.com/engine.js")).toThrow(/must be/);
  });

  it("keeps the canonical engine free of release-time placeholders", async () => {
    const model = await buildReleaseModel(9);
    const source = model.engine.toString("utf8");
    expect(source).toContain("proof-of-free/engine-api-v2");
    expect(source).toContain("globalThis.ProofOfFree");
    expect(source).not.toContain("__ENGINE_ID__");
  });
});
