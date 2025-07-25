import { prisma } from '$lib/prisma';
import { redirect } from '@sveltejs/kit';

export async function POST({ request }) {
  const form = await request.formData();
  const id = form.get('id')?.toString();
  if (id) await prisma.category.delete({ where: { id } });

  throw redirect(303, '/admin/categories');
}
