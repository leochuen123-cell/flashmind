import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
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
  Tag,
  Edit2,
  Trash2,
  FolderOpen,
  Brain,
} from 'lucide-react';
import type { Tag as TagType, Card as CardType } from '@/types';

interface TagManagerProps {
  tags: TagType[];
  cards: CardType[];
  onAddTag: (name: string, color: string) => string;
  onUpdateTag: (id: string, updates: Partial<TagType>) => void;
  onDeleteTag: (id: string) => void;
  onSelectTag: (tagId: string) => void;
  TAG_COLORS: string[];
}

export function TagManager({
  tags,
  cards,
  onAddTag,
  onUpdateTag,
  onDeleteTag,
  onSelectTag,
  TAG_COLORS,
}: TagManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0]);
  const [editingTag, setEditingTag] = useState<TagType | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const getCardCountForTag = (tagId: string) => {
    return cards.filter((card) => card.tags.includes(tagId)).length;
  };

  const handleCreate = () => {
    if (!newTagName.trim()) return;
    onAddTag(newTagName.trim(), selectedColor);
    setNewTagName('');
    setSelectedColor(TAG_COLORS[0]);
    setIsCreating(false);
  };

  const handleUpdate = () => {
    if (!editingTag || !editingTag.name.trim()) return;
    onUpdateTag(editingTag.id, {
      name: editingTag.name.trim(),
      color: editingTag.color,
    });
    setEditingTag(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Tag className="w-6 h-6 text-amber-500" />
            Tags
          </h2>
          <p className="text-slate-500 mt-1">
            Organize your flashcards with tags. Cards can belong to multiple tags.
          </p>
        </div>
        <Button
          onClick={() => setIsCreating(true)}
          className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
        >
          <Plus className="w-4 h-4" />
          New Tag
        </Button>
      </div>

      {/* Tags Grid */}
      {tags.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => {
            const cardCount = getCardCountForTag(tag.id);
            return (
              <Card
                key={tag.id}
                className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                onClick={() => onSelectTag(tag.id)}
              >
                <div
                  className="absolute top-0 left-0 w-1 h-full"
                  style={{ backgroundColor: tag.color }}
                />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: tag.color + '20' }}
                    >
                      <FolderOpen className="w-5 h-5" style={{ color: tag.color }} />
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTag(tag);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-rose-500 hover:text-rose-600"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteConfirmId(tag.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <h3 className="font-semibold text-slate-800 text-lg mb-1">{tag.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Brain className="w-4 h-4" />
                    <span>
                      {cardCount} card{cardCount !== 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {cards
                      .filter((card) => card.tags.includes(tag.id))
                      .slice(0, 3)
                      .map((card) => (
                        <Badge
                          key={card.id}
                          variant="secondary"
                          className="text-xs truncate max-w-[120px]"
                        >
                          {card.front.slice(0, 20)}...
                        </Badge>
                      ))}
                    {cardCount > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{cardCount - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <Tag className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-700 mb-2">No tags yet</h3>
          <p className="text-slate-500 mb-6">Create tags to organize your flashcards</p>
          <Button
            onClick={() => setIsCreating(true)}
            className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            <Plus className="w-4 h-4" />
            Create First Tag
          </Button>
        </div>
      )}

      {/* Create Tag Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Tag</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tag Name</label>
              <Input
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="e.g., Biology, Spanish, Math..."
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                }}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Color</label>
              <div className="flex flex-wrap gap-2">
                {TAG_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={cn(
                      'w-8 h-8 rounded-lg transition-all duration-200',
                      selectedColor === color && 'ring-2 ring-offset-2 ring-slate-400 scale-110'
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreating(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!newTagName.trim()}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              Create Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      <Dialog open={!!editingTag} onOpenChange={() => setEditingTag(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
          </DialogHeader>
          {editingTag && (
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tag Name</label>
                <Input
                  value={editingTag.name}
                  onChange={(e) =>
                    setEditingTag({ ...editingTag, name: e.target.value })
                  }
                  placeholder="Tag name..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUpdate();
                  }}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Color</label>
                <div className="flex flex-wrap gap-2">
                  {TAG_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setEditingTag({ ...editingTag, color })}
                      className={cn(
                        'w-8 h-8 rounded-lg transition-all duration-200',
                        editingTag.color === color &&
                          'ring-2 ring-offset-2 ring-slate-400 scale-110'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingTag(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={!editingTag?.name.trim()}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this tag? The cards will not be deleted, but they will
              no longer be tagged.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteConfirmId) {
                  onDeleteTag(deleteConfirmId);
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
