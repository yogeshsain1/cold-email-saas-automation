/**
 * Rate limiting middleware for API routes
 */

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// In-memory store (use Redis in production)
const store: RateLimitStore = {};

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  /**
   * Check if request should be rate limited
   */
  check(identifier: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
  } {
    const now = Date.now();
    const key = `rate_limit:${identifier}`;
    
    // Get or create rate limit entry
    let entry = store[key];
    
    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      entry = {
        count: 1,
        resetTime: now + this.config.windowMs,
      };
      store[key] = entry;
      
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: entry.resetTime,
      };
    }
    
    // Check if limit exceeded
    if (entry.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }
    
    // Increment count
    entry.count++;
    
    return {
      allowed: true,
      remaining: this.config.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  /**
   * Clean up expired entries (call periodically)
   */
  cleanup(): void {
    const now = Date.now();
    Object.keys(store).forEach(key => {
      if (store[key].resetTime < now) {
        delete store[key];
      }
    });
  }
}

// Pre-configured rate limiters
export const rateLimiters = {
  // Strict: 10 requests per minute
  strict: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 10 }),
  
  // Standard: 60 requests per minute
  standard: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 60 }),
  
  // Relaxed: 300 requests per minute
  relaxed: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 300 }),
  
  // Auth: 5 requests per minute (for login/register)
  auth: new RateLimiter({ windowMs: 60 * 1000, maxRequests: 5 }),
};

// Cleanup expired entries every 5 minutes
setInterval(() => {
  Object.values(rateLimiters).forEach(limiter => limiter.cleanup());
}, 5 * 60 * 1000);

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from headers (for proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback to user agent hash (not ideal but better than nothing)
  const userAgent = request.headers.get('user-agent') || 'unknown';
  return `ua_${Buffer.from(userAgent).toString('base64').slice(0, 32)}`;
}
