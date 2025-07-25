import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
  const { mangaId, images } = await request.json();

  // 🔧 ตัวอย่างเขียนลง JSON หรือ DB
  // ตัวอย่าง: เขียนลงไฟล์ local
  const fs = await import('fs/promises');
  await fs.writeFile(`static/manga/${mangaId}/order.json`, JSON.stringify(images, null, 2));

  return json({ success: true });
};
