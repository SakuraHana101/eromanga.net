import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';
import { slugify } from '$lib/utils/slugify';

const DATA_DIR = 'static/data';
const MANGA_LIST_PATH = path.join(DATA_DIR, 'mangaList.json');

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();

    const { title, coverUrl, pageUrls } = body;
    if (!title || !coverUrl || !pageUrls || !Array.isArray(pageUrls)) {
      return new Response(
        JSON.stringify({ error: 'ข้อมูลไม่ครบถ้วน' }),
        { status: 400 }
      );
    }

    // Load current manga list
    let mangaList: any[] = [];
    try {
      const existing = await fs.readFile(MANGA_LIST_PATH, 'utf-8');
      mangaList = JSON.parse(existing);
    } catch (e) {
      // ไม่มีไฟล์ก็ปล่อยผ่าน
      mangaList = [];
    }

    // Generate unique mangaId
    const mangaId = slugify(title) + '-' + Date.now();

    // Save to new object
    const newManga = {
      mangaId,
      title,
      coverUrl,
      pageUrls,
      createdAt: new Date().toISOString()
    };

    mangaList.push(newManga);

    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true });

    // Save updated list
    await fs.writeFile(MANGA_LIST_PATH, JSON.stringify(mangaList, null, 2), 'utf-8');

    return new Response(JSON.stringify({ success: true, mangaId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    console.error('❌ Failed to save manga:', e);
    return new Response(
      JSON.stringify({ error: 'เกิดข้อผิดพลาดระหว่างบันทึกข้อมูล' }),
      { status: 500 }
    );
  }
};
