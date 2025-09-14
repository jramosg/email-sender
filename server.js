const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const dotenv = require("dotenv");
const emailRoutes = require("./routes/email");
const logger = require('./utils/logger');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
// Log allowed origins and configure CORS
logger.info('allowed origins: %s', process.env.ALLOWED_ORIGINS || '*');
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS
      ? process.env.ALLOWED_ORIGINS.split(",")
      : "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Basic request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

// Rate limiting - stricter limits in production
const isProduction = process.env.NODE_ENV === "production";
const limiter = rateLimit({
  windowMs: isProduction ? 60 * 60 * 1000 : 15 * 60 * 1000, // 1 hour in prod, 15 minutes in dev
  max: isProduction ? 5 : 100, // 5 requests per hour in prod, 100 per 15min in dev
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});

// Additional stricter rate limiter for production (2 requests per minute)
const strictLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 2, // 2 requests per minute
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});

const developLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});

// Apply rate limiting
if (isProduction) {
  app.use(strictLimiter); // 2 requests per minute
  app.use(limiter); // 5 requests per hour (secondary check)
} else {
  app.use(developLimiter); // Development limits
}

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api", emailRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Email Sender API",
    version: "1.0.0",
    endpoints: {
      "POST /api/send-email": "Send an email",
      "GET /health": "Health check",
    },
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error: %o', err);
  // include stack in development responses
  res.status(500).json({
    error: "Something went wrong!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Email Sender API is running on port ${PORT}`);
  logger.info('Environment: %s', isProduction ? 'production' : 'development');
  logger.info('From Email: %s', process.env.FROM_EMAIL || 'not set');
  logger.info('Ready to send emails via Resend');
  logger.info('Access: http://localhost:%d', PORT);
});

module.exports = app;
