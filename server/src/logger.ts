import { join } from 'path';
import { createLogger, format, transports } from 'winston';
import { format as dateFormat, parseISO } from 'date-fns';
import chalk from 'chalk';

import { getDataDirectory } from './services/get-data-directory.service';

let logger;

export function getLogger() {
  if (logger) return logger;

  const dataDirectory = getDataDirectory();
  const { combine, timestamp, label, printf } = format;

  const logFormat = printf(({ level, message, timestamp }) => {
    return `[${colorize(level)}] ${chalk.bold.gray(
      dateFormat(parseISO(timestamp), 'HH:mm:ss'),
    )} ${message}`;
  });

  logger = createLogger({
    level: 'info',
    format: format.json(),
    transports: [
      new transports.File({ filename: join(dataDirectory, 'error.log'), level: 'error' }),
      new transports.File({ filename: join(dataDirectory, 'combined.log') }),
    ],
  });

  if (process.env.NODE_ENV !== 'production') {
    logger.add(
      new transports.Console({
        format: combine(timestamp(), logFormat),
      }),
    );
  }

  return logger;
}

function colorize(level) {
  switch (level) {
    case 'info':
      return chalk.cyan('INFO');
    case 'warn':
      return chalk.yellow('WARN');
    case 'error':
      return chalk.red('ERR');
    default:
      return chalk.bold(level.toUpperCase());
  }
}
