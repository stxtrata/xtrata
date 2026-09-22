/**
 * Free playback must still work when a local support wallet cannot be opened
 * safely.  This deliberately exposes no signing path or stored address.
 */
export function unavailableWallet(error) {
  const detail = String(error?.message || error || 'The local support wallet is unavailable.').slice(0, 240);
  const message = `Music Support is unavailable on this computer. Free listening remains available. ${detail}`;
  return {
    unavailable: true,
    stopEpoch: 0,
    running: false,
    message,
    stop() {
      this.stopEpoch += 1;
    },
    async setup() {
      throw Error(message);
    },
    async status() {
      return {
        address: null,
        balanceMicroSTX: null,
        overLimit: false,
        running: false,
        stopped: true,
        recovery: message,
        message,
        spendCeilingMicroSTX: 0,
        entries: [],
        returns: [],
        returnQuote: null,
      };
    },
    async optional(_name, fallback) {
      return fallback;
    },
    async journal() {
      return [];
    },
    async exclusive() {
      throw Error(message);
    },
    async json() {
      throw Error(message);
    },
    async returnAccount() {
      throw Error(message);
    },
    async reconcile() {
      throw Error(message);
    },
    async reconcileReturns() {
      throw Error(message);
    },
    async run() {
      throw Error(message);
    },
    async prepareReturn() {
      throw Error(message);
    },
    async confirmReturn() {
      throw Error(message);
    },
    async cancelReturn() {
      throw Error(message);
    },
  };
}
