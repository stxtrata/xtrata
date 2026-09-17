// Read-only availability host. Intentionally opens no database or key store.
import { validateRead } from '../../extensions/music-wallet/validate.js';
import { decoder, encodeFrame } from './framing.mjs';
const extension=process.env.XTRATA_MUSIC_EXTENSION_ID;
if(!/^[a-p]{32}$/.test(extension||'') || process.argv[2]!==`chrome-extension://${extension}/`) process.exit(1);
const receive=decoder(message=>{
  const {context,...request}=message;
  if(!context || Object.keys(context).length!==3 || context.topLevel!==true)throw Error('Invalid context');
  validateRead(request,{id:extension,frameId:0,documentId:context.documentId,tab:{id:0},origin:context.origin,url:context.origin},extension);
  process.stdout.write(encodeFrame({id:message.id,ok:false,error:'unavailable'}));
});
process.stdin.on('data',chunk=>{try{receive(chunk);}catch{process.exitCode=1;process.stdin.destroy();}});
