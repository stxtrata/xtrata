import re,sys
s=open('draft.html',encoding='utf-8').read()
def rep(old,new,count=1):
    global s
    n=s.count(old)
    assert n>=1,('missing',old[:90])
    if count==1: assert n==1,('not unique',n,old[:90])
    s=s.replace(old,new)

# --- title
rep('<title>The Basement · A place to play</title>','<title>The Basement · SNES Lounge</title>')

# --- 1024x576 TV canvas, separate Pixel Quest canvas for the cabinet
rep("const [screenCanvas,screenCtx]=canvas2(512,288);","const [screenCanvas,screenCtx]=canvas2(1024,576),[pqCanvas,pqCtx]=canvas2(512,288);")

# --- drawGame split
a=s.index("function drawGame(t,dt,playing){")
b=s.index(" game.time=t;if(playing&&!game.won)")
new_head='''function drawGame(t,dt,playing){
 // Main TV: the SNES (or, with no emulator attached, Pixel Quest). The cabinet always runs Pixel Quest on its own canvas.
 const arcadePlay=!!playing&&(!adapter||state.seat==='arcade');
 drawPixelQuest(pqCtx,t,dt,arcadePlay);
 const c=screenCtx;
 if(adapter){try{adapter.beforeFrame?.(t);drawEmulatorFrame(c,adapter)}catch(e){const failed=adapter;detachEmulator();toast('The emulator canvas could not be read. Use an origin-clean canvas.');console.error('Emulator canvas rejected',failed,e)}return}
 c.imageSmoothingEnabled=false;c.drawImage(pqCanvas,0,0,1024,576);
}
// Sharp-bilinear scaling: integer upscale first, then a smooth downscale to the TV, so SNES pixels stay crisp without shimmer.
const [emuTmp,emuTmpCtx]=canvas2(2,2);
function drawEmulatorFrame(c,a){
 const src=a.canvas;c.fillStyle='#08080f';c.fillRect(0,0,1024,576);
 let ratio=a.aspectRatio||src.width/src.height;if(!isFinite(ratio)||ratio<=0)return;
 let h=576,w=h*ratio;if(w>1024){w=1024;h=w/ratio}
 const k=Math.max(1,Math.ceil(Math.max(w/src.width,h/src.height)));
 if(emuTmp.width!==src.width*k||emuTmp.height!==src.height*k){emuTmp.width=src.width*k;emuTmp.height=src.height*k}
 emuTmpCtx.imageSmoothingEnabled=false;emuTmpCtx.drawImage(src,0,0,emuTmp.width,emuTmp.height);
 c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(emuTmp,(1024-w)/2,(576-h)/2,w,h);
}
function drawPixelQuest(c,t,dt,playing){
'''
s=s[:a]+new_head+s[b:]

# cabinet text + source
rep("c.drawImage(screenCanvas,0,48,256,144);pixelText(c,'PIXEL QUEST',128,22,17","c.drawImage(pqCanvas,0,48,256,144);pixelText(c,'PIXEL QUEST',128,22,17")
rep("state.playing?'PAUSED  /  CLICK TO RESUME':'PAUSED  /  PICK UP A CONTROLLER'","state.playing&&state.seat==='arcade'?'PAUSED  /  CLICK TO RESUME':'PAUSED  /  STEP UP TO PLAY'")
rep("'PICK UP A CONTROLLER. MAKE YOURSELF AT HOME.'","'STEP UP TO THE CABINET. ONE MORE GO.'")

# --- input routing: the cabinet owns the keyboard while you are at it
rep("onButton:(button,down)=>{try{adapter?.onButton?.(button,down)}catch(e){console.warn(e)}}","onButton:(button,down)=>{if(state.playing&&state.seat==='arcade')return;try{adapter?.onButton?.(button,down)}catch(e){console.warn(e)}}")
rep("if(!game.started&&!adapter)restartGame();syncInputMode(false);try{adapter?.onFocus?.()}catch(e){console.warn(e)}\n updateUI();R.canvas.focus({preventScroll:true});toast('Arcade controls","if(!game.started)restartGame();syncInputMode(false);try{adapter?.onBlur?.()}catch(e){console.warn(e)}\n updateUI();R.canvas.focus({preventScroll:true});toast('Arcade controls")
rep("if(e.code==='KeyR'&&gameInputActive()&&!adapter){restartGame();return}","if(e.code==='KeyR'&&gameInputActive()&&(!adapter||state.seat==='arcade')){restartGame();return}")

# --- help + hints
rep('<div class="help-row">Jump in Pixel Quest <span>Space / Z / ↑ · R restarts</span></div>','<div class="help-row">SNES pad <span>Arrows · Z=B · X=A · A=Y · S=X · Q=L · W=R · Enter=Start · Backspace=Select</span></div><div class="help-row">Jump in Pixel Quest (arcade cabinet) <span>Space / Z / ↑ · R restarts</span></div>')
rep('<div class="theater-hint">','<div class="theater-hint" id="theaterHint">')

# --- touch pad: full SNES layout (works for the cabinet too)
old_touch=s[s.index('<div class="game-touch" id="gameTouch">'):s.index('<div class="modal-scrim" id="help" hidden>')]
new_touch='''<div class="game-touch" id="gameTouch">
 <div class="snes-dpad"><button class="u" data-key="ArrowUp" aria-label="Up">↑</button><button class="l" data-key="ArrowLeft" aria-label="Left">←</button><button class="r" data-key="ArrowRight" aria-label="Right">→</button><button class="d" data-key="ArrowDown" aria-label="Down">↓</button></div>
 <div class="snes-face"><button class="fx" data-key="KeyS" aria-label="X">X</button><button class="fy" data-key="KeyA" aria-label="Y">Y</button><button class="fa" data-key="KeyX" aria-label="A">A</button><button class="fb" data-key="KeyZ" aria-label="B">B</button></div>
 <div class="snes-shoulders"><button data-key="KeyQ" aria-label="L">L</button><button data-key="KeyW" aria-label="R">R</button></div>
 <div class="snes-mid"><button data-key="Backspace" aria-label="Select">SELECT</button><button data-key="Enter" aria-label="Start">START</button></div>
</div>
'''
s=s.replace(old_touch,new_touch)

css='''
.game-touch .snes-dpad{position:absolute;left:18px;bottom:62px;width:176px;height:176px}
.game-touch .snes-dpad button{position:absolute;width:58px;height:58px;font-size:22px;border-radius:12px}
.snes-dpad .u{left:59px;top:0}.snes-dpad .d{left:59px;bottom:0}.snes-dpad .l{left:0;top:59px}.snes-dpad .r{right:0;top:59px}
.game-touch .snes-face{position:absolute;right:18px;bottom:62px;width:176px;height:176px}
.game-touch .snes-face button{position:absolute;width:62px;height:62px;border-radius:50%;font-size:15px;font-weight:700}
.snes-face .fx{left:57px;top:0}.snes-face .fb{left:57px;bottom:0}.snes-face .fy{left:0;top:57px}.snes-face .fa{right:0;top:57px}
.game-touch .snes-shoulders{position:absolute;left:18px;right:18px;bottom:252px;display:flex;justify-content:space-between}
.game-touch .snes-shoulders button{width:84px;height:40px;border-radius:10px;font-size:13px;font-weight:700}
.game-touch .snes-mid{position:absolute;left:50%;transform:translateX(-50%);bottom:62px;display:flex;gap:10px}
.game-touch .snes-mid button{width:78px;height:30px;border-radius:15px;font-size:9px;letter-spacing:.1em}
@media(max-height:520px){.game-touch .snes-dpad,.game-touch .snes-face{bottom:20px;width:140px;height:140px}.snes-dpad .u,.snes-dpad .d{left:47px}.snes-dpad .l,.snes-dpad .r{top:47px}.game-touch .snes-dpad button{width:46px;height:46px}.snes-face .fx,.snes-face .fb{left:45px}.snes-face .fy,.snes-face .fa{top:45px}.game-touch .snes-face button{width:50px;height:50px}.game-touch .snes-shoulders{bottom:170px}.game-touch .snes-mid{bottom:20px}}
.touch.playing .actionbar{bottom:62px}.touch.playing .carry-hud{display:none!important}\n.snes-now{font-size:12px;line-height:1.5;color:#e7d5f1;padding:9px 11px;border:1px solid var(--line);border-radius:9px;background:#ffffff0a;overflow-wrap:anywhere}
.snes-actions{display:flex;flex-direction:column;gap:8px;margin-top:10px}.snes-actions .ghost{font-size:10px;letter-spacing:.09em;border-radius:14px}
body.dropping::after{content:"DROP A ROM TO PLAY";position:fixed;inset:0;z-index:60;display:grid;place-items:center;background:#120b1fd9;color:#e7d5f1;font:700 26px Arial,sans-serif;letter-spacing:.2em;pointer-events:none}
</style>'''
rep("\n</style>\n</head>",css+"\n</head>")

# --- Games section in the room controls panel + GAMES button
sec='''<details class="control-section" id="section-05" open><summary><span><span class="section-number">05</span>SNES games</span></summary><div class="section-body"><div class="control"><div class="control-top"><label>On the big screen</label></div><div class="snes-now" id="snesNow" role="status" aria-live="polite">Warming up the console…</div></div><div class="snes-actions"><button class="ghost" id="snesStar" type="button">Play STAR PATROL</button><button class="ghost" id="snesLoadBtn" type="button">Load a ROM file…</button><button class="ghost" id="snesReset" type="button">Reset the console</button></div><input type="file" id="snesFile" accept=".sfc,.smc,.zip" hidden><p class="control-note" style="margin-top:12px">Or drop a ROM anywhere on the page. Games you load stay on your device and are never uploaded. Battery saves are kept in this browser. Pixel Quest lives on the arcade cabinet.</p></div></details>'''
rep('</div></details></div><div class="settings-footer">','</div></details>'+sec+'</div><div class="settings-footer">')
rep('<button class="tool" id="settingsBtn"','<button class="tool" id="gamesBtn" aria-label="Choose a SNES game"><svg viewBox="0 0 20 20"><path d="M3 6h14a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2l-2-2H7l-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zM5 9v3M3.5 10.5h3M13 9.5h.01M15 11.5h.01"/></svg><span class="tool-label">GAMES</span></button>\n <button class="tool" id="settingsBtn"')

rep("play:()=>startPlay(),","play:()=>startPlay(),playArcade:()=>startPlay(true),")

# --- hidden emulator data
rep('<script>\nconst EMBEDDED_ASSETS','<script id="emuB64" type="text/plain">/*__EMULATOR_B64__*/</script>\n<script id="romB64" type="text/plain">/*__ROM_B64__*/</script>\n<script>\nconst EMBEDDED_ASSETS')

# --- emulator host (runs after the room script)
host=open('host.js',encoding='utf-8').read()

# --- walk-up console on the coffee table: click it (or E) to reset the SNES
rep("controller([-.60,.709,.37],-.25);controller([.60,.709,.40],.28);controller([-4.2,1.04,-.88],.65);",
"""controller([-.60,.709,.37],-.25);controller([.60,.709,.40],.28);controller([-4.2,1.04,-.88],.65);
const consoleItem={id:'console',label:'the console',position:[.42,.083,-4.15],angle:-.42};
{const cb=R.material({...mat.plain}),cd=R.material({...mat.plain}),cdark=R.material({...mat.black}),cbtn=R.material({...mat.plain}),cled=R.material({emit:1.4,shadow:false});
 G(consoleItem.position,[0,consoleItem.angle,0],()=>{box([0,0,0],[.46,.07,.34],cb,'#b9b3c4',.03);box([0,.039,.015],[.40,.012,.27],cd,'#8d879b',.01);box([-.06,.047,-.02],[.2,.012,.045],cdark,'#2c2836',.006);box([.11,.047,-.01],[.075,.012,.12],cdark,'#363143',.006);box([0,-.006,.172],[.44,.034,.008],cdark,'#3a3548',.004);for(const x of[-.17,-.105])box([x,-.004,.176],[.05,.03,.016],cdark,'#1d1a26',.006);box([.04,.0,.176],[.05,.028,.016],cbtn,'#d4755a',.008);box([.15,.012,.174],[.012,.012,.012],cled,'#7cf0b8',.003);box([-.19,.047,.1],[.045,.004,.012],cled,'#b78cf0',.002)});}
""")
rep("function currentPickup(){","""function pickConsole(clientX=null,clientY=null){
 if(state.playing||state.settingsOpen||state.transition||state.inputPaused||state.mode==='welcome'||!$('help').hidden)return false;
 if(controllerDistance(consoleItem)>3.6)return false;
 const rect=R.canvas.getBoundingClientRect(),locked=document.pointerLockElement===R.canvas;
 const nx=locked||clientX===null?0:(clientX-rect.left)/rect.width*2-1,ny=locked||clientY===null?0:1-(clientY-rect.top)/rect.height*2;
 const cp=Math.cos(camera.pitch),forward=[-Math.sin(camera.yaw)*cp,Math.sin(camera.pitch),-Math.cos(camera.yaw)*cp],right=[Math.cos(camera.yaw),0,-Math.sin(camera.yaw)],up=V.cross(right,forward),tan=Math.tan(camera.fov/2),aspect=rect.width/rect.height;
 const dir=V.norm(forward.map((v,i)=>v+right[i]*nx*tan*aspect+up[i]*ny*tan)),origin=[camera.x,camera.y,camera.z];
 const t=rayBox(origin,dir,consoleItem.position,[.3,.09,.23],consoleItem.angle);
 return t!==null&&!blockedPickupRay(origin,dir,t);
}
function currentConsole(){return pickConsole(pickupPointer.inside?pickupPointer.x:null,pickupPointer.inside?pickupPointer.y:null)}
function resetConsole(){toast('Console reset. Back to the title screen.');window.dispatchEvent(new CustomEvent('lounge-console-reset'))}
function currentPickup(){""")
rep(" const item=currentPickup();if(item&&!state.controllerId){pickupController(item.id);return}\n const n=nearby();",
    " const item=currentPickup();if(item&&!state.controllerId){pickupController(item.id);return}\n if(!item&&currentConsole()){resetConsole();return}\n const n=nearby();")
rep("if(!wasPaused){const item=pickController(e.clientX,e.clientY);if(item)pickupController(item.id)}",
    "if(!wasPaused){const item=pickController(e.clientX,e.clientY);if(item)pickupController(item.id);else if(pickConsole(e.clientX,e.clientY))resetConsole()}")
rep(" if(item){e.hidden=false;e.innerHTML='<span class=\"key\">Click</span> Pick up '+item.label+' <span class=\"pickup-detail\"> · E / Enter</span>';return}",
    " if(item){e.hidden=false;e.innerHTML='<span class=\"key\">Click</span> Pick up '+item.label+' <span class=\"pickup-detail\"> · E / Enter</span>';return}\n if(currentConsole()){e.hidden=false;e.innerHTML='<span class=\"key\">Click</span> Reset the console <span class=\"pickup-detail\"> · E</span>';return}")


rep("cable([[-.6,.68,.21],[-.7,.68,-.1],[-.8,.68,-.72],[-.89,.50,-.84],[-.9,.06,-1.1],[-1.1,.052,-1.8],[-.65,.048,-3.2],[-.3,.047,-4.4],[-.15,.38,-5.16]]);",
"""const cw=(x,y,z)=>{const a=consoleItem.angle,c=Math.cos(a),s=Math.sin(a);return[consoleItem.position[0]+c*x+s*z,consoleItem.position[1]+y,consoleItem.position[2]-s*x+c*z]};
const portP=cw(-.17,-.004,.19);
cable([[-.6,.68,.21],[-.7,.68,-.1],[-.8,.68,-.72],[-.89,.50,-.84],[-.9,.06,-1.1],[-1.1,.052,-1.8],[-.95,.05,-2.7],[-.35,.05,-3.1],[.05,.05,-3.45],[-.12,.05,-3.85],[portP[0]-.05,.05,portP[2]+.2],portP]);
function lead(points,r,col){for(let i=0;i<points.length-1;i++)tube(points[i],points[i+1],r,controllerCable,col,6)}
{const rear=cw(.12,-.01,-.18),rear2=cw(-.08,-.01,-.18);
 lead([rear,[rear[0]+.16,.05,rear[2]-.25],[rear[0]+.62,.045,rear[2]-.18],[rear[0]+.95,.045,rear[2]-.62],[1.62,.045,-4.98],[1.9,.045,-5.12]],.011,'#1c1824');
 lead([rear2,[rear2[0]-.2,.05,rear2[2]-.3],[rear2[0]-.5,.05,rear2[2]-.2],[rear2[0]-.62,.06,rear2[2]-.62],[-.25,.2,-5.02],[-.18,.37,-5.14]],.008,'#d6c25a');
 lead([cw(-.02,-.01,-.18),[rear2[0]-.1,.05,rear2[2]-.25],[rear2[0]-.4,.05,rear2[2]-.45],[-.2,.18,-5.0],[-.13,.37,-5.14]],.008,'#e8e4ee');
 lead([cw(-.14,-.01,-.18),[rear2[0]-.35,.05,rear2[2]-.15],[rear2[0]-.6,.05,rear2[2]-.55],[-.28,.18,-5.05],[-.2,.37,-5.15]],.008,'#c84e5e');}
const cbrickM=R.material({...mat.black});
G([1.48,.075,-4.62],[0,.5,0],()=>{box([0,0,0],[.15,.05,.085],cbrickM,'#26222f',.012);});
lead([[1.48,.075,-4.62],[1.55,.05,-4.78],[1.62,.045,-4.98]],.009,'#1c1824');""")


rep("consoleUnit([1.58,.25,-5.35],.95);consoleUnit([-.0,.64,-5.5],.8,.02);","consoleUnit([1.58,.25,-5.35],.95);")
rep('</body>','<script>\n'+host+'\n</script>\n</body>')
open('src.html','w',encoding='utf-8').write(s)
print('patched',len(s))
