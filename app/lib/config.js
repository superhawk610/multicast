'use strict'

const fs = require('fs')
const path = require('path')

const configPath = path.resolve(__dirname, '..', '..', '.config')
const configVariables = [
  'appId',
  'mongoUser',
  'mongoPass',
  'mongoAuthSource',
  'mongoHost',
  'mongoPort'
]

const port = 3944

try {
  // Attempts to pull entire config from environment variables. If any key is
  // not found, the configuration will instead be drawn from the .config file
  // which should be placed in the project root.
  var envUsed = true
  configVariables.forEach(envVar => {
    if (process.env[envVar] != undefined)
      module.exports[envVar] = process.env[envVar]
    else envUsed = false // If any are empty, the .config file will be used
  })

  // Skips if the full config is already in the environment variables
  if (!envUsed) {
    let opts = JSON.parse(fs.readFileSync(configPath))
    opts.port = port
    module.exports = opts
  }
} catch (e) {
  console.log(`No config file found in ${configPath}
Please run
  npm run config
before attempting to launch Multicast`)
  process.exit()
}
