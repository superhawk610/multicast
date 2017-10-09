const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '..', '..', '.config');

try {
  module.exports = JSON.parse(fs.readFileSync(configPath));
} catch (e) {
  console.log(`No config file found in ${configPath}
Please run
  npm run config
before attempting to launch Multicast`);
  process.exit();
}