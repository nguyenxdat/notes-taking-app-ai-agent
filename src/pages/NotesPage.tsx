import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Note } from '@/types/note'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { NoteForm } from '@/components/NoteForm'
import { NoteList } from '@/components/NoteList'
import { Plus, BookOpen } from 'lucide-react'

interface NotesPageProps {
  notes: Note[]
  onCreateNote: (title: string, content: string) => void
}

export function NotesPage({ notes, onCreateNote }: NotesPageProps) {
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateNote = (title: string, content: string) => {
    onCreateNote(title, content)
    setIsDialogOpen(false)
  }

  const handleNoteClick = (note: Note) => {
    navigate(`/note/${note.id}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                My Notes
              </h1>
              <p className="text-gray-600 mt-1">
                {notes.length} {notes.length === 1 ? 'note' : 'notes'}
              </p>
            </div>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger>
              <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all">
                <Plus className="h-5 w-5" />
                New Note
              </Button>
            </DialogTrigger>
            <NoteForm
              onSubmit={handleCreateNote}
              onCancel={() => setIsDialogOpen(false)}
            />
          </Dialog>
        </div>

        {/* Notes List */}
        <NoteList notes={notes} onNoteClick={handleNoteClick} />
      </div>
    </div>
  )
}
