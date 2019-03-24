require('dotenv').config();

// application ID (found in Google Cast SDK Developer Console)
export const APP_ID = process.env.APP_ID || '';

// data directory used for storing SQLite db
// paths starting with '/' will be treated as absolute (make sure you have sufficient permissions)
// relative paths will be relative to your home directory (eg - '.multicast' => '~/.multicast')
export const MULTICAST_HOME = process.env.MULTICAST_HOME || '.multicast';

// port that GraphQL will listen on
export const PORT = process.env.PORT || 4000;

// when enabled, all SQL operations will be logged to the console
// (useful for debugging)
export const SQL_LOGGING = Boolean(process.env.SQL_LOGGING);

// time (ms) to wait between mdns scans
export const SCANNING_FREQUENCY = process.env.SCANNING_FREQUENCY
  ? parseInt(process.env.SCANNING_FREQUENCY, 10)
  : 15 * 1000;

// key to prevent random access to GraphQL endpoint
export const API_KEY =
  process.env.API_KEY || '46f2c224704811909ffdf0735741b0b8';

// disable GraphQL playground (generally a good idea in production environments)
export const DISABLE_PLAYGROUND = Boolean(process.env.DISABLE_PLAYGROUND);

// URL for GraphQL playground (default: '/playground')
// cannot be '/' as the root is used for serving the client application
export const PLAYGROUND_URL = process.env.PLAYGROUND_URL || '/playground';

// when enabled, use a separate DB file for storage with fake seed data
// writes will not be persisted between server restarts
export const SANDBOX = Boolean(process.env.SANDBOX);

if (PLAYGROUND_URL === '/' || PLAYGROUND_URL === '' || PLAYGROUND_URL === '*') {
  console.error('PLAYGROUND_URL must be a non-root, non-wildcard path');
  console.error('current value', PLAYGROUND_URL);
  process.exit(1);
}
