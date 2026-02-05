import { useState, useEffect, useCallback } from 'react';
import type { Tag } from '@/types';

const STORAGE_KEY = 'flashmind-tags';

const TAG_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#f59e0b', // amber
  '#84cc16', // lime
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#8b5cf6', // violet
  '#d946ef', // fuchsia
  '#f43f5e', // rose
  '#64748b', // slate
];

export const useTags = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setTags(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse tags:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
    }
  }, [tags, isLoaded]);

  const addTag = useCallback((name: string, color?: string) => {
    const newTag: Tag = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color: color || TAG_COLORS[Math.floor(Math.random() * TAG_COLORS.length)],
      createdAt: Date.now(),
    };
    setTags(prev => [...prev, newTag]);
    return newTag.id;
  }, []);

  const updateTag = useCallback((id: string, updates: Partial<Tag>) => {
    setTags(prev =>
      prev.map(tag =>
        tag.id === id ? { ...tag, ...updates } : tag
      )
    );
  }, []);

  const deleteTag = useCallback((id: string) => {
    setTags(prev => prev.filter(tag => tag.id !== id));
  }, []);

  const getTagById = useCallback((id: string) => {
    return tags.find(tag => tag.id === id);
  }, [tags]);

  const searchTags = useCallback((query: string) => {
    if (!query.trim()) return tags;
    const lowercaseQuery = query.toLowerCase();
    return tags.filter(tag =>
      tag.name.toLowerCase().includes(lowercaseQuery)
    );
  }, [tags]);

  const importTags = useCallback((newTags: Tag[]) => {
    setTags(newTags);
  }, []);

  return {
    tags,
    isLoaded,
    addTag,
    updateTag,
    deleteTag,
    getTagById,
    searchTags,
    importTags,
    TAG_COLORS,
  };
};
