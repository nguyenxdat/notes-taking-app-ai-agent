import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Plus,
  Search,
  Archive,
  Folder,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  Settings,
  Moon,
  FileText
} from 'lucide-react'

interface SidebarProps {
  onCreateNote?: () => void
  onSearch?: () => void
}

export function Sidebar({ onCreateNote, onSearch }: SidebarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [foldersExpanded, setFoldersExpanded] = useState(true)

  const menuItems = [
    {
      icon: Plus,
      label: 'Create Note',
      shortcut: '⌘N',
      onClick: onCreateNote,
      path: null
    },
    {
      icon: Search,
      label: 'Search',
      shortcut: '⌘S',
      onClick: onSearch,
      path: null
    },
    {
      icon: FileText,
      label: 'All Notes',
      shortcut: null,
      onClick: () => navigate('/'),
      path: '/'
    },
    {
      icon: Archive,
      label: 'Archives',
      shortcut: '⌘R',
      onClick: () => navigate('/archives'),
      path: '/archives'
    }
  ]

  const folders = [
    { name: 'Bucket List', icon: '🎯' },
    { name: 'Finances', icon: '💰' },
    { name: 'Travel Plans', icon: '✈️' },
    { name: 'Shopping', icon: '🛒' },
    { name: 'Personal', icon: '👤' },
    { name: 'Work', icon: '💼' },
    { name: 'Projects', icon: '📁' }
  ]

  const isActive = (path: string | null) => {
    if (!path) return false
    return location.pathname === path
  }

  return (
    <div className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
            <Moon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Syncscribe</h1>
            <p className="text-xs text-gray-500">Meet Desai</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={item.onClick}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
              isActive(item.path)
                ? 'bg-gray-900 text-white'
                : 'hover:bg-gray-200 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5" />
              <span className="font-medium text-sm">{item.label}</span>
            </div>
            {item.shortcut && (
              <span className={`text-xs ${isActive(item.path) ? 'text-gray-400' : 'text-gray-500'}`}>
                {item.shortcut}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Folders Section */}
      <div className="mt-6 px-3 flex-1">
        <button
          onClick={() => setFoldersExpanded(!foldersExpanded)}
          className="w-full flex items-center justify-between px-3 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-all"
        >
          <div className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            <span className="font-medium text-sm">Folders</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="hover:bg-gray-300 rounded p-1">
              <Plus className="h-3 w-3" />
            </button>
            {foldersExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </div>
        </button>

        {foldersExpanded && (
          <div className="mt-1 space-y-0.5 pl-2">
            {folders.map((folder) => (
              <button
                key={folder.name}
                onClick={() => navigate(`/folder/${folder.name.toLowerCase().replace(' ', '-')}`)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-all"
              >
                <span>{folder.icon}</span>
                <span>{folder.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="p-3 space-y-1 border-t border-gray-200">
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-all">
          <HelpCircle className="h-5 w-5" />
          <span>Help</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded-lg transition-all">
          <Settings className="h-5 w-5" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  )
}