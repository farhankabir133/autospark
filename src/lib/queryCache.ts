// P-05: Simple in-memory query cache to avoid refetch on nav (lightweight alternative to react-query)
type CacheEntry<T> = { data: T; expiry: number };
const cache = new Map<string, CacheEntry<any>>();
export async function cachedFetch<T>(key: string, fetcher: () => Promise<T>, ttlMs = 5 * 60 * 1000): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() < hit.expiry) return hit.data as T;
  const data = await fetcher();
  cache.set(key, { data, expiry: Date.now() + ttlMs });
  return data;
}
export function invalidateCache(key?: string) {
  if (key) cache.delete(key); else cache.clear();
}
