const base = import.meta.env.BASE_URL;

/** Resolve a public asset path against the deployed base path. */
export function asset(path: string): string {
  return `${base}${path.replace(/^\/+/, '')}`;
}
