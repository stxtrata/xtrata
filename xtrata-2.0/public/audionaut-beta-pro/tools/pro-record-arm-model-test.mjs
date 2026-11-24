import assert from 'node:assert/strict';
import { Engine } from '../daw/js/engine.js';
import { makeProject, makeSequence, store } from '../daw/js/state.js';
import { quantizeRecordedSpan } from '../daw/js/performance-recorder.js';

// The real playback plan must establish its musical clock synchronously on
// the first note; slow preparation and a configured count-in cannot lose it.
const project=makeProject();
project.sequences.push(makeSequence());
project.currentSequence=1;
project.continuous=false;
project.recording.countIn=2;
const engine=new Engine({store:{project,on:()=>()=>{}}});
engine.ensureContext=()=>engine.ctx ||= {currentTime:10,sampleRate:48000};
engine._tick=()=>{};
engine._preparePlaybackSupport=async()=>{};
let clicks=0;
engine._click=()=>clicks++;
engine.editorTransport={startBeat:()=>16,loop:()=>({enabled:true,start:16,end:32})};
const beginning=engine.playFromEditor({firstNoteTime:10});
assert.ok(engine.isPlaying && !engine._transportPreparing);
assert.equal(clicks,0);
const first=engine.recordingInputTime(10);
assert.equal(engine.getTransportPosition(first).sequenceIndex,1);
assert.equal(engine.getTransportPosition(first).step,0);
assert.equal(engine.recordingInputTime(10.005),first,'early chord notes share the first beat');
const segments=engine.getTransportSegments(first,first+.3);
const [{sequenceIndex,note}]=quantizeRecordedSpan(segments,60,.8,64,{grid:0});
assert.equal(sequenceIndex,1);
assert.equal(note.rawStep,0);
assert.ok(Math.abs(note.rawDur-2.4)<1e-8,'first note keeps its original duration');
await beginning;
engine.ctx.currentTime=first+.4;
engine.stop();
assert.equal(engine.recordingInputTime(10),10);

// Normal Play still waits for preparation and honors count-in.
let ready;
engine.preparePlan=()=>new Promise(resolve=>ready=resolve);
const explicit=engine.playFromEditor();
assert.equal(engine._transportPreparing,true);
assert.equal(engine.getTransportPosition().playing,false);
ready();await explicit;
assert.equal(clicks,8);
assert.equal(engine.getTransportPosition().playing,false);
assert.equal(engine.recordingInputTime(engine.ctx.currentTime),engine.ctx.currentTime);
engine.stop();

// A take and the visible sequence share timing edits, without touching
// unrelated notes or overwriting raw expressive timing.
store.loadProject(makeProject());
const owner=store.instrument(0);
store.setNotes(0,[{step:1.3,dur:2.1,pitch:60,vel:.8},{step:5.4,dur:1.2,pitch:64,vel:.7}]);
const [firstNote,unrelated]=store.seq.notes[0];
owner.takes=[{id:'take-a',name:'Take 1',notes:[{sequenceIndex:0,note:structuredClone(firstNote)}]}];
owner.activeTakeId='take-a';
assert.equal(store.quantizeNotes(0,.5,.5,[firstNote.id]),1);
assert.ok(Math.abs(firstNote.step-1.65)<1e-8);
assert.equal(unrelated.step,5.4);
assert.equal(store.quantizeTake(owner.id,1,1),1);
assert.equal(firstNote.step,0);assert.equal(firstNote.dur,4);
assert.equal(owner.takes[0].notes[0].note.step,0);
assert.equal(unrelated.step,5.4);
store.quantizeTake(owner.id,0,1);
assert.equal(firstNote.step,1.3);assert.equal(firstNote.dur,2.1);
assert.equal(firstNote.pitch,60);assert.equal(firstNote.vel,.8);
store.selectTake(owner.id,'take-a');
assert.equal(store.seq.notes[0][0].step,1.3);

// Timeline takes and explicitly edited MIDI clips must be quantizable too.
store.loadProject(makeProject());
const track=store.instrument(0);
store.setTimeline({enabled:true});
const raw={id:'timeline-note',step:3.3,dur:2.2,rawStep:3.3,rawDur:2.2,pitch:67,vel:.6,expression:[{offset:0,type:'bend',value:1}]};
const clip=store.addClip({trackId:track.id,type:'midi',start:0,duration:16,takeId:'take-b',notes:[raw]});
track.takes=[{id:'take-b',name:'Take 1',clipIds:[clip.id],notes:[{sequenceIndex:0,note:structuredClone(raw)}]}];
track.activeTakeId='take-b';
store.quantizeTake(track.id,.5,1);
assert.equal(clip.notes[0].step,4);assert.equal(clip.notes[0].dur,2);
assert.equal(track.takes[0].notes[0].note.step,4);
store.quantizeNotes(0,0,1,null,{clipId:clip.id});
assert.equal(clip.notes[0].step,3.3);assert.equal(clip.notes[0].dur,2.2);
assert.equal(track.takes[0].notes[0].note.step,3.3);
assert.deepEqual(clip.notes[0].expression,raw.expression);
console.log('PASS note-triggered clock, count-in, selected notes and reversible sequence/Timeline take quantization');
