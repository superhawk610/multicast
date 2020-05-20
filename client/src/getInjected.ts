type InjectedWindow = Window & {
  serverInject: ServerInject;
};

interface ServerInject {
  device: string | null;
  host: string;
  name: string;
  upstream: [string, string];
  token: string;
}

const w = (typeof window === 'undefined' ? { serverInject: {} } : window) as InjectedWindow;

export const isInjected = typeof w.serverInject !== 'string';

export function getInjected<T extends keyof ServerInject, D>(
  key: T,
  defaultValue: D,
): ServerInject[T] | D {
  return isInjected ? w.serverInject[key] : defaultValue;
}
