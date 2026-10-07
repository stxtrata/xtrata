// DOM-free parser for the paid-play contract's print event. Shared by the browser
// readers (chain-activity.js) and the server tally (functions/lib/music-stats.ts)
// so the homepage and the Music Heroes page always count the same events.
export const PAID_PLAYS_CONTRACT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-radio-plays-v1-0';

const unsigned = (repr, name) => {
  const match = new RegExp(`\\(${name} u([0-9]+)\\)`).exec(repr);
  if (!match) return null;
  const value = Number(match[1]);
  return Number.isSafeInteger(value) ? value : null;
};

const principal = (repr, name) => {
  const match = new RegExp(`\\(${name} '([A-Z0-9]+)\\)`).exec(repr);
  return match?.[1] || null;
};

export function parsePaidPlayEvent(event) {
  if (!event || event.event_type !== 'smart_contract_log') return null;
  const log = event.contract_log;
  const repr = log?.value?.repr;
  if (log?.contract_id !== PAID_PLAYS_CONTRACT || log.topic !== 'print' || typeof repr !== 'string' || repr.length > 2000) return null;
  if (!repr.includes('(event "radio-paid-play")')) return null;
  const txid = String(event.tx_id || '').toLowerCase();
  const core = unsigned(repr, 'core');
  const id = unsigned(repr, 'id');
  const amount = unsigned(repr, 'amount');
  const total = unsigned(repr, 'total');
  const payer = principal(repr, 'payer');
  const recipient = principal(repr, 'recipient');
  if (!/^0x[0-9a-f]{64}$/.test(txid) || ![1, 2, 3].includes(core) || id === null || amount !== 50 || total === null || !payer || !recipient) return null;
  const receipt=/\(receipt 0x([a-f0-9]{32})\)/i.exec(repr)?.[1];
  const rawTime = event.block_time ?? event.burn_block_time;
  const timestamp = Number.isSafeInteger(rawTime) && rawTime > 0 ? rawTime * 1000 : null;
  return {txid, core, id, amount, total, payer, recipient, ...(timestamp ? {timestamp} : {}),...(receipt?{receipt}: {})};
}
