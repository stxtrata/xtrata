// Browser-native, opt-in player artwork resizing. Original files are never overwritten.
(function () {
  const profiles = {
    standard: { edge: 512, quality: 0.8, target: 100 * 1024 },
    small: { edge: 256, quality: 0.65, target: 30 * 1024 },
    tiny: { edge: 128, quality: 0.5, target: 12 * 1024 },
    detailed: { edge: 1024, quality: 0.85, target: 200 * 1024 }
  };
  function dimensions(width, height, edge) {
    const scale = Math.min(1, edge / Math.max(width, height));
    return {
      width: Math.max(1, Math.round(width * scale)),
      height: Math.max(1, Math.round(height * scale))
    };
  }
  function warnings(width, height, bytes) {
    const list = [];
    if (Math.max(width, height) > 1024)
      list.push(
        'High resolution for a player cover. 512 px on the longest edge is usually sufficient.'
      );
    if (bytes > 250 * 1024)
      list.push(
        'Large artwork: over 250 KB. Aim for 50–100 KB, or choose 256 px for a smaller inscription.'
      );
    if (bytes > 1024 * 1024)
      list.push(
        'This image exceeds 1 MiB and can add substantially to the inscription size. Optimisation is strongly recommended.'
      );
    return list;
  }
  // Counts the frames in a GIF by walking its block structure (no decoding). Returns 0 when the
  // bytes are not a readable GIF, so callers treat "unknown" as "not animated".
  function countGifFrames(bytes) {
    const n = bytes.length;
    if (n < 13 || String.fromCharCode(...bytes.subarray(0, 3)) !== 'GIF') return 0;
    const skipBlocks = (at) => {
      while (at < n && bytes[at] !== 0) at += bytes[at] + 1;
      return at + 1;
    };
    let at = 13;
    if (bytes[10] & 0x80) at += 3 * (1 << ((bytes[10] & 7) + 1));
    let frames = 0;
    while (at < n) {
      const b = bytes[at];
      if (b === 0x3b) break;
      if (b === 0x21) at = skipBlocks(at + 2);
      else if (b === 0x2c) {
        frames++;
        if (at + 10 > n) break;
        const flags = bytes[at + 9];
        at += 10;
        if (flags & 0x80) at += 3 * (1 << ((flags & 7) + 1));
        at = skipBlocks(at + 1);
      } else break;
    }
    return frames;
  }
  const gifNote =
    'Animated GIF: it is embedded exactly as uploaded so it keeps moving. It cannot be resized or compressed here, so shrink it elsewhere first if it is large.';
  async function frameCount(file) {
    if (file.type !== 'image/gif') return 0;
    try {
      return countGifFrames(new Uint8Array(await file.arrayBuffer()));
    } catch {
      return 0;
    }
  }
  async function decode(file) {
    if (!/^image\/(png|jpeg|webp|gif)$/.test(file.type))
      throw Error('Choose a PNG, JPEG, WebP or GIF image.');
    if (file.size > 20 * 1048576)
      throw Error('Artwork above 20 MiB is too large to prepare here. Resize it locally first.');
    const bitmap = await createImageBitmap(file);
    if (bitmap.width * bitmap.height > 40000000) {
      bitmap.close();
      throw Error(
        'Artwork above 40 megapixels is too large for this editor. Resize it locally first.'
      );
    }
    return bitmap;
  }
  async function inspect(file) {
    const image = await decode(file);
    try {
      const frames = await frameCount(file),
        list = warnings(image.width, image.height, file.size);
      if (frames > 1) list.unshift(gifNote);
      return {
        width: image.width,
        height: image.height,
        bytes: file.size,
        animated: frames > 1,
        warnings: list
      };
    } finally {
      image.close();
    }
  }
  const blob = (canvas, type, quality) =>
    new Promise((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(Error('Image encoding failed'))), type, quality)
    );
  async function optimise(file, preset = 'standard') {
    const spec = profiles[preset];
    if (!spec && preset !== 'original') throw Error('Unknown artwork preset');
    const image = await decode(file);
    try {
      const original = { width: image.width, height: image.height, bytes: file.size };
      // Re-encoding through a canvas keeps only the first frame, so an animated GIF is never
      // touched. A one-frame GIF is just a still image and takes the normal route below.
      const frames = await frameCount(file);
      if (frames > 1)
        return {
          file,
          original,
          ...original,
          animated: true,
          warnings: [gifNote, ...warnings(image.width, image.height, file.size)]
        };
      if (preset === 'original')
        return {
          file,
          original,
          ...original,
          warnings: warnings(image.width, image.height, file.size)
        };
      const size = dimensions(image.width, image.height, spec.edge),
        canvas = document.createElement('canvas');
      Object.assign(canvas, size);
      const ctx = canvas.getContext('2d');
      if (!ctx) throw Error('Image canvas is unavailable');
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(image, 0, 0, size.width, size.height);
      const data = ctx.getImageData(0, 0, size.width, size.height).data;
      let alpha = false;
      for (let i = 3; i < data.length; i += 4)
        if (data[i] < 255) {
          alpha = true;
          break;
        }
      let best = null;
      for (const q of [
        spec.quality,
        Math.max(0.35, spec.quality - 0.15),
        Math.max(0.25, spec.quality - 0.3)
      ]) {
        const candidates = [await blob(canvas, 'image/webp', q)];
        if (!alpha) candidates.push(await blob(canvas, 'image/jpeg', q));
        for (const candidate of candidates)
          if (!best || candidate.size < best.size) best = candidate;
        if (best.size <= spec.target) break;
      }
      if (image.width === size.width && image.height === size.height && file.size <= best.size)
        best = file;
      const result =
        best === file
          ? file
          : new File(
              [best],
              'player-cover.' +
                (best.type === 'image/webp' ? 'webp' : best.type === 'image/jpeg' ? 'jpg' : 'png'),
              { type: best.type }
            );
      const notes = warnings(size.width, size.height, result.size);
      if (result.size > spec.target)
        notes.push(
          'This image remains above the preset’s size target. Try a smaller preset and compare the preview.'
        );
      return { file: result, original, ...size, bytes: result.size, warnings: notes };
    } finally {
      image.close();
    }
  }
  const fromBase64 = (data, mime) => {
    const raw = atob(data),
      bytes = Uint8Array.from(raw, (c) => c.charCodeAt(0));
    return new File([bytes], 'player-cover', { type: mime || 'image/jpeg' });
  };
  window.XtrataMusicArtwork = {
    profiles,
    dimensions,
    warnings,
    countGifFrames,
    inspect,
    optimise,
    fromBase64
  };
})();
