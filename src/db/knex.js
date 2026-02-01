import knex from 'knex';

import knexConfig from '../../knexfile.js';

import { config as envConfig } from '../config/env.js';

const environment = envConfig.env || 'development';
const db = knex(knexConfig[environment]);

export default db;
