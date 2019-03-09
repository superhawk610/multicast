import { createBrowser, Browser, tcp, dns_sd, rst } from 'mdns';
import { Op } from 'sequelize';

import Device from '../models/device.model';

import { SCANNING_FREQUENCY } from './config.service';

import { ChromecastService, DEVICE_MODELS } from '../types';

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

  // ignore devices with no video output
  // TODO: add support for Google Home Hub?
  if (model !== DEVICE_MODELS.Chromecast) return null;

  const device = await Device.findOne({ where: { identifier } });

  // if we haven't seen this device before, insert it
  if (!device) {
    const newDevice = new Device({
      identifier,
      nickname: service.txtRecord.fn,
      rotation: 0,
      online: true,
    });
    return newDevice.save();
  }

  // if we've seen this device before, update it
  return device.update({
    nickname: service.txtRecord.fn,
    online: true,
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

      // find all devices that aren't accounted for...
      const missingDevices = await Device.findAll({
        where: { id: { [Op.notIn]: updatedDevices.map(d => d.id) } },
      });

      // ...and mark them as offline
      await Promise.all(
        missingDevices.map((device: Device) =>
          device.update({ online: false }),
        ),
      );
      resolve();
    }, 15 * 1000);
  });
}
