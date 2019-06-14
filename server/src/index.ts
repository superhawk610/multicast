import * as path from 'path';
import { fork } from 'child_process';

import { loadConfig } from './services/config.service';
import { moveDatabase } from './services/move-database.service';

const launchConfig = loadConfig();
const serverModule = path.join(__dirname, 'server');

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
        console.info('server config update detected, restarting...');
        server.kill('SIGINT');

        // update database location
        moveDatabase(previousConfig, updatedConfig);

        // restart server with updated configuration
        startServer(updatedConfig);

        break;
      }
      case 'FATAL': {
        console.error('server process encountered fatal error');
        console.error(msg.error);

        if (restartAttempts > 5) {
          console.error('out of restart attempts, exiting...');
          process.exit(1);
        }

        console.error(`restarting (attempt ${restartAttempts})`);
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
        console.info(`parent process received message: ${__type}`);
        console.info(msg);
    }
  });
}

try {
  startServer();
} catch (err) {
  try {
    console.error('Failed to start server.');
    console.error(
      `Make sure ${launchConfig.MULTICAST_HOME} exists and is writable by this process.`,
    );
    console.error();
    console.error(err);
    useFallback = true;
    startServer();
  } catch (fallbackErr) {
    console.error('Failed to start fallback server.');
    console.error();
    console.error(fallbackErr);
    process.exit(1);
  }
}

process.on('exit', () => {
  if (server && !server.killed) server.kill('SIGINT');
});
