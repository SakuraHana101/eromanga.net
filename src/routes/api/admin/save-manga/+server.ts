import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import fs from 'fs/promises';
import path from 'path';

async function readMangaList() {
  const filePath = path.resolve('static/data/mangaList.json');
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw);
}

async function writeMangaList(data: any) {
  const filePath = path.resolve('static/data/mangaList.json');
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { mangaId, title, coverUrl, pageUrls } = await request.json();

    if (!mangaId || !title || !coverUrl || !Array.isArray(pageUrls)) {
      return json({ error: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const mangaList = await readMangaList();

    mangaList[mangaId] = { title, coverUrl, pageUrls };

    await writeMangaList(mangaList);

    return json({ success: true });
  } catch (error) {
    return json({ error: 'เกิดข้อผิดพลาดขณะบันทึกข้อมูล' }, { status: 500 });
  }
};
