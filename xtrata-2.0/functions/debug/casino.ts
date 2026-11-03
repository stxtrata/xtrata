/**
 * Casino payouts dashboard.  GET /debug/casino
 *
 * Plain-language view of the casino round log (functions/migrations/033_casino_events.sql): how much LAYR went through each
 * machine, how much came back, the actual return beside the design figure, LAYR purchases, the biggest wins and the
 * jackpots. It fetches /debug/casino-data and renders it. Self-contained: no external assets.
 *
 * Sign in once at /debug (the dashboard cookie covers everything under /debug), then open /debug/casino.
 *
 * NOTE for maintainers: the page markup below contains NO backticks, NO dollar-brace sequences and NO backslashes,
 * because it lives inside a template literal (see the matching note and the parse test for /debug).
 */
import { configuredDebugKey, hasDebugAccess } from '../lib/debug-auth';

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Xtrata · Casino payouts</title>
<style>
  :root{
    color-scheme: light;
    --plane:#f9f9f7; --surface:#fcfcfb; --ink:#0b0b0b; --ink2:#52514e; --muted:#898781;
    --grid:#e1e0d9; --line:#c3c2b7; --border:rgba(11,11,11,0.10);
    --blue:#2a78d6; --good:#0ca30c; --warn:#fab219; --crit:#d03b3b;
    --radius:14px;
  }
  @media (prefers-color-scheme: dark){
    :root{
      color-scheme: dark;
      --plane:#0d0d0d; --surface:#1a1a19; --ink:#ffffff; --ink2:#c3c2b7; --muted:#898781;
      --grid:#2c2c2a; --line:#383835; --border:rgba(255,255,255,0.10);
      --blue:#3987e5; --good:#0ca30c; --warn:#fab219; --crit:#e66767;
    }
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--plane);color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.5;-webkit-font-smoothing:antialiased}
  .wrap{max-width:1080px;margin:0 auto;padding:28px 20px 80px}
  a{color:var(--blue)}
  h1{font-size:24px;margin:0 0 4px}
  h2{font-size:17px;margin:34px 0 6px}
  .sub{color:var(--ink2);margin:0}
  .lead{color:var(--ink2);max-width:70ch;margin:4px 0 0;font-size:13.5px}
  .head{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end;justify-content:space-between;margin-bottom:6px}
  .controls{display:flex;gap:6px;align-items:center;flex-wrap:wrap}
  .seg{display:inline-flex;background:var(--surface);border:1px solid var(--border);border-radius:999px;padding:3px}
  .seg button{border:0;background:transparent;color:var(--ink2);font:inherit;font-size:13px;padding:6px 12px;border-radius:999px;cursor:pointer}
  .seg button[aria-pressed="true"]{background:var(--blue);color:#fff}
  .ghost{border:1px solid var(--border);background:var(--surface);color:var(--ink2);font:inherit;font-size:13px;padding:7px 12px;border-radius:10px;cursor:pointer}
  .updated{color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px}
  .tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:12px}
  @media (max-width:760px){.tiles{grid-template-columns:repeat(2,1fr)}}
  .tile .big{font-size:30px;font-weight:650;letter-spacing:-0.5px;margin:2px 0;font-variant-numeric:tabular-nums}
  .tile .lbl{font-size:13px;font-weight:600}
  .tile .exp{font-size:12px;color:var(--ink2);margin-top:4px}
  .scroll{overflow-x:auto}
  table{width:100%;border-collapse:collapse;margin-top:10px;font-size:13.5px}
  th,td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--grid);vertical-align:top;white-space:nowrap}
  th{color:var(--muted);font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.03em}
  td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
  .badge{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--border);border-radius:999px;padding:2px 9px;font-size:12px;color:var(--ink2);white-space:nowrap}
  .dot{width:9px;height:9px;border-radius:50%;display:inline-block}
  .banner{border-radius:12px;padding:12px 14px;margin:14px 0;font-size:13.5px;border:1px solid var(--border)}
  .banner.warn{background:rgba(250,178,25,0.12);border-color:rgba(250,178,25,0.5)}
  .banner.info{background:rgba(42,120,214,0.10);border-color:rgba(42,120,214,0.4)}
  .banner.bad{background:rgba(208,59,59,0.10);border-color:rgba(208,59,59,0.5)}
  .kv{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px 18px;margin-top:10px}
  .kv div{font-size:13px;color:var(--ink2)}
  .kv b{display:block;font-size:20px;color:var(--ink);font-weight:650;font-variant-numeric:tabular-nums}
  .track{background:var(--grid);border-radius:6px;height:12px;overflow:hidden;min-width:90px}
  .fill{height:100%;background:var(--blue);border-radius:6px}
  .foot{margin-top:40px;color:var(--muted);font-size:12.5px;max-width:80ch}
  .muted{color:var(--muted)}
</style>
</head>
<body>
<div class="wrap">
  <div class="head">
    <div>
      <h1>Casino payouts</h1>
      <p class="sub">What went into the fruit machines, what came back out, and what people bought.</p>
    </div>
    <div class="controls">
      <div class="seg" id="range" role="group" aria-label="Time range">
        <button data-range="24h">24 hours</button>
        <button data-range="7d" aria-pressed="true">7 days</button>
        <button data-range="30d">30 days</button>
        <button data-range="all">All time</button>
      </div>
      <button class="ghost" id="refresh" type="button">Refresh</button>
      <span class="updated" id="updated"></span>
    </div>
  </div>
  <div class="banner warn" id="trust"><b>Client-reported:</b> this is a log for statistics, not proof; on-chain settlement is the planned proof (docs/plans/CASINO-ONCHAIN-LAYR-PLAN.md).</div>
  <div id="banner"></div>
  <div id="content"></div>
  <p class="foot" id="foot"></p>
</div>
<script>
(function(){
  var NAMES={bf:"Block Fortune",drop:"The Drop",twins:"Forever Twins",ds:"Deep Strata",nv:"Neon Vault",ex:"LAYR Exchange",bank:"Bankroll"};
  var content=document.getElementById("content");
  var bannerEl=document.getElementById("banner");
  var updatedEl=document.getElementById("updated");
  var footEl=document.getElementById("foot");
  var RANGE="7d";

  function h(tag,attrs,kids){
    var el=document.createElement(tag);
    if(attrs){for(var k in attrs){if(Object.prototype.hasOwnProperty.call(attrs,k))el.setAttribute(k,attrs[k]);}}
    if(kids!=null){(Array.isArray(kids)?kids:[kids]).forEach(function(c){if(c==null)return;el.appendChild(typeof c==="string"||typeof c==="number"?document.createTextNode(String(c)):c);});}
    return el;
  }
  function n(v){return (Number(v)||0).toLocaleString("en-GB");}
  function pct(v){return v==null?"–":(v*100).toFixed(2)+"%";}
  function name(m){return NAMES[m]||m;}
  function banner(cls,msg){return h("div",{"class":"banner "+cls},msg);}
  function section(title,lead,body){
    var wrap=h("div",null,[h("h2",null,title),lead?h("p",{"class":"lead"},lead):null,body]);
    return wrap;
  }
  function tile(label,big,exp){return h("div",{"class":"card tile"},[h("div",{"class":"lbl"},label),h("div",{"class":"big"},big),h("div",{"class":"exp"},exp)]);}
  function table(cols,data){
    var head=h("tr",null,cols.map(function(c){return h("th",c.num?{"class":"num"}:null,c.t);}));
    var body=data.map(function(r){return h("tr",null,cols.map(function(c){var v=c.f(r);return h("td",c.num?{"class":"num"}:null,v);}));});
    return h("div",{"class":"scroll"},h("table",null,[h("thead",null,head),h("tbody",null,body)]));
  }
  function rtpBadge(actual,theory,spins){
    if(actual==null)return h("span",{"class":"muted"},"–");
    var off=Math.abs(actual-theory);
    var colour=spins<20000?"var(--muted)":off<=0.03?"var(--good)":off<=0.08?"var(--warn)":"var(--crit)";
    return h("span",{"class":"badge"},[h("i",{"class":"dot",style:"background:"+colour}),pct(actual)]);
  }

  function renderTiles(d){
    var t=d.totals||{};
    var diff=t.rtp==null?"No paid spins yet.":(t.rtp>=d.theoryRtp?"Players are ahead of the design figure by ":"Players are behind the design figure by ")+(Math.abs(t.rtp-d.theoryRtp)*100).toFixed(2)+" points.";
    return h("div",{"class":"tiles"},[
      tile("Paid spins",n(t.spins),n(t.freeSpins)+" free spins on top."),
      tile("LAYR staked",n(t.wagered),"Charged spins only; free spins cost nothing."),
      tile("LAYR paid out",n(t.won),"Every spin win plus every bonus collected, jackpots included."),
      tile("Actual return",pct(t.rtp),"Design figure "+pct(d.theoryRtp)+". "+diff)
    ]);
  }
  function renderMachines(d){
    var data=d.machines||[];
    if(!data.length)return h("p",{"class":"muted"},"No spins recorded in this period.");
    return table([
      {t:"Page",f:function(r){return r.page;}},
      {t:"Machine",f:function(r){return name(r.machine);}},
      {t:"Paid spins",num:1,f:function(r){return n(r.spins);}},
      {t:"Free spins",num:1,f:function(r){return n(r.freeSpins);}},
      {t:"Staked",num:1,f:function(r){return n(r.wagered);}},
      {t:"Paid out",num:1,f:function(r){return n(r.won);}},
      {t:"Return",num:1,f:function(r){return rtpBadge(r.rtp,r.theoryRtp,r.spins);}},
      {t:"Jackpots",num:1,f:function(r){return n(r.jackpots.count)+" · "+n(r.jackpots.paid);}},
      {t:"Biggest win",num:1,f:function(r){return n(r.biggestWin);}},
      {t:"Bonuses",num:1,f:function(r){return n(r.bonusesCollected);}}
    ],data);
  }
  function kvBox(items){
    return h("div",{"class":"card"},h("div",{"class":"kv"},items.map(function(i){return h("div",null,[h("b",null,i[1]),i[0]]);})));
  }
  function renderMoney(d){
    var b=d.buys||{},m=d.moves||{},g=d.gamble||{},p=d.players||{};
    var box=[kvBox([
      ["LAYR bought (as reported)",n(b.layrCredited)],
      ["Purchases",n(b.count)],
      ["Distinct transactions",n(b.distinctTransactions)],
      ["Buyers (browsers)",n(b.distinctPlayers)],
      ["Buyers (wallets)",n(b.distinctAddresses)],
      ["LAYR moved onto machines",n(m.inLayr)],
      ["LAYR cashed back to the bankroll",n(m.outLayr)],
      ["Double-or-nothing played",n(g.count)+" · net "+n(g.net)],
      ["Players seen (browsers)",n(p.distinctPid)],
      ["Players seen (wallets)",n(p.distinctAddr)]
    ])];
    if(b.transactionsCreditedTwice>0)box.unshift(banner("bad",n(b.transactionsCreditedTwice)+" purchase transaction(s) were credited in more than one browser. Check the same-transaction query in the migration notes."));
    return h("div",null,box);
  }
  function renderTop(d){
    var data=d.topWins||[];
    if(!data.length)return h("p",{"class":"muted"},"No wins recorded in this period.");
    return table([
      {t:"Day",f:function(r){return r.day;}},
      {t:"Page",f:function(r){return r.page;}},
      {t:"Machine",f:function(r){return name(r.machine);}},
      {t:"From",f:function(r){return r.kind==="bonus"?"Bonus":"Spin";}},
      {t:"Win",num:1,f:function(r){return n(r.win)+(r.jackpot?" (jackpot)":"");}},
      {t:"Stake",num:1,f:function(r){return n(r.bet);}},
      {t:"Times the stake",num:1,f:function(r){return r.multiple==null?"–":r.multiple+"×";}}
    ],data);
  }
  function renderJackpots(d){
    var data=d.jackpots||[];
    if(!data.length)return h("p",{"class":"muted"},"No jackpot has been reported yet.");
    return table([
      {t:"When",f:function(r){return new Date(r.at).toLocaleString();}},
      {t:"Page",f:function(r){return r.page;}},
      {t:"Machine",f:function(r){return name(r.machine);}},
      {t:"Paid",num:1,f:function(r){return n(r.paid);}},
      {t:"Stake",num:1,f:function(r){return n(r.bet);}}
    ],data);
  }
  function renderDaily(d){
    var data=d.daily||[];
    if(!data.length)return h("p",{"class":"muted"},"Nothing recorded in this period.");
    var max=0;data.forEach(function(r){if(r.wagered>max)max=r.wagered;});
    return table([
      {t:"Day",f:function(r){return r.day;}},
      {t:"Paid spins",num:1,f:function(r){return n(r.spins);}},
      {t:"Staked",num:1,f:function(r){return n(r.wagered);}},
      {t:"",f:function(r){return h("div",{"class":"track"},h("div",{"class":"fill",style:"width:"+(max?Math.round(r.wagered/max*100):0)+"%"}));}},
      {t:"Paid out",num:1,f:function(r){return n(r.won);}},
      {t:"Return",num:1,f:function(r){return pct(r.rtp);}},
      {t:"Players",num:1,f:function(r){return n(r.players);}}
    ],data);
  }

  function fetchData(range){
    var u="/debug/casino-data?range="+encodeURIComponent(range);
    return fetch(u,{credentials:"same-origin"}).then(function(res){return res.json();}).catch(function(e){return {ready:false,reason:String(e)};});
  }

  function paint(d){
    content.innerHTML="";bannerEl.innerHTML="";
    updatedEl.textContent="Updated "+new Date(d.generatedAt||Date.now()).toLocaleString();
    if(d.unauthorized){bannerEl.appendChild(banner("warn","Your dashboard session has expired. Sign in again at /debug, then reload this page."));return;}
    if(!d.ready){bannerEl.appendChild(banner("warn","No data yet. "+(d.hint||d.reason||"The casino log table has not been created.")));return;}
    bannerEl.appendChild(banner("info",d.caution));
    content.appendChild(renderTiles(d));
    content.appendChild(section("Each machine","Return is paid out divided by staked. The dot is grey until a machine has 20,000 paid spins, then green within 3 points of the design figure, amber within 8, red beyond that. Jackpots show how many, then LAYR paid.",renderMachines(d)));
    content.appendChild(section("LAYR in and out","Purchases are as reported by the pages; compare them with the payments to the shop address on the Stacks testnet. Moves are LAYR carried between the shared bankroll and a machine.",renderMoney(d)));
    content.appendChild(section("Biggest wins","The ten largest single wins in this period, a spin win or a collected bonus.",renderTop(d)));
    content.appendChild(section("Latest jackpots","The fifteen most recent jackpots reported, whatever the period selected.",renderJackpots(d)));
    content.appendChild(section("Day by day","Staked, paid out and the return for each day in the selected period.",renderDaily(d)));
    footEl.textContent="Recorded: machine, stake, win, jackpot part and reel stops for every spin; bonus amounts; gambles; LAYR purchases (transaction id and amount); bankroll moves; an anonymous browser id and, when a wallet was connected, its public address. Not recorded: IP addresses, keys, seeds or anything typed. Figures are reported by the pages themselves and cover the selected time range.";
  }

  function load(range){
    RANGE=range;
    var btns=document.querySelectorAll("#range button");
    for(var i=0;i<btns.length;i++)btns[i].setAttribute("aria-pressed",btns[i].getAttribute("data-range")===range?"true":"false");
    updatedEl.textContent="Loading…";
    fetchData(range).then(paint);
  }
  document.getElementById("range").addEventListener("click",function(ev){var b=ev.target.closest("button");if(b&&b.getAttribute("data-range"))load(b.getAttribute("data-range"));});
  document.getElementById("refresh").addEventListener("click",function(){load(RANGE);});
  load("7d");
})();
</script>
</body>
</html>`;

const SIGN_IN_HTML =
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<meta name="robots" content="noindex"><title>Xtrata · Casino payouts</title><style>body{margin:0;background:#0d0d0d;color:#fff;font:16px system-ui,sans-serif}' +
  'main{width:min(420px,calc(100% - 32px));margin:12vh auto;padding:24px;border:1px solid #383835;border-radius:14px;background:#1a1a19}' +
  'h1{font-size:20px;margin:0 0 8px}p{color:#c3c2b7;line-height:1.5}a{color:#3987e5}</style></head>' +
  '<body><main><h1>Casino payouts</h1><p>This page uses the same private key as the site health dashboard. <a href="/debug">Sign in at /debug</a>, then come back to /debug/casino.</p></main></body></html>';

const securityHeaders = (contentType: string) => ({
  'Content-Type': contentType,
  'Cache-Control': 'private, no-store',
  'Content-Security-Policy':
    "default-src 'none'; connect-src 'self'; form-action 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY'
});

export const onRequest: PagesFunction = async ({ request, env }) => {
  const debugKey = configuredDebugKey(env as { DEBUG_VIEW_KEY?: string });
  if (!debugKey) {
    return new Response('Casino dashboard unavailable: configure a strong DEBUG_VIEW_KEY.', {
      status: 503,
      headers: securityHeaders('text/plain; charset=utf-8')
    });
  }
  if (request.method !== 'GET') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { ...securityHeaders('text/plain; charset=utf-8'), Allow: 'GET' }
    });
  }
  if (!hasDebugAccess(request, debugKey)) {
    return new Response(SIGN_IN_HTML, {
      status: 401,
      headers: securityHeaders('text/html; charset=utf-8')
    });
  }
  return new Response(HTML, { headers: securityHeaders('text/html; charset=utf-8') });
};
