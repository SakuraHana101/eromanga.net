// src/routes/api/login/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';
import bcrypt from 'bcrypt';

export const POST: RequestHandler = async ({ request }) => {
  const { username, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return new Response(JSON.stringify({ success: false, error: 'ไม่พบผู้ใช้' }), { status: 401 });
  }

  // เช็ครหัสผ่านด้วย bcrypt
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return new Response(JSON.stringify({ success: false, error: 'รหัสผ่านไม่ถูกต้อง' }), { status: 401 });
  }

  // คืน sessionId เป็น user.id
  return new Response(JSON.stringify({ success: true, sessionId: user.id }));
};
