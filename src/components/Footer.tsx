export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <span className="font-semibold text-white">CivicBridge</span>
          </div>
          <p className="text-sm">
            Building transparency between citizens and government.
          </p>
        </div>
      </div>
    </footer>
  )
}
