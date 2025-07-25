export interface Env {
  DB: D1Database;  // ต้องตรงกับ binding ใน wrangler.toml
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const sql = `SELECT * FROM User LIMIT 10`;  // เปลี่ยนเป็นชื่อตารางจริง เช่น User, Manga, Category

    try {
      const result = await env.DB.prepare(sql).all();
      const data = result.results; // ผลลัพธ์อยู่ใน results
      
      return new Response(JSON.stringify(data, null, 2), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (e: any) {
      return new Response(`Error: ${e.message}`, { status: 500 });
    }
  },
};
