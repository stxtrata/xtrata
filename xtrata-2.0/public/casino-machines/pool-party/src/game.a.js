/* Pool Party — ParallaX Casino machine 23: a Stacks DeFi rooftop pool.
   Every result comes from BF (the Block Fortune v2 engine, copied unchanged) before any art, sound or scene is chosen,
   so the presentation can only reveal a result, never change one. Lab runs use the raw engine on a separate lab state. */
(() => {
'use strict';let pxEngineActive=false;
const GAME_ID='pool-party', LAYR=window.ParallaxLAYRAccount, E=LAYR.machine(GAME_ID,BF);
if (window.__bfUnsupported) return;
const $ = id => document.getElementById(id), fmt = n => (Math.round(n*100)/100).toLocaleString('en-GB',{maximumFractionDigits:2});
// Poolside palette; project artwork retains its original colours.
const bets = E.bets, ACCENT = '#06b6d4', BRASS = '#ffb16a', BRASS_D = '#b66b3b', KHAKI = '#77cdd3', OLIVE = '#1d8191', INK = '#07353e', STAKEC = '#f5fcf7', CRIM = '#f97770', STEEL = '#b9bcbd';
const HOSTED = (() => { try { return window.parent !== window && !!window.frameElement; } catch (e) { return window.parent !== window; } })();
// Public practice preview is always available; developer Test controls require this one explicit flag.
const DEV = window.PX_STANDALONE_TEST === true || (() => { try { return window.parent !== window && window.parent.PX_STANDALONE_TEST === true; } catch (e) { return false; } })();
const RM = () => !!(state.reduced || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches));
// Player-facing names. The engine's slot ids (cherry, lemon, …) are internal and never shown.
const NAMES = { cherry: 'USDA', lemon: 'DIKO', chip: 'CHA', block: 'VELAR', artifact: 'ALEX', bitcoin: 'STX', wild: 'LP token', scatter: 'Swap', vault: 'Yield', chain: 'Pool pair' };
const MARCH_CELLS = 15;            // Deep Liquidity: 15 lanes of real trading pairs, each revealed from the committed round.
let storageOK = true, sessionLock = true;
let state = LAYR.openGame(GAME_ID,E);
let G = E;                                 // the engine in use: E (LAYR-wrapped) for real play, pristine PX_PURE in a practice run
let realState = null, labRun = null, labBalance = 100000, labHistory = [], labLast = null, labAll = null;
function save(){if(!sessionLock&&!labRun)LAYR.saveGame(state);}
let spinning = false, autoLeft = 0, autoTimer = 0, lastResult = null, lastDraw = 0, screenDirty = true, winUntil = 0, winStart = 0, leverStart = 0, view = 'cabinet', chainFlash = 0, animations = [], screenRev = 0;
let scene = null, sceneQueue = [], freeMode = false, freeTimer = 0, excite = 0, tagGlow = [0, 0, 0, 0, 0, 0, 0, 0], fsOn = false, holderMode = 'live';
const feature = () => G.feature(state);
const busy = () => spinning || !!feature() || state.free > 0 || !!scene || sceneQueue.length > 0;
function toast(s) { $('toast').textContent = s; $('toast').classList.add('show'); clearTimeout(toast.t); toast.t = setTimeout(() => $('toast').classList.remove('show'), 3400); }
function status(s) { $('status').textContent = s; screenDirty = true; }
function locked(){if(labRun)return false;if(sessionLock||!LAYR.ready()){toast(LAYR.error()||'LAYR account is not available.');return true;}return false;}
const PRESS = {}, markPress = n => { PRESS[n] = performance.now(); }, pressing = n => performance.now() - (PRESS[n] || -1e9) < 150 ? 1 : 0;
const quick = () => !!(state.turbo || RM());
const sleep = ms => new Promise(r => setTimeout(r, ms));


/* Poolside audio: original procedural lounge arrangement and water synthesis.
   These are deliberate fallbacks where no suitably verified recording is bundled.
   No sampled melody or third-party recording. Listening sign-off owed. */
let ac=null,master=null,ambNodes=[],noiseBuf=null,musicTimer=0;
const soundLog=[];
function audioInit(){if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)();master=ac.createGain();master.connect(ac.destination);const n=ac.sampleRate*2;noiseBuf=ac.createBuffer(1,n,ac.sampleRate);const d=noiseBuf.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;}catch(e){ac=null;return;}}if(ac.state==='suspended')ac.resume().catch(()=>{});master.gain.value=state.muted?0:state.volume*.65;}
function tone(f,d=.15,type='sine',v=.1,delay=0,slide=1){if(!ac||state.muted)return;const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime+delay;o.type=type;o.frequency.setValueAtTime(f,t);if(slide!==1)o.frequency.exponentialRampToValueAtTime(f*slide,t+d);o.connect(g);g.connect(master);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.008);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.start(t);o.stop(t+d+.02);return o;}
function noise(d=.2,v=.12,f0=1800,f1=400,delay=0){if(!ac||state.muted)return;const s=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain(),t=ac.currentTime+delay;s.buffer=noiseBuf;f.type='lowpass';f.frequency.setValueAtTime(f0,t);f.frequency.exponentialRampToValueAtTime(Math.max(80,f1),t+d);s.connect(f);f.connect(g);g.connect(master);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+Math.min(.04,d/4));g.gain.exponentialRampToValueAtTime(.0001,t+d);s.start(t);s.stop(t+d+.03);return s;}
function splash(size=1,at=0){noise(.22+size*.3,.11*size,2400,350,at);for(let i=0;i<4;i++)tone(380+i*190,.1,'sine',.028*size,at+.03*i,1.8);}
function brass(f,d=.3,delay=0,v=.07){tone(f,d*1.6,'sine',v,delay);tone(f*2,d*.75,'triangle',v*.2,delay);}
const BUGLE={g4:392,c5:523.25,e5:659.25,g5:783.99,c6:1046.5};
function snare(v=.1,delay=0,pitch=1,len=.1){noise(len,v*.5,5000,2500,delay);}
function kick(v=.15,delay=0){tone(80,.19,'sine',v,delay,.45);}
function roll(n=8,span=.8,v0=.03,v1=.1,delay=0){for(let i=0;i<n;i++)snare(v0+(v1-v0)*i/n,delay+i*span/n);}
const audioLatency=()=>ac?(ac.outputLatency||ac.baseLatency||0):0;
function sound(kind,i=0,at=0){audioInit();soundLog.push({kind:kind==='howl'?'cannonball':kind,reel:i,t:performance.now()+at*1000});if(soundLog.length>120)soundLog.shift();if(!ac)return[];
 if(kind==='stop'){splash(.45+i*.055,at);return[tone(196+i*49,.16,'sine',.04,at)].filter(Boolean);}
 if(['lock','pick','reset','celltap'].includes(kind)){splash(kind==='lock'?.6:.24,at);[523,659,784].slice(0,kind==='reset'?3:1).forEach((f,k)=>brass(f+i*15,.2,at+k*.08,.065));}
 if(['spin','respin','spinCells','march'].includes(kind)){noise(.25,.06,900,2400);tone(150,.18,'sine',.05,0,1.8);}
 if(['win','big','bonus','airdrop','crescendo'].includes(kind)){[392,493.88,587.33,783.99].forEach((f,k)=>brass(f,kind==='win'?.35:.6,k*.12,.075));if(kind==='big'||kind==='crescendo')splash(1.4,.2);}
 if(kind==='howl'){splash(2.4);[261.63,329.63,392,493.88,523.25].forEach((f,k)=>brass(f,1.6,k*.12,.075));}
 if(kind==='tension'||kind==='antic')roll(8,.8,.02,.07);
 if(kind==='flip'){for(let j=0;j<6;j++)tone(620+j*90,.08,'sine',.035,j*.09);}
 if(kind==='click')tone(880,.045,'sine',.04);if(kind==='thud')kick();if(kind==='lose')tone(220,.35,'sine',.07,0,.7);return[];}
function ambient(){ambNodes.forEach(o=>{try{o.stop();}catch(e){}});ambNodes=[];if(!state.ambient||state.muted||!ac)return;[130.81,196,246.94].forEach((f,i)=>{const o=ac.createOscillator(),g=ac.createGain();o.frequency.value=f;g.gain.value=.004/(i+1);o.connect(g);g.connect(master);o.start();ambNodes.push(o);});}
function music(on){clearInterval(musicTimer);musicTimer=0;if(!on)return;let k=0;const chords=[[261.63,329.63,392,493.88],[220,261.63,329.63,392],[174.61,220,261.63,329.63],[196,246.94,293.66,369.99]];musicTimer=setInterval(()=>{if(!ac||state.muted||document.hidden)return;const beat=k++%32,ch=chords[Math.floor(beat/8)];if(beat%4===0){ch.forEach((f,i)=>brass(f,.65,i*.025,.025));kick(.055);}if(beat%2===1)snare(.025);if(beat%8===6)brass(ch[2]*2,.24,0,.03);},240);}
const unlockAudio=()=>{audioInit();['pointerdown','keydown'].forEach(ev=>removeEventListener(ev,unlockAudio,true));};['pointerdown','keydown'].forEach(ev=>addEventListener(ev,unlockAudio,true));
