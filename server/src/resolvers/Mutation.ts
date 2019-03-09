import { start, stop } from '../services/takeover.service';

import Device from '../models/device.model';
import Channel from '../models/channel.model';
import Alert from '../models/alert.model';

export const Mutation = {
  createDevice(_, { model }) {
    return Device.create(model);
  },
  updateDevice(_, { id, changes }) {
    return Device.update(changes, { where: { id } });
  },
  async deleteDevice(_, { id }) {
    try {
      const model = await Device.findByPk(id);
      await Device.destroy({ where: { id } });
      return { ok: true, model };
    } catch (e) {
      return { ok: false, model: null };
    }
  },
  createChannel(_, { model }) {
    return Channel.create(model);
  },
  updateChannel(_, { id, changes }) {
    return Channel.update(changes, { where: { id } });
  },
  async deleteChannel(_, { id }) {
    try {
      const model = await Channel.findByPk(id);
      await Channel.destroy({ where: { id } });
      return { ok: true, model };
    } catch (e) {
      return { ok: false, model: null };
    }
  },
  createAlert(_, { model }) {
    return Alert.create(model);
  },
  updateAlert(_, { id, changes }) {
    return Alert.update(changes, { where: { id } });
  },
  async deleteAlert(_, { id }) {
    try {
      const model = await Alert.findByPk(id);
      await Alert.destroy({ where: { id } });
      return { ok: true, model };
    } catch (e) {
      return { ok: false, model: null };
    }
  },
  async startTakeover(_, { channel }) {
    const model = await Channel.findByPk(channel);
    return model
      ? { active: true, channel: start(model) }
      : { active: false, channel: null };
  },
  endTakeover() {
    stop();
    return { active: false, channel: null };
  },
};
