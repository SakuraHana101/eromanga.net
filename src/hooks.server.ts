import type { Handle } from '@sveltejs/kit';
import { prisma } from '$lib/prisma';

export const handle: Handle = async ({ event, resolve }) => {
  const session = event.cookies.get('session');

  if (session) {
    const user = await prisma.user.findUnique({ where: { id: session } });
    event.locals.user = user
      ? { id: user.id, username: user.username, role: user.role, isActive: user.isActive }
      : null;
  } else {
    event.locals.user = null;
  }

  return resolve(event);
};
