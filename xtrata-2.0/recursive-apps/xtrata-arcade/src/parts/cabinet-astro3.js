/*
 * Astro Blaster 3: a hand-built cabinet model (Jim's design), used instead of the hall's parametric cabinet for the game whose id is "astro3".
 * The two pictures it is dressed in (the rocket side print, the marquee) are NOT in the hall: they come from the game's manifest picture on chain
 * (games registry kind 3, def.cabinetArt) and are passed in as build(THREE, { art:{ side, marquee } }); without them it shows flat colour.
 * Registered as XA_CAB3D.astro3 = { build(THREE) -> { group, screen, startButton, ready, ... } }; the hall (hall.js buildModelCabinet) stands it in a slot,
 * gives it a screen canvas, and drives its start button. Metres, Y up, front +Z, origin on the floor under the centre; about 1.02 wide, 2.27 high, 1.18 deep.
 * Ported from the supplied three r170 module to the hall's r128 (encoding instead of colorSpace, no loadAsync, no point lights, small flat placeholders
 * until the two embedded pictures, the rocket side print and the marquee, have decoded).
 */
(function () {
 'use strict';
function createAstroCabinet(THREE, {screenTexture=null, lighting=false, art=null}={}) {
 const root=new THREE.Group(); root.name='AstroBlaster3';
 const artMaterials=[];const mats={}; const mat=(n,c,m=.25,r=.45,e=0)=>mats[n]||(mats[n]=new THREE.MeshStandardMaterial({name:n,color:c,metalness:m,roughness:r,emissive:c,emissiveIntensity:e}));
 const white=mat('Ivory armor',0xd4d1cc,.48,.33),red=mat('Crimson chassis',0x9e1828,.45,.34),black=mat('Graphite',0x13161d,.35,.42),rubber=mat('Rubber seals',0x06080c,0,.8),silver=mat('Fasteners',0x888b96,.85,.24),orange=mat('Amber lamps',0xff5805,.2,.3,3),cyan=mat('Cyan lamps',0x00cfff,.2,.3,2.5),blue=mat('Blue buttons',0x009de7,.45,.22),buttonRed=mat('Red buttons',0xe71926,.35,.2);
 function add(g,m,n,p=[0,0,0],parent=root){const o=new THREE.Mesh(g,m);o.name=n;o.position.set(...p);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function roundedRect(w,h,r){const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s;}
 function box(n,w,h,d,p,m=black,parent=root){const b=Math.min(.006,w*.16,h*.16,d*.16);const sh=roundedRect(w-2*b,h-2*b,Math.min(.010,w*.08,h*.08));const g=new THREE.ExtrudeGeometry(sh,{depth:d-2*b,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:b,bevelThickness:b,curveSegments:5});g.translate(0,0,-d/2+b);return add(g,m,n,p,parent);}
 const grain=document.createElement('canvas');grain.width=grain.height=256;const gg=grain.getContext('2d'),rr=rng(),pixels=gg.createImageData(256,256);for(let i=0;i<pixels.data.length;i+=4){let v=115+rr()*26;pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=v;pixels.data[i+3]=255;}gg.putImageData(pixels,0,0);const grainTex=new THREE.CanvasTexture(grain);grainTex.wrapS=grainTex.wrapT=THREE.RepeatWrapping;grainTex.repeat.set(7,7);for(const m of [white,red,black]){m.bumpMap=grainTex;m.bumpScale=.00045;m.roughness=.36;}
 function glow(n,w,h,p,color,rotation=[0,0,0],parent=root){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),grad=g.createRadialGradient(64,64,0,64,64,64);grad.addColorStop(0,'rgba(255,255,255,.7)');grad.addColorStop(.25,'rgba(255,255,255,.25)');grad.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=grad;g.fillRect(0,0,128,128);const map=new THREE.CanvasTexture(c),mat=new THREE.MeshBasicMaterial({map,color,transparent:true,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending,toneMapped:false});const o=add(new THREE.PlaneGeometry(w,h),mat,n,p,parent);o.rotation.set(...rotation);o.castShadow=false;return o;}
 function light(n,color,intensity,p){if(!lighting)return;const l=new THREE.PointLight(color,intensity,.85,2);l.name=n;l.position.set(...p);root.add(l);}
 orange.emissiveIntensity=1.35;orange.color.set('#ff4000');cyan.emissiveIntensity=1.1;

 function cyl(n,r,h,p,m,parent=root){const pts=[new THREE.Vector2(0,-h/2),new THREE.Vector2(r*.9,-h/2),new THREE.Vector2(r,-h*.30),new THREE.Vector2(r,h*.2),new THREE.Vector2(r*.94,h*.45),new THREE.Vector2(r*.8,h/2),new THREE.Vector2(0,h/2)];return add(new THREE.LatheGeometry(pts,40),m,n,p,parent);}
 function side(n,points,x,thick,m){const s=new THREE.Shape();points.forEach(([z,y],i)=>i?s.lineTo(z,y):s.moveTo(z,y));s.closePath();const g=new THREE.ExtrudeGeometry(s,{depth:thick,bevelEnabled:true,bevelSegments:3,steps:1,bevelSize:.008,bevelThickness:.006});g.rotateY(-Math.PI/2);return add(g,m,n,[x+thick/2,0,0]);}
 const profile=[[-.48,.06],[.47,.06],[.47,.23],[.30,.84],[.57,1.04],[.57,1.14],[.34,1.22],[.13,1.78],[.31,1.91],[.29,2.10],[-.44,2.13],[-.50,1.71]];
 box('Internal body',.71,1.73,.66,[0,.94,-.10]);
 for(const sign of [-1,1]){
  const x=sign*.40;
  side('Red side chassis',profile,x,.055,red);
  // Large printed side panel, with custom UV coordinates in the Y/Z plane.
  const artPoly=[[-.46,.12],[.39,.12],[.24,.81],[.48,1.09],[.27,1.22],[.08,1.79],[-.42,1.95],[-.49,1.65]];
  const tex=flatTex(THREE,'#1a1f55');const artMat=new THREE.MeshStandardMaterial({name:'Rocket side print',map:tex,roughness:.5,metalness:.1,side:THREE.DoubleSide});
  artMaterials.push(artMat);const sh=new THREE.Shape();artPoly.forEach(([z,y],i)=>i?sh.lineTo(z,y):sh.moveTo(z,y));const geo=new THREE.ShapeGeometry(sh);const pos=geo.attributes.position,uv=geo.attributes.uv;for(let i=0;i<pos.count;i++){uv.setXY(i,(pos.getX(i)+.50)/1.05,(pos.getY(i)-.08)/1.93);}geo.rotateY(-Math.PI/2);add(geo,artMat,'Rocket artwork '+sign,[sign*.435,0,0]);
  side('Front armor rail',[[.39,.08],[.51,.08],[.51,.23],[.35,.83],[.60,1.05],[.60,1.16],[.38,1.24],[.17,1.79],[.34,1.91],[.33,2.13],[.27,2.15],[.25,1.94],[.10,1.80],[.29,1.19],[.51,1.10],[.25,.85]],sign*.456,.045,white);
  side('Upper wing armor',[[-.51,1.35],[-.51,1.49],[-.40,1.74],[.23,2.13],[.25,2.21],[.16,2.19],[-.48,1.81],[-.57,1.43]],sign*.455,.045,white);
  side('Rear fin',[[-.48,1.61],[-.48,2.16],[-.39,2.26],[-.34,2.25],[-.34,1.78]],sign*.39,.055,red);
  side('Rear fin insert',[[-.48,1.70],[-.47,2.11],[-.40,2.19],[-.38,1.79]],sign*.425,.023,white);
  side('Base trim',[[-.48,.07],[.40,.07],[.35,.15],[-.45,.17]],sign*.455,.035,white);
  side('Vent surround',[[.00,.13],[.32,.13],[.18,.60],[.10,.63]],sign*.465,.04,red);
  side('Vent dark recess',[[.045,.17],[.27,.17],[.16,.53],[.12,.55]],sign*.49,.01,rubber);
  side('Amber internal diffuser',[[.047,.17],[.27,.17],[.16,.54],[.12,.55]],sign*.498,.008,orange);
  for(let j=0;j<5;j++){let yy=.225+j*.065,ww=.202-j*.028;const l=box('Solid dark vent louver',.027,.025,ww,[sign*.518,yy,.155],black);l.rotation.z=sign*.22;}
  glow('Amber vent aura',.34,.48,[sign*.538,.33,.155],0xff4400,[0,sign*Math.PI/2,0]);
  light('Amber vent spill',0xff4500,.38,[sign*.55,.25,.16]);
  box('Teal intake recess',.018,.18,.22,[sign*.469,.75,.10],rubber);
  box('Teal inner diffuser',.008,.16,.20,[sign*.483,.75,.10],cyan);
  for(let j=0;j<4;j++){const o=box('Dark intake louver',.025,.023,.22,[sign*.50,.69+j*.041,.10],black);o.rotation.x=.20;}
  glow('Teal vent aura',.28,.24,[sign*.522,.75,.10],0x00c7ec,[0,sign*Math.PI/2,0]);
  light('Teal vent spill',0x00cfff,.12,[sign*.55,.75,.11]);
  for(const [z,y] of [[.43,.18],[.32,.8],[.53,1.09],[.31,1.25],[.12,1.78],[.28,2.08],[-.46,1.44],[-.38,1.75],[-.40,.13]]){let s=cyl('Armor bolt',.008,.007,[sign*.485,y,z],silver);s.rotation.z=Math.PI/2;}
 }
 box('Base plinth',.80,.09,.89,[0,.07,-.01],rubber);
 box('Front lower face',.72,.78,.05,[0,.48,.32]);
 const kick=box('Kick plate',.70,.15,.08,[0,.16,.39],black);kick.rotation.x=-.28;
 box('Coin bezel',.30,.35,.035,[0,.56,.365],silver);
 box('Coin door',.283,.332,.04,[0,.56,.39],black);
 for(const x of [-.065,.065]){box('Coin slot housing',.061,.084,.018,[x,.66,.418],rubber);box('Coin return red',.038,.060,.022,[x,.66,.431],buttonRed);box('Coin slot',.006,.039,.024,[x,.66,.445],rubber);box('Coin return hatch',.065,.065,.018,[x,.46,.42],rubber);}
 const lock=cyl('Coin door lock',.014,.012,[.108,.55,.421],silver);lock.rotation.x=Math.PI/2;
 // Sloped portrait monitor, normal tilted upward toward the player.
 const monitor=new THREE.Group();monitor.name='Monitor assembly';monitor.position.set(0,1.49,.235);monitor.rotation.x=-.23;root.add(monitor);
 box('Monitor surround',.72,.77,.12,[0,0,0],black,monitor);
 box('Screen gasket',.635,.687,.025,[0,0,.07],rubber,monitor);
 const defaultTex=flatTex(THREE,'#060b24');
 const screenMat=new THREE.MeshBasicMaterial({name:'Replaceable game display',map:screenTexture||defaultTex});
 const screen=add(new THREE.ShapeGeometry(roundedRect(.589,.640,.038),20),screenMat,'GameScreen',[0,0,.087],monitor);
 {const a=screen.geometry.attributes.position,u=screen.geometry.attributes.uv;for(let i=0;i<a.count;i++)u.setXY(i,a.getX(i)/.589+.5,a.getY(i)/.640+.5);}
 const glass=new THREE.MeshPhysicalMaterial({name:'CRT curved glass sheen',color:0xbedbff,transparent:true,opacity:.08,roughness:.12,metalness:.05,clearcoat:1,clearcoatRoughness:.08,depthWrite:false});const glassMesh=add(new THREE.ShapeGeometry(roundedRect(.590,.641,.039),20),glass,'CRT protective glass',[0,0,.089],monitor);glassMesh.castShadow=false;
 const screenAnchor=new THREE.Object3D();screenAnchor.name='GameScreenAnchor';screenAnchor.position.z=.089;monitor.add(screenAnchor);screenAnchor.userData={width:.589,height:.640,pixelWidth:600,pixelHeight:652};
 // Control deck.
 const deck=new THREE.Group();deck.name='Control deck';deck.position.set(0,1.075,.425);deck.rotation.x=.10;root.add(deck);
 box('Deck chassis',.84,.105,.34,[0,0,0],black,deck);box('Deck surface',.80,.015,.30,[0,.059,0],black,deck);
 for(const sign of [-1,1]){box('Deck side lamp housing',.027,.08,.028,[sign*.425,.002,.155],red,deck);box('Deck side amber lamp',.013,.06,.031,[sign*.425,.002,.158],orange,deck);glow('Deck side amber halo',.10,.16,[sign*.425,.002,.18],0xff5000,[0,0,0],deck);}

 for(const x of [-.27,.27]){box('Deck lamp recess',.19,.035,.012,[x,-.012,.178],rubber,deck);box('Deck amber lamp',.16,.012,.015,[x,-.012,.186],orange,deck);glow('Deck lamp halo',.24,.09,[x,-.012,.20],0xff4000,[0,0,0],deck);}
 cyl('Joystick base',.055,.012,[-.18,.078,.025],silver,deck);cyl('Joystick boot',.044,.016,[-.18,.09,.025],rubber,deck);
 const stick=new THREE.Group();stick.name='Joystick';stick.position.set(-.18,.10,.025);deck.add(stick);cyl('Joystick shaft',.009,.095,[0,.045,0],silver,stick);add(new THREE.SphereGeometry(.031,24,16),buttonRed,'Joystick ball',[0,.10,0],stick);
 const buttons=[];for(const [i,x,z,m] of [[0,.075,.03,blue],[1,.17,-.005,blue],[2,.265,.02,buttonRed]]){cyl('Button bezel '+i,.038,.012,[x,.078,z],silver,deck);buttons.push(cyl('Button '+i,.032,.018,[x,.092,z],m,deck));}
 const startButton=cyl('Start button',.018,.012,[-.31,.08,-.035],buttonRed.clone(),deck);
 // Header with raised edge lighting.
 const header=new THREE.Group();header.name='Marquee';header.position.set(0,2.015,.245);header.rotation.x=-.08;root.add(header);
 box('Marquee housing',.86,.235,.17,[0,0,0],black,header);
 const marquee=flatTex(THREE,'#160b26');
 const marqueeMaterial=new THREE.MeshBasicMaterial({name:'Marquee artwork',map:marquee,toneMapped:false});
 add(new THREE.PlaneGeometry(.79,.19),marqueeMaterial,'Astro Blaster 3 title',[0,0,.087],header);
 for(const sign of [-1,1]){box('Marquee side cap',.033,.26,.20,[sign*.445,0,0],white,header);box('Marquee edge lamp',.013,.213,.012,[sign*.445,0,.108],sign<0?cyan:orange,header);glow('Marquee edge aura',.09,.29,[sign*.445,0,.118],sign<0?0x00caff:0xff5000,[0,0,0],header);}
 // Functional rear: removable service panel and ventilation.
 box('Rear service panel',.66,1.41,.018,[0,.93,-.446],black);
 for(let j=0;j<8;j++)box('Rear vent',.43,.012,.012,[0,1.38+j*.027,-.46],rubber);
 box('Power inlet',.07,.05,.02,[.22,.25,-.46],rubber);
 root.userData={version:'2.0',units:'metres',front:'+Z',screen:{width:.589,height:.640},design:'Reference-matched reconstruction; rear inferred'};
 const ready=Promise.all([
  (art&&art.side?loadTex(THREE,art.side):Promise.resolve(null)).then(texture=>{
   if(!texture)return;texture.anisotropy=4;
   for(const material of artMaterials){material.map.dispose();material.map=texture;material.needsUpdate=true;}
  }),
  (art&&art.marquee?loadTex(THREE,art.marquee):Promise.resolve(null)).then(texture=>{
   if(!texture)return;texture.anisotropy=4;
   marqueeMaterial.map.dispose();marqueeMaterial.map=texture;marqueeMaterial.needsUpdate=true;
  }),
 ]);
 return {ready,group:root,screen,screenAnchor,startButton,joystick:stick,buttons,
 setScreenTexture(texture){screenMat.map=texture;screenMat.needsUpdate=true;},
 setControls(x=0,y=0,pressed=[]){stick.rotation.z=-x*.22;stick.rotation.x=y*.22;buttons.forEach((b,i)=>b.position.y=pressed.includes(i)?.085:.092);},
 dispose(){const gs=new Set(),ms=new Set(),ts=new Set();root.traverse(o=>{if(o.geometry)gs.add(o.geometry);if(o.material){for(const m of Array.isArray(o.material)?o.material:[o.material])ms.add(m);}});for(const m of ms)for(const v of Object.values(m))if(v?.isTexture&&v!==screenMat.map)ts.add(v);ts.add(defaultTex);gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ts.forEach(t=>t.dispose());root.removeFromParent();}
 };
}

function canvas(w,h){const c=document.createElement('canvas');c.width=w;c.height=h;return [c,c.getContext('2d')];}
function rng(){let a=73891;return ()=>{a=(a*1664525+1013904223)>>>0;return a/4294967296;};}


function flatTex(T,col){const c=document.createElement('canvas');c.width=c.height=4;const g=c.getContext('2d');g.fillStyle=col;g.fillRect(0,0,4,4);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;return t;}
function loadTex(T,src){return new Promise((ok,no)=>{const im=new Image();im.onload=()=>{const t=new T.Texture(im);t.encoding=T.sRGBEncoding;t.needsUpdate=true;ok(t)};im.onerror=()=>no(new Error('cabinet art'));im.src=src;});}

 window.XA_CAB3D = window.XA_CAB3D || {};
 window.XA_CAB3D.astro3 = { build: createAstroCabinet, screen: { w: .589, h: .640 } };
})();
