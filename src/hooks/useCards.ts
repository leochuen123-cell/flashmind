import { useState, useEffect, useCallback } from 'react';
import type { Card } from '@/types';

const STORAGE_KEY = 'flashmind-cards';

// SM-2 Spaced Repetition Algorithm
export const calculateNextReview = (
  card: Card,
  rating: 'again' | 'hard' | 'good' | 'easy'
): Partial<Card> => {
  let { interval, repetitions, easeFactor } = card;
  
  // Quality of response: 0=again, 3=hard, 4=good, 5=easy
  const qualityMap = { again: 0, hard: 3, good: 4, easy: 5 };
  const quality = qualityMap[rating];
  
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }
  
  // Update ease factor
  easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  easeFactor = Math.max(1.3, easeFactor);
  
  const nextReviewDate = Date.now() + interval * 24 * 60 * 60 * 1000;
  
  return {
    interval,
    repetitions,
    easeFactor,
    nextReviewDate,
    lastReviewDate: Date.now(),
    isNew: false,
  };
};

export const useCards = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCards(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse cards:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
    }
  }, [cards, isLoaded]);

  const addCard = useCallback((cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt' | 'interval' | 'repetitions' | 'easeFactor' | 'nextReviewDate' | 'isNew'>) => {
    const newCard: Card = {
      ...cardData,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      interval: 0,
      repetitions: 0,
      easeFactor: 2.5,
      nextReviewDate: Date.now(),
      isNew: true,
    };
    setCards(prev => [newCard, ...prev]);
    return newCard.id;
  }, []);

  const updateCard = useCallback((id: string, updates: Partial<Card>) => {
    setCards(prev =>
      prev.map(card =>
        card.id === id
          ? { ...card, ...updates, updatedAt: Date.now() }
          : card
      )
    );
  }, []);

  const deleteCard = useCallback((id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
  }, []);

  const reviewCard = useCallback((id: string, rating: 'again' | 'hard' | 'good' | 'easy') => {
    setCards(prev =>
      prev.map(card => {
        if (card.id !== id) return card;
        const updates = calculateNextReview(card, rating);
        return { ...card, ...updates, updatedAt: Date.now() };
      })
    );
  }, []);

  const getDueCards = useCallback((tagId?: string) => {
    const now = Date.now();
    return cards.filter(card => {
      const isDue = card.nextReviewDate <= now;
      if (tagId) {
        return isDue && card.tags.includes(tagId);
      }
      return isDue;
    });
  }, [cards]);

  const getCardsByTag = useCallback((tagId: string) => {
    return cards.filter(card => card.tags.includes(tagId));
  }, [cards]);

  const searchCards = useCallback((query: string, tagId?: string) => {
    const lowercaseQuery = query.toLowerCase();
    let filtered = cards;
    
    if (tagId) {
      filtered = filtered.filter(card => card.tags.includes(tagId));
    }
    
    if (!query.trim()) return filtered;
    
    return filtered.filter(card =>
      card.front.toLowerCase().includes(lowercaseQuery) ||
      card.back.toLowerCase().includes(lowercaseQuery)
    );
  }, [cards]);

  const getNewCards = useCallback((tagId?: string) => {
    return cards.filter(card => {
      const isNew = card.isNew;
      if (tagId) {
        return isNew && card.tags.includes(tagId);
      }
      return isNew;
    });
  }, [cards]);

  const getLearningCards = useCallback((tagId?: string) => {
    return cards.filter(card => {
      const isLearning = !card.isNew && card.repetitions < 3;
      if (tagId) {
        return isLearning && card.tags.includes(tagId);
      }
      return isLearning;
    });
  }, [cards]);

  const getMatureCards = useCallback((tagId?: string) => {
    return cards.filter(card => {
      const isMature = card.repetitions >= 3;
      if (tagId) {
        return isMature && card.tags.includes(tagId);
      }
      return isMature;
    });
  }, [cards]);

  const importCards = useCallback((newCards: Card[]) => {
    setCards(newCards);
  }, []);

  return {
    cards,
    isLoaded,
    addCard,
    updateCard,
    deleteCard,
    reviewCard,
    importCards,
    getDueCards,
    getCardsByTag,
    searchCards,
    getNewCards,
    getLearningCards,
    getMatureCards,
  };
};
