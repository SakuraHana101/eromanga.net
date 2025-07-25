// src/routes/admin/login/+page.server.ts
import type { Actions } from '@sveltejs/kit';
import { redirect, fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { getDB } from '$lib/server/db';
import { users } from '$lib/server/schema';
import { eq } from 'drizzle-orm';

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

    let db;
    try {
      db = getDB();
    } catch (e) {
      console.error('DB connection error:', e);
      return fail(500, { error: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้' });
    }

    // ค้นหาผู้ใช้จาก DB
    const foundUsers = await db.select().from(users).where(eq(users.username, username)).limit(1);
    const user = foundUsers[0];

    if (!user || !user.password) {
      return fail(401, { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return fail(401, { error: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });
    }

    // ตั้ง cookie session
    cookies.set('session', user.id.toString(), {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7 // 7 วัน
    });

    throw redirect(303, '/admin');
  }
};
