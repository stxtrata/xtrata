/**
 * Parent-side wallet bridge client.
 *
 * Runs on the main Xtrata site. Owns the wallet iframe and speaks the protocol
 * to it. Holds no key material and has no way to obtain any — see protocol.ts.
 */

import {
  BRIDGE_PROTOCOL,
  type BridgeRequest,
  type WalletMethod,
  isBridgeResponse,
  newRequestId
} from './protocol';

export class BridgeClientError extends Error {
  constructor(
    readonly code: 'TIMEOUT' | 'NO_FRAME' | 'BAD_ORIGIN' | 'WALLET_ERROR' | 'CLOSED',
    message: string
  ) {
    super(message);
    this.name = 'BridgeClientError';
  }
}

export interface BridgeClientOptions {
  /**
   * Exact origin of the wallet iframe, e.g. `https://wallet.xtrata.xyz`.
   * Must be a real, distinct hostname: a same-origin path gives no isolation.
   */
  walletOrigin: string;
  frame: HTMLIFrameElement;
  /** Per-request timeout. Generous by default — a request may await a Face ID prompt. */
  timeoutMs?: number;
  /** Injectable for tests. */
  listenTarget?: Pick<Window, 'addEventListener' | 'removeEventListener'>;
}

interface Pending {
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

const DEFAULT_TIMEOUT_MS = 120_000;

export class WalletBridgeClient {
  private readonly pending = new Map<string, Pending>();
  private readonly listenTarget: Pick<Window, 'addEventListener' | 'removeEventListener'>;
  private closed = false;

  constructor(private readonly options: BridgeClientOptions) {
    this.listenTarget = options.listenTarget ?? window;
    this.listenTarget.addEventListener('message', this.onMessage as EventListener);
  }

  /**
   * Validate and route an incoming message.
   *
   * Three checks, all required:
   *  1. `event.origin` matches the wallet origin exactly — no prefix or suffix
   *     matching, since `https://wallet.xtrata.xyz.evil.com` would pass those.
   *  2. `event.source` is our iframe's window — origin alone is not enough, as
   *     any frame from that origin could otherwise answer.
   *  3. The id matches a request we actually sent, so an unsolicited or replayed
   *     response is dropped rather than resolving a stale caller.
   */
  private onMessage = (event: MessageEvent): void => {
    if (event.origin !== this.options.walletOrigin) return;
    if (event.source !== this.options.frame.contentWindow) return;
    if (!isBridgeResponse(event.data)) return;

    const pending = this.pending.get(event.data.id);
    if (!pending) return; // unknown or already-settled id

    this.pending.delete(event.data.id);
    clearTimeout(pending.timer);

    if (event.data.ok) {
      pending.resolve(event.data.result);
    } else {
      const err = event.data.error;
      pending.reject(
        new BridgeClientError('WALLET_ERROR', err?.message ?? 'The wallet rejected the request.')
      );
    }
  };

  /** Send a request and await its reply. */
  request<T = unknown>(method: WalletMethod, params?: unknown): Promise<T> {
    if (this.closed) {
      return Promise.reject(new BridgeClientError('CLOSED', 'Bridge client is closed.'));
    }

    const target = this.options.frame.contentWindow;
    if (!target) {
      return Promise.reject(
        new BridgeClientError('NO_FRAME', 'Wallet iframe has no content window (not loaded?).')
      );
    }

    const id = newRequestId();
    const message: BridgeRequest = { protocol: BRIDGE_PROTOCOL, kind: 'request', id, method, params };

    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(
          new BridgeClientError(
            'TIMEOUT',
            `Wallet did not answer "${method}" within ${this.options.timeoutMs ?? DEFAULT_TIMEOUT_MS}ms.`
          )
        );
      }, this.options.timeoutMs ?? DEFAULT_TIMEOUT_MS);

      this.pending.set(id, { resolve: resolve as (v: unknown) => void, reject, timer });

      // targetOrigin is the wallet origin, NEVER '*'. With '*' the message is
      // delivered to whatever occupies the frame — including a hostile page
      // after a redirect — which would hand our request to an attacker.
      target.postMessage(message, this.options.walletOrigin);
    });
  }

  /** Drop the listener and fail everything outstanding. */
  close(): void {
    this.closed = true;
    this.listenTarget.removeEventListener('message', this.onMessage as EventListener);
    for (const [, pending] of this.pending) {
      clearTimeout(pending.timer);
      pending.reject(new BridgeClientError('CLOSED', 'Bridge client closed before the reply arrived.'));
    }
    this.pending.clear();
  }

  /** Outstanding request count. Test/diagnostic aid. */
  get pendingCount(): number {
    return this.pending.size;
  }
}
