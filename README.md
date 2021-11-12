# zigbee2mqtt-adapter-proxy

This service let's you communicate the zigbee2mqtt service to a system like a RaspberryPi,
with using an adapter that doesn't work (anymore) with ser2net.

## Installation

This will install the application to your system (like a RaspberryPi).

### Prepare
Prepare directory for content
```shell
export WORKDIR=/opt/zigbee2mqtt-adapter-proxy
sudo mkdir $WORKDIR
sudo chown pi:pi $WORKDIR
```

Now clone the repository to the application directory
```shell
git clone https://github.com/tim-brand/zigbee2mqtt-adapter-proxy.git $WORKDIR
```

Now install the required dependencies
```shell
npm install
```

### Configure

Create a file, named `config.yaml`, for the configuration. And change it to match your
configuration.

```shell
cp $WORKDIR/config-example.yaml $WORKDIR/config.yaml
```

### Start

You can start the service using the following command
If you would like to run the application as a service, check the next section
"## Install systemd service".
```shell
cd $WORKDIR
npm start
```


## Install systemd service

Often you want to make sure that the service is running without the need to being
logged into the terminal. Otherwise, if your terminal will exit or the service will crash
at some point, it won't be running anymore and your coordinator is not available.

I already included a service in the repo. You can simply link to it.

```shell
sudo ln -s $WORKDIR/zigbee2mqtt-adapter-proxy.service /lib/systemd/system/zigbee2mqtt-adapter-proxy.service
sudo systemctl daemon-reload
sudo systemctl enable zigbee2mqtt-adapter-proxy.service
sudo systemctl start zigbee2mqtt-adapter-proxy.service
```

If you want to check if the service started correcty, you can check the logs by using the
following command
```shell
journalctl -fu zigbee2mqtt-adapter-proxy
```
