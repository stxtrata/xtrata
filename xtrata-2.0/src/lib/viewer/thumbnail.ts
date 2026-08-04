import { shouldUsePixelatedThumbnailRendering } from './image-rendering';

export const THUMBNAIL_SIZE = 256;
const THUMBNAIL_FORMAT = 'image/webp';
const FALLBACK_FORMAT = 'image/png';
const THUMBNAIL_QUALITY = 0.82;

type ImageSource = {
  source: CanvasImageSource;
  width: number;
  height: number;
  cleanup?: () => void;
};

/** Decode through an <img> element, which resolves an SVG's intrinsic size. */
const loadViaImageElement = async (blob: Blob): Promise<ImageSource> => {
  const url = URL.createObjectURL(blob);
  return new Promise<ImageSource>((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      resolve({
        source: img,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        cleanup: () => {
          URL.revokeObjectURL(url);
        }
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Thumbnail image decode failed'));
    };
    img.src = url;
  });
};

/**
 * Decode a blob to something canvas can draw.
 *
 * `createImageBitmap` is preferred — it decodes off the main thread — but it
 * **cannot decode SVG at all**. Chrome throws "The source image could not be
 * decoded." for every `image/svg+xml` blob, because a bitmap decode has no step
 * that resolves an SVG's intrinsic size the way an <img> element does.
 *
 * This used to reach the <img> path only when `createImageBitmap` was
 * *undefined*, never when it *threw* — so every SVG inscription failed to
 * produce a thumbnail, and a market page full of them logged one failure and
 * stack trace per card. The <img> fallback handles those blobs perfectly, so a
 * throw is a reason to fall through rather than to give up.
 */
const loadImageSource = async (blob: Blob): Promise<ImageSource> => {
  if (typeof createImageBitmap === 'function') {
    try {
      const bitmap = await createImageBitmap(blob);
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        cleanup: () => {
          bitmap.close?.();
        }
      };
    } catch {
      // Falls through: SVG always lands here, and a corrupt raster image will
      // fail again below and reject with the decode error, as before.
    }
  }

  return loadViaImageElement(blob);
};

export const createImageThumbnail = async (params: {
  bytes: Uint8Array;
  mimeType: string | null;
  size?: number;
  quality?: number;
}) => {
  const size = params.size ?? THUMBNAIL_SIZE;
  if (typeof document === 'undefined') {
    return null;
  }
  const safeBytes = new Uint8Array(params.bytes);
  const blob = new Blob([safeBytes], {
    type: params.mimeType ?? 'application/octet-stream'
  });

  let source: ImageSource | null = null;
  try {
    source = await loadImageSource(blob);
    const maxDimension = Math.max(source.width, source.height);
    if (!Number.isFinite(maxDimension) || maxDimension <= 0) {
      return null;
    }
    const scale = Math.min(1, size / maxDimension);
    const targetWidth = Math.max(1, Math.round(source.width * scale));
    const targetHeight = Math.max(1, Math.round(source.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    const usePixelatedRendering = shouldUsePixelatedThumbnailRendering({
      sourceWidth: source.width,
      sourceHeight: source.height,
      targetWidth,
      targetHeight,
      mimeType: params.mimeType
    });
    ctx.imageSmoothingEnabled = !usePixelatedRendering;
    if (!usePixelatedRendering) {
      ctx.imageSmoothingQuality = 'high';
    }
    ctx.clearRect(0, 0, size, size);
    const dx = Math.round((size - targetWidth) / 2);
    const dy = Math.round((size - targetHeight) / 2);
    ctx.drawImage(source.source, dx, dy, targetWidth, targetHeight);

    const thumbnailBlob = usePixelatedRendering
      ? await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, FALLBACK_FORMAT);
        })
      : (await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(
            resolve,
            THUMBNAIL_FORMAT,
            params.quality ?? THUMBNAIL_QUALITY
          );
        })) ||
        (await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, FALLBACK_FORMAT);
        }));
    if (!thumbnailBlob) {
      return null;
    }
    const arrayBuffer = await thumbnailBlob.arrayBuffer();
    const resolvedType = thumbnailBlob.type || FALLBACK_FORMAT;
    return {
      data: new Uint8Array(arrayBuffer),
      width: size,
      height: size,
      mimeType: resolvedType
    };
  } finally {
    source?.cleanup?.();
  }
};
