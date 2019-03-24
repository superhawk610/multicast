import { withFilter } from 'graphql-yoga';

import { getResolver, TOPICS } from '../services/subscriptions.service';

export const Subscription = {
  devices: {
    subscribe() {
      return getResolver(TOPICS.Devices);
    },
  },
  alerts: {
    subscribe() {
      return getResolver(TOPICS.Alerts);
    },
  },
  updates: {
    subscribe: withFilter(
      () => getResolver(TOPICS.Updates),
      (payload, { device }) => !payload.device || payload.device === device,
    ),
  },
};
