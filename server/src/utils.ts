import Device from './models/device.model';

import { GoogleDeviceModel, DEVICE_MODELS } from './types';

interface AnnotatedDevice extends Device {
  supported: boolean;
}

// TODO: add support for Google Home Hub?
export function isSupportedModel(model: GoogleDeviceModel): boolean {
  return model === DEVICE_MODELS.Chromecast;
}

export function annotateDevice(device: Device): AnnotatedDevice {
  return {
    ...device.toJSON(),
    supported: isSupportedModel(device.model),
  } as AnnotatedDevice;
}

// TODO: unit test
// converts an array of key-value pairs to an object with the corresponding
// key-value pairs
//
// ['a=b', 'foo=bar']
//
// {
//   a: 'b',
//   foo: 'bar',
// }
export function objectFromKeyValuePairs(keyValuePairs: string[]): { [key: string]: string } {
  const obj = {};

  for (const kvp of keyValuePairs) {
    const idx = kvp.indexOf('=');
    const key = kvp.substring(0, idx);
    const value = kvp.substring(idx + 1);
    obj[key] = value;
  }

  return obj;
}

// TODO: unit test
export function dedupe<T>(arr: T[], identify: (el: T) => any = x => x): T[] {
  return arr.filter((el: T, pos: number) => {
    const identity = identify(el);
    return arr.findIndex(x => identify(x) === identity) === pos;
  });
}
