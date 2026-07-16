/**
 * server/app.js
 * 
 * This is the main server file for the SUSTAIN web application.
 * It sets up the Express server, configures middleware, and defines routes.
 * The server listens for incoming requests on a specified port.
 * 
 * Author: SUSTAIN Development Team
 * Last Modified: Jan 2026
 */

const express = require('express');
const cors = require('cors');
const sustainRoutes = require('./routes/sustain');

const app = express();
const PORT = process.env.PORT || 8080;

// Trust the first proxy hop (Azure's load balancer) so req.ip reflects the
// real client address for rate limiting rather than the proxy's address.
app.set('trust proxy', 1);

// Configure CORS to allow requests from frontend
const corsOptions = { 
  origin: ['https://sustainai.ca', 'http://localhost:3000'], // localhost for development
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  /**
   * Middleware to set security headers for all responses.
   * 
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Simple in-memory fixed-window rate limiter. The /api/sustain route calls the
// paid OpenAI API on every request with no auth, so throttling per client IP
// keeps an anonymous caller from driving unbounded API spend / quota
// exhaustion. In-memory state matches the rest of the server (single instance);
// back it with a shared store if the app is ever scaled horizontally.
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS) || 60_000;
const RATE_LIMIT_MAX = Number(process.env.RATE_LIMIT_MAX) || 30;
const rateLimitHits = new Map();

// Periodically drop expired entries so the tracking map cannot grow unbounded.
// Unref'd so it never keeps the process alive on its own (e.g. during tests).
const rateLimitSweep = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitHits) {
    if (now > entry.resetAt) {
      rateLimitHits.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW_MS);
if (typeof rateLimitSweep.unref === 'function') {
  rateLimitSweep.unref();
}

const rateLimiter = (req, res, next) => {
  /**
   * Fixed-window per-IP rate limiter for the OpenAI-backed route.
   * 
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  const now = Date.now();
  const key = req.ip || 'unknown';
  const entry = rateLimitHits.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitHits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({ error: "Too many requests, please slow down", percentageSaved: 0 });
  }

  entry.count += 1;
  next();
};

app.use('/api/sustain', rateLimiter, sustainRoutes);

app.use((err, req, res, next) => {
  /**
   * Error-handling middleware that returns JSON instead of an HTML stack
   * trace for malformed or oversized request bodies.
   * 
   * @param {Error} err - Error thrown by upstream middleware (e.g. body parser).
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @param {Function} next - Next middleware function.
   */
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ error: "Request body too large" });
  }
  next(err);
});

app.listen(PORT, () => {
  /**
   * Starts the Express server and listens on the specified port.
   * 
   * @param {number} PORT - The port number to listen on.
   */
  console.log(`Server is running on port ${PORT}`);
});
