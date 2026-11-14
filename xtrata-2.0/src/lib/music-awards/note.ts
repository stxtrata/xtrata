/**
 * The note the award contract checks before it inscribes a record (contracts/live/xtrata-music-awards-v1.0.clar,
 * `get-note-hash`): sha256 of the consensus bytes of
 *   { chain, class, contract, domain, drop, hero, number, plays, record }
 * signed by the awards signer. The contract recovers the signer from the signature and compares its hash with the
 * one its owner set. Fields are in the contract's (alphabetical) order; the domain is fixed.
 *
 * The test checks this against a note the contract accepted on testnet.
 */
import {
  bufferCV, contractPrincipalCV, createStacksPrivateKey, publicKeyFromSignatureRsv, serializeCV, signMessageHashRsv, standardPrincipalCV,
  stringAsciiCV, tupleCV, uintCV
} from '@stacks/transactions';
import { sha256 } from '@noble/hashes/sha256';
import { ripemd160 } from '@noble/hashes/ripemd160';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';

export const AWARD_DOMAIN = 'xtrata-music-awards-v1';
export const MAINNET_CHAIN_ID = 1;

export interface NoteFields {
  chain: number;
  /** The award contract, `SP….name`. */
  contract: string;
  drop: number;
  cls: number;
  number: number;
  plays: number;
  hero: string;
  /** recordHash(record): 32 bytes. */
  recordHash: Uint8Array;
}

export function noteHash(n: NoteFields): string {
  const [address, name] = n.contract.split('.');
  if (!address || !name || n.recordHash.length !== 32) throw new Error('That note cannot be built.');
  const tuple = tupleCV({
    chain: uintCV(n.chain), class: uintCV(n.cls), contract: contractPrincipalCV(address, name), domain: stringAsciiCV(AWARD_DOMAIN),
    drop: uintCV(n.drop), hero: standardPrincipalCV(n.hero), number: uintCV(n.number), plays: uintCV(n.plays), record: bufferCV(n.recordHash)
  });
  return bytesToHex(sha256(serializeCV(tuple)));
}

/** 65 bytes as hex, r then s then the recovery byte: the form `secp256k1-recover?` takes. */
export function signNote(n: NoteFields, signerKey: string): string {
  return signMessageHashRsv({ messageHash: noteHash(n), privateKey: createStacksPrivateKey(signerKey) }).data;
}

/** hash160 of the key that made this signature over this note: what the contract compares with its signer hash. */
export function noteSignerHash(n: NoteFields, signature: string): string {
  const publicKey = publicKeyFromSignatureRsv(noteHash(n), { type: 9, data: signature } as never);
  return bytesToHex(ripemd160(sha256(hexToBytes(publicKey))));
}
