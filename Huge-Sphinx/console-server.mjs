/**
 * Local server for the Huge Sphinx console.
 *  - serves the dashboard
 *  - proxies /api/*  →  https://aibtc.com/api/*   (no browser CORS issue)
 *  - /local/*  signs & sends on your behalf using Huge Sphinx's key
 *
 * The key NEVER goes into the browser. It is loaded once here, from an env var,
 * when you start the server. Start it like this:
 *
 *   # Paid new sends (100 sats sBTC each) are ON by default once the wallet loads:
 *   WALLET_MNEMONIC="<Huge Sphinx 24 words — lowercase 'olympic'>" node console-server.mjs
 *
 *   # Run read-only (free replies only, no spending) by disabling paid sends:
 *   ALLOW_PAID_SEND=0 WALLET_MNEMONIC="<Huge Sphinx words>" node console-server.mjs
 *
 * Paid sending needs the x402-stacks library: npm install x402-stacks
 *
 * Open: http://localhost:8777/huge-sphinx-console.html
 * Requires Node 18+.
 *
 * Security model (see SECURITY notes inline):
 *  - binds to 127.0.0.1 only (never the LAN)
 *  - refuses to serve dotfiles / non-asset files (your .env stays private)
 *  - /local/* (which can SPEND sBTC) requires a same-origin loopback request,
 *    so a malicious web page can't drive your wallet via DNS-rebinding/CSRF.
 */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';
import { deriveKeys, signBip322 } from './scripts/aibtc-lib.mjs';

const PORT = process.env.PORT || 8777;
const HOST = process.env.HOST || '127.0.0.1';           // SECURITY: loopback only by default
const ROOT = process.cwd();
const UPSTREAM = 'https://aibtc.com';
const HS_STX = 'SP13G0F3E48HDK7MMRYXDHQ4RTACKDN5FSV9VEPRC';
const INBOX_MAX = 500;                                   // API caps message content at 500 chars
const TYPES = { '.html':'text/html', '.js':'text/javascript', '.json':'application/json', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png', '.ico':'image/x-icon' };
const SERVE_EXT = new Set(Object.keys(TYPES));            // SECURITY: only these extensions are served

// ---- load Huge Sphinx wallet once, from env ----
let keys = null, walletErr = null;
const MN = process.env.WALLET_MNEMONIC;
if (MN) {
  try {
    keys = deriveKeys(MN);
    if (keys.stxAddress !== HS_STX) { walletErr = 'Seed does not derive Huge Sphinx (use the lowercase "olympic" words).'; keys = null; }
  } catch (e) { walletErr = e.message; }
}
const PAID = process.env.ALLOW_PAID_SEND !== '0';   // spends ON by default; set ALLOW_PAID_SEND=0 for read-only

function send(res, status, obj){ res.writeHead(status, {'content-type':'application/json'}); res.end(JSON.stringify(obj)); }
function body(req){ return new Promise(r=>{ let b=''; req.on('data',c=>b+=c); req.on('end',()=>{ try{ r(b?JSON.parse(b):{}); }catch{ r({}); } }); }); }

// SECURITY: only accept requests whose Host (and Origin, if present) is loopback.
// Blocks DNS-rebinding / CSRF from a malicious page trying to reach the wallet routes.
function isLoopbackHost(h){ if(!h) return false; const host=h.split(':')[0].toLowerCase(); return host==='localhost'||host==='127.0.0.1'||host==='[::1]'||host==='::1'; }
function sameOriginLoopback(req){
  if(!isLoopbackHost(req.headers.host)) return false;
  const o = req.headers.origin;
  if(o){ try{ if(!isLoopbackHost(new URL(o).host)) return false; }catch{ return false; } }
  return true;
}

// Resolve a recipient's BTC + STX addresses from whatever id we were handed.
// The inbox API addresses messages by the recipient's bc1… address, but the
// console works in STX (SP…) addresses — so we must translate before sending.
async function resolveRecipient(to){
  const looksBtc = /^(bc1|tb1)/i.test(to);
  let stx = /^S[PT][0-9A-Z]+$/i.test(to) ? to : null;
  let btc = looksBtc ? to : null;
  const pick = a => { if(!a) return; stx = a.stxAddress || a.stx || stx; btc = a.btcAddress || a.btc || a.bitcoinAddress || btc; };
  // 1) direct lookup by the id we were given
  try { const r = await fetch(`${UPSTREAM}/api/agents/${encodeURIComponent(to)}`); if(r.ok){ const j = await r.json(); pick(j.agent || j); } } catch {}
  // 2) fall back to scanning the directory for a matching STX address
  if(!btc && stx){
    try {
      for(let off=0; off<5000; off+=100){
        const r = await fetch(`${UPSTREAM}/api/agents?limit=100&offset=${off}`); if(!r.ok) break;
        const j = await r.json(); const list = j.agents || [];
        const hit = list.find(a => (a.stxAddress||a.stx) === stx);
        if(hit){ pick(hit); break; }
        if(list.length < 100) break;
      }
    } catch {}
  }
  return { stx, btc };
}

async function handleLocal(req, res, path){
  if (path === '/local/status') {
    let x402 = false;
    if (PAID) { try { await import('x402-stacks'); x402 = true; } catch {} }
    return send(res, 200, {
      walletLoaded: !!keys, walletError: walletErr,
      stxAddress: keys?.stxAddress, btcAddress: keys?.btcAddress,
      paidEnabled: PAID, x402Available: x402,
      draftEnabled: !!process.env.ANTHROPIC_API_KEY,
    });
  }

  // SECURITY: everything below can change state / spend funds — require a loopback same-origin call.
  if (!sameOriginLoopback(req)) return send(res, 403, { ok:false, error:'Blocked: /local/* is only reachable from the console on this machine.' });

  // ---- AI reply draft (no wallet/funds needed; uses Anthropic API key from env) ----
  if (path === '/local/draft' && req.method === 'POST') {
    const KEY = process.env.ANTHROPIC_API_KEY;
    if (!KEY) return send(res, 501, { ok:false, error:'AI drafting is off. Restart the server with ANTHROPIC_API_KEY set to enable the ✨ Draft with AI button.' });
    const { agent, recipient, theirReply, myMessage, thread } = await body(req);
    if (!theirReply) return send(res, 400, { ok:false, error:'theirReply required' });
    // Best-effort extra context: the recipient's public agent bio.
    let bio = '';
    if (recipient) { try { const ag = await fetch(`${UPSTREAM}/api/agents/${encodeURIComponent(recipient)}`).then(r=>r.ok?r.json():null); const a = ag && (ag.agent||ag); if (a && a.description) bio = a.description; } catch {} }
    const model = process.env.DRAFT_MODEL || 'claude-haiku-4-5-20251001';
    const system = `You are Huge Sphinx, an AI agent on the AIBTC network representing Xtrata — permanent, contract-native inscriptions on Stacks (SIP-009 NFTs, SHA-256 hash chains, recursive dependencies; live in production via Forever Twins, which permanently seals NFT collections like Bitcoin Pepes, LEO Cats and Miami Degens on Bitcoin). You are writing the NEXT message in an ongoing agent-to-agent conversation. Write ONE reply that: responds specifically to what the other agent just said; moves toward a concrete mutual next step (a demo, a spec, a test, a co-draft); is warm, credible and concise; is UNDER 480 characters. Output ONLY the message text — no preamble, no quotes, no signature.`;
    let convo='';
    if (Array.isArray(thread) && thread.length) convo = thread.map(t=>`${t.dir==='out'?'You (Huge Sphinx)':'Them ('+(agent||'agent')+')'}: ${t.content}`).join('\n\n');
    const user = `Other agent: ${agent||'(unknown)'}${bio?`\nTheir bio: ${bio}`:''}\n\n${convo?`Full conversation so far (oldest first):\n${convo}\n\nWrite Huge Sphinx's next message — move it toward a concrete next step.`:`Your earlier message to them:\n${myMessage||'(n/a)'}\n\nTheir reply (respond to this):\n${theirReply}`}`;
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'content-type':'application/json', 'x-api-key':KEY, 'anthropic-version':'2023-06-01' },
        body: JSON.stringify({ model, max_tokens: 400, system, messages:[{ role:'user', content: user }] }),
      });
      const d = await r.json().catch(()=>({}));
      if (!r.ok) return send(res, 502, { ok:false, error: (d&&d.error&&d.error.message) || ('Anthropic API '+r.status) });
      let text = ((d.content && d.content[0] && d.content[0].text) || '').trim();
      if (!text) return send(res, 502, { ok:false, error:'Empty draft from model.' });
      if (text.length > 500) text = text.slice(0, 497).trimEnd() + '…';
      return send(res, 200, { ok:true, draft: text, model });
    } catch (e) { return send(res, 502, { ok:false, error: e.message }); }
  }

  // ---- Plain-English explanation of a draft (no wallet/funds needed) ----
  if (path === '/local/explain' && req.method === 'POST') {
    const KEY = process.env.ANTHROPIC_API_KEY;
    if (!KEY) return send(res, 501, { ok:false, error:'AI explanations are off. Restart the server with ANTHROPIC_API_KEY set.' });
    const { agent, theirReply, myMessage, thread, draft } = await body(req);
    let convo='';
    if (Array.isArray(thread) && thread.length) convo = thread.map(t=>`${t.dir==='out'?'Us (Huge Sphinx)':'Them'}: ${t.content}`).join('\n\n');
    const model = process.env.DRAFT_MODEL || 'claude-haiku-4-5-20251001';
    const system = `You explain agent-to-agent crypto outreach to a NON-TECHNICAL reader — imagine a smart friend who doesn't code or follow crypto. Use plain, everyday English and short sentences. Avoid jargon; if something technical matters (an "inscription", an NFT, a wallet, sats), explain it in one simple phrase. Keep each field to 1–3 sentences. Return ONLY a JSON object (no markdown fence, no preamble) with exactly these keys: their_message (what the other agent actually said, plainly), their_intent (what they really want or are offering, and why), our_thinking (the strategy behind our reply — how it builds trust and moves toward a shared goal), our_response (what our drafted reply says back, in plain terms).`;
    const user = `The other agent: ${agent||'(unknown)'}\n\n${convo?`Conversation so far:\n${convo}\n\n`:`Their message:\n${theirReply||'(n/a)'}\n\nOur earlier message:\n${myMessage||'(n/a)'}\n\n`}Our drafted reply to explain:\n${draft||'(empty)'}`;
    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{ 'content-type':'application/json', 'x-api-key':KEY, 'anthropic-version':'2023-06-01' },
        body: JSON.stringify({ model, max_tokens: 700, system, messages:[{ role:'user', content: user }] }),
      });
      const d = await r.json().catch(()=>({}));
      if (!r.ok) return send(res, 502, { ok:false, error: (d&&d.error&&d.error.message) || ('Anthropic API '+r.status) });
      let text = ((d.content && d.content[0] && d.content[0].text) || '').trim();
      let explanation = null;
      try { explanation = JSON.parse(text.replace(/^```(?:json)?/i,'').replace(/```$/,'').trim()); } catch {}
      if (!explanation || typeof explanation !== 'object') explanation = { their_message:'', their_intent:'', our_thinking:'', our_response: text };
      return send(res, 200, { ok:true, explanation });
    } catch (e) { return send(res, 502, { ok:false, error: e.message }); }
  }

  if (!keys) return send(res, 503, { ok:false, error: walletErr || 'Wallet not loaded. Restart the server with WALLET_MNEMONIC set.' });

  // ---- FREE reply ----
  if (path === '/local/reply' && req.method === 'POST') {
    const { messageId, reply, markRead } = await body(req);
    if (!messageId || !reply) return send(res, 400, { ok:false, error:'messageId and reply required' });
    if (reply.length > INBOX_MAX) return send(res, 400, { ok:false, error:`reply exceeds ${INBOX_MAX} chars` });
    try {
      if (markRead) {
        const rs = signBip322(`Inbox Read | ${messageId}`, keys.btcPrivKey, keys.btcScript);
        const mr = await fetch(`${UPSTREAM}/api/inbox/${keys.btcAddress}/${messageId}`, { method:'PATCH', headers:{'content-type':'application/json'}, body: JSON.stringify({ messageId, signature: rs }) });
        if (!mr.ok) console.warn(`mark-read ${messageId} → ${mr.status}`);
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
    const { to, content, toBtcAddress, toStxAddress } = await body(req);
    if (!to || !content) return send(res, 400, { ok:false, error:'to and content required' });
    if (content.length > INBOX_MAX) return send(res, 400, { ok:false, error:`content exceeds ${INBOX_MAX} chars (inbox limit)` });
    let x402;
    try { x402 = await import('x402-stacks'); }
    catch { return send(res, 501, { ok:false, error:'x402-stacks not installed. Run: npm install x402-stacks' }); }

    // Resolve recipient addresses. The inbox API requires the recipient's bc1… (BTC)
    // address in BOTH the URL path and the body; sending null here is what produced
    // the "validation_failed" error, so we resolve up front and fail clearly if we can't.
    let stx = toStxAddress || null, btc = toBtcAddress || null;
    if (!btc) { const r = await resolveRecipient(to); btc = r.btc; stx = stx || r.stx; }
    if (!btc) return send(res, 422, { ok:false, error:`Could not resolve a Bitcoin (bc1…) address for ${to}. The inbox API addresses messages by BTC address — open the recipient in the Directory so it can be looked up, or paste their bc1… address.` });

    try {
      const account = x402.privateKeyToAccount(keys.stxPrivHex, 'mainnet');
      const api = x402.createPaymentClient(account, { baseURL: UPSTREAM });
      // Body shape per aibtc.com/docs/messaging.txt (x402-stacks integration example).
      const payload = { toBtcAddress: btc, content, paymentSatoshis: 100 };
      if (stx) payload.toStxAddress = stx;
      const resp = await api.post(`/api/inbox/${btc}`, payload);
      const d = resp.data || {};
      const pending = resp.status === 202 || d.paymentStatus === 'pending';
      return send(res, 200, {
        ok: true, pending,
        messageId: d.messageId || d.id || null,
        paymentId: d.paymentId || resp.headers?.['x-payment-id'] || null,
        status: resp.status, data: d,
      });
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
      // SECURITY: this proxy can read your inbox — keep it same-origin loopback too.
      if (!sameOriginLoopback(req)) { res.writeHead(403); return res.end('forbidden'); }
      const init = { method: req.method, headers: { accept:'application/json' } };
      if (!['GET','HEAD'].includes(req.method)) { init.headers['content-type']='application/json'; init.body = await new Promise(r=>{let b='';req.on('data',c=>b+=c);req.on('end',()=>r(b));}); }
      const r = await fetch(UPSTREAM + url.pathname + url.search, init);
      const text = await r.text();
      res.writeHead(r.status, { 'content-type': r.headers.get('content-type') || 'application/json' });
      return res.end(text);
    }

    // ---- static assets ----
    let p = url.pathname === '/' ? '/huge-sphinx-console.html' : url.pathname;
    const fp = normalize(join(ROOT, decodeURIComponent(p)));
    // SECURITY: stay inside ROOT, never serve dotfiles (.env*), only known asset types.
    const rel = fp.slice(ROOT.length + 1);
    if (!fp.startsWith(ROOT + sep)) { res.writeHead(403); return res.end('forbidden'); }
    if (rel.split(sep).some(seg => seg.startsWith('.'))) { res.writeHead(404); return res.end('not found'); }
    if (!SERVE_EXT.has(extname(fp))) { res.writeHead(404); return res.end('not found'); }
    const data = await readFile(fp);
    res.writeHead(200, { 'content-type': TYPES[extname(fp)] || 'application/octet-stream' });
    res.end(data);
  } catch (e) {
    res.writeHead(e.code === 'ENOENT' ? 404 : 500); res.end(String(e.message||e));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`\n  Huge Sphinx console → http://localhost:${PORT}/huge-sphinx-console.html`);
  console.log(`  Bound to ${HOST}:${PORT} (loopback only) · API proxy: /api/* → ${UPSTREAM}`);
  if (keys) console.log(`  Wallet: LOADED (${keys.stxAddress}) — replies enabled, paid sends ${PAID?'ENABLED ⚡ (100 sats each — ALLOW_PAID_SEND=0 for read-only)':'disabled'}`);
  else console.log(`  Wallet: not loaded${walletErr?' ('+walletErr+')':''} — read-only. Set WALLET_MNEMONIC to enable sending.`);
  console.log(`  Ctrl+C to stop.\n`);
});
