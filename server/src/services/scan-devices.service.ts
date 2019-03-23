import * as createMdnsInterface from 'multicast-dns';
import { Op } from 'sequelize';
import { annotateDevice, dedupe } from '../utils';

import Device from '../models/device.model';

import { SCANNING_FREQUENCY } from './config.service';
import { publish, TOPICS } from './subscriptions.service';

import { ChromecastService } from '../types';
import { parseResponse } from './parse-mdns-query.service';

interface MDNSHandler {
  onResponse: (res: any) => void;
}

let scanInterval: NodeJS.Timeout | null = null;

const mdns = createMdnsInterface();
const handler: MDNSHandler = { onResponse: () => {} };
mdns.on('response', res => handler.onResponse(res));

export function startScanning(): void {
  if (scanInterval) clearInterval(scanInterval);
  scanDevices();
  scanInterval = setInterval(scanDevices, SCANNING_FREQUENCY);
}

export async function recordDevice(
  service: ChromecastService,
): Promise<Device | null> {
  const identifier = service.id;
  const model = service.model;

  const device = await Device.findOne({ where: { identifier } });

  // if we haven't seen this device before, insert it
  if (!device) {
    const newDevice = new Device({
      identifier,
      nickname: service.name,
      address: service.address,
      model,
      rotation: 0,
      status: 'online',
    });
    return newDevice.save();
  }

  // if we've seen this device before, update it
  return device.update({
    nickname: service.name,
    address: service.address,
    model,
    status: 'online',
  });
}

export function scanDevices(): Promise<void> {
  return new Promise(resolve => {
    const deviceUpdates: Promise<Device | null>[] = [];

    // update mDNS handler with this iteration's instance of deviceUpdates
    handler.onResponse = res => {
      const device = parseResponse(res);
      if (device) deviceUpdates.push(recordDevice(device));
    };

    mdns.query('._googlecast._tcp.local', 'ANY');

    // poll for 15 seconds
    setTimeout(async () => {
      const updatedDevices = dedupe(
        (await Promise.all(deviceUpdates)).filter(Boolean) as Device[],
        d => d.id,
      );

      // find all previously 'searching' devices that aren't accounted for...
      const absentDevices = await Device.findAll({
        where: {
          id: { [Op.notIn]: updatedDevices.map(d => d.id) },
          status: 'searching',
        },
      });

      // ...and mark them as 'offline'
      await Promise.all(
        absentDevices.map((device: Device) =>
          device.update({ status: 'offline' }),
        ),
      );

      // find all previously 'online' devices that aren't accounted for...
      const hidingDevices = await Device.findAll({
        where: {
          id: { [Op.notIn]: updatedDevices.map(d => d.id) },
          status: 'online',
        },
      });

      // ...and mark them as 'searching'
      await Promise.all(
        hidingDevices.map((device: Device) =>
          device.update({ status: 'searching' }),
        ),
      );

      // publish devices to any active subscribers
      const devices = await Device.findAll();
      publish(TOPICS.Devices, {
        devices: devices.map(annotateDevice),
      });
      resolve();
    }, 15 * 1000);
  });
}
