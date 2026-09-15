#!/usr/bin/env node
import {createServer} from 'node:http';
import {fileURLToPath} from 'node:url';
import {dirname,resolve,join} from 'node:path';
import {readFile} from 'node:fs/promises';
import {RadioWizard,policy} from './radio-plays-backend.mjs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const wizard=new RadioWizard(join(root,'.artifacts/radio-wizard'));
const origin='http://127.0.0.1:8798';
if(process.argv[2]==='setup'){console.log(JSON.stringify(await wizard.setup()));process.exit(0);}
if(process.argv[2]==='status'){console.log(JSON.stringify(await wizard.status(true),null,2));process.exit(0);}
const server=createServer(async(req,res)=>{
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Frame-Options','DENY');res.setHeader('Content-Security-Policy',"default-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
 try{
  if(req.headers.host!=='127.0.0.1:8798')throw Error('Invalid host.');
  if(req.method==='GET'&&['/','/ui.js'].includes(req.url)){res.setHeader('Content-Type',req.url==='/'?'text/html':'text/javascript');res.end(await readFile(join(root,'scripts/wizard/radio-plays'+(req.url==='/'?'-panel.html':'-ui.js'))));return;}
  if(req.method!=='POST'||req.headers.origin!==origin||req.headers['content-type']!=='application/json')throw Error('Use the local control panel.');
  let body='';for await(const chunk of req){body+=chunk;if(body.length>2048)throw Error('Request too large.');}
  const data=JSON.parse(body||'{}');let result;
  if(req.url==='/setup')result=await wizard.setup();
  else if(req.url==='/status')result=await wizard.status(true);
  else if(req.url==='/stop'){wizard.stop();result={message:wizard.message};}
  else if(req.url==='/run'){policy(data);if(wizard.running)throw Error('Run already active.');void wizard.run(data).catch(()=>{});result={message:'Run requested. Check status for results.'};}
  else throw Error('Unknown action.');
  res.setHeader('Content-Type','application/json');res.end(JSON.stringify(result));
 }catch(error){res.statusCode=400;res.setHeader('Content-Type','application/json');res.end(JSON.stringify({error:error.message}));}
});
server.listen(8798,'127.0.0.1',()=>console.log('Radio wizard controls: '+origin+' — no spending starts automatically.'));
