#!/usr/bin/env node
// Static software-renderer inspection of packed geometry, not a substitute for browser interaction checks.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const HERE=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),require=createRequire(import.meta.url);
let nc;try{nc=require('@napi-rs/canvas');}catch(e){nc=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'@napi-rs/canvas'));}
const context={console,performance,Image:nc.Image,document:{createElement:()=>{const c=nc.createCanvas(1,1);c.style={};return c;}}};context.window=context;context.self=context;vm.createContext(context);
for(const f of ['vendor/three-r128.min.js','vendor/software-renderer.js'])vm.runInContext(fs.readFileSync(path.join(HERE,f),'utf8'),context,{filename:f});
const T=context.THREE,d=JSON.parse(fs.readFileSync(path.join(HERE,'src/model.json'),'utf8'));
const images=await Promise.all(d.textures.map(t=>nc.loadImage(t.image)));
const geos=d.geometries.map(g=>{const o=new T.BufferGeometry();for(const [k,a]of Object.entries(g.attributes))o.setAttribute(k,new T.BufferAttribute(new Float32Array(a.array),a.size));if(g.index)o.setIndex(g.index);for(const gr of g.groups||[])o.addGroup(gr.start,gr.count,gr.materialIndex);return o;});
const textures=d.textures.map((t,i)=>{const o=new T.Texture(images[i]);o.flipY=t.flipY;return o;});
const mats=d.materials.map(m=>{const p={color:m.color,map:m.map==null?null:textures[m.map],transparent:m.transparent,opacity:m.opacity,side:m.side,depthWrite:m.depthWrite,alphaTest:m.alphaTest};return m.type==='basic'?new T.MeshBasicMaterial(p):new T.MeshStandardMaterial({...p,metalness:m.metalness,roughness:m.roughness});});
const node=n=>{const o=n.g==null?new T.Group():new T.Mesh(geos[n.g],Array.isArray(n.m)?n.m.map(i=>mats[i]):mats[n.m]);o.position.fromArray(n.p);o.quaternion.fromArray(n.q);o.scale.fromArray(n.s);o.visible=n.visible!==false;if(n.role)o.name='px-'+n.role;if(n.action)o.userData.pxMachineAction=n.action;n.children.forEach(c=>o.add(node(c)));return o;};
const model=node(d.root),scene=new T.Scene();scene.add(model);model.updateMatrixWorld(true);
const W=960,H=1100,camera=new T.PerspectiveCamera(35,W/H,.03,100);camera.position.set(4.8,4.1,12.7);camera.lookAt(0,3.12,0);
const renderer=new context.SoftwareRenderer();renderer.setPixelRatio(1);renderer.setSize(W,H);renderer.render(scene,camera);
const out=process.argv[2]?path.resolve(process.argv[2]):path.join(HERE,'checks/results/cabinet-software.png');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,renderer.domElement.toBuffer('image/png'));
console.log(JSON.stringify({file:out,three:T.REVISION,renderer:'SoftwareRenderer',width:W,height:H,trianglesDrawn:renderer.info.render.triangles,note:'Geometry/render compatibility only; browser interaction and GPU checks remain separate.'}));
