import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Profile, Role } from '../types'

export function useAuth() {
  const [user, setUser] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (cancelled) return
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          if (!cancelled) setUser(data as Profile)
        }
      } catch {
        console.warn('Auth: no session available')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    getSession()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (cancelled) return
      try {
        if (session?.user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          if (!cancelled) setUser(data as Profile)
        } else {
          setUser(null)
        }
      } catch {
        console.warn('Auth: profile fetch failed')
      }
    })

    return () => {
      cancelled = true
      listener?.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const signUp = async (email: string, password: string, name: string, role: Role) => {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error

    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        name,
        email,
        role,
      })
      if (profileError) throw profileError
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, loading, signIn, signUp, signOut }
}
