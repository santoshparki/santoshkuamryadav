type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const MAX_ENTRIES = 10_000;

const globalRateLimit = globalThis as typeof globalThis & {
  contactRateLimit?: Map<string, RateLimitEntry>;
};

const entries = globalRateLimit.contactRateLimit ?? new Map<string, RateLimitEntry>();
globalRateLimit.contactRateLimit = entries;

export function checkContactRateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const normalizedKey = key.slice(0, 256);

  // Remove expired entries so abusive traffic cannot grow this in-memory store forever.
  if (entries.size >= MAX_ENTRIES) {
    for (const [entryKey, entry] of entries) {
      if (entry.resetAt <= now) entries.delete(entryKey);
    }
  }

  if (entries.size >= MAX_ENTRIES && !entries.has(normalizedKey)) {
    return { allowed: false, retryAfterSeconds: Math.ceil(windowMs / 1000) };
  }

  const current = entries.get(normalizedKey);

  if (!current || current.resetAt <= now) {
    entries.set(normalizedKey, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (current.count >= limit) {
    return { allowed: false, retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000) };
  }

  current.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
