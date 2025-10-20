import path from 'path';
import { createLogger, format, transports } from 'winston';
import { config } from './config';
import { ensureDir } from './helpers/fs';
import { LOGS_PATH } from './helpers/paths';

declare module 'winston' {
  interface Logger {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    time: (key: string, message?: string, ...meta: any[]) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    timeEnd: (key: string, message?: string, ...meta: any[]) => void;
  }
}

const { combine, colorize, printf, errors, splat } = format;

const logFormat = printf(({ level, message, stack }) => {
  return `${level}: ${stack || message}`;
});

const appLog = path.join(LOGS_PATH, 'app.log');
const errorLog = path.join(LOGS_PATH, 'error.log');

await ensureDir(LOGS_PATH);

const level = config.server.debug ? 'debug' : 'info';

const logger = createLogger({
  level,
  format: combine(colorize(), splat(), errors({ stack: true }), logFormat),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: appLog,
      level
    }),
    new transports.File({
      filename: errorLog,
      level: 'error'
    })
  ]
});

const startTimes: Record<string, number> = {};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
logger.time = (key: string, message?: string, ...meta: any[]) => {
  startTimes[key] = performance.now();
  if (message) {
    logger.info(message, ...meta);
  }
};

logger.timeEnd = (key: string, message?: string, ...meta: unknown[]) => {
  const endTime = performance.now();
  const startTime = startTimes[key];

  if (!startTime) return;

  const duration = (endTime - startTime).toFixed(3);

  let newMsg = `[${key}] ${duration} ms`;

  if (message) {
    newMsg = `${message} (${duration} ms)`;
  }

  logger.info(newMsg, ...meta);

  delete startTimes[key];
};

export { logger };
