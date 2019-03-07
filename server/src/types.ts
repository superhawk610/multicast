export interface ChromecastService {
  name: string; // `Chromecast-${hexadecimalId}`
  txtRecord: ServiceTxtRecord;
  addresses: string[];
  port: number;
}

export interface ServiceTxtRecord {
  fn: string; // Chromecast device name
}
