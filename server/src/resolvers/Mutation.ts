import { annotateDevice } from '../utils';

import { start, stop } from '../services/takeover.service';
import { launchApp } from '../services/launch-app.service';
import { updateConfig } from '../services/config.service';

import Device from '../models/device.model';
import Channel from '../models/channel.model';
import { createAlert } from '../services/alert.service';

export const Mutation = {
  async createDevice(_, { model }) {
    const device = await Device.create(model);
    return annotateDevice(device);
  },
  async updateDevice(_, { id, changes }) {
    const device = await Device.findByPk(id);
    if (!device) {
      throw new Error(`No device found for id ${id}`);
    }
    await device.update(changes);
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
    const channel = await Channel.findByPk(id);
    if (!channel) {
      throw new Error(`No channel found for id ${id}`);
    }
    await channel.update(changes);
    return channel;
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
  createAlert(_, { options }) {
    return createAlert(options);
  },
  async connectAll() {
    (await Device.findAll())
      .map(annotateDevice)
      .filter(d => d.supported)
      .forEach(d => launchApp(d.address));
    return true;
  },
  async connect(_, { id }) {
    const device = await Device.findByPk(id);
    if (!device) return false;
    launchApp(device.address);
    return true;
  },
  async startTakeover(_, { channel }) {
    const model = await Channel.findByPk(channel);
    return model ? { active: true, channel: start(model) } : { active: false, channel: null };
  },
  endTakeover() {
    stop();
    return { active: false, channel: null };
  },
  async updateConfiguration(_, { changes }) {
    const { MULTICAST_HOME, PORT, SCANNING_FREQUENCY, DISABLE_PLAYGROUND } = await updateConfig({
      MULTICAST_HOME: changes.home,
      PORT: changes.port,
      SCANNING_FREQUENCY: changes.scanningFrequency,
      DISABLE_PLAYGROUND: !changes.playgroundEnabled,
      API_KEY: changes.apiKey,
    });
    return {
      home: MULTICAST_HOME,
      port: PORT,
      scanningFrequency: SCANNING_FREQUENCY,
      playgroundEnabled: !DISABLE_PLAYGROUND,
    };
  },
};
