const { createLogger, format, transports } = require('winston');
const path = require('path');

const { combine, timestamp, printf, colorize, errors, splat, metadata } = format;

const env = process.env.NODE_ENV || 'development';
const logLevel = process.env.LOG_LEVEL || (env === 'production' ? 'info' : 'debug');

const logFormat = printf(({ level, message, timestamp, stack, metadata: meta }) => {
  const base = `${timestamp} [${level}] : ${stack || message}`;
  const metaStr = meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  return base + metaStr;
});

const logger = createLogger({
  level: logLevel,
  format: combine(
    errors({ stack: true }), // capture stack trace
    splat(),
  metadata({ fillExcept: ['message', 'level', 'timestamp', 'stack'] }),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: combine(splat(), colorize(), timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
    }),
  ],
  exitOnError: false,
});

// Optional file logging in production
if (env === 'production') {
  const logDir = path.resolve(__dirname, '..', 'logs');
  logger.add(
    new transports.File({ filename: path.join(logDir, 'error.log'), level: 'error' })
  );
  logger.add(
    new transports.File({ filename: path.join(logDir, 'combined.log') })
  );
}

module.exports = logger;
