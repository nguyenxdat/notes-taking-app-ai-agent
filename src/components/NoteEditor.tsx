import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Note } from '@/types/note'
import { ArrowLeft, Save } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { MarkdownPreview } from './MarkdownPreview'

interface NoteEditorProps {
  notes: Note[]
  onUpdate: (id: string, title: string, content: string) => void
}

export function NoteEditor({ notes, onUpdate }: NoteEditorProps) {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const note = notes.find((n) => n.id === id)

  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [error, setError] = useState('')

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    onUpdate(note.id, title, content)
    navigate(`/note/${note.id}`)
  }

  const handleCancel = () => {
    navigate(`/note/${note.id}`)
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold bg-linear-to-br from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ✏️ Edit Note
            </h1>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleCancel} className="border-gray-300 hover:bg-gray-100">
                Cancel
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>

          {/* Title Input */}
          <div className="mb-4">
            <Input
              placeholder="Note title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value)
                if (error) setError('')
              }}
              className={`text-2xl font-bold h-12 border-2 ${error ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'}`}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>

          {/* Split View: Editor | Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Editor */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h2 className="text-sm font-semibold text-blue-600 mb-3 flex items-center gap-2">
                <span>📝</span> Editor (Markdown)
              </h2>
              <Textarea
                placeholder="Write your note in Markdown..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                className="font-mono text-sm border-gray-200 focus:border-blue-500"
              />
            </div>

            {/* Preview */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
              <h2 className="text-sm font-semibold text-indigo-600 mb-3 flex items-center gap-2">
                <span>👁️</span> Preview
              </h2>
              <div className="border border-gray-200 rounded-md p-4 min-h-[500px] overflow-auto bg-gray-50">
                {content ? (
                  <MarkdownPreview content={content} />
                ) : (
                  <p className="text-gray-400 italic">
                    Preview will appear here...
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
