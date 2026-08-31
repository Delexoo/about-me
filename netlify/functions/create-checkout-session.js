import { handleOptions, json, mustEnv, stripeServer } from "./_shared.js";
import { CHECKOUT_CUSTOM_FIELDS } from "../../lib/checkout-fields.js";

export async function handler(event) {
  const options = handleOptions(event);
  if (options) return options;

  if (event.httpMethod !== "POST") return json(405, { error: "method_not_allowed" });

  try {
    const stripe = stripeServer();
    const siteUrl = mustEnv("SITE_URL");
    const priceId = mustEnv("PRICE_ID");

    try {
      await stripe.prices.retrieve(priceId);
    } catch (e) {
      const msg = e?.message ? String(e.message) : "invalid_price";
      const code = e?.code ? String(e.code) : undefined;
      return json(500, {
        error: "stripe_price_error",
        detail: msg,
        code,
        hint: "STRIPE_SECRET_KEY mode (test/live) must match PRICE_ID.",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_creation: "always",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${siteUrl}/?donated=1#supporters`,
      cancel_url: `${siteUrl}/#supporters`,
      allow_promotion_codes: false,
      custom_fields: CHECKOUT_CUSTOM_FIELDS,
    });

    return json(200, { url: session.url });
  } catch (e) {
    const msg = e?.message ? String(e.message) : "";
    if (msg.startsWith("Missing env var:")) {
      return json(500, { error: "missing_env", detail: msg });
    }
    const code = e?.code ? String(e.code) : undefined;
    return json(500, { error: "server_error", detail: msg || "unknown", code });
  }
}
