import { start, stop } from '../services/takeover.service';

import Device from '../models/device.model';
import Channel from '../models/channel.model';
import Alert from '../models/alert.model';
import { annotateDevice } from '../utils';

export const Mutation = {
  async createDevice(_, { model }) {
    const device = await Device.create(model);
    return annotateDevice(device);
  },
  async updateDevice(_, { id, changes }) {
    const [, devices] = await Device.update(changes, { where: { id } });
    if (devices.length === 0) {
      throw new Error(`No device found for id ${id}`);
    }
    const device = devices[0];
    return annotateDevice(device);
  },
  async deleteDevice(_, { id }) {
    try {
      const model = await Device.findByPk(id);
      if (!model) return { ok: false, model };
      await Device.destroy({ where: { id } });
      return { ok: true, model: annotateDevice(model) };
    } catch (e) {
      return { ok: false, model: null };
    }
  },
  createChannel(_, { model }) {
    return Channel.create(model);
  },
  async updateChannel(_, { id, changes }) {
    const [, channels] = await Channel.update(changes, { where: { id } });
    if (channels.length === 0) {
      throw new Error(`No channel found for id ${id}`);
    }
    return channels[0];
  },
  async deleteChannel(_, { id }) {
    try {
      const model = await Channel.findByPk(id);
      if (!model) return { ok: false, model };
      await Channel.destroy({ where: { id } });
      return { ok: true, model };
    } catch (e) {
      return { ok: false, model: null };
    }
  },
  createAlert(_, { model }) {
    return Alert.create(model);
  },
  async updateAlert(_, { id, changes }) {
    const [, alerts] = await Alert.update(changes, { where: { id } });
    if (alerts.length === 0) {
      throw new Error(`No alert found for id ${id}`);
    }
    return alerts[0];
  },
  async deleteAlert(_, { id }) {
    try {
      const model = await Alert.findByPk(id);
      if (!model) return { ok: false, model };
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
