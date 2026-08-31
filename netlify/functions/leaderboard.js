import { handleOptions, json, supabaseAdmin } from "./_shared.js";

export async function handler(event) {
  const options = handleOptions(event);
  if (options) return options;

  if (event.httpMethod !== "GET") return json(405, { error: "method_not_allowed" });

  try {
    const params = event.queryStringParameters || {};
    const n = Number(params.limit || 10000);
    const limit = Number.isFinite(n) ? Math.max(1, Math.min(10000, Math.floor(n))) : 10000;

    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("supporters")
      .select("display_name,note,total_cents,social_url,avatar_url")
      .order("total_cents", { ascending: false })
      .limit(limit);

    if (error) {
      return json(500, { error: "db_error", detail: error.message, code: error.code });
    }
    return json(200, { rows: data || [] });
  } catch (e) {
    const msg = e?.message ? String(e.message) : "";
    if (msg.startsWith("Missing env var:")) {
      return json(500, { error: "missing_env", detail: msg });
    }
    return json(500, { error: "server_error", detail: msg || "unknown" });
  }
}
