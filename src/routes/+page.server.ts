import type { Redirect } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';

export function load() {
  // Redirect ทุกคนไปหน้า login
  throw redirect(307, '/admin/login');
}
