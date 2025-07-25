import type { Actions } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import { redirect, fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const form = await request.formData();
    const usernameRaw = form.get('username');
    const passwordRaw = form.get('password');

    const username = typeof usernameRaw === 'string' ? usernameRaw.trim() : '';
    const password = typeof passwordRaw === 'string' ? passwordRaw : '';

    if (!username || !password) {
      return fail(400, { error: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
    }

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      return fail(401, { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // *** ตั้ง cookie session ***
    cookies.set('session', user.id, {
      path: '/',                // ต้องตั้งเป็น '/' เพื่อให้ทุกหน้าเข้าถึง cookie นี้ได้
      httpOnly: true,           // ป้องกัน JavaScript ฝั่ง client อ่าน cookie ได้
      sameSite: 'strict',       // ป้องกัน CSRF (ถ้าไม่แน่ใจ ให้ใช้ 'strict')
      secure: process.env.NODE_ENV === 'production',  // ใช้ HTTPS ใน production เท่านั้น
      maxAge: 60 * 60 * 24 * 7  // อายุ cookie 7 วัน (หน่วยวินาที)
    });

    throw redirect(303, '/admin');  // รีไดเร็กต์ไปแดชบอร์ดหลังล็อกอินสำเร็จ
  }
};
