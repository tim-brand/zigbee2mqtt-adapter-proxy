# zigbee2mqtt-adapter-proxy

A proxy service to communicate with the coordinator over socket

## getting the code

Example for Raspberry Pi, adapt for your user.

```bash
# Create dir in /opt
sudo mkdir /opt/zigbee2mqtt-adapter-proxy
sudo chmod pi:pi /opt/zigbee2mqtt-adapter-proxy
# Clone to /opt
git clone https://github.com/tim-brand/zigbee2mqtt-adapter-proxy.git /opt/zigbee2mqtt-adapter-proxy
```

## configure

Create the `config.yaml` matching to your needs, see the example below as reference.

```bash
cat /opt/zigbee2mqtt-adapter-proxy/config.yaml
ports:
  - path: /dev/ttyUSB0
    baudrate: 115200
    socketPort: 20108
    socketAddress: "::"
    rtscts: false
    skipBootloader: true
```

## prepare and run

Install and run the proxy

```bash
cd /opt/zigbee2mqtt-adapter-proxy/
npm install .
node index.js config.yaml
```
