import { join } from 'path';
import { unlinkSync } from 'fs';
import { Sequelize } from 'sequelize-typescript';

import { getDataDirectory } from './get-data-directory.service';

import { getConfig } from './config.service';

export async function initializeDatabase() {
  const { SANDBOX, SQL_LOGGING } = getConfig();
  const dataDirectory = getDataDirectory();
  const storage = join(dataDirectory, SANDBOX ? 'sandbox.sqlite3' : 'db.sqlite3');

  // remove existing sandbox database from previous run, if it exists
  if (SANDBOX) {
    try {
      unlinkSync(storage);
    } catch (e) {}
  }

  // initialize database connection
  const db = new Sequelize({
    logging: SQL_LOGGING,
    database: 'multicast',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage,
    modelPaths: [join(__dirname, '..', 'models', '*.model.ts')],
  });

  // create database schema if it doesn't already exist
  await db.sync();

  return db;
}
