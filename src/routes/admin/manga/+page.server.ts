import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
  // เช็คล็อกอิน
  if (!locals.user) {
    throw redirect(303, '/admin/login');
  }

  const mangas = await prisma.manga.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return { mangas };
};
