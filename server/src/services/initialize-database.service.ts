import { join } from 'path';
import { unlinkSync } from 'fs';
import { Sequelize } from 'sequelize-typescript';
import * as glob from 'glob';

import { getDataDirectory } from './get-data-directory.service';
import { getConfig } from './config.service';

const globs = {
  models: join(__dirname, '..', 'models', '*.model.ts'),
  fixtures: join(__dirname, '..', 'fixtures', '*.fixture.ts'),
};

export async function initializeDatabase() {
  const { SANDBOX, SQL_LOGGING } = getConfig();
  const dataDirectory = getDataDirectory();
  const storage = join(dataDirectory, SANDBOX ? 'sandbox.sqlite3' : 'db.sqlite3');

  if (SANDBOX) clearExistingSandbox(storage);

  // initialize database connection
  const db = new Sequelize({
    logging: SQL_LOGGING,
    database: 'multicast',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage,
    modelPaths: [globs.models],
  });

  // create database schema if it doesn't already exist
  await db.sync();

  if (SANDBOX) insertFixtures();

  return db;
}

function clearExistingSandbox(path: string) {
  try {
    unlinkSync(path);
  } catch (e) {}
}

async function insertFixtures() {
  const fixtures = glob.sync(globs.fixtures);

  for (const path of fixtures) {
    const { model, data } = await import(path);

    for (const record of data) {
      await model.create(record);
    }
  }
}
