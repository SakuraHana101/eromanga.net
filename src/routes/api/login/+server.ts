import type { RequestHandler } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export const POST: RequestHandler = async ({ request }) => {
  const { username, password } = await request.json();

  const user = await prisma.user.findUnique({ where: { username } });

  if (!user) {
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  }

  // TODO: เช็ค password ให้ปลอดภัย เช่น bcrypt (ตอนนี้สมมุติว่าตรงกันเลย)
  if (password !== user.password) {
    return new Response(JSON.stringify({ success: false }), { status: 401 });
  }

  // คืน sessionId เป็น user.id
  return new Response(JSON.stringify({ success: true, sessionId: user.id }));
};
