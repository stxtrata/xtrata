import { renderBoard, promotionChoices } from '../ui/board.js';
import { Position } from '../chess/engine.js';
import { LiveChain } from '../chain/client.js';
import { deserialize, serializeBool, serializeBuffer, serializePrincipal, serializeUint } from '../chain/clarity.js';
import type { ClarityResponse } from '../chain/clarity.js';
import { connectWallet } from '../wallet/connect.js';
import { waitForProvider } from '../wallet/providers.js';
import type { ProviderEntry } from '../wallet/providers.js';
import { walletCall, contractCallParams } from '../wallet/requests.js';
import { KeyVault } from './vault.js';
import { invitation, openingFrom } from './registry.js';
import type { Invitation } from './registry.js';
import { canonical, digest, exact, insist, integer, FAST_PROTOCOL, sign, verifyArchive, parseArchive, intentFor, playerKey, turn, MAX_ARCHIVE_BYTES } from './protocol.js';
import type { Archive, Opening, Side, Key, State, ActionKind, Intent, Ready, Signed } from './protocol.js';
import type { ServiceInfo, MatchRecord } from './referee.js';

const DEFAULT_SERVICE = 'https://xchess-quick-play.jimdotbtc988102.chatgpt.site';
type Snapshot = Omit<MatchRecord, 'startedMs'> & { elapsedMs: number };
export function serviceUrl(value: string): string {
  const url = new URL(value);
  insist(!url.username && !url.password && !url.search && !url.hash, 'Use a plain service URL');
  insist(url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost','127.0.0.1','[::1]'].includes(url.hostname)), 'The service must use HTTPS');
  return url.href.replace(/\/$/, '');
}
function saved(key: string): string { try { return localStorage.getItem('xchess-fast-' + key) ?? ''; } catch { return ''; } }
function save(key: string, value: string): void { try { localStorage.setItem('xchess-fast-' + key, value); } catch { /* Keys use mandatory IndexedDB; preferences are optional. */ } }
function download(name: string, text: string, type = 'application/json'): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const a = document.createElement('a'); a.href = url; a.download = name; document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
const HTML = `<header style="display:flex;justify-content:space-between;align-items:center"><h2>Quick Play · 2.3.1</h2><button data-f="close" type="button">Close</button></header>
<p>Fast moves, signed as you play. Either player can inscribe the completed game without the other’s approval.</p>
<div class="notice" data-f="status" role="status" aria-live="polite">Choose a service to create or join a game, or open a saved archive.</div>
<details><summary>Connection and clock rules</summary><p>This optional mode trusts the chosen service for timing, move order and availability. It has separate, unranked history. Network delay counts against your clock. A flag loses unless the opponent has only a king; X Chess’s automatic draw rules also apply. Untimed abandonment has no winner.</p><label>Clock service <input data-f="service" type="url" size="48"></label> <button data-f="configure">Connect service</button><p data-f="info" class="mono"></p><p>Keep this browser’s storage: it holds your game keys. They cannot spend wallet funds. Closing the game does not stop a running clock.</p></details>
<div class="layout" style="margin-top:14px"><section><div data-f="clocks" class="mono" aria-label="Clocks" style="font-size:22px;display:flex;justify-content:space-between"></div><div class="board" data-f="board" role="grid" aria-label="Quick Play chessboard"></div><div data-f="promotion" hidden><label>Promote to <select data-f="piece"><option value="q">Queen</option><option value="r">Rook</option><option value="b">Bishop</option><option value="n">Knight</option></select></label> <button data-f="promote">Promote</button><button data-f="cancel-promotion">Cancel</button></div><p data-f="position"></p><button data-f="flip">Flip board</button> <button data-f="resign" disabled>Resign…</button> <button data-f="offer" disabled>Offer draw</button> <button data-f="accept" disabled>Accept draw</button><div data-f="resign-confirm" hidden><p>Resign this game? This signs a final resignation.</p><button data-f="confirm-resign">Resign game</button><button data-f="cancel-resign">Keep playing</button></div></section>
<section><div class="panel"><h2>Start a game</h2><button data-f="wallet">Connect wallet</button><p data-f="address"></p><label>Opponent wallet <input data-f="opponent" autocomplete="off"></label><label>Your colour <select data-f="colour"><option value="white">White</option><option value="black">Black</option></select></label><label>Clock <select data-f="clock"><option value="180000,2000">3 minutes + 2 seconds</option><option value="300000,3000" selected>5 minutes + 3 seconds</option><option value="600000,5000">10 minutes + 5 seconds</option><option value="0,0">Untimed</option></select></label><button data-f="create">Create on chain</button><p>One setup transaction each. No transactions during play.</p></div>
<div class="panel"><h2>Join or resume</h2><label>Game number or setup transaction ID <input data-f="game" autocomplete="off"></label><button data-f="load">Load game</button> <button data-f="join" disabled>Join on chain</button><button data-f="ready" disabled>Ready to play</button><p data-f="match"></p><button data-f="copy-invite" disabled>Copy invitation</button><label>Paste invitation <input data-f="invite"></label><button data-f="open-invite">Open invitation</button></div>
<div class="panel"><h2>Game record</h2><button data-f="export" disabled>Download game record</button> <button data-f="inscribe" disabled>Review & inscribe</button><p data-f="record"></p><label>Open saved game <input data-f="import" type="file" accept=".json,application/json"></label><button data-f="verify-chain" disabled>Verify opening on chain</button><p data-f="verification"></p><label>Replay move <input data-f="replay" type="range" min="0" max="0" value="0" disabled></label><div data-f="moves" class="mono" style="max-height:160px;overflow:auto"></div></div></section></div>
<dialog data-f="review"><h2>Inscribe this game</h2><p data-f="review-text"></p><p>Download the exact signed record, then upload it using Xtrata’s inscription page. The inscription workflow may require several transactions. The opponent does not need to sign.</p><button data-f="download-final">Download inscription JSON</button> <a href="https://xtrata.xyz/" target="_blank" rel="noopener noreferrer">Open Xtrata</a><p>After sealing, download the inscribed JSON and open it here to verify its signatures and content hash.</p><button data-f="review-close">Close review</button></dialog>`;

export class FastApp {
  readonly dialog: HTMLDialogElement;
  private info: ServiceInfo | null = null;
  private url = DEFAULT_SERVICE;
  private address = '';
  private row: Invitation | null = null;
  private opening: Opening | null = null;
  private key: Key | null = null;
  private archive: Archive | null = null;
  private state: State | null = null;
  private snapshot: Snapshot | null = null;
  private game = 0;
  private revision = -1;
  private selected: string | null = null;
  private flipped = false;
  private promotion: string | null = null;
  private busy = false;
  private offline = true;
  private healthy = false;
  private generation = 0;
  private clockBase = 0;
  private clockSeen = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private clockTimer: ReturnType<typeof setInterval>;
  private readonly vault = new KeyVault();
  constructor(doc: Document = document) {
    this.dialog = doc.createElement('dialog');
    this.dialog.id = 'xchess-quick-play'; this.dialog.style.cssText = 'width:min(1080px,98vw);max-height:96vh;overflow:auto;background:var(--bg);color:var(--ink);border:1px solid var(--line);border-radius:10px';
    this.dialog.innerHTML = HTML; doc.body.append(this.dialog);
    this.el<HTMLInputElement>('service').value = saved('service') || DEFAULT_SERVICE;
    this.el<HTMLInputElement>('game').value = saved('game');
    const style = doc.createElement('style'); style.textContent = '#xchess-quick-play label{display:block;margin:8px 0}#xchess-quick-play input:not([type=range]):not([type=file]){max-width:100%}#xchess-quick-play button{margin:3px;min-height:40px}#xchess-quick-play::backdrop{background:#000b}'; doc.head.append(style);
    this.on('close', () => this.dialog.close());
    this.dialog.addEventListener('close', () => { this.generation++; if (this.timer) clearTimeout(this.timer); });
    this.on('configure', () => this.configure()); this.on('wallet', () => this.connect());
    this.on('create', () => this.create()); this.on('load', () => this.load()); this.on('join', () => this.join());
    this.on('ready', () => this.ready()); this.on('flip', () => { this.flipped = !this.flipped; this.render(); });
    this.on('resign', () => { this.el('resign-confirm').hidden = false; this.el('confirm-resign').focus(); });
    this.on('cancel-resign', () => { this.el('resign-confirm').hidden = true; });
    this.on('confirm-resign', async () => { await this.action('resign'); this.el('resign-confirm').hidden = true; });
    this.on('offer', () => this.action('offer-draw')); this.on('accept', () => this.action('accept-draw'));
    this.on('promote', async () => { if (this.promotion) await this.action('move', this.promotion + this.el<HTMLSelectElement>('piece').value); this.promotion = null; this.el('promotion').hidden = true; });
    this.on('cancel-promotion', () => { this.promotion = null; this.el('promotion').hidden = true; this.el('board').focus(); });
    this.on('export', () => this.export()); this.on('inscribe', () => this.review()); this.on('download-final', () => this.export());
    this.on('review-close', () => this.el<HTMLDialogElement>('review').close());
    this.on('verify-chain', () => this.verifyChain());
    this.on('copy-invite', async () => { await navigator.clipboard.writeText(JSON.stringify({ service: this.url, game: this.game })); this.notice('Invitation copied. Send it to your opponent.'); });
    this.on('open-invite', async () => {
      const invite = JSON.parse(this.el<HTMLInputElement>('invite').value); insist(integer(invite.game, 1, Number.MAX_SAFE_INTEGER), 'Invalid invitation');
      this.el<HTMLInputElement>('service').value = serviceUrl(invite.service); this.el<HTMLInputElement>('game').value = String(invite.game);
      await this.configure(); await this.load();
    });
    this.el<HTMLInputElement>('import').addEventListener('change', () => { void this.run(async () => {
      const file = this.el<HTMLInputElement>('import').files?.[0]; if (!file) return;
      insist(file.size <= MAX_ARCHIVE_BYTES, 'Archive is too large'); await this.importArchive(await file.text());
    }); });
    this.el<HTMLInputElement>('replay').addEventListener('input', () => this.render());
    this.clockTimer = setInterval(() => this.renderClocks(), 200);
    this.render();
  }
  private el<T extends HTMLElement = HTMLElement>(name: string): T { return this.dialog.querySelector(`[data-f="${name}"]`)! as T; }
  private on(name: string, action: () => unknown | Promise<unknown>): void { this.el(name).addEventListener('click', () => { void this.run(action); }); }
  private async run(action: () => unknown | Promise<unknown>): Promise<void> {
    if (this.busy) return;
    this.busy = true; this.render();
    try { await action(); } catch (e) { this.notice(e instanceof Error ? e.message : String(e)); }
    finally { this.busy = false; this.render(); }
  }
  private notice(text: string): void { this.el('status').textContent = text; }
  open(): void { this.dialog.showModal(); this.render(); if (!this.info && !this.archive) void this.run(() => this.configure()); if (!this.offline && this.opening) this.poll(this.generation); }
  destroy(): void { this.generation++; if (this.timer) clearTimeout(this.timer); clearInterval(this.clockTimer); this.dialog.remove(); }
  private reader(registry = this.info?.registry, network = this.info?.network): LiveChain {
    insist(registry && network, 'Connect a configured clock service first');
    const [contractAddress, contractName] = registry.split('.');
    return new LiveChain({ contractAddress, contractName, network });
  }
  private async request(path: string, body?: unknown): Promise<unknown> {
    const response = await fetch(this.url + path, { method: body ? 'POST' : 'GET', headers: body ? { 'Content-Type': 'application/json' } : {},
      body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(10000), credentials: 'omit', cache: 'no-store', redirect: 'error' });
    const text = await response.text(); insist(text.length <= MAX_ARCHIVE_BYTES + 20000, 'Service response too large');
    const data = JSON.parse(text); insist(response.ok, data.error || 'Clock service unavailable'); return data;
  }
  async configure(): Promise<void> {
    this.generation++; this.healthy = false; this.opening = null; this.row = null; this.key = null; this.archive = null; this.state = null; this.snapshot = null; this.offline = true; this.revision = -1;
    this.url = serviceUrl(this.el<HTMLInputElement>('service').value);
    this.info = null;
    const info = await this.request('/v1/info') as ServiceInfo;
    insist(info.protocol === FAST_PROTOCOL && ['mainnet','testnet','devnet'].includes(info.network) && /^04[0-9a-f]{128}$/.test(info.referee), 'Unsupported clock service');
    insist(/^S[0-9A-Z]+\.[a-zA-Z][a-zA-Z0-9_-]{0,39}$/.test(info.registry), 'The clock service is online, but its registry deployment is not configured yet.');
    insist(integer(info.confirmations, 1, 1440), 'Invalid confirmation policy');
    this.info = info; save('service', this.url);
    this.el('info').textContent = `${info.network} · ${info.registry} · referee ${info.referee.slice(0,18)}…`;
    this.notice('Service connected. Connect your wallet to create or join, or load a game to watch.');
  }
  async connect(): Promise<void> { await waitForProvider(); this.address = (await connectWallet()).address; this.el('address').textContent = this.address; await this.findKey(); }
  private async send(functionName: string, functionArgs: string[]): Promise<string> {
    insist(this.info && this.address, 'Connect your wallet and clock service first');
    await waitForProvider();
    const session = await connectWallet(); insist(session.address === this.address, 'Wallet changed; reconnect before continuing');
    const { result } = await walletCall('stx_callContract', (provider: ProviderEntry) => contractCallParams(provider, {
      contract: this.info!.registry, functionName, functionArgs, network: this.info!.network, postConditionMode: 'deny', postConditions: [] }));
    const r = result as { txid?: string; txId?: string; result?: { txid?: string; txId?: string } };
    const txid = r.txid ?? r.txId ?? r.result?.txid ?? r.result?.txId;
    insist(typeof txid === 'string' && /^(0x)?[a-fA-F0-9]{64}$/.test(txid), 'Wallet did not return a transaction ID; check your wallet before retrying.');
    save('game', txid); this.el<HTMLInputElement>('game').value = txid; return txid;
  }
  async create(): Promise<void> {
    insist(this.info && this.address, 'Connect the service and your wallet first');
    const opponent = this.el<HTMLInputElement>('opponent').value.trim().toUpperCase();
    insist(opponent !== this.address, 'Choose a different opponent'); const principal = serializePrincipal(opponent);
    insist(await this.reader().callReadOnly('get-format') === 1n, 'Fast-game registry is not deployed or has the wrong format');
    const [base, increment] = this.el<HTMLSelectElement>('clock').value.split(',').map(Number);
    const key = await this.vault.create();
    const txid = await this.send('create-game', [principal, serializeBool(this.el<HTMLSelectElement>('colour').value === 'white'), serializeBuffer(key.public), serializeBuffer(this.info.referee), serializeUint(base), serializeUint(increment)]);
    this.notice(`Creation submitted: ${txid}. Once confirmed, click Load game to resolve the game number and copy its invitation.`);
  }
  async load(): Promise<void> {
    if (!this.info) await this.configure();
    const generation = ++this.generation;
    this.healthy = false; this.offline = false; this.archive = null; this.state = null; this.snapshot = null; this.key = null; this.opening = null; this.row = null; this.game = 0; this.revision = -1; this.selected = null;
    const text = this.el<HTMLInputElement>('game').value.trim(); const reader = this.reader(); let id = Number(text);
    if (/^(0x)?[a-fA-F0-9]{64}$/.test(text)) {
      const response = await reader.reader.request('/extended/v1/tx/' + (text.startsWith('0x') ? text : '0x' + text));
      insist(response.ok, 'Transaction is not available yet');
      const tx = await response.json() as { tx_status: string; tx_result?: {hex?: string}; contract_call?: {contract_id?: string; function_name?: string} };
      insist(tx.tx_status === 'success', `Setup transaction: ${tx.tx_status}. Wait for confirmation or inspect it in your wallet.`);
      insist(tx.contract_call?.contract_id === this.info!.registry && ['create-game','join-game'].includes(tx.contract_call.function_name ?? ''), 'This is not a setup transaction for this registry');
      const result = deserialize(tx.tx_result?.hex ?? '') as ClarityResponse; insist(result.ok && typeof result.value === 'bigint', 'Invalid setup transaction result'); id = Number(result.value);
    }
    insist(integer(id, 1, Number.MAX_SAFE_INTEGER), 'Enter a game number or setup transaction ID');
    const row = invitation(id, await reader.callReadOnly('get-game', [serializeUint(id)]));
    if (generation !== this.generation) return;
    insist(row.referee === this.info!.referee, 'This game uses another referee service');
    this.game = id; this.row = row; this.el<HTMLInputElement>('game').value = String(id); save('game', String(id));
    this.el('match').textContent = `Game ${id} · ${row.creator} vs ${row.opponent} · ${row.baseMs ? `${row.baseMs / 60000} minutes + ${row.incrementMs / 1000} seconds` : 'untimed'}`;
    if (!row.opponentKey) { this.notice('Invitation found. The named opponent must join on chain before either clock starts.'); return; }
    this.opening = openingFrom(this.info!, row); await this.findKey();
    await this.refresh(generation); this.poll(generation);
  }
  async join(): Promise<void> {
    insist(this.row && this.info && this.address === this.row.opponent && !this.row.opponentKey, 'Only the invited opponent can join');
    const key = await this.vault.create();
    const txid = await this.send('join-game', [serializeUint(this.game), serializeBuffer(key.public)]);
    this.notice(`Join submitted: ${txid}. Load it after confirmation, then both players click Ready.`);
  }
  private side(): Side | null { return this.opening && this.address === this.opening.white ? 'white' : this.opening && this.address === this.opening.black ? 'black' : null; }
  private async findKey(): Promise<void> {
    this.key = null; const side = this.side(); if (!side || !this.opening) return;
    this.key = await this.vault.get(playerKey(this.opening, side)); this.flipped = side === 'black';
    if (!this.key) this.notice('This browser does not hold your registered game key. Resume in the browser used to create or join.');
  }
  private async take(snapshot: Snapshot, generation: number): Promise<void> {
    if (generation !== this.generation || !this.opening) return;
    exact(snapshot.opening, this.opening, 'Service game differs from the on-chain opening');
    insist(integer(snapshot.revision, 0, Number.MAX_SAFE_INTEGER), 'Invalid service revision');
    if (snapshot.revision < this.revision) return;
    if (snapshot.archive) {
      // Never accept a rollback or a different signed branch as a normal update.
      if (this.archive) {
        insist(snapshot.archive.events.length >= this.archive.events.length, 'Service history rolled back');
        for (let i = 0; i < this.archive.events.length; i++) exact(snapshot.archive.events[i], this.archive.events[i], 'Conflicting signed history; preserve your archive');
        if (this.archive.end) exact(snapshot.archive.end, this.archive.end, 'Conflicting final result');
      }
      const state = this.revision === snapshot.revision && this.state ? this.state : await verifyArchive(snapshot.archive, this.opening);
      if (generation !== this.generation) return;
      this.archive = snapshot.archive; this.state = state;
    }
    this.snapshot = snapshot; this.revision = snapshot.revision; this.healthy = true;
    this.clockBase = snapshot.elapsedMs; this.clockSeen = performance.now();
    const slider = this.el<HTMLInputElement>('replay'); slider.max = String(this.archive?.events.filter(e => e.intent.payload.kind === 'move').length ?? 0); slider.value = slider.max;
    if (this.archive?.end) this.notice(`${this.archive.end.payload.result} · ${this.archive.end.payload.reason}. Either player can record this game.`);
    else this.notice(this.archive ? `${turn(this.state!) === 'white' ? 'White' : 'Black'} to move. Moves are signed automatically.` : 'Waiting for both players to click Ready. The clock has not started.');
    this.render();
  }
  private async refresh(generation: number): Promise<void> { await this.take(await this.request('/v1/games/' + this.game) as Snapshot, generation); }
  private poll(generation: number): void {
    if (this.timer) clearTimeout(this.timer);
    if (!this.dialog.open || this.offline || !this.opening || generation !== this.generation || this.archive?.end) return;
    this.timer = setTimeout(async () => {
      if (generation !== this.generation) return;
      if (this.busy) { this.poll(generation); return; }
      try { await this.refresh(generation); }
      catch (e) { if (generation === this.generation) { this.healthy = false; this.notice(`Disconnected: ${e instanceof Error ? e.message : e}. Reconnecting; the official clock continues.`); this.render(); } }
      this.poll(generation);
    }, this.healthy ? 700 : 3000);
  }
  async ready(): Promise<void> {
    insist(this.opening && this.key && this.side(), 'Your registered game key is required');
    const input = await sign<Ready>({ type: 'ready', match: digest(this.opening), side: this.side()! }, this.key.secret);
    await this.take(await this.request('/v1/games/' + this.game, input) as Snapshot, this.generation); this.poll(this.generation);
  }
  async action(kind: ActionKind, move = ''): Promise<void> {
    insist(this.state && this.key && this.side() && this.healthy && !this.offline && !this.archive?.end, 'Reconnect to your live game before moving');
    const generation = this.generation;
    const input: Signed<Intent> = await sign(intentFor(this.state, this.side()!, kind, move), this.key.secret);
    try { await this.take(await this.request('/v1/games/' + this.game, input) as Snapshot, generation); this.selected = null; }
    catch (e) { this.healthy = false; throw e; }
    finally { this.poll(generation); }
  }
  private square(square: string): void {
    void this.run(async () => {
      insist(this.state && this.key && this.side() === turn(this.state), 'It is not your turn');
      const legal = this.state.position.movesUci();
      if (this.selected) {
        const prefix = this.selected + square;
        if (promotionChoices(legal, this.selected, square).length) { this.promotion = prefix; this.el('promotion').hidden = false; this.el('piece').focus(); return; }
        if (legal.includes(prefix)) { await this.action('move', prefix); return; }
      }
      this.selected = legal.some(m => m.startsWith(square)) ? square : null;
    });
  }
  async importArchive(text: string): Promise<void> {
    const archive = parseArchive(text); const state = await verifyArchive(archive);
    this.generation++; this.offline = true; this.healthy = false; this.opening = archive.opening; this.archive = archive; this.state = state; this.snapshot = null; this.key = null; this.row = null; this.selected = null;
    const slider = this.el<HTMLInputElement>('replay'); slider.max = String(archive.events.filter(e => e.intent.payload.kind === 'move').length); slider.value = slider.max;
    this.el('verification').textContent = 'Signatures and legal replay verified. Wallet identities are not yet checked against the chain.';
    this.notice(archive.end ? `${archive.end.payload.result} · ${archive.end.payload.reason}` : 'Verified unfinished game record'); this.render();
  }
  async verifyChain(): Promise<void> {
    insist(this.archive, 'Open a game record first');
    const o = this.archive.opening, reader = this.reader(o.registry, o.network);
    const current = openingFrom(o, invitation(o.game, await reader.callReadOnly('get-game', [serializeUint(o.game)])));
    await verifyArchive(this.archive, current);
    this.el('verification').textContent = 'Wallet identities and game keys match the on-chain opening. Signatures and legal replay verified.';
  }
  export(): void {
    insist(this.archive, 'No game record yet');
    download(`xchess-fast-${this.archive.opening.game}-${digest(this.archive).slice(0,12)}.json`, canonical(this.archive) + '\n');
  }
  review(): void {
    insist(this.archive?.end, 'The game has not ended');
    const text = canonical(this.archive) + '\n';
    this.el('review-text').textContent = `Game ${this.archive.opening.game}: ${this.archive.end.payload.result} (${this.archive.end.payload.reason}). ${new TextEncoder().encode(text).length.toLocaleString()} bytes. History hash: ${this.archive.end.payload.root}.`;
    this.el<HTMLDialogElement>('review').showModal();
  }
  private renderClocks(): void {
    if (!this.dialog.open) return;
    if (!this.state || !this.opening?.baseMs) { this.el('clocks').textContent = this.opening?.baseMs === 0 ? 'Untimed' : 'Clocks start when both players are ready'; return; }
    const state = this.state;
    const elapsed = this.offline || this.archive?.end ? 0 : Math.max(0, this.clockBase + (performance.now() - this.clockSeen) - state.at);
    const fmt = (side: Side) => { const ms = Math.max(0, state[side === 'white' ? 'whiteMs' : 'blackMs'] - (turn(state) === side ? elapsed : 0)); const sec = Math.ceil(ms / 1000); return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2,'0')}`; };
    this.el('clocks').textContent = `White ${fmt('white')}  ·  Black ${fmt('black')}${!this.healthy && !this.offline && !this.archive?.end ? ' · reconnecting' : ''}`;
  }
  private render(): void {
    const end = this.archive?.end;
    const active = !!this.state && !!this.key && !!this.side() && this.healthy && !this.offline && !end;
    const canMove = active && this.side() === turn(this.state!) && !this.busy;
    let position = this.state?.position ?? new Position();
    const moves = this.archive?.events.filter(e => e.intent.payload.kind === 'move').map(e => e.intent.payload.move) ?? [];
    const replayIndex = Number(this.el<HTMLInputElement>('replay').value);
    if ((this.offline || end) && replayIndex < moves.length) { position = new Position(); for (const m of moves.slice(0,replayIndex)) position.applyUci(m); }
    renderBoard(this.el('board'), { position, legalMoves: canMove ? position.movesUci() : [], flipped: this.flipped, selected: this.selected, lastMove: null, readOnly: !canMove }, { onSquare: sq => this.square(sq) });
    this.el('position').textContent = position.pgnMoveText() || 'Starting position';
    this.el('moves').textContent = moves.join(' ');
    const disable = (name: string, value: boolean) => { this.el<HTMLButtonElement>(name).disabled = value; };
    for (const name of ['configure','wallet','create','load','open-invite']) disable(name, this.busy);
    disable('join', this.busy || !this.row || !!this.row.opponentKey || this.address !== this.row.opponent);
    disable('ready', this.busy || !this.opening || !this.key || !!this.archive || !!this.snapshot?.ready[this.side()!]);
    disable('resign', this.busy || !active); disable('offer', !canMove || !!this.state?.offer); disable('accept', this.busy || !active || !this.state?.offer || this.state.offer === this.side());
    disable('copy-invite', !this.game || !this.info); disable('export', !this.archive); disable('inscribe', !end); disable('verify-chain', !this.archive || this.busy);
    this.el<HTMLInputElement>('replay').disabled = !(this.offline || end) || !moves.length;
    this.el('record').textContent = end ? `Final history hash: ${end.payload.root}` : this.archive ? 'A recovery record is available while you play.' : '';
    this.renderClocks();
  }
}
export function mountQuickPlay(doc = document): FastApp {
  const global = globalThis as unknown as { __xchessFast?: FastApp };
  if (global.__xchessFast?.dialog.ownerDocument === doc && global.__xchessFast.dialog.isConnected) return global.__xchessFast;
  const app = new FastApp(doc); global.__xchessFast = app;
  const button = doc.createElement('button'); button.className = 'tab'; button.textContent = 'Quick Play'; button.id = 'quick-play-open';
  button.addEventListener('click', () => app.open()); (doc.querySelector('.tabs') ?? doc.body).append(button);
  return app;
}
