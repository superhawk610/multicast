import { annotateDevice } from '../utils';

import { getActiveChannel } from '../services/takeover.service';
import { getAllAlerts } from '../services/alert.service';
import { getConfig } from '../services/config.service';

import Device from '../models/device.model';
import Channel from '../models/channel.model';

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
  alerts() {
    return getAllAlerts();
  },
  takeover() {
    const channel = getActiveChannel();
    return { active: Boolean(channel), channel };
  },
  status() {
    return { sandbox: getConfig().SANDBOX };
  },
  configuration() {
    const { MULTICAST_HOME, PORT, SCANNING_FREQUENCY, DISABLE_PLAYGROUND } = getConfig();
    return {
      home: MULTICAST_HOME,
      port: PORT,
      scanningFrequency: SCANNING_FREQUENCY,
      playgroundEnabled: !DISABLE_PLAYGROUND,
    };
  },
};
