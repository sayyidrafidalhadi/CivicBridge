import { useEffect } from 'react'
import { getSupabase, isSupabaseConfigured } from '../lib/supabase'

export function useRealtimeComplaints(callback: () => void) {
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const supabase = getSupabase()
    const channel = supabase
      .channel('complaints-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'complaints' }, callback)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [callback])
}

export function useRealtimeComments(complaintId: string | undefined, callback: () => void) {
  useEffect(() => {
    if (!isSupabaseConfigured || !complaintId) return
    const supabase = getSupabase()
    const channel = supabase
      .channel('comments-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'comments', filter: `complaint_id=eq.${complaintId}` }, callback)
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [complaintId, callback])
}
