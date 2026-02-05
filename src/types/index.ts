export type Card = {
  id: string;
  front: string;
  back: string;
  frontImage?: string;
  backImage?: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
  // Spaced repetition fields
  interval: number; // days
  repetitions: number; // number of successful reviews
  easeFactor: number; // difficulty multiplier
  nextReviewDate: number; // timestamp
  lastReviewDate?: number; // timestamp
  isNew: boolean;
}

export type Tag = {
  id: string;
  name: string;
  color: string;
  createdAt: number;
}

export type StudySession = {
  cardId: string;
  rating: 'again' | 'hard' | 'good' | 'easy';
  timestamp: number;
}

export type ViewMode = 'dashboard' | 'study' | 'cards' | 'tags' | 'create' | 'edit' | 'data';

export type AppState = {
  cards: Card[];
  tags: Tag[];
  currentView: ViewMode;
  selectedTagId: string | null;
  searchQuery: string;
  editingCardId: string | null;
}
