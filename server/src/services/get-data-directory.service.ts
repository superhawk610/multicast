import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { directory as homeDirectory } from 'home-dir';

import { MULTICAST_HOME } from './config.service';

export function getDataDirectory(): string {
  const dataDirectory = join(homeDirectory, MULTICAST_HOME);
  if (!existsSync(dataDirectory)) {
    mkdirSync(dataDirectory);
  }
  return dataDirectory;
}
