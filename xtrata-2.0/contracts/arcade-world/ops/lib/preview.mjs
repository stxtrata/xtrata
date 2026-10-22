// Local preview: the real, built hall page with a small control panel that feeds it a scene file, so a story can be walked
// through and scrubbed block by block BEFORE anything is written to a chain. Output is one local HTML file (git-ignored).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { APP } from './catalogue.mjs';
import { snapshotAt, resolveScenes } from './snapshot.mjs';

export const HALL_FILE = join(APP, 'dist', 'xtrata-arcade-v1.5.0.html');

// Heights worth looking at: just before the first change, each distinct start, and just after the last.
export function keyframes(scenes, height) {
  const froms = [...new Set(scenes.map((s) => Math.max(s.from, 0)))].sort((a, b) => a - b);
  const hs = [];
  if (froms.length) hs.push({ h: Math.max(0, froms[0] - 1), label: 'before the first scene' });
  froms.forEach((f) => hs.push({ h: f, label: 'block ' + f }));
  if (height != null && !hs.some((x) => x.h === height)) hs.unshift({ h: height, label: 'now (block ' + height + ')' });
  return hs.sort((a, b) => a.h - b.h);
}

export function previewData({ scenes, looks, bayCount = 4, posters = [], height = null, title = 'scene file' }) {
  const frames = keyframes(scenes, height).map((k) => ({ ...k, snap: snapshotAt({ scenes, looks, height: k.h, bayCount, posters }) }));
  return { title, frames, bayCount };
}

const PANEL = (data, world) => `
window.XA_WORLD_CONFIG=${JSON.stringify(world)};
window.XA_TEST=1;
(function(){
  var DATA=${JSON.stringify(data)}, idx=Math.max(0,DATA.frames.findIndex(function(f){return /^now/.test(f.label)})), cur=idx;
  function apply(){var W=window.XAWorld; if(!W||!W._t) return; var st=W._t.state; st.snap=DATA.frames[cur].snap; st.listeners.forEach(function(f){try{f(st.snap,'preview')}catch(e){}})}
  function goTo(i){
    var intro=document.getElementById('intro'); if(intro&&!intro.hidden){var go=document.getElementById('go'); if(go) go.click()}
    var s=window.XA&&window.XA.bayState&&window.XA.bayState(); if(!s||!window.XA.pose||!s.bays[i]) return;
    var p=s.bays[i].pos, side=p.x<0?-1:1; window.XA.pose(p.x-side*3.4,p.z,side<0?Math.PI/2:-Math.PI/2,0);
  }
  function ui(){
    var d=document.createElement('div');
    d.style.cssText='position:fixed;right:12px;bottom:12px;z-index:99999;background:rgba(10,12,24,.92);color:#dfe6ff;font:12px/1.4 ui-monospace,Menlo,monospace;padding:10px 12px;border:1px solid #3b4a8a;border-radius:6px;max-width:270px;max-height:92vh;overflow:auto';
    d.innerHTML='<div style="letter-spacing:.08em;color:#ffcc55;margin-bottom:2px">LOCAL PREVIEW \\u00b7 NOT ON CHAIN</div><div style="color:#8a93c4;margin-bottom:6px"></div>';
    d.children[1].textContent=DATA.title;
    function btn(label,fn,on){var b=document.createElement('button');b.style.cssText='display:block;width:100%;text-align:left;margin:3px 0;padding:6px 8px;background:'+(on?'#2a3a80':'#182049')+';color:#dfe6ff;border:1px solid #3b4a8a;border-radius:4px;font:inherit;cursor:pointer';b.textContent=label;b.onclick=function(e){e.stopPropagation();fn();b.blur()};b.onkeydown=function(e){e.stopPropagation()};d.appendChild(b);return b}
    function h(t){var n=document.createElement('div');n.style.cssText='margin-top:8px;color:#8a93c4';n.textContent=t;d.appendChild(n)}
    h('WHEN \\u00b7 pick a block to see what the hall shows then');
    var btns=[];
    DATA.frames.forEach(function(f,i){btns.push(btn(f.label,function(){cur=i;btns.forEach(function(b,j){b.style.background=j===cur?'#2a3a80':'#182049'});apply()},i===cur))});
    h('GO TO');
    for(var i=0;i<DATA.bayCount;i++)(function(i){btn('Bay '+i+' \\u203a',function(){goTo(i)})})(i);
    var n=document.createElement('div');n.style.cssText='margin-top:6px;color:#8a93c4';n.textContent='Scenes come from your scene file; the world and poster contracts are not read. Press Esc to free the mouse before clicking this panel.';d.appendChild(n);
    d.addEventListener('pointerdown',function(e){e.stopPropagation()});
    document.body.appendChild(d);
  }
  var tries=0,t=setInterval(function(){tries++;var W=window.XAWorld;if(W&&W._t&&W._t.state.listeners.length&&document.body){clearInterval(t);ui();apply()}else if(tries>600)clearInterval(t)},200);
})();`;

export function buildPreviewHtml(data, { hallHtml = null, world = null } = {}) {
  const html = hallHtml || readFileSync(HALL_FILE, 'utf8');
  const cfg = world || { posters: 'SP000000000000000000002Q6VF78.xtrata-posters-v1', world: 'SP000000000000000000002Q6VF78.xtrata-world-v1', roomId: 'arcade-hall' }   // the burn address: it holds no contracts, so a real deployment can never replace the file's scenes;
  const panel = PANEL(data, cfg).replace(/<\/script/gi, '<\\/script');
  const i = html.indexOf('<head>');
  if (i < 0) throw new Error('hall page has no <head>');
  return html.slice(0, i) + '<head><script>\n' + panel + '\n</script>\n' + html.slice(i + 6);
}
export { resolveScenes };

// A local page that shows a TEST NETWORK's world and poster contracts in the real hall (reads only). The hall's reader takes its network
// from the score client's config, so the page sets that before the reader's first read (a setter on window.XAScores catches it the moment it exists).
export function buildTestnetViewHtml({ world, posters, screen = '', scores = '', registry = '', rooms = {}, roomId = 'arcade-hall', hallHtml = null, apiBase = 'https://api.testnet.hiro.so' }) {
  if (!/^ST[0-9A-Z]+\.[a-z][a-z0-9-]*$/.test(world) || !/^ST[0-9A-Z]+\.[a-z][a-z0-9-]*$/.test(posters)) throw new Error('world and posters must be testnet contract ids (ST...name)');
  if (screen && !/^ST[0-9A-Z]+\.[a-z][a-z0-9-]*$/.test(screen)) throw new Error('screen must be a testnet contract id (ST...name)');
  if (scores && !/^ST[0-9A-Z]+\.[a-z][a-z0-9-]*$/.test(scores)) throw new Error('scores must be a testnet contract id (ST...name)');
  if (registry && !/^ST[0-9A-Z]+\.[a-z][a-z0-9-]*$/.test(registry)) throw new Error('registry must be a testnet contract id (ST...name)');
  // rooms: { slug: { src: 'casino-room.html', title: 'ROYAL FLUSH CASINO', still: 'casino-entry.jpg', depth: 'casino-entry-depth.png' } }, the pages a lobby door can lead to (window.XA_ROOMS); each page sits beside this one
  const roomMap = {};
  for (const [slug, r] of Object.entries(rooms || {})) {
    if (!/^[a-z][a-z0-9-]{1,23}$/.test(slug)) throw new Error('room slug "' + slug + '": lowercase letters, digits, dashes');
    if (!r || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}\.html$/.test(r.src || '')) throw new Error('room "' + slug + '": src must be a file name ending in .html, beside the page');
    if (r.title && !/^[\x20-\x7e]{1,48}$/.test(r.title)) throw new Error('room "' + slug + '": title must be 1 to 48 printable ASCII characters');
    // still: a picture of the room's entry view (a file beside the page, .jpg/.png/.webp); the hall shows it in the open doorway and while the room loads
    if (r.still && !/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}\.(jpg|png|webp)$/.test(r.still)) throw new Error('room "' + slug + '": still must be a file name ending in .jpg, .png or .webp, beside the page');
    // depth: the room's depth map (a .png beside the page; snap-room.cjs takes it with the still): the doorway then has real parallax and walking in is a glide. Needs a still.
    if (r.depth && (!r.still || !/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}\.png$/.test(r.depth))) throw new Error('room "' + slug + '": depth must be a file name ending in .png, beside the page, and needs a still');
    roomMap[slug] = { src: r.src, title: r.title || slug.toUpperCase(), ...(r.still ? { still: r.still } : {}), ...(r.depth ? { depth: r.depth } : {}) };
  }
  const sc = scores ? scores.split('.') : null;
  const html = hallHtml || readFileSync(HALL_FILE, 'utf8');
  const script = `${Object.keys(roomMap).length ? 'window.XA_ROOMS=' + JSON.stringify(roomMap) + ';\n' : ''}window.XA_WORLD_CONFIG=${JSON.stringify({ world, posters, roomId, ...(screen ? { screen } : {}), ...(registry ? { registry } : {}) })};
(function(){var cur;try{Object.defineProperty(window,'XAScores',{configurable:true,get:function(){return cur},set:function(v){cur=v;try{v.configure({network:'testnet',apiBases:[${JSON.stringify(apiBase)}],readSender:${JSON.stringify(world.split('.')[0])}${sc ? `,contractAddress:${JSON.stringify(sc[0])},contractName:${JSON.stringify(sc[1])}` : ''}})}catch(e){}}})}catch(e){}})();
(function(){var d;function ui(){d=document.createElement('div');d.style.cssText='position:fixed;left:12px;bottom:12px;z-index:99999;background:rgba(10,12,24,.92);color:#dfe6ff;font:12px/1.4 ui-monospace,Menlo,monospace;padding:8px 10px;border:1px solid #3b4a8a;border-radius:6px;max-width:300px';d.innerHTML='<div style="letter-spacing:.08em;color:#ffcc55">TESTNET VIEW \\u00b7 READ ONLY</div>';var n=document.createElement('div');n.style.color='#8a93c4';n.textContent=${JSON.stringify(world)};d.appendChild(n);document.body.appendChild(d)}
document.addEventListener('DOMContentLoaded',ui)})();`;
  const i = html.indexOf('<head>');
  if (i < 0) throw new Error('hall page has no <head>');
  return html.slice(0, i) + '<head><script>\n' + script.replace(/<\/script/gi, '<\\/script') + '\n</script>\n' + html.slice(i + 6);
}
