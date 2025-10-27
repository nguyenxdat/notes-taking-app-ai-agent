import { useState, useEffect, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Note } from '@/types/note'
import {
  Search,
  FileText,
  Plus,
  Archive,
  Star,
  Folder,
  Download,
  Upload,
  Clock,
  ArrowRight,
  Hash,
  Command as CommandIcon
} from 'lucide-react'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  notes: Note[]
  onCreateNote?: () => void
}

interface CommandItem {
  id: string
  type: 'note' | 'action' | 'recent'
  title: string
  subtitle?: string
  icon: React.ReactNode
  action: () => void
  shortcut?: string
}

export function CommandPalette({
  isOpen,
  onClose,
  notes,
  onCreateNote,
}: CommandPaletteProps) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setQuery('')
      setSelectedIndex(0)
    }
  }, [isOpen])

  // Save recent search
  const saveRecentSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // Actions
  const actions: CommandItem[] = [
    {
      id: 'create',
      type: 'action',
      title: 'Create new note',
      icon: <Plus className="h-5 w-5" />,
      action: () => {
        onCreateNote?.()
        onClose()
      },
      shortcut: '⌘N'
    },
    {
      id: 'archives',
      type: 'action',
      title: 'Open archives',
      icon: <Archive className="h-5 w-5" />,
      action: () => {
        navigate('/archives')
        onClose()
      },
      shortcut: '⌘R'
    },
    {
      id: 'pinned',
      type: 'action',
      title: 'View pinned notes',
      icon: <Star className="h-5 w-5" />,
      action: () => {
        navigate('/')
        onClose()
      }
    },
    {
      id: 'folders',
      type: 'action',
      title: 'Browse folders',
      icon: <Folder className="h-5 w-5" />,
      action: () => {
        navigate('/')
        onClose()
      }
    }
  ]

  // Filter notes and actions based on query
  const filteredResults = useMemo(() => {
    const lowerQuery = query.toLowerCase().trim()

    if (!lowerQuery) {
      // Show recent searches and suggestions
      const recent: CommandItem[] = recentSearches.slice(0, 3).map((search, idx) => ({
        id: `recent-${idx}`,
        type: 'recent' as const,
        title: search,
        icon: <Clock className="h-5 w-5" />,
        action: () => {
          setQuery(search)
        }
      }))

      return {
        recent,
        actions,
        notes: []
      }
    }

    // Search notes
    const matchedNotes: CommandItem[] = notes
      .filter(note => !note.archivedAt)
      .filter(note =>
        note.title.toLowerCase().includes(lowerQuery) ||
        note.content.toLowerCase().includes(lowerQuery)
      )
      .slice(0, 5)
      .map(note => ({
        id: note.id,
        type: 'note' as const,
        title: note.title,
        subtitle: new Date(note.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        icon: <FileText className="h-5 w-5" />,
        action: () => {
          saveRecentSearch(query)
          navigate(`/note/${note.id}`)
          onClose()
        }
      }))

    // Filter actions
    const matchedActions = actions.filter(action =>
      action.title.toLowerCase().includes(lowerQuery)
    )

    return {
      recent: [],
      actions: matchedActions,
      notes: matchedNotes
    }
  }, [query, notes, recentSearches, actions, navigate, onClose])

  const allItems = [
    ...filteredResults.recent,
    ...filteredResults.actions,
    ...filteredResults.notes
  ]

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => (prev + 1) % allItems.length)
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => (prev - 1 + allItems.length) % allItems.length)
          break
        case 'Enter':
          e.preventDefault()
          if (allItems[selectedIndex]) {
            allItems[selectedIndex].action()
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, allItems, onClose])

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Command Palette */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
          <Search className="h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, commands..."
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-400"
          />
          <div className="flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
            <CommandIcon className="h-3 w-3" />
            <span>K</span>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {allItems.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No results found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try a different search term
              </p>
            </div>
          ) : (
            <>
              {/* Recent Searches */}
              {filteredResults.recent.length > 0 && (
                <div className="px-2 py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Recent
                  </div>
                  {filteredResults.recent.map((item, idx) => (
                    <CommandItem
                      key={item.id}
                      item={item}
                      isSelected={idx === selectedIndex}
                      onClick={item.action}
                    />
                  ))}
                </div>
              )}

              {/* Actions */}
              {filteredResults.actions.length > 0 && (
                <div className="px-2 py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                    {query ? 'Commands' : 'Suggestions'}
                  </div>
                  {filteredResults.actions.map((item, idx) => (
                    <CommandItem
                      key={item.id}
                      item={item}
                      isSelected={
                        (filteredResults.recent.length + idx) === selectedIndex
                      }
                      onClick={item.action}
                    />
                  ))}
                </div>
              )}

              {/* Notes */}
              {filteredResults.notes.length > 0 && (
                <div className="px-2 py-2">
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                    Notes ({filteredResults.notes.length})
                  </div>
                  {filteredResults.notes.map((item, idx) => (
                    <CommandItem
                      key={item.id}
                      item={item}
                      isSelected={
                        (filteredResults.recent.length + filteredResults.actions.length + idx) === selectedIndex
                      }
                      onClick={item.action}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded">ESC</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Command Item Component
function CommandItem({
  item,
  isSelected,
  onClick,
}: {
  item: CommandItem
  isSelected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
        isSelected
          ? 'bg-blue-50 border border-blue-200'
          : 'hover:bg-gray-50 border border-transparent'
      }`}
    >
      <div className={`${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
        {item.icon}
      </div>
      <div className="flex-1 text-left min-w-0">
        <div className={`font-medium truncate ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
          {item.title}
        </div>
        {item.subtitle && (
          <div className="text-xs text-gray-500 truncate">{item.subtitle}</div>
        )}
      </div>
      {item.shortcut && (
        <div className="text-xs text-gray-400">{item.shortcut}</div>
      )}
      {isSelected && (
        <ArrowRight className="h-4 w-4 text-blue-600" />
      )}
    </button>
  )
}
