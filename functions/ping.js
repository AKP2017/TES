export const onRequestGet = async () => {
  return new Response(JSON.stringify({ ok: true, now: new Date().toISOString() }), {
    status: 200,
    headers: { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' }
  });
};
