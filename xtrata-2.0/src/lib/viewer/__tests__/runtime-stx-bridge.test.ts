import { readFileSync } from 'node:fs';
import ts from 'typescript';
import { validateStacksAddress } from '@stacks/transactions';
import { describe, expect, it, vi } from 'vitest';
import { parseRuntimeFee } from '../runtime-fee';
import { isRuntimeWalletBridgeTokenValid, registerRuntimeWalletBridgeToken } from '../runtime-open';

// Exercise the actual App message handler and its parsers without mounting the
// admin dashboard or mocking its many unrelated network-reading components.
const source = ts.createSourceFile(
  'App.tsx',
  readFileSync(new URL('../../../App.tsx', import.meta.url), 'utf8'),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX
);
const declarations = new Map<string, string>();
function collect(node: ts.Node) {
  if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.initializer) {
    declarations.set(
      node.name.text,
      `const ${node.name.text} = ${node.initializer.getText(source)};`
    );
  }
  ts.forEachChild(node, collect);
}
collect(source);
const names = [
  'RUNTIME_WALLET_BRIDGE_REQUEST_TYPE',
  'RUNTIME_WALLET_BRIDGE_RESPONSE_TYPE',
  'RUNTIME_WALLET_READ_METHODS',
  'RUNTIME_WALLET_NETWORK_METHODS',
  'RUNTIME_WALLET_DISCONNECT_METHODS',
  'RUNTIME_WALLET_CONNECT_METHODS',
  'RUNTIME_WALLET_CONTRACT_CALL_METHODS',
  'RUNTIME_WALLET_STX_TRANSFER_METHODS',
  'RUNTIME_STX_MEMO_MAX_BYTES',
  'isOpaqueEmbeddedOrigin',
  'createRuntimeWalletBridgeError',
  'normalizeRuntimeNetwork',
  'normalizeRuntimeUint',
  'parseRuntimeContractIdentifier',
  'validateRuntimePrincipal',
  'parseRuntimeStxTransferRequest',
  'handleRuntimeWalletBridgeRequest'
];
const compiled = ts.transpileModule(
  names
    .map((name) => {
      const declaration = declarations.get(name);
      if (!declaration) throw new Error(`App bridge declaration missing: ${name}`);
      return declaration;
    })
    .join('\n'),
  { compilerOptions: { target: ts.ScriptTarget.ES2022 } }
).outputText;

const ADDRESS = 'SP2MF04VAGYHGAZWGTEDW5VYCPDWWSY08Z1QFNDSN';
const RECIPIENT = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X';
const payment = {
  recipient: RECIPIENT,
  amount: '1000000',
  fee: '3000',
  address: ADDRESS,
  memo: 'TD:WEDNESDAY:1',
  network: 'mainnet'
};
const connected = { isConnected: true, address: ADDRESS, network: 'mainnet' };

function harness(session = connected, connectResult = connected, outcome = 'success') {
  const values = new Map<string, string>();
  const storage = {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => {
      values.set(key, value);
    }
  };
  registerRuntimeWalletBridgeToken(storage, 'review-token');
  const walletAdapter = {
    getSession: vi.fn(() => session),
    connect: vi.fn(async () => connectResult)
  };
  const showStxTransfer = vi.fn((options) => {
    if (outcome === 'cancel') options.onCancel();
    else if (outcome === 'error')
      options.onError(Object.assign(new Error('Provider refused transfer'), { code: -32000 }));
    else options.onFinish({ txId: 'mock-only-no-broadcast' });
  });
  const setWalletSession = vi.fn();
  const globals = {
    walletAdapter,
    showStxTransfer,
    setWalletSession,
    selectedContract: { network: 'mainnet' },
    window: { location: { origin: 'https://xtrata.test' }, sessionStorage: storage },
    parseRuntimeFee,
    validateStacksAddress,
    isRuntimeWalletBridgeTokenValid
  };
  const handler = new Function(
    ...Object.keys(globals),
    `${compiled}\nreturn handleRuntimeWalletBridgeRequest;`
  )(...Object.values(globals));
  const request = (params: unknown = payment, overrides: Record<string, unknown> = {}) =>
    new Promise<any>((resolve) => {
      handler({
        origin: 'https://xtrata.test',
        source: { postMessage: resolve },
        data: {
          type: 'xtrata:wallet:request',
          requestId: 'review-request',
          bridgeToken: 'review-token',
          method: 'stx_transferStx',
          params
        },
        ...overrides
      });
    });
  return { request, walletAdapter, showStxTransfer, setWalletSession };
}

describe('runtime native STX payment bridge', () => {
  it('preserves the payment, memo and separate fee and binds the signer', async () => {
    const h = harness();
    expect(await h.request()).toMatchObject({
      ok: true,
      result: { txId: 'mock-only-no-broadcast' }
    });
    expect(h.showStxTransfer.mock.calls[0][0]).toMatchObject({
      recipient: RECIPIENT,
      amount: '1000000',
      fee: '3000',
      memo: 'TD:WEDNESDAY:1',
      stxAddress: ADDRESS
    });
    expect(h.walletAdapter.connect).not.toHaveBeenCalled();
  });

  it('keeps older requests without a fee, sender or network working', async () => {
    const h = harness();
    expect(await h.request({ recipient: RECIPIENT, amount: '10' })).toMatchObject({ ok: true });
    expect(h.showStxTransfer.mock.calls[0][0]).toMatchObject({
      amount: '10',
      fee: undefined,
      stxAddress: ADDRESS,
      network: 'mainnet'
    });
  });

  it.each(['0', '-1', '1.5', '1000001', 'not-a-fee'])(
    'falls back to wallet estimation for invalid fee %s',
    async (fee) => {
      const h = harness();
      expect(await h.request({ ...payment, fee })).toMatchObject({ ok: true });
      expect(h.showStxTransfer.mock.calls[0][0].fee).toBeUndefined();
    }
  );

  it('connects a disconnected wallet before requesting approval', async () => {
    const h = harness({ ...connected, isConnected: false, address: '' });
    expect(await h.request()).toMatchObject({ ok: true });
    expect(h.walletAdapter.connect).toHaveBeenCalledOnce();
    expect(h.setWalletSession).toHaveBeenCalledWith(connected);
  });

  it('does not open a transfer after connection is cancelled', async () => {
    const disconnected = { ...connected, isConnected: false, address: '' };
    const h = harness(disconnected, disconnected);
    expect(await h.request()).toMatchObject({ ok: false, error: { code: 4001 } });
    expect(h.showStxTransfer).not.toHaveBeenCalled();
  });

  it.each([{ address: RECIPIENT }, { network: 'testnet' }])(
    'rejects a mismatched sender or network: %j',
    async (change) => {
      const h = harness();
      expect(await h.request({ ...payment, ...change })).toMatchObject({
        ok: false,
        error: { code: -32602 }
      });
      expect(h.showStxTransfer).not.toHaveBeenCalled();
    }
  );

  it.each(['cancel', 'error'])('returns wallet %s to the inscription', async (outcome) => {
    const h = harness(connected, connected, outcome);
    expect(await h.request()).toMatchObject({
      ok: false,
      error: { code: outcome === 'cancel' ? 4001 : -32000 }
    });
    expect(h.showStxTransfer).toHaveBeenCalledOnce();
  });

  it('retains the origin gate before wallet access', async () => {
    const h = harness();
    expect(await h.request(payment, { origin: 'https://unrelated.test' })).toMatchObject({
      ok: false,
      error: { code: -32600 }
    });
    expect(h.walletAdapter.getSession).not.toHaveBeenCalled();
    expect(h.showStxTransfer).not.toHaveBeenCalled();
  });

  it('retains the token gate for an opaque iframe', async () => {
    const h = harness();
    expect(
      await h.request(payment, {
        origin: 'null',
        data: {
          type: 'xtrata:wallet:request',
          requestId: 'bad-token',
          bridgeToken: 'invalid',
          method: 'stx_transferStx',
          params: payment
        }
      })
    ).toMatchObject({ ok: false, error: { code: -32600 } });
    expect(h.walletAdapter.getSession).not.toHaveBeenCalled();
    expect(h.showStxTransfer).not.toHaveBeenCalled();
  });
});
