export interface RateLimitResult { allowed: boolean; remaining: number; resetAt: number; }

interface Bucket { count: number; resetAt: number; }

export class InMemoryRateLimiter {
  private readonly buckets = new Map<string, Bucket>();

  constructor(private readonly limit = 30, private readonly windowMs = 60_000) {}

  consume(key: string): RateLimitResult {
    const now = Date.now();
    const current = this.buckets.get(key);
    const bucket = !current || current.resetAt <= now
      ? { count: 0, resetAt: now + this.windowMs }
      : current;

    bucket.count += 1;
    this.buckets.set(key, bucket);

    return {
      allowed: bucket.count <= this.limit,
      remaining: Math.max(0, this.limit - bucket.count),
      resetAt: bucket.resetAt,
    };
  }
}

export const intelligenceRateLimiter = new InMemoryRateLimiter(20, 60_000);
