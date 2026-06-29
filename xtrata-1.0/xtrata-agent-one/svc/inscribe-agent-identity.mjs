#!/usr/bin/env node
/**
 * ONE-TIME: inscribe Agent One's identity NFT (its parent image) into the agent's
 * MAIN wallet. The token then stays there forever — receipts reference its id as an
 * existence-only DEPENDENCY (no transfers, no custody risk). Run once, then start
 * the server with AGENT_IDENTITY_ID=<printed id>.
 *
 *   Dry run (no spend, shows the fee):
 *     WALLET_MNEMONIC="...agent main wallet..." node svc/inscribe-agent-identity.mjs
 *   Inscribe (broadcasts):
 *     WALLET_MNEMONIC="..." DRY_RUN=0 node svc/inscribe-agent-identity.mjs
 *
 * Env: WALLET_MNEMONIC (agent main wallet)  AGENT_SVG(=../agent1-identity/agent1-parent.svg)
 *      AGENT_IDENTITY_URI(=xtrata:agent/one)  XTRATA_CORE(=xtrata-v3-2-3)
 *      XTRATA_NETWORK(=mainnet)  HIRO_API_KEY  DRY_RUN(=1)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { quote, deriveFrom, netOf, DEPLOYER, mintFile, CHUNK } from './core.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MN = process.env.WALLET_MNEMONIC;
const SVG = process.env.AGENT_SVG || path.resolve(__dirname, '../agent1-identity/agent1-parent.svg');
const URI = process.env.AGENT_IDENTITY_URI || 'xtrata:agent/one';
const coreName = process.env.XTRATA_CORE || 'xtrata-v3-2-3';
const net = (process.env.XTRATA_NETWORK || 'mainnet').toLowerCase();
const HIRO = process.env.HIRO_API_KEY || '';
const DRY = process.env.DRY_RUN !== '0';
const log = (o) => console.log(JSON.stringify(o));
if (!MN) { console.error('Set WALLET_MNEMONIC (the agent main wallet)'); process.exit(2); }

const data = new Uint8Array(fs.readFileSync(SVG));
const chunks = Math.ceil(data.length / CHUNK);
if (chunks > 32) { console.error(`SVG is ${chunks} chunks (> 32) — too big for single-tx; use the staged runway.`); process.exit(2); }
const network = netOf(net);
const core = [DEPLOYER, coreName];
const { key, address } = deriveFrom(MN, net);
const q = await quote(core, network, data.length, chunks);
log({ event: 'plan', wallet: address, file: SVG, bytes: data.length, chunks, mime: 'image/svg+xml', uri: URI, protocolFeeUstx: q.protocolFee.toString(), single: q.single });
if (DRY) { log({ event: 'dry-run', note: 'Set DRY_RUN=0 to inscribe. The token mints to your wallet and stays there.' }); process.exit(0); }

const r = await mintFile({ core, network, key, fromAddr: address, hiroKey: HIRO, data, mime: 'image/svg+xml', uri: URI, deps: [], spendCap: q.protocolFee });
log({ event: 'inscribed', tokenId: r.tokenId, txid: r.txid, minerFeeUstx: r.minerFee.toString(),
  next: `Start the server with AGENT_IDENTITY_ID=${r.tokenId} — every receipt will reference it.`,
  explorer: `https://explorer.hiro.so/txid/${r.txid}` });
