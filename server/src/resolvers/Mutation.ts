export const Mutation = {
  createDevice(_, { model }) {
    return { id: 'abc' };
  },
  updateDevice(_, { id, changes }) {
    return { id: 'abc' };
  },
  deleteDevice(_, { id }) {
    return { ok: false, model: null };
  },
  createChannel(_, { model }) {
    return { id: 'abc' };
  },
  updateChannel(_, { id, changes }) {
    return { id: 'abc' };
  },
  deleteChannel(_, { id }) {
    return { ok: false, model: null };
  },
  createAlert(_, { model }) {
    return { id: 'abc' };
  },
  updateAlert(_, { id, changes }) {
    return { id: 'abc' };
  },
  deleteAlert(_, { id }) {
    return { ok: false, model: null };
  },
  startTakeover() {
    return { active: false, channel: null };
  },
  endTakeover() {
    return { active: false, channel: null };
  },
};
