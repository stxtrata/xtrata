import { describe,it,expect } from 'vitest';
import { spawnSync } from 'node:child_process';
import { validateRead } from '../../../extensions/music-wallet/validate.js';
import { decoder,encodeFrame } from '../../../tools/music-wallet/framing.mjs';
const extension='a'.repeat(32), id='b'.repeat(32);
const sender={id:extension,frameId:0,documentId:'document-1',tab:{id:1},origin:'https://xtrata.xyz',url:'https://xtrata.xyz/radio'};
const request={id,method:'status'};
describe('read-only bridge',()=>{
 it('accepts bounded reads and derives context from the browser',()=>{
  expect(validateRead(request,sender,extension).context.origin).toBe(sender.origin);
  expect(validateRead({id,method:'history',cursor:null,limit:50},sender,extension).limit).toBe(50);
 });
 it('rejects other origins, frames, extensions and missing documents',()=>{
  for(const change of [{origin:'https://evil.example'},{url:'https://evil.example'},{frameId:1},{id:'c'.repeat(32)},{documentId:''}]) expect(()=>validateRead(request,{...sender,...change},extension)).toThrow();
 });
 it('rejects signing, extra context and malformed reads',()=>{
  for(const change of [{method:'sign'},{context:{}},{id:123},{method:'history',cursor:null,limit:51},{method:'history',cursor:1,limit:1}])expect(()=>validateRead({...request,...change},sender,extension)).toThrow();
 });
 it('decodes fragmented and consecutive native messages',()=>{
  const values=[];const receive=decoder((v)=>values.push(v));
  for(const byte of Buffer.concat([encodeFrame(request),encodeFrame(request)]))receive(Buffer.from([byte]));
  expect(values).toEqual([request,request]);
 });
 it('closes after malformed framing and limits output size',()=>{
  const receive=decoder(()=>{});
  expect(()=>receive(Buffer.alloc(4))).toThrow();
  expect(()=>receive(encodeFrame(request))).toThrow();
  expect(()=>encodeFrame('x'.repeat(65537))).toThrow();
 });
 it('runs a real child host without wallet access and rejects wrong extension',()=>{
  const message=validateRead(request,sender,extension);
  const run=(origin,input)=>spawnSync(process.execPath,['tools/music-wallet/native-host.mjs',origin],{input:encodeFrame(input),env:{...process.env,XTRATA_MUSIC_EXTENSION_ID:extension}});
  const result=run(`chrome-extension://${extension}/`,message);
  expect(result.status).toBe(0);
  const replies=[];decoder((v)=>replies.push(v))(result.stdout);
  expect(replies).toEqual([{id,ok:false,error:'unavailable'}]);
  expect(run('chrome-extension://wrong/',message).status).toBe(1);
  expect(run(`chrome-extension://${extension}/`,{...message,method:'sign'}).status).toBe(1);
 });
});
