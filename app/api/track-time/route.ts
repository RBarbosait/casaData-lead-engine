export async function POST(req: Request) {
  const body = await req.json()

  await fetch("https://casadata-api-production.up.railway.app/track-time", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  return Response.json({ ok: true })
}
