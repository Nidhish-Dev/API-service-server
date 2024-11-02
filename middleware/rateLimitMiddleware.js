const rateLimit = require('express-rate-limit');

const apiRateLimiter = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, 
    max: 25, 
    message: "You have exceeded the 25 requests in 24 hours limit!",
});

module.exports = apiRateLimiter;
