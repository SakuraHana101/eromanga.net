// src/routes/admin/episodes/+page.server.ts
import { prisma } from '$lib/prisma';

export async function load() {
  const episodes = await prisma.episode.findMany({
    include: {
      manga: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return { episodes };
}
