import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import type { SortOption, ViewMode, FilterOption } from '@/types/note'
import {
  LayoutGrid,
  List,
  ArrowUpDown,
  Filter,
  Download,
  Upload,
  Trash2,
} from 'lucide-react'

interface NoteManagementBarProps {
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  filterBy: FilterOption
  onFilterChange: (filter: FilterOption) => void
  onExport: () => void
  onImport: () => void
  selectedCount: number
  onDeleteSelected: () => void
}

export function NoteManagementBar({
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  filterBy,
  onFilterChange,
  onExport,
  onImport,
  selectedCount,
  onDeleteSelected,
}: NoteManagementBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        {/* Left side: Sort, Filter, View */}
        <div className="flex flex-wrap gap-3 items-center">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-gray-500" />
            <Select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="w-40"
            >
              <option value="newest">📅 Newest First</option>
              <option value="oldest">📅 Oldest First</option>
              <option value="updated">✏️ Recently Updated</option>
              <option value="title-asc">🔤 Title (A-Z)</option>
              <option value="title-desc">🔤 Title (Z-A)</option>
            </Select>
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select
              value={filterBy}
              onChange={(e) => onFilterChange(e.target.value as FilterOption)}
              className="w-40"
            >
              <option value="all">All Notes</option>
              <option value="today">📅 Today</option>
              <option value="week">📅 This Week</option>
              <option value="month">📅 This Month</option>
              <option value="with-content">📝 With Content</option>
              <option value="empty">📄 Empty</option>
            </Select>
          </div>

          {/* View Mode */}
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('grid')}
              className={`${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('list')}
              className={`${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Right side: Actions */}
        <div className="flex flex-wrap gap-2 items-center">
          {selectedCount > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={onDeleteSelected}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete ({selectedCount})
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onImport}
            className="border-green-200 text-green-700 hover:bg-green-50"
          >
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>
        </div>
      </div>
    </div>
  )
}
