import Device from '../models/device.model';
import Channel from '../models/channel.model';
import Alert from '../models/alert.model';

export const Query = {
  device() {
    return { id: 'abcdefg' };
  },
  devices() {
    return Device.findAll();
  },
  channel() {
    return null;
  },
  channels() {
    return Channel.findAll();
  },
  alert() {
    return null;
  },
  alerts() {
    return Alert.findAll();
  },
  takeover() {
    return { active: false, channel: null };
  },
};
