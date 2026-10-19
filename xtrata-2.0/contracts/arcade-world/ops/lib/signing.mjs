// Attach a signer to a network transport, but only through the guard.
import { authoriseBroadcast, Refused } from './guard.mjs';
import { die } from './cli.mjs';

export function attachSigner(t, args, expectSender = null) {
  try {
    const auth = authoriseBroadcast({ network: args.network, execute: true, mainnet: !!args.iMeanMainnet, keyFile: args.keyFile });
    if (expectSender && auth.sender !== expectSender) throw new Refused(`the key belongs to ${auth.sender}, not ${expectSender}`);
    t.signer = { key: auth.key, address: auth.sender };
    console.log(`sending as ${auth.sender} on ${auth.network}`);
    return auth;
  } catch (e) { if (e instanceof Refused) die('REFUSED: ' + e.message, 2); throw e; }
}
