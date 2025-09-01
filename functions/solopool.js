// functions/solopool.js
export const onRequestGet = async (context) => {
  const url = new URL(context.request.url);
  const address = url.searchParams.get('address');
  if (!address) {
    return new Response(JSON.stringify({ error: 'Missing address' }), { status: 400 });
  }

  const upstream = `https://bch.solopool.org/account/${encodeURIComponent(address)}`;

  try {
    const resp = await fetch(upstream, { headers: { 'User-Agent': 'ShibarooSiteProxy/1.0' }});
    if (!resp.ok) return new Response(JSON.stringify({ error:'Upstream error' }), { status: resp.status });

    const html = await resp.text();
    const getText = (re) => (html.match(re)?.[1] ?? null);

    const hashrate  = getText(/Hashrate[^<]*<\/[^>]*>\s*<[^>]*>\s*([\d.,]+\s*[A-Za-z/]+)</i);
    const shares    = getText(/Shares[^<]*<\/[^>]*>\s*<[^>]*>\s*([\d.,]+)</i);
    const lastShare = getText(/Last\s*Share[^<]*<\/[^>]*>\s*<[^>]*>\s*([^<]+)</i);
    const unpaid    = getText(/Unpaid\s*Balance[^<]*<\/[^>]*>\s*<[^>]*>\s*([\d.,]+\s*[A-Za-z]+)/i);
    const totalPaid = getText(/Total\s*Paid[^<]*<\/[^>]*>\s*<[^>]*>\s*([\d.,]+\s*[A-Za-z]+)/i);
    const minPayout = getText(/Min\s*Payout[^<]*<\/[^>]*>\s*<[^>]*>\s*([\d.,]+\s*[A-Za-z]+)/i);

    const data = { hashrate, shares, lastShare, unpaid, totalPaid, minPayout };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'content-type': 'application/json; charset=utf-8',
        'cache-control': 'no-store',
        'access-control-allow-origin': '*'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error:'Proxy failure', detail:String(err) }), { status: 502 });
  }
};
