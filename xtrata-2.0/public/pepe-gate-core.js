/* Pepe gate — pure logic shared by the browser viewer and the node test.
 * Classic UMD script: works via <script src> (incl. file://) and Node require. */
(function (factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') window.PepeGate = api;
})(function () {
  'use strict';

  // Mainnet Stacks addresses: single-sig SP…, multisig SM…, Crockford base32
  // (no I/L/O/U). Testnet (ST…/SN…) and BTC (bc1…/1…/3…) are intentionally excluded.
  var STX_MAINNET_RE = /^S[PM][0-9A-HJKMNP-TV-Z]{37,40}$/;

  // Recursively pull the first mainnet Stacks address out of any wallet-connect
  // response shape (Leather getAddresses, Xverse stx_getAccounts, legacy auth…).
  function extractStxAddress(payload, depth) {
    depth = depth || 0;
    if (depth > 10 || payload == null) return null;

    if (typeof payload === 'string') {
      var t = payload.trim();
      return STX_MAINNET_RE.test(t) ? t : null;
    }
    if (Array.isArray(payload)) {
      for (var i = 0; i < payload.length; i++) {
        var f = extractStxAddress(payload[i], depth + 1);
        if (f) return f;
      }
      return null;
    }
    if (typeof payload === 'object') {
      // Prefer an entry explicitly tagged as the STX address.
      var sym = String(payload.symbol || payload.purpose || '').toUpperCase();
      if (sym === 'STX' && typeof payload.address === 'string') {
        var a = payload.address.trim();
        if (STX_MAINNET_RE.test(a)) return a;
      }
      for (var k in payload) {
        if (!Object.prototype.hasOwnProperty.call(payload, k)) continue;
        var found = extractStxAddress(payload[k], depth + 1);
        if (found) return found;
      }
    }
    return null;
  }

  // Turn a Hiro /extended/v1/tokens/nft/holdings response into a gate decision.
  function evaluateHoldings(hiroJson) {
    var total = 0;
    if (hiroJson && typeof hiroJson.total === 'number') total = hiroJson.total;
    else if (hiroJson && Array.isArray(hiroJson.results)) total = hiroJson.results.length;
    return { holds: total > 0, count: total };
  }

  return {
    STX_MAINNET_RE: STX_MAINNET_RE,
    extractStxAddress: extractStxAddress,
    evaluateHoldings: evaluateHoldings,
  };
});
