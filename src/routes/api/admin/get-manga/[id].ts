import fs from 'fs';
import path from 'path';

export async function GET({ params }) {
  const { id } = params;

  const mangaDir = path.resolve('public/manga', id);
  const infoPath = path.join(mangaDir, 'info.json');

  if (!fs.existsSync(infoPath)) {
    return new Response(JSON.stringify({ error: 'ไม่พบมังงะ' }), { status: 404 });
  }	

  const info = JSON.parse(fs.readFileSync(infoPath, 'utf-8'));

  // ตรวจสอบว่ามีภาพหน้ามังงะทั้งหมด
  const pageFiles = fs.readdirSync(mangaDir)
    .filter((f) => f !== 'info.json' && f !== 'cover.jpg')
    .sort();

  return new Response(
    JSON.stringify({
      title: info.title,
      coverUrl: `/manga/${id}/cover.jpg`,
      pageUrls: pageFiles.map((f) => `/manga/${id}/${f}`),
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
