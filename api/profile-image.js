// Profile image resolver: fetches public avatar and converts to base64 Data URI
// Works in both Vercel Serverless Function and Vite dev server middleware

const BOT_USER_AGENTS = [
  'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  'Twitterbot/1.0',
  'WhatsApp/2.21.12.21 A',
];

const STANDARD_IMAGE_UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

async function fetchWithTimeout(url, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchImageAsDataUri(imageUrl, referer = '') {
  try {
    const res = await fetchWithTimeout(imageUrl, {
      headers: {
        'User-Agent': STANDARD_IMAGE_UA,
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        ...(referer ? { Referer: referer } : {}),
      },
    }, 4500);

    if (!res || !res.ok) return null;
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) return null;

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength < 200) return null; // Avoid empty/corrupt 1x1 pixels

    const base64 = Buffer.from(buffer).toString('base64');
    return {
      dataUri: `data:${contentType};base64,${base64}`,
      sourceUrl: imageUrl,
    };
  } catch {
    return null;
  }
}

async function scrapeOpenGraphImage(profilePageUrl) {
  for (const botUa of BOT_USER_AGENTS) {
    try {
      const res = await fetchWithTimeout(profilePageUrl, {
        headers: {
          'User-Agent': botUa,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      }, 3500);

      if (!res || !res.ok) continue;

      const html = await res.text();
      // Match og:image meta tag in either attribute order
      const match =
        html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
        html.match(/content=["']([^"']+)["']\s+property=["']og:image["']/i) ||
        html.match(/name=["']twitter:image["']\s+content=["']([^"']+)["']/i);

      if (match && match[1]) {
        const rawUrl = match[1].replace(/&amp;/g, '&');
        const imgResult = await fetchImageAsDataUri(rawUrl, profilePageUrl);
        if (imgResult) return imgResult;
      }
    } catch {
      // Try next user agent
    }
  }
  return null;
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    return res.end();
  }

  const send = (code, data) => {
    res.setHeader('Content-Type', 'application/json');
    if (typeof res.status === 'function') {
      res.status(code);
    } else {
      res.statusCode = code;
    }
    if (typeof res.json === 'function') {
      return res.json(data);
    } else {
      return res.end(JSON.stringify(data));
    }
  };

  try {
    const host = req.headers?.host || 'localhost';
    const parsedUrl = new URL(req.url || '', `https://${host}`);
    const query = req.query || {};

    const platform = (query.platform || parsedUrl.searchParams.get('platform') || 'instagram').toLowerCase();
    const rawUsername = query.username || parsedUrl.searchParams.get('username') || '';

    const cleanUser = rawUsername
      .replace(/^@/, '')
      .replace(/^https?:\/\/[^/]+\//, '')
      .trim();

    if (!cleanUser) {
      return send(400, { success: false, error: 'Username required' });
    }

    // 1. Direct platform resolvers (bypass 3rd party rate limits)
    if (platform === 'instagram') {
      const directOg = await scrapeOpenGraphImage(
        `https://www.instagram.com/${encodeURIComponent(cleanUser)}/`
      );
      if (directOg) {
        return send(200, {
          success: true,
          platform,
          username: cleanUser,
          ...directOg,
        });
      }
    } else if (platform === 'threads') {
      const directOg = await scrapeOpenGraphImage(
        `https://www.threads.net/@${encodeURIComponent(cleanUser)}`
      );
      if (directOg) {
        return send(200, {
          success: true,
          platform,
          username: cleanUser,
          ...directOg,
        });
      }
    } else if (platform === 'youtube') {
      const directOg = await scrapeOpenGraphImage(
        `https://www.youtube.com/@${encodeURIComponent(cleanUser)}`
      );
      if (directOg) {
        return send(200, {
          success: true,
          platform,
          username: cleanUser,
          ...directOg,
        });
      }
    } else if (platform === 'github') {
      const ghDirect = await fetchImageAsDataUri(
        `https://avatars.githubusercontent.com/${encodeURIComponent(cleanUser)}`
      );
      if (ghDirect) {
        return send(200, {
          success: true,
          platform,
          username: cleanUser,
          ...ghDirect,
        });
      }
    } else if (platform === 'telegram') {
      const tgDirect = await fetchImageAsDataUri(
        `https://t.me/i/userpic/320/${encodeURIComponent(cleanUser)}.jpg`
      );
      if (tgDirect) {
        return send(200, {
          success: true,
          platform,
          username: cleanUser,
          ...tgDirect,
        });
      }
    }

    // 2. Candidate fallbacks (unavatar and public CDNs)
    const candidateUrls = [];
    if (platform === 'github') {
      candidateUrls.push(`https://github.com/${cleanUser}.png`);
    } else if (platform === 'x' || platform === 'twitter') {
      candidateUrls.push(`https://unavatar.io/twitter/${cleanUser}`);
      candidateUrls.push(`https://unavatar.io/x/${cleanUser}`);
    } else if (platform === 'instagram') {
      candidateUrls.push(`https://unavatar.io/instagram/${cleanUser}`);
    } else if (platform === 'linkedin') {
      candidateUrls.push(`https://unavatar.io/linkedin/${cleanUser}`);
    } else if (platform === 'youtube') {
      candidateUrls.push(`https://unavatar.io/youtube/${cleanUser}`);
    } else if (platform === 'threads') {
      candidateUrls.push(`https://unavatar.io/threads/${cleanUser}`);
    } else if (platform === 'tiktok') {
      candidateUrls.push(`https://unavatar.io/tiktok/${cleanUser}`);
    } else if (platform === 'spotify') {
      candidateUrls.push(`https://unavatar.io/spotify/${cleanUser}`);
    }

    candidateUrls.push(`https://unavatar.io/${platform}/${cleanUser}`);

    for (const url of candidateUrls) {
      const result = await fetchImageAsDataUri(url);
      if (result) {
        return send(200, {
          success: true,
          platform,
          username: cleanUser,
          ...result,
        });
      }
    }

    return send(404, {
      success: false,
      error: 'Profile image not accessible for this handle',
    });
  } catch (err) {
    return send(500, {
      success: false,
      error: err.message || 'Server error resolving profile image',
    });
  }
}
