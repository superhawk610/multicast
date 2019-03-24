import { startServer } from './server';

import { MULTICAST_HOME } from './services/config.service';

try {
  startServer();
} catch (err) {
  try {
    console.error('Failed to start server.');
    console.error(
      `Make sure ${MULTICAST_HOME} exists and is writable by this process.`,
    );
    console.error();
    console.error(err);
    startServer(true);
  } catch (_err) {
    console.error('Failed to start fallback server.');
    console.error();
    console.error(_err);
    process.exit(1);
  }
}
