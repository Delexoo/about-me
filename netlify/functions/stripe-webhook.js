import { handleOptions, json, mustEnv, stripeServer, supabaseAdmin } from "./_shared.js";

function rawBody(event) {
  return event.isBase64Encoded
    ? Buffer.from(event.body || "", "base64")
    : Buffer.from(event.body || "", "utf8");
}

export async function handler(event) {
  const options = handleOptions(event);
  if (options) return options;

  if (event.httpMethod !== "POST") return json(405, { error: "method_not_allowed" });

  try {
    const stripe = stripeServer();
    const whsec = mustEnv("STRIPE_WEBHOOK_SECRET");
    const sig = event.headers["stripe-signature"] || event.headers["Stripe-Signature"];
    if (!sig) return json(400, { error: "missing_signature" });

    let evt;
    try {
      evt = stripe.webhooks.constructEvent(rawBody(event), sig, whsec);
    } catch (_e) {
      return json(400, { error: "bad_signature" });
    }

    if (evt.type !== "checkout.session.completed") {
      return json(200, { received: true });
    }

    const session = evt.data.object;
    if (!session || session.payment_status !== "paid") return json(200, { received: true });

    const email = session.customer_details?.email || session.customer_email;
    const amountTotal = Number(session.amount_total || 0);
    const paymentIntentId = session.payment_intent;
    if (!email || !paymentIntentId || !Number.isFinite(amountTotal)) {
      return json(200, { received: true });
    }

    const sb = supabaseAdmin();

    const { data: supporter, error: supErr } = await sb
      .from("supporters")
      .upsert(
        {
          email,
          display_name: (session.metadata?.display_name || "Supporter").slice(0, 40),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      )
      .select("id,total_cents")
      .single();

    if (supErr || !supporter) return json(200, { received: true });

    const { error: donErr } = await sb.from("donations").insert({
      supporter_id: supporter.id,
      amount_cents: amountTotal,
      stripe_payment_intent_id: paymentIntentId,
    });

    if (donErr) return json(200, { received: true });

    await sb
      .from("supporters")
      .update({
        total_cents: (supporter.total_cents || 0) + amountTotal,
        updated_at: new Date().toISOString(),
      })
      .eq("id", supporter.id);

    return json(200, { received: true });
  } catch (_e) {
    return json(500, { error: "server_error" });
  }
}
