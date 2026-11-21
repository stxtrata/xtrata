// Chase legacy graph automation whose virtual onset is before context time zero.
// Preserve the level and slope at zero; negative native timestamps are never sent.
export function replayChasedAutomation(param, events, methods) {
  const schedule = events.map((e,i)=>({...e,i,time:e.args[e.name.startsWith('cancel')?0:1]})).sort((a,b)=>a.time-b.time||a.i-b.i);
  let value=param.value,lastTime=0,lastValue=value,active=null;
  const curveAt=(a,start,duration,time)=>{const n=Math.max(0,Math.min(a.length-1,(time-start)/duration*(a.length-1))),i=Math.floor(n),f=n-i;return a[i]+((a[Math.min(i+1,a.length-1)]??a[i])-a[i])*f;};
  for(const e of schedule){if(e.time>0)break;
    if(active?.kind==='target')value=active.target+(active.value-active.target)*Math.exp(-(e.time-active.time)/active.constant);
    if(active?.kind==='curve')value=curveAt(active.array,active.time,active.duration,e.time);
    const [v,t,d]=e.args;
    if(e.name==='setValueAtTime'||e.name==='linearRampToValueAtTime'||e.name==='exponentialRampToValueAtTime'){value=v;active=null;}
    else if(e.name==='setTargetAtTime')active={kind:'target',target:v,value,time:t,constant:d};
    else if(e.name==='setValueCurveAtTime'){value=v[0];active={kind:'curve',array:v,time:t,duration:d};}
    lastTime=e.time;lastValue=value;
  }
  if(active?.kind==='target')value=active.target+(active.value-active.target)*Math.exp(active.time/active.constant);
  else if(active?.kind==='curve')value=curveAt(active.array,active.time,active.duration,0);
  const next=schedule.find(e=>e.time>0);
  if(!active&&lastTime<0&&next&&['linearRampToValueAtTime','exponentialRampToValueAtTime'].includes(next.name)){
    const x=-lastTime/(next.time-lastTime),end=next.args[0];value=next.name==='linearRampToValueAtTime'?lastValue+(end-lastValue)*x:lastValue*Math.pow(end/lastValue,x);
  }
  if(Number.isFinite(value))methods.setValueAtTime(value,0);
  if(active?.kind==='target')methods.setTargetAtTime(active.target,0,active.constant);
  if(active?.kind==='curve'&&active.time+active.duration>0){
    const duration=active.time+active.duration,n=Math.max(2,Math.ceil(active.array.length*duration/active.duration));
    const array=Float32Array.from({length:n},(_,i)=>curveAt(active.array,active.time,active.duration,i/(n-1)*duration));methods.setValueCurveAtTime(array,0,duration);
  }
  for(const e of schedule)if(e.time>0)methods[e.name](...e.args);
}
