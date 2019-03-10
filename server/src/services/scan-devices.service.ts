import { createBrowser, Browser, tcp, dns_sd, rst } from 'mdns';
import { Op } from 'sequelize';
import { annotateDevice } from '../utils';

import Device from '../models/device.model';

import { SCANNING_FREQUENCY } from './config.service';
import { publish, TOPICS } from './subscriptions.service';

import { ChromecastService } from '../types';

let scanInterval: NodeJS.Timeout | null = null;

export function startScanning(): void {
  if (scanInterval) clearInterval(scanInterval);
  scanInterval = setInterval(scanDevices, SCANNING_FREQUENCY);
}

export async function recordDevice(
  service: ChromecastService,
): Promise<Device | null> {
  const identifier = service.txtRecord.id;
  const model = service.txtRecord.md;

  const device = await Device.findOne({ where: { identifier } });

  // if we haven't seen this device before, insert it
  if (!device) {
    const newDevice = new Device({
      identifier,
      nickname: service.txtRecord.fn,
      address: service.addresses[0],
      model,
      rotation: 0,
      status: 'online',
    });
    return newDevice.save();
  }

  // if we've seen this device before, update it
  return device.update({
    nickname: service.txtRecord.fn,
    address: service.addresses[0],
    model,
    status: 'online',
  });
}

export function scanDevices(): Promise<void> {
  return new Promise(resolve => {
    // look for mDNS Cast devices on LAN network
    const browser = createBrowser(tcp('googlecast'));

    // Only scan IPv4 addresses (ignore IPv6)
    Browser.defaultResolverSequence[1] =
      'DNSServiceGetAddrInfo' in dns_sd
        ? rst.DNSServiceGetAddrInfo()
        : rst.getaddrinfo({ families: [4] });

    const deviceUpdates: Promise<Device | null>[] = [];

    // 'serviceUp' will be emitted for each device found
    browser.on('serviceUp', (service: ChromecastService) =>
      deviceUpdates.push(recordDevice(service)),
    );

    // poll for 15 seconds
    browser.start();
    setTimeout(async () => {
      browser.stop();
      const updatedDevices = (await Promise.all(deviceUpdates)).filter(
        Boolean,
      ) as Device[];

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
