import type { Note } from '@/types/note';

export function generateId(): string {
  return `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createNote(title: string, content: string): Note {
  const now = new Date();
  return {
    id: generateId(),
    title,
    content,
    createdAt: now,
    updatedAt: now,
  };
}

export function updateNote(note: Note, updates: Partial<Omit<Note, 'id' | 'createdAt'>>): Note {
  return {
    ...note,
    ...updates,
    updatedAt: new Date(),
  };
}
