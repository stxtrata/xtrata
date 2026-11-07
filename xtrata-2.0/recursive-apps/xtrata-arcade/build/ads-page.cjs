// Shared builder for the arcade screen ad-buying page (xtrata-screen-v1), testnet or mainnet. Used by testnet-ads.cjs and mainnet-ads.cjs.
// The page inlines score-client.js (the wallet code the hall uses) with ONE page-only patch: callContract({ contractMaxUstx }) adds a second STX post-condition
// on the CONTRACT as sender, which a refund (cancel / reject) needs under deny mode. The inscribed engine file is not touched; the patch is checked to apply.
const fs = require('fs');
const path = require('path');
function patchScoreClient(src) {
  const defAnchor = '  /* ---------------------------------------------------------- reads */';
  const pcAnchor = "postConditions: [stxPostConditionHex(address, cap.toString())] };";
  const hostAnchor = "    if (s.route === 'host') {\n      r = await bridgeRequest('stx_callContract', {\n        contract: contract,";
  if ([defAnchor, pcAnchor, hostAnchor].some((a) => src.split(a).length !== 2)) throw new Error('score-client.js changed: re-check the contractMaxUstx patch in build/ads-page.cjs');
  const def = `  // PAGE-ONLY PATCH (build/ads-page.cjs): STX post-condition with a CONTRACT principal as the sender (principal type 0x03, name length + name).
  function stxContractPostConditionHex(contractId, amount) {
    var p = String(contractId).split('.'), d = c32decodeAddress(p[0]), name = p[1], nb = '';
    for (var i = 0; i < name.length; i++) nb += name.charCodeAt(i).toString(16).padStart(2, '0');
    return '00' + '03' + d.version.toString(16).padStart(2, '0') + bytesToHex(d.hash160) + name.length.toString(16).padStart(2, '0') + nb +
      CONDITION_LTE.toString(16).padStart(2, '0') + BigInt(amount).toString(16).padStart(16, '0');
  }
`;
  return src.replace(defAnchor, def + defAnchor)
    .replace(pcAnchor, "postConditions: [stxPostConditionHex(address, cap.toString())].concat(input.contractMaxUstx ? [stxContractPostConditionHex(contract, BigInt(String(input.contractMaxUstx)).toString())] : []) };")
    .replace(hostAnchor, "    if (s.route === 'host' && input.contractMaxUstx) throw err('Open this page on xtrata.xyz in its own tab to cancel or refund.');\n" + hostAnchor);
}
function build(o) {
  const main = o.network === 'mainnet';
  const idRe = main ? /^SP[0-9A-Z]{25,41}\.[a-z][a-z0-9-]*$/ : /^ST[0-9A-Z]{25,41}\.[a-z][a-z0-9-]*$/;
  if (!idRe.test(o.screen) || !idRe.test(o.core)) throw new Error('screen and core must be ' + o.network + ' contract ids');
  const scoreClient = patchScoreClient(fs.readFileSync(path.join(__dirname, '..', 'src', 'parts', 'score-client.js'), 'utf8'));
  const T = {
    TITLE: main ? 'Advertise on the Xtrata Arcade screen' : 'Advertise on the arcade screen (TESTNET)',
    BADGE: main ? '' : '<span class="badge">TESTNET</span>',
    INTRO: main
      ? '<p class="mut">Rent a slot on the centre screen of the Xtrata Arcade. Your payment is held in escrow by the contract and earned block by block while the ad runs; if the ad is rejected or you cancel while it is pending, you get everything back. <b>This uses real STX.</b> <a href="/arcade">Back to the arcade</a></p>'
      : '<p class="mut">Rent a slot on the centre screen. Your payment is held in escrow by the contract and earned block by block while the ad runs. Test STX only; nothing here touches mainnet. <a href="/arcade-world-preview/testnet-astro.html">Back to the testnet arcade</a></p>',
    WALLETHELP: main
      ? '<div class="mut" style="font-size:13px">Use Leather or Xverse on <b>Stacks mainnet</b>. A testnet account is refused. Every payment shows its exact amount in your wallet before you sign.</div>'
      : '<div class="mut" style="font-size:13px">Use Leather or Xverse set to <b>Stacks testnet</b>. Test STX: the Hiro testnet faucet. A mainnet account is refused.</div>',
    NETWORK: o.network, EXPLORER: main ? '' : '?chain=testnet',
    OFF: main ? 'paid ads are not open yet. Check back soon.' : 'the admin has to switch them on first (Terminal: run-testnet-v5.command adadmin)',
    API: main ? 'https://api.mainnet.hiro.so' : 'https://api.testnet.hiro.so',
  };
  let page = fs.readFileSync(path.join(__dirname, 'ads-page.template.html'), 'utf8');
  for (const k of Object.keys(T)) page = page.split('@@' + k + '@@').join(T[k]);
  page = page.replace('@@SCORE_CLIENT@@', () => scoreClient.replace(/<\/script/gi, '<\\/script'))
    .replace(/@@SCREEN@@/g, o.screen).replace(/@@CORE@@/g, o.core).replace(/@@ROOT@@/g, o.screen.split('.')[0]);
  if (/@@[A-Z_]+@@/.test(page)) throw new Error('unfilled placeholder: ' + page.match(/@@[A-Z_]+@@/)[0]);
  fs.mkdirSync(path.dirname(o.out), { recursive: true });
  fs.writeFileSync(o.out, page);
  console.log('written', o.out, page.length, 'bytes (' + o.network + ')');
}
module.exports = { build, patchScoreClient };
