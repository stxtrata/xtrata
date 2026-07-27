import { describe, expect, it } from 'vitest';
import { cvToString, deserializeTransaction } from '@stacks/transactions';
import type { TokenTransferPayload } from '@stacks/transactions';
import {
  RETURN_FEE_MICRO_STX,
  SessionReturnError,
  assertWithinCap,
  buildPreSignedReturn,
  isReturnStale
} from '../session-return';

// Standard BIP39 test vector account — public, worthless, never funded.
const SENDER_KEY = '2f9f6a682e218463526a145535b6e3c8d2a12885fb658fbb318bc8fc0c8d400501';
const SENDER = 'SP1JAHE8GEHB0MCBGR8J6W0AA7TJEE1XKFTFJMQ5W';
const DEPOSITOR = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';

const req = (over: Partial<Parameters<typeof buildPreSignedReturn>[0]> = {}) => ({
  senderKey: SENDER_KEY,
  senderAddress: SENDER,
  recipient: DEPOSITOR,
  balanceMicroStx: 1_000_000n,
  nonce: 0n,
  ...over
});

describe('session wallet pre-signed return', () => {
  describe('buildPreSignedReturn', () => {
    it('returns the whole balance less the fee', async () => {
      const out = await buildPreSignedReturn(req({ balanceMicroStx: 1_000_000n }));
      expect(out.amountMicroStx).toBe(1_000_000n - RETURN_FEE_MICRO_STX);
      expect(out.recipient).toBe(DEPOSITOR);
    });

    it('produces a transaction that deserializes and is signed', async () => {
      const out = await buildPreSignedReturn(req());
      const tx = deserializeTransaction(out.txHex);
      expect(tx.auth.spendingCondition?.signer).toBeTruthy();
      expect(tx.auth.spendingCondition?.nonce).toBe(0n);
      expect(tx.auth.spendingCondition?.fee).toBe(RETURN_FEE_MICRO_STX);
    });

    // The safety property that makes handing this to a server acceptable: it can
    // only ever move funds to the depositor, so a compromised server cannot steal.
    it('pins the recipient and amount into the signed transaction', async () => {
      const out = await buildPreSignedReturn(req());
      const payload = deserializeTransaction(out.txHex).payload as TokenTransferPayload;
      expect(cvToString(payload.recipient)).toBe(DEPOSITOR);
      expect(payload.amount).toBe(1_000_000n - RETURN_FEE_MICRO_STX);
    });

    it('honours an explicit nonce', async () => {
      const out = await buildPreSignedReturn(req({ nonce: 7n }));
      expect(out.nonce).toBe(7n);
      expect(deserializeTransaction(out.txHex).auth.spendingCondition?.nonce).toBe(7n);
    });

    it('accepts a custom fee', async () => {
      const out = await buildPreSignedReturn(req({ feeMicroStx: 5000n }));
      expect(out.amountMicroStx).toBe(1_000_000n - 5000n);
    });

    it('accepts testnet addresses', async () => {
      const out = await buildPreSignedReturn(
        req({ recipient: 'ST1JAHE8GEHB0MCBGR8J6W0AA7TJEE1XKFSD2Q80H', network: 'testnet' })
      );
      expect(out.recipient).toBe('ST1JAHE8GEHB0MCBGR8J6W0AA7TJEE1XKFSD2Q80H');
    });

    it('rejects a malformed recipient', async () => {
      await expect(buildPreSignedReturn(req({ recipient: 'not-an-address' }))).rejects.toMatchObject({
        code: 'BAD_RECIPIENT'
      });
    });

    // Crockford base32 excludes I, L, O and U — a typo'd address must not sign.
    it('rejects an address with excluded characters', async () => {
      await expect(
        buildPreSignedReturn(req({ recipient: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX74IO' }))
      ).rejects.toThrow(SessionReturnError);
    });

    it('rejects returning to the session wallet itself', async () => {
      await expect(buildPreSignedReturn(req({ recipient: SENDER }))).rejects.toMatchObject({
        code: 'SELF_RETURN'
      });
    });

    it('rejects a balance that cannot cover the fee', async () => {
      await expect(buildPreSignedReturn(req({ balanceMicroStx: 100n }))).rejects.toMatchObject({
        code: 'DUST'
      });
      await expect(
        buildPreSignedReturn(req({ balanceMicroStx: RETURN_FEE_MICRO_STX }))
      ).rejects.toMatchObject({ code: 'DUST' });
    });

    it('rejects a zero balance', async () => {
      await expect(buildPreSignedReturn(req({ balanceMicroStx: 0n }))).rejects.toMatchObject({
        code: 'DUST'
      });
    });
  });

  describe('assertWithinCap', () => {
    it('permits a balance at or under the cap', () => {
      expect(() => assertWithinCap(9_000_000n, 10_000_000n)).not.toThrow();
      expect(() => assertWithinCap(10_000_000n, 10_000_000n)).not.toThrow();
    });

    it('flags an over-cap balance for immediate return', () => {
      expect(() => assertWithinCap(10_000_001n, 10_000_000n)).toThrow(SessionReturnError);
    });
  });

  describe('isReturnStale', () => {
    // A signed transaction pins its nonce, so once the wallet transacts the held
    // copy is dead and the browser must sign a replacement while it still can.
    it('is fresh while the nonce has not moved', () => {
      const held = { txHex: '', amountMicroStx: 1n, nonce: 3n, recipient: DEPOSITOR };
      expect(isReturnStale(held, 3n)).toBe(false);
    });

    it('is stale once the wallet has passed the pinned nonce', () => {
      const held = { txHex: '', amountMicroStx: 1n, nonce: 3n, recipient: DEPOSITOR };
      expect(isReturnStale(held, 4n)).toBe(true);
    });
  });
});
