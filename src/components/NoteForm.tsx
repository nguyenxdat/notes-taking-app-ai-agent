import { useState, type FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Sparkles, FileText, Save, X } from 'lucide-react'

interface NoteFormProps {
  onSubmit: (title: string, content: string) => void
  onCancel: () => void
}

export function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    onSubmit(title, content)
    setTitle('')
    setContent('')
    setError('')
  }

  return (
    <DialogContent onClose={onCancel} className="max-w-2xl">
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Create New Note
              </DialogTitle>
              <DialogDescription className="text-gray-500">
                ✨ Add a new note with markdown support
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="grid gap-5 py-6">
          {/* Title Input */}
          <div className="grid gap-3">
            <label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              placeholder="My awesome note..."
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError('')
              }}
              className={`text-lg font-medium border-2 transition-all ${
                error
                  ? 'border-red-500 focus:border-red-600'
                  : 'border-gray-200 focus:border-blue-500'
              }`}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <span className="font-semibold">⚠️</span> {error}
              </p>
            )}
          </div>

          {/* Content Input */}
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <label htmlFor="content" className="text-sm font-semibold text-gray-700">
                📝 Content (Markdown supported)
              </label>
              <span className="text-xs text-gray-400 italic">
                Support: **bold**, *italic*, # heading, - list, etc.
              </span>
            </div>
            <Textarea
              id="content"
              placeholder="# Welcome!

Write your note here with **Markdown** support...

- Lists
- Code blocks
- And more!"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="font-mono text-sm border-2 border-gray-200 focus:border-blue-500 transition-all resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-2 border-gray-200 hover:bg-gray-50"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Note
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
