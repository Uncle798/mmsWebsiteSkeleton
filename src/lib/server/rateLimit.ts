import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const redis = new Redis({
   url: `https://${process.env.UPSTASH_ENDPOINT}`,
   token: process.env.UPSTASH_PASSWORD,
})

export const ratelimit = {
   register: new Ratelimit({
      redis,
      analytics: false,
      prefix: 'ratelimit:register',
      limiter: Ratelimit.slidingWindow(1, '15s')
   }),
   login: new Ratelimit({
      redis,
      analytics: false,
      prefix: 'ratelimit:login',
      limiter: Ratelimit.slidingWindow(1, '10s')
   })
}