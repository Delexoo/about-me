/** Stripe Checkout custom fields — all supporter details collected on the Stripe payment page. */

const FIELD_NAME = "leaderboard_name";
const FIELD_NOTE = "supporter_note";
const FIELD_LINK = "profile_link";

/** Static fields shown under “Other information” on Stripe Checkout (max 3). */
export const CHECKOUT_CUSTOM_FIELDS = [
  {
    key: FIELD_NAME,
    label: {
      type: "custom",
      custom: "Name on leaderboard",
    },
    type: "text",
    optional: false,
    text: {
      maximum_length: 40,
      minimum_length: 1,
    },
  },
  {
    key: FIELD_NOTE,
    label: {
      type: "custom",
      custom: "Short message (optional)",
    },
    type: "text",
    optional: true,
    text: {
      maximum_length: 100,
    },
  },
  {
    key: FIELD_LINK,
    label: {
      type: "custom",
      custom: "Social or profile photo URL (optional)",
    },
    type: "text",
    optional: true,
    text: {
      maximum_length: 220,
    },
  },
];

export function isLikelyImageUrl(raw) {
  const value = String(raw || "").trim();
  if (!value) return false;
  try {
    const u = new URL(value);
    if (u.protocol !== "http:" && u.protocol !== "https:") return false;
    const path = u.pathname.toLowerCase();
    if (/\.(jpe?g|png|webp|gif)(\?|$)/i.test(path)) return true;
    const host = u.hostname.toLowerCase();
    return (
      host.includes("imgur") ||
      host.includes("cdn.discord") ||
      host.includes("raw.githubusercontent") ||
      host.includes("i.redd.it") ||
      host.includes("pbs.twimg.com")
    );
  } catch {
    return false;
  }
}

export function parseSocialUrl(raw) {
  const value = String(raw || "").trim().slice(0, 220);
  if (!value || isLikelyImageUrl(value)) return null;
  try {
    const u = new URL(value);
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
  } catch {
    return null;
  }
  return null;
}

function parseAvatarUrl(raw) {
  const value = String(raw || "").trim().slice(0, 220);
  if (!value || !isLikelyImageUrl(value)) return null;
  try {
    const u = new URL(value);
    if (u.protocol === "http:" || u.protocol === "https:") return u.toString();
  } catch {
    return null;
  }
  return null;
}

/** Read name, note, social URL, and avatar URL from Checkout Session custom fields. */
export function checkoutFieldsFromSession(session) {
  let displayName = "";
  let note = "";
  let linkRaw = "";

  for (const field of session?.custom_fields || []) {
    const value = (field?.text?.value || "").trim();
    if (field?.key === FIELD_NAME) displayName = value.slice(0, 40);
    if (field?.key === FIELD_NOTE) note = value.slice(0, 100);
    if (field?.key === FIELD_LINK) linkRaw = value.slice(0, 220);
    // Legacy key from earlier deploys
    if (field?.key === "social_url") linkRaw = value.slice(0, 220);
  }

  if (!displayName && session?.metadata?.display_name) {
    displayName = String(session.metadata.display_name).trim().slice(0, 40);
  }

  if (!displayName) displayName = "Supporter";

  return {
    displayName,
    note: note || null,
    socialUrl: parseSocialUrl(linkRaw),
    avatarUrl: parseAvatarUrl(linkRaw),
  };
}

/** @deprecated */
export function buildCheckoutCustomFields() {
  return CHECKOUT_CUSTOM_FIELDS;
}
