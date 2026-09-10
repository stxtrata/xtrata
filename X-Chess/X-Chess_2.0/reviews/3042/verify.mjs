// Public, read-only verification. No wallet keys or broadcast code.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {XtrataReader,PeerRegistry,verifyArchive} from '../3037/modules.mjs';
const dir='reviews/3042',sha=b=>createHash('sha256').update(b).digest('hex');
const original=readFileSync('releases/2.3.3/xchess.html','utf8'),served=readFileSync(dir+'/served.html','utf8');
const transformed=original.replace('<head>','<head><base href="null">').replaceAll('https://api.mainnet.hiro.so','https://xtrata.xyz/hiro/mainnet').replaceAll('https://stacks-node-api.mainnet.stacks.co','https://xtrata.xyz/hiro/mainnet').replaceAll('https://api.testnet.hiro.so','https://xtrata.xyz/hiro/testnet').replaceAll('https://stacks-node-api.testnet.stacks.co','https://xtrata.xyz/hiro/testnet');
assert.equal(served,transformed,'Unexpected served HTML transformation');
writeFileSync(dir+'/identity.json',JSON.stringify({passed:true,inscription:3042,originalSha256:sha(original),servedSha256:sha(served),servedBytes:Buffer.byteLength(served),matchesExpectedRuntimeTransform:true},null,2)+'\n');
const reader=new XtrataReader({override:'https://xtrata.xyz/hiro/mainnet',maxChunks:32}),meta=await reader.meta(3042);assert(meta?.sealed);assert.equal(meta.size,Buffer.byteLength(original));
const text=await reader.text(3042);assert.equal(text,original);writeFileSync(dir+'/onchain.html',text);
const archiveText=await reader.text(3038);assert.equal(archiveText,readFileSync('reviews/3037/sealed-result.json','utf8'));
const archive=JSON.parse(archiveText),opening=await new PeerRegistry(archive.opening.registry,'mainnet','https://xtrata.xyz/hiro/mainnet').confirmed(1);await verifyArchive(archive,opening);
const result={passed:true,inscription:3042,at:new Date().toISOString(),meta,sha256:sha(text),method:'All on-chain chunks read directly; exact original HTML equality',existingArchive:{inscription:3038,sha256:sha(archiveText),registeredOpeningVerified:true,result:archive.final.result}};
writeFileSync(dir+'/chain-verification.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify(result,null,2));
