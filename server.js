import express from "express";
import { existsSync, readFileSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(__dirname, ".env"));
loadEnvFile(path.join(__dirname, "delexo.store", "essential variables.txt"));

const PORT = Number(process.env.PORT || 3000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml; charset=utf-8",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".mp3": "audio/mpeg",
};

function safePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0] || "/");
  const clean = decoded.replaceAll("\\", "/");
  const rel = clean.startsWith("/") ? clean.slice(1) : clean;
  const resolved = path.resolve(__dirname, rel || "index.html");
  if (!resolved.startsWith(__dirname)) return null;
  return resolved;
}

function mustEnv(name) {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

function stripeServer() {
  const key = mustEnv("STRIPE_SECRET_KEY");
  // sk_* = secret key, rk_* = restricted key (must allow Checkout Sessions + Prices)
  if (!/^(sk|rk)_(test|live)_/.test(key)) {
    throw new Error(
      "STRIPE_SECRET_KEY must be an sk_test_/sk_live_ or rk_test_/rk_live_ key from Stripe Dashboard → Developers → API keys"
    );
  }
  return new Stripe(key, { apiVersion: "2024-06-20" });
}

function supabaseAdmin() {
  return createClient(mustEnv("SUPABASE_URL"), mustEnv("SUPABASE_SERVICE_ROLE_KEY"), {
    auth: { persistSession: false },
  });
}

const app = express();

// Baseline security headers (public API + static)
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
});

// CORS — always allow localhost previews; honor CORS_ORIGIN list or *
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowList = (process.env.CORS_ORIGIN || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const allowAll = allowList.length === 0 || allowList.includes("*");
  const isLocalPreview =
    origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);

  if (origin && (allowAll || isLocalPreview || allowList.includes(origin))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  } else if (allowAll) {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Stripe-Signature");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

// Root (quick sanity check)
app.get("/", (_req, res) => res.type("text").send("support-leaderboard-backend: ok"));

// Health check
app.get("/health", (_req, res) => res.json({ ok: true }));

// Leaderboard API (used by index.html)
app.get("/leaderboard", async (req, res) => {
  try {
    const n = Number(req.query?.limit || 10000);
    const limit = Number.isFinite(n) ? Math.max(1, Math.min(10000, Math.floor(n))) : 10000;
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("supporters")
      .select("display_name,note,total_cents,social_url")
      .order("total_cents", { ascending: false })
      .limit(limit);
    if (error) return res.status(500).json({ error: "db_error", detail: error.message, code: error.code });
    res.json({ rows: data || [] });
  } catch (_e) {
    res.status(500).json({ error: "server_error" });
  }
});

async function createCheckoutSession(displayName) {
  const stripe = stripeServer();
  const siteUrl = mustEnv("SITE_URL");
  const priceId = mustEnv("PRICE_ID");
  const name =
    typeof displayName === "string" ? displayName.slice(0, 40) : "";

  try {
    await stripe.prices.retrieve(priceId);
  } catch (e) {
    const msg = e?.message ? String(e.message) : "invalid_price";
    const code = e?.code ? String(e.code) : undefined;
    const err = new Error(msg);
    err.code = code;
    err.name = "StripePriceError";
    throw err;
  }

  return stripe.checkout.sessions.create({
    mode: "payment",
    customer_creation: "always",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/?thanks=1&session_id={CHECKOUT_SESSION_ID}#supporters`,
    cancel_url: `${siteUrl}/#supporters`,
    metadata: { display_name: name },
  });
}

function checkoutErrorResponse(res, e, redirect) {
  console.error("create-checkout-session error:", e);
  const msg = e && e.message ? String(e.message) : "";
  if (redirect) {
    const siteUrl = process.env.SITE_URL?.trim() || "/";
    res.redirect(303, `${siteUrl}/#supporters`);
    return;
  }
  if (msg.startsWith("Missing env var:")) {
    res.status(500).json({ error: "missing_env", detail: msg });
    return;
  }
  if (e?.name === "StripePriceError") {
    res.status(500).json({
      error: "stripe_price_error",
      detail: msg,
      code: e.code,
      hint: "Most common cause: STRIPE_SECRET_KEY mode (test/live) doesn't match PRICE_ID.",
    });
    return;
  }
  const code = e?.code ? String(e.code) : undefined;
  res.status(500).json({ error: "server_error", detail: msg || "unknown", code });
}

// Browser-friendly donate URL → 303 redirect to Stripe (no CORS, no JSON page)
app.get("/donate", async (req, res) => {
  const displayName =
    typeof req.query.display_name === "string" ? req.query.display_name : "";
  try {
    const session = await createCheckoutSession(displayName);
    res.redirect(303, session.url);
  } catch (e) {
    checkoutErrorResponse(res, e, true);
  }
});

// Stripe checkout — GET ?redirect=1 avoids CORS (Live Server / cross-origin previews)
app.get("/create-checkout-session", async (req, res) => {
  const redirect = req.query.redirect === "1" || req.query.redirect === "true";
  const displayName =
    typeof req.query.display_name === "string" ? req.query.display_name : "";
  try {
    const session = await createCheckoutSession(displayName);
    if (redirect) return res.redirect(303, session.url);
    res.json({ url: session.url });
  } catch (e) {
    checkoutErrorResponse(res, e, redirect);
  }
});

app.post(
  "/create-checkout-session",
  express.json(),
  express.urlencoded({ extended: false }),
  async (req, res) => {
  const displayName =
    typeof req.body?.display_name === "string" ? req.body.display_name : "";
  const wantsRedirect =
    req.query.redirect === "1" ||
    req.query.redirect === "true" ||
    req.body?.redirect === "1" ||
    req.body?.redirect === "true" ||
    req.body?.redirect === true;
  try {
    const session = await createCheckoutSession(displayName);
    if (wantsRedirect) return res.redirect(303, session.url);
    res.json({ url: session.url });
  } catch (e) {
    checkoutErrorResponse(res, e, wantsRedirect);
  }
});

// Save note (after payment)
app.post("/save-note", express.json(), async (req, res) => {
  try {
    const sessionId = typeof req.body?.session_id === "string" ? req.body.session_id : "";
    const displayName = typeof req.body?.display_name === "string" ? req.body.display_name.trim().slice(0, 40) : "";
    const note = typeof req.body?.note === "string" ? req.body.note.trim().slice(0, 100) : "";
    const socialUrlRaw = typeof req.body?.social_url === "string" ? req.body.social_url.trim().slice(0, 220) : "";
    if (!sessionId || !displayName) return res.status(400).json({ error: "missing_fields" });

    const stripe = stripeServer();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") return res.status(403).json({ error: "not_paid" });

    const email = session.customer_details?.email || session.customer_email;
    if (!email) return res.status(400).json({ error: "missing_email" });

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
      .upsert({ email, display_name: displayName, note: note || null, social_url }, { onConflict: "email" })
      .select("display_name,note,total_cents,social_url")
      .single();

    if (error) return res.status(500).json({ error: "db_error", detail: error.message, code: error.code });
    res.json({ supporter: data });
  } catch (e) {
    console.error("save-note error:", e);
    const msg = e?.message ? String(e.message) : "";
    if (msg.startsWith("Missing env var:")) {
      res.status(500).json({ error: "missing_env", detail: msg });
      return;
    }
    res.status(500).json({ error: "server_error", detail: msg || "unknown" });
  }
});

// Prefill supporter data by session_id (same email => can edit/update note/name)
app.get("/supporter", async (req, res) => {
  try {
    const sessionId = typeof req.query?.session_id === "string" ? req.query.session_id : "";
    if (!sessionId) return res.status(400).json({ error: "missing_fields" });

    const stripe = stripeServer();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || session.payment_status !== "paid") return res.status(403).json({ error: "not_paid" });

    const email = session.customer_details?.email || session.customer_email;
    if (!email) return res.status(400).json({ error: "missing_email" });

    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("supporters")
      .select("display_name,note,social_url,total_cents")
      .eq("email", email)
      .maybeSingle();

    if (error) return res.status(500).json({ error: "db_error", detail: error.message, code: error.code });
    res.json({ supporter: data || null });
  } catch (e) {
    console.error("supporter prefill error:", e);
    const msg = e?.message ? String(e.message) : "";
    res.status(500).json({ error: "server_error", detail: msg || "unknown" });
  }
});

// Stripe webhook (Render endpoint you mentioned)
app.post("/stripe-webhook", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const stripe = stripeServer();
    const whsec = mustEnv("STRIPE_WEBHOOK_SECRET");
    const sig = req.headers["stripe-signature"];
    if (!sig) return res.status(400).send("missing signature");

    let evt;
    try {
      evt = stripe.webhooks.constructEvent(req.body, sig, whsec);
    } catch (_e) {
      return res.status(400).send("bad signature");
    }

    if (evt.type !== "checkout.session.completed") return res.json({ received: true });
    const session = evt.data.object;
    if (!session || session.payment_status !== "paid") return res.json({ received: true });

    const email = session.customer_details?.email || session.customer_email;
    const amountTotal = Number(session.amount_total || 0);
    const paymentIntentId = session.payment_intent;
    if (!email || !paymentIntentId || !Number.isFinite(amountTotal)) return res.json({ received: true });

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

    if (supErr || !supporter) return res.json({ received: true });

    const { error: donErr } = await sb.from("donations").insert({
      supporter_id: supporter.id,
      amount_cents: amountTotal,
      stripe_payment_intent_id: paymentIntentId,
    });

    // Unique violation means already processed; don't double-add.
    if (donErr) return res.json({ received: true });

    await sb
      .from("supporters")
      .update({
        total_cents: (supporter.total_cents || 0) + amountTotal,
        updated_at: new Date().toISOString(),
      })
      .eq("id", supporter.id);

    res.json({ received: true });
  } catch (_e) {
    res.status(500).json({ error: "server_error" });
  }
});

// Final handler (no invalid "*" route in Express 5)
// On Render you typically only need the API routes above.
// If you run this locally and want it to serve the site, set SERVE_STATIC=1.
app.use(async (req, res) => {
  if (process.env.SERVE_STATIC !== "1") {
    res.status(404).type("text").send("Not found");
    return;
  }
  try {
    let filePath = safePath(req.path);
    if (!filePath) return res.status(403).send("Forbidden");

    try {
      const s = await stat(filePath);
      if (s.isDirectory()) filePath = path.join(filePath, "index.html");
    } catch (_) {}

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME[ext] || "application/octet-stream";
    const data = await readFile(filePath);
    res.setHeader("Content-Type", contentType);
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(data);
  } catch (_e) {
    res.status(404).type("text").send("Not found");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

