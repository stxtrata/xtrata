import re, colorsys
R='..'
src = open(f'{R}/ft/shell.html').read()
a = src.index('<style>')+7; b = src.index('</style>')
css = src[a:b]
def rot(m):
    h = m.group(0); x = h[1:]
    if len(x) in (3,4): x = ''.join(c*2 for c in x)
    if len(x) not in (6,8): return h
    r,g,bl = (int(x[i:i+2],16)/255 for i in (0,2,4)); al = x[6:] if len(x)==8 else ''
    hh,l,s = colorsys.rgb_to_hls(r,g,bl); deg = hh*360
    if 165 <= deg <= 235 and s >= .08:
        hh = ((deg+62)%360)/360; r2,g2,b2 = colorsys.hls_to_rgb(hh,l,s)
        return '#%02x%02x%02x%s' % (round(r2*255),round(g2*255),round(b2*255),al)
    return h
css = re.sub(r'#[0-9a-fA-F]{3,8}\b', rot, css)
css += """
:root{--gold:#f6c453;--orange:#f6c453;--panel:#15103a}
h1 em{color:#f6c453}.edition{color:#b9adff}.edition span{background:#8d83ff}
.cta,.bar-cta{background:#5546ff;color:#fff4d8;box-shadow:0 3px 0 #2a1f7a}
.spin{background:linear-gradient(120deg,#6a5bff,#4636e0);color:#fff4d8;box-shadow:0 4px 0 #2a1f7a,0 0 35px #5546ff33}
.spin:active{box-shadow:0 1px 0 #2a1f7a}
#toast{background:#5546ff;color:#fff4d8}
.coin.inf{background:none;border:0;box-shadow:none;width:auto;height:auto;font-size:22px;color:#f6c453;text-shadow:0 0 12px #f0b429}
.meter,.bonus-total{color:#f6c453}.fb-head strong,dialog h2,.last strong{color:#f3ead6}
.gamble-btn{border-color:#f6c453;color:#f6c453;background:#2a1f7a}
.pick.capsule.picked{background:#f6c453;color:#2a1f00}
.twins-table small{color:#93a6b5;font-size:10px}
"""
open('g21.css','w').write(css)
html = src[:a-7]
head = src[:src.index('<title>')] + '<title>Genesis 21 — Xtrata Arcade machine</title><meta name="description" content="Genesis 21: a fruit machine for the Xtrata Arcade. A time capsule of the first NFTs on Stacks, January 2021. Uses the existing shared casino LAYR account."><style>'
head = head.replace('#05080c', '#0d0a24')
body = """</style></head><body>
<div id="scene" aria-label="Genesis 21 screen"></div>
<header><a class="brand" href="#" aria-label="Genesis 21"><canvas class="brandmark" id="brandmark" width="68" height="68" aria-hidden="true"></canvas> XTRATA <span class="arcade">/ ARCADE</span></a><div class="top-right"><span class="pill"><i></i> LAYR PLAY</span><button id="sound" class="icon" aria-label="Mute sound" aria-pressed="true">♫</button><button id="help" class="icon" aria-label="Roadmap and pays">?</button><button id="fullscreen" class="icon" aria-label="Toggle fullscreen">⛶</button><button id="settings" class="icon" aria-label="Settings">⚙</button></div></header>
<main><section class="intro"><p class="eyebrow">THE FIRST NFTs ON STACKS &nbsp; / &nbsp; JAN 2021</p><h1>GENESIS<br><em>21</em></h1><p class="tagline">Where Bitcoin NFTs on Stacks began.<br>Light up your collection.</p><div class="edition"><span></span> LIVE FROM XTRATA</div><div class="feature-list"><button data-info="free"><b>01</b><span>Mainnet Launch<small>8 free spins · all wins 2×</small></span><i>↗</i></button><button data-info="vault"><b>02</b><span>Stacking Boombox<small>Open 3 of 9 Boomboxes</small></span><i>↗</i></button><button data-info="chain"><b>03</b><span>Proof of Transfer<small>Anchor Bitcoin blocks. Respin.</small></span><i>↗</i></button><button data-info="genesis"><b>04</b><span>Jackpot: Number One<small>5 This Is #1 on the centre line</small></span><i>↗</i></button><button id="twinsInfo"><b>05</b><span>Hall of Twins<small id="twinsSmall">Reading the chain…</small></span><i>↗</i></button></div></section>
<aside class="session"><p class="eyebrow">YOUR SESSION</p><div class="session-row"><span>Spins</span><b id="spins">0</b></div><div class="session-row"><span>Total played</span><b id="wagered">0</b></div><div class="session-row"><span>Total paid out</span><b id="paidOut">0</b></div><div class="session-rule"></div><p class="eyebrow">JACKPOT: NUMBER ONE</p><p class="meter" id="meterSide">10,000</p><p class="eyebrow">HOLDER POT</p><p class="meter" id="potSide">0</p><button class="text-button" id="pot">The Holder Pot ↗</button><p class="layr-note">Permanent art. One LAYR account.<br>Shared casino balance.</p><p class="live-src" id="liveSrc">CONNECTING TO XTRATA…</p><button class="text-button" id="history">Session history ↗</button></aside>
<div class="machine-caption"><span class="live-dot"></span> <span id="status" role="status" aria-live="polite">WHERE BITCOIN NFTs ON STACKS BEGAN</span></div></main>
<section id="featureBar" hidden aria-live="polite" aria-label="Bonus feature"><div class="fb-head"><span class="eyebrow" id="fbTag">FEATURE</span><strong id="fbTitle"></strong><span id="fbInfo"></span></div><div id="fbBody"></div></section>
<footer class="console"><div class="credit"><label>LAYR BALANCE <button id="account" aria-label="View shared LAYR account">LAYR account</button></label><strong id="balance">0</strong><small>LAYR</small></div><div class="bet"><label>TOTAL BET <span>20 LINES</span></label><div class="stepper"><button id="minus" aria-label="Decrease bet">−</button><strong id="bet">100</strong><button id="plus" aria-label="Increase bet">+</button></div></div><div class="last"><label id="winLabel">LAST WIN</label><strong id="lastWin">0</strong><small id="freeCount">LAYR</small><button id="gamble" class="gamble-btn" hidden>ODD / EVEN BLOCK ›</button></div><div class="actions"><button id="auto" class="secondary" aria-pressed="false">AUTO-STACK</button><button id="maxBet" class="secondary">MAX BET</button><button id="spin" class="spin"><span id="spinText">MINT</span> <span class="spin-icon">■</span></button><button id="turbo" class="secondary" aria-pressed="false">TURBO</button></div><div class="utility"><button id="rules">ROADMAP / PAYS</button><button id="historyLink">SESSION HISTORY</button></div></footer>
<div id="toast" role="status"></div><div id="celebration" aria-hidden="true"></div>
<dialog id="modal"><div class="modal-head"><span class="eyebrow" id="modalTag">XTRATA ARCADE</span><button id="close" aria-label="Close dialog">×</button></div><div id="modalContent"></div></dialog>
<div id="loading" role="status"><canvas class="loader-mark" id="loaderMark" width="360" height="230" aria-hidden="true"></canvas><p id="loadMsg">MINTING GENESIS 21</p><small>Genesis 21 · Xtrata Arcade</small></div><noscript><p class="noscript">Genesis 21 needs JavaScript to run.</p></noscript>

<!--SCRIPT-->
</body></html>"""
open('g21.shell.html','w').write(head + css + body)
print('css', len(css), 'shell ok')
