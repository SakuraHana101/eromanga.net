import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import type { LibSQLDatabase } from 'drizzle-orm/libsql';
import * as schema from '$lib/server/schema';

// สำหรับ SQLite client (local)
// ติดตั้ง sqlite3 หรือ better-sqlite3 แล้ว import มาตรงนี้
import Database from 'better-sqlite3';

let db: LibSQLDatabase<typeof schema>;

export function getDB(): LibSQLDatabase<typeof schema> {
  if (!db) {
    if (typeof import.meta.env.DB !== 'undefined') {
      // รันบน Cloudflare D1 (production)
      db = drizzleD1(import.meta.env.DB as D1Database, { schema });
    } else {
      // รัน local ใช้ SQLite ไฟล์ db.sqlite ใน root project (แก้ path ตามต้องการ)
      const sqliteDb = new Database('./db.sqlite'); // ต้องสร้างไฟล์นี้เองหรือรัน migration ก่อน
      db = drizzleSqlite(sqliteDb, { schema });
    }
  }
  return db;
}
