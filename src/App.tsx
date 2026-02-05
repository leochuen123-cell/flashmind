import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/components/Dashboard';
import { CardList } from '@/components/CardList';
import { CardEditor } from '@/components/CardEditor';
import { StudyMode } from '@/components/StudyMode';
import { TagManager } from '@/components/TagManager';
import { DataManager } from '@/components/DataManager';
import { useCards } from '@/hooks/useCards';
import { useTags } from '@/hooks/useTags';
import type { ViewMode, Card, Tag } from '@/types';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  const {
    cards,
    isLoaded: cardsLoaded,
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
  } = useCards();

  const {
    tags,
    isLoaded: tagsLoaded,
    addTag,
    updateTag,
    deleteTag,
    getTagById,
    importTags,
    TAG_COLORS,
  } = useTags();

  const isLoaded = cardsLoaded && tagsLoaded;

  const dueCards = useMemo(() => getDueCards(), [getDueCards]);
  const newCards = useMemo(() => getNewCards(), [getNewCards]);
  
  const handleStudyClick = () => {
    if (dueCards.length > 0 || newCards.length > 0) {
      setCurrentView('study');
    }
  };

  const handleCreateCard = () => {
    setEditingCardId(null);
    setCurrentView('create');
  };

  const handleEditCard = (cardId: string) => {
    setEditingCardId(cardId);
    setCurrentView('edit');
  };

  const handleSaveCard = (cardData: {
    front: string;
    back: string;
    frontImage?: string;
    backImage?: string;
    tags: string[];
  }) => {
    if (editingCardId) {
      updateCard(editingCardId, cardData);
    } else {
      addCard(cardData);
    }
    setCurrentView('cards');
  };

  const handleTagSelect = (tagId: string | null) => {
    setSelectedTagId(tagId);
    setCurrentView('cards');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query && currentView !== 'cards') {
      setCurrentView('cards');
    }
  };

  const handleImport = (data: { cards: Card[]; tags: Tag[] }) => {
    importCards(data.cards);
    importTags(data.tags);
    setCurrentView('dashboard');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-pulse text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex">
      <Toaster position="top-center" richColors />
      
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        selectedTagId={selectedTagId}
        onTagSelect={handleTagSelect}
        tags={tags}
        dueCount={dueCards.length}
        newCount={newCards.length}
        totalCount={cards.length}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
      />

      <main className="flex-1 overflow-auto">
        {currentView === 'dashboard' && (
          <Dashboard
            dueCards={dueCards.length}
            newCards={newCards.length}
            totalCards={cards.length}
            totalTags={tags.length}
            learningCards={getLearningCards().length}
            matureCards={getMatureCards().length}
            onStudyClick={handleStudyClick}
            onCreateClick={handleCreateCard}
            onViewCards={() => setCurrentView('cards')}
            onViewTags={() => setCurrentView('tags')}
            recentCards={cards.slice(0, 5)}
            getTagById={getTagById}
          />
        )}

        {currentView === 'cards' && (
          <CardList
            cards={searchQuery ? searchCards(searchQuery, selectedTagId || undefined) : selectedTagId ? getCardsByTag(selectedTagId) : cards}
            getTagById={getTagById}
            onEdit={handleEditCard}
            onDelete={deleteCard}
            onCreate={handleCreateCard}
            selectedTagId={selectedTagId}
            searchQuery={searchQuery}
          />
        )}

        {(currentView === 'create' || currentView === 'edit') && (
          <CardEditor
            card={editingCardId ? cards.find(c => c.id === editingCardId) : undefined}
            tags={tags}
            onSave={handleSaveCard}
            onCancel={() => setCurrentView('cards')}
            onAddTag={addTag}
          />
        )}

        {currentView === 'study' && (
          <StudyMode
            cards={[...dueCards, ...newCards].slice(0, 50)}
            getTagById={getTagById}
            onReview={reviewCard}
            onExit={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'tags' && (
          <TagManager
            tags={tags}
            cards={cards}
            onAddTag={addTag}
            onUpdateTag={updateTag}
            onDeleteTag={deleteTag}
            onSelectTag={handleTagSelect}
            TAG_COLORS={TAG_COLORS}
          />
        )}

        {currentView === 'data' && (
          <DataManager
            cards={cards}
            tags={tags}
            onImport={handleImport}
          />
        )}
      </main>
    </div>
  );
}

export default App;
