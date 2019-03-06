import { Sequelize } from 'sequelize-typescript';
import { join } from 'path';

export async function initializeDatabase() {
  const db = new Sequelize({
    database: 'multicast',
    dialect: 'sqlite',
    username: 'root',
    password: '',
    storage: join(__dirname, 'db.sqlite3'),
    modelPaths: [join(__dirname, 'models', '*.model.ts')],
    // disable string-based operators, and do not set any aliases
    // (i.e. use the built-in Symbol-based operators)
    // taken from [here](https://github.com/sequelize/sequelize/issues/8417)
    operatorsAliases: false,
  });
  await db.sync();
  return db;
}
