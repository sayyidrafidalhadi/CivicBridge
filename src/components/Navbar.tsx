import { Link, useLocation } from 'react-router-dom'
import { Menu, X, FileText, PlusCircle, LayoutDashboard, LogOut, Map, Settings as SettingsIcon } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import type { Profile } from '../types'

interface NavbarProps {
  user: Profile | null
  onSignOut: () => void
}

export default function Navbar({ user, onSignOut }: NavbarProps) {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const navLinks = [
    { to: '/complaints', label: t('nav.complaints'), icon: FileText },
    { to: '/map', label: t('nav.map'), icon: Map },
    ...(user ? [{ to: '/report', label: t('nav.report'), icon: PlusCircle }] : []),
    ...(user?.role === 'officer' ? [{ to: '/admin', label: t('nav.dashboard'), icon: LayoutDashboard }] : []),
  ]

  const isActive = (path: string) => path === '/complaints' ? location.pathname.startsWith(path) : location.pathname === path

  return (
    <nav className="sticky top-0 z-40 bg-gray-100 border-b border-gray-200 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2">
              <span className="brand text-xl text-gray-900">Nammude Shabdham</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition ${
                  isActive(link.to) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
                }`}
              >
                <link.icon className="w-3.5 h-3.5" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LanguageSwitcher />

            {user ? (
              <>
                <Link to="/settings"
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition">
                  <SettingsIcon className="w-3.5 h-3.5" />
                </Link>
                <Link to="/dashboard"
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  {user.name}
                </Link>
                <button onClick={onSignOut}
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold uppercase tracking-wider text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition">
                  <LogOut className="w-3.5 h-3.5" />
                  {t('nav.signOut')}
                </button>
              </>
            ) : (
              <Link to="/login"
                className="neo-btn-primary text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider">
                {t('nav.signIn')}
              </Link>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-lg text-gray-600 hover:bg-gray-200 transition">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-gray-200 md:hidden bg-gray-100">
          <div className="space-y-1 px-4 py-3">
            <div className="mb-2"><LanguageSwitcher /></div>
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider ${
                  isActive(link.to) ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-200'
                }`}>
                <link.icon className="w-3.5 h-3.5" /> {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link to="/settings" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-200">
                  <SettingsIcon className="w-3.5 h-3.5" /> {t('nav.settings')}
                </Link>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-200">
                  <LayoutDashboard className="w-3.5 h-3.5" /> {user.name}
                </Link>
                <button onClick={() => { onSignOut(); setMobileOpen(false) }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-200">
                  <LogOut className="w-3.5 h-3.5" /> {t('nav.signOut')}
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMobileOpen(false)}
                className="block rounded-lg neo-btn-primary text-white px-4 py-2 text-center text-xs font-bold uppercase tracking-wider">
                {t('nav.signIn')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
