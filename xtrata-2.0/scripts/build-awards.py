#!/usr/bin/env python3
"""
The five award records (docs/music/AWARDS-PLAN.md): one self-contained HTML file per class, written to public/awards/.
Run from xtrata-2.0/:  python3 scripts/build-awards.py

Each file is a small 3D model in plain HTML and CSS: a record floating in a glass case. Drag to turn it (or use the
arrow keys); left alone it sways gently. No images, fonts or outside files, so these same files are the masters that
get inscribed. Change the look here, never in the five files.

The plaque is engraved from the address the file is opened with (after `?` or after `#`, so it also works where a
viewer drops the query):
  n  the player's number            n=412
  a  the address that claimed it    a=SP10W2EEM757922QTVDZZ5CSEW55JEFNN30J69TM7
  b  its BNS name, if it has one    b=jim.btc
  p  paid plays made to earn it     p=100
  s  the seed: up to 8 hex digits   s=9f3a61c2
The seed makes one record different from every other in its class, and the same every time it is opened: it sets
where and when the glints catch, the smoke's shape and the dust's drift, the Diamond's deal of facets, the angle
the case rests at and where the two track gaps fall in the grooves. With no seed a file shows its standard look.
The level is the file itself (gold.html is always the Gold record). Everything is checked and written as plain text:
nothing passed in can add markup. The plaque always opens with "Xtrata Music Hero" above the Xtrata mark; with nothing passed
in, the level sits below it.

The look, class by class. Each step adds to the one below, and nothing is cartoon sparkle: it is light on a material.
  Classic  black vinyl under a soft downlight: twin highlights that slide across the grooves as the case turns
  Bronze   brushed bronze, a thin mist on the case floor, one glint that catches now and then
  Silver   polished silver, more mist, a reflection that crosses the glass, a few glints, a little dust in the light
  Gold     deep gold, smoke curling behind the record, gold dust rising through the light, a warm pool on the floor
  Diamond  a brilliant-cut disc whose facets flash light and dark as it turns, glints with a trace of colour at
           their tips, cool smoke, and soft spectral light thrown on the case floor
"""
import math, os, re

# The Xtrata mark: the three outlined forms of the logo, from the supplied vector (xtrata-logo-vector.svg).
LOGO_W = "M17 65 18 66V191L243 192 424 391H427L609 192H729L730 191H833V66L834 65 833 64H558L426 209H424L292 64H18zM29 119 32 117 271 118 423 284H428L580 118H794L795 117 820 118 822 120V179L821 180H603L428 372 424 373 248 180H31L30 179zM29 77 31 75 287 76 425 227 447 205 564 76 816 75 822 77V105L820 107H582L574 107 426 268H424L277 107H31L29 105z"
LOGO_B = "M812 193 809 197 760 238H620L605 253 589 272 436 439 541 555 621 641H759L764 643 809 681 825 682 826 681 822 676 784 645V643L792 641H837L758 555 753 552H742L640 440V437L734 333 741 326 755 325 807 268 836 239V238H784L783 235 791 227 828 196V194L826 193zM657 326H719L720 329 667 387H664V390L625 433 621 439 674 498 704 529 721 549 720 552H657L555 441 556 437zM626 251H802L803 254 748 313H651L537 438V440L648 562 652 565H750L797 616 804 625 803 628H627L455 441V439L463 429zM23 193 34 205 69 235 68 238H15V239L19 241 94 323 101 326H110L211 436V440L113 548 109 552H99L94 554 17 638 16 641H63L67 643V645L28 678 26 681 27 682 43 681 90 641H230L309 556 354 505 384 474 399 456 406 450 414 441V439L231 238H92L41 196 40 193zM136 326H193L195 327 295 437V442L279 458 194 552H131L130 549 230 439 179 381 174 377 132 331V328zM49 251H226L344 380 395 438V442L224 628H48L47 625 101 565H199L299 457 314 439 300 422 199 313H103L48 255z"
LOGO_O = "M834 687 831 684H822L817 686 812 684 811 685H606L427 490 423 491 413 501 246 685H28L27 684 18 685 17 689 18 791H288L291 790 424 644H427L562 791H831L833 790zM30 700 32 697H252L424 509H427L597 695 601 697H818L821 701V775L819 778H567L460 660 427 626 422 627 411 638 284 778H32L30 773z"

def metal(dark, mid, light, hot):
    """A turned-metal surface: two opposite highlights, as on a real record under one light."""
    half = [(0, dark), (30, mid), (50, light), (60, hot), (70, light), (98, mid), (132, dark), (158, mid), (180, dark)]
    return 'conic-gradient(' + ','.join([f'{c} {a}deg' for a, c in half] + [f'{c} {a+180}deg' for a, c in half[1:]]) + ')'

#            level  glints  smoke  dust  downlight  floor pool  halo  edge glow
CLASSES = {
 'diamond': dict(name='Diamond', t='#cfeaff', e='#dfe9ff', lvl=4, gl=8, sm='.46', du=30, dl='.30', pool=34, halo=60, eg=34,
   base='radial-gradient(circle,#fff,#dbe9f5 60%,#a9bdd1)', groove='rgba(70,100,140,.07)', spec='.75',
   label='radial-gradient(circle,#fff 0 30%,#dcebf7 60%,#9fb6cc)', x='#5a7fa6', rim='linear-gradient(#fff,#8fa6bd)',
   smoke='.85 .93 1', dust='#fff', glint='#fff'),
 'gold': dict(name='Gold', t='#f2c14a', e='#e9d9b0', lvl=3, gl=5, sm='.5', du=22, dl='.24', pool=36, halo=55, eg=28,
   base=metal('#4a3205', '#a8770f', '#f0cf6a', '#fffbe6'), groove='rgba(50,30,0,.30)', spec='.5',
   label='radial-gradient(circle,#fff6cf 0 18%,#dcae3a 55%,#8f6612)', x='#fff6cf', rim='linear-gradient(#f6d977,#6b4a08)',
   smoke='1 .88 .6', dust='#ffd76a', glint='#ffe9a3'),
 'silver': dict(name='Silver', t='#d5dde8', e='#cdd6e6', lvl=2, gl=3, sm='.34', du=8, dl='.18', pool=24, halo=40, eg=20,
   base=metal('#3e4650', '#8b95a3', '#dfe5ec', '#fff'), groove='rgba(15,25,40,.28)', spec='.5',
   label='radial-gradient(circle,#fff 0 18%,#c9d2de 55%,#727c8a)', x='#fff', rim='linear-gradient(#f4f6fa,#5c6673)',
   smoke='.86 .9 .96', dust='#e9eef5', glint='#eaf2ff'),
 'bronze': dict(name='Bronze', t='#d9905f', e='#e2c4b0', lvl=1, gl=1, sm='.22', du=0, dl='.14', pool=20, halo=42, eg=16,
   base=metal('#3d1f0c', '#8a5226', '#d9996a', '#ffe9d6'), groove='rgba(40,15,0,.30)', spec='.42',
   label='radial-gradient(circle,#ffe3cd 0 18%,#c98554 55%,#6f3d1c)', x='#ffe6d3', rim='linear-gradient(#e9a877,#4f2a11)',
   smoke='1 .82 .7', dust='#fff', glint='#ffd9bd'),
 'classic': dict(name='Classic', t='#3fd0c9', e='#a9cfcc', lvl=0, gl=0, sm='0', du=0, dl='.10', pool=14, halo=38, eg=12,
   base=metal('#020304', '#0d1014', '#2c333d', '#6b7785'), groove='rgba(255,255,255,.06)', spec='.38',
   label='radial-gradient(circle,#7df0e8 0 18%,#2bb8b0 55%,#157570)', x='#06302e', rim='linear-gradient(#3a424d,#050608)',
   smoke='1 1 1', dust='#fff', glint='#fff'),
}

# The Diamond's facets are drawn at load by FACETS_JS (a few lines) rather than stored as paths: 80 triangular shards
# in rings, as a brilliant cut looks from above. A real diamond is mostly white with uneven greys, a few near-black
# facets and the odd pale flash of colour, so the tones are dealt unevenly from that palette (same deal every time).
# Each face gets two different deals, one over the other; the top one is faded in and out as the case turns, so
# facets trade between light and dark. That trade is the flash a diamond gives.
FACETS_JS = ("var N=16,T=6.2832/N,W='fff,fff,fff,f3f8fc,e2ecf5,cfdbe6,b7c6d6,93a6ba,6d8096,3f4f63,fff,d5ecff,fff,eef4f9,fff1cc,ffe1f2'.split(','),"
             "pt=function(r,t){return(r*Math.cos(t)).toFixed(1)+' '+(r*Math.sin(t)).toFixed(1)};"
             "$('.k').forEach(function(e,x){z=(Z0+3+x%2*40)%2147483646+1;var F='',p=function(a,b,c){F+='<path fill=\"#'+W[R()*16|0]+'\" d=\"M'+a+'L'+b+'L'+c+'z\"/>'};"
             "for(i=0;i<N;i++){var a0=i*T,a1=a0+T,am=a0+T/2;p(pt(101,a0),pt(101,a1),pt(80,am));p(pt(101,a0),pt(80,am),pt(58,a0));p(pt(101,a0),pt(58,a0),pt(80,am-T));p(pt(80,am),pt(58,a1),pt(36,am));p(pt(80,am),pt(36,am),pt(58,a0))}"
             "e.innerHTML=F});")

def extras(c):
    """The parts only some classes have. Returns (css, markup inside the case, markup on each face of the record, svg defs)."""
    L = c['lvl']; css = ''; case = ''; face = ''; defs = ''
    if L >= 1:
        # Smoke: real fractal noise (an SVG filter), drawn once at a fixed size and scaled with the model (--z), drifting slowly.
        defs += ('<filter id="sm" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency=".007 .017" numOctaves="4" seed="8"/>'
                 '<feColorMatrix values="' + ' '.join('0 0 0 0 ' + v for v in c['smoke'].split()) + ' 2.6 0 0 0 -1.1"/></filter>')
        css += ('\n.sm{left:-24.5em;top:-8em;width:49em;height:42.6em;overflow:hidden;transform:translateZ(-7em);opacity:' + c['sm'] + ';-webkit-mask:radial-gradient(110% 100% at 50% 100%,#000 25%,transparent 78%);mask:radial-gradient(110% 100% at 50% 100%,#000 25%,transparent 78%);pointer-events:none}'
                '\n.sm i{position:absolute;left:0;top:0;width:540px;height:262px;transform-origin:0 0;scale:var(--z,1);filter:url(#sm);animation:sm 38s ease-in-out infinite alternate}'
                '\n.s2{top:12em;height:22.6em;transform:translateZ(8em);opacity:calc(' + c['sm'] + '*.7)}.s2 i{top:-70px;animation-duration:53s;animation-direction:alternate-reverse}'
                '\n@keyframes sm{to{translate:-38em}}'
                '\n.gs i{position:absolute;width:0;height:0;scale:0;animation:gt var(--d) linear var(--o) infinite}'
                '\n.gs i:before,.gs i:after{content:"";position:absolute;left:-8em;top:-.22em;width:16em;height:.44em;background:radial-gradient(closest-side,@GLINT@,transparent)}'
                '\n.gs i:after{rotate:90deg;scale:.6 1}'
                '\n.gs b{position:absolute;left:-1.2em;top:-1.2em;width:2.4em;height:2.4em;border-radius:50%;background:radial-gradient(circle,#fff 0 10%,#fffa 20%,transparent 68%)}'
                '\n@keyframes gt{0%,87%,100%{scale:0;rotate:-8deg}92%{scale:var(--k);rotate:0deg}95%{scale:calc(var(--k)*.6)}}'
                '\n@media (prefers-reduced-motion:reduce){.sm i{animation:none}.gs i{animation:none;scale:calc(var(--k)*.55)}}')
        case += '<div class="sm"><i></i></div><div class="sm s2"><i></i></div>'
    if L >= 2:
        css += ('\n.fr:after{content:"";position:absolute;inset:0;background:linear-gradient(105deg,transparent 45%,#ffffff20 50%,transparent 55%) 125% 0/300% 100%;animation:sw 9s ease-in-out infinite}'
                '\n@keyframes sw{0%,40%{background-position:125% 0}100%{background-position:-65% 0}}'
                '\n.du{width:.8em;height:.8em;margin:-.4em;border-radius:50%;background:radial-gradient(circle,#fff,' + c['dust'] + ' 35%,transparent 70%);opacity:0;animation:du var(--d) linear var(--o) infinite;pointer-events:none}'
                '\n@keyframes du{0%{translate:0 4em;opacity:0}18%,82%{opacity:var(--p)}100%{translate:var(--x) -7em;opacity:0}}'
                '\n@media (prefers-reduced-motion:reduce){.fr:after{animation:none}.du{animation:none;opacity:var(--p)}}')
    if L >= 4:
        css += ('\n.k{width:100%;height:100%}.k path{stroke:#fff6;stroke-width:.4}\n.r:after{content:"";position:absolute;inset:0;border-radius:50%;background:radial-gradient(55% 40% at 34% 26%,#fff9,transparent 62%)}'
                '\n.f{border-image:linear-gradient(135deg,#fff,#bfe6ff 30%,#ffd9f3 55%,#fff 75%,#c9ffe9) 1}'
                '\n.gs b:before,.gs b:after{content:"";position:absolute;left:-2.3em;top:1.05em;width:7em;height:.3em;background:radial-gradient(closest-side,#fff,transparent);rotate:45deg}.gs b:after{rotate:-45deg}'
                '\n.cx{width:46em;height:26em;left:-23em;top:-13em;transform:rotateX(-90deg) translateZ(34.6em);pointer-events:none}'
                '\n.cx i{position:absolute;inset:0;background:radial-gradient(8em 1.5em at 28% 38%,#7fd4ffaa,transparent 70%),radial-gradient(7em 1.3em at 72% 64%,#ffb0e0aa,transparent 70%),radial-gradient(6em 1.1em at 56% 26%,#fff3b0aa,transparent 70%),radial-gradient(9em 1.4em at 40% 76%,#b9ffe0aa,transparent 70%),radial-gradient(5em 1em at 80% 30%,#fffc,transparent 70%)}')
        case += '<div class="cx"><i></i></div>'
        face += '<svg class="k" viewBox="-100 -100 200 200"></svg><svg class="k kb" viewBox="-100 -100 200 200"></svg>'
    return css, case, face, defs

# Sizes are in em: 1em is 1% of the square the model sits in, so everything scales together.
TPL = r"""<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Xtrata Music · @NAME@ Record</title>
<style>
html,body{margin:0;height:100%;background:#040509;overflow:hidden}
body{display:grid;place-items:center}
.a{position:relative;width:min(100vw,100vh);aspect-ratio:1;font-size:calc(min(100vw,100vh)/100);--t:@T@;--e:@E@;--g1:58%;--g2:76%;perspective:150em;cursor:grab;touch-action:none;user-select:none;-webkit-user-select:none;outline:0;background:radial-gradient(46% 40% at 50% 46%,color-mix(in srgb,var(--t) 16%,transparent),transparent 74%),#040509}
.a:active{cursor:grabbing}
.m,.m>*,.w{position:absolute;transform-style:preserve-3d}
.m{left:50%;top:51%;width:0;height:0}
/* the glass case. The glow at its edges is painted inside each pane: a shadow would spill past the pane, the panes
   would then cut through one another in 3D, and the browser draws that as mismatched patches. */
.f{--c:color-mix(in srgb,var(--e) @EG@%,transparent);box-sizing:border-box;border:.16em solid color-mix(in srgb,var(--e) 80%,#fff);background:linear-gradient(90deg,var(--c),transparent 2.2em),linear-gradient(270deg,var(--c),transparent 2.2em),linear-gradient(var(--c),transparent 2.2em),linear-gradient(0deg,var(--c),transparent 2.2em),linear-gradient(125deg,#ffffff12,transparent 35%,transparent 70%,#ffffff0a)}
.fr,.bk{width:50em;height:70em;left:-25em;top:-35em}.fr{transform:translateZ(15em)}.bk{transform:translateZ(-15em)}
.lf,.rt{width:30em;height:70em;left:-15em;top:-35em}.lf{transform:rotateY(-90deg) translateZ(25em)}.rt{transform:rotateY(90deg) translateZ(25em)}
.tp,.bt{width:50em;height:30em;left:-25em;top:-15em}.tp{transform:rotateX(90deg) translateZ(35em)}.bt{transform:rotateX(-90deg) translateZ(35em);background:radial-gradient(60% 70%,color-mix(in srgb,var(--t) @POOL@%,transparent),transparent 72%),#07090e}
.pl{width:66em;height:46em;left:-33em;top:-23em;transform:rotateX(-90deg) translateZ(35.6em);background:linear-gradient(#0d1017,#06080c);border:.12em solid color-mix(in srgb,var(--e) 30%,transparent)}
.fl{width:220em;height:220em;left:-110em;top:-110em;transform:rotateX(-90deg) translateZ(38em);background:repeating-linear-gradient(0deg,color-mix(in srgb,var(--e) 26%,transparent) 0 .12em,transparent .12em 11em),repeating-linear-gradient(90deg,color-mix(in srgb,var(--e) 26%,transparent) 0 .12em,transparent .12em 11em);-webkit-mask:radial-gradient(circle,#000 12%,transparent 58%);mask:radial-gradient(circle,#000 12%,transparent 58%)}
/* one soft light from the top of the case */
.dl{left:-23em;top:-35em;width:46em;height:68em;transform:translateZ(-1.5em);background:conic-gradient(from 166deg at 50% 0,transparent,color-mix(in srgb,var(--t) 25%,#fff) 10deg 18deg,transparent 28deg);-webkit-mask:linear-gradient(transparent,#000 14%,transparent 94%);mask:linear-gradient(transparent,#000 14%,transparent 94%);opacity:@DL@;pointer-events:none}
.em{width:12em;height:12em;left:-6em;top:-33.6em}
/* the record: two identical faces back to back, with a few slices between them for an edge */
.w{width:38em;height:38em;left:-19em;top:-21.4em;animation:h 7s ease-in-out infinite}
.r,.rm,.gs{position:absolute;inset:0;border-radius:50%}
.rm{background:@RIM@}.rm+.rm{transform:translateZ(.16em)}.rm+.rm+.rm{transform:translateZ(-.16em)}
.r{overflow:hidden;transform:translateZ(.3em);backface-visibility:hidden;-webkit-backface-visibility:hidden}
.r+.r{transform:rotateY(180deg) translateZ(.3em)}
.gs{transform:translateZ(.5em);backface-visibility:hidden;-webkit-backface-visibility:hidden;pointer-events:none}
.gs+.gs{transform:rotateY(180deg) translateZ(.5em)}
.gl{position:absolute;inset:-5.5em;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--t) @HALO@%,transparent) 38%,transparent 70%);opacity:.6}
.r>*{position:absolute;inset:0;border-radius:50%}
.s{background:@BASE@}
.g{background:repeating-radial-gradient(circle,@GROOVE@ 0 .16em,transparent .28em .62em);-webkit-mask:radial-gradient(circle closest-side,transparent 39%,#000 40% 96%,transparent 97%);mask:radial-gradient(circle closest-side,transparent 39%,#000 40% 96%,transparent 97%)}
.v{background:radial-gradient(circle closest-side,transparent calc(var(--g1) - .5%),#ffffff26 var(--g1),transparent calc(var(--g1) + .6%)),radial-gradient(circle closest-side,transparent calc(var(--g2) - .5%),#ffffff26 var(--g2),transparent calc(var(--g2) + .6%)),radial-gradient(circle closest-side,transparent 68%,#0006);box-shadow:inset 0 0 0 .2em #fff7,inset 0 0 0 .5em #0003}
.h{--c:color-mix(in srgb,var(--t) 30%,#fff);background:conic-gradient(transparent 6deg,var(--c) 27deg,transparent 48deg 186deg,var(--c) 206deg,transparent 226deg);mix-blend-mode:screen;opacity:@SPEC@}
.l{inset:34%!important;background:@LABEL@;box-shadow:0 0 0 .16em #fff5,0 0 0 .5em #0004,inset 0 0 1.2em #0006;color:@X@;display:grid;place-items:center}
.l svg{width:70%;height:70%}
/* the plaque */
.q{width:34em;height:13.6em;left:-17em;top:20.9em;transform:translateZ(13em);backface-visibility:hidden;-webkit-backface-visibility:hidden;box-sizing:border-box;border:.16em solid color-mix(in srgb,var(--t) 70%,#000);border-radius:.3em;background:linear-gradient(#1c2029,#0b0d13 50%,#171b23);box-shadow:inset 0 .12em 0 #fff2;color:color-mix(in srgb,var(--t) 80%,#fff);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:.3em;font-family:ui-sans-serif,system-ui,sans-serif;text-align:center;white-space:nowrap;overflow:hidden}
.q svg{width:3.7em;height:3.3em}
.q .hr{font-size:1.1em;letter-spacing:.32em;opacity:.7}
.q small{font-size:1.45em;font-weight:600;letter-spacing:.18em;text-transform:uppercase;opacity:.85}.q .lc{text-transform:none;letter-spacing:.06em}
.q b{font-size:2.6em;line-height:1;letter-spacing:.03em;color:#fff}.q .t2{font-size:2.1em}.q .t3{font-size:1.55em}
.o{--cw:currentColor;--cb:currentColor;--co:currentColor}@EXCSS@
@keyframes h{50%{transform:translateY(-1em)}}
@media (prefers-reduced-motion:reduce){.w{animation:none}}
</style>
<svg width="0" height="0" style="position:absolute"><symbol id="x" viewBox="0 40 850 770"><path style="fill:var(--cw,#ececec)" fill-rule="evenodd" d="@LW@"/><path style="fill:var(--cb,#3a7db5)" fill-rule="evenodd" d="@LB@"/><path style="fill:var(--co,#e98a32)" fill-rule="evenodd" d="@LO@"/></symbol>@DEFS@</svg>
<div class="a" id="a" tabindex="0" role="img" aria-label="@NAME@ record award. Drag to turn it.">
<div class="m" id="m"><div class="fl"></div><div class="pl"></div><div class="f bk"></div><div class="f lf"></div><div class="f rt"></div><div class="f tp"></div><div class="f bt"></div><div class="dl"></div>@CASE@
<svg class="em"><use href="#x"/></svg>
<div class="w"><div class="gl"></div><div class="rm"></div><div class="rm"></div><div class="rm"></div>@FACE@@FACE@<div class="gs"></div><div class="gs"></div></div>
<div class="q" id="q"><small class="hr">Xtrata Music Hero</small><svg class="o"><use href="#x"/></svg><small>@NAME@ record</small></div>
<div class="f fr"></div></div>
</div>
<script>/* Drag, swipe or use the arrow keys to turn the model. The plaque is engraved from ?n= &a= &b= &p= (see scripts/build-awards.py). */
var $=function(s){return[].slice.call(document.querySelectorAll(s))},a=$('#a')[0],m=$('#m')[0],q=$('#q')[0],
P=new URLSearchParams(location.search+'&'+location.hash.slice(1)),G=function(k){return P.get(k)||''},
n=G('n').replace(/\D/g,'').slice(0,6),ad=G('a'),bn=G('b').toLowerCase(),pl=G('p').replace(/\D/g,'').slice(0,7);
if(!/^S[PM][0-9A-Z]{28,41}$/.test(ad))ad='';if(!/^[a-z0-9_-]{1,37}(\.[a-z0-9_-]{1,20}){1,2}$/.test(bn))bn='';
function L(t,x,c){var e=document.createElement(t);e.textContent=x;if(c)e.className=c;q.appendChild(e)}
if(n||ad||bn||pl){q.lastChild.remove();L('small','@NAME@ record'+(n?' · No. '+n.padStart(4,'0'):''));var sh=ad?ad.slice(0,6)+'…'+ad.slice(-5):'',w=bn||sh,r=[];
if(w)L('b',w,w.length>24?'t3':w.length>15?'t2':'');if(bn&&sh)r.push(sh);if(pl)r.push((+pl).toLocaleString('en')+' paid play'+(pl==1?'':'s'));if(r.length)L('small',r.join(' · '),'lc')}
function Z(){a.style.setProperty('--z',a.clientWidth/600)}Z();onresize=Z;
/* Everything scattered or timed is dealt from the seed (?s=, up to 8 hex digits): one record differs from the next, and each is the same every time. */
var Z0=parseInt((G('s').match(/^[0-9a-f]{1,8}$/i)||['6'])[0],16)%2147483646+1,z=Z0,R=function(){return(z=z*16807%2147483647)/2147483647},i,e,A0=-18+R()*16-8,PH=R()*6.283;
a.style.setProperty('--g1',52+R()*10+'%');a.style.setProperty('--g2',70+R()*10+'%');
for(i=0;i<@GL@;i++){var ga=R()*6.283,gr=20+R()*27,gc='left:'+(50+gr*Math.cos(ga))+'%;top:'+(50+gr*Math.sin(ga))+'%;--k:'+(1-i*.07)+';--d:'+(6+R()*8)+'s;--o:-'+R()*12+'s';$('.gs').forEach(function(s){e=document.createElement('i');e.innerHTML='<b></b>';e.style.cssText=gc;s.appendChild(e)})}
for(i=0;i<@DU@;i++){e=document.createElement('i');e.className='du';e.style.cssText='--p:'+(.25+R()*.6)+';--x:'+(R()*6-3)+'em;--d:'+(9+R()*10)+'s;--o:-'+R()*19+'s;scale:'+(.4+R()*.9)+';transform:translate3d('+(R()*40-20)+'em,'+(R()*56-26)+'em,'+(R()*24-12)+'em) rotateY('+(i%3?0:90)+'deg)';m.appendChild(e)}
$('feTurbulence').forEach(function(e){e.setAttribute('seed',Z0%997)});$('.sm i').forEach(function(e){e.style.animationDelay=-R()*30+'s'});
@FJS@
var S=$('.s'),H=$('.h'),K=$('.kb'),C=$('.cx i'),rx=-8,ry=A0,v=0,d=0,px,py,still=matchMedia('(prefers-reduced-motion:reduce)').matches;
a.onpointerdown=function(e){d=1;px=e.clientX;py=e.clientY;v=0;a.setPointerCapture(e.pointerId)};
a.onpointermove=function(e){if(!d)return;v=(e.clientX-px)*.45;ry+=v;rx=Math.max(-40,Math.min(40,rx-(e.clientY-py)*.3));px=e.clientX;py=e.clientY};
a.onpointerup=a.onpointercancel=function(){d=0};
a.onkeydown=function(e){var k={ArrowLeft:-4,ArrowRight:4}[e.key];if(k){v=k;e.preventDefault()}};
(function f(t){if(!d){ry+=v;v*=.94;if(Math.abs(v)<.05){var g=Math.round(ry/360)*360+(still?A0:24*Math.sin(t/2600+PH));ry+=(g-ry)*.03;rx+=(-8-rx)*.03}}
m.style.transform='rotateX('+rx+'deg) rotateY('+ry+'deg)';
/* the light stays put while the case turns: highlights slide over the record, and the diamond's facets trade light for dark */
S.forEach(function(e){e.style.transform='rotate('+(ry*1.1-rx*1.5)+'deg)'});H.forEach(function(e){e.style.transform='rotate('+(40+ry*1.9+rx)+'deg)'});
K.forEach(function(e){e.style.opacity=.5+.5*Math.sin((ry*7+rx*5)*.01745)});C.forEach(function(e){e.style.transform='rotate('+ry*.7+'deg)'});
requestAnimationFrame(f)})(0);
</script></html>
"""

def main():
    os.makedirs('public/awards', exist_ok=True)
    for cid, c in CLASSES.items():
        excss, case, kface, defs = extras(c)
        face = '<div class="r"><div class="s"></div>' + kface + '<div class="g"></div><div class="v"></div><div class="h"></div><div class="l"><svg class="o"><use href="#x"/></svg></div></div>'
        glint = '#fff 0 22%,#a9e0ff 46%,#ffc0e6 72%' if c['lvl'] >= 4 else '#fff 0 18%,' + c['glint'] + ' 50%'
        h = TPL.replace('@FJS@\n', FACETS_JS + '\n' if c['lvl'] >= 4 else '').replace('@EXCSS@', excss.replace('@GLINT@', glint)).replace('@CASE@', case).replace('@FACE@', face).replace('@DEFS@', defs)
        for k, v in dict(NAME=c['name'], T=c['t'], E=c['e'], BASE=c['base'], GROOVE=c['groove'], LABEL=c['label'], X=c['x'], RIM=c['rim'], SPEC=c['spec'],
                         EG=c['eg'], POOL=c['pool'], HALO=c['halo'], DL=c['dl'], GL=c['gl'], DU=c['du'], LW=LOGO_W, LB=LOGO_B, LO=LOGO_O).items():
            h = h.replace('@' + k + '@', str(v))
        assert not re.search(r'@[A-Z]+@', h), re.findall(r'@[A-Z]+@', h)
        open(f'public/awards/{cid}.html', 'w').write(h)
        print(cid, len(h.encode()))

if __name__ == '__main__':
    main()
