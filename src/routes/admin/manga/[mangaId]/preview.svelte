// src/routes/admin/manga/edit/[mangaId]/+page.server.ts

import type { Actions, PageServerLoad } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';

export const load: PageServerLoad = async ({ params, fetch, url }) => {
  const { mangaId } = params;

  try {
    const baseUrl = url.origin;
    const res = await fetch(`${baseUrl}/api/admin/get-manga/${mangaId}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`โหลดมังงะไม่สำเร็จ: ${res.status} - ${errorText}`);
      throw new Error(`ไม่สามารถโหลดข้อมูลมังงะได้: ${res.status}`);
    }

    const manga = await res.json();

    if (!manga || manga.error) {
      console.error('manga data for id:', mangaId, 'undefined or error:', manga?.error);
      throw new Error('ไม่พบมังงะนี้');
    }

    return {
      mangaId,
      manga,
    };
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลมังงะ:', err);
    throw new Error('ไม่สามารถโหลดข้อมูลมังงะได้');
  }
};

export const actions: Actions = {
  default: async ({ request, params }) => {
    const form = await request.formData();
    const title = form.get('title')?.toString() ?? '';
    const description = form.get('description')?.toString() ?? '';
    const coverUrl = form.get('coverUrl')?.toString() ?? '';
    const mangaId = params.mangaId;

    try {
      await prisma.manga.update({
        where: { id: mangaId },
        data: {
          title,
          description,
          coverUrl,
        },
      });

      // ✅ Redirect ไปหน้า: /admin/manga/[mangaId]
      throw redirect(303, `/admin/manga/${mangaId}`);
    } catch (error) {
      console.error('บันทึกข้อมูลมังงะไม่สำเร็จ:', error);
      return fail(500, { message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }
  },
};
