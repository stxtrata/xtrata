/* Canvas compatibility renderer for the same THREE scene graph, used only if
   the browser cannot create a WebGL context. No network, proxy or external app. */
function SoftwareRenderer(){
 const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d',{alpha:false});
 this.domElement=canvas;this.shadowMap={};this.capabilities={getMaxAnisotropy:()=>1};this.info={render:{triangles:0,calls:0}};this.software=true;
 let W=1,H=1,pixelRatio=1,lastCamera='',lastTime=0;const v=new THREE.Vector3(),normal=new THREE.Vector3(),mvp=new THREE.Matrix4(),nm=new THREE.Matrix3();const c=new THREE.Color();
 this.setPixelRatio=r=>{pixelRatio=Math.min(r,1.3)};this.setClearColor=()=>{};
 this.setSize=(w,h)=>{W=Math.round(w*pixelRatio);H=Math.round(h*pixelRatio);canvas.width=W;canvas.height=H;canvas.style.width=w+'px';canvas.style.height=h+'px';lastTime=0;};
 this.render=(scene,camera)=>{
  const now=performance.now();if(now-lastTime<70)return;lastTime=now;
  scene.updateMatrixWorld();camera.updateMatrixWorld();camera.matrixWorldInverse.copy(camera.matrixWorld).invert();
  const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#10141e');bg.addColorStop(.55,'#090e17');bg.addColorStop(1,'#141720');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  mvp.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);const batches=[];
  const origin=new THREE.Vector3(0,0,0).project(camera),edge=new THREE.Vector3(2,0,0).project(camera);
  const shadowW=Math.max(10,Math.abs(edge.x-origin.x)*W*.7);ctx.save();ctx.translate((origin.x+1)*W/2,(1-origin.y)*H/2);ctx.scale(1,.23);const shadow=ctx.createRadialGradient(0,0,0,0,0,shadowW);shadow.addColorStop(0,'#000000b0');shadow.addColorStop(1,'#00000000');ctx.fillStyle=shadow;ctx.fillRect(-shadowW,-shadowW,shadowW*2,shadowW*2);ctx.restore();
  scene.traverseVisible(obj=>{
   if(!obj.isMesh||!obj.visible)return;
   const geo=obj.geometry,mat=Array.isArray(obj.material)?obj.material[0]:obj.material;if(!mat||mat.opacity<.07)return;
   if(geo.type==='PlaneGeometry'&&geo.parameters.width>=15)return;
   const pos=geo.getAttribute('position'),uv=geo.getAttribute('uv'),index=geo.index;const matrix=new THREE.Matrix4().multiplyMatrices(mvp,obj.matrixWorld);nm.getNormalMatrix(obj.matrixWorld);
   const originDepth=new THREE.Vector3().setFromMatrixPosition(obj.matrixWorld).applyMatrix4(mvp).z-(obj.userData.softwareLayer||0)*.001;const vertices=new Array(pos.count);for(let i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i).applyMatrix4(matrix);vertices[i]={x:(v.x+1)*W/2,y:(1-v.y)*H/2,z:v.z};}
   const total=index?index.count:pos.count;for(let i=0;i<total;i+=3){const ai=index?index.getX(i):i,bi=index?index.getX(i+1):i+1,ci=index?index.getX(i+2):i+2;const a=vertices[ai],b=vertices[bi],d=vertices[ci];if(a.z>1||b.z>1||d.z>1||a.z< -1||b.z< -1||d.z< -1)continue;
    if((b.x-a.x)*(d.y-a.y)-(b.y-a.y)*(d.x-a.x)>=0&&mat.side!==THREE.DoubleSide)continue;
    if(Math.max(a.x,b.x,d.x)<0||Math.min(a.x,b.x,d.x)>W||Math.max(a.y,b.y,d.y)<0||Math.min(a.y,b.y,d.y)>H)continue;
    let shade=1;if(!mat.isMeshBasicMaterial){if(geo.attributes.normal){normal.fromBufferAttribute(geo.attributes.normal,ai).applyMatrix3(nm).normalize();shade=.42+Math.max(0,normal.dot(new THREE.Vector3(.38,.65,.65)))*.62+Math.max(0,normal.x*-.2)*.15;}else shade=.75;}
    c.copy(mat.color||new THREE.Color('#fff')).convertLinearToSRGB();const ambient=mat.metalness?.20:0;const col=`rgb(${Math.min(255,(c.r*shade+ambient*.40)*255)|0},${Math.min(255,(c.g*shade+ambient*.38)*255)|0},${Math.min(255,(c.b*shade+ambient*.35)*255)|0})`;
    const img=mat.map?.image;const tx=img&&uv?[uv.getX(ai)*img.width,(1-uv.getY(ai))*img.height,uv.getX(bi)*img.width,(1-uv.getY(bi))*img.height,uv.getX(ci)*img.width,(1-uv.getY(ci))*img.height]:null;
    batches.push({a,b,d,od:originDepth,z:(a.z+b.z+d.z)/3,col,opacity:mat.opacity,img,tx});
   }
  });
  batches.sort((a,b)=>b.od-a.od||b.z-a.z);
  for(const t of batches){ctx.globalAlpha=t.opacity;ctx.beginPath();ctx.moveTo(t.a.x,t.a.y);ctx.lineTo(t.b.x,t.b.y);ctx.lineTo(t.d.x,t.d.y);ctx.closePath();if(t.img&&t.tx){const [u0,v0,u1,v1,u2,v2]=t.tx;const det=u0*(v1-v2)+u1*(v2-v0)+u2*(v0-v1);if(Math.abs(det)<.0001)continue;const x0=t.a.x,x1=t.b.x,x2=t.d.x,y0=t.a.y,y1=t.b.y,y2=t.d.y;ctx.save();const mx=(t.a.x+t.b.x+t.d.x)/3,my=(t.a.y+t.b.y+t.d.y)/3;ctx.beginPath();[t.a,t.b,t.d].forEach((p,i)=>{const f=1+.5/Math.max(1,Math.hypot(p.x-mx,p.y-my)),x=mx+(p.x-mx)*f,y=my+(p.y-my)*f;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.closePath();ctx.clip();ctx.transform((x0*(v1-v2)+x1*(v2-v0)+x2*(v0-v1))/det,(y0*(v1-v2)+y1*(v2-v0)+y2*(v0-v1))/det,(x0*(u2-u1)+x1*(u0-u2)+x2*(u1-u0))/det,(y0*(u2-u1)+y1*(u0-u2)+y2*(u1-u0))/det,(x0*(u1*v2-u2*v1)+x1*(u2*v0-u0*v2)+x2*(u0*v1-u1*v0))/det,(y0*(u1*v2-u2*v1)+y1*(u2*v0-u0*v2)+y2*(u0*v1-u1*v0))/det);ctx.drawImage(t.img,0,0);ctx.restore();}else{ctx.fillStyle=t.col;ctx.fill();ctx.strokeStyle=t.col;ctx.lineWidth=.4;ctx.stroke();}}
  ctx.globalAlpha=1;this.info.render.triangles=batches.length;this.info.render.calls=batches.length;
 };
}

