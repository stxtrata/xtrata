#!/usr/bin/env node
// Build authentic packed geometry with Three r128 and an in-process canvas. No browser is used.
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {dirname,resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import vm from 'node:vm';
const HERE=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(import.meta.url),base=process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES;
let native;try{native=require('@napi-rs/canvas');}catch(e){if(!base)throw e;native=require(join(base,'@napi-rs/canvas'));}
const {createCanvas,loadImage,Image}=native;
const context={console,Image,performance,Uint8Array,Float32Array,Uint16Array,Uint32Array,ArrayBuffer,TextEncoder,TextDecoder,setTimeout,clearTimeout};
context.document={createElement:tag=>{if(tag!=='canvas')throw Error('Unsupported builder element '+tag);return createCanvas(1,1);},createElementNS:(_,tag)=>{if(tag==='canvas')return createCanvas(1,1);if(tag==='img')return new Image();throw Error('Unsupported builder NS element '+tag);}};
context.window=context;context.self=context;vm.createContext(context);
for(const f of ['vendor/three-r128.min.js','vendor/xlogo.js','src/cabinet.js'])vm.runInContext(readFileSync(join(HERE,f),'utf8'),context,{filename:f});
const opts={};const logoArg=process.argv.find(a=>a.startsWith('--welsh='));let logo=logoArg?resolve(logoArg.slice(8)):null;
if(!logo)for(const f of ['art/welsh.png','art/welsh.webp','art/logos/welsh.png','art/logos/welsh.webp','art/welsh-logo.png'])if(existsSync(join(HERE,f))){logo=join(HERE,f);break;}
if(logo){opts.welshImage=await loadImage(logo);}
const r=context.buildCabinet(opts);mkdirSync(join(HERE,'src'),{recursive:true});writeFileSync(join(HERE,'src/model.json'),r.json);writeFileSync(join(HERE,'src/model-stats.json'),JSON.stringify({...r.stats,bytes:Buffer.byteLength(r.json),welshLogo:logo?logo.slice(HERE.length+1):'logo pending'},null,2)+'\n');
console.log(JSON.stringify({file:'src/model.json',bytes:Buffer.byteLength(r.json),...r.stats,welshLogo:!!logo}));
