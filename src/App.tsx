import { useState } from 'react'
import type { Note } from '@/types/note'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { createNote } from '@/lib/noteUtils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { NoteForm } from '@/components/NoteForm'
import { NoteList } from '@/components/NoteList'
import { Plus } from 'lucide-react'
import './App.css'

function App() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', [])
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleCreateNote = (title: string, content: string) => {
    const newNote = createNote(title, content)
    setNotes([newNote, ...notes])
    setIsDialogOpen(false)
  }

  const handleNoteClick = (note: Note) => {
    console.log('Note clicked:', note)
    // TODO: Implement note detail view/edit in next step
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Notes</h1>
            <p className="text-gray-600 mt-1">
              {notes.length} {notes.length === 1 ? 'note' : 'notes'}
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="gap-2">
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

export default App
