// src/lib/server/bunny.ts
import { Client } from 'basic-ftp';
import { Readable } from 'stream';
import { Buffer } from 'buffer';

const BUNNY_HOST = `${process.env.BUNNY_STORAGE_REGION}.storage.bunnycdn.com`;
const BUNNY_USER = process.env.BUNNY_STORAGE_ZONE_NAME ?? '';
const BUNNY_PASS = process.env.BUNNY_FTP_PASSWORD ?? '';
const BUNNY_CDN_URL = `https://${BUNNY_USER}.b-cdn.net`;

/**
 * สร้าง FTP Client ที่เชื่อมต่อ Bunny.net
 */
async function createFtpClient() {
  const client = new Client();
  await client.access({
    host: BUNNY_HOST,
    user: BUNNY_USER,
    password: BUNNY_PASS,
    secure: true,
  });
  return client;
}

/**
 * ดึง URL ของไฟล์ทั้งหมดในโฟลเดอร์ที่กำหนด
 */
export async function listImagesInFolder(folderPath: string): Promise<string[]> {
  const ftp = await createFtpClient();
  try {
    const files = await ftp.list(folderPath);
    const urls = files
      .filter(file => file.type === '-') // type "-" = ไฟล์
      .map(file => `${BUNNY_CDN_URL}/${folderPath}/${file.name}`);
    return urls;
  } catch (err) {
    console.error('[Bunny FTP list error]', err);
    throw err;
  } finally {
    ftp.close();
  }
}

/**
 * อัปโหลดไฟล์เดียว (Buffer) ขึ้น Bunny
 */
export async function uploadToBunny(buffer: Buffer, remotePath: string) {
  const ftp = await createFtpClient();
  try {
    await ftp.uploadFrom(Readable.from(buffer), remotePath);
  } catch (err) {
    console.error('[Bunny FTP upload error]', err);
    throw err;
  } finally {
    ftp.close();
  }
}

/**
 * ลบโฟลเดอร์ (ใช้ด้วยความระวัง!)
 */
export async function deleteFolder(folderPath: string) {
  const ftp = await createFtpClient();
  try {
    await ftp.removeDir(folderPath);
  } catch (err) {
    console.error('[Bunny FTP delete error]', err);
    throw err;
  } finally {
    ftp.close();
  }
}
