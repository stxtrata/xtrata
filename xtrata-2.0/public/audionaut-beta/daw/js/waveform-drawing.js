// Cached min/max envelopes shared by pattern and song views. Never rescan a
// complete AudioBuffer on each playhead frame or when zooming out.
const cache = new WeakMap();
function peaks(data) {
  let levels = cache.get(data);
  if (levels) return levels;
  let size = 64,
    min = new Float32Array(Math.ceil(data.length / size)),
    max = new Float32Array(min.length);
  for (let b = 0; b < min.length; b++) {
    let lo = 1,
      hi = -1;
    for (let i = b * size; i < Math.min(data.length, (b + 1) * size); i++) {
      lo = Math.min(lo, data[i]);
      hi = Math.max(hi, data[i]);
    }
    min[b] = lo;
    max[b] = hi;
  }
  levels = [{ size, min, max }];
  while (min.length > 1) {
    const a = new Float32Array(Math.ceil(min.length / 2)),
      b = new Float32Array(a.length);
    for (let i = 0; i < a.length; i++) {
      a[i] = Math.min(min[i * 2], min[i * 2 + 1] ?? min[i * 2]);
      b[i] = Math.max(max[i * 2], max[i * 2 + 1] ?? max[i * 2]);
    }
    size *= 2;
    min = a;
    max = b;
    levels.push({ size, min, max });
  }
  cache.set(data, levels);
  return levels;
}
export function samplePeaks(data, from, to) {
  let start = Math.max(0, Math.min(data.length - 1, Math.floor(Math.min(from, to)))),
    end = Math.min(data.length, Math.max(start + 1, Math.ceil(Math.max(from, to))));
  const levels = peaks(data);
  let min = 1,
    max = -1;
  while (start < end) {
    // Largest aligned block that fits: at most 126 raw samples per query,
    // even when the whole song is squeezed into a few pixels.
    const level =
      start % 64 === 0
        ? levels.findLast((p) => start % p.size === 0 && start + p.size <= end)
        : null;
    if (level) {
      const i = start / level.size;
      min = Math.min(min, level.min[i]);
      max = Math.max(max, level.max[i]);
      start += level.size;
    } else {
      min = Math.min(min, data[start]);
      max = Math.max(max, data[start]);
      start++;
    }
  }
  return [min, max];
}
export function drawWaveformRegion(
  ctx,
  {
    buffer,
    x,
    y = 0,
    width,
    height,
    color,
    start = 0,
    end = buffer?.length || 0,
    visibleLeft = 0,
    visibleRight = ctx.canvas.width,
    indexAt,
    reverse = false,
    loop
  }
) {
  if (!buffer || width <= 0) return;
  const data = buffer.getChannelData(0),
    first = Math.max(0, Math.floor(visibleLeft - x)),
    last = Math.min(Math.ceil(width), Math.ceil(visibleRight - x));
  ctx.strokeStyle = color;
  ctx.beginPath();
  for (let px = first; px < last; px++) {
    const a = indexAt ? indexAt(px / width) : start + ((end - start) * px) / width,
      b = indexAt
        ? indexAt(Math.min(1, (px + 1) / width))
        : start + (end - start) * Math.min(1, (px + 1) / width);
    const intervals =
      loop && (reverse ? b > a : b < a)
        ? [
            samplePeaks(
              data,
              a,
              reverse
                ? buffer.length - 1 - loop.end * buffer.sampleRate
                : loop.end * buffer.sampleRate
            ),
            samplePeaks(
              data,
              reverse
                ? buffer.length - 1 - loop.start * buffer.sampleRate
                : loop.start * buffer.sampleRate,
              b
            )
          ]
        : [samplePeaks(data, a, b)];
    const lo = Math.min(...intervals.map((p) => p[0])),
      hi = Math.max(...intervals.map((p) => p[1]));
    ctx.moveTo(x + px + 0.5, y + ((1 + lo) * (height - 6)) / 2 + 3);
    ctx.lineTo(x + px + 0.5, y + ((1 + hi) * (height - 6)) / 2 + 3);
  }
  ctx.stroke();
}
