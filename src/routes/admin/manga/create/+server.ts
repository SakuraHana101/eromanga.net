import type { RequestHandler } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const prisma = new PrismaClient();

const s3 = new S3Client({
  region: process.env.BUNNY_STORAGE_REGION || 'sg',
  endpoint: process.env.BUNNY_STORAGE_ENDPOINT || 'https://storage.bunnycdn.com',
  credentials: {
    accessKeyId: process.env.BUNNY_STORAGE_ACCESS_KEY || '',
    secretAccessKey: '', // Bunny.net ไม่มี secret key จริงๆ ใช้ AccessKey อย่างเดียว
  }
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();

    const title = formData.get('title')?.toString().trim();
    if (!title) {
      return new Response(JSON.stringify({ success: false, error: 'กรุณากรอกชื่อมังงะ' }), { status: 400 });
    }

    // สร้าง manga record ในฐานข้อมูล
    const manga = await prisma.manga.create({ data: { title } });

    // อัปโหลดภาพปก
    const coverFile = formData.get('cover') as File | null;
    if (!coverFile) {
      return new Response(JSON.stringify({ success: false, error: 'กรุณาอัปโหลดภาพปก' }), { status: 400 });
    }
    const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
    const coverKey = `manga/${manga.id}/cover-${Date.now()}-${coverFile.name}`;

    await s3.send(new PutObjectCommand({
      Bucket: process.env.BUNNY_STORAGE_ZONE_NAME!,
      Key: coverKey,
      Body: coverBuffer,
      ContentType: coverFile.type
    }));
    const coverUrl = `https://${process.env.BUNNY_STORAGE_ZONE_NAME}.b-cdn.net/${coverKey}`;

    // บันทึก URL ภาพปกลงฐานข้อมูล (ตัวอย่างสมมติ schema มีตาราง mangaImage)
    await prisma.mangaImage.create({
      data: {
        mangaId: manga.id,
        url: coverUrl
      }
    });

    // อัปโหลดภาพมังงะหลายภาพ
    const pageFiles = formData.getAll('pages') as File[];
    if (pageFiles.length === 0) {
      return new Response(JSON.stringify({ success: false, error: 'กรุณาอัปโหลดภาพภายใน' }), { status: 400 });
    }

    for (let i = 0; i < pageFiles.length; i++) {
      const file = pageFiles[i];
      const buffer = Buffer.from(await file.arrayBuffer());
      const key = `manga/${manga.id}/page-${i + 1}-${Date.now()}-${file.name}`;

      await s3.send(new PutObjectCommand({
        Bucket: process.env.BUNNY_STORAGE_ZONE_NAME!,
        Key: key,
        Body: buffer,
        ContentType: file.type
      }));

      const url = `https://${process.env.BUNNY_STORAGE_ZONE_NAME}.b-cdn.net/${key}`;

      // บันทึก URL ของแต่ละหน้าภาพ (สมมติ schema มี pageImage)
      await prisma.pageImage.create({
        data: {
          episodeId: '', // กรณีไม่มี episode ให้เว้นว่าง หรือแก้ตาม schema จริง
          url,
          sortOrder: i + 1,
          mangaId: manga.id // เพิ่มถ้า schema ต้องการลิงก์กับ manga
        }
      });
    }

    return new Response(JSON.stringify({ success: true, mangaId: manga.id }), { status: 200 });
  } catch (err: any) {
    console.error('Error in /admin/manga/create:', err);
    return new Response(JSON.stringify({ success: false, error: err.message }), { status: 500 });
  }
};
