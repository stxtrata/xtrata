import { describe, expect, it } from 'vitest';
import {
  CHUNK_SIZE,
  HONESTY_PREAMBLE,
  WizardComposeError,
  assertFitsOneChunk,
  byteLength,
  citationFrom,
  composeEntry,
  composeThread,
  composeThreadManifest,
  groupDigits,
  microStxToStx,
  parseEntry
} from '../compose.mjs';
import { PERSONA_IDS, SUBJECT_IDS } from '../personas.mjs';

const BASE = {
  threadId: 't-test-0001',
  subject: 'cost-of-permanence',
  blockHeight: 8_668_831,
  feeMicroStx: 11_000
};

const opening = () => composeEntry({ ...BASE, persona: 'archivist', position: 1 });

describe('composeEntry determinism', () => {
  it('produces byte-identical output for identical inputs', () => {
    const a = opening();
    const b = opening();
    expect(a).toBe(b);
    expect(byteLength(a)).toBe(byteLength(b));
  });

  it('is stable across every wizard, subject and position in the rotation', () => {
    for (const subject of SUBJECT_IDS) {
      for (let position = 1; position <= 6; position += 1) {
        const persona = PERSONA_IDS[(position - 1) % PERSONA_IDS.length];
        const args = { ...BASE, subject, persona, position };
        const first = composeEntry(
          position === 1
            ? args
            : { ...args, parentIds: ['1001'], answering: [{ id: '1001', wizard: 'a prior wizard', quote: 'q' }] }
        );
        const second = composeEntry(
          position === 1
            ? args
            : { ...args, parentIds: ['1001'], answering: [{ id: '1001', wizard: 'a prior wizard', quote: 'q' }] }
        );
        expect(second).toBe(first);
      }
    }
  });

  it('changes when any seeded input changes, so entries are not carbon copies', () => {
    const a = composeEntry({ ...BASE, persona: 'archivist', position: 1 });
    const b = composeEntry({ ...BASE, persona: 'archivist', position: 1, threadId: 't-test-0002' });
    expect(a).not.toBe(b);
  });
});

describe('the 16 KiB single-chunk cap', () => {
  it('every entry in every thread of every subject fits one chunk', () => {
    for (const subject of SUBJECT_IDS) {
      const thread = composeThread({ ...BASE, subject, ids: [1, 2, 3, 4, 5, 6] });
      for (const entry of thread.entries) expect(entry.bytes).toBeLessThanOrEqual(CHUNK_SIZE);
      expect(byteLength(thread.manifest)).toBeLessThanOrEqual(CHUNK_SIZE);
    }
  });

  it('throws rather than silently crossing onto the two-chunk cost path', () => {
    expect(() => assertFitsOneChunk('x'.repeat(CHUNK_SIZE + 1), 'oversize')).toThrow(WizardComposeError);
    expect(() => assertFitsOneChunk('x'.repeat(CHUNK_SIZE + 1))).toThrow(/16,384-byte single-chunk limit/);
    expect(assertFitsOneChunk('x'.repeat(CHUNK_SIZE))).toBe(CHUNK_SIZE);
  });

  it('refuses a manifest that would not fit one chunk', () => {
    const entries = Array.from({ length: 400 }, (_, index) => ({
      id: String(9000 + index),
      position: index + 1,
      wizardName: 'Wizard-1, the Archivist',
      claim: 'A claim long enough that four hundred of them cannot possibly fit inside one sixteen kibibyte chunk.',
      block: '8668831',
      costMicroStx: '11000'
    }));
    expect(() => composeThreadManifest({ threadId: 't-huge', entries })).toThrow(WizardComposeError);
  });
});

describe('self-description', () => {
  it('states wizard, thread, position, block and its own cost', () => {
    const body = opening();
    const parsed = parseEntry(body);
    expect(parsed.wizard).toBe('archivist');
    expect(parsed.wizardName).toBe('Wizard-1, the Archivist');
    expect(parsed.thread).toBe('t-test-0001');
    expect(parsed.position).toBe(1);
    expect(parsed.block).toBe('8668831');
    expect(parsed.costUstx).toBe('11000');
    expect(parsed.subject).toBe('cost-of-permanence');
    expect(parsed.claim).toBeTruthy();

    // the same facts are in the prose, not only the front matter
    expect(body).toContain('Entry 1 of 6 in thread `t-test-0001`');
    expect(body).toContain('Stacks block 8,668,831');
    expect(body).toContain('11,000 microSTX');
    expect(body).toContain('0.011 STX');
    expect(body).toContain('SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3');
  });

  it('quotes whatever fee it is actually given, not a baked-in number', () => {
    const body = composeEntry({ ...BASE, persona: 'archivist', position: 1, feeMicroStx: 3_000 });
    expect(body).toContain('3,000 microSTX');
    expect(body).toContain('0.003 STX');
    expect(body).not.toContain('11,000 microSTX');
  });

  it('refuses to compose without a block or a cost, since it could not describe itself', () => {
    expect(() => composeEntry({ ...BASE, persona: 'archivist', position: 1, blockHeight: undefined })).toThrow(
      /blockHeight is required/
    );
    expect(() => composeEntry({ ...BASE, persona: 'archivist', position: 1, feeMicroStx: undefined })).toThrow(
      /feeMicroStx is required/
    );
  });
});

describe('titles', () => {
  const titleOf = (body: string) => /\n# (.+)\n/.exec(body)?.[1] ?? '';

  it('gives every entry in a thread a distinct title', () => {
    // Titling by subject gave all six entries the same H1, which in a gallery
    // is six items that look identical. The title now comes from each entry's
    // own claim.
    for (const subject of SUBJECT_IDS) {
      const thread = composeThread({ ...BASE, subject, ids: [1, 2, 3, 4, 5, 6] });
      const titles = thread.entries.map((entry) => titleOf(entry.body));
      expect(titles.every((title) => title.length > 0)).toBe(true);
      expect(new Set(titles).size).toBe(titles.length);
    }
  });

  it('titles from the claim, as a headline the claim still opens with', () => {
    const body = opening();
    const claim = /\n## Claim\n\n(.+)\n/.exec(body)?.[1] ?? '';
    expect(claim.length).toBeGreaterThan(0);
    // The headline is a prefix of the claim, never a reworded version of it.
    // An abridged headline carries a trailing ellipsis and is a prefix up to it.
    expect(claim.startsWith(titleOf(body).replace(/…$/, ''))).toBe(true);
    expect(titleOf(body)).not.toMatch(/[.,;:]$/);
  });

  it('keeps titles short enough to survive a gallery card', () => {
    for (const subject of SUBJECT_IDS) {
      const thread = composeThread({ ...BASE, subject, ids: [1, 2, 3, 4, 5, 6] });
      for (const entry of thread.entries) {
        expect(titleOf(entry.body).length).toBeLessThanOrEqual(90);
      }
    }
  });

  it('shortening the headline never changes what replies quote', () => {
    // Replies cite the Claim section verbatim, so the full claim must survive
    // in the body even when the headline is abridged.
    const body = opening();
    const claim = /\n## Claim\n\n(.+)\n/.exec(body)?.[1] ?? '';
    const citation = citationFrom(body, 4242);
    expect(claim).toContain(citation.quote);
  });

  it('still names the subject in the entry, just not as the headline', () => {
    const body = opening();
    expect(body).toMatch(/subject: /);
  });
});

describe('honesty', () => {
  it('never claims to be human or sentient, and says it is a process with a budget', () => {
    for (const subject of SUBJECT_IDS) {
      const thread = composeThread({ ...BASE, subject, ids: [1, 2, 3, 4, 5, 6] });
      for (const entry of thread.entries) {
        // Entries carry the disclosure tersely — the full preamble is stated
        // once in the manifest rather than six times inside the thread. What
        // must survive that trim is the disclosure itself, so assert the
        // property and not the wording.
        expect(entry.body).toMatch(/not a person/i);
        expect(entry.body).toMatch(/not sentient/i);
        expect(entry.body).toMatch(/automated process/i);
        expect(entry.body).not.toMatch(/\bI am a human\b|\bI am conscious\b|\bI feel\b/i);
      }
      // The long-form disclosure, including the fixed-perspective and finite-
      // budget framing, lives in the manifest for the whole thread.
      expect(thread.manifest).toContain(HONESTY_PREAMBLE);
      expect(thread.manifest).toMatch(/perspective/);
      expect(thread.manifest).toMatch(/budget|float/);
    }
  });
});

describe('call and response', () => {
  it('cites its parent by inscription id and by quoted fragment', () => {
    const first = opening();
    const citation = citationFrom(first, 4242);
    const reply = composeEntry({
      ...BASE,
      persona: 'skeptic',
      position: 2,
      parentIds: [4242],
      answering: [citation]
    });
    expect(reply).toContain('answers: #4242');
    expect(reply).toContain('inscription #4242');
    expect(reply).toContain(citation.quote);
    expect(reply).toContain('Wizard-1, the Archivist');
    expect(citation.quote).toBe(parseEntry(first).claim);
  });

  it('refuses a reply that names a parent but quotes nothing from it', () => {
    expect(() =>
      composeEntry({ ...BASE, persona: 'skeptic', position: 2, parentIds: [4242], answering: [] })
    ).toThrow(WizardComposeError);
    expect(() =>
      composeEntry({
        ...BASE,
        persona: 'skeptic',
        position: 2,
        parentIds: [4242],
        answering: [{ id: '4242', wizard: 'x', quote: '   ' }]
      })
    ).toThrow(/must reference what it/);
  });

  it('marks an opening statement as answering nothing', () => {
    expect(opening()).toContain('answers: (opening statement)');
  });

  it('chains a whole thread, each entry quoting the one before it', () => {
    const thread = composeThread({ ...BASE, ids: [11, 12, 13, 14, 15, 16] });
    expect(thread.entries).toHaveLength(6);
    expect(thread.entries[0].parentIds).toEqual([]);
    for (let index = 1; index < thread.entries.length; index += 1) {
      const previous = thread.entries[index - 1];
      const current = thread.entries[index];
      expect(current.parentIds).toEqual([previous.id]);
      expect(current.body).toContain(`inscription #${previous.id}`);
      expect(current.body).toContain(previous.claim as string);
    }
  });
});

describe('distinguishable voices', () => {
  it('gives each wizard a different claim, body and sign-off on the same subject', () => {
    const bodies = PERSONA_IDS.map((persona, index) =>
      composeEntry({
        ...BASE,
        persona,
        position: index + 1,
        ...(index === 0
          ? {}
          : { parentIds: ['1001'], answering: [{ id: '1001', wizard: 'a prior wizard', quote: 'q' }] })
      })
    );
    const claims = bodies.map((body) => parseEntry(body).claim);
    expect(new Set(claims).size).toBe(PERSONA_IDS.length);
    expect(new Set(bodies).size).toBe(PERSONA_IDS.length);

    expect(bodies[0]).toContain('wizard-voice: Declarative');
    expect(bodies[1]).toContain('wizard-voice: Interrogative');
    expect(bodies[2]).toContain('wizard-voice: Mechanical');

    // the Skeptic asks, the Builder describes machinery, the Archivist declares
    expect(claims[1]).toMatch(/\?|prove|Ask|Say|Name/);
    expect(bodies[2]).toMatch(/chunk|hash|contract|map|Clarity|transaction/i);
  });

  it('rotates the second turn onto different material than the first', () => {
    const firstTurn = composeEntry({ ...BASE, persona: 'archivist', position: 1 });
    const secondTurn = composeEntry({
      ...BASE,
      persona: 'archivist',
      position: 4,
      parentIds: ['1003'],
      answering: [{ id: '1003', wizard: 'Wizard-3, the Builder', quote: 'q' }]
    });
    expect(parseEntry(secondTurn).claim).not.toBe(parseEntry(firstTurn).claim);
  });
});

describe('composeThreadManifest', () => {
  it('lists every member id, in the front matter and in the body', () => {
    const thread = composeThread({ ...BASE, ids: [101, 102, 103, 104, 105, 106] });
    const manifest = thread.manifest;
    for (const entry of thread.entries) {
      expect(manifest).toContain(`#${entry.id}`);
      expect(manifest).toContain(entry.claim as string);
    }
    expect(manifest).toContain('member-ids: #101, #102, #103, #104, #105, #106');
    expect(manifest).toContain('members: 6');
    expect(manifest).toContain('protocol-cost-ustx: 66000');
    expect(manifest).toContain('record: thread-manifest');
  });

  it('records each member txid when one is known', () => {
    const manifest = composeThreadManifest({
      threadId: 't-test-0001',
      entries: [
        {
          id: '101',
          position: 1,
          wizardName: 'Wizard-1, the Archivist',
          claim: 'a claim',
          block: '8668831',
          costMicroStx: '11000',
          txid: '0xabc'
        }
      ]
    });
    expect(manifest).toContain('tx `0xabc`');
  });

  it('refuses a member with no inscription id, and refuses an empty thread', () => {
    expect(() => composeThreadManifest({ threadId: 't', entries: [{ position: 1 }] })).toThrow(
      /needs an inscription id/
    );
    expect(() => composeThreadManifest({ threadId: 't', entries: [] })).toThrow(/at least one member/);
  });

  it('refuses to close a thread that is not finished', () => {
    const entries = [{ id: '101', position: 1, wizardName: 'Wizard-1, the Archivist', claim: 'c', block: '1', costMicroStx: '11000' }];
    expect(() => composeThreadManifest({ threadId: 't', entries, threadLength: 6 })).toThrow(
      /closes a completed thread/
    );
    expect(() => composeThreadManifest({ threadId: 't', entries, threadLength: 1 })).not.toThrow();
  });
});

describe('locale-free number formatting', () => {
  it('groups digits without toLocaleString', () => {
    expect(groupDigits(0)).toBe('0');
    expect(groupDigits(999)).toBe('999');
    expect(groupDigits(11_000)).toBe('11,000');
    expect(groupDigits(8_668_831)).toBe('8,668,831');
  });

  it('renders microSTX as STX with at least three decimals', () => {
    expect(microStxToStx(0)).toBe('0.000');
    expect(microStxToStx(3_000)).toBe('0.003');
    expect(microStxToStx(11_000)).toBe('0.011');
    expect(microStxToStx(1_000_000)).toBe('1.000');
    expect(microStxToStx(1_234_567)).toBe('1.234567');
  });
});

describe('input validation', () => {
  it('rejects unknown wizards and subjects', () => {
    expect(() => composeEntry({ ...BASE, persona: 'nobody', position: 1 })).toThrow(/unknown wizard/);
    expect(() => composeEntry({ ...BASE, persona: 'archivist', subject: 'nothing', position: 1 })).toThrow(
      /unknown subject/
    );
  });

  it('rejects positions outside the thread', () => {
    expect(() => composeEntry({ ...BASE, persona: 'archivist', position: 0 })).toThrow(WizardComposeError);
    expect(() => composeEntry({ ...BASE, persona: 'archivist', position: 7 })).toThrow(/does not fit a thread/);
  });

  it('rejects a body that is not a wizard entry when parsing', () => {
    expect(() => parseEntry('# not an entry')).toThrow(/no front matter/);
  });
});

describe('the manifest tells the truth about how to walk the thread', () => {
  const manifestOf = () =>
    composeThread({ ...BASE, subject: 'cost-of-permanence', ids: [1, 2, 3, 4, 5, 6] }).manifest;

  it('does not claim the edges can be followed forward', () => {
    // get-dependencies names what an entry answers; the core keeps no reverse
    // index, so nothing on chain leads from an earlier entry to a later one.
    // The manifest previously said "start at the lowest id and follow the edges
    // forward", which is not possible — a bad instruction to make permanent in
    // a document whose whole claim is that it is checkable.
    const manifest = manifestOf();
    expect(manifest).not.toMatch(/lowest id/i);
    expect(manifest).not.toMatch(/edges forward/i);
  });

  it('says the edges point backwards and names the read that proves it', () => {
    const manifest = manifestOf();
    expect(manifest).toMatch(/backwards only/i);
    expect(manifest).toContain('get-dependencies');
    expect(manifest).toMatch(/highest id and walk back/i);
  });

  it('still defers to the edges over its own list', () => {
    expect(manifestOf()).toMatch(/the edges are right and this file is wrong/i);
  });
});
