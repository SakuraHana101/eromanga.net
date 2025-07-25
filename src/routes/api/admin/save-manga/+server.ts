import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const D1 = globalThis.D1; // หรือ import จาก env/config ตาม setup ของคุณ

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { mangaId, title, coverUrl, pageUrls } = await request.json();

    if (!mangaId || !title || !coverUrl || !Array.isArray(pageUrls)) {
      return json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    // แปลง array เป็น JSON string เพื่อเก็บใน D1 (SQLite)
    const pageUrlsStr = JSON.stringify(pageUrls);

    // upsert (insert หรือ update) มังงะในตาราง manga
    // สมมติตารางชื่อ manga มีคอลัมน์ id, title, coverUrl, pageUrls
    const sql = `
      INSERT INTO manga (id, title, coverUrl, pageUrls)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title=excluded.title,
        coverUrl=excluded.coverUrl,
        pageUrls=excluded.pageUrls
    `;

    const stmt = await D1.prepare(sql);
    await stmt.bind(mangaId, title, coverUrl, pageUrlsStr);
    await stmt.run();

    return json({ success: true });
  } catch (error) {
    console.error('Error saving manga:', error);
    return json({ error: 'เกิดข้อผิดพลาดขณะบันทึกข้อมูล' }, { status: 500 });
  }
};
