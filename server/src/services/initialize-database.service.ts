import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';

import { getDataDirectory } from './get-data-directory.service';

import { getConfig } from './config.service';

export async function initializeDatabase() {
  const { SQL_LOGGING } = getConfig();
  const dataDirectory = getDataDirectory();
  const db = new Sequelize({
    logging: SQL_LOGGING,
    database: 'multicast',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: join(dataDirectory, 'db.sqlite3'),
    modelPaths: [join(__dirname, '..', 'models', '*.model.ts')],
  });
  await db.sync();
  return db;
}
