import { getActiveChannel } from '../services/takeover.service';

import Device from '../models/device.model';
import Channel from '../models/channel.model';
import Alert from '../models/alert.model';

export const Query = {
  device(_, { id }) {
    return Device.findByPk(id);
  },
  devices() {
    return Device.findAll();
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
};
