type InjectedWindow = Window & {
  serverInject: ServerInject;
};

interface ServerInject {
  __active: boolean | string;
  device: string;
  host: string;
  name: string;
  upstream: string;
}

const w = (typeof window === 'undefined' ? {} : window) as InjectedWindow;

export function isInjected(): boolean {
  return getInjected('__active', false) as boolean;
}

export function getInjected<T extends keyof ServerInject, D>(
  key: T,
  defaultValue: D,
): ServerInject[T] | D {
  const value = w.serverInject[key];
  return typeof value === 'string'
    ? value.match(/^#INJECT/)
      ? defaultValue
      : w.serverInject[key]
    : value;
}
