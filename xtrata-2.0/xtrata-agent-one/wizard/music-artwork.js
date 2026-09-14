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
  async function decode(file) {
    if (!/^image\/(png|jpeg|webp)$/.test(file.type))
      throw Error('Choose a still PNG, JPEG or WebP image.');
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
      return {
        width: image.width,
        height: image.height,
        bytes: file.size,
        warnings: warnings(image.width, image.height, file.size)
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
  window.XtrataMusicArtwork = { profiles, dimensions, warnings, inspect, optimise, fromBase64 };
})();
