import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

import { directory as homeDirectory } from 'home-dir';

import { getConfig } from './config.service';

export function getDataDirectory(config = getConfig()): string {
  const { MULTICAST_HOME } = config;

  if (!MULTICAST_HOME) {
    throw new Error('MULTICAST_HOME not set, please set to a writeable directory to use Multicast');
  }

  const dataDirectory =
    MULTICAST_HOME[0] === '/' ? MULTICAST_HOME : join(homeDirectory, MULTICAST_HOME);
  if (!existsSync(dataDirectory)) {
    mkdirSync(dataDirectory);
  }

  return dataDirectory;
}
