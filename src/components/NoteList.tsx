import type { Note } from '@/types/note'
import { NoteCard } from './NoteCard'

interface NoteListProps {
  notes: Note[]
  onNoteClick?: (note: Note) => void
}

export function NoteList({ notes, onNoteClick }: NoteListProps) {
  if (notes.length === 0) {
    return (
      <div className="text-center py-12">
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
        />
      ))}
    </div>
  )
}
