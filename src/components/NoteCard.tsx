import type { Note } from '@/types/note'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface NoteCardProps {
  note: Note
  onClick?: () => void
}

export function NoteCard({ note, onClick }: NoteCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPreview = (content: string, maxLength: number = 100) => {
    if (content.length <= maxLength) return content
    return content.substring(0, maxLength) + '...'
  }

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
      onClick={onClick}
    >
      <CardHeader>
        <CardTitle className="text-xl">{note.title}</CardTitle>
        <CardDescription>
          Created: {formatDate(note.createdAt)}
        </CardDescription>
      </CardHeader>
      {note.content && (
        <CardContent>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {getPreview(note.content)}
          </p>
        </CardContent>
      )}
    </Card>
  )
}
