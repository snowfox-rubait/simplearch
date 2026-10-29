interface Env {
  SIMPLEARCH_KV?: {
    get: (key: string) => Promise<string | null>;
  };
}

export const onRequestGet = async (context: {
  params: { id: string };
  env: Env;
}) => {
  const { params, env } = context;
  const id = params.id;

  let script: string | null = null;
  if (env.SIMPLEARCH_KV) {
    script = await env.SIMPLEARCH_KV.get(id);
  }

  if (!script) {
    const errorBash = `#!/usr/bin/env bash
echo -e "\\033[0;31m[SimpleArch] Error: Installation script '${id}' not found or has expired.\\033[0m"
echo "Quick installation links expire after 24 hours."
echo "Please re-generate your custom setup script at: https://simplearch.snowfox.live"
exit 1
`;
    return new Response(errorBash, {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }

  return new Response(script, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="simplearch-install-${id}.sh"`,
      "Cache-Control": "public, max-age=3600"
    }
  });
};
