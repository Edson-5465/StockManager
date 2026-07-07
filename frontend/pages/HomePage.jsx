import "../styles/HomePage.css";

export default function HomePage() {
  return (
    <div>
      <header>
        <h1>StockManager</h1>
        <nav>
          <a href="#">Login</a>
          <a href="#">Register</a>
          <a href="#features">Docs</a>
        </nav>
      </header>

      <section className="hero">
        <h2>Smart Stock Management Made Simple</h2>
        <p>Track batches, expiry dates, and automate reorders — all in one place.</p>
        <div>
          <a href="#" className="btn-primary">Get Started</a>
          <a href="#features" className="btn-secondary">Learn More</a>
        </div>
      </section>

      <section id="features" className="features">
        <div className="feature-card">
          <h3>Role-Based Access</h3>
          <p>Custom views & permissions for Admins, Managers, and Staff.</p>
        </div>
        <div className="feature-card">
          <h3>Expiry Auditing</h3>
          <p>Flag items as GOOD, NEAR_EXPIRY, or EXPIRED automatically.</p>
        </div>
        <div className="feature-card">
          <h3>OCR Scanning</h3>
          <p>Browser-based label scanning without hardware.</p>
        </div>
      </section>

      <footer>
        <p>&copy; {new Date().getFullYear()} StockManager. Built with pride in Gaborone 🇧🇼</p>
      </footer>
    </div>
  );
}
