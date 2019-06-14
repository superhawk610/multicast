import { getConfig } from './config.service';

export function validateToken(token: string | null): boolean {
  return token === getConfig().API_KEY;
}
