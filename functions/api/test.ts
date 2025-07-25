export const onRequestGet: PagesFunction<Env> = async (context) => {
  const db = context.env.DB
  const result = await db.prepare("SELECT * FROM users").all()
  return new Response(JSON.stringify(result))
}
