const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const emailRoutes = require('./routes/email');
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
      ? process.env.ALLOWED_ORIGINS.split(',')
      : '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// Basic request logging middleware (excludes /health endpoint)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    // Skip logging for health check endpoint to reduce log noise
    if (req.originalUrl === '/health') {
      return;
    }
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
});

const isProduction = process.env.NODE_ENV === 'production';
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: isProduction ? 5 : 10, // 5 requests per hour in prod, 10 in dev
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.path === '/health' || req.path === '/', // Skip rate limiting for health check and root
  keyGenerator: (req) => {
    // Use forwarded IP if behind proxy, otherwise use connection IP
    return req.ip || req.connection.remoteAddress || 'unknown';
  }
});

// Apply rate limiting
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Routes
app.use('/api', emailRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Email Sender API',
    version: '1.0.0',
    endpoints: {
      'POST /api/send-email': 'Send an email',
      'GET /health': 'Health check'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error: %o', err);
  // include stack in development responses
  res.status(500).json({
    error: 'Something went wrong!',
    message:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  logger.info(`🚀 Email Sender API is running on port ${PORT}`);
  logger.info('Environment: %s', isProduction ? 'production' : 'development');
  logger.info('From Email: %s', process.env.FROM_EMAIL || 'not set');
  logger.info('Ready to send emails via Resend');
  logger.info('Access in port: %d', PORT);
});

module.exports = app;
