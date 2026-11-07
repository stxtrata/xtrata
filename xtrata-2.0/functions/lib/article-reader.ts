/**
 * /a/<id> (alias /article/<id>): a reading view for any inscription, best for articles.
 *
 * /i/<id> serves the raw bytes and /x/<id> opens the Explorer. /a/<id> sits between them: a thin
 * Xtrata page with proper link previews (crawlers do not run JavaScript, so the og/twitter tags are
 * written here, on the server), a strip naming the inscription, the content itself, and ways into
 * the rest of Xtrata after it.
 *
 * Safety: the inscription never runs as xtrata.xyz. The browser fetches /i/<id>, hashes the bytes,
 * and renders HTML in an iframe sandboxed WITHOUT allow-same-origin (the same rule as every in-app
 * frame; see content-isolation.ts). Popups (so the article's own links open) are allowed only for a
 * registered article whose bytes match the SHA-256 pinned below.
 *
 * To add an article: inscribe it, add an entry to ARTICLES (sha256 of the exact bytes /i/<id>
 * serves, a 1200x630 card under public/a/cards/), and it shows up on /a/ as well.
 */

export type ArticleEntry = {
  id: string;
  title: string;
  author: string;
  /** X handle without @, for twitter:creator and the byline link. */
  authorX?: string;
  /** ISO date. */
  date: string;
  description: string;
  /** Site-relative path to a 1200x630 share card. */
  card?: string;
  sha256: string;
  bytes: number;
  images?: number;
};

export const ARTICLES: ArticleEntry[] = [
  {
    id: '3654',
    title: 'Somewhere Else',
    author: 'Jim.btc',
    authorX: 'jimdotbtc',
    date: '2026-11-06',
    description:
      "I checked where the 250 biggest Stacks NFT collections keep their art. 34 can't reach it any more. One of them is mine. The full article, and all 24 of its images, are inscribed on Stacks.",
    card: '/a/cards/3654-v2.jpg',
    sha256: 'cd4eed375e9d0628fe7478c67c1cf3fdb848a0e67f399751f3500d69adcbea10',
    bytes: 49122,
    images: 24
  }
];

export const SITE = 'https://xtrata.xyz';
export const SITE_X = 'XtrataLayers';

export const findArticle = (id: string) => ARTICLES.find((a) => a.id === id) ?? null;

/** Inscription ids are plain decimal numbers. Anything else is refused before any lookup. */
export const cleanId = (raw: unknown): string | null => {
  const text = String(Array.isArray(raw) ? raw[0] : raw ?? '')
    .trim()
    .replace(/^#/, '');
  return /^\d{1,12}$/.test(text) ? String(Number(text)) : null;
};

export const esc = (value: unknown) =>
  String(value ?? '').replace(/[&<>"']/g, (c) =>
    c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : '&#39;'
  );

/** JSON for a <script type="application/json"> block: no way to close the tag from inside. */
export const scriptJson = (value: unknown) =>
  JSON.stringify(value).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026');

const decodeEntities = (text: string) =>
  text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');

const clip = (text: string, max: number) => {
  const t = text.replace(/\s+/g, ' ').trim();
  return t.length > max ? t.slice(0, max - 1).trimEnd() + '…' : t;
};

export type HeadInfo = { title: string | null; description: string | null; firstImage: string | null };

/** Pull a title, description and first inscribed image from an HTML inscription's text. */
export function readHead(html: string): HeadInfo {
  const head = html.slice(0, 200_000);
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(head)?.[1] ?? /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(head)?.[1];
  const metaDesc =
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i.exec(head)?.[1] ??
    /<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i.exec(head)?.[1];
  const firstPara = /<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/i.exec(head)?.[1];
  const img = /<img[^>]+src=["'](\/i\/\d+)["']/i.exec(head)?.[1] ?? null;
  const strip = (s?: string) => (s ? clip(decodeEntities(s.replace(/<[^>]+>/g, '')), 300) : null);
  return {
    title: strip(title) || null,
    description: strip(metaDesc) || strip(firstPara) || null,
    firstImage: img
  };
}

export type PageMeta = {
  id: string;
  title: string;
  description: string;
  image: string | null;
  canonical: string;
  article: ArticleEntry | null;
  /** Content type of /i/<id> when the server looked, so the page can say what it is before loading. */
  contentType: string | null;
};

export function buildMeta(
  id: string,
  head: HeadInfo | null,
  contentType: string | null,
  canonical = `${SITE}/a/${id}`
): PageMeta {
  const article = findArticle(id);
  const isImage = !!contentType && /^image\//i.test(contentType);
  const title = article?.title ?? head?.title ?? `Inscription #${id}`;
  const description =
    article?.description ??
    head?.description ??
    `Inscription #${id}, stored on Stacks with Xtrata. Read it here, or fetch it straight from the chain.`;
  const image = article?.card
    ? SITE + article.card
    : head?.firstImage
      ? SITE + head.firstImage
      : isImage
        ? `${SITE}/i/${id}`
        : null;
  return { id, title, description, image, canonical, article, contentType };
}

const fmtDate = (iso: string) => {
  const d = new Date(iso + 'T12:00:00Z');
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
};

const LOGO = '/nftcheck/xtrata-x.webp';

const STYLE = `
:root{color-scheme:dark;--bg:#06080d;--panel:#0f1521;--panel2:#141d2d;--line:#223047;--ink:#e6edf6;--mut:#9aa9bf;--acc:#3ea6ff;--cyan:#5ee9ff;--good:#3ddc97;--warn:#f5c451;--orange:#ff9f43;--mono:ui-monospace,SFMono-Regular,Menlo,monospace}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;min-height:100vh;color:var(--ink);font:16px/1.55 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;background:var(--bg)}
a{color:var(--cyan)}
:focus-visible{outline:2px solid var(--cyan);outline-offset:2px}
header.top{display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px max(16px,env(safe-area-inset-left,0px)) 12px max(16px,env(safe-area-inset-right,0px));border-bottom:1px solid var(--line)}
.logo{display:inline-flex;align-items:center;font-weight:800;font-size:20px;letter-spacing:.4px;color:var(--ink);text-decoration:none}
.logo img{display:block;border-radius:4px;margin-right:1px}
header.top .sub{color:var(--mut);font-size:14px}
header.top nav{margin-left:auto;display:flex;gap:14px;font-size:14px}
header.top nav a{color:var(--mut);text-decoration:none}
header.top nav a:hover{color:var(--ink)}
.strip{position:sticky;top:0;z-index:5;background:rgba(6,8,13,.92);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border-bottom:1px solid var(--line)}
.strip-in{max-width:1000px;margin:0 auto;padding:10px max(16px,env(safe-area-inset-left,0px)) 10px max(16px,env(safe-area-inset-right,0px));display:flex;gap:10px 16px;align-items:center;flex-wrap:wrap}
.chip{font:600 13px var(--mono);color:var(--cyan);border:1px solid #1d4a5e;background:#08202b;border-radius:999px;padding:3px 10px;white-space:nowrap}
.strip .what{color:var(--mut);font-size:14px;flex:1 1 220px;min-width:0}
.strip .what b{color:var(--ink);font-weight:600}
.btns{display:flex;gap:8px;flex-wrap:wrap}
.btn{display:inline-flex;align-items:center;gap:6px;min-height:34px;padding:5px 12px;border-radius:8px;border:1px solid var(--line);background:var(--panel);color:var(--ink);text-decoration:none;font-size:14px;white-space:nowrap}
.btn:hover{border-color:var(--cyan)}
.btn.main{background:var(--acc);border-color:var(--acc);color:#04101c;font-weight:600}
.proof{max-width:1000px;margin:0 auto;padding:8px max(16px,env(safe-area-inset-left,0px)) 0 max(16px,env(safe-area-inset-right,0px));font:12.5px/1.45 var(--mono);color:var(--mut);min-height:26px}
.proof .ok{color:var(--good)}.proof .bad{color:var(--warn)}
.stage{max-width:1000px;margin:12px auto 0;padding:0 max(16px,env(safe-area-inset-left,0px)) 0 max(16px,env(safe-area-inset-right,0px))}
.frame{border:1px solid var(--line);border-radius:14px;overflow:hidden;background:var(--panel)}
.frame iframe{display:block;width:100%;height:80vh;border:0;background:transparent}
.frame.article iframe{height:1400px}
.frame img,.frame video{display:block;max-width:100%;margin:0 auto}
.frame audio{display:block;width:100%;padding:24px}
.frame pre{margin:0;padding:20px;white-space:pre-wrap;word-break:break-word;font:14px/1.6 var(--mono);max-height:80vh;overflow:auto}
.loading{padding:60px 20px;text-align:center;color:var(--mut);font:14px var(--mono)}
.after{max-width:1000px;margin:40px auto 0;padding:0 max(16px,env(safe-area-inset-left,0px)) 70px max(16px,env(safe-area-inset-right,0px))}
.after h2{font-size:22px;line-height:1.25;margin:0 0 6px}
.after .lead{color:var(--mut);margin:0 0 16px;max-width:640px}
.doors{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr));gap:12px}
.door{display:flex;flex-direction:column;gap:6px;padding:16px;border:1px solid var(--line);border-radius:12px;background:var(--panel);color:var(--ink);text-decoration:none;min-width:0}
.door:hover{border-color:var(--cyan);background:var(--panel2)}
.door .k{font:600 12px var(--mono);letter-spacing:.06em;text-transform:uppercase;color:var(--cyan)}
.door .t{font-weight:700;font-size:17px}
.door .d{color:var(--mut);font-size:14px}
.door .go{margin-top:auto;padding-top:6px;font-size:14px;color:var(--cyan)}
.more{margin-top:22px;color:var(--mut);font-size:14px;display:flex;flex-wrap:wrap;gap:6px 14px}
.more a{color:var(--ink)}
footer{margin-top:26px;padding-top:14px;border-top:1px solid var(--line);color:var(--mut);font-size:13px;max-width:760px}
.list{display:grid;gap:12px;margin-top:16px}
.list a.door{flex-direction:row;align-items:center;gap:16px}
.list img{width:160px;max-width:40%;aspect-ratio:1200/630;object-fit:cover;border-radius:8px;flex:none}
@media (max-width:560px){header.top nav{display:none}.strip .extra{display:none}.strip-in{padding-block:8px}.btn{min-height:30px;padding:4px 10px;font-size:13px}.frame{border-radius:0;border-left:0;border-right:0;margin:0 calc(-1 * max(16px,env(safe-area-inset-left,0px)))}}
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important}}
`;

export function headTags(m: PageMeta, titleOverride?: string) {
  const a = m.article;
  const t = titleOverride ?? (a ? `${a.title} · by ${a.author}` : m.title);
  const tags = [
    `<title>${esc(t)}</title>`,
    `<meta name="description" content="${esc(m.description)}">`,
    `<link rel="canonical" href="${esc(m.canonical)}">`,
    `<meta property="og:site_name" content="Xtrata">`,
    `<meta property="og:type" content="${a ? 'article' : 'website'}">`,
    `<meta property="og:title" content="${esc(a ? a.title : m.title)}">`,
    `<meta property="og:description" content="${esc(m.description)}">`,
    `<meta property="og:url" content="${esc(m.canonical)}">`,
    `<meta name="twitter:card" content="${m.image ? 'summary_large_image' : 'summary'}">`,
    `<meta name="twitter:site" content="@${SITE_X}">`,
    `<meta name="twitter:title" content="${esc(a ? a.title : m.title)}">`,
    `<meta name="twitter:description" content="${esc(m.description)}">`
  ];
  if (m.image) {
    tags.push(
      `<meta property="og:image" content="${esc(m.image)}">`,
      `<meta name="twitter:image" content="${esc(m.image)}">`
    );
    if (a?.card) tags.push(`<meta property="og:image:width" content="1200">`, `<meta property="og:image:height" content="630">`);
  }
  if (a?.authorX) tags.push(`<meta name="twitter:creator" content="@${esc(a.authorX)}">`);
  if (a) tags.push(`<meta property="article:published_time" content="${esc(a.date)}">`);
  return tags.join('\n');
}

const header = (sub: string) =>
  `<header class="top"><a class="logo" href="/" aria-label="Xtrata"><img src="${LOGO}" alt="" width="28" height="28"><span aria-hidden="true">trata</span></a><span class="sub">${esc(sub)}</span><nav aria-label="Xtrata"><a href="/x/">Explore</a><a href="/nftcheck/">NFT Check</a><a href="/forever-twins/">Forever Twins</a><a href="/inscribe">Inscribe</a></nav></header>`;

const doors = `
<div class="doors">
  <a class="door" href="/nftcheck/"><span class="k">Holders</span><span class="t">Check your NFTs</span><span class="d">Paste a Stacks wallet and see where the art you hold actually lives.</span><span class="go">NFT Check →</span></a>
  <a class="door" href="/forever-twins/"><span class="k">Collections</span><span class="t">Give it a Forever Twin</span><span class="d">A verified on-chain copy of each token's art, tied to the original.</span><span class="go">Forever Twins →</span></a>
  <a class="door" href="/x/__ID__"><span class="k">Explore</span><span class="t">See it in the Explorer</span><span class="d">This inscription among thousands of others, with its images beside it.</span><span class="go">Xtrata Explorer →</span></a>
  <a class="door" href="/inscribe"><span class="k">Create</span><span class="t">Inscribe your own</span><span class="d">Art, music, games or a long read like this one, written to Stacks.</span><span class="go">Inscribe →</span></a>
</div>
<p class="more">Also on Xtrata: <a href="/arcade">Arcade</a><a href="/x/3072">X Chess</a><a href="https://radio.xtrata.xyz/radio">Music</a><a href="/casino/">Casino</a><a href="/a/">All articles</a><a href="https://x.com/${SITE_X}">@${SITE_X}</a></p>`;

/** Client script: fetch the bytes, hash them, render safely, size article frames to their content. */
const CLIENT = `
(function(){
  var cfg = JSON.parse(document.getElementById('cfg').textContent);
  var stage = document.getElementById('stage');
  var proof = document.getElementById('proof');
  var id = cfg.id;
  function hex(buf){return Array.prototype.map.call(new Uint8Array(buf),function(b){return ('0'+b.toString(16)).slice(-2)}).join('')}
  function kb(n){return n<1024?n+' bytes':(n/1024).toFixed(1)+' KB'}
  function fail(msg){
    stage.innerHTML='';
    var d=document.createElement('div');d.className='loading';
    d.innerHTML=msg+' <a href="/i/'+id+'">Open the raw inscription</a>.';
    stage.appendChild(d);
  }
  var REPORT = '<script>(function(){function s(){try{parent.postMessage({xtrataA:1,h:Math.ceil(document.documentElement.scrollHeight)},"*")}catch(e){}}'
    + 'addEventListener("load",s);addEventListener("resize",s);'
    + 'if(window.ResizeObserver)new ResizeObserver(s).observe(document.documentElement);'
    + 'document.addEventListener("load",s,true);setTimeout(s,50);setTimeout(s,800);})()<\\/script>';
  fetch('/i/'+id,{credentials:'omit'}).then(function(r){
    if(!r.ok) throw new Error('status '+r.status);
    var type=(r.headers.get('content-type')||'').toLowerCase();
    return r.arrayBuffer().then(function(buf){return {buf:buf,type:type}});
  }).then(function(res){
    var size=res.buf.byteLength;
    var hashP = (window.crypto&&crypto.subtle)?crypto.subtle.digest('SHA-256',res.buf).then(hex):Promise.resolve(null);
    return hashP.then(function(h){
      var art=cfg.article, verified=false, line='Inscription #'+id+' · '+kb(size)+' · '+(res.type.split(';')[0]||'unknown type');
      if(h){
        if(art&&art.sha256){
          verified = h===art.sha256 && size===art.bytes;
          line += verified
            ? ' · <span class="ok">✓ bytes match the fingerprint recorded for this article</span> (SHA-256 '+h.slice(0,12)+'…)'
            : ' · <span class="bad">these bytes differ from the fingerprint recorded for this article</span>';
        } else {
          line += ' · SHA-256 '+h.slice(0,16)+'…';
        }
      }
      proof.innerHTML=line;
      render(res.buf,res.type,verified);
    });
  }).catch(function(){fail('The inscription could not be loaded just now.')});

  function render(buf,type,verified){
    stage.innerHTML='';
    var frame=document.createElement('div');frame.className='frame';
    var url='/i/'+id;
    if(/^image\\//.test(type)){
      var img=new Image();img.src=url;img.alt='Inscription #'+id;frame.appendChild(img);
    } else if(/^video\\//.test(type)){
      var v=document.createElement('video');v.src=url;v.controls=true;v.playsInline=true;frame.appendChild(v);
    } else if(/^audio\\//.test(type)){
      var a=document.createElement('audio');a.src=url;a.controls=true;frame.appendChild(a);
    } else if(/html/.test(type)){
      var text=new TextDecoder('utf-8').decode(buf);
      var f=document.createElement('iframe');
      f.title=cfg.title;
      f.setAttribute('sandbox', verified ? 'allow-scripts allow-popups allow-popups-to-escape-sandbox' : 'allow-scripts');
      f.setAttribute('referrerpolicy','no-referrer');
      f.srcdoc=text+REPORT;
      if(cfg.article) frame.classList.add('article');
      window.addEventListener('message',function(e){
        if(e.source!==f.contentWindow||!e.data||e.data.xtrataA!==1)return;
        var h=Math.max(200,Math.min(400000,Number(e.data.h)||0));
        f.style.height=h+'px';
      });
      frame.appendChild(f);
    } else if(/^text\\/|json|javascript|xml/.test(type)){
      var pre=document.createElement('pre');pre.textContent=new TextDecoder('utf-8').decode(buf.slice(0,400000));frame.appendChild(pre);
    } else {
      fail('This inscription is a file type the reader does not display.');return;
    }
    stage.appendChild(frame);
  }
})();
`;

export function renderReader(m: PageMeta): string {
  const a = m.article;
  const what = a
    ? `<b>${esc(a.title)}</b> by ${a.authorX ? `<a href="https://x.com/${esc(a.authorX)}">${esc(a.author)}</a>` : esc(a.author)} <span class="extra">· ${esc(fmtDate(a.date))}. Stored on Stacks${a.images ? `, with each of its ${a.images} images an inscription of its own` : ''}.</span>`
    : `<b>${esc(m.title)}</b><span class="extra">, stored on Stacks.</span>`;
  const cfg = { id: m.id, title: m.title, article: a ? { sha256: a.sha256, bytes: a.bytes } : null };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${headTags(m)}
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<style>${STYLE}</style>
</head>
<body>
${header(a ? 'Articles' : 'Reader')}
<div class="strip"><div class="strip-in">
  <span class="chip">#${esc(m.id)}</span>
  <span class="what">${what}</span>
  <span class="btns"><a class="btn" href="/i/${esc(m.id)}" title="The inscription itself, with nothing around it">Raw inscription</a><a class="btn main" href="/x/${esc(m.id)}">Open in Explorer</a></span>
</div></div>
<div class="proof" id="proof" aria-live="polite">Reading inscription #${esc(m.id)}…</div>
<main class="stage" id="stage"><div class="loading">Loading inscription #${esc(m.id)}…</div>
<noscript><div class="loading">This page needs JavaScript to show the inscription. <a href="/i/${esc(m.id)}">Open the raw inscription</a> instead.</div></noscript></main>
<section class="after" aria-labelledby="next">
  <h2 id="next">${a ? 'Where to next' : 'More on Xtrata'}</h2>
  <p class="lead">${a ? 'Xtrata writes files directly onto Stacks, so they stay readable without anyone paying to keep a server on. This article is one of them.' : 'Xtrata writes files directly onto Stacks, so they stay readable without anyone paying to keep a server on.'}</p>
  ${doors.replace('__ID__', esc(m.id))}
  <footer>This page is a convenience. Inscription #${esc(m.id)} lives on Stacks and can be read from the chain without it, through any Stacks node, by its number.</footer>
</section>
<script type="application/json" id="cfg">${scriptJson(cfg)}</script>
<script>${CLIENT}</script>
</body>
</html>`;
}

export function renderIndex(): string {
  const items = ARTICLES.map(
    (a) =>
      `<a class="door" href="/a/${esc(a.id)}">${a.card ? `<img src="${esc(a.card)}" alt="">` : ''}<span style="display:flex;flex-direction:column;gap:4px;min-width:0"><span class="k">#${esc(a.id)} · ${esc(fmtDate(a.date))}</span><span class="t">${esc(a.title)}</span><span class="d">by ${esc(a.author)}. ${esc(clip(a.description, 160))}</span></span></a>`
  ).join('');
  const m: PageMeta = {
    id: '',
    title: 'Articles on Xtrata',
    description: 'Long reads inscribed on Stacks: text and images stored on chain, readable without anyone keeping a server alive.',
    image: ARTICLES[0]?.card ? SITE + ARTICLES[0].card : null,
    canonical: `${SITE}/a/`,
    article: null,
    contentType: null
  };
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${headTags(m)}
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<style>${STYLE}</style>
</head>
<body>
${header('Articles')}
<section class="after" style="margin-top:28px">
  <h2>Articles</h2>
  <p class="lead">Long reads inscribed on Stacks. The text and every image are stored on chain. Any inscription can be read here too, at /a/ followed by its number.</p>
  <div class="list">${items}</div>
</section>
</body>
</html>`;
}

/**
 * Link-preview crawlers. Only these get server-written previews on /i/ and /x/, so people and
 * every other client keep getting exactly what they got before.
 */
const PREVIEW_BOT =
  /\b(Twitterbot|facebookexternalhit|Facebot|LinkedInBot|Discordbot|Slackbot|Slack-ImgProxy|TelegramBot|WhatsApp|redditbot|Embedly|SkypeUriPreview|Pinterestbot|Mastodon|Bluesky Cardyb|Iframely|vkShare|Applebot|Google-PageRenderer|bingbot|Googlebot)\b/i;

export const isPreviewBot = (userAgent: string | null | undefined) => !!userAgent && PREVIEW_BOT.test(userAgent);

/** A tiny page for crawlers only: the preview tags and a link to the thing itself. */
export function renderPreview(m: PageMeta, titleOverride?: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
${headTags(m, titleOverride)}
</head>
<body><p><a href="${esc(m.canonical)}">${esc(titleOverride ?? m.title)}</a></p><p>${esc(m.description)}</p></body>
</html>`;
}

/** Put a page's own title, description and preview tags into the app shell's <head>. */
export function injectMeta(shell: string, m: PageMeta, title: string): string {
  const tags = headTags(m, title)
    .split('\n')
    .filter((t) => !/^<title>|name="description"/.test(t))
    .join('\n');
  let out = shell.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  out = /<meta\s+name=["']description["'][^>]*>/i.test(out)
    ? out.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${esc(m.description)}" />`)
    : out;
  return out.replace(/<\/head>/i, `${tags}\n</head>`);
}
