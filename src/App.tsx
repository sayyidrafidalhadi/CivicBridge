import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { isSupabaseConfigured } from './lib/supabase'
import { pageTransition } from './utils/animations'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoadingSpinner from './components/LoadingSpinner'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Report from './pages/Report'
import Complaints from './pages/Complaints'
import ComplaintDetails from './pages/ComplaintDetails'
import Admin from './pages/Admin'
import MapView from './pages/MapView'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { user, loading } = useAuth()

  if (loading) return <LoadingSpinner size="lg" />
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role && user.role !== 'admin') return <Navigate to="/dashboard" replace />

  return <>{children}</>
}

export default function App() {
  const { user, loading, signOut } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  function AnimatedRoutes() {
    const location = useLocation()
    return (
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit"><Landing /></motion.div>} />
          <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit"><Login /></motion.div>} />
          <Route path="/dashboard" element={<ProtectedRoute><motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit"><Dashboard /></motion.div></ProtectedRoute>} />
          <Route path="/report" element={<ProtectedRoute><motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit"><Report /></motion.div></ProtectedRoute>} />
          <Route path="/complaints" element={<motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit"><Complaints /></motion.div>} />
          <Route path="/complaints/:id" element={<motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit"><ComplaintDetails /></motion.div>} />
          <Route path="/admin" element={<ProtectedRoute role="officer"><motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit"><Admin /></motion.div></ProtectedRoute>} />
          <Route path="/map" element={<motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit"><MapView /></motion.div>} />
          <Route path="/settings" element={<ProtectedRoute><motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit"><Settings /></motion.div></ProtectedRoute>} />
          <Route path="*" element={<motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit"><NotFound /></motion.div>} />
        </Routes>
      </AnimatePresence>
    )
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-gray-100">
        {!isSupabaseConfigured && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center text-sm text-amber-800">
            Supabase not configured. Set{' '}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">VITE_SUPABASE_URL</code> and{' '}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">VITE_SUPABASE_ANON_KEY</code>{' '}
            in <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">.env</code>
          </div>
        )}
        <Navbar user={user} onSignOut={signOut} />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { borderRadius: '12px', background: '#333', color: '#fff' },
        }}
      />
    </BrowserRouter>
  )
}
