import { Client } from 'basic-ftp';

const BUNNY_HOST = `${process.env.BUNNY_STORAGE_REGION}.storage.bunnycdn.com`;
const BUNNY_USER = process.env.BUNNY_STORAGE_ZONE_NAME ?? '';
const BUNNY_PASS = process.env.BUNNY_FTP_PASSWORD ?? '';

async function createFtpClient() {
  const ftp = new Client();
  await ftp.access({
    host: BUNNY_HOST,
    user: BUNNY_USER,
    password: BUNNY_PASS,
    secure: true,
  });
  return ftp;
}

/**
 * ดึงรายชื่อไฟล์ในโฟลเดอร์ที่ระบุ (คืนเป็น array ของชื่อไฟล์)
 * @param folderPath โฟลเดอร์บน FTP (เช่น manga/เรื่อง-ชื่อ)
 */
export async function listImagesInFolder(folderPath: string): Promise<string[]> {
  const ftp = await createFtpClient();
  try {
    const list = await ftp.list(folderPath);
    // กรองเฉพาะไฟล์ปกติ (type = '-')
    const fileNames = list
      .filter(item => item.type === '-')
      .map(item => item.name);
    return fileNames;
  } finally {
    ftp.close();
  }
}
