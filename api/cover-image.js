// Cover image resolver: scrapes OpenGraph / Twitter cover image from any URL
// and converts to base64 Data URI to prevent CORS canvas tainting

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  'Twitterbot/1.0',
];

async function fetchImageAsDataUri(imageUrl, referer = '') {
  try {
    const res = await fetch(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        ...(referer ? { Referer: referer } : {}),
      },
    });
    if (!res.ok) return null;
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) return null;

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength < 200) return null; // Avoid broken/empty pixels

    const base64 = Buffer.from(buffer).toString('base64');
    return {
      dataUri: `data:${contentType};base64,${base64}`,
      sourceUrl: imageUrl,
    };
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let targetUrl = (req.query?.url || '').trim();
  if (!targetUrl) {
    return res.status(400).json({ success: false, error: 'URL parameter required' });
  }

  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  let parsedTarget;
  try {
    parsedTarget = new URL(targetUrl);
  } catch {
    return res.status(400).json({ success: false, error: 'Invalid URL provided' });
  }

  for (const ua of USER_AGENTS) {
    try {
      const pageRes = await fetch(parsedTarget.href, {
        headers: {
          'User-Agent': ua,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        redirect: 'follow',
      });

      if (!pageRes.ok) continue;

      const html = await pageRes.text();

      // Extract image tags: og:image, og:image:secure_url, twitter:image, image_src
      const patterns = [
        /<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i,
        /<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
        /<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i,
        /<meta[^>]+property=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i,
        /<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i,
      ];

      let rawImageUrl = null;
      for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match && match[1]) {
          rawImageUrl = match[1].replace(/&amp;/g, '&').trim();
          break;
        }
      }

      if (rawImageUrl) {
        // Resolve relative URLs to absolute
        const absoluteImageUrl = new URL(rawImageUrl, parsedTarget.href).href;
        const imgResult = await fetchImageAsDataUri(absoluteImageUrl, parsedTarget.href);
        if (imgResult) {
          return res.status(200).json({
            success: true,
            url: parsedTarget.href,
            ...imgResult,
          });
        }
      }
    } catch {
      // Try next User Agent
    }
  }

  return res.status(404).json({
    success: false,
    error: 'No cover image found for this website',
  });
}
