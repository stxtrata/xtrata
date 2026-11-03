// The publisher bot: sends a poster file's posters to the poster contract in safe, small steps.
//   - dry run unless told to execute
//   - stops at once on the kill switch, a paused contract, a lost whitelist, or any cap error from the contract
//   - never sends a poster twice (its journal AND the chain are checked first)
//   - one batch per run unless asked for more; waits out the contract's minimum gap between writes
// It does not hold keys. It is handed a transport that can send (simnet, or a network transport with a signer attached after
// lib/guard.mjs said yes).
import { Cl } from '@stacks/transactions';
import { posterCv } from './clar.mjs';
import { posterBatches, posterKey, chainPosterKey, todayOf, PLIMITS } from './posters.mjs';
import { readPosterConfig, readAllPosters } from './readback.mjs';
import { explain, POSTER_STOP } from './errors.mjs';
import { killed } from './guard.mjs';

export const newJournal = () => ({ sent: {}, perDay: {}, lastSendHeight: null, runs: 0 });

export async function botContext(t, sender) {
  const cfg = await readPosterConfig(t);
  const height = await t.height();
  const admin = sender != null && cfg.admin === sender;
  const publisher = !admin && sender != null ? !!(await t.ro('posters', 'is-publisher', [Cl.principal(sender)])) : false;
  const all = await readAllPosters(t);
  const today = todayOf(height);
  const mine = all.filter((p) => p.owner === sender);
  const alive = (p) => !p.hidden && (p.evergreen || p.endDay > today);
  return { cfg, height, today, admin, publisher, all, mine, liveOwned: mine.filter(alive).length, chainKeys: new Set(mine.map(chainPosterKey)) };
}

// opts: { posters (compiled), sender, execute, journal, log, maxBatches, waitForGap, kill }
export async function runBot(t, opts) {
  const { posters, sender, execute = false, journal = newJournal(), log = () => {}, maxBatches = 1, waitForGap = false, kill = () => killed() } = opts;
  const res = { status: 'ok', reason: '', sent: 0, batches: 0, pending: 0, skipped: [], journal };
  const stop = (reason, status = 'stopped') => { res.status = status; res.reason = reason; log(`${status}: ${reason}`); return res; };

  if (kill()) return stop('kill switch is on');
  let c = await botContext(t, sender);
  if (c.cfg.paused) return stop('the poster contract is paused');
  if (!c.admin && !c.publisher) return stop(`${sender || '(no sender)'} is not the admin or a whitelisted publisher`);
  journal.runs++;

  let pending = [];
  for (const p of posters) {
    const k = posterKey(p);
    if (journal.sent[k] || c.chainKeys.has(k)) { res.skipped.push({ key: k, why: 'already sent' }); continue; }
    if (p.startDay <= c.today) { res.skipped.push({ key: k, why: `start day ${p.startDay} is not after today (${c.today})` }); log(`skipped "${p.head}": its start day has passed`); continue; }
    if (!c.admin && p.set !== 1) return stop(`"${p.head}" is a core poster; only the admin can add those`);
    pending.push(p);
  }
  res.pending = pending.length;
  if (!pending.length) return stop('nothing to send', 'nothing-to-do');

  let usedToday = journal.perDay[c.today] || 0, liveOwned = c.liveOwned, lastSend = journal.lastSendHeight, height = c.height, today = c.today;
  for (let b = 0; b < maxBatches && pending.length; b++) {
    if (kill()) return stop('kill switch is on');
    if (!c.admin) {
      if (usedToday >= c.cfg.capPerDay) return stop(`today's cap of ${c.cfg.capPerDay} posters is used`, 'capped');
      if (!c.cfg.reviewLane && liveOwned >= c.cfg.capLivePerPublisher) return stop(`live cap of ${c.cfg.capLivePerPublisher} reached`, 'capped');
      if (lastSend != null && height < lastSend + c.cfg.minGap) {
        if (waitForGap && t.mine) { height = t.mine(lastSend + c.cfg.minGap - height); }
        else return stop(`waiting: the contract needs ${c.cfg.minGap} burn block(s) between writes (last write at ${lastSend}, now ${height})`, 'waiting');
      }
    }
    const room = c.admin ? PLIMITS.batch : Math.min(PLIMITS.batch, c.cfg.capPerDay - usedToday, c.cfg.reviewLane ? PLIMITS.batch : c.cfg.capLivePerPublisher - liveOwned);
    const batch = pending.slice(0, room);
    const args = batch.length === 1 ? [posterCv(batch[0])] : [Cl.list(batch.map(posterCv))];
    const fn = batch.length === 1 ? 'add-poster' : 'add-posters';
    if (!execute) {
      log(`dry run: ${fn} with ${batch.length} poster(s): ${batch.map((p) => '"' + p.head + '"').join(', ')}`);
      pending = pending.slice(batch.length); usedToday += batch.length; if (!c.cfg.reviewLane) liveOwned += batch.length; res.batches++;
      continue;
    }
    const r = await t.send('posters', fn, args, sender);
    if (!r.ok) {
      const code = Number(r.value);
      return stop(`the contract refused the batch: ${explain('posters', code)}`, POSTER_STOP.has(code) ? 'stopped' : 'error');
    }
    height = await t.height(); today = todayOf(height);
    for (const p of batch) journal.sent[posterKey(p)] = { day: today, height, head: p.head };
    journal.perDay[today] = (journal.perDay[today] || 0) + batch.length; usedToday = journal.perDay[today];
    journal.lastSendHeight = lastSend = height;
    if (!c.cfg.reviewLane) liveOwned += batch.length;
    pending = pending.slice(batch.length); res.sent += batch.length; res.batches++;
    log(`sent ${batch.length} poster(s)${r.txid ? ' ' + r.txid : ''}`);
  }
  res.pending = pending.length;
  if (pending.length) { res.status = 'more-to-do'; res.reason = `${pending.length} poster(s) left for the next run`; }
  return res;
}
