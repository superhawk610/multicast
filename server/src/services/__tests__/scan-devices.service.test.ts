import * as typedDevice from '../../models/device.model';
import { DEVICE_MODELS, ChromecastService } from '../../types';
import { recordDevice } from '../scan-devices.service';

const Device = typedDevice as any;

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

const unsupportedDeviceModel = DEVICE_MODELS.Home;
const supportedDeviceModel = DEVICE_MODELS.Chromecast;

describe('scanDevices', () => {
  describe('scanDevices // recordDevice', () => {
    afterEach(() => {
      Device.default.mockClear();
      Device.default.findOne.mockClear();
      Device.mockedInstance.save.mockClear();
    });

    it('ignores unsupported device models', () => {
      const service = {
        txtRecord: { md: unsupportedDeviceModel },
      } as ChromecastService;

      return expect(recordDevice(service)).resolves.toBe(null);
    });

    it('inserts new devices into the database', async () => {
      const device = {
        identifier: 'identifier',
        nickname: 'nickname',
        address: '10.0.0.10',
        model: supportedDeviceModel,
        rotation: 0,
        status: 'online',
      };
      const service = {
        txtRecord: {
          md: supportedDeviceModel,
          id: 'identifier',
          fn: 'nickname',
        },
        addresses: ['10.0.0.10'],
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
        txtRecord: { md: supportedDeviceModel, fn: nickname },
        addresses: ['10.0.0.10'],
      } as ChromecastService;

      Device.default.findOne.mockImplementation(
        () => ({ update }) /* existing record */,
      );

      await recordDevice(service);

      expect(Device.mockedInstance.save).not.toBeCalled();
      expect(update).toBeCalledWith({
        nickname,
        address: '10.0.0.10',
        model: supportedDeviceModel,
        status: 'online',
      });
    });
  });
});
