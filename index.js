'use strict'

const SerialportProxy = require('./lib/serialport-proxy')

let serialportProxy

const run = async () => {
  const configPath = process.argv[2]
  let config

  try {
    config = await Config.loadFromFile(configPath)
  } catch (err) {
    console.error('Error while loading the config file.', err.message)
    process.exit(1)
  }

  serialportProxy = new SerialportProxy(portConfig)
  await serialportProxy.start()
}

let handlingExit = false
const handleExit = (signal) => {
  if (handlingExit) return
  handlingExit = true
  console.log(`${signal} received`)
  for (const portProxy of portProxyList) {
    portProxy.stop()
  }
}

run().catch( err => {
  console.error('Exception during run()', err)
  handleExit('EXCEPTION')
})

process.on('SIGTERM', handleExit)
process.on('SIGINT', handleExit)
process.on('SIGQUIT', handleExit)
