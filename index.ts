export interface Env {
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const sql = 'SELECT * FROM User LIMIT 10';
    const users = await env.DB.prepare(sql).all();

    return new Response(JSON.stringify(users.results), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
