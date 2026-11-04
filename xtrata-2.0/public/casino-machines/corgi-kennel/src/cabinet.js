/* Corgi Kennel: original kennel-club cabinet skin. Official XLOGO is drawn by vendor/xlogo.js.
 * Packed output matches the actual ParallaX root/geometries/materials/textures schema.
 * The builder works in a browser or Node VM with an HTML-canvas-compatible implementation. */
(function () {
  'use strict';
  window.buildCabinet = function buildCabinet(opts = {}) {
    const T = THREE, root = new T.Group(); root.name = 'Corgi Kennel';
    const ACC = '#f59e0b', GREEN = '#164a37', CREAM = '#f2e6c8';
    const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
    const gradient = (g, x0, y0, x1, y1, stops) => { const s = g.createLinearGradient(x0, y0, x1, y1); stops.forEach((x, i) => s.addColorStop(i / (stops.length - 1), x)); return s; };
    const rr = (g, x, y, w, h, r, fill, stroke, line = 2) => { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else {g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();} if (fill) {g.fillStyle = fill;g.fill();} if(stroke){g.strokeStyle=stroke;g.lineWidth=line;g.stroke();} };
    const text = (g, s, x, y, n, ink, font='Georgia', weight='700', align='center') => { g.font = `${weight} ${n}px ${font}`; g.textAlign=align;g.textBaseline='middle';g.fillStyle=ink;g.fillText(s,x,y); };
    const spaced = (g,s,x,y,n,gap,ink,font='Arial') => {g.font=`700 ${n}px ${font}`;const a=[...s],widths=a.map(ch=>g.measureText(ch).width),w=widths.reduce((p,v)=>p+v,0)+gap*(a.length-1);let dx=x-w/2;g.fillStyle=ink;g.textBaseline='middle';g.textAlign='left';a.forEach((ch,i)=>{g.fillText(ch,dx,y);dx+=widths[i]+gap;});};
    const std = (color, metalness=.15, roughness=.46, extra={}) => new T.MeshStandardMaterial({color,metalness,roughness,...extra});
    const green=std(GREEN,.28,.32), darkGreen=std('#09291f',.2,.43), black=std('#070e0b',.08,.72), brass=std('#ca9d48',.82,.25), darkBrass=std('#775a29',.76,.36), cream=std(CREAM,.12,.46), leather=std('#4b2919',.03,.72), brownEdge=std('#a36c40',.05,.5);
    const warm=new T.MeshBasicMaterial({color:'#ffe3a1'}), amber=new T.MeshBasicMaterial({color:ACC}), pale=new T.MeshBasicMaterial({color:'#f9efda'});
    const cache=new Map(), cached=(key,fn)=>{if(!cache.has(key))cache.set(key,fn());return cache.get(key);};
    function box(w,h,d,x,y,z,mat,parent=root,r=.035){
      const geom=cached(`b:${w},${h},${d},${r}`,()=>{if(!r)return new T.BoxGeometry(w,h,d);const s=new T.Shape(),a=-w/2,b=-h/2,R=Math.min(r,w/3,h/3,d/2.1);s.moveTo(a+R,b);s.lineTo(a+w-R,b);s.quadraticCurveTo(a+w,b,a+w,b+R);s.lineTo(a+w,b+h-R);s.quadraticCurveTo(a+w,b+h,a+w-R,b+h);s.lineTo(a+R,b+h);s.quadraticCurveTo(a,b+h,a,b+h-R);s.lineTo(a,b+R);s.quadraticCurveTo(a,b,a+R,b);const g=new T.ExtrudeGeometry(s,{depth:d-2*R,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:R,bevelThickness:R,curveSegments:3});g.translate(0,0,-d/2+R);return g;});
      const o=new T.Mesh(geom,mat);o.position.set(x,y,z);parent.add(o);return o;
    }
    function cyl(r1,r2,h,x,y,z,mat,parent=root,seg=24,axis='y'){const g=cached(`c:${r1},${r2},${h},${seg},${axis}`,()=>{const q=new T.CylinderGeometry(r1,r2,h,seg);if(axis==='z')q.rotateX(Math.PI/2);if(axis==='x')q.rotateZ(Math.PI/2);return q;});const o=new T.Mesh(g,mat);o.position.set(x,y,z);parent.add(o);return o;}
    function orb(r,x,y,z,mat,parent=root){const o=new T.Mesh(cached(`s:${r}`,()=>new T.SphereGeometry(r,10,7)),mat);o.position.set(x,y,z);parent.add(o);return o;}
    function torus(r,t,x,y,z,mat,parent=root,seg=32){const o=new T.Mesh(cached(`t:${r},${t},${seg}`,()=>new T.TorusGeometry(r,t,7,seg)),mat);o.position.set(x,y,z);parent.add(o);return o;}
    function plane(c,w,h,x,y,z,parent=root,transparent=false){const t=new T.CanvasTexture(c);const mat=new T.MeshBasicMaterial({map:t,transparent,alphaTest:transparent?.03:0,side:T.DoubleSide});const p=new T.Mesh(new T.PlaneGeometry(w,h),mat);p.position.set(x,y,z);parent.add(p);return p;}
    const role=(o,s)=>{o.name=s;o.userData.role=s;return o;};
    const action=(o,s)=>{o.userData.action=s;o.userData.pxMachineAction=s;return o;};
    function framedLabel(s,w=900,h=180,background='#0d3025',fontSize=60){const c=canvas(w,h),g=c.getContext('2d');g.fillStyle=background;g.fillRect(0,0,w,h);rr(g,8,8,w-16,h-16,12,null,'#cba450',4);text(g,s,w/2,h/2,fontSize,CREAM);return c;}
    function ribbonShape(w,h){const s=new T.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(w/2,-h);s.lineTo(0,-h+.14);s.lineTo(-w/2,-h);s.closePath();const q=new T.ExtrudeGeometry(s,{depth:.024,bevelEnabled:false});return q;}

    // Foundation, deep enamel body and inset lower door.
    box(2.82,.19,1.47,0,.095,0,black,root,.055);
    box(2.80,.055,1.45,0,.215,0,brass,root,.02);
    box(2.64,1.76,1.17,0,1.13,-.05,green,root,.09);
    box(2.49,1.61,.12,0,1.13,.565,darkGreen,root,.06);
    for(const x of [-1.22,1.22])box(.035,1.59,.035,x,1.12,.64,brass,root,.01);
    for(const y of [.33,1.92])box(2.45,.035,.035,0,y,.64,brass,root,.01);
    for(const x of [-1.23,1.23])for(const y of [.34,1.9])cyl(.027,.027,.014,x,y,.663,brass,root,12,'z');
    const door=canvas(900,560),dg=door.getContext('2d');dg.fillStyle=gradient(dg,0,0,900,560,['#153c2e','#09291f']);dg.fillRect(0,0,900,560);rr(dg,12,12,876,536,30,null,'#aa8643',5);rr(dg,27,27,846,506,22,null,'#3e6047',2);
    spaced(dg,'THE KENNEL CLUB',450,72,24,7,'#cdaa63');
    xtrataLogo(dg,450,257,250);
    text(dg,'WELSH',450,424,63,'#f2e6c8');spaced(dg,'THE FIRST MEMECOIN ON STACKS',450,491,20,3.2,'#cdaa63');
    plane(door,1.96,1.22,0,1.07,.637);
    // Brass souvenir-ticket slot and a short cream ticket.
    box(.70,.11,.065,-.72,1.78,.67,brass,root,.03);box(.56,.025,.018,-.72,1.78,.712,black,root,.005);
    const ticket=canvas(256,190),tg=ticket.getContext('2d');tg.fillStyle=CREAM;tg.fillRect(0,0,256,190);text(tg,'CORGI KENNEL',128,40,22,'#163d2c');text(tg,'SOUVENIR',128,83,18,'#78603a','Arial');for(let i=0;i<18;i++)tg.fillRect(24+i*12,120,2+(i%2),35);plane(ticket,.26,.19,-.72,1.69,.706);
    cyl(.068,.068,.026,.88,1.77,.665,brass,root,24,'z');box(.009,.048,.009,.88,1.77,.687,black,root,0);
    // Show-ring rails sit proud of the lower plinth.
    for(const x of [-1.3,-.86,-.43,0,.43,.86,1.3]){cyl(.018,.025,.23,x,.36,.84,brass,root,10);orb(.033,x,.48,.84,brass);}
    for(const y of [.31,.43]){const rail=cyl(.018,.018,2.6,0,y,.84,cream,root,12);rail.rotation.z=Math.PI/2;}
    // Small side rails, vents and feet make a complete object from all orbit angles.
    for(const s of [-1,1]){for(let i=0;i<7;i++)box(.014,.018,.34,s*1.329,.65+i*.063,-.10,black,root,.002);for(const z of [-.47,.43])cyl(.04,.05,.15,s*1.12,.10,z,black,root,12);box(.02,1.5,.03,s*1.337,1.15,.45,brass,root,.005);}

    // Upper screen housing; the reveal is the show ring seen from the stands.
    box(2.64,2.17,1.12,0,3.12,-.075,green,root,.09);
    box(2.66,.07,1.14,0,2.06,-.075,darkBrass,root,.02);
    for(const x of [-1.29,1.29]){box(.035,2.11,.03,x,3.12,.50,brass,root,.01);box(.022,1.76,.02,x*.96,3.12,.565,amber,root,.005);}
    box(2.47,1.80,.10,0,3.14,.49,brass,root,.055);
    box(2.39,1.72,.065,0,3.14,.548,darkBrass,root,.045);
    box(2.33,1.66,.035,0,3.14,.584,black,root,.025);
    const shot=opts.screenImage||(()=>{const c=canvas(700,480),g=c.getContext('2d');g.fillStyle='#0d2c21';g.fillRect(0,0,700,480);rr(g,20,20,660,440,18,null,'#c9a55c',3);spaced(g,'WELCOME TO THE SHOW',350,142,17,5,'#c9a55c');text(g,'CORGI',350,220,78,CREAM);text(g,'KENNEL',350,302,78,CREAM);spaced(g,'FETCH YOUR FORTUNE',350,380,15,5,'#c9a55c');return c;})();
    role(plane(shot,2.28,2.28*1920/2800,0,3.14,.607),'screenMesh');
    // Discreet physical fence rails below the screen.
    for(const x of [-1.13,-.75,-.38,0,.38,.75,1.13])cyl(.015,.02,.12,x,2.28,.60,brass,root,8);
    const below=cyl(.015,.015,2.28,0,2.32,.60,cream,root,10);below.rotation.z=Math.PI/2;
    // Judges' scoreboards on either flank: decorative scores are actual fixed line pays.
    const scoreboard=canvas(540,950),sg=scoreboard.getContext('2d');sg.fillStyle='#f0e5cc';sg.fillRect(0,0,540,950);rr(sg,14,14,512,922,18,null,'#977435',6);spaced(sg,'THE JUDGES',270,73,28,4,'#183f2f');text(sg,'SCOREBOARD',270,125,40,'#183f2f');text(sg,'FIVE OF A KIND · × LINE BET',270,179,17,'#81643c','Arial');const scores=[['WELSH','700'],['CVLT','300'],['sWELSH','140'],['PWEL','90'],['gWELSH','60'],['BABYWELSH','50']];scores.forEach(([n,p],i)=>{const y=260+i*86;sg.fillStyle=i%2?'#e4d7b7':'#f3ead5';sg.fillRect(35,y-34,470,72);text(sg,n,55,y,26,'#153d2b','Arial','700','left');text(sg,p,477,y,31,'#8f6b2b','Georgia','700','right');});text(sg,'CORGI KENNEL',270,856,38,'#173d2b');spaced(sg,'BEST IN SHOW',270,903,17,5,'#896736');
    for(const s of [-1,1]){box(.035,1.92,.88,s*1.333,3.10,-.08,darkBrass,root,.016);const p=plane(scoreboard,.82,1.45,s*1.357,3.14,-.08);p.rotation.y=s*Math.PI/2;}

    // Sloping physical deck: the cap and its child label travel together along local z.
    const deck=role(new T.Group(),'deck');deck.position.set(0,2.04,.79);deck.rotation.x=-.72;root.add(deck);
    box(2.77,.73,.19,0,0,0,darkGreen,deck,.055);box(2.69,.65,.03,0,0,.106,black,deck,.035);
    for(const y of [-.35,.35])box(2.76,.025,.06,0,y,.12,brass,deck,.008);
    function key(title,plain,x,y,w,h,color,act){
      action(box(w+.025,h+.025,.055,x,y,.135,brass,deck,.025),act);
      const cap=role(action(box(w,h,.062,x,y,.185,std(color,.16,.31),deck,.025),act),'btn-'+act);cap.userData.homeZ=.185;
      const c=canvas(360,170),g=c.getContext('2d');g.fillStyle=color;g.fillRect(0,0,360,170);rr(g,8,8,344,154,24,null,color===CREAM?'#b59a61':'#ffcc67',4);text(g,title,180,72,title.length>8?32:39,color===CREAM?'#163d2c':'#2e2009','Arial');spaced(g,plain.toUpperCase(),180,129,17,3,color===CREAM?'#68775a':'#6a470d');const lab=plane(c,w-.025,h-.025,0,0,.032,cap);role(action(lab,act),'btnface-'+act);return cap;
    }
    key('−TREATS','bet down',-1.10,-.035,.35,.37,CREAM,'betDown');key('+TREATS','bet up',-.68,-.035,.35,.37,CREAM,'betUp');key('AUTO-WALK','auto',-.18,-.035,.53,.37,CREAM,'auto');key('PEDIGREE','pays',.41,-.035,.53,.37,CREAM,'pays');
    const ring=action(cyl(.262,.267,.065,1.05,-.035,.155,brass,deck,40,'z'),'spin');
    const spin=role(action(cyl(.224,.239,.065,1.05,-.035,.205,std('#f0a92f',.2,.25),deck,40,'z'),'spin'),'spinPhysical');spin.userData.homeZ=.205;
    const c=canvas(320,320),cg=c.getContext('2d');cg.clearRect(0,0,320,320);cg.fillStyle=gradient(cg,0,0,320,320,['#ffd87b','#f1a925','#bd7412']);cg.beginPath();cg.arc(160,160,158,0,Math.PI*2);cg.fill();cg.strokeStyle='#ffe3a3';cg.lineWidth=8;cg.beginPath();cg.arc(160,160,139,0,Math.PI*2);cg.stroke();text(cg,'FETCH',160,146,53,'#2a250f','Arial','900');spaced(cg,'SPIN',160,208,20,5,'#715014');role(action(plane(c,.444,.444,0,0,.034,spin,true),'spin'),'btnface-spin');
    spin.add(role(new T.Group(),'btn-spin'));
    const lab=key('LAB','preview',-.99,.267,.55,.12,'#c79843','lab');lab.userData.testOnly=true;
    const deckTitle=canvas(720,80),dt=deckTitle.getContext('2d');dt.fillStyle='#0a1912';dt.fillRect(0,0,720,80);spaced(dt,'EVERY DOG HAS ITS DAY',360,42,20,7,'#c0a068');plane(deckTitle,1.50,.12,.25,.267,.14,deck);

    // Marquee: warm cream enamel lettering rather than an arcade neon treatment.
    box(2.82,.78,1.20,0,4.59,-.085,darkGreen,root,.07);
    for(const y of [4.23,4.95])box(2.84,.045,1.22,0,y,-.085,brass,root,.015);
    const mq=canvas(1500,390),mg=mq.getContext('2d');mg.fillStyle=gradient(mg,0,0,0,390,['#163c2b','#0b291f']);mg.fillRect(0,0,1500,390);rr(mg,12,12,1476,366,24,null,'#b18a42',4);spaced(mg,'THE WELSH KENNEL CLUB PRESENTS',750,68,22,7,'#c9a75d');text(mg,'CORGI KENNEL',750,194,144,'#f3e7c8','Georgia');spaced(mg,'PULL THE LEAD. JOIN THE SHOW.',750,315,22,6,'#d6b975');plane(mq,2.63,.68,0,4.59,.527);
    for(const x of [-1.35,1.35])for(let i=0;i<6;i++){const lamp=orb(.023,x,4.29+i*.116,.55,i%2?warm:amber);lamp.userData.role='lamp-'+(x<0?'l':'r')+'-'+i;}
    // Meter panel is a distinct named plane, updated from committed game values by the host.
    const meter=canvas(1400,150),jg=meter.getContext('2d');jg.fillStyle='#0a2118';jg.fillRect(0,0,1400,150);text(jg,'CASINO JACKPOT',280,46,28,'#c9a660','Arial');text(jg,'PLAY CHIPS · INITIALISING',965,46,30,'#f3e7c8','Arial');text(jg,'MACHINE FUND  ·  CHECKING     /     WEEKLY · MONDAY 00:00 UTC',700,112,21,'#b7c9ac','Arial');box(2.48,.27,.075,0,4.06,.51,darkBrass,root,.025);role(plane(meter,2.39,.255,0,4.06,.552),'jackpotMeter');

    // Best in Show rosette: pleated ribbons, enamel centre and a real WELSH logo if supplied.
    cyl(.055,.09,.46,0,5.20,-.03,brass);box(.50,.10,.35,0,5.00,-.03,darkBrass,root,.025);
    const crest=role(new T.Group(),'crest');crest.position.set(0,5.84,-.015);root.add(crest);
    const ribbonMats=[std('#b87013',.1,.58),std('#efb842',.12,.5),std('#f6d67a',.12,.46)];
    for(let i=0;i<24;i++){const a=i*Math.PI/12;const pleat=box(.14,.24,.042,Math.sin(a)*.47,Math.cos(a)*.47,-.015,ribbonMats[i%3],crest,.015);pleat.rotation.z=-a;}
    cyl(.43,.43,.075,0,0,0,brass,crest,48,'z');torus(.40,.025,0,0,.052,darkBrass,crest,48);torus(.34,.011,0,0,.069,cream,crest,48);
    const rosette=canvas(600,600),rg=rosette.getContext('2d');rg.clearRect(0,0,600,600);rg.fillStyle='#173d2a';rg.beginPath();rg.arc(300,300,297,0,Math.PI*2);rg.fill();rg.strokeStyle='#e0bd6b';rg.lineWidth=12;rg.beginPath();rg.arc(300,300,277,0,Math.PI*2);rg.stroke();
    if(opts.welshImage){rg.save();rg.beginPath();rg.arc(300,292,155,0,Math.PI*2);rg.clip();const im=opts.welshImage,sz=Math.min(im.width,im.height);rg.drawImage(im,(im.width-sz)/2,(im.height-sz)/2,sz,sz,145,137,310,310);rg.restore();}
    else {text(rg,'WELSH',300,286,71,CREAM);text(rg,'LOGO PENDING',300,350,17,'#bdaf8f','Arial');}
    spaced(rg,'BEST IN SHOW',300,95,24,3.5,'#efd79d');spaced(rg,'CORGI KENNEL',300,509,22,3.8,'#efd79d');plane(rosette,.77,.77,0,0,.081,crest,true);
    for(const s of [-1,1]){const r=role(new T.Group(),'ribbon-'+(s<0?'left':'right'));r.position.set(s*.18,-.32,-.03);r.rotation.z=s*.16;crest.add(r);r.add(new T.Mesh(ribbonShape(.28,.72),ribbonMats[s<0?1:2]));const seam=box(.018,.60,.01,-.095,-.31,.026,darkBrass,r,.002);}
    // Lead lever: brass axle, a doubled leather strap, stitching and a brass grasp ring.
    box(.14,.45,.34,1.40,2.45,.10,darkGreen,root,.045);cyl(.105,.105,.23,1.47,2.45,.10,brass,root,28,'x');
    const lever=role(new T.Group(),'lever');lever.position.set(1.59,2.45,.10);root.add(lever);
    action(box(.105,.80,.055,0,.43,0,leather,lever,.018),'lever');
    for(const x of [-.037,.037])for(let i=0;i<14;i++)action(box(.009,.018,.008,x,.095+i*.048,.031,brownEdge,lever,.002),'lever');
    const grip=action(torus(.156,.033,0,.94,0,brass,lever,36),'lever');grip.scale.y=1.25;
    const grasp=role(action(new T.Mesh(new T.PlaneGeometry(.42,.47),new T.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false,side:T.DoubleSide})),'lever'),'leverGripTarget');grasp.position.set(0,.94,.006);lever.add(grasp); // The ring's centre is also a usable hand/touch target.
    const keeper=action(torus(.063,.018,0,.79,0,brass,lever,20),'lever');keeper.scale.x=.8;
    action(orb(.065,0,.79,-.017,leather,lever),'lever');
    // Rear access plate and manufacturer identity.
    const back=plane(framedLabel('CORGI KENNEL · CK / 021',900,180,'#0d251c',42),2.16,.43,0,3.5,-.65);back.rotation.y=Math.PI;
    for(let i=0;i<9;i++)box(1.45,.025,.012,0,1.4+i*.065,-.653,black,root,.003);
    return exportPacked(root);
  };

  function exportPacked(root){
    const geometries=[],materials=[],textures=[],gi=new Map(),mi=new Map(),ti=new Map(),r5=v=>Math.round(v*1e5)/1e5;
    const tx=t=>{if(!t)return null;if(ti.has(t))return ti.get(t);const i=textures.length;textures.push({image:t.image.toDataURL('image/png'),wrapS:t.wrapS,wrapT:t.wrapT,repeat:[t.repeat.x,t.repeat.y],offset:[t.offset.x,t.offset.y],flipY:t.flipY});ti.set(t,i);return i;};
    const mt=m=>{if(mi.has(m))return mi.get(m);const i=materials.length,basic=m.isMeshBasicMaterial;materials.push({type:basic?'basic':'standard',color:m.color.getHex(),roughness:basic?.4:m.roughness,metalness:basic?0:m.metalness,transparent:m.transparent,opacity:m.opacity,side:m.side,depthWrite:m.depthWrite,alphaTest:m.alphaTest,flatShading:!!m.flatShading,map:tx(m.map),emissive:m.emissive?m.emissive.getHex():0,emissiveIntensity:m.emissiveIntensity??1});mi.set(m,i);return i;};
    const gt=g=>{if(gi.has(g))return gi.get(g);const attributes={};for(const k of ['position','normal','uv']){const a=g.getAttribute(k);if(a)attributes[k]={size:a.itemSize,array:Array.from(a.array,r5)};}const i=geometries.length;geometries.push({attributes,index:g.index?Array.from(g.index.array):null,groups:g.groups.map(q=>({start:q.start,count:q.count,materialIndex:q.materialIndex??0}))});gi.set(g,i);return i;};
    const node=o=>{const n={p:o.position.toArray().map(r5),q:o.quaternion.toArray().map(r5),s:o.scale.toArray().map(r5),visible:o.visible,role:o.userData.role||'',children:[]};if(o.userData.action)n.action=o.userData.action;if(o.name)n.name=o.name;if(o.userData.testOnly)n.testOnly=true;if(o.isMesh){n.g=gt(o.geometry);n.m=Array.isArray(o.material)?o.material.map(mt):mt(o.material);}n.children=o.children.map(node);return n;};
    root.updateMatrixWorld(true);const bb=new THREE.Box3().setFromObject(root),out={root:node(root),geometries,materials,textures};let meshes=0,triangles=0;root.traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?o.geometry.index.count:o.geometry.getAttribute('position').count)/3;}});
    return {json:JSON.stringify(out),stats:{three:THREE.REVISION,geometries:geometries.length,materials:materials.length,textures:textures.length,meshes,triangles,min:bb.min.toArray().map(r5),max:bb.max.toArray().map(r5),size:bb.getSize(new THREE.Vector3()).toArray().map(r5)}};
  }
})();
