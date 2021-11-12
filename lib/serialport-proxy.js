const SerialPort = require('serialport')
const net = require('net')
const sleep = require('./sleep')
const log = require('./log')('serialportproxy')

module.exports = class SerialportProxy {

  constructor({
    path,
    baudrate = 115200,
    socketPort = 20108,
    socketAddress = '0.0.0.0',
  }) {
    this.config = {
      path,
      baudrate,
      socketPort,
      socketAddress,
    }
  }

  async start() {
    log.info('Opening serial port')
    await this.initSerial()
    log.info('Starting socket server')
    await this.initSocket()
  }

  async stop() {
    if (this.serialPort.isOpen) {
      log.info('Closing serial port ...')
      this.serialPort.close()
      this.serialPort.destroy()
    }

    if (this.socketServer) {
      if (this.socket) {
        log.info('Closing socket ...')
        this.socket.end()
        this.socket.destroy()
        log.info('Closing socket finished')
      }
      log.info('Closing socketServer ...')
      this.socketServer.close()
      log.info('Closing socketServer finished')
    }
  }

  async initSerial() {
    const serialPortOptions = {
      baudRate: this.config.baudrate,
      autoOpen: false,
    }

    log.info(`Initiating serial port with path: ${this.config.path}, options:`, serialPortOptions)
    this.serialPort = new SerialPort(this.config.path, serialPortOptions)

    this.serialPort.on('data', async data => {
      log.data(`SerialPort data received: ${data}`)
      await this.sendDataToSocket(data)
    })

    return new Promise((resolve, reject) => {
      log.debug('Opening port')
      this.serialPort.open(async err => {
        if (err) {
          reject(new Error(`Failed to open SerialPort, check your settings. Reason: ${err.message}`))
          if (this.serialPort.isOpen) {
            this.serialPort.close()
          }
        }
        log.info('SerialPort opened')

        await this.skipBootloader()
        resolve()
      })
    })
  }

  async initSocket() {
    this.socketServer = net.createServer(this.socketConnectionHandler.bind(this))
    this.socketServer.listen(this.config.socketPort, this.config.socketAddress)
    log.info(`Port ${this.config.path} listening for connections on ${this.config.socketAddress}:${this.config.socketPort}`)
  }

  async setSerialPortOptions(options) {
    return new Promise((resolve, reject) => {
      this.serialPort.set(options, err => {
        if (err) {
          reject(err.message)
        } else {
          resolve()
        }
      })
    })
  }

  async skipBootloader() {
    log.info('Skipping bootloader for CC1352P/CC2652P/CC2652R/CC2652RB ...')
    await this.setSerialPortOptions({dtr: false, rts: false})
    await sleep(150)
    await this.setSerialPortOptions({dtr: false, rts: true})
    await sleep(150)
    await this.setSerialPortOptions({dtr: false, rts: false})
    await sleep(150)
  }

  socketConnectionHandler(socket) {
    log.debug('Client connected')
    if (this.socket) {
      try {
        log.debug('New socket connection, closing existing connection.')
        this.socket.end()
        this.socket.destroy()
      } catch {}
    }
    this.socket = socket

    this.socket.on('data', this.onSocketData.bind(this))
    this.socket.on('end', () => {
      log.debug('Client disconnected (socket end)')
      this.socket = undefined
    })
    this.socket.on('close', (hadError) => {
      if (hadError) {
        log.error('Some error occured when client disconnected.')
      }
      log.debug('Client disconnected (socket close)')
      this.socket = undefined
    })
  }

  onSocketData = (data) => {
    log.data(`Data received from client: ${data}`)
    this.serialPort.write(data, (err, bytesWritten) => {
      if (err) {
        // Failed to write to serialport
        log.error('Failed to write to serialport.', err)
        return
      }
      log.debug(`Data from client written to serialport. bytesWritten: ${bytesWritten}`)
    })
  }


  async sendDataToSocket(data) {
    if (this.socket) {
      this.socket.write(data)
      log.debug('Serial data written to the client socket')
    }
  }
}
