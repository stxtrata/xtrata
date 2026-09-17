#!/usr/bin/env node
import {createServer} from 'node:http';
import {fileURLToPath,pathToFileURL} from 'node:url';
import {dirname,resolve,join} from 'node:path';
import {readFile} from 'node:fs/promises';
import {RadioWizard,policy} from './radio-plays-backend.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
export function createWizardServer(wizard,origin='http://127.0.0.1:8798') {
const server=createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Frame-Options','DENY');res.setHeader('Content-Security-Policy',"default-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
 try{
  const expectedOrigin=origin??`http://127.0.0.1:${server.address().port}`;
  if(req.headers.host!==new URL(expectedOrigin).host)throw Error('Invalid host.');
  if(req.method==='GET'&&['/','/ui.js','/ui.css'].includes(req.url)){res.setHeader('Content-Type',req.url==='/'?'text/html':req.url==='/ui.css'?'text/css':'text/javascript');res.end(await readFile(join(root,'scripts/wizard/radio-plays'+(req.url==='/'?'-panel.html':req.url==='/ui.css'?'-ui.css':'-ui.js'))));return;}
  if(req.method!=='POST'||req.headers.origin!==expectedOrigin||req.headers['content-type']!=='application/json')throw Error('Use the local control panel.');
  let body='';for await(const chunk of req){body+=chunk;if(body.length>2048)throw Error('Request too large.');}
  const data=JSON.parse(body||'{}');let result;
  if(req.url==='/setup')result=await wizard.setup();
  else if(req.url==='/status')result=await wizard.status(true);
  else if(req.url==='/stop'){wizard.stop();result={message:wizard.message};}
  else if(req.url==='/return/prepare')result=await wizard.prepareReturn(data);
  else if(req.url==='/return/confirm'||req.url==='/return/cancel'){
   if(Object.keys(data).length!==1||typeof data.id!=='string')throw Error('Expected a return review ID only.');
   result=await wizard[req.url.endsWith('confirm')?'confirmReturn':'cancelReturn'](data.id);
  }
  else if(req.url==='/run'){policy(data);if(wizard.running)throw Error('Run already active.');void wizard.run(data).catch(()=>{});result={message:'Run requested. Check status for results.'};}
  else throw Error('Unknown action.');
  res.setHeader('Content-Type','application/json');res.end(JSON.stringify(result));
 }catch(error){res.statusCode=400;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:error.message}));}
});
return server;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const wizard=new RadioWizard(join(root,'.artifacts/radio-wizard'));
 if(process.argv[2]==='setup')console.log(JSON.stringify(await wizard.setup()));
 else if(process.argv[2]==='status')console.log(JSON.stringify(await wizard.status(true),null,2));
 else createWizardServer(wizard).listen(8798,'127.0.0.1',()=>console.log('Radio wizard controls: http://127.0.0.1:8798 — no spending starts automatically.'));
}
