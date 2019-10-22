import { annotateDevice } from '../utils';

import { start, stop } from '../services/takeover.service';
import { launchApp } from '../services/launch-app.service';
import { getConfig, updateConfig } from '../services/config.service';
import { createAlert } from '../services/alert.service';

import Device from '../models/device.model';
import Channel from '../models/channel.model';

export const Mutation = {
  async validateLogin(_, { token }) {
    return getConfig().API_KEY === token;
  },
  async updateDevice(_, { id, changes }) {
    const device = await Device.findByPk(id);
    if (!device) {
      throw new Error(`No device found for id ${id}`);
    }
    await device.update(changes);
    return annotateDevice(device);
  },
  async registerDevice(_, { id }) {
    const device = await Device.findByPk(id);
    if (!device) {
      throw new Error(`No device found for id ${id}`);
    }
    if (!annotateDevice(device).supported) {
      throw new Error(`Device model ${device.model} is unsupported`);
    }
    await device.update({ registered: true });
    return annotateDevice(device);
  },
  async unregisterDevice(_, { id }) {
    const device = await Device.findByPk(id);
    if (!device) {
      throw new Error(`No device found for id ${id}`);
    }
    if (!device.registered) {
      throw new Error(`Device ${id} isn't registered`);
    }
    await device.update({ registered: false });
    return annotateDevice(device);
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
    if (getConfig().SANDBOX) return true;

    (await Device.findAll())
      .map(annotateDevice)
      .filter(d => d.supported)
      .forEach(d => launchApp(d.address));
    return true;
  },
  async connect(_, { id }) {
    if (getConfig().SANDBOX) return true;

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
