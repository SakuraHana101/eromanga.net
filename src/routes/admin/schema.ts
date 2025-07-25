// src/routes/admin/+page.server.ts
import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async ({ cookies }) => {
  const session = cookies.get('session');
  if (!session) {
    // ไม่พบ session รีไดเรกต์ไปหน้า login
    throw redirect(303, '/login');
  }

  // ตรวจสอบ session ในฐานข้อมูลผู้ใช้
  const user = await prisma.user.findUnique({
    where: { sessionToken: session }
  });

  if (!user) {
    // session ไม่ถูกต้อง รีไดเรกต์ไปหน้า login
    throw redirect(303, '/login');
  }

  const mangaCount = await prisma.manga.count();

  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  const onlineUserCount = await prisma.user.count({
    where: {
      lastActive: {
        gt: twoMinutesAgo
      }
    }
  });

  const nowThai = new Date().toISOString();

  return {
    mangaCount,
    onlineUserCount,
    nowThai,
    user // ถ้าต้องการข้อมูล user เพิ่มเติมในแดชบอร์ด
  };
};
