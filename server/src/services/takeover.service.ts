import Channel from '../models/channel.model';

let active: Channel | null = null;

export function getActiveChannel(): Channel | null {
  return active;
}

export function start(channel: Channel): Channel {
  active = channel;
  return channel;
}

export function stop(): void {
  active = null;
}
