import type { Note } from '@/types/note'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MarkdownPreview } from './MarkdownPreview'
import { FileText, Clock, Pin, Star, Check } from 'lucide-react'

interface NoteCardProps {
  note: Note
  onClick?: () => void
  isSelected?: boolean
  onToggleSelect?: (id: string) => void
  selectionMode?: boolean
}

export function NoteCard({ note, onClick, isSelected = false, onToggleSelect, selectionMode = false }: NoteCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPreview = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  // Random gradient for each card based on note id
  const gradients = [
    'from-blue-500 to-indigo-500',
    'from-purple-500 to-pink-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-cyan-500 to-blue-500',
    'from-violet-500 to-purple-500',
  ]

  const gradientIndex = note.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length
  const gradient = gradients[gradientIndex]

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-xl hover:scale-[1.03] overflow-hidden group relative ${
        isSelected ? 'border-2 border-blue-500 shadow-lg' : 'border-0'
      }`}
      onClick={() => !selectionMode && onClick?.()}
    >
      {/* Selection Checkbox */}
      {selectionMode && (
        <div
          className="absolute top-3 right-3 z-10"
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelect?.(note.id)
          }}
        >
          <button
            className={`h-6 w-6 rounded border-2 flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-blue-600 border-blue-600'
                : 'bg-white border-gray-300 hover:border-blue-400'
            }`}
          >
            {isSelected && <Check className="h-4 w-4 text-white" />}
          </button>
        </div>
      )}

      {/* Gradient Header Bar */}
      <div className={`h-2 bg-gradient-to-r ${gradient}`} />

      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}>
            <FileText className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {note.isPinned && (
                <Pin className="h-4 w-4 text-orange-600 flex-shrink-0" />
              )}
              {note.isFavorite && (
                <Star className="h-4 w-4 text-yellow-600 flex-shrink-0 fill-current" />
              )}
            </div>
            <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
              {note.title}
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Clock className="h-3 w-3" />
              {formatDate(note.createdAt)}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {note.content && (
        <CardContent className="pt-0">
          <div className="line-clamp-3 text-sm text-gray-600">
            <MarkdownPreview content={getPreview(note.content)} />
          </div>
        </CardContent>
      )}

      {/* Hover Effect Border */}
      <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left`} />
    </Card>
  )
}
