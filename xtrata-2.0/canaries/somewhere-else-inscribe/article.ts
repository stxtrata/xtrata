// Pure builders (no DOM, no network) for the two files the canary assembles from the pinned assets:
//   buildArticle: the article HTML, each image referenced by its inscription ID and carrying its chain hash
//   buildLoader:  the chain reader, pinned to the article's inscription ID and chain hash
// The output is byte-identical to the Python kit (finalize.py / build_article.py / build_loader.py); the mock-chain test checks that.

export type Asset = { slot: number; alt: string; width: number; height: number; bytes: number; rolling: string };

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

const CSS = `
:root{--bg:#f7f1e3;--fg:#1c2740;--mut:#5b6478;--acc:#d2601f;--line:#dccfb6;--card:#fbf7ec}
@media(prefers-color-scheme:dark){:root{--bg:#141b2d;--fg:#ece4d2;--mut:#9aa3b8;--acc:#f08a45;--line:#2c3650;--card:#1a2338}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--fg);font:19px/1.65 Georgia,"Iowan Old Style","Palatino Linotype",serif}
main{max-width:42rem;margin:0 auto;padding:2.5rem 20px 4rem}
h1{font-size:2.6rem;line-height:1.1;margin:.2em 0 .1em;letter-spacing:-.01em}
h2{font-size:1.55rem;line-height:1.25;margin:2.4em 0 .6em;color:var(--fg)}
h2::before{content:"";display:block;width:2.2rem;height:3px;background:var(--acc);margin-bottom:.7rem}
.by{color:var(--mut);margin:0 0 1.5rem;font-style:italic}
p{margin:0 0 1.1em}a{color:var(--acc);text-underline-offset:2px}
figure{margin:1.6rem -20px;text-align:center}
figure img{max-width:100%;height:auto;display:block;margin:0 auto;border-radius:3px;background:var(--card)}
@media(min-width:760px){figure{margin-left:-4rem;margin-right:-4rem}}
table{width:100%;border-collapse:collapse;margin:1.4em 0;font:16px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif}
th,td{text-align:left;padding:.55em .6em;border-bottom:1px solid var(--line);vertical-align:top}
th{border-bottom:2px solid var(--fg);font-weight:600}
ol{padding-left:1.4em}li{margin-bottom:.8em}li p{margin:0}
.colophon{margin-top:3.5rem;padding-top:1rem;border-top:1px solid var(--line);color:var(--mut);font:14px/1.5 system-ui,sans-serif}
`;

const COLOPHON = '<p class="colophon">Inscribed on Stacks with Xtrata. Text and all 24 images are stored on chain, and each image is checked against a fingerprint written into this page. Read it from the chain, with the proof, at the reader this was loaded from, or fetch the bytes yourself using the steps in the reader\'s proof box.</p>';

/**
 * @param source   the pandoc HTML of the article (assets/source-article.html)
 * @param assets   one entry per image in document order
 * @param ids      the 24 image inscription IDs in the same order (strings are accepted so tests can pass tokens)
 * @param resolver address pattern for an inscription, e.g. https://xtrata.xyz/inscription/{id}
 */
export function buildArticle(source: string, assets: Asset[], ids: (number | string)[], resolver: string): string {
  let h = source;
  h = h.replace(/<colgroup>[\s\S]*?<\/colgroup>/g, '');
  h = h.replace(/ style="[^"]*"/g, '');
  h = h.replace(/ class="(header|odd|even)"/g, '');
  h = h.replace(/ id="[^"]*"/g, '');
  let n = 0;
  h = h.replace(/<p><img [^>]*?\/><\/p>|<p>\[image: [\s\S]*?\]<\/p>/g, () => {
    const a = assets[n];
    const id = ids[n];
    if (!a || id === undefined) throw new Error(`article has more images than assets (image ${n + 1})`);
    n++;
    return `<figure><img src="${resolver.replace('{id}', String(id))}" data-ins="${id}" data-hash="${a.rolling}" data-bytes="${a.bytes}" `
      + `width="${a.width}" height="${a.height}" alt="${esc(a.alt)}" loading="lazy"></figure>`;
  });
  if (n !== assets.length) throw new Error(`article has ${n} images but ${assets.length} assets`);
  h = h.replace('<p>By Jim Crane</p>', '<p class="by">By Jim Crane</p>');
  const doc = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Somewhere Else</title>'
    + '<meta name="description" content="What happens when the NFT you own turns out to be a receipt for a file on someone else\'s server. By Jim Crane.">'
    + `<base target="_blank"><style>${CSS}</style></head><body><main>${h}${COLOPHON}</main></body></html>`;
  return doc.replace(/\n+/g, '\n');
}

export type LoaderConfig = {
  contract: string; articleId: number; articleHash: string; nodes: string[];
  timeoutMs: number; batch: number; parallel: number; parallelImages: number;
};

export function buildLoader(template: string, cfg: LoaderConfig, resolver: string): string {
  const ordered = {
    contract: cfg.contract, articleId: cfg.articleId, articleHash: cfg.articleHash, nodes: cfg.nodes,
    timeoutMs: cfg.timeoutMs, batch: cfg.batch, parallel: cfg.parallel, parallelImages: cfg.parallelImages
  };
  return template
    .split('__CONFIG__').join(JSON.stringify(ordered, null, 1))
    .split('__RESOLVER_LINK__').join(resolver.replace('{id}', String(cfg.articleId)));
}

export const LOADER_DEFAULTS = {
  contract: 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3',
  nodes: ['https://api.mainnet.hiro.so', 'https://xtrata.xyz/hiro/mainnet', 'https://stacks-node-api.mainnet.stacks.co'],
  timeoutMs: 20000, batch: 16, parallel: 2, parallelImages: 3
};
