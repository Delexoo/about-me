/** Stripe Checkout custom fields + parsing for supporter name/note. */

export const CHECKOUT_CUSTOM_FIELDS = [
  {
    key: "leaderboard_name",
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
    key: "supporter_note",
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
];

export const CHECKOUT_CUSTOM_TEXT = {
  submit: {
    message: "After payment you can add an optional profile photo on our site.",
  },
};

/** Read name + note from Checkout Session custom fields (and metadata fallback). */
export function checkoutFieldsFromSession(session) {
  let displayName = "";
  let note = "";

  for (const field of session?.custom_fields || []) {
    const value = (field?.text?.value || "").trim();
    if (field?.key === "leaderboard_name") displayName = value.slice(0, 40);
    if (field?.key === "supporter_note") note = value.slice(0, 100);
  }

  if (!displayName && session?.metadata?.display_name) {
    displayName = String(session.metadata.display_name).trim().slice(0, 40);
  }

  if (!displayName) displayName = "Supporter";

  return {
    displayName,
    note: note || null,
  };
}
