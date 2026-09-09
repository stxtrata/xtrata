import {it,expect} from 'vitest';
import {readFileSync} from 'node:fs';
import {verifyArchive} from '../../packages/peer/protocol.js';
it('verifies the frozen native-browser Fool’s Mate signature vector',async()=>{
  const a=JSON.parse(readFileSync('tests/peer/vectors/fools-mate.json','utf8'));
  expect((await verifyArchive(a)).summary).toMatchObject({result:'0-1',termination:'checkmate',root:'6712eba509a0c3c34674e2eb3407312b6d58892ca2cebaff6e72fd07c49fc7b9'});
});
