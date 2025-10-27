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
    <DialogContent onClose={onCancel}>
      <form onSubmit={handleSubmit}>
        <DialogHeader>
          <DialogTitle>Create New Note</DialogTitle>
          <DialogDescription>
            Add a new note with markdown support. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              placeholder="Enter note title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError('')
              }}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="grid gap-2">
            <label htmlFor="content" className="text-sm font-medium">
              Content (Markdown supported)
            </label>
            <Textarea
              id="content"
              placeholder="Enter note content with markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="font-mono"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Note</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
