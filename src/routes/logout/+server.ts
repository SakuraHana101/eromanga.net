// src/routes/logout/+server.ts
import { redirect, type RequestHandler } from '@sveltejs/kit';
import { serialize } from 'cookie';

// รองรับ GET (สำหรับ <a href="/logout">)
export const GET: RequestHandler = () => {
  return new Response(null, {
    status: 303,
    headers: {
      location: '/admin/login',
      'Set-Cookie': serialize('session_id', '', {
        path: '/',
        expires: new Date(0)
      })
    }
  });
};

// รองรับ POST (สำหรับ <form method="POST">)
export const POST: RequestHandler = () => {
  return new Response(null, {
    status: 303,
    headers: {
      location: '/admin/login',
      'Set-Cookie': serialize('session_id', '', {
        path: '/',
        expires: new Date(0)
      })
    }
  });
};
