import { handleOptions, json, stripeServer, supabaseAdmin } from "./_shared.js";

export async function handler(event) {
  const options = handleOptions(event);
  if (options) return options;

  if (event.httpMethod !== "GET") return json(405, { error: "method_not_allowed" });

  try {
    const params = event.queryStringParameters || {};
    const sessionId = typeof params.session_id === "string" ? params.session_id : "";
    if (!sessionId) return json(400, { error: "missing_fields" });

    const stripe = stripeServer();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") return json(403, { error: "not_paid" });

    const email = session.customer_details?.email || session.customer_email;
    if (!email) return json(400, { error: "missing_email" });

    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("supporters")
      .select("display_name,note,social_url,total_cents")
      .eq("email", email)
      .maybeSingle();

    if (error) {
      return json(500, { error: "db_error", detail: error.message, code: error.code });
    }
    return json(200, { supporter: data || null });
  } catch (e) {
    const msg = e?.message ? String(e.message) : "";
    return json(500, { error: "server_error", detail: msg || "unknown" });
  }
}
