import { GAME_SAVE_METHODS, type SaveReview } from './game-save';
import { validateStacksAddress } from '@stacks/transactions';
import type { WalletAdapter, WalletSession } from '../wallet/types';
import type { showStxTransfer } from '../wallet/connect';
import { parseRuntimeFee } from './runtime-fee';
type WalletStxTransferOptions = Parameters<typeof showStxTransfer>[0];

type Payment = {
  recipient: string;
  amount: string;
  memo: string;
  fee?: string;
  address?: string;
  network: 'mainnet' | 'testnet';
};
export type WalletReview =
  SaveReview | { kind: 'connect'; label: string } | ({ kind: 'transfer'; label: string } & Payment);
type Options = {
  host: Window;
  wallet: WalletAdapter;
  review: (request: WalletReview) => Promise<boolean>;
  transfer: (request: WalletStxTransferOptions) => void;
  sessionChanged: (session: WalletSession) => void;
  gameSave?: (
    method: string,
    params: unknown,
    session: WalletSession,
    label: string,
    guard: () => void
  ) => Promise<unknown>;
  isBusy?: () => boolean;
  pendingChanged?: (pending: boolean) => void;
};
const failure = (message: string, code = -32602) => Object.assign(new Error(message), { code });
const connects = new Set([
  'stx_requestAccounts',
  'requestAccounts',
  'stx_connect',
  'connect',
  'wallet_connect'
]);
const reads = new Set([
  'stx_getAddresses',
  'getAddresses',
  'stx_getAccounts',
  'getAccounts',
  'wallet_getAccount'
]);
const transfers = new Set([
  'stx_transferStx',
  'stx_transferSTX',
  'stx_transfer',
  'stx_sendTransfer',
  'sendTransfer',
  'transferStx',
  'openSTXTransfer'
]);
const networkFor = (address: string): 'mainnet' | 'testnet' =>
  address.startsWith('SP') || address.startsWith('SM') ? 'mainnet' : 'testnet';

export function parsePublicPayment(params: unknown, session: WalletSession): Payment {
  const value = Array.isArray(params) ? params[0] : params;
  if (!value || typeof value !== 'object') throw failure('STX transfer parameters are required.');
  const p = value as Record<string, unknown>;
  const recipient = String(p.recipient ?? p.to ?? '').trim();
  if (!validateStacksAddress(recipient))
    throw failure('A valid STX recipient address is required.');
  const rawAmount = p.amount ?? p.amountUstx ?? p.microstx;
  if (typeof rawAmount === 'number' && !Number.isSafeInteger(rawAmount))
    throw failure('Invalid STX amount.');
  const amount = String(rawAmount ?? '').trim();
  if (!/^\d{1,20}$/.test(amount) || BigInt(amount) <= 0n || BigInt(amount) > 18446744073709551615n)
    throw failure('Invalid STX amount.');
  const memo = String(p.memo ?? '')
    .replace(/\u0000/g, '')
    .trim();
  if (new TextEncoder().encode(memo).length > 34)
    throw failure('The transfer memo exceeds 34 bytes.');
  const network =
    p.network ?? session.network ?? (session.address ? networkFor(session.address) : undefined);
  if (network !== 'mainnet' && network !== 'testnet') throw failure('Choose mainnet or testnet.');
  if (networkFor(recipient) !== network)
    throw failure('Recipient and payment network do not match.');
  const address = p.address === undefined ? undefined : String(p.address).trim();
  if (address !== undefined && !validateStacksAddress(address))
    throw failure('Invalid requested signing address.');
  return {
    recipient,
    amount: BigInt(amount).toString(),
    memo,
    fee: parseRuntimeFee(p.fee),
    address,
    network
  };
}

function checkedSession(session: WalletSession, payment?: Payment) {
  if (!session.isConnected || !session.address || !validateStacksAddress(session.address))
    throw failure('Connect your wallet before continuing.', 4001);
  const network = networkFor(session.address);
  if (
    (session.network && session.network !== network) ||
    (payment &&
      (payment.network !== network || (payment.address && payment.address !== session.address)))
  ) {
    throw failure('Wallet account or network changed. Reconnect and review the request again.');
  }
  return { ...session, address: session.address, network };
}

/** A bridge for explicitly registered interactive previews, never arbitrary child windows. */
export function installPublicWalletBridge(options: Options) {
  type Grant = {
    token: string;
    expires: number;
    origin: string;
    authorized: boolean;
    seen: Set<string>;
  };
  type Entry = { frame: HTMLIFrameElement; label: string; grant?: Grant; reset: () => void };
  const entries = new Set<Entry>();
  let busy = false;
  const usable = (entry: Entry) =>
    entry.frame.isConnected &&
    entry.frame.getClientRects().length > 0 &&
    !entry.frame.closest('[hidden], [inert]') &&
    options.host.getComputedStyle(entry.frame).visibility !== 'hidden';
  const prune = () => {
    for (const entry of entries)
      if (!entry.frame.isConnected) {
        entry.frame.removeEventListener('load', entry.reset);
        entries.delete(entry);
      }
  };
  const onMessage = (event: MessageEvent) => {
    const p = event.data;
    if (
      !p ||
      typeof p !== 'object' ||
      !['xtrata:wallet:hello', 'xtrata:wallet:request'].includes(p.type)
    )
      return;
    prune();
    const entry = Array.from(entries).find(
      (item) => item.frame.contentWindow === event.source && usable(item)
    );
    if (!entry || !['null', options.host.location.origin].includes(event.origin)) return;
    const send = (data: unknown) =>
      (event.source as Window).postMessage(data, event.origin === 'null' ? '*' : event.origin);
    if (p.type === 'xtrata:wallet:hello') {
      if (typeof p.nonce !== 'string' || !p.nonce || p.nonce.length > 128) return;
      // A new handshake rotates the token but preserves explicit consent only for
      // this still-loaded document. Navigation/load resets the grant entirely.
      entry.grant = {
        token: options.host.crypto.randomUUID(),
        expires: Date.now() + 10 * 60_000,
        origin: event.origin,
        authorized: entry.grant?.authorized ?? false,
        seen: new Set()
      };
      send({ type: 'xtrata:wallet:hello-ack', nonce: p.nonce, bridgeToken: entry.grant.token });
      return;
    }
    const requestId = typeof p.requestId === 'string' ? p.requestId : '';
    if (!requestId || requestId.length > 128) return;
    const respond = (ok: boolean, value: unknown) =>
      send({
        type: 'xtrata:wallet:response',
        requestId,
        ok,
        ...(ok ? { result: value } : { error: value })
      });
    const grant = entry.grant;
    const alive = () =>
      usable(entry) &&
      entry.grant === grant &&
      grant &&
      grant.origin === event.origin &&
      grant.expires > Date.now();
    if (!alive() || p.bridgeToken !== grant?.token) {
      respond(false, { message: 'Reconnect this preview to the wallet.', code: -32600 });
      return;
    }
    if (grant!.seen.has(requestId) || grant!.seen.size >= 128) {
      respond(false, { message: 'Repeated request refused. Reconnect the preview.', code: -32600 });
      return;
    }
    grant!.seen.add(requestId);
    const method = p.method;
    const run = async () => {
      if (reads.has(method) || method === 'stx_getNetwork' || method === 'getNetwork') {
        if (!grant!.authorized)
          throw failure('Connect this preview before reading the wallet.', 4100);
        const session = checkedSession(options.wallet.getSession());
        return {
          address: session.address,
          addresses: [session.address],
          accounts: [session.address],
          network: session.network
        };
      }
      if (
        !connects.has(method) &&
        !transfers.has(method) &&
        !(GAME_SAVE_METHODS.has(method) && options.gameSave)
      )
        throw failure(
          'This public viewer supports wallet connection and native STX payments only.',
          -32601
        );
      if (busy || options.isBusy?.())
        throw failure('Another wallet operation is in progress.', -32002);
      busy = true;
      const started = Date.now();
      try {
        options.pendingChanged?.(true);
        if (connects.has(method)) {
          if (!(await options.review({ kind: 'connect', label: entry.label })))
            throw failure('Wallet connection cancelled.', 4001);
          if (!alive()) throw failure('The preview changed. Connect again.', 4001);
          const session = checkedSession(await options.wallet.connect());
          options.sessionChanged(session);
          if (!alive()) throw failure('The preview changed. Connect again.', 4001);
          grant!.authorized = true;
          return {
            address: session.address,
            addresses: [session.address],
            accounts: [session.address],
            network: session.network
          };
        }
        if (!grant!.authorized)
          throw failure('Connect this preview before requesting a payment.', 4100);
        if (GAME_SAVE_METHODS.has(method) && options.gameSave) {
          const initial = checkedSession(options.wallet.getSession());
          const guard = () => {
            if (!alive()) throw failure('The preview changed. Reconnect and review again.', 4001);
            checkedSession(options.wallet.getSession(), {
              address: initial.address,
              network: initial.network
            } as Payment);
          };
          return await options.gameSave(method, p.params, initial, entry.label, guard);
        }
        const payment = parsePublicPayment(p.params, options.wallet.getSession());
        const initial = checkedSession(options.wallet.getSession(), payment);
        if (
          !(await options.review({
            kind: 'transfer',
            label: entry.label,
            ...payment,
            address: initial.address
          }))
        )
          throw failure('Payment cancelled.', 4001);
        if (!alive()) throw failure('The preview changed. Review the payment again.', 4001);
        const current = checkedSession(options.wallet.getSession(), {
          ...payment,
          address: initial.address
        });
        return await new Promise((resolve, reject) => {
          // Unknown outcomes are deliberately not marked as a definite cancellation.
          // The game keeps its pending marker and asks the player to check history.
          const timer = options.host.setTimeout(
            () =>
              reject(failure('No wallet response. Check wallet history before retrying.', -32002)),
            Math.max(1_000, Math.min(90_000, 110_000 - (Date.now() - started)))
          );
          const finish = (fn: (value: any) => void, value: unknown) => {
            options.host.clearTimeout(timer);
            fn(value);
          };
          try {
            options.transfer({
              ...payment,
              stxAddress: current.address,
              onFinish: (result) => finish(resolve, result),
              onCancel: () => finish(reject, failure('Payment cancelled.', 4001)),
              onError: (error) => finish(reject, error)
            });
          } catch (error) {
            finish(reject, error);
          }
        });
      } finally {
        busy = false;
        options.pendingChanged?.(false);
      }
    };
    void run().then(
      (result) => respond(true, result),
      (error) =>
        respond(false, {
          message: error instanceof Error ? error.message : String(error),
          code: typeof error?.code === 'number' ? error.code : -32603
        })
    );
  };
  options.host.addEventListener('message', onMessage);
  return {
    register(frame: HTMLIFrameElement, label: string) {
      prune();
      const entry: Entry = {
        frame,
        label: label.slice(0, 200),
        reset: () => {
          entry.grant = undefined;
        }
      };
      frame.addEventListener('load', entry.reset);
      entries.add(entry);
    },
    dispose() {
      options.host.removeEventListener('message', onMessage);
      for (const entry of entries) entry.frame.removeEventListener('load', entry.reset);
      entries.clear();
    }
  };
}

const stx = (value: string) => {
  const n = BigInt(value);
  return `${n / 1_000_000n}.${(n % 1_000_000n).toString().padStart(6, '0')}`;
};

/** Host-owned review; no inscription HTML is inserted into this dialog. */
export function reviewPublicWalletRequest(request: WalletReview): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.setAttribute('aria-label', 'Xtrata wallet request');
    dialog.style.cssText =
      'max-width:540px;width:calc(100% - 32px);box-sizing:border-box;padding:24px;border:1px solid #666;border-radius:16px;background:#17191f;color:#f5f5f5;font:16px/1.5 system-ui;overflow-wrap:anywhere';
    const title = document.createElement('h2');
    title.textContent =
      request.kind === 'connect'
        ? 'Connect this preview to your wallet?'
        : request.kind === 'save'
          ? 'Publish this game checkpoint?'
          : 'Review preview payment';
    const text = document.createElement('p');
    text.style.whiteSpace = 'pre-line';
    text.textContent =
      request.kind === 'connect'
        ? `${request.label}\nShare your selected wallet address with this preview. Payments still require a separate approval.`
        : request.kind === 'save'
          ? `${request.label}\nFrom: ${request.address}\nNetwork: mainnet\nSave: ${request.bytes.toLocaleString()} bytes\nProtocol fee: ${stx(request.protocolFee)} STX, plus the wallet’s network fee\nContract: ${request.contract}\n\nYour progress, journal and linked notes will be public and permanent. The save will reference Timeloop Detective #3040. Check the wallet’s final fee before signing.`
          : `${request.label}\nNetwork: ${request.network}\nFrom: ${request.address}\nTo: ${request.recipient}\nAmount: ${stx(request.amount)} STX\nRequested fee: ${request.fee ? `${stx(request.fee)} STX` : 'wallet estimate'}\nMemo: ${request.memo || '(none)'}\n\nCheck the wallet’s final amount and fee before signing.`;
    const cancel = document.createElement('button');
    cancel.textContent = 'Cancel';
    const approve = document.createElement('button');
    approve.textContent = request.kind === 'connect' ? 'Choose wallet' : 'Continue to wallet';
    for (const button of [cancel, approve])
      button.style.cssText =
        'font:inherit;padding:10px 16px;margin:8px 8px 0 0;border-radius:8px;cursor:pointer';
    let settled = false;
    const finish = (allowed: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      dialog.close();
      dialog.remove();
      resolve(allowed);
    };
    // Stay inside the game's 120-second response window before wallet approval.
    const timer = setTimeout(() => finish(false), 60_000);
    cancel.onclick = () => finish(false);
    approve.onclick = () => finish(true);
    dialog.addEventListener('cancel', (event) => {
      event.preventDefault();
      finish(false);
    });
    dialog.append(title, text);
    if (request.kind === 'save') {
      const details = document.createElement('details');
      const summary = document.createElement('summary');
      summary.textContent = 'Review save JSON';
      const pre = document.createElement('pre');
      pre.textContent = request.json;
      pre.style.cssText = 'white-space:pre-wrap;max-height:180px;overflow:auto;font-size:12px';
      details.append(summary, pre);
      dialog.append(details);
    }
    dialog.append(cancel, approve);
    document.body.append(dialog);
    dialog.showModal();
    cancel.focus();
  });
}
