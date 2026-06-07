export default function Home() {
  return (
    <div className="min-h-screen bg-clinical-pearl">
      <header className="bg-white border-b border-light-silver">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-charcoal">
            RSNA Mammography AI
          </h1>
          <p className="text-slate mt-2">
            AI-powered breast cancer detection screening tool
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg border border-light-silver p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-charcoal mb-4">
            Welcome
          </h2>
          <p className="text-slate mb-4">
            This is a research and educational tool for AI-assisted breast cancer detection.
          </p>
          <a
            href="/screening"
            className="inline-block px-6 py-3 bg-trust-teal text-white rounded-lg font-semibold hover:bg-teal-dark transition-colors"
          >
            Go to Screening
          </a>
        </div>
      </main>
    </div>
  );
}
