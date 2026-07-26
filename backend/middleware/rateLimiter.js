const buckets = {};

const  rateLimiter = (maxTokens , refillRate) => {
    return(req , res , next) => {
        const userId = req.user.userId;
        if(!buckets[userId]) {
            buckets[userId] = {
            tokens : maxTokens,
            lastRefill : Date.now()
            };
        }
        const bucket = buckets[userId];
        const now = Date.now();
        const timePassed = (now - bucket.lastRefill) / 1000;
        const tokensToAdd = Math.floor(timePassed * refillRate);

        if (tokensToAdd > 0) {
      bucket.tokens = Math.min(maxTokens, bucket.tokens + tokensToAdd);
      bucket.lastRefill = now;
    }
      if (bucket.tokens > 0) {
      bucket.tokens -= 1;
      next();
    } else {
      res.status(429).json({ 
        message: 'Too many requests. Please try again later.' 
      });
    }
    };
};
module.exports = rateLimiter;