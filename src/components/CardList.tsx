import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Brain,
  Clock,
  Sparkles,
  Filter,
  X,
} from 'lucide-react';
import type { Card as CardType, Tag as TagType } from '@/types';

interface CardListProps {
  cards: CardType[];
  getTagById: (id: string) => TagType | undefined;
  onEdit: (cardId: string) => void;
  onDelete: (cardId: string) => void;
  onCreate: () => void;
  selectedTagId: string | null;
  searchQuery: string;
}

export function CardList({
  cards,
  getTagById,
  onEdit,
  onDelete,
  onCreate,
  selectedTagId,
  searchQuery,
}: CardListProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'learning' | 'mature' | 'due'>('all');

  const selectedTag = selectedTagId ? getTagById(selectedTagId) : null;

  const filteredCards = cards.filter((card) => {
    if (filter === 'new') return card.isNew;
    if (filter === 'learning') return !card.isNew && card.repetitions < 3;
    if (filter === 'mature') return card.repetitions >= 3;
    if (filter === 'due') return card.nextReviewDate <= Date.now();
    return true;
  });

  const displayCards = localSearch
    ? filteredCards.filter(
        (card) =>
          card.front.toLowerCase().includes(localSearch.toLowerCase()) ||
          card.back.toLowerCase().includes(localSearch.toLowerCase())
      )
    : filteredCards;

  const getCardStatus = (card: CardType) => {
    if (card.isNew) return { label: 'New', color: 'bg-emerald-100 text-emerald-700' };
    if (card.repetitions >= 3) return { label: 'Mature', color: 'bg-violet-100 text-violet-700' };
    return { label: 'Learning', color: 'bg-amber-100 text-amber-700' };
  };

  const isDue = (card: CardType) => card.nextReviewDate <= Date.now() && !card.isNew;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {selectedTag ? (
              <>
                <span
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: selectedTag.color }}
                />
                {selectedTag.name}
              </>
            ) : searchQuery ? (
              <>
                <Search className="w-6 h-6 text-slate-400" />
                Search: "{searchQuery}"
              </>
            ) : (
              <>
                <Brain className="w-6 h-6 text-violet-500" />
                All Cards
              </>
            )}
          </h2>
          <p className="text-slate-500 mt-1">
            {displayCards.length} card{displayCards.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Filter cards..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-10 w-48"
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
              </button>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter('all')}>All Cards</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('new')}>New</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('learning')}>Learning</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('mature')}>Mature</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('due')}>Due for Review</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            onClick={onCreate}
            className="gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
          >
            <Plus className="w-4 h-4" />
            New Card
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      {displayCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayCards.map((card) => {
            const status = getCardStatus(card);
            const cardDue = isDue(card);

            return (
              <Card
                key={card.id}
                className={cn(
                  'group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
                  cardDue && 'border-rose-300 ring-1 ring-rose-100'
                )}
              >
                <CardContent className="p-5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-1 flex-wrap flex-1">
                      {card.tags.slice(0, 3).map((tagId) => {
                        const tag = getTagById(tagId);
                        return tag ? (
                          <Badge
                            key={tagId}
                            style={{
                              backgroundColor: tag.color + '20',
                              color: tag.color,
                              borderColor: tag.color + '40',
                            }}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag.name}
                          </Badge>
                        ) : null;
                      })}
                      {card.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{card.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {cardDue && (
                        <Badge className="bg-rose-100 text-rose-700 text-xs gap-1">
                          <Clock className="w-3 h-3" />
                          Due
                        </Badge>
                      )}
                      <Badge className={cn('text-xs', status.color)}>{status.label}</Badge>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onEdit(card.id)}>
                            <Edit2 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteConfirmId(card.id)}
                            className="text-rose-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                        Front
                      </p>
                      <p className="text-slate-800 font-medium line-clamp-3">{card.front}</p>
                    </div>

                    {card.frontImage && (
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                        <img
                          src={card.frontImage}
                          alt="Front"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">
                        Back
                      </p>
                      <p className="text-slate-600 line-clamp-3">{card.back}</p>
                    </div>

                    {card.backImage && (
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-100">
                        <img
                          src={card.backImage}
                          alt="Back"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        {card.repetitions} reviews
                      </span>
                      <span>EF: {card.easeFactor.toFixed(2)}</span>
                    </div>
                    <span>
                      {new Date(card.nextReviewDate).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No cards found</h3>
          <p className="text-slate-500 mb-6">
            {localSearch || searchQuery
              ? 'Try adjusting your search or filter'
              : selectedTag
              ? 'This tag has no cards yet'
              : 'Get started by creating your first flashcard'}
          </p>
          {!localSearch && !searchQuery && (
            <Button
              onClick={onCreate}
              className="gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600"
            >
              <Plus className="w-4 h-4" />
              Create Card
            </Button>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Card</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this card? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmId) {
                  onDelete(deleteConfirmId);
                  setDeleteConfirmId(null);
                }
              }}
              className="bg-rose-500 hover:bg-rose-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
