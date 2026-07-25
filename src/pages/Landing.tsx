import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="text-6xl">🏛️</span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              CivicBridge
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              A lightweight digital governance platform that enables transparent
              communication between citizens and government. Report civic issues,
              track resolution progress, and foster accountability — all in real time.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link
                to="/report"
                className="rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg hover:bg-emerald-700"
              >
                Report an Issue
              </Link>
              <Link
                to="/complaints"
                className="rounded-xl border border-gray-300 bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                View Complaints
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">How It Works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { step: '1', title: 'Report', desc: 'Submit a civic issue with photos and location', icon: '📝' },
              { step: '2', title: 'Track', desc: 'Follow your complaint through the resolution process', icon: '👀' },
              { step: '3', title: 'Resolve', desc: 'Get updates as officials review and resolve the issue', icon: '✅' },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-gray-200 p-8 text-center hover:border-emerald-200 hover:shadow-md"
              >
                <span className="text-4xl">{item.icon}</span>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white">Ready to make a difference?</h2>
          <p className="mt-4 text-lg text-gray-400">
            Join CivicBridge and help build a more transparent community.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link
              to="/login"
              className="rounded-xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Get Started
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
