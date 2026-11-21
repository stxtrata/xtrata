// Bounded offline sample operations. Identical grain offsets are used for every
// channel so stereo phase relationships survive stretching and pitch changes.
function stretch(input,ratio,sr,progress=()=>{}){
  if(!(ratio>=.25&&ratio<=4))throw Error('Stretch ratio must be between 0.25 and 4.');
  const length=Math.max(1,Math.round(input[0].length*ratio));if(length*input.length*4>128*1024*1024)throw Error('Processed sample exceeds the 128 MiB limit.');
  if(Math.abs(ratio-1)<1e-8)return input.map(x=>x.slice());
  const grain=Math.min(2048,2**Math.floor(Math.log2(Math.max(64,sr*.04)))),hop=grain/4,search=Math.floor(sr*.008),out=input.map(()=>new Float32Array(length+grain)),weight=new Float32Array(length+grain),window=Float32Array.from({length:grain},(_,i)=>.5-.5*Math.cos(2*Math.PI*i/grain));
  let previous=0;
  for(let dest=0;dest<length;dest+=hop){
    const expected=Math.round(dest/ratio),limit=Math.max(0,input[0].length-grain);let best=Math.max(0,Math.min(limit,expected)),bestScore=-Infinity;
    if(dest&&expected<limit){const low=Math.max(0,expected-search),high=Math.min(limit,expected+search),ref=previous+hop;
      for(let candidate=low;candidate<=high;candidate+=4){let cross=0,a=0,b=0;for(let j=0;j<grain-hop;j+=8){const x=input[0][ref+j]||0,y=input[0][candidate+j]||0;cross+=x*y;a+=x*x;b+=y*y;}const score=cross/Math.sqrt(a*b+1e-15);if(score>bestScore){bestScore=score;best=candidate;}}
    }
    for(let j=0;j<grain&&dest+j<out[0].length;j++){weight[dest+j]+=window[j];for(let ch=0;ch<input.length;ch++)out[ch][dest+j]+=(input[ch][best+j]||0)*window[j];}
    previous=best;if(dest%(hop*128)===0)progress(dest/length);
  }
  return out.map(channel=>{for(let i=0;i<length;i++)channel[i]=weight[i]>1e-7?channel[i]/weight[i]:0;return channel.slice(0,length);});
}
function resample(input,length){return input.map(channel=>{const out=new Float32Array(length),ratio=channel.length/length;for(let i=0;i<length;i++){const pos=i*ratio,j=Math.floor(pos),f=pos-j;out[i]=(channel[j]||0)*(1-f)+(channel[Math.min(j+1,channel.length-1)]||0)*f;}return out;});}
export function processSample({channels,sampleRate,operation,ratio=1,semitones=0,threshold=.3,crossfadeMs=10},progress){
  if(!channels?.length||channels.length>2||channels[0].length*channels.length*4>128*1024*1024)throw Error('Choose a mono/stereo sample under 128 MiB.');
  if(operation==='stretch')return{channels:stretch(channels,ratio,sampleRate,progress)};
  if(operation==='pitch'){const factor=2**(semitones/12),shifted=resample(channels,Math.max(1,Math.round(channels[0].length/factor)));return{channels:stretch(shifted,factor,sampleRate,progress)};}
  if(operation==='crossfade'){const n=Math.min(Math.floor(sampleRate*crossfadeMs/1000),Math.floor(channels[0].length/2));const result=channels.map(ch=>{const out=ch.slice(n);for(let i=0;i<n;i++){const a=(i+1)/(n+1);out[out.length-n+i]=ch[ch.length-n+i]*(1-a)+ch[i]*a;}return out;});return{channels:result};}
  if(operation==='peaks'){const bins=1024,peaks=channels.map(c=>{const values=new Float32Array(bins*2);for(let i=0;i<bins;i++){let min=1,max=-1;for(let j=Math.floor(i*c.length/bins);j<Math.floor((i+1)*c.length/bins);j++){min=Math.min(min,c[j]);max=Math.max(max,c[j]);}values[i*2]=min===1?0:min;values[i*2+1]=max===-1?0:max;}return values;});return{peaks};}
  if(operation==='slice'){const hop=Math.max(1,Math.floor(sampleRate*.01)),energy=[];for(let i=0;i<channels[0].length;i+=hop){let power=0;for(let j=i;j<Math.min(i+hop,channels[0].length);j++)for(const c of channels)power+=c[j]*c[j];energy.push(Math.sqrt(power/(hop*channels.length)));}let peak=energy.reduce((maximum,value)=>Math.max(maximum,value),0),last=-20;const slices=[0];for(let i=1;i<energy.length;i++){if(i-last<5)continue;const previous=energy.slice(Math.max(0,i-8),i).reduce((a,b)=>a+b,0)/Math.min(8,i);if(energy[i]>peak*threshold&&energy[i]>previous*1.8){slices.push(i*hop/sampleRate);last=i;}}return{slices};}
  throw Error('Unknown sample operation.');
}
if(typeof self!=='undefined'&&typeof document==='undefined')self.onmessage=e=>{const{id,job}=e.data;try{const result=processSample(job,progress=>self.postMessage({id,progress}));const transfer=[...result.channels||[],...result.peaks||[]].map(a=>a.buffer);self.postMessage({id,result},transfer);}catch(error){self.postMessage({id,error:error.message});}};
