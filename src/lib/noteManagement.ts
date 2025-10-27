import type { Note, SortOption, FilterOption } from '@/types/note'

// Sorting functions
export function sortNotes(notes: Note[], sortBy: SortOption): Note[] {
  const sorted = [...notes]

  switch (sortBy) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())

    case 'updated':
      return sorted.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title))

    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title))

    default:
      return sorted
  }
}

// Filtering functions
export function filterNotes(notes: Note[], filter: FilterOption): Note[] {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  switch (filter) {
    case 'today':
      return notes.filter(note => new Date(note.createdAt) >= today)

    case 'week':
      return notes.filter(note => new Date(note.createdAt) >= weekAgo)

    case 'month':
      return notes.filter(note => new Date(note.createdAt) >= monthAgo)

    case 'with-content':
      return notes.filter(note => note.content && note.content.trim().length > 0)

    case 'empty':
      return notes.filter(note => !note.content || note.content.trim().length === 0)

    case 'all':
    default:
      return notes
  }
}

// Pin/Favorite sorting (pinned first, then favorites, then regular)
export function sortWithPriority(notes: Note[]): Note[] {
  return [...notes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1
    return 0
  })
}

// Statistics
export interface NoteStats {
  total: number
  withContent: number
  empty: number
  today: number
  thisWeek: number
  thisMonth: number
  pinned: number
  favorites: number
}

export function calculateStats(notes: Note[]): NoteStats {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)

  return {
    total: notes.length,
    withContent: notes.filter(n => n.content && n.content.trim().length > 0).length,
    empty: notes.filter(n => !n.content || n.content.trim().length === 0).length,
    today: notes.filter(n => new Date(n.createdAt) >= today).length,
    thisWeek: notes.filter(n => new Date(n.createdAt) >= weekAgo).length,
    thisMonth: notes.filter(n => new Date(n.createdAt) >= monthAgo).length,
    pinned: notes.filter(n => n.isPinned).length,
    favorites: notes.filter(n => n.isFavorite).length,
  }
}

// Export/Import
export function exportNotesToJSON(notes: Note[]): string {
  return JSON.stringify(notes, null, 2)
}

export function downloadJSON(data: string, filename: string = 'notes-export.json') {
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export function validateImportedNotes(data: unknown): Note[] | null {
  try {
    if (!Array.isArray(data)) return null

    const validatedNotes: Note[] = data.map(item => {
      if (
        typeof item.id !== 'string' ||
        typeof item.title !== 'string' ||
        typeof item.content !== 'string'
      ) {
        throw new Error('Invalid note structure')
      }

      return {
        id: item.id,
        title: item.title,
        content: item.content,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
        isPinned: item.isPinned || false,
        isFavorite: item.isFavorite || false,
      }
    })

    return validatedNotes
  } catch (error) {
    console.error('Validation error:', error)
    return null
  }
}
