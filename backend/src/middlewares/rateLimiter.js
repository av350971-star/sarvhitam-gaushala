// Lightweight in-memory rate limiter to protect against brute-force & spam
const requestCounts = new Map();

export const rateLimiter = ({
  windowMs = 15 * 60 * 1000, // 15 minutes
  max = 10, // max attempts
  message = "बहुत अधिक अनुरोध। कृपया कुछ समय बाद पुनः प्रयास करें।",
}) => {
  return (req, res, next) => {
    // Get client IP
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
      req.socket.remoteAddress ||
      "unknown-ip";

    const key = `${req.baseUrl || req.path}:${ip}`;
    const now = Date.now();

    const record = requestCounts.get(key);

    if (!record) {
      requestCounts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (now > record.resetTime) {
      requestCounts.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }

    record.count += 1;

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        message,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    next();
  };
};

// Specialized limiters
export const loginLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 8, // max 8 login attempts
  message: "सुरक्षा कारणों से अधिक लॉगिन प्रयासों के बाद आपका अनुरोध रोका गया है। कृपया 15 मिनट बाद प्रयास करें।",
});

export const formLimiter = rateLimiter({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 20, // max 20 submissions
  message: "बहुत अधिक फॉर्म सबमिशन। कृपया कुछ मिनट बाद पुनः प्रयास करें।",
});
