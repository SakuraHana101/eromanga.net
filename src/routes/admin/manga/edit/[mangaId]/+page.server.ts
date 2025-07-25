import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch, url }) => {
  const { mangaId } = params;

  try {
    // สร้าง URL แบบ absolute สำหรับ fetch API
    const baseUrl = url.origin;

    // เรียก API ที่ดึงข้อมูลมังงะจาก R2 ผ่าน API ของเรา
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

    // คืนค่า mangaId และข้อมูลมังงะให้หน้าเพจใช้
    return {
      mangaId,
      manga,
    };
  } catch (err) {
    console.error('เกิดข้อผิดพลาดในการโหลดข้อมูลมังงะ:', err);
    throw new Error('ไม่สามารถโหลดข้อมูลมังงะได้');
  }
};
