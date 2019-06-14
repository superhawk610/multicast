import { APPLICATION_BASE, COLORS } from './constants';
import { DeviceStatus } from './types';

export function chunk<T>(arr: T[], size: number): Array<T[]> {
  if (arr.length === 0) return [];

  const chunks = [];

  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }

  return chunks;
}

export function words(str: string): string[] | null {
  return str.match(/[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g);
}

export function upperFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function startCase(str: string): string {
  const w = words(str);
  if (!w) return '';

  return w.reduce((result, word, index) => result + (index ? ' ' : '') + upperFirst(word), '');
}

export function colorForStatus(status: DeviceStatus): string {
  switch (status) {
    case 'online':
      return COLORS.green;
    case 'offline':
      return COLORS.red;
    case 'searching':
      return COLORS.yellow;
    default:
      return COLORS.greyLight;
  }
}

export function basePath(href: string): string {
  return APPLICATION_BASE ? `${APPLICATION_BASE}/${href}` : href;
}
