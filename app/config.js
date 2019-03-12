'use strict';

const path        = require('path')
const fs          = require('fs')
const readline    = require('readline')
const rl          = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const configFile = path.resolve(__dirname, '..', '.config')

var ask = prompt => {
  return new Promise(resolve => {
    rl.question(prompt + ' ', res => resolve(res))
  })
}

var demand = (prompt, validate) => {
  return new Promise(resolve => {
    rl.question(prompt + ' ', res => {
      if (res != '') {
        if (!validate) resolve(res)
        else {
          if (validate.test(res)) resolve(res)
          else demand(prompt, validate).then(res => resolve(res))
        }
      } else demand(prompt, validate).then(res => resolve(res))
    })
  })
}

var saveOpts = (opts, callback) => {
  fs.writeFile(configFile, JSON.stringify(opts, null, 2), callback)
}

var startConfig = () => {
  var opts = {}

  ask('Mongo host? (localhost)').then(res => {
    opts.mongoHost = res || 'localhost'
  }).then(() => ask('Mongo port? (27017)')).then(res => {
    opts.mongoPort = res || 27017
  }).then(() => ask('Mongo username? (none)')).then(res => {
    opts.mongoUser = res || ''
  }).then(() => ask('Mongo password? (none)')).then(res => {
    opts.mongoPass = res || ''
  }).then(() => ask('Mongo auth DB? (admin)')).then(res => {
    opts.mongoAuthSource = res || 'admin'
  }).then(() => {
    console.log('')
    console.log('Now we\'ll configure Chromecast integration.')
  }).then(() => demand('Application ID?')).then(res => {
    opts.appId = res
  }).then(() => {
    console.log('')
    console.log('Does this look right?')
    console.log('')
    console.log(opts)
    console.log('')
  }).then(() => demand('(y/N)', /[yn]/i)).then(res => {
    if(/y/i.test(res)) {
      saveOpts(opts, () => {
        console.log('')
        console.log('Configuration updated! To get started, just run\n' +
          '\n' +
          '  multicast start' +
          '\n')
      })
      rl.close()
    } else {
      console.log('')
      console.log('Alright, let\'s start over.')
      console.log('')
      startConfig()
    }
  })
}

/* Let's get started! */

/* credit to ASCII art goes to patorjk.com/software/taag/ */
console.log('')
console.log('                            W E L C O M E    T O')
console.log(`
    ███╗   ███╗██╗   ██╗██╗  ████████╗██╗ ██████╗ █████╗ ███████╗████████╗
    ████╗ ████║██║   ██║██║  ╚══██╔══╝██║██╔════╝██╔══██╗██╔════╝╚══██╔══╝
    ██╔████╔██║██║   ██║██║     ██║   ██║██║     ███████║███████╗   ██║   
    ██║╚██╔╝██║██║   ██║██║     ██║   ██║██║     ██╔══██║╚════██║   ██║   
    ██║ ╚═╝ ██║╚██████╔╝███████╗██║   ██║╚██████╗██║  ██║███████║   ██║   
    ╚═╝     ╚═╝ ╚═════╝ ╚══════╝╚═╝   ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝   ╚═╝   `)
console.log('')
console.log('We\'ll start off by configuring database options. Just press [ENTER] after each.')

startConfig()
