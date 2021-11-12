const debug = require('debug')

module.exports = (namespaceSuffix) => ({
  info: debug(`zigbee2mqtt-adapter-proxy:${namespaceSuffix}`),
  error: debug(`zigbee2mqtt-adapter-proxy:${namespaceSuffix}:error`),
  debug: debug(`zigbee2mqtt-adapter-proxy:${namespaceSuffix}:debug`),
  data: debug(`zigbee2mqtt-adapter-proxy:${namespaceSuffix}:data`),
})
