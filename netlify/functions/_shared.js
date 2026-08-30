import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Stripe-Signature",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  };
}

export function mustEnv(name) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env var: ${name}`);
  return v;
}

export function supabaseAdmin() {
  const url = mustEnv("SUPABASE_URL");
  const key = mustEnv("SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}

export function stripeServer() {
  const key = mustEnv("STRIPE_SECRET_KEY");
  return new Stripe(key, {
    apiVersion: "2024-06-20",
  });
}

export function handleOptions(event) {
  if (event.httpMethod === "OPTIONS") {
    return json(204, {});
  }
  return null;
}
