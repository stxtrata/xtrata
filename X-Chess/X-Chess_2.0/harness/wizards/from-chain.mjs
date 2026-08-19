// Reading an inscription back, for the scripts that must not trust the repo.
//
// WHY THIS IS SHARED. `inscribe-manifest.mjs` fetches the entry validator from
// chain before it will spend a fee on a sheet, for a reason that applies just
// as much to playing one: a sheet is read by whoever fetches 2994, so that is
// what must accept it, and a repo drifted ahead of the chain would approve — or
// play — something no reader could reproduce. Two copies of that routine is two
// places for the reasoning to rot, so there is one.
//
// It talks to the Xtrata core rather than to a gateway. A gateway is a
// convenience with an operator; the contract is the record.

import { Cl } from '@stacks/transactions';
import { WizardSafetyError } from './wizards-core.mjs';

const XTRATA = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3';
const [XTRATA_ADDRESS, XTRATA_NAME] = XTRATA.split('.');

/** One inscription's bytes, chunk by chunk, exactly as the contract holds them. */
export async function inscribedBytes(id) {
  const read = async (fn, args) => {
    const response = await fetch(
      `https://api.hiro.so/v2/contracts/call-read/${XTRATA_ADDRESS}/${XTRATA_NAME}/${fn}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: XTRATA_ADDRESS, arguments: args })
      }
    );
    const body = await response.json();
    if (!body.okay) {
      throw new WizardSafetyError(`${fn} on ${id} failed: ${JSON.stringify(body).slice(0, 200)}`);
    }
    return Cl.deserialize(String(body.result));
  };

  const counted = await read('get-inscription-chunks', [Cl.serialize(Cl.uint(id))]);
  const chunks = Number(counted?.value?.value ?? counted?.value ?? 1);
  const parts = [];
  for (let index = 0; index < chunks; index++) {
    const piece = await read('get-chunk', [Cl.serialize(Cl.uint(id)), Cl.serialize(Cl.uint(index))]);
    const raw = piece?.value?.value ?? piece?.value;
    parts.push(Buffer.from(String(raw).replace(/^0x/, ''), 'hex'));
  }
  return Buffer.concat(parts);
}

/** One inscription as text. */
export async function inscribedText(id) {
  return (await inscribedBytes(id)).toString('utf8');
}

/** One inscription executed as a module. */
export async function inscribedModule(id) {
  const bytes = await inscribedBytes(id);
  return { module: await import(`data:text/javascript;base64,${bytes.toString('base64')}`), bytes };
}

/**
 * The entry validator, fetched and executed from chain.
 *
 * BOTH HALVES ARE CHECKED. `parseEntry` decides whether a sheet is valid and
 * `entryToPrompt` decides what it says — and a runner that parsed from chain
 * and rendered from the repo would have moved the drift rather than removed it.
 */
export async function inscribedEntryValidator(id) {
  const { module, bytes } = await inscribedModule(id);
  for (const needed of ['parseEntry', 'entryToPrompt']) {
    if (typeof module[needed] !== 'function') {
      throw new WizardSafetyError(
        `inscription ${id} has no ${needed}, so it is not the entry validator.`
      );
    }
  }
  return { module, bytes };
}
