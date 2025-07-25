// src/lib/server/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// ป้องกันสร้างหลาย client ใน dev
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['query'], // ลบถ้าไม่อยากเห็น log query
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
