// Cover image resolver: scrapes OpenGraph / Twitter cover image from any URL
// and converts to base64 Data URI to prevent CORS canvas tainting

const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
  'Twitterbot/1.0',
];

const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8MB limit to protect serverless memory

// SSRF Protection: block private IPs, cloud metadata, and loopback addresses
function isSafeUrl(urlObj) {
  if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
    return false;
  }

  const hostname = urlObj.hostname.toLowerCase();

  // Block localhost and internal names
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname === '::1' ||
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.localhost')
  ) {
    return false;
  }

  // Block cloud metadata IPs (AWS/GCP/Azure)
  if (hostname === '169.254.169.254' || hostname === 'metadata.google.internal') {
    return false;
  }

  // Block RFC 1918 IPv4 private networks & link-local
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = hostname.match(ipv4Regex);
  if (match) {
    const a = Number(match[1]);
    const b = Number(match[2]);
    if (a === 10) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 169 && b === 254) return false;
    if (a === 127 || a === 0) return false;
  }

  // Block IPv6 loopback / unique local / link-local
  if (
    hostname.startsWith('[fc') ||
    hostname.startsWith('[fd') ||
    hostname.startsWith('[fe80') ||
    hostname === '[::1]'
  ) {
    return false;
  }

  return true;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 4500) {
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
    const imgUrlObj = new URL(imageUrl);
    if (!isSafeUrl(imgUrlObj)) return null;

    const res = await fetchWithTimeout(imageUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        ...(referer ? { Referer: referer } : {}),
      },
    }, 4500);

    if (!res || !res.ok) return null;
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    if (!contentType.startsWith('image/')) return null;

    const contentLength = parseInt(res.headers.get('content-length') || '0', 10);
    if (contentLength > MAX_IMAGE_SIZE) return null;

    const buffer = await res.arrayBuffer();
    if (buffer.byteLength < 200 || buffer.byteLength > MAX_IMAGE_SIZE) return null;

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
    const parsedReqUrl = new URL(req.url || '', `https://${host}`);
    const query = req.query || {};

    let targetUrl = (query.url || parsedReqUrl.searchParams.get('url') || '').trim();
    if (!targetUrl) {
      return send(400, { success: false, error: 'URL parameter required' });
    }

    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    let parsedTarget;
    try {
      parsedTarget = new URL(targetUrl);
    } catch {
      return send(400, { success: false, error: 'Invalid URL provided' });
    }

    // SSRF Check: disallow private IP spaces and metadata services
    if (!isSafeUrl(parsedTarget)) {
      return send(403, { success: false, error: 'Target URL is not permitted' });
    }

    for (const ua of USER_AGENTS) {
      try {
        const pageRes = await fetchWithTimeout(parsedTarget.href, {
          headers: {
            'User-Agent': ua,
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          redirect: 'follow',
        }, 4000);

        if (!pageRes || !pageRes.ok) continue;

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
            return send(200, {
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

    return send(404, {
      success: false,
      error: 'No cover image found for this website',
    });
  } catch (err) {
    return send(500, {
      success: false,
      error: err.message || 'Server error resolving cover image',
    });
  }
}
