import type { RequestHandler } from '@sveltejs/kit';
import { Client } from 'basic-ftp';

// FTP เชื่อมต่อ Storage Zone
const BUNNY_FTP_HOST = `${process.env.BUNNY_STORAGE_REGION}.storage.bunnycdn.com`;
const BUNNY_FTP_USERNAME = process.env.BUNNY_STORAGE_ZONE_NAME ?? '';
const BUNNY_FTP_PASSWORD = process.env.BUNNY_FTP_PASSWORD ?? '';

// Pull Zone Domain สำหรับลิงก์โหลดภาพ (CDN)
const BUNNY_PULL_ZONE_DOMAIN = process.env.BUNNY_PULL_ZONE_DOMAIN ?? `${BUNNY_FTP_USERNAME}.b-cdn.net`;

async function createFtpClient() {
  const ftp = new Client();
  await ftp.access({
    host: BUNNY_FTP_HOST,
    user: BUNNY_FTP_USERNAME,
    password: BUNNY_FTP_PASSWORD,
    secure: true,
  });
  return ftp;
}

export const GET: RequestHandler = async ({ params }) => {
  const { mangaId } = params;
  const folder = `manga/${mangaId}`;

  try {
    const ftp = await createFtpClient();

    // ดึงรายการไฟล์ใน folder
    const list = await ftp.list(folder);
    await ftp.close();

    const files = list.map(file => file.name);

    // หาไฟล์ cover.jpg หรือไฟล์ที่มีคำว่า cover
    const coverFile = files.find(name => name.toLowerCase().includes('cover')) || '';

    // หาไฟล์หน้า page-*.jpg และเรียงลำดับแบบตัวเลข
    const pageFiles = files
      .filter(name => name.toLowerCase().startsWith('page'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    // สร้าง base URL จาก Pull Zone domain (CDN)
    const baseUrl = `https://${BUNNY_PULL_ZONE_DOMAIN}/${folder}`;

    return new Response(
      JSON.stringify({
        title: `มังงะเรื่อง ${mangaId}`,
        coverUrl: coverFile ? `${baseUrl}/${coverFile}` : '',
        pageUrls: pageFiles.map(name => `${baseUrl}/${name}`),
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('[Bunny FTP Read Error]', error);
    return new Response(
      JSON.stringify({
        title: `มังงะเรื่อง ${mangaId}`,
        coverUrl: '',
        pageUrls: [],
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
