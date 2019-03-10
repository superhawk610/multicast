import { annotateDevice } from '../utils';

import { getActiveChannel } from '../services/takeover.service';
import {
  SANDBOX,
  MULTICAST_HOME,
  PORT,
  SCANNING_FREQUENCY,
  DISABLE_PLAYGROUND,
} from '../services/config.service';

import Device from '../models/device.model';
import Channel from '../models/channel.model';
import Alert from '../models/alert.model';

export const Query = {
  async device(_, { id }) {
    const device = await Device.findByPk(id);
    return device ? annotateDevice(device) : null;
  },
  async devices() {
    const devices = await Device.findAll();
    return devices.map(annotateDevice);
  },
  channel(_, { id }) {
    return Channel.findByPk(id);
  },
  channels() {
    return Channel.findAll();
  },
  alert(_, { id }) {
    return Alert.findByPk(id);
  },
  alerts() {
    return Alert.findAll();
  },
  takeover() {
    const channel = getActiveChannel();
    return { active: Boolean(channel), channel };
  },
  status() {
    return { sandbox: SANDBOX };
  },
  configuration() {
    return {
      home: MULTICAST_HOME,
      port: PORT,
      scanningFrequency: SCANNING_FREQUENCY,
      playgroundEnabled: !DISABLE_PLAYGROUND,
    };
  },
};
