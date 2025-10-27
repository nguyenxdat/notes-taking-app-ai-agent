import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import type { Note } from '@/types/note'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { createNote, updateNote } from '@/lib/noteUtils'
import { Layout } from '@/components/Layout'
import { NotesPageNew } from '@/pages/NotesPageNew'
import { ArchivesPage } from '@/pages/ArchivesPage'
import { NoteDetail } from '@/components/NoteDetail'
import { NoteEditor } from '@/components/NoteEditor'
import { Dialog } from '@/components/ui/dialog'
import { NoteForm } from '@/components/NoteForm'
import './App.css'

function App() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', [])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const handleCreateNote = (title: string, content: string) => {
    const newNote = createNote(title, content)
    setNotes([newNote, ...notes])
  }

  const handleUpdateNote = (id: string, title: string, content: string) => {
    setNotes(notes.map(note =>
      note.id === id
        ? updateNote(note, { title, content })
        : note
    ))
  }

  const handleUpdateNoteProperties = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note =>
      note.id === id
        ? updateNote(note, updates)
        : note
    ))
  }

  const handleDeleteNote = (id: string) => {
    // Archive the note instead of deleting
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, archivedAt: new Date() }
        : note
    ))
  }

  const handleDeleteNotes = (ids: string[]) => {
    // Archive multiple notes
    setNotes(notes.map(note =>
      ids.includes(note.id)
        ? { ...note, archivedAt: new Date() }
        : note
    ))
  }

  const handleRestoreNote = (id: string) => {
    setNotes(notes.map(note =>
      note.id === id
        ? { ...note, archivedAt: null }
        : note
    ))
  }

  const handleDeletePermanently = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const handleCreateNoteSubmit = (title: string, content: string) => {
    handleCreateNote(title, content)
    setIsCreateDialogOpen(false)
  }

  return (
    <BrowserRouter>
      <Layout
        onCreateNote={() => setIsCreateDialogOpen(true)}
        onSearch={() => setIsSearchOpen(true)}
      >
        <Routes>
          <Route
            path="/"
            element={
              <NotesPageNew
                notes={notes}
                onCreateNote={handleCreateNote}
                onDeleteNotes={handleDeleteNotes}
              />
            }
          />
          <Route
            path="/archives"
            element={
              <ArchivesPage
                notes={notes}
                onRestore={handleRestoreNote}
                onDeletePermanently={handleDeletePermanently}
              />
            }
          />
          <Route
            path="/note/:id"
            element={
              <NoteDetail
                notes={notes}
                onDelete={handleDeleteNote}
                onUpdate={handleUpdateNoteProperties}
              />
            }
          />
          <Route
            path="/note/:id/edit"
            element={
              <NoteEditor
                notes={notes}
                onUpdate={handleUpdateNote}
              />
            }
          />
        </Routes>

        {/* Create Note Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <NoteForm
            onSubmit={handleCreateNoteSubmit}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </Dialog>
      </Layout>
    </BrowserRouter>
  )
}

export default App
