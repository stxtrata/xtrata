// Bundles src/ + three.js r170 into ONE standalone HTML file and publishes it to the site.
//   node build.mjs            -> dist/Xtrata-Record-Shop-3D.html  and  ../public/music/shop/index.html
//   node build.mjs --no-publish   only writes dist/
import {build} from 'esbuild';import fs from 'fs';import path from 'path';import {fileURLToPath} from 'url';
const here=path.dirname(fileURLToPath(import.meta.url));process.chdir(here);
const r=await build({entryPoints:['src/main.js'],bundle:true,format:'iife',minify:true,write:false,legalComments:'none',target:'es2020',tsconfigRaw:'{}'});
const js=r.outputFiles[0].text.replace(/<\/script/gi,'<\\/script');
const lic=fs.readFileSync('node_modules/three/LICENSE','utf8').replace(/-->/g,'');
let html=fs.readFileSync('template.html','utf8');
html=html.replace('/*__LICENSE__*/',()=>lic).replace('/*__DATA__*/',()=>'').replace('/*__JS__*/',()=>js);
fs.mkdirSync('dist',{recursive:true});fs.writeFileSync('dist/Xtrata-Record-Shop-3D.html',html);
if(!process.argv.includes('--no-publish')){const out=path.join(here,'..','public','music','shop');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'index.html'),html);console.log('published',path.relative(here,path.join(out,'index.html')));}
console.log('built',(html.length/1024).toFixed(0)+' KB');
