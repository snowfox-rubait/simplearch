interface Env {
  SIMPLEARCH_KV?: {
    put: (key: string, value: string, options?: { expirationTtl?: number }) => Promise<void>;
    get: (key: string) => Promise<string | null>;
  };
}

// In-memory fallback for local dev when KV binding is not active
const memoryCache = new Map<string, { script: string; expiresAt: number }>();

function generateSlug(length = 5): string {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789"; // Removed ambiguous chars like l, 1, 0, o
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  try {
    const { request, env } = context;
    const body = await request.json() as { script?: string; manifest?: unknown };

    if (!body || typeof body.script !== "string" || body.script.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Missing or empty 'script' field." }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const script = body.script;
    const slug = generateSlug();
    const ttlSeconds = 86400; // 24 hours
    const expiresAt = Date.now() + ttlSeconds * 1000;

    if (env.SIMPLEARCH_KV) {
      await env.SIMPLEARCH_KV.put(slug, script, { expirationTtl: ttlSeconds });
    } else {
      // Fallback in local development
      memoryCache.set(slug, { script, expiresAt });
    }

    const host = request.headers.get("host") || "simplearch.snowfox.live";
    const proto = host.includes("localhost") || host.includes("127.0.0.1") ? "http" : "https";
    const installUrl = `${proto}://${host}/s/${slug}/install.sh`;

    return new Response(
      JSON.stringify({
        id: slug,
        url: installUrl,
        command: `curl -fsSL ${installUrl} | bash`,
        expiresAt,
        ttlHours: 24
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: "Internal server error: " + String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

export const onRequestOptions = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    }
  });
};
