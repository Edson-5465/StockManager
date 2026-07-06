export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">StockManager</h1>
        <nav className="space-x-6">
          <a href="#" className="text-sm text-gray-700 hover:text-indigo-500">Login</a>
          <a href="#" className="text-sm text-gray-700 hover:text-indigo-500">Register</a>
          <a href="#features" className="text-sm text-gray-700 hover:text-indigo-500">Docs</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-cyan-500 text-white py-20 text-center">
        <h2 className="text-5xl font-bold">Smart Stock Management Made Simple</h2>
        <p className="mt-4 text-lg max-w-2xl mx-auto">
          Track batches, expiry dates, and automate reorders — all in one place.
        </p>
        <div className="mt-6 space-x-4">
          <a href="#" className="bg-white text-indigo-600 px-6 py-2 rounded shadow hover:bg-gray-100">
            Get Started
          </a>
          <a href="#features" className="bg-orange-500 px-6 py-2 rounded shadow hover:bg-orange-600">
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-8 grid md:grid-cols-3 gap-8 text-center">
        {[
          { title: "Role-Based Access", desc: "Custom views & permissions for Admins, Managers, and Staff." },
          { title: "Expiry Auditing", desc: "Flag items as GOOD, NEAR_EXPIRY, or EXPIRED automatically." },
          { title: "OCR Scanning", desc: "Browser-based label scanning without hardware." },
          { title: "Safe Checkout", desc: "Concurrency-safe checkout prevents duplicate sales." },
          { title: "Auto Reordering", desc: "Instant alerts & reorders when stock runs low." },
        ].map((feature) => (
          <div key={feature.title} className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition">
            <h3 className="text-xl font-semibold text-indigo-600">{feature.title}</h3>
            <p className="mt-2 text-gray-600">{feature.desc}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-center py-6">
        <p>&copy; {new Date().getFullYear()} StockManager. Built with pride in Gaborone 🇧🇼</p>
      </footer>
    </div>
  );
}
