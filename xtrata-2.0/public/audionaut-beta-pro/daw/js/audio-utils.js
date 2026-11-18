// Decoded-audio measurements and PCM export. No network or project mutations.

// Base64 → ArrayBuffer without a per-byte callback (several times faster than
// Uint8Array.from(atob(x), fn) on multi-megabyte audio).
export function base64ToBytes(base64) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

export function audioAnalysis(buffer) {
  let peak = 0,
    sum = 0,
    dc = 0,
    silent = 0,
    count = 0;
  for (let c = 0; c < buffer.numberOfChannels; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0, n = data.length; i < n; i++) {
      const value = data[i],
        abs = value < 0 ? -value : value;
      if (abs > peak) peak = abs;
      sum += value * value;
      dc += value;
      if (abs < 0.001) silent++;
    }
    count += data.length;
  }
  const rms = Math.sqrt(sum / count);
  return {
    duration: buffer.duration,
    sampleRate: buffer.sampleRate,
    channels: buffer.numberOfChannels,
    peak,
    peakDb: peak ? 20 * Math.log10(peak) : null,
    rms,
    rmsDb: rms ? 20 * Math.log10(rms) : null,
    dcOffset: dc / count,
    silencePercent: (100 * silent) / count,
  };
}

export function selectionBounds(buffer, start = 0, end = buffer.duration) {
  if (
    !Number.isFinite(start) ||
    !Number.isFinite(end) ||
    start < 0 ||
    end <= start ||
    start >= buffer.duration ||
    end > buffer.duration + 0.001
  )
    throw new Error("Choose start/end times within the available audio.");
  return { start, end: Math.min(end, buffer.duration) };
}

export function encodeWav(
  buffer,
  {
    start = 0,
    end = buffer.duration,
    reverse = false,
    pitch = 1,
    loop = null,
    sustainSeconds = null,
    bitDepth = 16,
    dither = false,
    seed = 1,
    signal = null,
    onProgress = null,
  } = {},
) {
  const bounds = selectionBounds(buffer, start, end);
  if(![16,24,'float32'].includes(bitDepth))throw new Error('Choose 16-bit, 24-bit or 32-bit float WAV.');
  if(signal?.aborted)throw new DOMException('Export cancelled.','AbortError');
  const float=bitDepth==='float32',bits=float?32:bitDepth,bytesPerSample=bits/8;
  let randomState=Number(seed)||1;const random=()=>{randomState=(Math.imul(randomState,1664525)+1013904223)>>>0;return randomState/4294967296;};
  if (!Number.isFinite(pitch) || pitch < 0.1 || pitch > 4)
    throw new Error("Playback speed must be between 0.1 and 4.");
  const first = Math.floor(bounds.start * buffer.sampleRate),
    last = Math.min(buffer.length, Math.ceil(bounds.end * buffer.sampleRate));
  const sustained =
    loop &&
    !reverse &&
    sustainSeconds > 0 &&
    start <= loop.start &&
    end >= loop.end;
  const frames = Math.max(
      1,
      sustained
        ? Math.ceil(sustainSeconds * buffer.sampleRate)
        : Math.ceil((last - first) / pitch),
    ),
    channels = buffer.numberOfChannels;
  const bytes = frames * channels * bytesPerSample;
  if (bytes > 512 * 1024 * 1024)
    throw new Error("This WAV is too large. Export a shorter section.");
  const padding=bytes&1;
  const output = new ArrayBuffer(44 + bytes + padding),
    view = new DataView(output);
  const text = (at, s) => {
    for (let i = 0; i < s.length; i++) view.setUint8(at + i, s.charCodeAt(i));
  };
  text(0, "RIFF");
  view.setUint32(4, 36 + bytes + padding, true);
  text(8, "WAVE");
  text(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, float?3:1, true);
  view.setUint16(22, channels, true);
  view.setUint32(24, buffer.sampleRate, true);
  view.setUint32(28, buffer.sampleRate * channels * bytesPerSample, true);
  view.setUint16(32, channels * bytesPerSample, true);
  view.setUint16(34, bits, true);
  text(36, "data");
  view.setUint32(40, bytes, true);
  for (let c = 0; c < channels; c++) {
    const data = buffer.getChannelData(c);
    for (let f = 0; f < frames; f++) {
      if(f%65536===0){if(signal?.aborted)throw new DOMException('Export cancelled.','AbortError');onProgress?.((c*frames+f)/(channels*frames));}
      let position = reverse ? last - 1 - f * pitch : first + f * pitch;
      if (sustained && position >= loop.end * buffer.sampleRate)
        position =
          loop.start * buffer.sampleRate +
          ((position - loop.start * buffer.sampleRate) %
            ((loop.end - loop.start) * buffer.sampleRate));
      const i = Math.max(first, Math.min(last - 1, Math.floor(position))),
        next = Math.min(last - 1, i + 1);
      const fraction = Math.max(0, Math.min(1, position - i));
      const envelope = sustained
        ? Math.min(
            1,
            f / Math.max(1, buffer.sampleRate * 0.005),
            (frames - 1 - f) / Math.max(1, buffer.sampleRate * 0.005),
          )
        : 1;
      const raw=envelope*(data[i]*(1-fraction)+data[next]*fraction),at=44+(f*channels+c)*bytesPerSample;
      if(float)view.setFloat32(at,Number.isFinite(raw)?raw:0,true);
      else {
        const scale=2**(bits-1),noise=dither?(random()-random())/scale:0;
        const value=Math.max(-1,Math.min(1,(Number.isFinite(raw)?raw:0)+noise));
        const pcm=Math.round(value<0?value*scale:value*(scale-1));
        if(bits===16)view.setInt16(at,pcm,true);
        else{view.setUint8(at,pcm&255);view.setUint8(at+1,(pcm>>8)&255);view.setUint8(at+2,(pcm>>16)&255);}
      }
    }
  }
  onProgress?.(1);return new Blob([output], { type: "audio/wav" });
}

// Encoding runs off the UI/audio scheduler thread. Cancellation terminates its worker.
export async function encodeWavAsync(buffer,options={}) {
  if(options.signal?.aborted)throw new DOMException('Export cancelled.','AbortError');
  if(typeof Worker==='undefined')return encodeWav(buffer,options);
  const {signal,onProgress,...settings}=options;
  const worker=new Worker(new URL('./wav-worker.js',import.meta.url),{type:'module'});
  const channels=Array.from({length:buffer.numberOfChannels},(_,i)=>buffer.getChannelData(i).slice());
  return new Promise((resolve,reject)=>{
    const finish=(fn,value)=>{worker.terminate();signal?.removeEventListener('abort',abort);fn(value);};
    const abort=()=>finish(reject,new DOMException('Export cancelled.','AbortError'));
    signal?.addEventListener('abort',abort,{once:true});
    worker.onerror=event=>finish(reject,new Error(event.message||'WAV encoding failed.'));
    worker.onmessage=({data})=>{if(data.progress!=null)onProgress?.(data.progress);else if(data.error)finish(reject,new Error(data.error));else finish(resolve,data.blob);};
    worker.postMessage({channels,sampleRate:buffer.sampleRate,settings},channels.map(c=>c.buffer));
  });
}

export function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function reportCsv(rows) {
  const quote = (value) =>
    '"' +
    (
      (typeof value === "string" && /^[=+@\-\t\r]/.test(value) ? "'" : "") +
      String(value ?? "")
    ).replaceAll('"', '""') +
    '"';
  return rows.map((row) => row.map(quote).join(",")).join("\r\n");
}
