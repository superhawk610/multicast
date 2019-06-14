import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { directory as homeDirectory } from 'home-dir';

import { getConfig } from './config.service';

export function getDataDirectory(config = getConfig()): string {
  const { MULTICAST_HOME } = config;

  const dataDirectory =
    MULTICAST_HOME[0] === '/'
      ? MULTICAST_HOME
      : join(homeDirectory, MULTICAST_HOME);
  if (!existsSync(dataDirectory)) {
    mkdirSync(dataDirectory);
  }

  return dataDirectory;
}
