import Device from './models/device.model';

import { GoogleDeviceModel, DEVICE_MODELS } from './types';

type AnnotatedDevice = Device & {
  supported: boolean;
};

// TODO: add support for Google Home Hub?
export function isSupportedModel(model: GoogleDeviceModel): boolean {
  return model === DEVICE_MODELS.Chromecast;
}

export function annotateDevice(device: Device): AnnotatedDevice {
  return {
    ...device.toJSON(),
    supported: isSupportedModel(device.model),
  };
}
