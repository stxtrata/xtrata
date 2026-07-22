/**
 * Human-friendly health & issue dashboard.  GET /debug
 *
 * Plain-language view of what is going wrong on the site and whether people
 * recover, built for non-specialists: every technical term is explained inline
 * and in a glossary. It fetches aggregated data from /debug/data (see
 * functions/debug/data.ts) and renders it. Self-contained: no external assets.
 *
 * NOTE for maintainers: the page markup below contains NO backticks and no
 * dollar-brace sequences, so scripts/build the preview can extract it by
 * splitting this file on the backtick character. Keep it that way.
 */
import { configuredDebugKey, debugAccessCookie, hasDebugAccess } from './lib/debug-auth';

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Xtrata · Site Health & Issues</title>
<style>
  :root{
    color-scheme: light;
    --plane:#f9f9f7; --surface:#fcfcfb; --ink:#0b0b0b; --ink2:#52514e; --muted:#898781;
    --grid:#e1e0d9; --line:#c3c2b7; --border:rgba(11,11,11,0.10);
    --blue:#2a78d6; --blue-soft:#cde2fb; --good:#0ca30c; --warn:#fab219; --crit:#d03b3b; --serious:#ec835a;
    --radius:14px;
  }
  @media (prefers-color-scheme: dark){
    :root{
      color-scheme: dark;
      --plane:#0d0d0d; --surface:#1a1a19; --ink:#ffffff; --ink2:#c3c2b7; --muted:#898781;
      --grid:#2c2c2a; --line:#383835; --border:rgba(255,255,255,0.10);
      --blue:#3987e5; --blue-soft:#184f95; --good:#0ca30c; --warn:#fab219; --crit:#e66767; --serious:#ec835a;
    }
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--plane);color:var(--ink);font-family:system-ui,-apple-system,"Segoe UI",sans-serif;line-height:1.5;-webkit-font-smoothing:antialiased}
  .wrap{max-width:1080px;margin:0 auto;padding:28px 20px 80px}
  a{color:var(--blue)}
  h1{font-size:24px;margin:0 0 4px}
  h2{font-size:17px;margin:34px 0 6px}
  .sub{color:var(--ink2);margin:0}
  .lead{color:var(--ink2);max-width:70ch;margin:4px 0 0}
  .row{display:flex;flex-wrap:wrap;gap:10px;align-items:center}
  .spacer{flex:1}
  .head{display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end;justify-content:space-between;margin-bottom:6px}
  .controls{display:flex;gap:6px;align-items:center}
  .seg{display:inline-flex;background:var(--surface);border:1px solid var(--border);border-radius:999px;padding:3px}
  .seg button{border:0;background:transparent;color:var(--ink2);font:inherit;font-size:13px;padding:6px 12px;border-radius:999px;cursor:pointer}
  .seg button[aria-pressed="true"]{background:var(--blue);color:#fff}
  .ghost{border:1px solid var(--border);background:var(--surface);color:var(--ink2);font:inherit;font-size:13px;padding:7px 12px;border-radius:10px;cursor:pointer}
  .updated{color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px}
  .tiles{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-top:12px}
  @media (max-width:760px){.tiles{grid-template-columns:repeat(2,1fr)}}
  .tile .big{font-size:34px;font-weight:650;letter-spacing:-0.5px;margin:2px 0}
  .tile .lbl{font-size:13px;font-weight:600}
  .tile .exp{font-size:12px;color:var(--ink2);margin-top:4px}
  .barrow{display:grid;grid-template-columns:180px 1fr 54px;gap:10px;align-items:center;margin:7px 0}
  .barrow .name{font-size:13px;color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .track{background:var(--grid);border-radius:6px;height:16px;overflow:hidden}
  .fill{height:100%;background:var(--blue);border-radius:6px}
  .barrow .val{font-size:13px;text-align:right;font-variant-numeric:tabular-nums;color:var(--ink)}
  table{width:100%;border-collapse:collapse;margin-top:10px;font-size:13.5px}
  th,td{text-align:left;padding:9px 10px;border-bottom:1px solid var(--grid);vertical-align:top}
  th{color:var(--muted);font-weight:600;font-size:12px;text-transform:uppercase;letter-spacing:0.03em}
  td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
  tr.issue{cursor:pointer}
  tr.issue:hover td{background:rgba(120,120,120,0.06)}
  .msg{color:var(--ink);max-width:46ch;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .where{color:var(--ink2);font-size:12.5px}
  .detail td{background:rgba(120,120,120,0.05)}
  .detail .box{padding:4px 2px 8px}
  .detail .plain{margin:0 0 8px;max-width:80ch}
  .detail .sample{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;color:var(--ink2);background:var(--plane);border:1px solid var(--border);border-radius:8px;padding:8px 10px;white-space:pre-wrap;word-break:break-word}
  .kv{display:flex;flex-wrap:wrap;gap:14px;margin-top:8px;font-size:12.5px;color:var(--ink2)}
  .kv b{color:var(--ink);font-weight:600}
  .badge{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--border);border-radius:999px;padding:2px 9px;font-size:12px;color:var(--ink2);white-space:nowrap}
  .dot{width:9px;height:9px;border-radius:50%;display:inline-block}
  .split{height:18px;border-radius:6px;overflow:hidden;display:flex;background:var(--grid);margin:8px 0}
  .split .seg2{height:100%}
  .fnl{margin:6px 0 2px}
  .fnl .step{display:grid;grid-template-columns:150px 1fr auto;gap:10px;align-items:center;margin:5px 0}
  .fnl .sname{font-size:12.5px;color:var(--ink2)}
  .fnl .sbar{height:14px;border-radius:5px;background:var(--grid);overflow:hidden;display:flex}
  .fnl .scount{font-size:12px;color:var(--ink2);font-variant-numeric:tabular-nums;white-space:nowrap}
  .recent{list-style:none;padding:0;margin:10px 0 0}
  .recent li{padding:9px 0;border-bottom:1px solid var(--grid);display:flex;gap:10px;flex-wrap:wrap;align-items:baseline}
  .recent .t{color:var(--muted);font-size:12px;min-width:74px;font-variant-numeric:tabular-nums}
  .recent .rmsg{color:var(--ink2);font-size:13px}
  .banner{border-radius:12px;padding:12px 14px;margin:14px 0;font-size:13.5px;border:1px solid var(--border)}
  .banner.warn{background:rgba(250,178,25,0.12);border-color:rgba(250,178,25,0.5)}
  .banner.info{background:rgba(42,120,214,0.10);border-color:rgba(42,120,214,0.4)}
  details{margin-top:10px}
  details.card summary{cursor:pointer;font-weight:600;font-size:14px;list-style:none}
  details.card summary::-webkit-details-marker{display:none}
  details.card summary::before{content:"› ";color:var(--muted)}
  details.card[open] summary::before{content:"⌄ "}
  .gloss{display:grid;grid-template-columns:170px 1fr;gap:6px 16px;margin-top:10px;font-size:13.5px}
  .gloss dt{color:var(--ink);font-weight:600}
  .gloss dd{margin:0;color:var(--ink2)}
  .foot{margin-top:40px;color:var(--muted);font-size:12.5px;max-width:80ch}
  .muted{color:var(--muted)}
  .q{border-bottom:1px dotted var(--muted);cursor:help}
</style>
</head>
<body>
<div class="wrap">
  <div class="head">
    <div>
      <h1>Site Health &amp; Issues</h1>
      <p class="sub">What is going wrong for people on Xtrata — and whether they recover.</p>
    </div>
    <div class="controls">
      <div class="seg" id="range" role="group" aria-label="Time range">
        <button data-range="24h">24 hours</button>
        <button data-range="7d" aria-pressed="true">7 days</button>
        <button data-range="30d">30 days</button>
      </div>
      <button class="ghost" id="refresh">Refresh</button>
    </div>
  </div>
  <div class="updated" id="updated">Loading…</div>

  <details class="card" style="margin-top:14px">
    <summary>How to read this page</summary>
    <p class="lead" style="margin-top:10px">Every time someone uses the site, the app quietly records the important moments —
    especially the failures. This page turns those records into plain language. A <span class="q" title="One error a person could not get past in that moment">crash-out</span>
    is a single failure. A <span class="q" title="A distinct underlying problem — many crash-outs can share one issue">unique issue</span>
    is the underlying problem behind many crash-outs. The most useful number is the
    <b>recovery rate</b>: of the people who hit an error, how many tried again and eventually succeeded. A low recovery rate is where you are losing people.</p>
  </details>

  <div id="banner"></div>
  <div id="content"></div>

  <details class="card" style="margin-top:26px">
    <summary>Glossary — what the terms mean</summary>
    <dl class="gloss">
      <dt>Crash-out</dt><dd>One failure a person hit at a moment in time (an "error" event).</dd>
      <dt>Unique issue</dt><dd>A distinct underlying problem. The app groups similar errors together (ignoring changing details like amounts or IDs) so 5,000 failures might really be 12 issues.</dd>
      <dt>Session</dt><dd>One visit in one browser. Used here as a stand-in for "a person" during that visit.</dd>
      <dt>Journey</dt><dd>One attempt at a goal — e.g. buying a specific item — including any retries.</dd>
      <dt>Attempt</dt><dd>Each try within a journey. Attempt 2 means they tried again after a failure.</dd>
      <dt>Recovery rate</dt><dd>Of journeys that hit an error, the share that eventually succeeded.</dd>
      <dt>Flow</dt><dd>Which part of the site: connecting a wallet, minting, claiming a drop, buying, publishing.</dd>
      <dt>Step</dt><dd>The stage within a flow, e.g. "signing in wallet" or "sending to network".</dd>
      <dt>Wallet (hashed)</dt><dd>We never store wallet addresses. We keep a scrambled fingerprint so we can tell "same person" apart from "different people" without knowing who they are.</dd>
      <dt>Nonce</dt><dd>A counter that keeps a wallet's transactions in order. A "nonce mismatch" means two transactions collided or arrived out of order — common when retrying fast.</dd>
      <dt>Post-condition</dt><dd>A built-in safety rule that cancels a transaction if the token amounts do not match exactly. If it fires, nothing moves — usually a price/amount mismatch.</dd>
      <dt>Sponsor</dt><dd>Your service that pays network fees on someone's behalf (for sponsored trades and free claims).</dd>
    </dl>
  </details>

  <p class="foot" id="foot"></p>
</div>

<script>
(function(){
  var FLOWS={app:"General app / page load",wallet_connect:"Connecting a wallet",mint:"Minting / inscribing",drop_claim:"Claiming a free drop",market_buy:"Buying on the marketplace",collection_publish:"Publishing a collection"};
  var STEPS={boot:"page load",open:"opening wallet",select_provider:"choosing a wallet",authorize:"authorising",session_persist:"saving the session",quote:"getting a price quote",sign:"signing in wallet",broadcast:"sending to network",confirm:"waiting for confirmation",poll_confirm:"waiting for confirmation",settle:"settling",eligibility:"checking eligibility",submit:"submitting",reserve:"reserving",upload:"uploading asset",readiness:"readiness check",publish:"publishing"};
  var CODES={
    WALLET_REJECTED:{label:"Wallet request declined",plain:"The person clicked cancel or deny in their wallet popup, or the wallet rejected the request. Often intentional — but a spike can mean a confusing or mistimed prompt."},
    WALLET_NOT_FOUND:{label:"No wallet detected",plain:"No compatible wallet was found. They may not have one installed, or it was not detected in their browser."},
    WALLET_LOCKED:{label:"Wallet locked",plain:"The wallet is installed but locked. They need to unlock it with their password before continuing."},
    SESSION_EXPIRED:{label:"Session expired",plain:"Their signed-in session ran out. They simply need to reconnect."},
    INSUFFICIENT_FUNDS:{label:"Not enough balance",plain:"They did not have enough tokens to complete the action."},
    INSUFFICIENT_FEE:{label:"Not enough for network fees",plain:"The network fee could not be covered, or the fee offered was too low to go through."},
    NONCE_MISMATCH:{label:"Transaction ordering clash (nonce)",plain:"A nonce is the counter that orders a wallet's transactions. A mismatch usually means two transactions collided or one arrived out of order — very common when people retry quickly."},
    POST_CONDITION_FAILED:{label:"Safety check blocked it (post-condition)",plain:"A post-condition is a safety rule that cancels a transaction if the token amounts do not match exactly. It fired, so nothing was transferred — usually a pricing or amount mismatch."},
    CONTRACT_ABORT:{label:"Smart-contract rejected it",plain:"The on-chain contract deliberately stopped the action — e.g. sold out, not eligible, or wrong state."},
    READ_ONLY_BACKOFF:{label:"Temporarily throttled (read-only backoff)",plain:"The app slowed down repeated on-chain reads to avoid hammering the data API, then retries. Frequent hits suggest the data API is slow or over its limit."},
    BROADCAST_FAILED:{label:"Could not send the transaction",plain:"The signed transaction failed to reach the network — usually connectivity or a node issue."},
    CONFIRM_TIMEOUT:{label:"Timed out waiting for confirmation",plain:"The transaction was sent but did not confirm in time. It may still land later — often network congestion."},
    SPONSOR_REJECTED:{label:"Sponsored relay declined",plain:"Your fee-sponsoring service refused to cover or broadcast this transaction — validation failed or a policy blocked it."},
    SPONSOR_LOW_FLOAT:{label:"Sponsor wallet low on funds",plain:"The hot wallet that pays fees for sponsored trades and claims is running low. Top it up."},
    HIRO_RATE_LIMIT:{label:"Data API rate-limited (429)",plain:"The Hiro data API returned too-many-requests. Add or rotate API keys, or reduce calls."},
    UPLOAD_FAILED:{label:"Asset upload failed",plain:"The file upload did not complete — size, format, or connectivity."},
    ASSET_TOO_LARGE:{label:"File too large",plain:"The asset exceeded the size limit for minting."},
    NETWORK_OFFLINE:{label:"No internet",plain:"The person's device went offline in the middle of the action."},
    RENDER_CRASH:{label:"Screen crashed (interface bug)",plain:"Part of the interface threw an error and showed the fallback screen. This is a bug to fix."},
    UNCAUGHT:{label:"Unexpected error",plain:"An error not yet categorised. Open it to read the message — consider giving it a friendly code once you know what it is."}
  };
  var OPS={RENDER_CRASH:1,UNCAUGHT:1,SPONSOR_LOW_FLOAT:1,HIRO_RATE_LIMIT:1,BROADCAST_FAILED:1,SPONSOR_REJECTED:1,CONFIRM_TIMEOUT:1,UPLOAD_FAILED:1,ASSET_TOO_LARGE:1};
  var USER={WALLET_REJECTED:1,WALLET_LOCKED:1,WALLET_NOT_FOUND:1,NETWORK_OFFLINE:1,SESSION_EXPIRED:1,INSUFFICIENT_FUNDS:1,INSUFFICIENT_FEE:1};
  var STATUS={good:"#0ca30c",warning:"#fab219",critical:"#d03b3b"};

  function flowName(f){return FLOWS[f]||f||"—";}
  function stepName(s){return STEPS[s]||s||"—";}
  function codeInfo(c){return CODES[c]||{label:(c||"Uncategorised"),plain:"No description yet for this code."};}
  function catFor(c){if(OPS[c])return{kind:"critical",label:"needs your attention",glyph:"◆"};if(USER[c])return{kind:"good",label:"usually user-side",glyph:"•"};return{kind:"warning",label:"worth a look",glyph:"▲"};}
  function n(x){return (Number(x)||0).toLocaleString();}
  function pct(x){return x==null?"—":x+"%";}
  function timeAgo(ms){var d=Date.now()-Number(ms);if(d<0)d=0;var s=Math.floor(d/1000);if(s<60)return s+"s ago";var m=Math.floor(s/60);if(m<60)return m+"m ago";var h=Math.floor(m/60);if(h<24)return h+"h ago";return Math.floor(h/24)+"d ago";}

  function h(tag,props){var el=document.createElement(tag);if(props){for(var k in props){if(k==="class")el.className=props[k];else if(k==="text")el.textContent=props[k];else if(k==="html")el.innerHTML=props[k];else if(k==="style")el.setAttribute("style",props[k]);else if(k==="title")el.title=props[k];else el.setAttribute(k,props[k]);}}for(var i=2;i<arguments.length;i++){var c=arguments[i];if(c==null)continue;if(Object.prototype.toString.call(c)==="[object Array]"){for(var j=0;j<c.length;j++){var x=c[j];if(x!=null)el.appendChild(typeof x==="string"?document.createTextNode(x):x);}}else{el.appendChild(typeof c==="string"?document.createTextNode(c):c);}}return el;}

  function badge(code){var cat=catFor(code);var b=h("span",{class:"badge"});b.appendChild(h("span",{class:"dot",style:"background:"+STATUS[cat.kind]}));b.appendChild(document.createTextNode(cat.glyph+" "+cat.label));return b;}

  function tile(label,big,exp){return h("div",{class:"card tile"},h("div",{class:"lbl",text:label}),h("div",{class:"big",text:big}),h("div",{class:"exp",text:exp}));}

  function section(title,lead,node){var wrap=document.createDocumentFragment();wrap.appendChild(h("h2",{text:title}));if(lead)wrap.appendChild(h("p",{class:"lead",text:lead}));if(node)wrap.appendChild(node);return wrap;}

  function renderKPIs(k){var g=h("div",{class:"tiles"});g.appendChild(tile("Recorded activity",n(k.totalEvents),"Page visits and tracked wallet, mint, market, and drop steps received by the logger."));g.appendChild(tile("Crash-outs",n(k.crashOuts),"Times someone hit an error they could not get past."));g.appendChild(tile("Unique issues",n(k.distinctIssues),"Distinct problems behind those crash-outs."));g.appendChild(tile("Recovery rate",pct(k.recoveryPct),"Of goal attempts that errored, how many eventually succeeded."));return g;}

  function renderByFlow(list){if(!list||!list.length)return h("p",{class:"muted",text:"No activity recorded in this period yet."});var max=0;for(var i=0;i<list.length;i++)max=Math.max(max,Number(list[i].events)||0);if(max===0)max=1;var box=h("div",{class:"card"});for(var j=0;j<list.length;j++){var f=list[j];var w=Math.round(((Number(f.events)||0)/max)*100);var track=h("div",{class:"track"},h("div",{class:"fill",style:"width:"+w+"%"}));box.appendChild(h("div",{class:"barrow",title:n(f.events)+" events, "+n(f.errors)+" errors in "+flowName(f.flow)},h("div",{class:"name",text:flowName(f.flow)}),track,h("div",{class:"val",text:n(f.events)+" / "+n(f.errors)})));}return box;}

  function renderTrend(list){if(!list||!list.length)return h("p",{class:"muted",text:"Not enough history yet."});var max=1;for(var i=0;i<list.length;i++)max=Math.max(max,Number(list[i].errors)||0);var box=h("div",{class:"card"});var chart=h("div",{style:"display:flex;align-items:flex-end;gap:4px;height:120px;padding-top:8px"});for(var j=0;j<list.length;j++){var d=list[j];var hgt=Math.round(((Number(d.errors)||0)/max)*100);var col=h("div",{style:"flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;height:100%",title:(d.day||"")+": "+n(d.errors)+" crash-outs"});col.appendChild(h("div",{style:"width:70%;min-height:2px;height:"+hgt+"%;background:var(--blue);border-radius:4px 4px 0 0"}));col.appendChild(h("div",{class:"muted",style:"font-size:10px;margin-top:4px;white-space:nowrap",text:String(d.day||"").slice(5)}));chart.appendChild(col);}box.appendChild(chart);return box;}

  function renderRecovery(k){var box=h("div",{class:"card"});var er=Number(k.erroredJourneys)||0;var rc=Number(k.recoveredJourneys)||0;var gu=Number(k.gaveUpJourneys)||0;if(er===0){box.appendChild(h("p",{class:"muted",text:"No multi-step journeys with errors in this period — nothing to recover from yet."}));return box;}var rw=Math.round((rc/er)*100);box.appendChild(h("p",{class:"lead",style:"margin-top:0",text:"Of "+n(er)+" goal-attempts that hit an error, "+n(rc)+" recovered and finished ("+rw+"%). "+n(gu)+" gave up."}));var split=h("div",{class:"split"});split.appendChild(h("div",{class:"seg2",style:"width:"+rw+"%;background:"+STATUS.good,title:"Recovered: "+n(rc)}));split.appendChild(h("div",{class:"seg2",style:"width:"+(100-rw)+"%;background:"+STATUS.critical,title:"Gave up: "+n(gu)}));box.appendChild(split);box.appendChild(h("div",{class:"kv"},h("span",{},[h("b",{text:n(rc)})," recovered"]),h("span",{},[h("b",{text:n(gu)})," gave up"])));return box;}

  function issueDetail(it){var info=codeInfo(it.errorCode);var box=h("div",{class:"box"});box.appendChild(h("p",{class:"plain",text:info.plain}));if(it.sample)box.appendChild(h("div",{class:"sample",text:String(it.sample)}));box.appendChild(h("div",{class:"kv"},h("span",{},[h("b",{text:n(it.occurrences)})," times"]),h("span",{},[h("b",{text:n(it.sessions)})," people"]),h("span",{},[h("b",{text:n(it.wallets)})," wallets"]),h("span",{},["last seen ",h("b",{text:timeAgo(it.lastSeen)})]),h("span",{},["where: ",h("b",{text:flowName(it.flow)+" · "+stepName(it.step)})])));return box;}

  function renderIssues(list){if(!list||!list.length)return h("p",{class:"muted",text:"No errors recorded in this period. That is a good thing — or logging just went live."});var tbl=h("table");var thead=h("thead");thead.appendChild(h("tr",{},h("th",{text:"Issue"}),h("th",{text:"Where"}),h("th",{text:"Signal"}),h("th",{class:"num",text:"Times"}),h("th",{class:"num",text:"People"}),h("th",{class:"num",text:"Last seen"})));tbl.appendChild(thead);var tb=h("tbody");for(var i=0;i<list.length;i++){(function(it){var info=codeInfo(it.errorCode);var tr=h("tr",{class:"issue"});tr.appendChild(h("td",{},h("div",{class:"msg",title:String(it.sample||info.label),text:info.label})));tr.appendChild(h("td",{class:"where",text:flowName(it.flow)+" · "+stepName(it.step)}));tr.appendChild(h("td",{},badge(it.errorCode)));tr.appendChild(h("td",{class:"num",text:n(it.occurrences)}));tr.appendChild(h("td",{class:"num",text:n(it.sessions)}));tr.appendChild(h("td",{class:"num",text:timeAgo(it.lastSeen)}));var drow=h("tr",{class:"detail"});var dtd=h("td",{colspan:"6"});dtd.appendChild(issueDetail(it));drow.appendChild(dtd);drow.style.display="none";tr.addEventListener("click",function(){drow.style.display=drow.style.display==="none"?"table-row":"none";});tb.appendChild(tr);tb.appendChild(drow);})(list[i]);}tbl.appendChild(tb);var card=h("div",{class:"card",style:"padding-top:6px"});card.appendChild(tbl);return card;}

  function renderFunnels(funnels){if(!funnels||!funnels.length)return h("p",{class:"muted",text:"No step-by-step data yet."});var frag=document.createDocumentFragment();for(var i=0;i<funnels.length;i++){var fl=funnels[i];var card=h("div",{class:"card fnl",style:"margin-bottom:12px"});card.appendChild(h("div",{style:"font-weight:600;font-size:14px;margin-bottom:6px",text:flowName(fl.flow)}));var steps=fl.steps||[];var maxStarted=1;for(var s=0;s<steps.length;s++)maxStarted=Math.max(maxStarted,Number(steps[s].started)||0);for(var j=0;j<steps.length;j++){var st=steps[j];var started=Number(st.started)||0;var ok=Number(st.succeeded)||0;var err=Number(st.errored)||0;var okw=started?Math.round((ok/started)*100):0;var errw=started?Math.round((err/started)*100):0;var bar=h("div",{class:"sbar"});bar.appendChild(h("div",{style:"width:"+okw+"%;background:"+STATUS.good,title:n(ok)+" succeeded"}));bar.appendChild(h("div",{style:"width:"+errw+"%;background:"+STATUS.critical,title:n(err)+" errored"}));card.appendChild(h("div",{class:"step"},h("div",{class:"sname",text:stepName(st.step)}),bar,h("div",{class:"scount",text:n(ok)+" ok · "+n(err)+" err"})));}frag.appendChild(card);}return frag;}

  function renderRecent(list){if(!list||!list.length)return h("p",{class:"muted",text:"No recent crash-outs."});var ul=h("ul",{class:"recent"});for(var i=0;i<list.length;i++){var r=list[i];var info=codeInfo(r.errorCode);var meta=[];if(r.device)meta.push(r.device);if(r.browser)meta.push(r.browser);if(r.country)meta.push(r.country);if(r.walletKind)meta.push(r.walletKind);var li=h("li",{},h("span",{class:"t",text:timeAgo(r.ts)}),h("span",{},[h("b",{text:flowName(r.flow)}),h("span",{class:"muted",text:" · "+stepName(r.step)})]),h("span",{class:"rmsg",text:info.label}),h("span",{class:"muted",style:"font-size:12px",text:meta.join(" · ")}));ul.appendChild(li);}return ul;}

  function renderActivity(list){if(!list||!list.length)return h("p",{class:"muted",text:"No recent activity."});var labels={start:"started",success:"succeeded",error:"failed",abandon:"stopped",info:"recorded"};var ul=h("ul",{class:"recent"});for(var i=0;i<list.length;i++){var r=list[i];var meta=[];if(r.device)meta.push(r.device);if(r.browser)meta.push(r.browser);if(r.country)meta.push(r.country);if(r.walletKind)meta.push(r.walletKind);var outcome=labels[r.outcome]||r.outcome||"recorded";var li=h("li",{},h("span",{class:"t",text:timeAgo(r.ts)}),h("span",{},[h("b",{text:flowName(r.flow)}),h("span",{class:"muted",text:" · "+stepName(r.step)})]),h("span",{class:"rmsg",text:outcome}),h("span",{class:"muted",style:"font-size:12px",text:meta.join(" · ")}));ul.appendChild(li);}return ul;}

  var content=document.getElementById("content");
  var bannerEl=document.getElementById("banner");
  var updatedEl=document.getElementById("updated");
  var footEl=document.getElementById("foot");
  var RANGE="7d";

  function fetchData(range){
    if(window.__PREVIEW__)return Promise.resolve(window.__PREVIEW__);
    var u="/debug/data?range="+encodeURIComponent(range);
    return fetch(u,{credentials:"same-origin"}).then(function(res){return res.json();}).catch(function(e){return {ready:false,reason:String(e)};});
  }

  function banner(cls,msg){var b=h("div",{class:"banner "+cls});b.appendChild(document.createTextNode(msg));return b;}

  function paint(d){
    content.innerHTML="";bannerEl.innerHTML="";
    var when=new Date(d.generatedAt||Date.now());
    updatedEl.textContent="Updated "+when.toLocaleString()+(window.__PREVIEW__?" · PREVIEW with sample data":"");
    if(d.unauthorized){bannerEl.appendChild(banner("warn","Your dashboard session has expired. Reload this page and sign in again."));return;}
    if(!d.ready){bannerEl.appendChild(banner("warn","No data yet. "+(d.hint||d.reason||"The logging table has not been created.")));return;}
    if((d.kpis&&d.kpis.totalEvents===0)){bannerEl.appendChild(banner("warn","No events recorded in this period. The site should send a page heartbeat on every visit, so check the deployment if this remains empty after opening the public site."));}
    else if(d.kpis&&d.kpis.crashOuts===0){bannerEl.appendChild(banner("info","Logging is active: "+n(d.kpis.totalEvents)+" events received in this period, with no crash-outs."));}
    content.appendChild(renderKPIs(d.kpis||{}));
    content.appendChild(section("What is being recorded","Activity by area of the site. The number at right is total events / errors.",renderByFlow(d.byFlow)));
    content.appendChild(section("Latest activity","The newest page heartbeats and tracked wallet, mint, market, and drop steps. This confirms the logger is receiving healthy actions as well as failures.",renderActivity(d.recentActivity)));
    content.appendChild(section("Crash-outs over time","Daily count of crash-outs across the selected range. Watch a bar shrink after you ship a fix.",renderTrend(d.trend)));
    content.appendChild(section("Do people recover?","Whether people who hit an error tried again and eventually succeeded. This is the number to drive up.",renderRecovery(d.kpis||{})));
    content.appendChild(section("The unique issues (most impactful first)","Each row is one distinct problem. Click a row to see a plain-English explanation, an example, and how many people it hit.",renderIssues(d.topIssues)));
    content.appendChild(section("Step-by-step drop-off","For each flow, how far people get. Green is the share of a step that succeeded, red the share that errored.",renderFunnels(d.funnels)));
    content.appendChild(section("Latest crash-outs","The most recent individual failures, newest first.",renderRecent(d.recentErrors)));
    footEl.textContent="Data is captured privately and anonymously: no wallet addresses, keys, or personal details are stored — only scrambled fingerprints used to tell repeat visitors apart. Figures cover the selected time range.";
  }

  function load(range){RANGE=range;var btns=document.querySelectorAll("#range button");for(var i=0;i<btns.length;i++)btns[i].setAttribute("aria-pressed",btns[i].getAttribute("data-range")===range?"true":"false");updatedEl.textContent="Loading…";fetchData(range).then(paint);}

  document.getElementById("range").addEventListener("click",function(ev){var b=ev.target.closest("button");if(b&&b.getAttribute("data-range"))load(b.getAttribute("data-range"));});
  document.getElementById("refresh").addEventListener("click",function(){load(RANGE);});

  load("7d");
})();
</script>
</body>
</html>`;

const LOGIN_HTML =
  '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
  '<meta name="robots" content="noindex"><title>Xtrata · Debug access</title><style>body{margin:0;background:#0d0d0d;color:#fff;font:16px system-ui,sans-serif}' +
  'main{width:min(420px,calc(100% - 32px));margin:12vh auto;padding:24px;border:1px solid #383835;border-radius:14px;background:#1a1a19}' +
  'h1{font-size:20px;margin:0 0 8px}p{color:#c3c2b7;line-height:1.5}label{display:grid;gap:7px}input,button{font:inherit;padding:10px 12px;border-radius:8px}' +
  'input{border:1px solid #555;background:#0d0d0d;color:#fff}button{margin-top:12px;border:0;background:#3987e5;color:#fff;font-weight:700;cursor:pointer}</style></head>' +
  '<body><main><h1>Site Health &amp; Issues</h1><p>Enter the private dashboard key. It will be exchanged for a secure, eight-hour browser session and will not remain in the address bar.</p>' +
  '<form method="post" action="/debug"><label>Dashboard key<input name="key" type="password" minlength="24" required autocomplete="current-password"></label>' +
  '<button type="submit">Open dashboard</button></form></main></body></html>';

const securityHeaders = (contentType: string) => ({
  'Content-Type': contentType,
  'Cache-Control': 'private, no-store',
  'Content-Security-Policy':
    "default-src 'none'; connect-src 'self'; form-action 'self'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; base-uri 'none'; frame-ancestors 'none'",
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY'
});

export const onRequest: PagesFunction = async ({ request, env }) => {
  const debugKey = configuredDebugKey(env as { DEBUG_VIEW_KEY?: string });
  if (!debugKey) {
    return new Response('Debug dashboard unavailable: configure a strong DEBUG_VIEW_KEY.', {
      status: 503,
      headers: securityHeaders('text/plain; charset=utf-8')
    });
  }

  if (request.method === 'POST') {
    const form = await request.formData().catch(() => null);
    const submitted = form?.get('key');
    if (typeof submitted !== 'string' || submitted !== debugKey) {
      return new Response(LOGIN_HTML, {
        status: 401,
        headers: securityHeaders('text/html; charset=utf-8')
      });
    }
    return new Response(null, {
      status: 303,
      headers: {
        Location: '/debug',
        'Set-Cookie': debugAccessCookie(debugKey),
        'Cache-Control': 'private, no-store',
        'Referrer-Policy': 'no-referrer'
      }
    });
  }

  if (request.method !== 'GET') {
    return new Response('Method not allowed', {
      status: 405,
      headers: { ...securityHeaders('text/plain; charset=utf-8'), Allow: 'GET, POST' }
    });
  }
  if (!hasDebugAccess(request, debugKey)) {
    return new Response(LOGIN_HTML, {
      status: 401,
      headers: securityHeaders('text/html; charset=utf-8')
    });
  }
  return new Response(HTML, { headers: securityHeaders('text/html; charset=utf-8') });
};
