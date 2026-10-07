/* eslint-disable @typescript-eslint/no-explicit-any */
// Entry for the Forever Twins large-token bundle (forever-twins/assets/xtrata-ft-large.js).
// The collection page loads it only when a collection has `largeOnDemand: true` and a token is over 512 KB.
import { createEngine } from './engine.mjs';
import { createChainIo, jobStore } from './chain-io';
import { mountPanel } from './ui';

export interface LargeWizardOptions {
  coll: any;                                           // registry entry (needs .helper)
  reg: any;                                            // registry (needs .core.contract, .core.assetName)
  mismatch?: () => string | null;                      // the page's registry-vs-chain check
  fetchBytes: (tokenId: string, onProgress?: (m: string) => void) => Promise<Uint8Array>;
}

export function createLargeWizard(o: LargeWizardOptions) {
  const io = createChainIo({
    core: o.reg.core.contract, assetName: o.reg.core.assetName, helper: o.coll.helper, mismatch: o.mismatch,
    refetchBytes: async (job: any) => { try { return await o.fetchBytes(String(job.token)); } catch { return null; } }
  });
  // The 5% processing fee goes to the same address Agent One pays: the Xtrata deployer (xtrata.btc).
  const engine = createEngine({ io, store: jobStore, agentFeeAddress: o.coll.largeOnDemandFeeAddress || o.reg.core.contract.split('.')[0] });
  return {
    engine,
    mount(el: HTMLElement, p: { tokenId: string; canonical: any; wallet: () => string | null; onTwinned?: () => void }) {
      mountPanel(el, { engine, coll: o.coll, reg: o.reg, tokenId: String(p.tokenId), canonical: p.canonical, wallet: p.wallet, fetchBytes: o.fetchBytes, onTwinned: p.onTwinned });
    },
    /** Jobs in this browser that are not finished, so a page can offer to reopen them. */
    unfinished() { return engine.list().filter((j: any) => j.helper === o.coll.helper && !['COMPLETE'].includes(j.status) && !(j.status === 'STOPPED' && !j.keepKey)); }
  };
}
(window as any).XtrataFTLarge = { createLargeWizard };
