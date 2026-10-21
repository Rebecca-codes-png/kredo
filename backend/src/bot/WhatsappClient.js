import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  fetchLatestBaileysVersion,
} from "@whiskeysockets/baileys";

export class WhatsAppClient {
  // phoneNumber = the number being linked: country code, no "+", no leading 0
  constructor(phoneNumber, authDir = "auth_info") {
    this.phoneNumber = phoneNumber.replace(/\D/g, "");
    this.authDir = authDir;
    this.sock = null;
    this.pairingRequested = false;
  }

  async connect() {
    const { state, saveCreds } = await useMultiFileAuthState(this.authDir);
    const { version } = await fetchLatestBaileysVersion();

    this.sock = makeWASocket({
      version,
      auth: state,
      printQRInTerminal: false,
    });

    // save the session so you don't pair again every run
    this.sock.ev.on("creds.update", saveCreds);

    this.sock.ev.on(
      "connection.update",
      async ({ connection, lastDisconnect, qr }) => {
        // a qr event means the socket is ready and not yet linked,
        // so this is the moment to ask for a pairing code instead
        if (
          qr &&
          !this.sock.authState.creds.registered &&
          !this.pairingRequested
        ) {
          this.pairingRequested = true;
          try {
            const code = await this.sock.requestPairingCode(this.phoneNumber);
            console.log("Pairing code:", code);
          } catch (err) {
            console.log("Could not get pairing code:", err.message);
            this.pairingRequested = false;
          }
        }

        if (connection === "open") console.log("WhatsApp connected");

        if (connection === "close") {
          this.pairingRequested = false;
          const code = lastDisconnect?.error?.output?.statusCode;
          if (code !== DisconnectReason.loggedOut) {
            this.connect(); // reconnect on normal drops
          } else {
            console.log("Logged out. Delete the auth folder and pair again.");
          }
        }
      },
    );
  }
}
