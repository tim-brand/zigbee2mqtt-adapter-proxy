const yaml = require('js-yaml')
const { readFile } = require('fs').promises

const debug = require('debug')('zigbee2mqtt-adapter-proxy:config')

module.exports = class Config {

  /**
   *
   * @param {string} filePath
   * @returns {Config} The parsed config
   */
  static async loadFromFile(filePath) {
    debug(`Loading file-content from path: "${filePath}" ...`)
    const fileContent = await readFile(filePath)
    if (!fileContent) {
      // No filecontent loaded
      throw new Error(`Failed to load config file content of path: ${filePath}`)
    }
    debug(`File-content loaded from path: ${filePath}`)

    debug(`Parsing file-content to yaml ...`)
    const config = yaml.safeLoad(fileContent)
    debug(`File-content parsed to yaml.`)

    return config
  }
}
