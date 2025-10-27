import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import type { SearchScope } from '@/types/note'

interface SearchBarProps {
  query: string
  scope: SearchScope
  onQueryChange: (query: string) => void
  onScopeChange: (scope: SearchScope) => void
  resultCount?: number
}

export function SearchBar({
  query,
  scope,
  onQueryChange,
  onScopeChange,
  resultCount,
}: SearchBarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search Input */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-10 pr-10 bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onQueryChange('')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-100"
          >
            <X className="h-4 w-4 text-gray-500" />
          </Button>
        )}
      </div>

      {/* Scope Selector */}
      <Select
        value={scope}
        onChange={(e) => onScopeChange(e.target.value as SearchScope)}
        className="w-full sm:w-[140px] bg-white border-gray-300"
      >
        <option value="all">All fields</option>
        <option value="title">Title only</option>
        <option value="content">Content only</option>
      </Select>

      {/* Result Count */}
      {query && resultCount !== undefined && (
        <div className="text-sm text-gray-600 whitespace-nowrap">
          {resultCount} {resultCount === 1 ? 'result' : 'results'}
        </div>
      )}
    </div>
  )
}