import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { MessageSquare, Send, User } from 'lucide-react'
import { getComments, createComment } from '../services/comments'
import { useAuth } from '../hooks/useAuth'
import { useRealtimeComments } from '../hooks/useRealtime'
import { formatDate } from '../utils'
import type { Comment } from '../types'

interface CommentsSectionProps {
  complaintId: string
}

export default function CommentsSection({ complaintId }: CommentsSectionProps) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const loadComments = useCallback(async () => {
    try { setComments(await getComments(complaintId)) }
    catch { setComments([]) }
    finally { setLoading(false) }
  }, [complaintId])

  useEffect(() => { loadComments() }, [loadComments])
  useRealtimeComments(complaintId, loadComments)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    setSubmitting(true)
    try {
      await createComment(complaintId, message.trim())
      setMessage('')
      await loadComments()
    } finally { setSubmitting(false) }
  }

  return (
    <div>
      <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2 mb-4">
        <MessageSquare className="h-4 w-4" />
        {t('comments.title')} ({comments.length})
      </h3>

      {user && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="flex gap-2">
            <input type="text" value={message} onChange={(e) => setMessage(e.target.value)}
              placeholder={t('comments.placeholder')}
              className="flex-1 neo-input rounded-xl px-3 py-2 text-xs font-medium text-gray-900 outline-none" />
            <button type="submit" disabled={!message.trim() || submitting}
              className="inline-flex items-center gap-1.5 rounded-xl neo-btn-primary text-white px-4 py-2 text-xs font-bold uppercase tracking-wider disabled:opacity-50">
              {submitting ? <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send className="h-3.5 w-3.5" /> {t('comments.send')}</>}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex justify-center py-4">
          <div className="h-5 w-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">{t('comments.noComments')}</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-3 rounded-xl neo-card-sm">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 flex-shrink-0">
                <User className="h-4 w-4 text-gray-900" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-gray-900">{comment.profiles?.name || t('complaints.anonymous')}</span>
                  <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                </div>
                <p className="mt-0.5 text-sm text-gray-700">{comment.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
