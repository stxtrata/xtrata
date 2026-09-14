const decode = (s: string) => s.replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (_all,n) => {
 const code=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):parseInt(n,10);
 return code>0 && code<=0x10ffff?String.fromCodePoint(code):'';
}).replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const clean=(value: unknown)=>typeof value==='string'?decode(value).replace(/<[^>]*>/g,'').trim().slice(0,200):'';
/** Parse known player metadata as data. Inscription scripts are never executed. */
export function inscriptionMetadata(html: string) {
 let title='',artist='',album='';
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  if(!/application\/(?:ld\+)?json/i.test(match[1])) continue;
  try {const data=JSON.parse(match[2]);
   const m=data.metadata || data;
   title ||= clean(m.title || m.name);
   artist ||= clean(m.artist) || clean(m.byArtist?.name);
   album ||= clean(m.album) || clean(m.album?.name) || clean(m.inAlbum?.name) || clean(m.inAlbum);
  } catch { /* other scripts or invalid metadata */ }
 }
 title ||= clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
 const rawArtist=html.match(/"artist"\s*:\s*("(?:\\.|[^"\\])*")/i)?.[1];
 try {if(rawArtist) artist ||= clean(JSON.parse(rawArtist));} catch { /* invalid JSON string */ }
 artist ||= clean(html.match(/<(?:p|span|div)\b[^>]*class=["'][^"']*\bartist\b[^"']*["'][^>]*>([^<]*)</i)?.[1]);
 const rawAlbum=html.match(/"album"\s*:\s*("(?:\\.|[^"\\])*")/i)?.[1];
 try {if(rawAlbum) album ||= clean(JSON.parse(rawAlbum));} catch { /* invalid JSON string */ }
 album ||= clean(html.match(/<(?:p|span|div)\b[^>]*class=["'][^"']*\balbum\b[^"']*["'][^>]*>([^<]*)</i)?.[1]);
 return {title,artist,album};
}

/** Raster data images and HTTPS artwork only; inscription scripts are never executed. */
export function safeArtwork(value: unknown): string {
 if(typeof value!=='string')return '';
 const source=decode(value).trim();
 if(source.length<=700000 && /^data:image\/(?:png|jpeg|webp|gif|avif);base64,[a-z0-9+/]+={0,2}$/i.test(source))return source;
 if(source.length>2048)return '';
 try {const url=new URL(source);return url.protocol==='https:'&&!url.username&&!url.password?url.href:'';}catch{return '';}
}
export function inscriptionArtwork(html: string): string {
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  if(!/application\/(?:ld\+)?json/i.test(match[1]))continue;
  try {const data=JSON.parse(match[2]),m=data.metadata||data;
   for(const value of [m.image?.url,m.image,m.artwork,m.cover]) {const cover=safeArtwork(value);if(cover)return cover;}
  }catch { /* invalid metadata */ }
 }
 for(const match of html.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["']/gi)) {const cover=safeArtwork(match[1]);if(cover)return cover;}
 return '';
}

/** Match the embedded audio source accepted by the radio, not game sound effects in scripts. */
export function inscriptionHasAudio(html: string): boolean {
 return /<(?:source|audio)\b[^>]*\bsrc=["']data:audio\/[^"']+["']/i.test(html);
}
