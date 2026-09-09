// Local test coordination only; not an app transport or deployment service.
import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {build} from 'esbuild';
import {uintCV,serializeCV} from '@stacks/transactions';
const artifact=await readFile('dist/xchess.html','utf8');
const js=(await build({entryPoints:['harness/peer/driver.ts'],bundle:true,write:false,platform:'browser',format:'iife'})).outputFiles[0].text;
const queues=new Map(),pending=new Map();let sequence=0;
createServer(async(req,res)=>{
  const u=new URL(req.url,'http://localhost');const send=(body,type='application/json')=>{res.writeHead(200,{'Content-Type':type,'Cache-Control':'no-store'});res.end(body);};
  try{
    if(u.pathname==='/driver.js')return send(js,'text/javascript');
    if(u.pathname==='/next'){const queue=queues.get(u.searchParams.get('side'));return send(JSON.stringify(queue?.shift()??null));}
    if(u.pathname==='/done'){let body='';for await(const b of req)body+=b;const result=JSON.parse(body);pending.get(result.id)?.(result);pending.delete(result.id);return send('true');}
    if(u.pathname==='/command'){let body='';for await(const b of req)body+=b;const c=JSON.parse(body);c.id=++sequence;const queue=queues.get(c.side)??[];queues.set(c.side,queue);queue.push(c);const timer=setTimeout(()=>{pending.delete(c.id);res.writeHead(504);res.end('Driver timeout');},35000);pending.set(c.id,result=>{clearTimeout(timer);send(JSON.stringify(result));});return;}
    if(u.pathname.startsWith('/fixture-api/'))return send(JSON.stringify(u.pathname.includes('/call-read/')?{okay:true,result:serializeCV(uintCV(u.pathname.endsWith('get-format-version')?1:0))}:{results:[],total:0}));
    if(u.pathname==='/app'){
      const prelude=`<script>window.__XCHESS_API__='/fixture-api';window.__peerErrors=[];window.__peerExternal=[];addEventListener('error',e=>__peerErrors.push(e.message));addEventListener('unhandledrejection',e=>__peerErrors.push(String(e.reason)));const nativeFetch=window.fetch;window.fetch=(input,options)=>{const url=new URL(typeof input==='string'?input:input.url,location.href);if(url.origin!==location.origin){__peerExternal.push(url.href);return Promise.reject(new Error('External request blocked by test'));}return nativeFetch(input,options);};</script>`;
      return send(artifact.replace('<head>','<head>'+prelude)+'<script src="/driver.js"></script>','text/html');
    }
    send('true');
  }catch(e){res.writeHead(500);res.end(String(e));}
}).listen(4343,'127.0.0.1',()=>console.log('Peer browser fixture http://127.0.0.1:4343/app?side=white'));
