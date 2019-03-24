import Channel from '../models/channel.model';
import { publish, TOPICS } from './subscriptions.service';

let active: Channel | null = null;

export function getActiveChannel(): Channel | null {
  return active;
}

export function start(channel: Channel): Channel {
  active = channel;
  publish(TOPICS.Updates, { updates: { takeover: { active: true, channel } } });
  return channel;
}

export function stop(): void {
  active = null;
  publish(TOPICS.Updates, {
    updates: { takeover: { active: false, channel: null } },
  });
}
