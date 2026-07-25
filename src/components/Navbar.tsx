import { Link } from 'react-router-dom'
import type { Profile } from '../types'

interface NavbarProps {
  user: Profile | null
  onSignOut: () => void
}

export default function Navbar({ user, onSignOut }: NavbarProps) {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <span className="text-xl font-bold text-gray-900">CivicBridge</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/complaints" className="text-sm font-medium text-gray-600 hover:text-emerald-600">
                Complaints
              </Link>
              {user && (
                <Link to="/report" className="text-sm font-medium text-gray-600 hover:text-emerald-600">
                  Report
                </Link>
              )}
              {user?.role === 'officer' && (
                <Link to="/admin" className="text-sm font-medium text-gray-600 hover:text-emerald-600">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-600 hover:text-emerald-600"
                >
                  {user.name}
                </Link>
                <button
                  onClick={onSignOut}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
