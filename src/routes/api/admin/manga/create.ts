// src/routes/api/admin/manga/create.ts
import type { RequestHandler } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const { title, slug, coverImageUrl } = data;

  const mangaListPath = path.resolve('src/lib/data/mangaList.json');
  let list = [];

  if (fs.existsSync(mangaListPath)) {
    list = JSON.parse(fs.readFileSync(mangaListPath, 'utf8'));
  }

  list.push({ title, slug, coverImageUrl });

  fs.writeFileSync(mangaListPath, JSON.stringify(list, null, 2));
  return new Response(JSON.stringify({ ok: true }));
};
