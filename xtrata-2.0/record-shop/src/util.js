export const clamp=(v,a,b)=>v<a?a:v>b?b:v;
export const lerp=(a,b,t)=>a+(b-a)*t;
export const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
export const easeIO=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
export const easeOut=t=>1-Math.pow(1-t,3);
export const seg=(p,a,b)=>clamp((p-a)/(b-a),0,1);
export function hash(str){let h=2166136261;str=String(str);for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
export function rng(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export const fmt=s=>{s=Math.max(0,Math.floor(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
export const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function fitText(ctx,text,maxW){text=String(text);if(ctx.measureText(text).width<=maxW)return text;let t=text;while(t.length>1&&ctx.measureText(t+'…').width>maxW)t=t.slice(0,-1);return t+'…';}
export function wrapText(ctx,text,x,y,maxW,lh,maxLines=3){const words=String(text).split(/\s+/);let line='',n=0;for(let i=0;i<words.length;i++){const t=line?line+' '+words[i]:words[i];if(ctx.measureText(t).width>maxW&&line){n++;if(n>=maxLines){ctx.fillText(fitText(ctx,line+' '+words.slice(i).join(' '),maxW),x,y);return y+lh;}ctx.fillText(line,x,y);y+=lh;line=words[i];}else line=t;}if(line){ctx.fillText(fitText(ctx,line,maxW),x,y);y+=lh;}return y;}
export const angDiff=(a,b)=>{let d=(b-a)%(Math.PI*2);if(d>Math.PI)d-=Math.PI*2;if(d<-Math.PI)d+=Math.PI*2;return d;};
export const typeName=t=>t==='ep'?'EP':t==='album'?'Album':'Single';
