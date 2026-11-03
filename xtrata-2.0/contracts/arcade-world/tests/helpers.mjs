import { initSimnet } from '@stacks/clarinet-sdk';
import { Cl } from '@stacks/transactions';

export const pp = (cv) => Cl.prettyPrint(cv);
export const okU = (n) => `(ok u${n})`;
export const errU = (n) => `(err u${n})`;

// boot({ costs: true }) records execution costs on every call (r.costs.total / r.costs.limit).
export async function boot(opts = {}) {
  const simnet = await initSimnet('./Clarinet.toml', false, { trackCosts: !!opts.costs });
  const A = simnet.getAccounts();
  const deployer = A.get('deployer');
  const W = [1, 2, 3, 4, 5, 6].map((i) => A.get(`wallet_${i}`));
  return { simnet, deployer, W };
}

export const hash32 = (seed) => {
  const b = new Uint8Array(32);
  for (let i = 0; i < 32; i++) b[i] = (seed * 17 + i * 5) & 255;
  return b;
};

// Accessors for a contract on a simnet.
export function contract(simnet, name, deployer) {
  return {
    call: (fn, args, sender) => simnet.callPublicFn(name, fn, args, sender),
    ro: (fn, args = []) => simnet.callReadOnlyFn(name, fn, args, deployer).result,
  };
}

// Put an inscription into the mock core.
export function mockInscription(simnet, deployer, id, { hash, size, creator, sealed = true }) {
  return simnet.callPublicFn('mock-xtrata-core', 'put',
    [Cl.uint(id), Cl.buffer(hash), Cl.uint(size), Cl.principal(creator), Cl.bool(sealed)], deployer);
}

export const btcDay = (simnet) => Math.floor(simnet.burnBlockHeight / 144);
