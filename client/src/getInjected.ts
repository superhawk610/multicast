type InjectedWindow = Window & {
  serverInject: ServerInject;
};

interface ServerInject {
  __active: boolean | string;
  host: string;
  name: string;
  upstream: string;
}

const w = (typeof window === 'undefined' ? {} : window) as InjectedWindow;

export function isInjected(): boolean {
  return getInjected('__active') === true;
}

export function getInjected<T extends keyof ServerInject>(
  key: T,
  defaultValue = null,
): ServerInject[T] | null {
  return w.serverInject ? w.serverInject[key] : defaultValue;
}
