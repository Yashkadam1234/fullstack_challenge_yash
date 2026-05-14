// types/index.ts

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  avatarUrl?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  userId: string;
  tags: string[];
  category?: string;
  isArchived: boolean;
  isPublic: boolean;
  shareId?: string;
  aiSummary?: string;
  aiActionItems: string[];
  suggestedTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  userId: string;
  color?: string;
  noteCount: number;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
  color?: string;
}

export interface AIGenerationResult {
  summary: string;
  actionItems: string[];
  suggestedTitle: string;
  generatedAt: string;
}

export interface ProductivityInsights {
  totalNotes: number;
  archivedNotes: number;
  notesThisWeek: number;
  notesLastWeek: number;
  mostUsedTags: Tag[];
  recentlyEdited: Note[];
  aiGenerationsCount: number;
  weeklyActivity: Record<string, number>;
}