// rate-limiter.ts
export class RateLimiter {
    private readonly timestamps: number[] = [];
    private readonly maxRequests: number;
    private readonly timeWindowMs: number;
  
    constructor(maxRequests: number, timeWindowSeconds: number) {
      this.maxRequests = maxRequests;
      this.timeWindowMs = timeWindowSeconds * 1000;
    }
  
    async waitForSlot(): Promise<void> {
      const now = Date.now();
      
      // Remove timestamps that are outside the time window
      while (
        this.timestamps.length > 0 &&
        now - this.timestamps[0] > this.timeWindowMs
      ) {
        this.timestamps.shift();
      }
      
      // If at rate limit, wait until a slot opens up
      if (this.timestamps.length >= this.maxRequests) {
        const oldestTimestamp = this.timestamps[0];
        const waitTimeMs = this.timeWindowMs - (now - oldestTimestamp);
        
        if (waitTimeMs > 0) {
          await new Promise(resolve => setTimeout(resolve, waitTimeMs));
        }
      }
      
      // Add current timestamp
      this.timestamps.push(Date.now());
    }
  }