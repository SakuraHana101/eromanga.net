import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { schema } from './schema';

const sqlite = new Database('eromanga_db.sqlite'); // หรือใช้ process.env.DATABASE_URL

export const db = drizzle(sqlite, { schema });
