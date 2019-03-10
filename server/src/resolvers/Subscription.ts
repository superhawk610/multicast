import { getResolver, TOPICS } from '../services/subscriptions.service';

export const Subscription = {
  devices: {
    subscribe() {
      return getResolver(TOPICS.Devices);
    },
  },
};
