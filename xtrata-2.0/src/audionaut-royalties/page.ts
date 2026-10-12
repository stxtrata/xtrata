import { createStacksWalletAdapter } from '../lib/wallet/adapter';
import { requestStructuredSignature } from '../lib/wallet/structured-sign';
import { signInCreator, signOutCreator } from '../manage/lib/creator-session';
import type { ReceivingArtist, RoyaltyRow } from '../../functions/lib/audionaut-royalties';

type Ledger = { address: string; admin: boolean; checkedAt: number; blockHeight: number; artists: ReceivingArtist[]; rows: RoyaltyRow[];
  automation?: { checkedAt: number | null; error: string | null; summary?: { incomplete: number }; payers?: string[]; candidates?: { tx_id: string; memo: string; amount: string; note: string }[] } };
const el = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const adapter = createStacksWalletAdapter({ appName: 'Audionauts Artist Royalties', appIcon: '/favicon.svg' });
let ledger: Ledger | null = null, generation = 0;
let busy = false;
let signedIn = false;
const signInNote = 'Use the wallet holding your artist’s first song. Sign a free message to verify your address.';
function waitingForChecks() {
  clearLedger();
  el('sign-in').hidden = signedIn; el('sign-out').hidden = !signedIn; el('retry').hidden = !signedIn;
  el('access-title').textContent = signedIn ? 'Signed in · waiting for verification' : 'Sign in to view royalties';
  el('access-note').textContent = signedIn ? 'Your sign-in is saved. Checks will retry automatically, or you can retry now.' : signInNote;
}
const explorer = (id: string) => `https://explorer.hiro.so/txid/${encodeURIComponent(id)}?chain=mainnet`;
const addressLink = (address: string) => `https://explorer.hiro.so/address/${encodeURIComponent(address)}?chain=mainnet`;
const short = (address: string) => address.slice(0, 7) + '…' + address.slice(-6);
const link = (text: string, href: string) => {
  const a = document.createElement('a'); a.textContent = text; a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a;
};
const note = (text: string) => { const s = document.createElement('small'); s.textContent = text; return s; };
const statusText = { paid: 'Paid', unrecorded: 'No receipt', unverified: 'Could not verify' };
export function filterRows(rows: RoyaltyRow[], options: { scope: string; artist: string; status: string; search: string; address: string }) {
  const needle = options.search.trim().toLowerCase();
  return rows.filter(row => (options.scope !== 'mine' || row.receivingAddress === options.address || row.recipient === options.address) &&
    (!options.artist || row.artist === options.artist) && (!options.status || row.status === options.status) &&
    (!needle || [String(row.edition), String(row.edition).padStart(3, '0'), String(row.tokenId), row.artist, row.title, row.name].some(s => s.toLowerCase().includes(needle))));
}
function renderRows() {
  if (!ledger) return;
  const rows = filterRows(ledger.rows, { scope: el<HTMLSelectElement>('scope').value, artist: el<HTMLSelectElement>('artist').value,
    status: el<HTMLSelectElement>('status').value, search: el<HTMLInputElement>('search').value, address: ledger.address });
  el('rows').replaceChildren(...rows.map(row => {
    const tr = document.createElement('tr'), cells = Array.from({ length: 5 }, () => document.createElement('td'));
    cells[0].append(link(`#${String(row.edition).padStart(3, '0')} · ${row.name}`, `/x/${row.tokenId}`), note(`Xtrata #${row.tokenId}`));
    cells[1].append(link(row.title, `/x/${row.songId}`), note(row.artist));
    if (row.receivingAddress) {
      const a = link(short(row.receivingAddress), addressLink(row.receivingAddress)); a.className = 'wallet-link'; a.title = row.receivingAddress;
      cells[2].append(a);
    } else cells[2].append('Could not resolve holder');
    cells[2].append(note(`Holder of song #${row.firstSongId}`));
    cells[3].textContent = '5 STX';
    const badge = document.createElement('span'); badge.className = 'badge ' + row.status; badge.textContent = statusText[row.status];
    cells[4].append(badge);
    if (row.txId) cells[4].append(note(''), link('View transfer ↗', explorer(row.txId)));
    if (row.status === 'unverified') cells[4].append(note(row.note));
    if (row.status === 'paid' && row.recipient && row.recipient !== row.receivingAddress)
      cells[4].append(note(`Paid to former holder ${short(row.recipient)}`));
    tr.append(...cells); return tr;
  }));
  el('empty').hidden = rows.length !== 0;
}
function clearLedger() {
  ledger = null; el('ledger').hidden = true; el('rows').replaceChildren(); el('wallet-address').textContent = ''; el('wallet-address').hidden = true;
  el('candidates').replaceChildren(); el<HTMLTextAreaElement>('payers').value = '';
}
async function load() {
  if (busy) return;
  busy = true;
  const mine = ++generation;
  el<HTMLButtonElement>('refresh').disabled = true;
  el<HTMLButtonElement>('retry').disabled = true;
  el('message').textContent = 'Checking mints, receiving wallets and payment receipts…';
  try {
    const response = await fetch('/api/audionaut-royalties', { credentials: 'same-origin', cache: 'no-store' });
    const body = await response.json();
    if (mine !== generation) return;
    if (!response.ok) {
      signedIn = response.status === 503 && body.signedIn === true;
      waitingForChecks();
      el('message').textContent = response.status === 401 ? '' : body.error || 'Could not load the ledger.';
      if (response.status === 403) el('sign-out').hidden = false;
      return;
    }
    signedIn = true; el('retry').hidden = true;
    ledger = body as Ledger;
    el('ledger').hidden = false; el('sign-in').hidden = true; el('sign-out').hidden = false;
    el('wallet-address').hidden = false; el('wallet-address').textContent = ledger.address;
    el('access-title').textContent = ledger.admin ? 'Artist ledger · administrator' : 'Artist ledger · signed in';
    el('access-note').textContent = 'View all artists or filter to your royalties.';
    el('minted-count').textContent = String(ledger.rows.length);
    el('paid-total').textContent = `${ledger.rows.filter(r => r.status === 'paid').length * 5} STX`;
    el('unrecorded-total').textContent = `${ledger.rows.filter(r => r.status === 'unrecorded').length * 5} STX`;
    el('unverified-count').textContent = String(ledger.rows.filter(r => r.status === 'unverified').length);
    const artist = el<HTMLSelectElement>('artist'), previous = artist.value;
    artist.replaceChildren(new Option('All artists', ''), ...ledger.artists.map(a => new Option(a.artist, a.artist)));
    if ([...artist.options].some(o => o.value === previous)) artist.value = previous;
    el('updated').textContent = `Mint and holder checks: ${new Date(ledger.checkedAt).toLocaleString('en-GB')} · Confirmed block ${ledger.blockHeight.toLocaleString('en-GB')}`;
    const warnings = ledger.artists.filter(a => a.error);
    el('ownership-warning').hidden = !warnings.length;
    el('ownership-warning').textContent = warnings.map(a => `${a.artist}: ${a.error}`).join(' ');
    el('record-panel').hidden = !ledger.admin;
    el('automation-panel').hidden = !ledger.admin;
    const automatic = ledger.automation;
    el('automation-status').textContent = automatic?.checkedAt
      ? `Automatic receipt check: ${new Date(automatic.checkedAt).toLocaleString('en-GB')}.${automatic.summary?.incomplete ? ' Older payment history is still being scanned.' : ''}${automatic.error ? ' Some checks need another attempt: ' + automatic.error : ''}`
      : 'Automatic receipt checks run every five minutes. Waiting for the first completed check.';
    if (ledger.admin) {
      if (document.activeElement !== el('payers')) el<HTMLTextAreaElement>('payers').value = (automatic?.payers ?? []).join('\n');
      el('candidates').replaceChildren(...(automatic?.candidates ?? []).map(candidate => {
        const p = document.createElement('p');
        p.append(link(short(candidate.tx_id), explorer(candidate.tx_id)), ` · ${Number(candidate.amount) / 1e6} STX · ${candidate.memo || 'No edition memo'}`, note(candidate.note));
        const button = document.createElement('button'); button.textContent = 'Assign editions'; button.className = 'secondary';
        button.onclick = () => { el<HTMLInputElement>('tx-id').value = candidate.tx_id; el<HTMLDetailsElement>('record-panel').open = true; el('editions').focus(); };
        p.append(button); return p;
      }));
    }
    el('message').textContent = ''; renderRows();
  } catch {
    if (mine === generation) { waitingForChecks(); el('message').textContent = 'Could not load the ledger. Check your connection and try again.'; }
  } finally { busy = false; el<HTMLButtonElement>('refresh').disabled = false; el<HTMLButtonElement>('retry').disabled = false; }
}
el('sign-in').onclick = async () => {
  const button = el<HTMLButtonElement>('sign-in'); button.disabled = true;
  try {
    ++generation; clearLedger();
    el('message').textContent = 'Choose your receiving wallet, then approve the sign-in message.';
    await adapter.connect();
    const address = adapter.getSession().address;
    if (!address || !/^(SP|SM)/.test(address)) throw Error('Choose a Stacks mainnet receiving wallet.');
    await signInCreator(address, requestStructuredSignature); signedIn = true; await load();
  } catch (error) { el('message').textContent = error instanceof Error ? error.message : 'Sign-in was cancelled.'; }
  finally { button.disabled = false; }
};
el('sign-out').onclick = async () => {
  ++generation; signedIn = false; waitingForChecks();
  await signOutCreator(); await adapter.disconnect();
  el('sign-in').hidden = false; el('sign-out').hidden = true;
  el('access-title').textContent = 'Sign in to view royalties';
  el('access-note').textContent = 'Use the wallet holding your artist’s first song. Sign a free message to verify your address.';
  el('message').textContent = '';
};
el('refresh').onclick = () => void load();
el('retry').onclick = () => void load();
for (const id of ['scope', 'artist', 'status', 'search']) el(id).addEventListener('input', renderRows);
el('receipt-form').onsubmit = async event => {
  event.preventDefault(); if (!ledger?.admin) return;
  const button = el('receipt-form').querySelector('button')!; button.disabled = true;
  el('receipt-message').textContent = 'Verifying the existing transfer…';
  try {
    const raw = el<HTMLInputElement>('editions').value;
    if (!/^\s*\d+(?:\s*,\s*\d+)*\s*$/.test(raw)) throw Error('Enter edition numbers separated by commas.');
    const response = await fetch('/api/audionaut-royalties', { method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ txId: el<HTMLInputElement>('tx-id').value, editions: raw.split(',').map(Number) }) });
    const body = await response.json();
    if (!response.ok) throw Error(body.error || 'Could not record this receipt.');
    el('receipt-message').textContent = 'Receipt verified and recorded.';
    el<HTMLFormElement>('receipt-form').reset(); await load();
  } catch (error) { el('receipt-message').textContent = error instanceof Error ? error.message : 'Could not record receipt.'; }
  finally { button.disabled = false; }
};
void load();
// Refresh while an approved holder is viewing the page, with no overlapping
// requests and no polling while signed out or when the tab is hidden.
setInterval(() => { if (signedIn && !document.hidden && !busy && (!ledger || (!el<HTMLDetailsElement>('record-panel').open && !el<HTMLDetailsElement>('automation-panel').open))) void load(); }, 60_000);
document.addEventListener('visibilitychange', () => { if (signedIn && !document.hidden && !busy) void load(); });
el('payer-form').onsubmit = async event => {
  event.preventDefault(); if (!ledger?.admin) return;
  const button = el('payer-form').querySelector('button')!; button.disabled = true;
  try {
    const payers = el<HTMLTextAreaElement>('payers').value.split(/[\s,]+/).filter(Boolean);
    const response = await fetch('/api/audionaut-royalties', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'configure', payers }) });
    const body = await response.json(); if (!response.ok) throw Error(body.error || 'Could not save monitored addresses.');
    el('payer-message').textContent = 'Saved. The next automatic check will scan these paying wallets.';
    await load();
  } catch (error) { el('payer-message').textContent = error instanceof Error ? error.message : 'Could not save addresses.'; }
  finally { button.disabled = false; }
};
el('export-csv').onclick = () => {
  if (!ledger) return;
  const quote = (value: unknown) => {
    let text = String(value ?? '');
    // Neutralize spreadsheet formulas in source titles, credits and names.
    if (/^\s*[=+@\-]|^[\t\r\n]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  };
  const headers = ['Audionaut edition', 'Audionaut name', 'Audionaut inscription', 'Song inscription', 'Song title', 'Artist', 'Receiving song', 'Current receiving address', 'Royalty STX', 'Payment status', 'Payment transaction', 'Paid to', 'Verified block'];
  const text = [headers, ...ledger.rows.map(r => [r.edition, r.name, r.tokenId, r.songId, r.title, r.artist, r.firstSongId, r.receivingAddress, 5, statusText[r.status], r.txId, r.recipient, ledger!.blockHeight])]
    .map(row => row.map(quote).join(',')).join('\r\n') + '\r\n';
  const url = URL.createObjectURL(new Blob(['\uFEFF' + text], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = 'Audionauts Song Assignments - live royalties.csv'; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
