/**
 * pipeline-rehearse.mjs — a whole chain, in memory, so the rehearsal can prove
 * the things a dry run cannot.
 *
 * WHY THIS EXISTS AT ALL.
 *
 * `--dry` composes every transaction and signs none. That proves the bodies
 * render, the fees quote and the caps arithmetic works, and it proves nothing
 * whatever about the part of this pipeline that is actually dangerous: the
 * gates. A dry run mints nothing, so there are no ids, so there is nothing to
 * read back, so every gate is skipped. The one mechanism standing between the
 * fleet and a permanent manifest citing a wrong plate is the one mechanism a
 * dry run never executes.
 *
 * So the rehearsal runs the pipeline for real -- `broadcast: true`, the full
 * intent-journal-submit-poll-verify loop, every gate firing -- against a chain
 * that lives in a JavaScript object. Nothing reaches a network. The fetch port
 * throws on any URL it does not recognise, which is the property that makes
 * "nothing was broadcast" a checkable claim rather than an assurance.
 *
 * AND IT CAN LIE ON PURPOSE.
 *
 * A gate that has only ever seen correct input has not been tested; it has been
 * watched. `inject` corrupts the fake chain in the specific ways the real one
 * can go wrong -- a body that differs by one byte, a dependency edge pointing at
 * the wrong persona, an inscription that vanishes, a creator who is not the
 * wizard -- and the rehearsal asserts that the matching gate halts the pipeline.
 * Those are negative controls. If removing a gate does not break a test, the
 * test was not testing the gate.
 */

import {
  bufferCV,
  cvToHex,
  hexToCV,
  cvToJSON,
  listCV,
  noneCV,
  responseOkCV,
  someCV,
  standardPrincipalCV,
  trueCV,
  falseCV,
  tupleCV,
  uintCV
} from '@stacks/transactions';

const CHUNK_SIZE = 16_384;

const jsonResponse = (body) => ({
  ok: true,
  status: 200,
  json: async () => body,
  text: async () => JSON.stringify(body)
});

const okay = (cv) => jsonResponse({ okay: true, result: cvToHex(cv) });

/**
 * The fake chain.
 *
 * `inscriptions` is the whole ledger: id -> { body, mime, tokenUri,
 * dependencies, creator }. Ids are assigned in mint order from `nextId`, which
 * starts high enough that no test can accidentally match a real mainnet id and
 * read as a live result.
 */
export function makeFakeChain({
  nextId = 90_001,
  balances = {},
  tip = 1_000_000,
  feeUstx = 41_000n,
  paused = false
} = {}) {
  const state = {
    nextId,
    tip,
    paused,
    inscriptions: new Map(),
    byHash: new Map(),
    txs: new Map(),
    nonces: new Map(),
    balances: new Map(Object.entries(balances).map(([address, amount]) => [address, BigInt(amount)])),
    /** Every URL the fetch port was asked for, so a test can assert the shape of the traffic. */
    calls: [],
    broadcasts: 0
  };

  const balanceOf = (address) => state.balances.get(address) ?? 10_000_000n;

  /**
   * Deliberate corruption, applied after a mint so the gate that follows sees
   * it. Each mode is one real failure the pipeline must refuse to build on.
   */
  const inject = (mode, target) => {
    const record = state.inscriptions.get(String(target));
    if (!record && mode !== 'vanish') throw new Error(`nothing at #${target} to corrupt`);
    if (mode === 'flip-byte') {
      // One byte, at the FRONT. The comparison is total, so one byte is the
      // whole test -- but it has to actually happen. This was `/.$/` first,
      // which without the `m` flag needs a non-newline as the final character;
      // every body here ends in a newline, so it matched nothing and three
      // negative controls passed while corrupting nothing at all. A control
      // that silently does nothing is worse than not having one.
      record.body = (record.body[0] === 'X' ? 'Y' : 'X') + record.body.slice(1);
    } else if (mode === 'wrong-dependency') {
      record.dependencies = ['999999'];
    } else if (mode === 'drop-dependency') {
      record.dependencies = record.dependencies.slice(0, -1);
    } else if (mode === 'extra-dependency') {
      record.dependencies = [...record.dependencies, '999999'];
    } else if (mode === 'wrong-creator') {
      record.creator = 'SP000000000000000000002Q6VF78';
    } else if (mode === 'vanish') {
      state.inscriptions.delete(String(target));
    } else {
      throw new Error(`"${mode}" is not an injection this fake chain knows how to make`);
    }
    return state;
  };

  const readOnly = (functionName, args) => {
    if (functionName === 'is-paused') return okay(responseOkCV(state.paused ? trueCV() : falseCV()));

    if (functionName === 'quote-inscription-fee') {
      const totalSize = BigInt(args[0].value);
      const chunks = BigInt(args[1].value);
      return okay(
        responseOkCV(
          tupleCV({
            'total-fee': uintCV(feeUstx),
            'single-tx-fee': uintCV(feeUstx),
            'single-tx-eligible': chunks <= 32n ? trueCV() : falseCV(),
            'chunk-size': uintCV(BigInt(CHUNK_SIZE)),
            'upload-batches': uintCV(totalSize > 0n ? 1n : 0n)
          })
        )
      );
    }

    if (functionName === 'get-chunk') {
      const record = state.inscriptions.get(String(args[0].value));
      if (!record) return okay(noneCV());
      return okay(someCV(bufferCV(Buffer.from(record.body, 'utf8'))));
    }

    if (functionName === 'get-dependencies') {
      const record = state.inscriptions.get(String(args[0].value));
      return okay(listCV((record?.dependencies ?? []).map((id) => uintCV(BigInt(id)))));
    }

    if (functionName === 'get-inscription-creator') {
      const record = state.inscriptions.get(String(args[0].value));
      return okay(record?.creator ? someCV(standardPrincipalCV(record.creator)) : noneCV());
    }

    if (functionName === 'get-id-by-hash') {
      const wanted = String(args[0].value).replace(/^0x/, '');
      const found = state.byHash.get(wanted);
      return okay(found ? someCV(uintCV(BigInt(found))) : noneCV());
    }

    if (functionName === 'get-owner') {
      const record = state.inscriptions.get(String(args[0].value));
      return okay(responseOkCV(record?.creator ? someCV(standardPrincipalCV(record.creator)) : noneCV()));
    }

    throw new Error(`the fake chain has no answer for read-only "${functionName}"`);
  };

  const fetchImpl = async (url, init) => {
    state.calls.push(String(url));

    const readMatch = /\/v2\/contracts\/call-read\/[^/]+\/[^/]+\/([^/?]+)/.exec(String(url));
    if (readMatch) {
      const payload = JSON.parse(init?.body ?? '{}');
      const args = (payload.arguments ?? []).map((hex) => cvToJSON(hexToCV(hex)));
      return readOnly(readMatch[1], args);
    }

    const balanceMatch = /\/extended\/v2\/addresses\/([^/]+)\/balances\/stx/.exec(String(url));
    if (balanceMatch) return jsonResponse({ balance: String(balanceOf(balanceMatch[1])) });

    if (/\/extended\/v2\/blocks\?limit=1/.test(String(url))) {
      return jsonResponse({ results: [{ height: state.tip }] });
    }

    const nonceMatch = /\/extended\/v1\/address\/([^/]+)\/nonces/.exec(String(url));
    if (nonceMatch) {
      const nonce = state.nonces.get(nonceMatch[1]) ?? 0;
      return jsonResponse({ last_executed_tx_nonce: nonce - 1, possible_next_nonce: nonce });
    }

    const txMatch = /\/extended\/v1\/tx\/([^/?]+)/.exec(String(url));
    if (txMatch) {
      const tx = state.txs.get(txMatch[1]);
      if (!tx) return { ok: false, status: 404, json: async () => ({}), text: async () => '' };
      return jsonResponse(tx);
    }

    // The property that makes "nothing was broadcast" checkable. Any URL this
    // fake does not recognise is a URL the pipeline would have sent to the real
    // internet, and the rehearsal fails rather than quietly reaching it.
    throw new Error(`the fake chain refused an unrecognised URL: ${url}`);
  };

  /**
   * The submit port. Assigns an id the way the core does and records the
   * transaction as already confirmed, because polling latency is not what a
   * rehearsal is for.
   */
  const submit = async ({ plan, senderAddress }) => {
    state.broadcasts += 1;
    const id = state.nextId;
    state.nextId += 1;
    const txid = `0x${String(id).padStart(64, 'f')}`;

    state.inscriptions.set(String(id), {
      id: String(id),
      body: plan.body,
      mime: plan.call.mime,
      tokenUri: plan.call.tokenUri,
      dependencies: (plan.parentIds ?? []).map(String),
      creator: senderAddress ?? null
    });
    state.byHash.set(String(plan.call.finalHashHex).replace(/^0x/, ''), String(id));
    state.nonces.set(senderAddress, (state.nonces.get(senderAddress) ?? 0) + 1);

    state.txs.set(txid, {
      tx_id: txid,
      tx_status: 'success',
      block_height: state.tip,
      fee_rate: String(plan.minerFeeUstx),
      tx_result: {
        // `token-id`, not `id`. Taken from the core's own return at
        // xtrata-v3.2.3.clar:1329 -- a fake that answered with a plausible key
        // would have made `parseMintResult` fail in rehearsal and pass on
        // mainnet, or the reverse, which is the one thing a fake chain must
        // never do.
        hex: cvToHex(responseOkCV(tupleCV({ 'token-id': uintCV(BigInt(id)), existed: falseCV() }))),
        repr: `(ok {token-id: u${id}, existed: false})`
      }
    });

    return { txid };
  };

  return { state, fetchImpl, submit, inject, balanceOf };
}

/**
 * Ports that write no journal to disk.
 *
 * A rehearsal that left a `.pipeline-*.json` behind would be a rehearsal that
 * could be resumed from by a real run, which is exactly the confusion the
 * separate `.dry` suffix exists to prevent. Keeping the journal in memory
 * removes the possibility rather than relying on the suffix.
 */
export function makeMemoryJournal() {
  const files = new Map();
  return {
    files,
    readJournal: (path) => (files.has(path) ? JSON.parse(files.get(path)) : null),
    writeJournal: (path, value) => files.set(path, JSON.stringify(value)),
    /** Drop everything, to simulate a machine that lost its disk. */
    wipe: () => files.clear()
  };
}

/** A clock that advances on its own, so nothing waits in real time. */
export function makeFastClock({ start = 1_700_000_000_000, step = 1_000 } = {}) {
  let now = start;
  return {
    now: () => {
      now += step;
      return now;
    },
    sleep: async () => {
      now += step;
    }
  };
}

/**
 * The wallets a rehearsal runs with.
 *
 * Real c32 addresses, because `standardPrincipalCV` rejects anything else and a
 * placeholder like "SP2REHEARSAL..." throws before the first read. They are
 * derived from the hash of a fixed rehearsal string rather than from any key,
 * so no private key exists that controls them and nothing sent to one could be
 * recovered by anybody, including us.
 *
 * The keys are deliberately absent. The fake submit port never signs, so a
 * rehearsal that somehow reached a real signer fails for want of a key rather
 * than succeeding with one.
 */
export const REHEARSAL_WALLETS = {
  archivist: { address: 'SP38Q5FQVQTT0BZZRF5NTJ49F2ZSJKAQZ5C87YHBF', key: null },
  skeptic: { address: 'SP1V1NYWKZXY3V2SWQ5YBJS27HTGEBFJRY1M6BF31', key: null },
  builder: { address: 'SP1MK6HQQ0734KQ88DCH0VJFSM2H02NPQDKMPR7ZW', key: null }
};
