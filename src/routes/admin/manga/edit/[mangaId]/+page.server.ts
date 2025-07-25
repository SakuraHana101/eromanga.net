// src/routes/admin/manga/edit/[mangaId]/+page.server.ts
import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';

const D1_API_BASE = 'https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/d1/databases/{DB_NAME}/query'; // ตัวอย่าง

async function queryD1(sql: string, params: any[] = []) {
  // เรียก HTTP API ของ D1 ด้วย fetch พร้อมใส่ header authorization
  const res = await fetch(D1_API_BASE, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, parameters: params }),
  });
  if (!res.ok) throw new Error('D1 query failed');
  return await res.json();
}

export const load: PageServerLoad = async ({ params }) => {
  const { mangaId } = params;

  try {
    const sql = 'SELECT * FROM manga WHERE id = ?';
    const result = await queryD1(sql, [mangaId]);

    if (!result.results || result.results.length === 0) {
      throw new Error('ไม่พบมังงะนี้');
    }

    const manga = result.results[0];

    return {
      mangaId,
      manga,
    };
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลมังงะ:', err);
    throw new Error('ไม่สามารถโหลดข้อมูลมังงะได้');
  }
};

export const actions: Actions = {
  update: async ({ request, params }) => {
    const mangaId = params.mangaId;
    const form = await request.formData();

    const title = form.get('title')?.toString().trim() ?? '';
    const description = form.get('description')?.toString().trim() ?? '';
    const coverUrl = form.get('coverUrl')?.toString().trim() ?? '';

    if (!title || !coverUrl) {
      return fail(400, {
        message: 'กรุณากรอกชื่อเรื่องและอัปโหลดภาพหน้าปก',
        values: { title, description, coverUrl },
      });
    }

    try {
      const sql = 'UPDATE manga SET title = ?, description = ?, coverUrl = ? WHERE id = ?';
      await queryD1(sql, [title, description, coverUrl, mangaId]);

      throw redirect(303, `/admin/manga/${mangaId}`);
    } catch (error) {
      console.error('บันทึกข้อมูลมังงะไม่สำเร็จ:', error);
      return fail(500, {
        message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล',
        values: { title, description, coverUrl },
      });
    }
  },
};
