import { join } from 'path';
import { Sequelize } from 'sequelize-typescript';
import { getDataDirectory } from './get-data-directory.service';

export async function initializeDatabase() {
  const dataDirectory = getDataDirectory();
  const db = new Sequelize({
    database: 'multicast',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: join(dataDirectory, 'db.sqlite3'),
    modelPaths: [join(__dirname, '..', 'models', '*.model.ts')],
    // disable string-based operators, and do not set any aliases
    // (i.e. use the built-in Symbol-based operators)
    // taken from [here](https://github.com/sequelize/sequelize/issues/8417)
    operatorsAliases: false,
  });
  await db.sync();
  return db;
}
