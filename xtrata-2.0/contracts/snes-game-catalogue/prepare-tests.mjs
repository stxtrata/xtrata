// Test-only copies: simnet cannot host contracts at the mainnet addresses, so the adapter's literal core principal and the
// core's SIP-009 trait principal are rewritten to the simnet deployer. Nothing else changes.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
mkdirSync('contracts/test', { recursive: true });
const CORE = "'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3";
const adapter = readFileSync('contracts/snes-xtrata-adapter-v3-2-3.clar', 'utf8');
if (!adapter.includes(CORE)) throw new Error('adapter does not reference the live core');
writeFileSync('contracts/test/snes-xtrata-adapter-v3-2-3.clar', adapter.split(CORE).join('.xtrata-v3-2-3'));
const core = readFileSync('../live/xtrata-v3.2.3.clar', 'utf8').split("'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait").join('.nft-trait.nft-trait');
writeFileSync('contracts/test/xtrata-v3-2-3.clar', core);

const v1 = readFileSync('../live/xtrata-v1.1.1.clar', 'utf8').split("'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait").join('.nft-trait.nft-trait');
writeFileSync('contracts/test/xtrata-v1-1-1.clar', v1);

const v2 = readFileSync('../live/xtrata-v2.1.0.clar', 'utf8').split("'SP2PABAF9FTAJYNFZH93XENAJ8FVY99RRM50D2JG9.nft-trait.nft-trait").join('.nft-trait.nft-trait');
writeFileSync('contracts/test/xtrata-v2-1-0.clar', v2);
