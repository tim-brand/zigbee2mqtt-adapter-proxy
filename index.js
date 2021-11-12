'use strict'

const SerialportProxy = require('./lib/serialport-proxy')
const Config = require('./lib/config')

const log = require('./lib/log')('main')

let serialportProxy

const run = async () => {
  const configPath = process.argv[2]
  let config

  try {
    log.debug(`Start loading configuration from path: ${configPath}`)
    config = await Config.loadFromFile(configPath)
    log.debug('Config loaded: ', config)
  } catch (err) {
    console.error(`Error while loading the config file (${configPath})`, err.message)
    process.exit(1)
  }

  serialportProxy = new SerialportProxy(config.config)
  await serialportProxy.start()
}

let handlingExit = false
const handleExit = (signal) => {
  log.info(`handleExit called with signal:${signal}`)
  if (handlingExit) return
  handlingExit = true
  console.log(`${signal} received`)
  if (serialportProxy) {
    serialportProxy.stop()
  }
}

run().catch( err => {
  console.error('Exception during run()', err)
  handleExit('EXCEPTION')
})

process.on('SIGTERM', handleExit)
process.on('SIGINT', handleExit)
process.on('SIGQUIT', handleExit)
