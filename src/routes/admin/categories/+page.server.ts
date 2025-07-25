// src/routes/admin/categories/+page.server.ts
import { prisma } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import slugify from 'slugify';

export async function load() {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return { categories };
}

export const actions = {
  create: async ({ request }) => {
    const form = await request.formData();
    const name = form.get('name')?.toString().trim();
    if (!name) return fail(400, { message: 'Name required' });

    const slug = slugify(name, { lower: true });

    await prisma.category.create({ data: { name, slug } });
    throw redirect(303, '/admin/categories');
  }
};
