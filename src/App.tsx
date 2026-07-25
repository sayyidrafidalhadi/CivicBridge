import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import { isConfigured } from './lib/supabase'
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
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-gray-50">
        {!isConfigured && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 py-3 text-center text-sm text-amber-800">
            ⚠️ Supabase not configured. Set{' '}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">VITE_SUPABASE_URL</code> and{' '}
            <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">VITE_SUPABASE_ANON_KEY</code>{' '}
            in <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs">.env</code>
          </div>
        )}
        <Navbar user={user} onSignOut={signOut} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
            <Route path="/complaints" element={isConfigured ? <Complaints /> : <Navigate to="/" />} />
            <Route path="/complaints/:id" element={isConfigured ? <ComplaintDetails /> : <Navigate to="/" />} />
            <Route path="/admin" element={<ProtectedRoute role="officer"><Admin /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
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
