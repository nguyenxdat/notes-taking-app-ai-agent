import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Note, TimeFilter } from '@/types/note'

interface NotesPageNewProps {
  notes: Note[]
  onCreateNote: (title: string, content: string) => void
  onDeleteNotes: (ids: string[]) => void
}

export function NotesPageNew({
  notes,
  onCreateNote,
  onDeleteNotes,
}: NotesPageNewProps) {
  const navigate = useNavigate()
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all')

  // Filter out archived notes
  const activeNotes = useMemo(() => {
    return notes.filter(note => !note.archivedAt)
  }, [notes])

  // Apply time filter
  const filteredNotes = useMemo(() => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

    switch (timeFilter) {
      case 'today':
        return activeNotes.filter(note => new Date(note.createdAt) >= today)
      case 'week':
        return activeNotes.filter(note => new Date(note.createdAt) >= weekAgo)
      case 'month':
        return activeNotes.filter(note => new Date(note.createdAt) >= monthAgo)
      default:
        return activeNotes
    }
  }, [activeNotes, timeFilter])

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getPreview = (content: string, maxLength: number = 100) => {
    if (!content) return 'No preview'
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  // Card colors based on index
  const cardColors = [
    'bg-purple-100 border-purple-200',
    'bg-orange-100 border-orange-200',
    'bg-green-100 border-green-200',
    'bg-blue-100 border-blue-200',
    'bg-yellow-100 border-yellow-200',
    'bg-pink-100 border-pink-200'
  ]

  const badgeColors = [
    'bg-purple-200 text-purple-800',
    'bg-orange-200 text-orange-800',
    'bg-green-200 text-green-800',
    'bg-blue-200 text-blue-800',
    'bg-yellow-200 text-yellow-800',
    'bg-pink-200 text-pink-800'
  ]

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setTimeFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeFilter('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeFilter === 'week'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => setTimeFilter('month')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeFilter === 'month'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              This Month
            </button>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No notes yet</p>
          <p className="text-gray-400 text-sm mt-2">Press ⌘N to create your first note</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredNotes.map((note, index) => {
            const colorIndex = index % cardColors.length
            const cardColor = cardColors[colorIndex]
            const badgeColor = badgeColors[colorIndex]

            return (
              <div
                key={note.id}
                onClick={() => navigate(`/note/${note.id}`)}
                className={`${cardColor} border-2 rounded-2xl p-5 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-2 flex-1">
                    {note.title}
                  </h3>
                  <span className={`${badgeColor} px-2 py-1 rounded-lg text-xs font-medium ml-2 whitespace-nowrap`}>
                    {formatTime(note.createdAt)}
                  </span>
                </div>

                {/* Preview Lines */}
                <div className="space-y-2 mb-3">
                  {getPreview(note.content)
                    .split('\n')
                    .slice(0, 4)
                    .map((line, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
                        <p className="text-sm text-gray-700 line-clamp-1">{line || ' '}</p>
                      </div>
                    ))}
                </div>

                {/* Action Icon */}
                <div className="flex justify-end">
                  <div className="w-6 h-6 rounded-full bg-green-400 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}