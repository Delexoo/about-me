/** Stripe Checkout custom fields — all supporter details collected on the Stripe payment page. */

const FIELD_NAME = "leaderboard_name";
const FIELD_SOCIAL = "social_profile";
const FIELD_PHOTO = "profile_photo_url";

/** Legacy keys from earlier deploys */
const LEGACY_FIELD_NOTE = "supporter_note";
const LEGACY_FIELD_LINK = "profile_link";

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
    key: FIELD_SOCIAL,
    label: {
      type: "custom",
      custom: "Social profile URL (optional)",
    },
    type: "text",
    optional: true,
    text: {
      maximum_length: 220,
    },
  },
  {
    key: FIELD_PHOTO,
    label: {
      type: "custom",
      custom: "Profile photo URL (optional)",
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
      host.includes("avatars.githubusercontent") ||
      host.includes("i.redd.it") ||
      host.includes("pbs.twimg.com")
    );
  } catch {
    return false;
  }
}

export function parseSocialUrl(raw) {
  const value = String(raw || "").trim().slice(0, 220);
  if (!value) return null;
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
  let socialRaw = "";
  let photoRaw = "";
  let legacyLinkRaw = "";

  for (const field of session?.custom_fields || []) {
    const value = (field?.text?.value || "").trim();
    if (field?.key === FIELD_NAME) displayName = value.slice(0, 40);
    if (field?.key === FIELD_SOCIAL || field?.key === "social_url") {
      socialRaw = value.slice(0, 220);
    }
    if (field?.key === FIELD_PHOTO || field?.key === "avatar_url") {
      photoRaw = value.slice(0, 220);
    }
    if (field?.key === LEGACY_FIELD_NOTE) note = value.slice(0, 100);
    if (field?.key === LEGACY_FIELD_LINK) legacyLinkRaw = value.slice(0, 220);
  }

  if (!displayName && session?.metadata?.display_name) {
    displayName = String(session.metadata.display_name).trim().slice(0, 40);
  }

  if (!displayName) displayName = "Supporter";

  const socialUrl =
    parseSocialUrl(socialRaw) ||
    (legacyLinkRaw && !isLikelyImageUrl(legacyLinkRaw) ? parseSocialUrl(legacyLinkRaw) : null);
  const avatarUrl =
    parseAvatarUrl(photoRaw) ||
    (legacyLinkRaw && isLikelyImageUrl(legacyLinkRaw) ? parseAvatarUrl(legacyLinkRaw) : null);

  return {
    displayName,
    note: note || null,
    socialUrl,
    avatarUrl,
  };
}

/** @deprecated */
export function buildCheckoutCustomFields() {
  return CHECKOUT_CUSTOM_FIELDS;
}
