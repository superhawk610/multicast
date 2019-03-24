import { PubSub } from 'graphql-yoga';

const pubsub = new PubSub();

export const TOPICS: { [topic: string]: PubSubTopic } = {
  Devices: 'devices',
  Alerts: 'alerts',
};

export type PubSubTopic = 'devices' | 'alerts';

export function getResolver(topic: PubSubTopic) {
  return pubsub.asyncIterator(topic);
}

export function publish(topic: PubSubTopic, payload: any) {
  pubsub.publish(topic, payload);
}
