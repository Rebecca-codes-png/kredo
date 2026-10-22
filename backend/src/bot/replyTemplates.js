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
      "✅ Gbigbe owó ṣe àṣeyọrí! O fi ₦{amount} ránṣẹ́ sí {name}.\nÀtọ́kasí: {reference}",
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
      "Mi ò rí àkọọ́lẹ̀ fún {name}. Jọ̀wọ́ ṣàyẹ̀wò àlàyé ẹni tó máa gba owó náà.",
  },
  transfer_cancelled: {
    english: "Transaction cancelled. No money was sent.",
    pidgin: "Transaction don cancel. No money comot.",
    yoruba: "A fagilé ìṣòwò náà. A kò fi owó ránṣẹ́.",
  },
};

// Cache reusable templates by template and language, never by personalized output.
const templateCache = new Map();
const commonReplies = {
  "Please create an account first. Use /signup.": [
    "Abeg create account first. Use /signup.",
    "Jọ̀wọ́ kọ́kọ́ ṣí àkọọ́lẹ̀. Lo /signup.",
  ],
  "Please reply with text to continue.": [
    "Abeg reply with text make we continue.",
    "Jọ̀wọ́ dáhùn pẹ̀lú ọ̀rọ̀ kọ láti tẹ̀síwájú.",
  ],
  'Please reply with "yes" or "no".': [
    'Abeg reply "yes" or "no".',
    'Jọ̀wọ́ dáhùn "yes" tàbí "no".',
  ],
  "How much do you want to send?": [
    "How much you wan send?",
    "Owó mélòó ni o fẹ́ fi ránṣẹ́?",
  ],
  "Which bank or wallet are you sending from?": [
    "Which bank or wallet you dey send from?",
    "Ilé-ifowópamọ́ tàbí wallet wo lo fẹ́ fi ránṣẹ́?",
  ],
  "Which bank is the recipient receiving the money?": [
    "Which bank the person dey receive the money?",
    "Ilé-ifowópamọ́ wo ni ẹni náà yóò ti gba owó náà?",
  ],
  "What is the recipient's account number?": [
    "Wetin be the receiver account number?",
    "Kí ni nọ́mbà àkọọ́lẹ̀ ẹni tó máa gba owó náà?",
  ],
  "Please provide the missing transfer detail.": [
    "Abeg provide the transfer detail wey miss.",
    "Jọ̀wọ́ fún wa ní àlàyé gbigbe owó tó kù.",
  ],
  "Your account could not be found.": [
    "We no fit find your account.",
    "A kò rí àkọọ́lẹ̀ rẹ.",
  ],
  "Transfer amount is invalid.": [
    "The transfer amount no correct.",
    "Iye owó gbigbe náà kò tọ́.",
  ],
  "You can't transfer to the same account you're sending from.": [
    "You no fit send money go the same account wey you dey send from.",
    "O kò lè fi owó ránṣẹ́ sí àkọọ́lẹ̀ kan náà tí o ti ń lò láti fi ránṣẹ́.",
  ],
  "There is no pending transaction to cancel.": [
    "No transaction dey to cancel.",
    "Kò sí ìṣòwò tó ń dúró láti fagilé.",
  ],
  "You don't have any linked bank accounts yet. Use /add_account to add one first.":
    [
      "You never link any bank account. Use /add_account make you add one.",
      "O kò tíì so àkọọ́lẹ̀ banki kankan pọ̀. Lo /add_account láti fi kún un.",
    ],
  "You do not have any beneficiary saved yet. Use /add_beneficiary to add one.":
    [
      "You never save any beneficiary. Use /add_beneficiary to add one.",
      "O kò tíì fi ẹni tó máa ń gba owó pamọ́. Lo /add_beneficiary láti fi kún un.",
    ],
  "Okay, I no go save that beneficiary.": [
    "Okay, I no go save that beneficiary.",
    "Ó dáa, mi ò ní fi ẹni náà pamọ́.",
  ],
  "Your PIN must be exactly 4 digits. Try again.": [
    "Your PIN suppose get 4 digits exactly. Try again.",
    "PIN rẹ gbọ́dọ̀ jẹ́ nọ́mbà mẹ́rin gan-an. Tún gbìyànjú.",
  ],
  "Abeg send text, picture, or voice note.": [
    "Abeg send text, picture, or voice note.",
    "Jọ̀wọ́ fi ọ̀rọ̀ kọ, àwòrán, tàbí ohùn ránṣẹ́.",
  ],
};

const dynamicReplies = [
  [
    /^I don't have a (.+) account linked yet\. Use \/add_account first\.$/,
    (_m, bank, lang) =>
      lang === "pidgin"
        ? `You never link ${bank} account. Use /add_account first.`
        : `O kò tíì so àkọọ́lẹ̀ ${bank} pọ̀. Lo /add_account kọ́kọ́.`,
  ],
  [
    /^That's the same account you're sending from\. Pick a different one\.$/,
    (_m, lang) =>
      lang === "pidgin"
        ? "Na the same account you dey send from. Pick another one."
        : "Àkọọ́lẹ̀ kan náà ni o ti ń lò láti fi ránṣẹ́. Yan òmíràn.",
  ],
  [
    /^➡️ Next transfer from your message \((\d+) left\):$/,
    (_m, left, lang) =>
      lang === "pidgin"
        ? `➡️ Next transfer from your message (${left} remain):`
        : `➡️ Gbigbe owó tó kàn láti inú ìfiránṣẹ́ rẹ (${left} ló kù):`,
  ],
  [
    /^I couldn't find your (.+) account\.$/,
    (_m, bank, lang) =>
      lang === "pidgin"
        ? `I no fit find your ${bank} account.`
        : `Mi ò rí àkọọ́lẹ̀ ${bank} rẹ.`,
  ],
  [
    /^Too many wrong PIN attempts\. Try again in (\d+) minute\(s\)\.$/,
    (_m, mins, lang) =>
      lang === "pidgin"
        ? `You don enter wrong PIN plenty times. Try again in ${mins} minute(s).`
        : `O ti tẹ PIN tí kò tọ́ púpọ̀. Tún gbìyànjú lẹ́yìn ìṣẹ́jú ${mins}.`,
  ],
  [
    /^Too many wrong PIN attempts\. Transfers are locked for 15 minutes\.$/,
    (_m, lang) =>
      lang === "pidgin"
        ? "Wrong PIN don enter plenty times. Transfers lock for 15 minutes."
        : "O ti tẹ PIN tí kò tọ́ púpọ̀. A ti dí gbigbe owó fún ìṣẹ́jú 15.",
  ],
  [
    /^Incorrect PIN\. (\d+) attempt\(s\) left\.$/,
    (_m, count, lang) =>
      lang === "pidgin"
        ? `PIN no correct. You get ${count} try left.`
        : `PIN kò tọ́. O ní ìgbìyànjú ${count} tó kù.`,
  ],
  [
    /^I couldn't find a matching recipient account for (.+)\. Please confirm the recipient first\.$/,
    (_m, name, lang) =>
      lang === "pidgin"
        ? `I no fit find account for ${name}. Abeg confirm recipient first.`
        : `Mi ò rí àkọọ́lẹ̀ fún ${name}. Jọ̀wọ́ kọ́kọ́ jẹ́rìí ẹni tó máa gba owó náà.`,
  ],
  [
    /^Insufficient balance for this transfer from (.+)\. Current balance: ₦(.+)\.$/,
    (_m, bank, balance, lang) =>
      lang === "pidgin"
        ? `Your balance for ${bank} no reach. Current balance: ₦${balance}.`
        : `Ìwọ̀ntúnwọ̀nsì ${bank} rẹ kò tó. Ìwọ̀ntúnwọ̀nsì lọ́wọ́lọ́wọ́: ₦${balance}.`,
  ],
  [
    /^Insufficient balance for this transfer from (.+)\.$/,
    (_m, bank, lang) =>
      lang === "pidgin"
        ? `Your balance for ${bank} no reach for this transfer.`
        : `Ìwọ̀ntúnwọ̀nsì ${bank} rẹ kò tó fún gbigbe owó yìí.`,
  ],
  [
    /^💰 Your (.+) balance is ₦(.+)\.$/,
    (_m, bank, balance, lang) =>
      lang === "pidgin"
        ? `💰 Your ${bank} balance na ₦${balance}.`
        : `💰 Ìwọ̀ntúnwọ̀nsì ${bank} rẹ jẹ́ ₦${balance}.`,
  ],
  [
    /^Transfer session expired\. Please send your request again\.$/,
    (_m, lang) =>
      lang === "pidgin"
        ? "This transfer session don expire. Abeg send your request again."
        : "Àkókò ìbéèrè gbigbe owó ti kọjá. Jọ̀wọ́ tún fi ìbéèrè rẹ ránṣẹ́.",
  ],
  [
    /^Please send a valid amount, for example: (.+)$/,
    (_m, example, lang) =>
      lang === "pidgin"
        ? `Abeg send correct amount, like ${example}.`
        : `Jọ̀wọ́ fi iye owó tó tọ́ ránṣẹ́, àpẹẹrẹ: ${example}.`,
  ],
  [
    /^Did you mean (.+)\?$/,
    (_m, name, lang) =>
      lang === "pidgin" ? `You mean ${name}?` : `Ṣé ${name} lo ní lọ́kàn?`,
  ],
  [
    /^I found a saved beneficiary named "(.+)"\. Did you mean that\? Reply yes or no\.$/,
    (_m, name, lang) =>
      lang === "pidgin"
        ? `I find saved beneficiary wey dem name "${name}". Na am you mean? Reply yes or no.`
        : `Mo rí ẹni tó wà ní àkọọ́lẹ̀ rẹ tó ń jẹ́ "${name}". Ṣé òun lo ní lọ́kàn? Dáhùn yes tàbí no.`,
  ],
  [
    /^Okay\. Please send the recipient name again or choose the correct beneficiary\.$/,
    (_m, lang) =>
      lang === "pidgin"
        ? "Okay. Abeg send the recipient name again or choose correct beneficiary."
        : "Ó dáa. Jọ̀wọ́ tún fi orúkọ ẹni tó máa gba owó ránṣẹ́ tàbí yan ẹni tó tọ́.",
  ],
  [
    /^Please send a valid amount, for example: (.+)$/,
    (_m, example, lang) =>
      lang === "pidgin"
        ? `Abeg send correct amount, like ${example}.`
        : `Jọ̀wọ́ fi iye owó tó tọ́ ránṣẹ́, àpẹẹrẹ: ${example}.`,
  ],
  [
    /^Did you mean (.+)\?$/,
    (_m, name, lang) =>
      lang === "pidgin" ? `You mean ${name}?` : `Ṣé ${name} lo ní lọ́kàn?`,
  ],
  [
    /^I found a saved beneficiary named "(.+)"\. Did you mean that\? Reply yes or no\.$/,
    (_m, name, lang) =>
      lang === "pidgin"
        ? `I find saved beneficiary wey dem name "${name}". Na am you mean? Reply yes or no.`
        : `Mo rí ẹni tó wà ní àkọọ́lẹ̀ rẹ tó ń jẹ́ "${name}". Ṣé òun lo ní lọ́kàn? Dáhùn yes tàbí no.`,
  ],
  [
    /^✅ Beneficiary nickname saved: (.+)\n\nWhich bank is this beneficiary using\?$/,
    (_m, name, lang) =>
      lang === "pidgin"
        ? `✅ I save beneficiary nickname: ${name}\n\nWhich bank the person dey use?`
        : `✅ A fi orúkọ ẹni tó máa gba owó pamọ́: ${name}\n\nIlé-ifowópamọ́ wo ni ẹni náà ń lò?`,
  ],
  [
    /^🏦 Bank: (.+)\n\nWhat is the beneficiary's account number\?$/,
    (_m, bank, lang) =>
      lang === "pidgin"
        ? `🏦 Bank: ${bank}\n\nWetin be the beneficiary account number?`
        : `🏦 Ilé-ifowópamọ́: ${bank}\n\nKí ni nọ́mbà àkọọ́lẹ̀ ẹni tó máa gba owó náà?`,
  ],
  [
    /^I couldn't find any account for (.+) with account number (.+)\. Please check the number and try again\.$/,
    (_m, bank, account, lang) =>
      lang === "pidgin"
        ? `I no find account for ${bank} with number ${account}. Abeg check am and try again.`
        : `Mi ò rí àkọọ́lẹ̀ ${bank} tó ní nọ́mbà ${account}. Jọ̀wọ́ ṣàyẹ̀wò nọ́mbà náà kí o sì tún gbìyànjú.`,
  ],
  [
    /^Are you sure you want to add (.+) as a beneficiary\?\n\nReply yes or no\.$/,
    (_m, name, lang) =>
      lang === "pidgin"
        ? `You sure say you wan add ${name} as beneficiary?\n\nReply yes or no.`
        : `Ṣé o dá ọ lójú pé o fẹ́ fi ${name} kún àwọn tó máa ń gba owó?\n\nDáhùn yes tàbí no.`,
  ],
  [
    /^✅ Beneficiary saved successfully!\n\nNickname: (.+)\nBank: (.+)\nAccount: (.+)\nAccount holder: (.+)$/,
    (_m, nickname, bank, account, holder, lang) =>
      lang === "pidgin"
        ? `✅ Beneficiary don save!\n\nNickname: ${nickname}\nBank: ${bank}\nAccount: ${account}\nAccount holder: ${holder}`
        : `✅ A fi ẹni tó máa gba owó pamọ́!\n\nOrúkọ: ${nickname}\nIlé-ifowópamọ́: ${bank}\nÀkọọ́lẹ̀: ${account}\nOrúkọ ẹni tó ni àkọọ́lẹ̀: ${holder}`,
  ],
  [
    /^Nice to meet you, (.+)! 👋🏾\n\n📱 What's your phone number\?$/,
    (_m, name, lang) =>
      lang === "pidgin"
        ? `Good to meet you, ${name}! 👋🏾\n\n📱 Wetin be your phone number?`
        : `Inú mi dùn láti pàdé rẹ, ${name}! 👋🏾\n\n📱 Kí ni nọ́mbà fóònù rẹ?`,
  ],
  [
    /^Got it\. 📱\n\n🔐 Now create a 4-digit PIN for your Kredo account\.$/,
    (_m, lang) =>
      lang === "pidgin"
        ? "I don get am. 📱\n\n🔐 Create 4-digit PIN for your Kredo account now."
        : "A ti gbà á. 📱\n\n🔐 Dá PIN nọ́mbà mẹ́rin sílẹ̀ fún àkọọ́lẹ̀ Kredo rẹ.",
  ],
  [
    /^🏦 Let's create your Kredo account!\n\n👤 What's your full name\?$/,
    (_m, lang) =>
      lang === "pidgin"
        ? "🏦 Make we create your Kredo account!\n\n👤 Wetin be your full name?"
        : "🏦 Ẹ jẹ́ ká ṣí àkọọ́lẹ̀ Kredo rẹ!\n\n👤 Kí ni orúkọ rẹ ní kíkún?",
  ],
  [
    /^🏦 Let's add a bank account!\n\nI'll need a few details from you\.\n\nWhat's the name of your bank\?$/,
    (_m, lang) =>
      lang === "pidgin"
        ? "🏦 Make we add bank account!\n\nI go need small details from you.\n\nWetin be your bank name?"
        : "🏦 Ẹ jẹ́ ká fi àkọọ́lẹ̀ banki kún un!\n\nMo nílò àwọn àlàyé díẹ̀ lọ́wọ́ rẹ.\n\nKí ni orúkọ banki rẹ?",
  ],
  [
    /^👤 Let's add a beneficiary\.\n\nWhat nickname would you like to save this beneficiary as\?$/,
    (_m, lang) =>
      lang === "pidgin"
        ? "👤 Make we add beneficiary.\n\nWetin nickname you wan use save this person?"
        : "👤 Ẹ jẹ́ ká fi ẹni tó máa gba owó kún un.\n\nOrúkọ wo lo fẹ́ fi pamọ́ fún ẹni yìí?",
  ],
  [
    /^👋🏾 Hello (.+)! I'm Kredo 🤖🇳🇬\n\nYour account is already set up, so you can continue the conversation normally\.$/,
    (_m, name, lang) =>
      lang === "pidgin"
        ? `👋🏾 Hello ${name}! Na me be Kredo 🤖🇳🇬\n\nYour account don set, you fit continue to chat normally.`
        : `👋🏾 Ẹ káàbọ̀ ${name}! Èmi ni Kredo 🤖🇳🇬\n\nA ti ṣètò àkọọ́lẹ̀ rẹ, o lè bá mi sọ̀rọ̀ bó ṣe yẹ.`,
  ],
  [
    /^You already have an account, (.+)\. You can continue chatting normally\.$/,
    (_m, name, lang) =>
      lang === "pidgin"
        ? `You don already get account, ${name}. You fit continue to chat normally.`
        : `O ti ní àkọọ́lẹ̀ tẹ́lẹ̀, ${name}. O lè bá mi sọ̀rọ̀ bó ṣe yẹ.`,
  ],
  [
    /^🎉 Account setup complete!\n\n👤 Name: (.+)\n📱 Phone: (.+)\n\nWelcome to Kredo, (.+)! 🇳🇬🚀\n\nUse \/add_account to link your bank accounts to Kredo\.$/,
    (_m, name, phone, welcome, lang) =>
      lang === "pidgin"
        ? `🎉 Account don set!\n\n👤 Name: ${name}\n📱 Phone: ${phone}\n\nWelcome to Kredo, ${welcome}! 🇳🇬🚀\n\nUse /add_account to link your bank accounts.`
        : `🎉 A ti ṣètò àkọọ́lẹ̀ rẹ!\n\n👤 Orúkọ: ${name}\n📱 Fóònù: ${phone}\n\nẸ káàbọ̀ sí Kredo, ${welcome}! 🇳🇬🚀\n\nLo /add_account láti so àkọọ́lẹ̀ banki rẹ pọ̀ mọ́ Kredo.`,
  ],
  [
    /^🏦 Bank: (.+)\n\n💳 What's your 10-digit account number\?$/,
    (_m, bank, lang) =>
      lang === "pidgin"
        ? `🏦 Bank: ${bank}\n\n💳 Wetin be your 10-digit account number?`
        : `🏦 Ilé-ifowópamọ́: ${bank}\n\n💳 Kí ni nọ́mbà àkọọ́lẹ̀ rẹ tó ní nọ́mbà mẹ́wàá?`,
  ],
  [
    /^💳 Account number received\.\n\n👤 What's the account holder's name\?$/,
    (_m, lang) =>
      lang === "pidgin"
        ? "💳 I don receive account number.\n\n👤 Wetin be the account holder name?"
        : "💳 A ti gba nọ́mbà àkọọ́lẹ̀.\n\n👤 Kí ni orúkọ ẹni tó ni àkọọ́lẹ̀ náà?",
  ],
  [
    /^✅ Bank account added successfully!\n\n🏦 Bank: (.+)\n💳 Account: (.+)\n👤 Name: (.+)\n\nYou can now use "(.+)" when referring to this account\. 🇳🇬$/,
    (_m, bank, account, name, accountName, lang) =>
      lang === "pidgin"
        ? `✅ Bank account don add!\n\n🏦 Bank: ${bank}\n💳 Account: ${account}\n👤 Name: ${name}\n\nYou fit use "${accountName}" to refer to this account now. 🇳🇬`
        : `✅ A fi àkọọ́lẹ̀ banki kún un!\n\n🏦 Ilé-ifowópamọ́: ${bank}\n💳 Àkọọ́lẹ̀: ${account}\n👤 Orúkọ: ${name}\n\nO lè lo "${accountName}" láti tọ́ka sí àkọọ́lẹ̀ yìí báyìí. 🇳🇬`,
  ],
  [
    /^I couldn't find a recipient account for (.+)\. Please add the recipient first or send the correct account details\.$/,
    (_m, name, lang) =>
      lang === "pidgin"
        ? `I no fit find account for ${name}. Abeg add recipient first or send correct account details.`
        : `Mi ò rí àkọọ́lẹ̀ fún ${name}. Jọ̀wọ́ kọ́kọ́ fi ẹni náà kún un tàbí fi àlàyé àkọọ́lẹ̀ tó tọ́ ránṣẹ́.`,
  ],
  [
    /^I found (\d+) transfers in that message( \(only processing the first \d+ — that's the limit per message\))?\. Let's confirm them one at a time — starting with the first\.$/,
    (_m, count, capped, lang) =>
      lang === "pidgin"
        ? `I find ${count} transfers for that message${capped ? " (I go process first ones only — na the message limit)" : ""}. Make we confirm them one by one.`
        : `Mo rí gbigbe owó ${count} nínú ìfiránṣẹ́ náà${capped ? " (àkọ́kọ́ nìkan ni a ó ṣe — ìwọ̀n tó pọ̀ jù nínú ìfiránṣẹ́ kan)" : ""}. Ẹ jẹ́ ká jẹ́rìí wọn lọ́kọ̀ọ̀kan.`,
  ],
  [
    /^✅ All (\d+) transfers from your message completed successfully!$/,
    (_m, count, lang) =>
      lang === "pidgin"
        ? `✅ All ${count} transfers from your message don complete well!`
        : `✅ Gbogbo gbigbe owó ${count} inú ìfiránṣẹ́ rẹ ṣe àṣeyọrí!`,
  ],
  [
    /^📜 You do not have any transaction history(.*) yet\.$/,
    (_m, range, lang) =>
      lang === "pidgin"
        ? `📜 You never get transaction history${range} yet.`
        : `📜 O kò tíì ní ìtàn ìṣòwò kankan${range} síbẹ̀.`,
  ],
  [
    /^📜 Transaction History(?: \((.+) - (.+)\))?$/,
    (_m, from, to, lang) =>
      lang === "pidgin"
        ? `📜 Transaction History${from ? ` (${from} - ${to})` : ""}`
        : `📜 Ìtàn Ìṣòwò${from ? ` (${from} - ${to})` : ""}`,
  ],
  [
    /^👥 Your Beneficiaries:\n\n([\s\S]+)$/,
    (_m, list, lang) =>
      lang === "pidgin"
        ? `👥 Your Beneficiaries:\n\n${list}`
        : `👥 Àwọn ẹni tó máa ń gba owó rẹ:\n\n${list}`,
  ],
];

export function localizeReplyText(text, lang = "english") {
  if (typeof text !== "string" || lang === "english") return text;
  let localized = commonReplies[text]?.[lang === "pidgin" ? 0 : 1];

  if (
    !localized &&
    text.startsWith("✅ All ") &&
    text.includes(" transfers from your message completed successfully!\n\n")
  ) {
    const [headline, details] = text.split("\n\n", 2);
    const count = headline.match(/^✅ All (\d+)/)?.[1] || "";
    localized = `${lang === "pidgin" ? `✅ All ${count} transfers from your message don complete well!` : `✅ Gbogbo gbigbe owó ${count} inú ìfiránṣẹ́ rẹ ṣe àṣeyọrí!`}\n\n${details}`;
  }

  if (!localized && text.startsWith("📋 Batch complete:")) {
    const [headline, details = ""] = text.split("\n\n", 2);
    const counts = headline.match(/Batch complete: (\d+)\/(\d+) succeeded/);
    if (counts) {
      const failed = headline.match(/(\d+) failed/)?.[1];
      const cancelled = headline.match(/(\d+) cancelled/)?.[1];
      const pidgin = lang === "pidgin";
      const summary = pidgin
        ? `📋 Batch don complete: ${counts[1]}/${counts[2]} succeed${failed ? `, ${failed} fail` : ""}${cancelled ? `, ${cancelled} cancel` : ""}.`
        : `📋 Gbigbe owó ti parí: ${counts[1]}/${counts[2]} ṣe àṣeyọrí${failed ? `, ${failed} kùnà` : ""}${cancelled ? `, ${cancelled} fagilé` : ""}.`;
      const translatedDetails = details
        .replaceAll(
          "recipient not found",
          pidgin ? "recipient no dey" : "a kò rí ẹni tó máa gba owó",
        )
        .replaceAll(
          "insufficient balance",
          pidgin ? "money no reach" : "ìwọ̀ntúnwọ̀nsì kò tó",
        )
        .replaceAll(
          "invalid amount",
          pidgin ? "amount no correct" : "iye owó kò tọ́",
        )
        .replaceAll("wrong PIN", pidgin ? "PIN no correct" : "PIN kò tọ́")
        .replaceAll("same account", pidgin ? "same account" : "àkọọ́lẹ̀ kan náà")
        .replaceAll(
          "beneficiary not confirmed",
          pidgin ? "beneficiary no confirm" : "a kò jẹ́rìí ẹni tó máa gba owó",
        )
        .replaceAll(
          "sender account not found",
          pidgin ? "sender account no dey" : "a kò rí àkọọ́lẹ̀ olùránṣẹ́",
        )
        .replaceAll(
          "internal error",
          pidgin ? "system error" : "àṣìṣe inú ètò",
        );
      localized = `${summary}${details ? `\n\n${translatedDetails}` : ""}`;
    }
  }

  if (!localized && text.startsWith("📜 Transaction History")) {
    localized = text
      .replace(
        "📜 Transaction History",
        lang === "pidgin" ? "📜 Transaction History" : "📜 Ìtàn Ìṣòwò",
      )
      .replaceAll("From:", lang === "pidgin" ? "From:" : "Láti:")
      .replaceAll("To:", lang === "pidgin" ? "To:" : "Sí:")
      .replaceAll("Amount:", lang === "pidgin" ? "Amount:" : "Iye owó:")
      .replaceAll("Ref:", lang === "pidgin" ? "Ref:" : "Àtọ́kasí:")
      .replaceAll("Date:", lang === "pidgin" ? "Date:" : "Ọjọ́ àti àkókò:");
  }

  if (!localized) {
    for (const [pattern, render] of dynamicReplies) {
      const match = text.match(pattern);
      if (match) {
        const args = match.slice(1);
        localized = render(match[0], ...args, lang);
        break;
      }
    }
  }

  return localized || text;
}

function renderReply(
  templateKey,
  { lang = "english", amount, name, reference = "" } = {},
) {
  const template = templates[templateKey];
  if (!template) return templates.generic_error.english;
  const hasValidAmount = Number.isFinite(Number(amount)) && Number(amount) > 0;
  const hasValidName = typeof name === "string" && name.trim().length > 0;
  const requiredAreValid = (template.required || []).every((key) =>
    key === "amount" ? hasValidAmount : key === "name" ? hasValidName : false,
  );
  const locale = requiredAreValid && template[lang] ? lang : "english";
  const cacheKey = `${templateKey}:${locale}`;
  let rendered = templateCache.get(cacheKey);
  if (!rendered) {
    rendered = template[locale] || template.english;
    templateCache.set(cacheKey, rendered);
  }

  return rendered
    .replaceAll(
      "{amount}",
      hasValidAmount
        ? Number(amount).toLocaleString("en-NG")
        : "the requested amount",
    )
    .replaceAll("{name}", hasValidName ? name.trim() : "the recipient")
    .replaceAll("{reference}", String(reference));
}

export function safeReply(ctx, templateKey, options = {}) {
  const text = renderReply(templateKey, options);
  return ctx ? ctx.reply(text) : text;
}

export default safeReply;
