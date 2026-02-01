import { config } from './env.js';

const knexConfig = {
  client: 'mysql2',
  connection: {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    timezone: config.db.timezone,
    charset: 'utf8mb4'
  },
  pool: {
    min: 2,
    max: 10
  },
  migrations: {
    directory: '../db/migrations',
    tableName: 'knex_migrations'
  },
  seeds: {
    directory: '../db/seeds'
  }
};

export default knexConfig;