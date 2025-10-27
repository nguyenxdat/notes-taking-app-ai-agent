import type { NoteStats } from '@/lib/noteManagement'
import { FileText, FileCheck, FileX, Calendar, Star, Pin } from 'lucide-react'

interface NoteStatsProps {
  stats: NoteStats
}

export function NoteStatsBar({ stats }: NoteStatsProps) {
  const statItems = [
    { label: 'Total', value: stats.total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'With Content', value: stats.withContent, icon: FileCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Empty', value: stats.empty, icon: FileX, color: 'text-gray-500', bg: 'bg-gray-50' },
    { label: 'This Week', value: stats.thisWeek, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Pinned', value: stats.pinned, icon: Pin, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Favorites', value: stats.favorites, icon: Star, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statItems.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-lg ${item.bg} flex items-center justify-center flex-shrink-0`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-500">{item.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
