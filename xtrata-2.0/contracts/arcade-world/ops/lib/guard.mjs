// The only gate between these tools and a real network. Nothing in the tools signs or broadcasts without passing it.
// Default for every command is a dry run. A real send needs ALL of:
//   1. --execute on the command line
//   2. XA_OPS_CONFIRM=broadcast-<network> in the environment
//   3. a key file (XA_OPS_KEY_FILE or --key-file) holding a disposable key; on testnet it must NOT be the admin wallet's key
//   4. mainnet only: --i-mean-mainnet as well
//   5. no KILL file (ops/KILL, or the path in XA_OPS_KILL)
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { c32addressDecode } from 'c32check';
import { privateKeyToAddress } from '@stacks/transactions';

export const ADMIN_WALLET = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const here = dirname(fileURLToPath(import.meta.url));
export const DEFAULT_KILL = join(here, '..', 'KILL');

export class Refused extends Error { constructor(msg) { super(msg); this.name = 'Refused'; } }

export function killFile(env = process.env) { return env.XA_OPS_KILL || DEFAULT_KILL; }
export function killed(env = process.env) { return existsSync(killFile(env)); }

// Same hash160 on any network means the same key.
function hash160(addr) { return c32addressDecode(addr)[1]; }
export function sameKey(addrA, addrB) { try { return hash160(addrA) === hash160(addrB); } catch { return false; } }

export function readKey(path) {
  if (!path || !existsSync(path)) throw new Refused(`key file not found: ${path || '(none given)'}`);
  const k = readFileSync(path, 'utf8').trim();
  if (!/^[0-9a-fA-F]{64}(01)?$/.test(k)) throw new Refused('key file must hold one hex private key (64 hex characters, optional 01 suffix) and nothing else');
  return k;
}

// Throws Refused unless a real send is allowed. Returns { network, key, sender } when it is.
export function authoriseBroadcast({ network, execute = false, mainnet = false, keyFile = null, env = process.env }) {
  if (network !== 'testnet' && network !== 'mainnet') throw new Refused(`network must be testnet or mainnet (got ${network})`);
  if (!execute) throw new Refused('dry run: pass --execute to send for real');
  if (killed(env)) throw new Refused(`kill switch is on (${killFile(env)} exists); remove it to continue`);
  if (env.XA_OPS_CONFIRM !== `broadcast-${network}`) throw new Refused(`set XA_OPS_CONFIRM=broadcast-${network} to confirm you mean it`);
  if (network === 'mainnet' && !mainnet) throw new Refused('mainnet also needs --i-mean-mainnet');
  const key = readKey(keyFile || env.XA_OPS_KEY_FILE);
  const sender = privateKeyToAddress(key, network);
  if (network === 'testnet' && sameKey(sender, ADMIN_WALLET)) throw new Refused('this key is the mainnet admin wallet; use a disposable testnet key');
  return { network, key, sender };
}
