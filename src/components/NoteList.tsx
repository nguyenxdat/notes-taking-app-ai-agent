import type { Note } from '@/types/note'
import { NoteCard } from './NoteCard'
import { FileText } from 'lucide-react'

interface NoteListProps {
  notes: Note[]
  onNoteClick?: (note: Note) => void
  selectedNotes?: Set<string>
  onToggleSelect?: (id: string) => void
  selectionMode?: boolean
}

export function NoteList({
  notes,
  onNoteClick,
  selectedNotes = new Set(),
  onToggleSelect,
  selectionMode = false
}: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg">No notes yet</p>
        <p className="text-gray-400 text-sm mt-2">
          Click "New Note" to create your first note
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onClick={() => onNoteClick?.(note)}
          isSelected={selectedNotes.has(note.id)}
          onToggleSelect={onToggleSelect}
          selectionMode={selectionMode}
        />
      ))}
    </div>
  )
}
