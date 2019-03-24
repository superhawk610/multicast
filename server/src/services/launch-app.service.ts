import * as castv2 from 'castv2';

import { APP_ID } from './config.service';

interface ConnectionMap {
  [host: string]: DeviceConnection;
}

interface DeviceConnection {
  client: any;
  missedHeartbeats: number;
  connection: any;
  heartbeat: any;
  receiver: any;
  pulse: NodeJS.Timeout;
}

const devices: ConnectionMap = {};

export function launchApp(host: string): void {
  let fresh = false;
  if (!Object.prototype.hasOwnProperty.call(devices, host)) {
    fresh = true;
    const client = new castv2.Client();
    client.on('error', (...args) => {
      console.log('client errored', ...args);
    });
    devices[host] = { client } as DeviceConnection;
  }

  const device = devices[host];

  device.client.connect(host, () => {
    if (fresh) {
      // create required channels
      device.connection = createChannel(device.client, 'tp.connection');
      device.heartbeat = createChannel(device.client, 'tp.heartbeat');
      device.receiver = createChannel(device.client, 'receiver');

      // establish connection to device
      device.connection.send({ type: 'CONNECT' });

      // start heartbeating
      device.missedHeartbeats = 0;
      device.pulse = setInterval(() => {
        device.missedHeartbeats++;
        if (device.missedHeartbeats > 6) {
          // receiver has been offline for more than 30 seconds
          // TODO: mark device as offline
          clearInterval(device.pulse); // stop checking for pulse :(
          // TODO: notify UI that device has gone offline
        } else {
          device.heartbeat.send({ type: 'PING' });
        }
      }, 5000);
      device.heartbeat.on('message', data => {
        if (data.type === 'PONG') device.missedHeartbeats = 0;
      });

      // monitor receiver status
      device.receiver.on('message', data => {
        console.log('receiver got', data);
      });
    }

    // launch landing page on device
    device.receiver.send({ type: 'LAUNCH', appId: APP_ID, requestId: 1 });
  });
}

function createChannel(client: any, namespace: string): any {
  return client.createChannel(
    'sender-0',
    'receiver-0',
    `urn:x-cast:com.google.cast.${namespace}`,
    'JSON',
  );
}
