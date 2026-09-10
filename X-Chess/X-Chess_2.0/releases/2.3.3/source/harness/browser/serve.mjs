// Deterministic, real-browser regression runner. No wallet or live chain is contacted.
import {createServer} from 'node:http';
import {readFile, writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {uintCV, someCV, noneCV, tupleCV, trueCV, standardPrincipalCV, serializeCV} from '@stacks/transactions';
const root = resolve(fileURLToPath(new URL('../..', import.meta.url)));
const artifact = await readFile(resolve(root, process.env.XCHESS_TEST_ARTIFACT || 'dist/xchess.html'), 'utf8');
const sha256 = createHash('sha256').update(artifact).digest('hex');
const bundle = await build({entryPoints:[resolve(root, 'harness/browser/smoke.ts')], bundle:true, write:false, format:'iife', platform:'browser'});
const address = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
let lastReport = null;
const server = createServer(async (req,res) => {
  const url = new URL(req.url, 'http://localhost');
  const send = (text,type='text/html') => {res.writeHead(200, {'Content-Type':type,'Cache-Control':'no-store'});res.end(text);};
  try {
    if (url.pathname === '/') return send('<!doctype html><title>X Chess browser regression</title><h1>X Chess candidate browser tests</h1><pre id="results">Running…</pre><div id="scenarios"></div><script src="/smoke.js"></script>');
    if (url.pathname === '/smoke.js') return send(bundle.outputFiles[0].text, 'text/javascript');
    if (url.pathname === '/report' && req.method === 'POST') {
      let data=''; for await (const chunk of req) data+=chunk;
      lastReport = {...JSON.parse(data), artifactSha256:sha256, testedAt:new Date().toISOString()};
      await writeFile(resolve(root, process.env.XCHESS_TEST_REPORT_DIR || 'dist', 'browser-report.json'), JSON.stringify(lastReport,null,2)+'\n');
      return send('ok','text/plain');
    }
    if (url.pathname === '/report') return send(JSON.stringify(lastReport), 'application/json');
    if (/^\/runtime\/(url-support|module-bootstrap|wallet-shim)\.js$/.test(url.pathname)) {
      return send(await readFile(resolve(root,'harness/runtime/captured/2026-09-07',url.pathname.split('/').pop()),'utf8'),'text/javascript');
    }
    if (url.pathname.startsWith('/fixture-api/')) {
      const fn=url.pathname.split('/').pop();
      const result=fn==='get-format-version' ? uintCV(1) : fn==='get-game' ? someCV(tupleCV({
        'opened-by':standardPrincipalCV(address), 'opened-at':uintCV(1), 'next-seq':uintCV(0),
        'rules-hash':noneCV(), ranked:trueCV()
      })) : fn==='get-page' ? {type:'list', value:Array.from({length:50},()=>noneCV())} : uintCV(0);
      // Mempool and optional metadata return empty collections; immutable game data is above.
      const body=url.pathname.includes('/call-read/') ? {okay:true,result:serializeCV(result)} : {results:[],total:0};
      return send(JSON.stringify(body),'application/json');
    }
    if (url.pathname === '/scenario') {
      const mode=url.searchParams.get('mode'); const refuse=url.searchParams.get('wallet')==='refuse';
      const prelude=`<script>localStorage.clear();window.__XCHESS_API__='/fixture-api';window.__testCalls=[];window.__testErrors=[];addEventListener('error',e=>window.__testErrors.push(e.message));addEventListener('unhandledrejection',e=>window.__testErrors.push(String(e.reason)));if(${mode!=='framed'})window.StacksProvider={request:async(method)=>{window.__testCalls.push(method);if(${refuse})throw Object.assign(new Error('User rejected connection'),{code:4001});return {addresses:[{symbol:'STX',address:'${address}'}]};}};</script>`;
      const scripts=mode==='framed' ? '<script src="/runtime/url-support.js"></script><script src="/runtime/module-bootstrap.js"></script><script src="/runtime/wallet-shim.js?network=mainnet&walletBridgeToken=browser-test"></script>' : '';
      let html=artifact.replace('<head>', '<head><base href="null">'+prelude+scripts);
      for (const network of ['mainnet','testnet']) html=html.replaceAll(`https://api.${network}.hiro.so`,`https://xtrata.xyz/hiro/${network}`).replaceAll(`https://stacks-node-api.${network}.stacks.co`,`https://xtrata.xyz/hiro/${network}`);
      // Framed runtime uses document.write, matching the production viewer.
      return mode==='framed' ? send('<!doctype html><script>document.open();document.write('+JSON.stringify(html).replaceAll('</script','<\\/script')+');document.close();</script>') : send(html);
    }
    res.writeHead(404);res.end('not found');
  } catch(e) {res.writeHead(500);res.end(String(e.stack));}
});
server.listen(Number(process.env.PORT || 4342),'127.0.0.1',()=>console.log('Browser regression: http://127.0.0.1:'+server.address().port+' (artifact '+sha256+')'));
