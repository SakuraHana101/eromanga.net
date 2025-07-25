import type { RequestHandler } from '@sveltejs/kit';
import { Client } from 'basic-ftp';
import { Buffer } from 'buffer';
import { Readable } from 'stream';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();

    const title = formData.get('title')?.toString();
    const cover = formData.get('cover') as File | null;
    const pages = formData.getAll('pages') as File[];

    if (!title || !cover || pages.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'ข้อมูลไม่ครบ' }), { status: 400 });
    }

    // เชื่อมต่อ FTP ไปยัง Bunny Storage
    const ftp = new Client();
    await ftp.access({
      host: process.env.BUNNY_FTP_HOST ?? `${process.env.BUNNY_STORAGE_REGION}.storage.bunnycdn.com`,
      port: Number(process.env.BUNNY_FTP_PORT ?? '21'),
      user: process.env.BUNNY_FTP_USERNAME ?? process.env.BUNNY_STORAGE_ZONE_NAME ?? '',
      password: process.env.BUNNY_FTP_PASSWORD ?? '',
      secure: false, // Bunny.net FTP ใช้แบบไม่เข้ารหัส (FTP ปกติ)
    });

    const timestamp = Date.now();
    // ทำให้ title ปลอดภัยสำหรับโฟลเดอร์และ URL
    const safeTitle = title.replace(/[^\w\d-_]+/g, '-').toLowerCase();
    const mangaId = `${safeTitle}-${timestamp}`;
    const basePath = `manga/${mangaId}`;

    // Upload ภาพปก
    const coverBuffer = Buffer.from(await cover.arrayBuffer());
    const coverFilename = 'cover.jpg';
    const coverPath = `${basePath}/${coverFilename}`;
    await ftp.uploadFrom(Readable.from(coverBuffer), coverPath);

    // Upload ภาพแต่ละหน้า
    const pageUrls: string[] = [];
    for (let i = 0; i < pages.length; i++) {
      const file = pages[i];
      const buffer = Buffer.from(await file.arrayBuffer());
      const filename = `page-${i + 1}.jpg`;
      const filePath = `${basePath}/${filename}`;

      await ftp.uploadFrom(Readable.from(buffer), filePath);
      // ใช้ Pull Zone domain โหลดภาพแทน domain storage โดยเพิ่ม env ตัวใหม่ชื่อ BUNNY_PULL_ZONE_DOMAIN
      const pullZoneDomain = process.env.BUNNY_PULL_ZONE_DOMAIN ?? `${process.env.BUNNY_STORAGE_ZONE_NAME}.b-cdn.net`;
      pageUrls.push(`https://${pullZoneDomain}/${filePath}`);
    }

    await ftp.close();

    const pullZoneDomain = process.env.BUNNY_PULL_ZONE_DOMAIN ?? `${process.env.BUNNY_STORAGE_ZONE_NAME}.b-cdn.net`;
    const coverUrl = `https://${pullZoneDomain}/${coverPath}`;

    // TODO: บันทึกข้อมูลลงฐานข้อมูล (Prisma, JSON หรืออื่นๆ) เพื่อเก็บข้อมูลมังงะ

    return new Response(JSON.stringify({
      success: true,
      mangaId,  // ส่งกลับ ID หรือชื่อโฟลเดอร์เพื่อใช้ redirect
      title,
      coverUrl,
      pageUrls
    }), { status: 200 });

  } catch (err) {
    console.error('[Bunny FTP Upload Error]', err);
    return new Response(JSON.stringify({ success: false, error: 'อัปโหลดล้มเหลว' }), { status: 500 });
  }
};
