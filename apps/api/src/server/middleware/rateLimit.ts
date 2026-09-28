import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory IP tracking cache with automatic expiry
const ipStore = new Map<string, RateLimitRecord>();

// Clean up stale IPs periodically every 5 minutes
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipStore.entries()) {
    if (record.resetAt <= now) {
      ipStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);
cleanupTimer.unref();

/**
 * Basic rate protection middleware for public visitor submissions (e.g. tributes)
 * Prevents spam/flooding by limiting requests per IP window.
 */
export function rateLimitTributes(options: { maxRequests: number; windowMs: number }) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Determine client IP
    const clientIp =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
      req.socket.remoteAddress ||
      'unknown-ip';

    const now = Date.now();
    let record = ipStore.get(clientIp);

    if (!record || record.resetAt <= now) {
      record = {
        count: 1,
        resetAt: now + options.windowMs,
      };
      ipStore.set(clientIp, record);
      return next();
    }

    if (record.count >= options.maxRequests) {
      const waitSeconds = Math.ceil((record.resetAt - now) / 1000);
      return res.status(429).json({
        success: false,
        error: `Too many tribute submissions. In order to preserve the sanctuary's peace, please wait ${waitSeconds} seconds before posting again.`,
      });
    }

    record.count += 1;
    return next();
  };
}
