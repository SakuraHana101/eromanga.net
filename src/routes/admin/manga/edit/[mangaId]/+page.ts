import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
  try {
    const res = await fetch(`/api/admin/get-manga/${params.mangaId}`);

    if (!res.ok) {
      console.error(`Failed to fetch manga, status: ${res.status}`);
      throw new Error('Failed to fetch manga');
    }

    const manga = await res.json();

    // ตรวจสอบข้อมูลก่อนส่งออก
    if (!manga || !manga.title) {
      console.error('ข้อมูลมังงะไม่สมบูรณ์:', manga);
      throw new Error('Incomplete manga data');
    }

    return {
      mangaId: params.mangaId,
      manga
    };
  } catch (error) {
    console.error('เกิดข้อผิดพลาดระหว่างโหลดมังงะ:', error);
    throw error;
  }
};
