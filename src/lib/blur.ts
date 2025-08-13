// Tiny blur placeholders per preview based on a deterministic gradient.
// For true LQIP, consider precomputing base64 images. This keeps it static-export friendly.
export function blurForPreview(src: string): string {
  // Derive two hues from the src to vary slightly between placeholders.
  let hash = 0;
  for (let i = 0; i < src.length; i++) hash = (hash * 131 + src.charCodeAt(i)) >>> 0;
  const h1 = hash % 360;
  const h2 = ((hash * 2654435761) >>> 0) % 360;
  const c1 = `hsl(${h1} 90% 96%)`;
  const c2 = `hsl(${h2} 95% 88%)`;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='14' viewBox='0 0 24 14'><defs><linearGradient id='g' x1='0' x2='0' y1='0' y2='1'><stop offset='0%' stop-color='${c1}'/><stop offset='100%' stop-color='${c2}'/></linearGradient></defs><rect width='24' height='14' fill='url(#g)'/></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
