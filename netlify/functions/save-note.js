import { handleOptions, json, stripeServer, supabaseAdmin } from "./_shared.js";

export async function handler(event) {
  const options = handleOptions(event);
  if (options) return options;

  if (event.httpMethod !== "POST") return json(405, { error: "method_not_allowed" });

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const sessionId = typeof body.session_id === "string" ? body.session_id : "";
    const displayName =
      typeof body.display_name === "string" ? body.display_name.trim().slice(0, 40) : "";
    const note = typeof body.note === "string" ? body.note.trim().slice(0, 100) : "";
    const socialUrlRaw =
      typeof body.social_url === "string" ? body.social_url.trim().slice(0, 220) : "";
    if (!sessionId || !displayName) return json(400, { error: "missing_fields" });

    const stripe = stripeServer();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") return json(403, { error: "not_paid" });

    const email = session.customer_details?.email || session.customer_email;
    if (!email) return json(400, { error: "missing_email" });

    let social_url = null;
    if (socialUrlRaw) {
      try {
        const u = new URL(socialUrlRaw);
        if (u.protocol === "http:" || u.protocol === "https:") social_url = u.toString();
      } catch {
        social_url = null;
      }
    }

    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("supporters")
      .upsert(
        { email, display_name: displayName, note: note || null, social_url },
        { onConflict: "email" }
      )
      .select("display_name,note,total_cents,social_url")
      .single();

    if (error) {
      return json(500, { error: "db_error", detail: error.message, code: error.code });
    }
    return json(200, { supporter: data });
  } catch (e) {
    const msg = e?.message ? String(e.message) : "";
    if (msg.startsWith("Missing env var:")) {
      return json(500, { error: "missing_env", detail: msg });
    }
    return json(500, { error: "server_error", detail: msg || "unknown" });
  }
}
