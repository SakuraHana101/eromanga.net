import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  // ลบ session cookie
  cookies.delete('session', { path: '/' });

  // รีไดเรกต์กลับหน้าล็อกอิน
  throw redirect(303, '/admin/login');
};
