import * as path from 'path';
import { fork } from 'child_process';

import { getLogger } from './logger';

import { loadConfig } from './services/config.service';
import { moveDatabase } from './services/move-database.service';

const launchConfig = loadConfig();
const { MULTICAST_HOME } = launchConfig;
const serverModule = path.join(__dirname, 'server');

const logger = getLogger();

let server;
let useFallback = false;
let restartAttempts = 0;
let restartAttemptResetTimeout: NodeJS.Timeout | null = null;

function startServer(config = launchConfig) {
  if (server && !server.killed) server.kill('SIGINT');
  server = fork(serverModule, [], { stdio: 'inherit' });
  server.send({ __type: 'CONNECT', config, fallback: useFallback });
  server.on('message', async ({ __type, ...msg }) => {
    switch (__type) {
      case 'UPDATE_CONFIG': {
        const { changes, previousConfig, updatedConfig } = msg;

        if (!server || Object.keys(changes).length === 0) break;

        // stop server
        logger.info('server config update detected, restarting...');
        server.kill('SIGINT');

        // update database location
        moveDatabase(previousConfig, updatedConfig);

        // restart server with updated configuration
        startServer(updatedConfig);

        break;
      }
      case 'FATAL': {
        logger.error('server process encountered fatal error');
        logger.error(msg.error);

        if (restartAttempts > 5) {
          logger.error('out of restart attempts, exiting...');
          process.exit(1);
        }

        logger.error(`restarting (attempt ${restartAttempts})`);
        if (restartAttemptResetTimeout) clearTimeout(restartAttemptResetTimeout);
        restartAttemptResetTimeout = setTimeout(() => (restartAttempts = 0), 5000);
        startServer(config);
        restartAttempts++;

        break;
      }
      // ignore parcel messages
      case undefined:
        break;
      default:
        logger.info(`parent process received message: ${__type}`);
        logger.info(msg);
    }
  });
}

try {
  startServer();
} catch (err) {
  try {
    logger.error('Failed to start server.');
    logger.error(`Make sure ${MULTICAST_HOME} exists and is writable by this process.`);
    logger.error(err);
    useFallback = true;
    startServer();
  } catch (fallbackErr) {
    logger.error('Failed to start fallback server.');
    logger.error(fallbackErr);
    process.exit(1);
  }
}

process.on('exit', () => {
  if (server && !server.killed) server.kill('SIGINT');
});
