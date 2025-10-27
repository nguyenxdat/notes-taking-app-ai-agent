import { BrowserRouter, Routes, Route } from 'react-router-dom'
import type { Note } from '@/types/note'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { createNote, updateNote } from '@/lib/noteUtils'
import { NotesPage } from '@/pages/NotesPage'
import { NoteDetail } from '@/components/NoteDetail'
import { NoteEditor } from '@/components/NoteEditor'
import './App.css'

function App() {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', [])

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

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <NotesPage
              notes={notes}
              onCreateNote={handleCreateNote}
            />
          }
        />
        <Route
          path="/note/:id"
          element={
            <NoteDetail
              notes={notes}
              onDelete={handleDeleteNote}
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
    </BrowserRouter>
  )
}

export default App
