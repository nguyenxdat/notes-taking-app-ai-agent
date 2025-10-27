export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  isPinned?: boolean;
  isFavorite?: boolean;
}

export type SortOption = 'newest' | 'oldest' | 'updated' | 'title-asc' | 'title-desc'
export type ViewMode = 'grid' | 'list'
export type FilterOption = 'all' | 'today' | 'week' | 'month' | 'with-content' | 'empty'
export type SearchScope = 'all' | 'title' | 'content'
