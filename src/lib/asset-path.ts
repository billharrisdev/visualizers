export function getAssetPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!base) return path;
  // Avoid double-prefix and ensure single slash
  if (path.startsWith(base + "/")) return path;
  if (path.startsWith("/")) return `${base}${path}`;
  return `${base}/${path}`;
}
