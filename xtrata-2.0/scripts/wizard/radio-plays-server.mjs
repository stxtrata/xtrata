#!/usr/bin/env node
import {createServer} from 'node:http';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {dirname,resolve,join} from 'node:path';
import {readFile} from 'node:fs/promises';
import {MusicWebBridge} from './music-web-bridge.mjs';
import {RadioListening} from './radio-listening.mjs';
import {RadioMedia} from './radio-media.mjs';
import {RadioWizard,policy} from './radio-plays-backend.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
export function createWizardServer(wizard,origin='http://127.0.0.1:8798',media=new RadioMedia()) {
const listening=new RadioListening(wizard,media);
const webBridge=new MusicWebBridge(wizard,listening,media);
const server=createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Frame-Options','DENY');res.setHeader('Content-Security-Policy',"default-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'; media-src 'self'");
 try{
  const expectedOrigin=origin??`http://127.0.0.1:${server.address().port}`;
  if(req.headers.host!==new URL(expectedOrigin).host)throw Error('Invalid host.');
  if(req.url==='/web-bridge'&&req.method==='OPTIONS'){webBridge.extension(req.headers.origin);res.setHeader('Access-Control-Allow-Origin',req.headers.origin);res.setHeader('Access-Control-Allow-Methods','POST');res.setHeader('Access-Control-Allow-Headers','content-type');res.end();return;}
  if(req.url==='/web-bridge'&&req.method==='POST'){webBridge.extension(req.headers.origin);res.setHeader('Access-Control-Allow-Origin',req.headers.origin);if(req.headers['content-type']!=='application/json')throw Error('JSON required');let body='';for await(const chunk of req){body+=chunk;if(body.length>2048)throw Error('Request too large');}const result=await webBridge.call(req.headers.origin,JSON.parse(body));res.setHeader('Content-Type','application/json');res.end(JSON.stringify(result));return;}
  if(req.method==='GET'&&['/web-approval','/web-approval.js'].includes(req.url.split('?')[0])){const script=req.url.split('?')[0].endsWith('.js');res.setHeader('Content-Type',script?'text/javascript':'text/html');res.end(await readFile(join(root,'scripts/wizard/music-web-approval.'+(script?'js':'html'))));return;}
  if(req.method==='GET'&&['/lounge','/lounge.css','/lounge.js'].includes(req.url)){const ext=req.url==='/lounge'?'html':req.url.endsWith('.css')?'css':'js';res.setHeader('Content-Type',ext==='html'?'text/html':ext==='css'?'text/css':'text/javascript');res.end(await readFile(join(root,'scripts/wizard/music-lounge.'+ext)));return;}
  if(req.method==='GET'&&['/','/ui.js','/ui.css','/radio.js'].includes(req.url)){res.setHeader('Content-Type',req.url==='/'?'text/html':req.url==='/ui.css'?'text/css':'text/javascript');res.end(await readFile(req.url==='/radio.js'?join(root,'scripts/wizard/radio-listening-ui.js'):join(root,'scripts/wizard/radio-plays'+(req.url==='/'?'-panel.html':req.url==='/ui.css'?'-ui.css':'-ui.js'))));return;}
  const url=new URL(req.url,expectedOrigin);
  if(req.method==='GET'&&url.pathname==='/radio/catalogue'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({tracks:await media.catalogue()}));return;}
  if(req.method==='GET'&&url.pathname==='/radio/artwork'){const artwork=await media.artwork(Number(url.searchParams.get('id')));res.setHeader('Content-Type',artwork.mime);res.setHeader('X-Content-Type-Options','nosniff');res.end(artwork.body);return;}
  if(req.method==='GET'&&url.pathname==='/radio/audio'){
   const id=url.searchParams.get('id');if(!/^(0|[1-9][0-9]*)$/.test(id||''))throw Error('Invalid song ID.');
   const audio=await media.audio(Number(id));res.setHeader('Content-Type',audio.mime);res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Content-Length',audio.body.length);res.end(audio.body);return;
  }
  if(req.method!=='POST'||req.headers.origin!==expectedOrigin||req.headers['content-type']!=='application/json')throw Error('Use the local control panel.');
  let body='';for await(const chunk of req){body+=chunk;if(body.length>2048)throw Error('Request too large.');}
  const data=JSON.parse(body||'{}');let result;
  if(req.url==='/web-review'||req.url==='/web-approve'){if(Object.keys(data).join()!=='id'||typeof data.id!=='string')throw Error('Invalid approval');result=req.url==='/web-review'?webBridge.review(data.id):await webBridge.approve(data.id);}
  else if(req.url==='/setup')result=await wizard.setup();
  else if(req.url==='/listening/enable')result=await listening.enable(data);
  else if(req.url==='/listening/free')result=listening.free(data);
  else if(req.url==='/listening/heartbeat'){listening.renew(data);result=await listening.refreshedSnapshot();}
  else if(req.url==='/listening/status')result=await listening.refreshedSnapshot();
  else if(req.url==='/listening/start')result=await listening.start(data);
  else if(req.url==='/status')result=await wizard.status(true);
  else if(req.url==='/stop'){wizard.stop();result={message:wizard.message};}
  else if(req.url==='/return/prepare')result=await wizard.prepareReturn(data);
  else if(req.url==='/return/confirm'||req.url==='/return/cancel'){
   if(Object.keys(data).length!==1||typeof data.id!=='string')throw Error('Expected a return review ID only.');
   result=await wizard[req.url.endsWith('confirm')?'confirmReturn':'cancelReturn'](data.id);
  }
  else if(req.url==='/run'){if(listening.snapshot().enabled)throw Error('Switch radio tests to Free before running manual tests.');policy(data);if(wizard.running)throw Error('Run already active.');void wizard.run(data).catch(()=>{});result={message:'Run requested. Check status for results.'};}
  else throw Error('Unknown action.');
  res.setHeader('Content-Type','application/json');res.end(JSON.stringify(result));
 }catch(error){res.statusCode=400;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:error.message}));}
});
server.on('close',()=>{webBridge.close();listening.disable();});
return server;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const wizard=new RadioWizard(join(root,'.artifacts/radio-wizard'));
 if(process.argv[2]==='setup')console.log(JSON.stringify(await wizard.setup()));
 else if(process.argv[2]==='status')console.log(JSON.stringify(await wizard.status(true),null,2));
 else createWizardServer(wizard).listen(8798,'127.0.0.1',()=>console.log('Radio wizard controls: http://127.0.0.1:8798 — no spending starts automatically.'));
}
