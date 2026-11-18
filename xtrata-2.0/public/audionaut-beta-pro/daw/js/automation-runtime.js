export function automationValueAt(lane,beat) {
  const points=lane.points||[];let previous=null;
  for(const point of points){if(point.beat>beat){if(!previous)return undefined;if(previous.curve==='step')return previous.value;return previous.value+(point.value-previous.value)*(beat-previous.beat)/(point.beat-previous.beat);}previous=point;}
  return previous?.value;
}
export function voiceAutomation(project,trackId,start,end) {
  const out=[];
  for(const lane of project.timeline.automation||[]){if(lane.enabled===false||lane.target.trackId!==trackId||!['synthParam','bend'].includes(lane.target.kind))continue;
    const value=automationValueAt(lane,start);if(value!==undefined)out.push({target:lane.target,beat:start,endBeat:start,value,curve:'step'});
    const boundaries=[start,...lane.points.filter(p=>p.beat>start&&p.beat<end).map(p=>p.beat),...(project.timeline.enabled?project.timeline.tempo:[]).filter(p=>p.beat>start&&p.beat<end).map(p=>p.beat),end].sort((a,b)=>a-b).filter((p,i,a)=>!i||p!==a[i-1]);
    for(let i=0;i<boundaries.length-1;i++){const a=boundaries[i],b=boundaries[i+1],from=automationValueAt(lane,a),to=automationValueAt(lane,b),previous=lane.points.filter(p=>p.beat<=a).at(-1);if(from===undefined||to===undefined)continue;if(previous?.curve==='step'){if(to!==from)out.push({target:lane.target,beat:b,endBeat:b,value:to,curve:'step'});}else out.push({target:lane.target,beat:a,endBeat:b,fromValue:from,value:to,curve:'linear'});}
  }return out;
}
