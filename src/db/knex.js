import knex from 'knex';

import knexConfig from '@config/knexFile.js';

const db = knex(knexConfig);

export default db;