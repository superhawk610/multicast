export type Nullable<T> = { [P in keyof T]: T[P] | null };

export interface ChromecastService {
  id: string;
  name: string;
  model: GoogleDeviceModel;
  address: string;
  port: number;
}

export const DEVICE_MODELS = {
  Group: 'Google Cast Group' as 'Google Cast Group',
  Home: 'Google Home' as 'Google Home',
  HomeMini: 'Google Home Mini' as 'Google Home Mini',
  MagniFiMini: 'MagniFi Mini' as 'MagniFi Mini',
  Chromecast: 'Chromecast' as 'Chromecast',
};

// TODO: add more valid models as they're found
export type GoogleDeviceModel =
  | 'Google Cast Group'
  | 'Google Home'
  | 'Google Home Mini'
  | 'MagniFi Mini'
  | 'Chromecast';
