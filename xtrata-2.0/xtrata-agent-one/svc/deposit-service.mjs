#!/usr/bin/env node
/**
 * Xtrata Agent One — deposit-wallet inscription service (CLI).
 * Thin shell over core.mjs. Lifecycle (one job, resumable from JOB_DIR/<job>.json):
 *   SVC_STEP=create  -> quote, generate one-shot deposit wallet, show deposit address
 *   SVC_STEP=status  -> show job state + deposit balance vs required
 *   SVC_STEP=run     -> (once funded) inscribe from the deposit wallet via the runway
 *   SVC_STEP=deliver -> transfer inscription to user, refund remaining, WIPE the key
 *
 * Env: XTRATA_CORE(=xtrata-v3-2-3) XTRATA_NETWORK(=mainnet) XTRATA_MOCK(=0)
 *      SVC_FILE SVC_URI SVC_MIME SVC_USER_ADDR SVC_DEPS SVC_MARGIN_USTX(=0)
 *      JOB JOB_DIR(=./job-state) ENGINE(=../../agent-large-inscribe.mjs)
 *      HIRO_API_KEY DRY_RUN(=1) CONFIRM(=1)
 */
import readline from 'node:readline';
import { createJob, statusJob, runJob, deliverJob, readJob } from './core.mjs';

const STEP = process.env.SVC_STEP || 'status';
const JOB_DIR = process.env.JOB_DIR || './job-state';
const ENGINE = process.env.ENGINE || '../../agent-large-inscribe.mjs';
const HIRO_KEY = process.env.HIRO_API_KEY || '';
const DRY_RUN = process.env.DRY_RUN !== '0';
const CONFIRM = process.env.CONFIRM !== '0';
const MOCK = process.env.XTRATA_MOCK === '1';
const log = (r) => console.log(JSON.stringify({ ts: new Date().toISOString(), ...r }));
const ask = async (q) => { if (!CONFIRM) return true; const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); const a = await new Promise((r) => rl.question(q, (x) => { rl.close(); r(x); })); return a.trim().toLowerCase() === 'yes'; };

async function main() {
  if (STEP === 'create') {
    const deps = (process.env.SVC_DEPS || '').split(',').map((s) => s.trim()).filter(Boolean);
    const job = await createJob({
      coreName: process.env.XTRATA_CORE || 'xtrata-v3-2-3', net: (process.env.XTRATA_NETWORK || 'mainnet').toLowerCase(),
      file: process.env.SVC_FILE, uri: process.env.SVC_URI, mime: process.env.SVC_MIME || 'application/octet-stream',
      deps, user: process.env.SVC_USER_ADDR, marginUstx: process.env.SVC_MARGIN_USTX || '0', jobDir: JOB_DIR, mock: MOCK,
    });
    const req = job.requiredUstx;
    log({ event: 'job-created', jobId: job.jobId, depositAddress: job.depositAddress, requiredUstx: req,
      instruction: `Send EXACTLY ${req} uSTX (= ${(Number(req) / 1e6).toFixed(3)} STX) to ${job.depositAddress}. One-shot address — fund once, for this job only.` });
    return;
  }

  const id = process.env.JOB; if (!id) { console.error('Set JOB=<jobId>'); process.exit(2); }
  const job = readJob(JOB_DIR, id);

  if (STEP === 'status') { log({ event: 'status', ...(await statusJob({ job, hiroKey: HIRO_KEY })) }); return; }

  if (STEP === 'run') {
    if (DRY_RUN) { log({ event: 'dry-run', step: 'run', note: 'set DRY_RUN=0 to inscribe from the deposit wallet' }); return; }
    if (!(await ask(`Inscribe job ${id} from deposit wallet now? (yes/no) `))) return;
    const r = await runJob({ job, enginePath: ENGINE, hiroKey: HIRO_KEY, jobDir: JOB_DIR });
    log({ event: 'inscribed', jobId: id, ...r });
    return;
  }

  if (STEP === 'deliver') {
    if (DRY_RUN) { log({ event: 'dry-run', step: 'deliver', tokenId: job.tokenId || null, to: job.user }); return; }
    if (!(await ask(`Deliver token #${job.tokenId} to ${job.user}, refund the rest, and WIPE the key? (yes/no) `))) return;
    const r = await deliverJob({ job, hiroKey: HIRO_KEY, jobDir: JOB_DIR });
    log({ event: 'complete', jobId: id, keyWiped: true, ...r, note: 'Address retired. Inscribe an XIP-011 type:receipt to make the receipt permanent.' });
    return;
  }

  console.error(`Unknown SVC_STEP "${STEP}" (create|status|run|deliver)`); process.exit(2);
}
main().catch((e) => { log({ event: 'crash', step: STEP, error: String(e) }); process.exit(1); });
