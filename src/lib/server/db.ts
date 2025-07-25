// src/lib/server/db.ts

import { drizzle } from 'drizzle-orm/d1';
import * as schema from '$lib/server/schema';

// ประกาศชนิดของ db ไว้ก่อน
let db: ReturnType<typeof drizzle> | null = null;

/**
 * ฟังก์ชันสำหรับเรียกใช้ฐานข้อมูล D1 (Cloudflare)
 * ต้องมั่นใจว่ามีการ bind D1 ผ่าน `env.PUBLIC_DB`
 */
export function getDB() {
  if (!db) {
    // ตรวจสอบว่ามี D1 binding ไหม
    const d1 = (import.meta.env.PUBLIC_DB || undefined) as D1Database | undefined;

    if (!d1) {
      throw new Error('❌ D1 binding is missing: ตรวจสอบว่าได้ตั้งค่า PUBLIC_DB ใน wrangler.toml แล้ว');
    }

    db = drizzle(d1, { schema });
  }

  return db;
}
