import type { PageServerLoad } from './$types';
import { prisma } from '$lib/prisma';

export const load: PageServerLoad = async () => {
  const mangaCount = await prisma.manga.count();
  const episodeCount = await prisma.episode.count();

  const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
  const onlineUserCount = await prisma.user.count({
    where: {
      lastActive: {
        gt: twoMinutesAgo
      }
    }
  });

  const nowThai = new Date().toISOString(); // เวลาปัจจุบันแบบ ISO string (UTC)

  return {
    mangaCount,
    episodeCount,
    onlineUserCount,
    nowThai
  };
};
