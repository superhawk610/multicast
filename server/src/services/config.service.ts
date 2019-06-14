const fs = require('fs');
const path = require('path');

const DEFAULT_API_KEY = '46f2c224704811909ffdf0735741b0b8';
const configPath = path.join(__dirname, '..', '..', 'config.json');
const defaultConfig = {
  MULTICAST_HOME: '.multicast',
  PORT: 4000,
  SQL_LOGGING: false,
  SCANNING_FREQUENCY: 15 * 1000,
  API_KEY: DEFAULT_API_KEY,
  DISABLE_PLAYGROUND: false,
  PLAYGROUND_URL: '/playground',
  SANDBOX: false,
};

let diskConfig;
let config;
let isParent = true;

export function loadConfig() {
  try {
    const json = fs.readFileSync(configPath);
    diskConfig = JSON.parse(json);
  } catch (e) {
    console.error('could not load <rootDir>/config.json, exiting...');
    process.exit(1);
  }

  config = {
    ...defaultConfig,
    ...diskConfig,
  };

  // application ID (found in Google Cast SDK Developer Console)
  if (envHas('APP_ID')) {
    config.APP_ID = process.env.APP_ID;
  }

  // data directory used for storing SQLite db
  // paths starting with '/' will be treated as absolute (make sure you have sufficient permissions)
  // relative paths will be relative to your home directory (eg - '.multicast' => '~/.multicast')
  if (envHas('MULTICAST_HOME')) {
    config.MULTICAST_HOME = process.env.MULTICAST_HOME;
  }

  // port that GraphQL will listen on
  if (envHas('PORT')) {
    config.PORT = process.env.PORT;
  }

  // when enabled, all SQL operations will be logged to the console
  // (useful for debugging)
  if (envHas('SQL_LOGGING')) {
    config.SQL_LOGGING = loadProcessEnvBoolean('SQL_LOGGING');
  }

  // time (ms) to wait between mdns scans
  if (envHas('SCANNING_FREQUENCY')) {
    config.SCANNING_FREQUENCY = parseInt(process.env.SCANNING_FREQUENCY as string, 10);
  }

  // key to prevent random access to GraphQL endpoint
  if (envHas('API_KEY')) {
    config.API_KEY = process.env.API_KEY;
  }

  // disable GraphQL playground (generally a good idea in production environments)
  if (envHas('DISABLE_PLAYGROUND')) {
    config.DISABLE_PLAYGROUND = loadProcessEnvBoolean('DISABLE_PLAYGROUND');
  }

  // URL for GraphQL playground (default: '/playground')
  // cannot be '/' as the root is used for serving the client application
  if (envHas('PLAYGROUND_URL')) {
    config.PLAYGROUND_URL = process.env.PLAYGROUND_URL;
  }

  // when enabled, use a separate DB file for storage with fake seed data
  // writes will not be persisted between server restarts
  if (envHas('SANDBOX')) {
    config.SANDBOX = loadProcessEnvBoolean('SANDBOX');
  }

  if (!config.API_KEY || config.API_KEY.length < 16) {
    console.error('API_KEY must be set to a random string with 16+ characters');
    process.exit(1);
  }

  if (config.API_KEY === DEFAULT_API_KEY) {
    console.warn('you are using the default API_KEY; this is a potential security vulnerability');
    console.warn('please generate a new API_KEY to use in production');
  }

  if (
    config.PLAYGROUND_URL === '/' ||
    config.PLAYGROUND_URL === '' ||
    config.PLAYGROUND_URL === '*'
  ) {
    console.error('PLAYGROUND_URL must be a non-root, non-wildcard path');
    console.error('current value', config.PLAYGROUND_URL);
    process.exit(1);
  }

  return config;
}

export function getConfig() {
  if (!config) {
    console.error('attempted to access config before it was loaded');
    process.exit(1);
  }

  return config;
}

export async function updateConfig(changes) {
  if (!changes.API_KEY) delete changes.API_KEY;

  const updatedConfig = {
    ...defaultConfig,
    ...diskConfig,
    ...changes,
  };

  if (!isParent) {
    if (!process.send) {
      console.error('attempted to update config as child from a parent process');
      process.exit(1);
    }

    return process.send!({
      __type: 'UPDATE_CONFIG',
      changes,
      previousConfig: config,
      updatedConfig,
    });
  }

  config = updatedConfig;
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

  return config;
}

// NOTE: this setter bypasses the change listener and should only be
// used by the child process to cache the config object from the parent
export function setConfig(newConfig) {
  isParent = false;
  config = newConfig;
}

function envHas(key) {
  return Object.prototype.hasOwnProperty.call(process.env, key);
}

function loadProcessEnvBoolean(key) {
  const lc = (process.env[key] as string).toLowerCase();
  if (lc === '0' || lc === 'false' || lc === 'disable' || lc === 'off') {
    return false;
  }
  return true;
}
