import Device from '../models/device.model';

export const model = Device;
export const data = [
  {
    id: 1,
    identifier: 'a8sd8f8asdf8as8s8df8a8',
    registered: true,
    nickname: 'Living Room TV',
    address: '10.0.0.34',
    model: 'Chromecast',
    rotation: 0,
    status: 'online',
    channelId: 1,
  },
  {
    id: 2,
    identifier: 's7sdf89a89s7d0f00a0sdf',
    registered: false,
    nickname: 'Office TV',
    address: '10.0.0.42',
    model: 'Chromecast',
    rotation: 0,
    status: 'online',
  },
  {
    id: 3,
    identifier: 's8df787a7sd6f676a8s9f8',
    registered: false,
    nickname: 'Bedroom Speaker',
    address: '10.0.0.48',
    model: 'Google Home',
    rotation: 0,
    status: 'online',
  },
];
