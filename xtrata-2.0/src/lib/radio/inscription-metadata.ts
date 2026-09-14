const decode = (s: string) => s.replace(/&#(x[0-9a-f]+|[0-9]+);/gi, (_all,n) => {
 const code=n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):parseInt(n,10);
 return code>0 && code<=0x10ffff?String.fromCodePoint(code):'';
}).replace(/&quot;/g,'"').replace(/&#39;|&apos;/g,"'").replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');
const clean=(value: unknown)=>typeof value==='string'?decode(value).replace(/<[^>]*>/g,'').trim().slice(0,200):'';
/** Parse known player metadata as data. Inscription scripts are never executed. */
export function inscriptionMetadata(html: string) {
 let title='',artist='';
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  if(!/application\/(?:ld\+)?json/i.test(match[1])) continue;
  try {const data=JSON.parse(match[2]);
   const m=data.metadata || data;
   title ||= clean(m.title || m.name);
   artist ||= clean(m.artist) || clean(m.byArtist?.name);
  } catch { /* other scripts or invalid metadata */ }
 }
 title ||= clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
 const rawArtist=html.match(/"artist"\s*:\s*("(?:\\.|[^"\\])*")/i)?.[1];
 try {if(rawArtist) artist ||= clean(JSON.parse(rawArtist));} catch { /* invalid JSON string */ }
 artist ||= clean(html.match(/<(?:p|span|div)\b[^>]*class=["'][^"']*\bartist\b[^"']*["'][^>]*>([^<]*)</i)?.[1]);
 return {title,artist};
}
