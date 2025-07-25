// src/routes/api/admin/get-manga/[mangaId].ts
import { json } from '@sveltejs/kit';
import ... from '$lib/bunny-utils';
import { env } from '$env/dynamic/private'; // ดึงค่าจาก .env

export async function GET({ params }) {
  const { mangaId } = params;

  // ต้องปิดท้ายด้วย '/' เสมอ
  const folder = `manga-images/manga/${mangaId}/`;

  // URL base ของ Cloudflare R2 แบบ public (เอาจาก .env ถ้ามี)
  const baseUrl = env.R2_PUBLIC_URL || 'https://YOUR_BACKUP_PUBLIC_URL/';

  console.log('[API] Fetching manga:', mangaId);
  console.log('[API] Folder path:', folder);
  console.log('[API] Using base URL:', baseUrl);

  try {
    const imageList = await listImagesInFolder(folder);

    console.log('[API] Images found:', imageList);

    if (!imageList || imageList.length === 0) {
      console.warn('[API] No images found in folder:', folder);
    }

    const coverFile = imageList.find(name =>
      name.toLowerCase().includes('cover')
    );

    const pageFiles = imageList
      .filter(name => name.toLowerCase().includes('page'))
      .sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true })
      );

    return json({
      title: `มังงะเรื่อง ${mangaId}`,
      coverUrl: coverFile ? `${baseUrl}${folder}${coverFile}` : '',
      pageUrls: pageFiles.map(name => `${baseUrl}${folder}${name}`)
    });
  } catch (error) {
    console.error('[API] Error fetching manga images:', error);
    return json(
      {
        title: `มังงะเรื่อง ${mangaId}`,
        coverUrl: '',
        pageUrls: []
      },
      { status: 500 }
    );
  }
}
