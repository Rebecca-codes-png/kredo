const templates = {
  transfer_confirm: {
    required: ["amount", "name"],
    english: "Enter your PIN to confirm sending ₦{amount} to {name}.",
    pidgin: "Put your PIN to confirm say you wan send ₦{amount} give {name}.",
    yoruba: "Tẹ PIN rẹ láti jẹ́rìí fífi ₦{amount} ránṣẹ́ sí {name}.",
  },
  transfer_success: {
    required: ["amount", "name"],
    english:
      "✅ Transfer successful! You sent ₦{amount} to {name}.\nReference: {reference}",
    pidgin:
      "✅ Transfer don successful! You don send ₦{amount} give {name}.\nReference: {reference}",
    yoruba:
      "✅ Gbigbe owó ṣe àṣeyọrí! O fi ₦{amount} ránṣẹ́ sí {name}.\nReference: {reference}",
  },
  insufficient_funds: {
    required: ["amount", "name"],
    english: "You don't have enough funds to send ₦{amount} to {name}.",
    pidgin: "Your money no reach to send ₦{amount} give {name}.",
    yoruba: "Owó rẹ kò tó láti fi ₦{amount} ránṣẹ́ sí {name}.",
  },
  not_understood: {
    english:
      "I didn't quite understand that. You can ask for your balance or tell me to send money.",
    pidgin:
      "I no too understand wetin you talk. You fit ask for your balance or tell me make I send money.",
    yoruba:
      "Mi ò lóye ohun tí o sọ dáadáa. O lè béèrè fún ìwọ̀ntúnwọ̀nsì àkọọ́lẹ̀ rẹ tàbí kí o sọ fún mi pé kí n fi owó ránṣẹ́.",
  },
  generic_error: {
    english: "Something went wrong. Please try again.",
    pidgin: "Something don go wrong. Abeg try again.",
    yoruba: "Àṣìṣe kan ṣẹlẹ̀. Jọ̀wọ́ tún gbìyànjú.",
  },
  invalid_amount: {
    english: "That transfer amount is invalid. Please check it and try again.",
    pidgin: "That amount no correct. Abeg check am and try again.",
    yoruba: "Iye owó yẹn kò tọ́. Jọ̀wọ́ ṣàyẹ̀wò rẹ kí o sì tún gbìyànjú.",
  },
  wrong_pin: {
    english: "Incorrect PIN. Please try again.",
    pidgin: "PIN no correct. Abeg try again.",
    yoruba: "PIN kò tọ́. Jọ̀wọ́ tún gbìyànjú.",
  },
  recipient_not_found: {
    required: ["name"],
    english:
      "I couldn't find an account for {name}. Please check the recipient details.",
    pidgin:
      "I no fit find account for {name}. Abeg check the recipient details.",
    yoruba:
      "Mi ò rí àkọọ́lẹ̀ fún {name}. Jọ̀wọ́ ṣàyẹ̀wò àlàyé ẹni tí yóò gbà owó náà.",
  },
  transfer_cancelled: {
    english: "Transaction cancelled. No money was sent.",
    pidgin: "Transaction don cancel. No money comot.",
    yoruba: "A fagilé ìṣòwò náà. A kò fi owó ránṣẹ́.",
  },
};

// Resolved templates are cached by template key and language; interpolation
// happens after lookup so each user's amount/name stays fresh.
const templateCache = new Map();

function renderReply(
  templateKey,
  { lang = "english", amount, name, reference = "" } = {},
) {
  const template = templates[templateKey];
  if (!template) return templates.generic_error.english;

  const hasValidAmount = Number.isFinite(Number(amount)) && Number(amount) > 0;
  const hasValidName = typeof name === "string" && name.trim().length > 0;
  const valuesAreSafe = (template.required || []).every((key) =>
    key === "amount" ? hasValidAmount : key === "name" ? hasValidName : false,
  );
  const locale = valuesAreSafe ? lang : "english";
  const selectedLocale = template[locale] ? locale : "english";
  const cacheKey = `${templateKey}:${selectedLocale}`;

  let localizedTemplate = templateCache.get(cacheKey);
  if (!localizedTemplate) {
    localizedTemplate = template[selectedLocale] || template.english;
    templateCache.set(cacheKey, localizedTemplate);
  }

  return localizedTemplate
    .replaceAll(
      "{amount}",
      hasValidAmount
        ? Number(amount).toLocaleString("en-NG")
        : "the requested amount",
    )
    .replaceAll("{name}", hasValidName ? name.trim() : "the recipient")
    .replaceAll("{reference}", String(reference));
}

/** Send a known demo reply, or return its rendered text when ctx is null. */
export function safeReply(ctx, templateKey, options = {}) {
  const text = renderReply(templateKey, options);
  return ctx ? ctx.reply(text) : text;
}

export default safeReply;
