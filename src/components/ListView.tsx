import type { Note } from '@/types/note'
import { FileText, Clock, Pin, Star, Check } from 'lucide-react'
import { MarkdownPreview } from './MarkdownPreview'

interface ListViewProps {
  notes: Note[]
  onNoteClick: (note: Note) => void
  selectedNotes: Set<string>
  onToggleSelect: (id: string) => void
  selectionMode: boolean
}

export function ListView({
  notes,
  onNoteClick,
  selectedNotes,
  onToggleSelect,
  selectionMode,
}: ListViewProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No notes found</p>
        <p className="text-gray-400 text-sm mt-2">
          Try adjusting your filters or create a new note
        </p>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPreview = (content: string, maxLength: number = 200) => {
    if (!content) return ''
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <div className="space-y-3">
      {notes.map((note) => {
        const isSelected = selectedNotes.has(note.id)

        return (
          <div
            key={note.id}
            className={`bg-white rounded-lg border-2 transition-all ${
              isSelected
                ? 'border-blue-500 shadow-lg'
                : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
            }`}
          >
            <div
              className="p-4 cursor-pointer"
              onClick={() => !selectionMode && onNoteClick(note)}
            >
              <div className="flex items-start gap-4">
                {/* Checkbox */}
                {selectionMode && (
                  <div
                    className="flex-shrink-0 mt-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onToggleSelect(note.id)}
                      className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300 hover:border-blue-400'
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </button>
                  </div>
                )}

                {/* Icon */}
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {note.isPinned && (
                          <Pin className="h-4 w-4 text-orange-600 flex-shrink-0" />
                        )}
                        {note.isFavorite && (
                          <Star className="h-4 w-4 text-yellow-600 flex-shrink-0 fill-current" />
                        )}
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {note.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(note.createdAt)}</span>
                        {note.updatedAt && note.updatedAt !== note.createdAt && (
                          <span className="text-gray-400">
                            · Updated {formatDate(note.updatedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {note.content && (
                    <div className="text-sm text-gray-600 line-clamp-2 mt-2">
                      <MarkdownPreview content={getPreview(note.content)} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}