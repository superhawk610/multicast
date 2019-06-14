import { normalize, join } from 'path';
import { copyFileSync, unlinkSync } from 'fs';

import { getDataDirectory } from './get-data-directory.service';

export function moveDatabase({ MULTICAST_HOME: from }, { MULTICAST_HOME: to }) {
  from = normalize(from);
  to = normalize(to);

  if (from === to) return;

  const oldFile = join(from, 'db.sqlite3');
  const newFile = join(getDataDirectory(), 'db.sqlite3');
  try {
    copyFileSync(oldFile, newFile);
    unlinkSync(oldFile);
  } catch (e) {
    console.error(`could not move database from ${oldFile} to ${newFile}`);
    process.exit(1);
  }
}
