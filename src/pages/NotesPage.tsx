import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Note, SortOption, ViewMode, FilterOption } from '@/types/note'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { NoteForm } from '@/components/NoteForm'
import { NoteList } from '@/components/NoteList'
import { ListView } from '@/components/ListView'
import { NoteStatsBar } from '@/components/NoteStats'
import { NoteManagementBar } from '@/components/NoteManagementBar'
import {
  sortNotes,
  filterNotes,
  sortWithPriority,
  calculateStats,
  exportNotesToJSON,
  downloadJSON,
  validateImportedNotes,
} from '@/lib/noteManagement'
import { Plus, BookOpen, AlertTriangle, CheckSquare, Square } from 'lucide-react'

interface NotesPageProps {
  notes: Note[]
  onCreateNote: (title: string, content: string) => void
  onUpdateNote: (id: string, updates: Partial<Note>) => void
  onDeleteNotes: (ids: string[]) => void
  onImportNotes: (notes: Note[]) => void
}

export function NotesPage({
  notes,
  onCreateNote,
  onUpdateNote,
  onDeleteNotes,
  onImportNotes,
}: NotesPageProps) {
  const navigate = useNavigate()

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // View & Filter states
  const [sortBy, setSortBy] = useState<SortOption>('newest')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [filterBy, setFilterBy] = useState<FilterOption>('all')

  // Selection states
  const [selectedNotes, setSelectedNotes] = useState<Set<string>>(new Set())
  const [selectionMode, setSelectionMode] = useState(false)

  // Process notes: filter → sort → prioritize
  const processedNotes = useMemo(() => {
    let result = filterNotes(notes, filterBy)
    result = sortNotes(result, sortBy)
    result = sortWithPriority(result)
    return result
  }, [notes, filterBy, sortBy])

  // Calculate statistics
  const stats = useMemo(() => calculateStats(notes), [notes])

  // Handlers
  const handleCreateNote = (title: string, content: string) => {
    onCreateNote(title, content)
    setIsDialogOpen(false)
  }

  const handleNoteClick = (note: Note) => {
    navigate(`/note/${note.id}`)
  }

  const handleToggleSelect = (id: string) => {
    const newSelected = new Set(selectedNotes)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedNotes(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedNotes.size === processedNotes.length) {
      setSelectedNotes(new Set())
    } else {
      setSelectedNotes(new Set(processedNotes.map(n => n.id)))
    }
  }

  const handleDeleteSelected = () => {
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    onDeleteNotes(Array.from(selectedNotes))
    setSelectedNotes(new Set())
    setSelectionMode(false)
    setIsDeleteDialogOpen(false)
  }

  const handleExport = () => {
    const data = exportNotesToJSON(notes)
    downloadJSON(data, `notes-export-${new Date().toISOString().split('T')[0]}.json`)
  }

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      try {
        const text = await file.text()
        const data = JSON.parse(text)
        const validated = validateImportedNotes(data)

        if (validated) {
          onImportNotes(validated)
          alert(`Successfully imported ${validated.length} notes!`)
        } else {
          alert('Invalid file format. Please check your JSON file.')
        }
      } catch (error) {
        alert('Error importing notes. Please check your file.')
        console.error(error)
      }
    }
    input.click()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
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

          <div className="flex gap-2">
            {/* Selection Mode Toggle */}
            <Button
              variant={selectionMode ? 'default' : 'outline'}
              onClick={() => {
                setSelectionMode(!selectionMode)
                if (selectionMode) setSelectedNotes(new Set())
              }}
              className={selectionMode ? 'bg-blue-600 hover:bg-blue-700' : ''}
            >
              {selectionMode ? <CheckSquare className="h-4 w-4 mr-2" /> : <Square className="h-4 w-4 mr-2" />}
              {selectionMode ? 'Exit Selection' : 'Select'}
            </Button>

            {/* New Note Button */}
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
        </div>

        {/* Statistics */}
        <NoteStatsBar stats={stats} />

        {/* Management Bar */}
        <NoteManagementBar
          sortBy={sortBy}
          onSortChange={setSortBy}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
          onExport={handleExport}
          onImport={handleImport}
          selectedCount={selectedNotes.size}
          onDeleteSelected={handleDeleteSelected}
        />

        {/* Selection Actions */}
        {selectionMode && processedNotes.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSelectAll}
                className="text-blue-700 hover:text-blue-900 font-medium text-sm"
              >
                {selectedNotes.size === processedNotes.length ? 'Deselect All' : 'Select All'}
              </button>
              <span className="text-blue-600 text-sm">
                {selectedNotes.size} of {processedNotes.length} selected
              </span>
            </div>
          </div>
        )}

        {/* Notes Display */}
        {viewMode === 'grid' ? (
          <NoteList
            notes={processedNotes}
            onNoteClick={handleNoteClick}
            selectedNotes={selectedNotes}
            onToggleSelect={handleToggleSelect}
            selectionMode={selectionMode}
          />
        ) : (
          <ListView
            notes={processedNotes}
            onNoteClick={handleNoteClick}
            selectedNotes={selectedNotes}
            onToggleSelect={handleToggleSelect}
            selectionMode={selectionMode}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <AlertDialogTitle className="text-xl">Delete Selected Notes?</AlertDialogTitle>
              </div>
              <AlertDialogDescription>
                Are you sure you want to delete <strong>{selectedNotes.size}</strong> note{selectedNotes.size !== 1 ? 's' : ''}?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}
