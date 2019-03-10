// TODO: allow for this to be changed via env var or web UI

// data directory used for storing SQLite db
export const MULTICAST_HOME = '.multicast';

// port that GraphQL will listen on
export const PORT = 4000;

// time (ms) to wait between mdns scans
export const SCANNING_FREQUENCY = 30 * 1000;

// key to prevent random access to GraphQL endpoint
export const API_KEY = '46f2c224704811909ffdf0735741b0b8';

// disable GraphQL playground (generally a good idea in production environments)
export const DISABLE_PLAYGROUND = false;

// URL for GraphQL playground (default: '/')
export const PLAYGROUND_URL = '/';

// when enabled, use a separate DB file for storage with fake seed data
// writes will not be persisted between server restarts
export const SANDBOX = Boolean(process.env.SANDBOX);
