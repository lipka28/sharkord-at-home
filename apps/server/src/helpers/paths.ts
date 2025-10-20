import os from 'os';
import path from 'path';
import { SERVER_VERSION } from '../utils/env';

const TEMP_PATH = path.join(os.tmpdir(), 'sharkord');
const DATA_PATH = path.resolve(process.cwd(), './data');
const DB_PATH = path.join(DATA_PATH, 'db.sqlite');
const LOGS_PATH = path.join(DATA_PATH, 'logs');
const PUBLIC_PATH = path.join(DATA_PATH, 'public');
const TMP_PATH = path.join(DATA_PATH, 'tmp');
const UPLOADS_PATH = path.join(DATA_PATH, 'uploads');
const INTERFACE_PATH = path.resolve(TEMP_PATH, './interface', SERVER_VERSION);
const DRIZZLE_PATH = path.resolve(process.cwd(), './data/drizzle');
const MIGRATIONS_PATH = path.join(process.cwd(), 'src', 'db', 'migrations');
const CONFIG_INI_PATH = path.resolve(process.cwd(), 'config.ini');

export {
  CONFIG_INI_PATH,
  DB_PATH,
  DRIZZLE_PATH,
  INTERFACE_PATH,
  LOGS_PATH,
  MIGRATIONS_PATH,
  PUBLIC_PATH,
  TEMP_PATH,
  TMP_PATH,
  UPLOADS_PATH
};
