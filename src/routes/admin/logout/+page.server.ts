import { redirect } from '@sveltejs/kit';

export const load = async ({ cookies }) => {
  cookies.delete('session');
  throw redirect(302, '/admin/login');
};
