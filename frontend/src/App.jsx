import "./App.css";

// Replace this with your Telegram username, group, or invite link.
const TELEGRAM_LINK = "https://t.me/kredo_financeBot";

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="telegram-icon">
      <path d="M21.4 4.6 18.2 20c-.2 1.1-.9 1.4-1.8.9l-5-3.7-2.4 2.3c-.3.3-.5.5-1 .5l.4-5.1 9.3-8.4c.4-.4-.1-.6-.6-.2L5.6 13.5.7 12c-1.1-.3-1.1-1 .2-1.5L20 3c.9-.3 1.7.2 1.4 1.6Z" />
    </svg>
  );
}

function BrandMark() {
  return (
    <div className="brand" aria-label="Kredo">
      <span className="brand-mark" aria-hidden="true">
        »
      </span>
      <span>
        kredo<span className="brand-period">.</span>
      </span>
    </div>
  );
}

function ChatPreview() {
  return (
    <div
      className="phone-wrap"
      aria-label="Preview of the Kredo chat experience"
    >
      <div className="phone">
        <div className="phone-notch" />
        <div className="phone-status">
          <span>9:41</span>
          <span>●●● &nbsp; ▰</span>
        </div>
        <div className="chat-header">
          <span className="chat-avatar">K</span>
          <span>
            <strong>Kredo</strong>
            <small>Your money, in one chat</small>
          </span>
          <span className="chat-menu">•••</span>
        </div>
        <div className="chat-body">
          <span className="chat-date">TODAY</span>
          <div className="bubble bubble-out">
            Send ₦10,000 to Tolu <small>9:40 ✓✓</small>
          </div>
          <div className="bubble bubble-in">
            Done! ₦10,000 sent to Tolu.<small>9:40</small>
          </div>
          <div className="receipt">
            <div className="receipt-check">✓</div>
            <strong>Transfer successful</strong>
            <span>₦10,000.00</span>
            <small>Today, 9:40 AM</small>
          </div>
          <div className="bubble bubble-out bubble-short">
            Nice, thanks! <small>9:41 ✓✓</small>
          </div>
        </div>
        <div className="chat-input">
          <span>Message Kredo…</span>
          <b>↑</b>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <main id="top" className="landing-page">
      <header className="site-header">
        <div className="header-inner">
          <BrandMark />
          <a
            className="button button-dark header-cta"
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noreferrer"
          >
            <TelegramIcon /> Try Kredo
          </a>
        </div>
      </header>

      <section className="hero-section" id="personal">
        <div className="hero-content">
          <div className="proof-pill">
            <span className="proof-dot" /> Money moves better with Kredo{" "}
            <span aria-hidden="true">✦</span>
          </div>
          <h1>
            One chat for
            <br className="desktop-break" /> everything money.
          </h1>
          <p className="hero-copy">
            Send money, pay bills, and stay on top of your spending all through
            one simple conversation.
          </p>
          <a
            className="button button-primary hero-cta"
            href={TELEGRAM_LINK}
            target="_blank"
            rel="noreferrer"
          >
            <TelegramIcon /> Try Kredo on Telegram
          </a>
        </div>
        <ChatPreview />
        <div className="hero-glow" aria-hidden="true" />
      </section>
    </main>
  );
}

export default App;
