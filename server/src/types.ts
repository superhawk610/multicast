import { PubSub } from 'graphql-yoga';

export interface ChromecastService {
  name: string; // `${model}-${identifier}(-${iterator})?`
  fullname: string; // `${model}-${identifier}(-${iterator})?._googlecast._tcp.local.`
  txtRecord: ServiceTxtRecord;
  addresses: string[];
  port: number;
}

export interface ServiceTxtRecord {
  id: string; // device identifier
  fn: string; // device name
  md: GoogleDeviceModel; // device model
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
