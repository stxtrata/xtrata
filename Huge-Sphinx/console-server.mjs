/**
 * Local server for the Huge Sphinx console.
 *  - serves the dashboard
 *  - proxies /api/*  →  https://aibtc.com/api/*   (no browser CORS issue)
 *  - /local/*  signs & sends on your behalf using Huge Sphinx's key
 *
 * The key NEVER goes into the browser. It is loaded once here, from an env var,
 * when you start the server. Start it like this:
 *
 *   # read + free replies only (safe, no spending):
 *   WALLET_MNEMONIC="<Huge Sphinx 24 words — lowercase 'olympic'>" node console-server.mjs
 *
 *   # also allow PAID new sends (100 sats sBTC each) from the UI:
 *   ALLOW_PAID_SEND=1 WALLET_MNEMONIC="<Huge Sphinx words>" node console-server.mjs
 *
 * Paid sending needs the x402-stacks library: npm install x402-stacks
 *
 * Open: http://localhost:8777/huge-sphinx-console.html
 * Requires Node 18+.
 */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { deriveKeys, signBip322 } from './scripts/aibtc-lib.mjs';

const PORT = process.env.PORT || 8777;
const ROOT = process.cwd();
const UPSTREAM = 'https://aibtc.com';
const HS_STX = 'SP13G0F3E48HDK7MMRYXDHQ4RTACKDN5FSV9VEPRC';
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.json':'application/json', '.css':'text/css' };

// ---- load Huge Sphinx wallet once, from env ----
let keys = null, walletErr = null;
const MN = process.env.WALLET_MNEMONIC;
if (MN) {
  try {
    keys = deriveKeys(MN);
    if (keys.stxAddress !== HS_STX) { walletErr = 'Seed does not derive Huge Sphinx (use the lowercase "olympic" words).'; keys = null; }
  } catch (e) { walletErr = e.message; }
}
const PAID = process.env.ALLOW_PAID_SEND === '1';

function send(res, status, obj){ res.writeHead(status, {'content-type':'application/json'}); res.end(JSON.stringify(obj)); }
function body(req){ return new Promise(r=>{ let b=''; req.on('data',c=>b+=c); req.on('end',()=>{ try{ r(b?JSON.parse(b):{}); }catch{ r({}); } }); }); }

async function handleLocal(req, res, path){
  if (path === '/local/status') {
    let x402 = false;
    if (PAID) { try { await import('x402-stacks'); x402 = true; } catch {} }
    return send(res, 200, {
      walletLoaded: !!keys, walletError: walletErr,
      stxAddress: keys?.stxAddress, btcAddress: keys?.btcAddress,
      paidEnabled: PAID, x402Available: x402,
    });
  }
  if (!keys) return send(res, 503, { ok:false, error: walletErr || 'Wallet not loaded. Restart the server with WALLET_MNEMONIC set.' });

  // ---- FREE reply ----
  if (path === '/local/reply' && req.method === 'POST') {
    const { messageId, reply, markRead } = await body(req);
    if (!messageId || !reply) return send(res, 400, { ok:false, error:'messageId and reply required' });
    if (reply.length > 500) return send(res, 400, { ok:false, error:'reply exceeds 500 chars' });
    try {
      if (markRead) {
        const rs = signBip322(`Inbox Read | ${messageId}`, keys.btcPrivKey, keys.btcScript);
        await fetch(`${UPSTREAM}/api/inbox/${keys.btcAddress}/${messageId}`, { method:'PATCH', headers:{'content-type':'application/json'}, body: JSON.stringify({ signature: rs }) });
      }
      const sig = signBip322(`Inbox Reply | ${messageId} | ${reply}`, keys.btcPrivKey, keys.btcScript);
      const r = await fetch(`${UPSTREAM}/api/outbox/${keys.btcAddress}`, { method:'POST', headers:{'content-type':'application/json'}, body: JSON.stringify({ messageId, reply, signature: sig }) });
      const data = await r.json().catch(()=>({}));
      return send(res, 200, { ok: r.ok, status: r.status, data });
    } catch (e) { return send(res, 500, { ok:false, error: e.message }); }
  }

  // ---- PAID new message (100 sats sBTC, x402) ----
  if (path === '/local/send' && req.method === 'POST') {
    if (!PAID) return send(res, 403, { ok:false, error:'Paid sending is disabled. Restart the server with ALLOW_PAID_SEND=1 to enable it.' });
    const { to, content } = await body(req);
    if (!to || !content) return send(res, 400, { ok:false, error:'to and content required' });
    let x402;
    try { x402 = await import('x402-stacks'); }
    catch { return send(res, 501, { ok:false, error:'x402-stacks not installed. Run: npm install x402-stacks' }); }
    try {
      // resolve recipient's BTC + STX addresses
      let toStx = to, toBtc = null;
      try {
        const ag = await fetch(`${UPSTREAM}/api/agents/${to}`).then(r=>r.json());
        const a = ag.agent || ag;
        toStx = a.stxAddress || to; toBtc = a.btcAddress || null;
      } catch {}
      const account = x402.privateKeyToAccount(keys.stxPrivHex, 'mainnet');
      const api = x402.createPaymentClient(account, { baseURL: UPSTREAM });
      const resp = await api.post(`/api/inbox/${toBtc || toStx}`, { toBtcAddress: toBtc, toStxAddress: toStx, content });
      const d = resp.data || {};
      return send(res, 200, { ok:true, messageId: d.messageId || d.id, status: resp.status, data: d });
    } catch (e) {
      const detail = e?.response?.data?.error || e?.response?.data || e.message;
      return send(res, 502, { ok:false, error: typeof detail==='string'?detail:JSON.stringify(detail) });
    }
  }
  return send(res, 404, { ok:false, error:'unknown local route' });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://localhost:${PORT}`);
    if (url.pathname.startsWith('/local/')) return handleLocal(req, res, url.pathname);

    if (url.pathname.startsWith('/api/')) {
      const init = { method: req.method, headers: { accept:'application/json' } };
      if (!['GET','HEAD'].includes(req.method)) { init.headers['content-type']='application/json'; init.body = await new Promise(r=>{let b='';req.on('data',c=>b+=c);req.on('end',()=>r(b));}); }
      const r = await fetch(UPSTREAM + url.pathname + url.search, init);
      const text = await r.text();
      res.writeHead(r.status, { 'content-type': r.headers.get('content-type') || 'application/json' });
      return res.end(text);
    }

    let p = url.pathname === '/' ? '/huge-sphinx-console.html' : url.pathname;
    const fp = normalize(join(ROOT, p));
    if (!fp.startsWith(ROOT)) { res.writeHead(403); return res.end('forbidden'); }
    const data = await readFile(fp);
    res.writeHead(200, { 'content-type': TYPES[extname(fp)] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    res.writeHead(e.code === 'ENOENT' ? 404 : 500); res.end(String(e.message||e));
  }
});

server.listen(PORT, () => {
  console.log(`\n  Huge Sphinx console → http://localhost:${PORT}/huge-sphinx-console.html`);
  console.log(`  API proxy: /api/* → ${UPSTREAM}`);
  if (keys) console.log(`  Wallet: LOADED (${keys.stxAddress}) — replies ${'enabled'}, paid sends ${PAID?'ENABLED':'disabled'}`);
  else console.log(`  Wallet: not loaded${walletErr?' ('+walletErr+')':''} — read-only. Set WALLET_MNEMONIC to enable sending.`);
  console.log(`  Ctrl+C to stop.\n`);
});
