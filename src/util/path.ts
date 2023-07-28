export function cleanPath(path: string): string {
  return path.replace(/\/(?:\s*\/)+/g, '/')
}
