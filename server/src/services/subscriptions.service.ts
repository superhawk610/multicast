import { PubSub } from 'graphql-yoga';

const pubsub = new PubSub();

export const TOPICS = {
  Devices: 'devices' as 'devices',
  Alerts: 'alerts' as 'alerts',
  Updates: 'updates' as 'updates',
};

export type PubSubTopic = 'devices' | 'alerts' | 'updates';

export function getResolver(topic: PubSubTopic) {
  return pubsub.asyncIterator(topic);
}

export function publish(topic: PubSubTopic, payload: any) {
  pubsub.publish(topic, payload);
}
