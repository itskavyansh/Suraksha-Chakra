/**
 * Downscale any image/video/canvas source so the longest side ≤ maxSide.
 * Returns the scaled canvas plus a JPEG thumbnail data URL (~240px wide).
 */
export function processSource(
  source: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement,
  maxSide = 640,
  thumbWidth = 240,
): { canvas: HTMLCanvasElement; thumb: string } {
  let sw: number;
  let sh: number;

  if (source instanceof HTMLVideoElement) {
    sw = source.videoWidth;
    sh = source.videoHeight;
  } else if (source instanceof HTMLCanvasElement) {
    sw = source.width;
    sh = source.height;
  } else {
    sw = source.naturalWidth;
    sh = source.naturalHeight;
  }

  const scale = Math.min(1, maxSide / Math.max(sw, sh, 1));
  const dw = Math.max(1, Math.round(sw * scale));
  const dh = Math.max(1, Math.round(sh * scale));

  const canvas = document.createElement('canvas');
  canvas.width = dw;
  canvas.height = dh;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  ctx.drawImage(source as CanvasImageSource, 0, 0, dw, dh);

  // Thumbnail
  const ts = Math.min(1, thumbWidth / dw);
  const tw = Math.max(1, Math.round(dw * ts));
  const th = Math.max(1, Math.round(dh * ts));
  const tc = document.createElement('canvas');
  tc.width = tw;
  tc.height = th;
  const tctx = tc.getContext('2d');
  if (!tctx) throw new Error('Canvas 2D context unavailable');
  tctx.drawImage(canvas, 0, 0, tw, th);
  const thumb = tc.toDataURL('image/jpeg', 0.75);

  return { canvas, thumb };
}

/** Load a File as an HTMLImageElement, revoking the object URL afterwards. */
export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image file'));
    };
    img.src = url;
  });
}

/** Load a public URL (e.g. /samples/needle.jpg) as an HTMLImageElement. */
export function loadImageFromUrl(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}
