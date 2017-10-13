#!/usr/bin/env node
if (process.argv.length == 2) {                                             // run with no arguments, display help
  console.log('Multicast is a persistent solution to presenting content across multiple Chromecast devices.')
  console.log('')
  console.log('USAGE: multicast <command> (--flags)')
  console.log('')
  console.log('Commands:')
  console.log('                config   run this first to set up Multicast')
  console.log('                 start   start Multicast as a foreground process')
  console.log('')
  console.log('Flags:')
  console.log('          --serve-only   do not run the mDNS server (won\'t interrupt existing receivers)')
} else {
  if (process.argv.find(arg => arg == 'config')) require('./app/config.js') // run configuration
  else require('./app/main.js')                                             // start application
}