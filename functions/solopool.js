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

    const hashrate  = getText(/Hashrate[^<]*<\/[^>]*>\s*<[^>]*>\s*([\d.,]+\s*[A-Za-z/]+)/i);
    const shares    = getText(/Shares[^<]*<\/[^>]*>\s*<[^>]*>\s*([\d.,]+)/i);
    const lastShare = getText(/Last\s*Share[^<]*<\/[^>]*>\s*<[^>]*>\s*([^<]+)/i);
    const unpaid    = getText(/Unpaid\s*Balance[^<]*<\/[^>]*>\s*<[^>]*>\s*([\d.,]+\s*[A-Za-z]+)/i);
    const totalPaid = getText(/Total\s*Paid[^<]*<\/[^>]*>\s*<[^>]*>\s*([\d.,]+\s*[A-Za-z]+)/i);
    const minPayout = getText(/Min\s*Payout[^<]*<\/[^>]*>\s*<[^>]*>\s*([\d.,]+\s*[A-Za-z]+)/i);

    // Try to extract "Blocks (24h)" or "Blocks last 24 hours" text
    const blocks24 = getText(/Blocks[^<]*?(?:Last|in Last|last)?\s*24\s*Hours[^<]*<\/[^>]*>\s*<[^>]*>\s*([\d,]+)/i)
                    || getText(/Blocks[^<]*?<[^>]*>\s*([\d,]+)\s*<span[^>]*>\s*last 24/i)
                    || getText(/Blocks[^<]*<[^>]*>\s*([\d,]+)\s*<\/[^>]*>\s*last\s*24\s*hours/i)
                    || null;

    // Try to pull a numeric series from inline JS that might power the hashrate graph
    let series = null;
    const seriesRegexes = [
      /chartData\s*=\s*(\[[^\]]+\])/i,
      /data\s*:\s*\[([^\]]+)\]/i,
      /labels\s*:\s*\[[^\]]+\][\s\S]*?datasets\s*:\s*\[\s*\{[^\}]*data\s*:\s*(\[[^\]]+\])/i
    ];
    for (const re of seriesRegexes) {
      const m = html.match(re);
      if (m && m[1]) {
        try {
          // normalize numbers: strip non-number chars except . and , and convert to floats
          const list = m[1].replace(/\s+/g, '').replace(/,/g, ' ').replace(/\s+/g, ',');
          const arr = JSON.parse(m[1].replace(/([\d.]+)\s*%/g, '"$1"').replace(/'/g, '"'));
          // If parsed array contains objects, try to map to numeric values
          if (Array.isArray(arr)) {
            series = arr.map(v => {
              if (typeof v === 'number') return Number(v);
              if (typeof v === 'string') return Number(v.replace(/,/g, '')) || null;
              if (v && typeof v === 'object') {
                // try common keys
                return Number(v.y || v.value || v[0]) || null;
              }
              return null;
            }).filter(x => x !== null);
            if (series.length) break;
          }
        } catch (e) {
          // ignore parse errors and continue
        }
      }
    }

    const data = { hashrate, shares, lastShare, unpaid, totalPaid, minPayout, blocks24, series };

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
