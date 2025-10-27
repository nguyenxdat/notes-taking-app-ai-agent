import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Note } from '@/types/note'
import { Archive, RotateCcw, Trash2, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ArchivesPageProps {
  notes: Note[]
  onRestore: (id: string) => void
  onDeletePermanently: (id: string) => void
}

export function ArchivesPage({
  notes,
  onRestore,
  onDeletePermanently,
}: ArchivesPageProps) {
  const navigate = useNavigate()

  // Filter archived notes
  const archivedNotes = useMemo(() => {
    return notes.filter(note => note.archivedAt)
  }, [notes])

  // Calculate days until auto-delete
  const getDaysRemaining = (archivedAt: Date) => {
    const now = new Date()
    const archived = new Date(archivedAt)
    const diffTime = 7 * 24 * 60 * 60 * 1000 - (now.getTime() - archived.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Archive className="h-8 w-8 text-gray-700" />
          <h1 className="text-3xl font-bold text-gray-900">Archives</h1>
        </div>
        <p className="text-gray-600">
          Archived notes will be automatically deleted after 7 days
        </p>
      </div>

      {/* Archived Notes */}
      {archivedNotes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-gray-200">
          <Archive className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No archived notes</p>
          <p className="text-gray-400 text-sm mt-2">
            Deleted notes will appear here for 7 days before permanent deletion
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {archivedNotes.map((note) => {
            const daysRemaining = note.archivedAt ? getDaysRemaining(note.archivedAt) : 0

            return (
              <div
                key={note.id}
                className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4">
                  {/* Content */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => navigate(`/note/${note.id}`)}
                  >
                    <h3 className="font-bold text-gray-900 text-lg mb-2 hover:text-blue-600 transition-colors">
                      {note.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Archived {formatDate(note.archivedAt!)}</span>
                      </div>
                      <div
                        className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          daysRemaining <= 2
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        onRestore(note.id)
                      }}
                      className="gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Restore
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        if (
                          confirm(
                            'Are you sure you want to permanently delete this note? This action cannot be undone.'
                          )
                        ) {
                          onDeletePermanently(note.id)
                        }
                      }}
                      className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete Forever
                    </Button>
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
