import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

interface LayoutProps {
  children: ReactNode
  onCreateNote?: () => void
  onSearch?: () => void
}

export function Layout({ children, onCreateNote, onSearch }: LayoutProps) {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar onCreateNote={onCreateNote} onSearch={onSearch} />
      <main className="flex-1 overflow-auto bg-gray-50">
        {children}
      </main>
    </div>
  )
}
