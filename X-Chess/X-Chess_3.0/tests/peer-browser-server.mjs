// Local test fixture only. Simulated wallet transactions never leave Clarinet simnet.
import {createServer} from 'node:http';import {readFile,writeFile} from 'node:fs/promises';
import {build} from '../../X-Chess_2.0/node_modules/esbuild/lib/main.js';
import {initSimnet} from '../../X-Chess_2.0/node_modules/@stacks/clarinet-sdk/dist/esm/node/src/index.js';
import {Cl,serializeCV,deserializeCV} from '../../X-Chess_2.0/node_modules/@stacks/transactions/dist/index.js';
const sim=await initSimnet(new URL('../Clarinet.toml',import.meta.url).pathname),accounts=[sim.getAccounts().get('wallet_1'),sim.getAccounts().get('wallet_2')];
const bundle=async p=>(await build({entryPoints:[new URL(p,import.meta.url).pathname],bundle:true,write:false,format:'iife',platform:'browser'})).outputFiles[0].text;
const ui=await bundle('../src/peer/ui.ts'),tests=await bundle('./peer-browser.ts'),page=await readFile(new URL('../src/peer/page.html',import.meta.url),'utf8');
let txCount=0;
createServer(async(req,res)=>{
 const url=new URL(req.url,'http://127.0.0.1:4351');const send=(body,type='application/json',status=200)=>{res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store'});res.end(typeof body==='string'?body:JSON.stringify(body));};
 try{
  if(url.pathname==='/')return send('<!doctype html><title>Peer play tests</title><h1>Peer play browser tests</h1><pre id="results">Running…</pre><div id="frames"></div><script src="/tests.js"></script>','text/html');
  if(url.pathname==='/tests.js')return send(tests,'text/javascript');
  if(url.pathname==='/accounts')return send(accounts);
  if(url.pathname==='/ui'){
   const who=accounts[Number(url.searchParams.get('side'))||0];
   const fixture=`globalThis.testDownloads=[];const oldCreate=URL.createObjectURL;URL.createObjectURL=b=>{globalThis.testDownloads.push(b);return oldCreate(b)};HTMLAnchorElement.prototype.click=function(){};window.confirm=()=>true;globalThis.XChessWallet={providers:()=>[{name:'Simulated wallet',get:()=>({})}],connect:async()=>${JSON.stringify(who)},sign:async(_,params)=>{const r=await fetch('/tx',{method:'POST',body:JSON.stringify({who:${JSON.stringify(who)},params})});const v=await r.json();if(!r.ok)throw Error(v.error);return v;}};`;
   return send(page.replace('<!-- PEER_SCRIPT -->',()=>'<script>'+fixture+'\n'+ui+'</script>'),'text/html');
  }
  if(url.pathname==='/artifact')return send(await readFile(new URL('../dist/xchess.html',import.meta.url),'utf8'),'text/html');
  if(url.pathname==='/report'&&req.method==='POST'){let text='';for await(const c of req)text+=c;await writeFile(new URL('../peer-browser-results.json',import.meta.url),text);return send({ok:true});}
  if(url.pathname==='/tx'){let text='';for await(const c of req)text+=c;const {who,params}=JSON.parse(text);const r=sim.callPublicFn('xchess-peer-v1',params.functionName,params.functionArgs.map(deserializeCV),who).result;if(Cl.prettyPrint(r).startsWith('(err'))throw Error(Cl.prettyPrint(r));txCount++;return send({txid:txCount.toString(16).padStart(64,'0')});}
  if(url.pathname==='/api/v2/info')return send({network_id:2147483648,stacks_tip_height:sim.blockHeight});
  if(url.pathname.startsWith('/api/v2/contracts/call-read/')){let text='';for await(const c of req)text+=c;const body=JSON.parse(text);const result=sim.callReadOnlyFn('xchess-peer-v1',url.pathname.split('/').pop(),body.arguments.map(deserializeCV),accounts[0]).result;return send({okay:true,result:'0x'+serializeCV(result)});}
  send({error:'Not found'},'application/json',404);
 }catch(e){send({error:e.message},'application/json',500);}
}).listen(4351,'127.0.0.1',()=>console.log('Peer browser fixture: http://127.0.0.1:4351'));
