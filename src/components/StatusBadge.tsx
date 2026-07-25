import { useTranslation } from 'react-i18next'
import type { ComplaintStatus } from '../types'

const badgeStyles: Record<string, string> = {
  submitted: 'bg-gray-200 text-gray-900',
  under_review: 'bg-gray-100 text-gray-900 border border-gray-300',
  in_progress: 'bg-gray-200 text-gray-900',
  resolved: 'bg-black text-white',
}

export default function StatusBadge({ status }: { status: ComplaintStatus }) {
  const { t } = useTranslation()
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${badgeStyles[status] || 'bg-gray-100 text-gray-900'}`}>
      {t(`status.${status}`)}
    </span>
  )
}
