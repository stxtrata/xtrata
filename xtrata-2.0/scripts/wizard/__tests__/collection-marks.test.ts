import { describe, expect, it } from 'vitest';
import {
  ACCENTS,
  ARMS,
  ARMS_DEPENDENCIES,
  ARMS_GRID,
  ARMS_PALETTE,
  MARKS,
  MARK_DEPENDENCIES,
  MARK_GRID,
  renderArms,
  renderMark
} from '../collection-marks.mjs';
import { byteLength } from '../collection-kit.mjs';
import { CHUNK_SIZE } from '../compose.mjs';
import { HONESTY_PREAMBLE } from '../personas.mjs';

const countRects = (svg: string) => (svg.match(/<rect /g) ?? []).length;

describe('the three maker’s marks', () => {
  it('there is exactly one per wizard', () => {
    expect(MARKS.map((mark) => mark.wizard).sort()).toEqual(['archivist', 'builder', 'skeptic']);
  });

  it('renders byte-identically for the same wizard, every time', () => {
    for (const mark of MARKS) {
      expect(renderMark(mark.wizard)).toBe(renderMark(mark.wizard));
    }
  });

  it('fits one chunk, which is what keeps a mint on the cheap path', () => {
    for (const mark of MARKS) {
      expect(byteLength(renderMark(mark.wizard))).toBeLessThanOrEqual(CHUNK_SIZE);
    }
  });

  it('is well-formed SVG on the plates’ own grid', () => {
    for (const mark of MARKS) {
      const svg = renderMark(mark.wizard);
      expect(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"')).toBe(true);
      expect(svg.trimEnd().endsWith('</svg>')).toBe(true);
      expect(svg).toContain(`viewBox="0 0 ${MARK_GRID} ${MARK_GRID}"`);
      expect(svg).toContain('shape-rendering="crispEdges"');
      // No gradients, blur or filters — pixel art or nothing. Checked against
      // the markup only: the description legitimately says "no gradient and no
      // blur", and matching that was the test being wrong, not the art.
      const markup = svg.replace(/<title[\s\S]*?<\/desc>/, '');
      expect(markup).not.toMatch(/gradient|filter|blur|opacity/i);
    }
  });

  it('draws only in its own collection’s palette', () => {
    for (const mark of MARKS) {
      const svg = renderMark(mark.wizard);
      const used = new Set(svg.match(/#[0-9a-f]{6}/gi)?.map((c) => c.toLowerCase()) ?? []);
      const allowed = new Set(Object.values(mark.palette).map((c) => String(c).toLowerCase()));
      for (const colour of used) expect(allowed.has(colour)).toBe(true);
    }
  });

  it('says in its own description that it is a device and not a likeness', () => {
    // The central constraint. The corpus has never claimed personhood, and a
    // wizard depicting itself as a figure would undo that in one image. The
    // wording is asserted because it is the reader's only guarantee.
    for (const mark of MARKS) {
      const svg = renderMark(mark.wizard);
      expect(svg).toMatch(/device and not a likeness/i);
      expect(svg).toContain(HONESTY_PREAMBLE);
    }
  });

  it('never describes itself as a portrait, a face or a creature', () => {
    for (const mark of MARKS) {
      const svg = renderMark(mark.wizard);
      expect(svg).not.toMatch(/\b(portrait|face|eyes?|creature|figure of|myself as)\b/i);
    }
  });

  it('is a signature, not a ninth plate: it cites a persona and nothing cites it', () => {
    expect(MARK_DEPENDENCIES.cites).toBe('persona');
  });

  it('refuses a wizard it has no mark for', () => {
    expect(() => renderMark('nobody')).toThrow(/no maker/i);
  });
});

describe('the arms', () => {
  it('renders byte-identically every time and takes no arguments', () => {
    expect(renderArms()).toBe(renderArms());
    expect(renderArms.length).toBe(0);
  });

  it('fits one chunk', () => {
    expect(byteLength(renderArms())).toBeLessThanOrEqual(CHUNK_SIZE);
  });

  it('is drawn on its own larger grid, not the plates’', () => {
    expect(ARMS_GRID).toBe(32);
    expect(renderArms()).toContain(`viewBox="0 0 ${ARMS_GRID} ${ARMS_GRID}"`);
  });

  it('compiles ALL 32 rows, not just the first 16', () => {
    // The kit's own rect compiler is fixed at the 16-row plate size and
    // silently rendered only the top-left quarter of this shield — no error,
    // just a wrong picture. That is exactly the failure that would produce a
    // permanently wrong inscription, so it is asserted rather than trusted.
    const svg = renderArms();
    const ys = [...svg.matchAll(/<rect x="\d+" y="(\d+)"/g)].map((m) => Number(m[1]));
    const heights = [...svg.matchAll(/y="(\d+)" width="\d+" height="(\d+)"/g)].map(
      (m) => Number(m[1]) + Number(m[2])
    );
    expect(Math.max(...ys)).toBeGreaterThan(16);
    expect(Math.max(...heights)).toBeGreaterThan(24);
  });

  it('uses exactly four colours: the three accents and one ground', () => {
    // The palette is not chosen, it is inherited — so the shield names its
    // makers by pigment. A fifth colour would break that.
    const svg = renderArms();
    const used = new Set(svg.match(/#[0-9a-f]{6}/gi)?.map((c) => c.toLowerCase()) ?? []);
    expect(used.size).toBe(4);
    for (const accent of Object.values(ACCENTS)) {
      expect(used.has(String(accent).toLowerCase())).toBe(true);
    }
    expect(used.has(ARMS_PALETTE['.'].toLowerCase())).toBe(true);
  });

  it('carries all three fields, so no wizard is missing from the shield', () => {
    const svg = renderArms();
    for (const accent of Object.values(ACCENTS)) {
      expect(svg).toContain(`<g fill="${accent}">`);
    }
  });

  it('says it was adopted and not granted', () => {
    // True, and the reason it is stated: there is no authority that awards
    // arms to three processes, and implying one in a file that cannot be
    // corrected would be the kind of claim this corpus does not make.
    const svg = renderArms();
    expect(svg).toMatch(/adopted, not granted/i);
    expect(svg).toContain(HONESTY_PREAMBLE);
  });

  it('cites the three marks, which is the edge the pipeline will build', () => {
    expect(ARMS_DEPENDENCIES.cites).toEqual(MARKS.map((mark) => mark.id));
    expect(ARMS_DEPENDENCIES.cites).toHaveLength(3);
  });

  it('is compiled into runs rather than a rect per pixel', () => {
    // 32x32 is 1,024 cells. A rect each would still be pixel art, just
    // wasteful pixel art on a medium that charges by the chunk.
    expect(countRects(renderArms())).toBeLessThan(120);
  });
});
