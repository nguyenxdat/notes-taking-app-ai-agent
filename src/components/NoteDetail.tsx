import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { Note } from '@/types/note'
import { AlertTriangle, ArrowLeft, Edit, Pin, Star, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MarkdownPreview } from './MarkdownPreview'

interface NoteDetailProps {
  notes: Note[]
  onDelete: (id: string) => void
  onUpdate?: (id: string, updates: Partial<Note>) => void
}

export function NoteDetail({ notes, onDelete, onUpdate }: NoteDetailProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const note = notes.find((n) => n.id === id)

  if (!note) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Note not found</h2>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Notes
          </Button>
        </div>
      </div>
    )
  }

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleDelete = () => {
    onDelete(note.id)
    navigate('/')
  }

  const handleTogglePin = () => {
    onUpdate?.(note.id, { isPinned: !note.isPinned })
  }

  const handleToggleFavorite = () => {
    onUpdate?.(note.id, { isFavorite: !note.isFavorite })
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="hover:bg-blue-100"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleTogglePin}
              className={note.isPinned ? 'bg-orange-50 border-orange-300 hover:bg-orange-100' : ''}
            >
              <Pin className={`h-4 w-4 mr-2 ${note.isPinned ? 'text-orange-600' : ''}`} />
              {note.isPinned ? 'Unpin' : 'Pin'}
            </Button>

            <Button
              variant="outline"
              onClick={handleToggleFavorite}
              className={note.isFavorite ? 'bg-yellow-50 border-yellow-300 hover:bg-yellow-100' : ''}
            >
              <Star className={`h-4 w-4 mr-2 ${note.isFavorite ? 'text-yellow-600 fill-current' : ''}`} />
              {note.isFavorite ? 'Unfavorite' : 'Favorite'}
            </Button>

            <Button
              onClick={() => navigate(`/note/${note.id}/edit`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
              <AlertDialogTrigger>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <AlertDialogTitle className="text-xl">Delete Note?</AlertDialogTitle>
                  </div>
                  <AlertDialogDescription>
                    Are you sure you want to delete <strong>"{note.title}"</strong>?
                    This action cannot be undone and the note will be permanently deleted.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-gray-200">
          <h1 className="text-4xl font-bold mb-2 bg-linear-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {note.title}
          </h1>
          <div className="flex gap-4 text-sm text-gray-500 mb-8">
            <span className="flex items-center gap-1">
              📅 Created: {formatDate(note.createdAt)}
            </span>
            {note.updatedAt && note.updatedAt !== note.createdAt && (
              <span className="flex items-center gap-1">
                ✏️ Updated: {formatDate(note.updatedAt)}
              </span>
            )}
          </div>

          <div className="border-t border-gray-200 pt-6">
            {note.content ? (
              <MarkdownPreview content={note.content} />
            ) : (
              <p className="text-gray-400 italic">No content</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
