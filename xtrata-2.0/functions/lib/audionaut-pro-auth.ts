// Shared membership check for the beta and beta-pro workstations.
import {readCreatorSession} from './creator-auth';
import {findAudionaut, type GateResult} from '../../src/audionaut/core';
import {applyHiroApiKey,getHiroApiKeys,shouldRetryWithNextHiroKey} from './hiro-keys';
import type {Env} from './db';
// Cloudflare ties in-flight I/O to its originating request. Only store completed values.
const cache = new Map<string, { expires: number; lookup: number; result: GateResult }>();
let nextLookup = 0;
const TTL = 60_000, DEADLINE = 15_000;
export const PRO_NO_STORE = { 'Cache-Control': 'private, no-store', 'Vary': 'Cookie' };

export async function checkProMembership(env: Env, address: string, {
  fetchImpl = fetch, now = Date.now(), refresh = false
}: { fetchImpl?: typeof fetch; now?: number; refresh?: boolean } = {}) {
  const cached = cache.get(address);
  if (!refresh && cached && cached.expires > now) return cached.result;

  const lookup = ++nextLookup;
  const controller = new AbortController();
  let timer: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      controller.abort();
      reject(new Error('Ownership verification timed out. Try again.'));
    }, DEADLINE);
  });
  const keyed: typeof fetch = async (input, init) => {
    const keys = getHiroApiKeys(env), candidates = keys.length ? keys : [null];
    for (const [index, key] of candidates.entries()) {
      const headers = new Headers(init?.headers);
      applyHiroApiKey(headers, key);
      const response = await fetchImpl(input, { ...init, headers, signal: controller.signal });
      if (index < candidates.length - 1 && shouldRetryWithNextHiroKey(response.status)) continue;
      return response;
    }
    throw new Error('Ownership service unavailable.');
  };
  try {
    const result = await Promise.race([
      findAudionaut(address, { hiroBase: 'https://api.hiro.so', fetchImpl: keyed,
        signal: controller.signal, maxHeld: 1000, concurrency: 4 }),
      timeout
    ]);
    if (!result.holds && result.truncated) {
      throw new Error('Could not verify the complete holding list. Try again or use a wallet with fewer unrelated inscriptions.');
    }
    // A slower check must respect an ownership change observed by a later check.
    const latest = cache.get(address);
    if (latest && latest.lookup > lookup) return latest.result;
    cache.set(address, { expires: now + TTL, lookup, result });
    while (cache.size > 256) cache.delete(cache.keys().next().value!);
    return result;
  } finally {
    clearTimeout(timer!);
  }
}
export async function authorizePro(request:Request,env:Env){
  const {session,ok}=await readCreatorSession(request,env);
  if(!ok)return {allowed:false,status:503,error:'Xtrata sign-in is temporarily unavailable.'};
  if(!session)return {allowed:false,status:401,error:'Sign in with Xtrata to open AudioNaut Pro.'};
  try{
    const membership=await checkProMembership(env,session.address);
    return membership.holds?{allowed:true,status:200,address:session.address,tokenId:membership.tokenId,expiresAt:session.expiresAt}:{allowed:false,status:403,address:session.address,error:'This wallet does not currently hold an Audionaut.'};
  }catch(error){return {allowed:false,status:503,address:session.address,error:error instanceof Error?error.message:'Ownership verification unavailable.'};}
}
export function clearProMembershipCache(){cache.clear();}
