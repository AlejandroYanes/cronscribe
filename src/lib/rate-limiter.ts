import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL as string,
  token: process.env.UPSTASH_REDIS_REST_TOKEN as string,
});

// Initialize Rate Limiter: 5 requests per 60 seconds (1 minute)
export const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "60s"),
  analytics: true,
  /**
   * Default @upstash/ratelimit configuration.
   *
   * -----
   *
   * All credits go to the create-t3-app team for this excellent example:
   * @see https://github.com/t3-oss/create-t3-app/blob/next/cli/template/extras/src/server/api/ratelimit.ts
   *
   * @public
   */
  /**
   * If enabled, the SDK will use the @upstash/edge-analytics package to
   * send analytics events to your Upstash Analytics workspace.
   *
   * @experimental
   */
  /**
   * Optional: The prefix to use for the keys in Redis.
   */
  prefix: "cron-gen",
});