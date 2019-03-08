import { API_KEY } from './config.service';

export function validateToken(token: string | null): boolean {
  return token === API_KEY;
}
