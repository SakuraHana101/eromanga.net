import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
  const session = cookies.get('session');

  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  return new Response('OK');
};
