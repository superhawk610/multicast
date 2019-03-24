import * as typedDevice from '../../models/device.model';
import { DEVICE_MODELS, ChromecastService } from '../../types';
import { recordDevice } from '../scan-devices.service';

const Device = typedDevice as any;

jest.mock('multicast-dns', () => () => ({
  on: jest.fn(),
}));

jest.mock('../../models/device.model', () => {
  const mockDevice = jest.fn() as any;
  const mockDeviceInstance = jest.fn() as any;
  mockDevice.mockImplementation(() => mockDeviceInstance);
  mockDevice.findOne = jest.fn();
  mockDeviceInstance.save = jest.fn();

  return {
    default: mockDevice,
    mockedInstance: mockDeviceInstance,
  };
});

describe('scanDevices', () => {
  describe('scanDevices // recordDevice', () => {
    afterEach(() => {
      Device.default.mockClear();
      Device.default.findOne.mockClear();
      Device.mockedInstance.save.mockClear();
    });

    it('inserts new devices into the database', async () => {
      const device = {
        identifier: 'identifier',
        nickname: 'nickname',
        address: '10.0.0.10',
        model: DEVICE_MODELS.Chromecast,
        rotation: 0,
        status: 'online',
      };
      const service = {
        id: 'identifier',
        model: DEVICE_MODELS.Chromecast,
        name: 'nickname',
        address: '10.0.0.10',
      } as ChromecastService;

      Device.default.findOne.mockImplementation(
        () => null /* no record found */,
      );

      await recordDevice(service);

      expect(Device.default).toBeCalledWith(device);
      expect(Device.mockedInstance.save).toBeCalled();
    });

    it('updates existing devices in the database', async () => {
      const update = jest.fn();
      const nickname = 'foo';
      const service = {
        model: DEVICE_MODELS.Chromecast,
        name: nickname,
        address: '10.0.0.10',
      } as ChromecastService;

      Device.default.findOne.mockImplementation(
        () => ({ update }) /* existing record */,
      );

      await recordDevice(service);

      expect(Device.mockedInstance.save).not.toBeCalled();
      expect(update).toBeCalledWith({
        nickname,
        address: '10.0.0.10',
        model: DEVICE_MODELS.Chromecast,
        status: 'online',
      });
    });
  });
});
