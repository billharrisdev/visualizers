export function getAssetPath(path: string): string {
  // Since basePath is conditionally applied in next.config.ts,
  // we can just return the path as-is
  return path;
}
