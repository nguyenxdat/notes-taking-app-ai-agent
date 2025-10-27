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

  const handleUpdateNoteProperties = (id: string, updates: Partial<Note>) => {
    setNotes(notes.map(note =>
      note.id === id
        ? updateNote(note, updates)
        : note
    ))
  }

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id))
  }

  const handleDeleteNotes = (ids: string[]) => {
    setNotes(notes.filter(note => !ids.includes(note.id)))
  }

  const handleImportNotes = (importedNotes: Note[]) => {
    // Create a map of existing notes by ID for faster lookup
    const existingNotesMap = new Map(notes.map(note => [note.id, note]))

    // Replace existing notes with imported ones if IDs match
    importedNotes.forEach(importedNote => {
      existingNotesMap.set(importedNote.id, importedNote)
    })

    // Convert back to array
    setNotes(Array.from(existingNotesMap.values()))
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
              onDeleteNotes={handleDeleteNotes}
              onImportNotes={handleImportNotes}
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
    </BrowserRouter>
  )
}

export default App
