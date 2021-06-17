import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config({ path: __dirname+'/./../../.env' });
const {DB_HOST, DB_USERNAME, DB_PASSWORD, DB_DATABASE, DB_PORT} = process.env;

const { Pool } = pg;

export const connectionDB = new Pool({
  user: DB_USERNAME,
  host: DB_HOST,
  port: (DB_PORT as unknown) as number,
  database: DB_DATABASE,
  password: DB_PASSWORD
});
