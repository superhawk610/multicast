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

export function scanDevices(): Promise<void> {
  return new Promise(resolve => {
    // look for mDNS Cast devices on LAN network
    const browser = createBrowser(tcp('googlecast'));

    // Only scan IPv4 addresses (ignore IPv6)
    Browser.defaultResolverSequence[1] =
      'DNSServiceGetAddrInfo' in dns_sd
        ? rst.DNSServiceGetAddrInfo()
        : rst.getaddrinfo({ families: [4] });

    const deviceUpdates: PromiseLike<Device>[] = [];

    // 'serviceUp' will be emitted for each device found
    browser.on('serviceUp', async (service: ChromecastService) => {
      const identifier = service.txtRecord.id;
      const model = service.txtRecord.md;

      // ignore devices with no video output
      // TODO: add support for Google Home Hub?
      if (model !== DEVICE_MODELS.Chromecast) return;

      const device = await Device.findById(identifier);

      // if we haven't seen this device before, insert it
      if (!device) {
        const newDevice = new Device({
          identifier,
          nickname: service.txtRecord.fn,
          rotation: 0,
          online: true,
        });
        const update = newDevice.save();
        deviceUpdates.push(update);
        return update;
      }

      // if we've seen this device before, update it
      const update = device.update({
        nickname: service.txtRecord.fn,
        online: true,
      });
      deviceUpdates.push(update);
      return update;
    });

    // poll for 15 seconds
    browser.start();
    setTimeout(async () => {
      browser.stop();
      const updatedDevices = await Promise.all(deviceUpdates);

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
