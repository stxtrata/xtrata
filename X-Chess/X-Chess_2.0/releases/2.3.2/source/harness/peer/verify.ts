// Bundled offline CLI. Only Node's filesystem/crypto builtins are needed.
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import {parseBounded} from '../../packages/peer/crypto.js';
import {verifyArchive} from '../../packages/peer/protocol.js';
import type {Archive} from '../../packages/peer/protocol.js';
import {sha256Hex} from '../../packages/protocol/sha256.js';
if(!globalThis.crypto?.subtle)Object.defineProperty(globalThis,'crypto',{value:webcrypto});
try{
  if(!process.argv[2])throw Error('Usage: node verify-peer.mjs public-game.json');
  const text=readFileSync(process.argv[2],'utf8'),a=parseBounded(text) as Archive,r=await verifyArchive(a);
  console.log(JSON.stringify({fileSha256:sha256Hex(text),...r.summary,opening:a.opening.kind==='demo'?'Local demo; no verified Stacks identities':'Signatures and replay valid; on-chain opening has not been checked',guarantee:'Authenticates this signed line; does not establish absence of other branches'},null,2));
}catch(e){console.error(e instanceof Error?e.message:String(e));process.exitCode=1;}
