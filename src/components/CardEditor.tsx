import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  Plus,
  X,
  Upload,
  Trash2,
  Save,
  ArrowLeft,
  Tag,
} from 'lucide-react';
import type { Card as CardType, Tag as TagType } from '@/types';

interface CardEditorProps {
  card?: CardType;
  tags: TagType[];
  onSave: (card: {
    front: string;
    back: string;
    frontImage?: string;
    backImage?: string;
    tags: string[];
  }) => void;
  onCancel: () => void;
  onAddTag: (name: string) => string;
}

export function CardEditor({ card, tags, onSave, onCancel, onAddTag }: CardEditorProps) {
  const [front, setFront] = useState(card?.front || '');
  const [back, setBack] = useState(card?.back || '');
  const [frontImage, setFrontImage] = useState(card?.frontImage || '');
  const [backImage, setBackImage] = useState(card?.backImage || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(card?.tags || []);
  const [newTagName, setNewTagName] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  
  const frontImageInputRef = useRef<HTMLInputElement>(null);
  const backImageInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!card;
  const isValid = front.trim() && back.trim();

  const handleSave = () => {
    if (!isValid) return;
    onSave({
      front: front.trim(),
      back: back.trim(),
      frontImage: frontImage || undefined,
      backImage: backImage || undefined,
      tags: selectedTags,
    });
  };

  const handleImageUpload = (side: 'front' | 'back', file: File) => {
    if (!file.type.startsWith('image/')) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (side === 'front') {
        setFrontImage(result);
      } else {
        setBackImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (side: 'front' | 'back') => {
    if (side === 'front') {
      setFrontImage('');
    } else {
      setBackImage('');
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const handleCreateTag = () => {
    if (!newTagName.trim()) return;
    const tagId = onAddTag(newTagName.trim());
    setSelectedTags((prev) => [...prev, tagId]);
    setNewTagName('');
    setIsAddingTag(false);
  };

  const availableTags = tags.filter((tag) => !selectedTags.includes(tag.id));

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              {isEditing ? 'Edit Card' : 'Create New Card'}
            </h2>
            <p className="text-slate-500">
              {isEditing ? 'Update your flashcard' : 'Add a new flashcard to your collection'}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={!isValid}
          className="gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isEditing ? 'Update' : 'Save'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('front')}
          className={cn(
            'px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2',
            activeTab === 'front'
              ? 'bg-violet-100 text-violet-700'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          )}
        >
          Front Side
          {frontImage && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
        </button>
        <button
          onClick={() => setActiveTab('back')}
          className={cn(
            'px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2',
            activeTab === 'back'
              ? 'bg-violet-100 text-violet-700'
              : 'bg-white text-slate-600 hover:bg-slate-50'
          )}
        >
          Back Side
          {backImage && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
        </button>
      </div>

      {/* Editor Content */}
      <div className="space-y-6">
        {/* Front Side */}
        {activeTab === 'front' && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Question / Front
                  </Label>
                  <Textarea
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                    placeholder="Enter the question or prompt..."
                    className="min-h-[120px] text-lg"
                  />
                </div>

                {/* Front Image */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Image (optional)</Label>
                  {frontImage ? (
                    <div className="relative group">
                      <img
                        src={frontImage}
                        alt="Front"
                        className="w-full max-h-64 object-contain rounded-lg border border-slate-200"
                      />
                      <button
                        onClick={() => removeImage('front')}
                        className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => frontImageInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all"
                    >
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500">Click to upload an image</p>
                      <p className="text-xs text-slate-400 mt-1">JPG, PNG, GIF up to 5MB</p>
                    </div>
                  )}
                  <input
                    ref={frontImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload('front', file);
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back Side */}
        {activeTab === 'back' && (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium mb-2 block">
                    Answer / Back
                  </Label>
                  <Textarea
                    value={back}
                    onChange={(e) => setBack(e.target.value)}
                    placeholder="Enter the answer or explanation..."
                    className="min-h-[120px] text-lg"
                  />
                </div>

                {/* Back Image */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Image (optional)</Label>
                  {backImage ? (
                    <div className="relative group">
                      <img
                        src={backImage}
                        alt="Back"
                        className="w-full max-h-64 object-contain rounded-lg border border-slate-200"
                      />
                      <button
                        onClick={() => removeImage('back')}
                        className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => backImageInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-all"
                    >
                      <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-slate-500">Click to upload an image</p>
                      <p className="text-xs text-slate-400 mt-1">JPG, PNG, GIF up to 5MB</p>
                    </div>
                  )}
                  <input
                    ref={backImageInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload('back', file);
                    }}
                    className="hidden"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tags Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-5 h-5 text-slate-400" />
              <Label className="text-base font-medium">Tags</Label>
            </div>

            {/* Selected Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedTags.map((tagId) => {
                const tag = tags.find((t) => t.id === tagId);
                if (!tag) return null;
                return (
                  <Badge
                    key={tagId}
                    style={{
                      backgroundColor: tag.color + '20',
                      color: tag.color,
                      borderColor: tag.color + '40',
                    }}
                    variant="outline"
                    className="gap-1 px-3 py-1.5 cursor-pointer hover:opacity-80"
                    onClick={() => toggleTag(tagId)}
                  >
                    {tag.name}
                    <X className="w-3 h-3" />
                  </Badge>
                );
              })}
              {selectedTags.length === 0 && (
                <p className="text-slate-400 text-sm italic">No tags selected</p>
              )}
            </div>

            {/* Available Tags */}
            {availableTags.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-slate-500 mb-2">Click to add:</p>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="secondary"
                      className="gap-1 px-3 py-1.5 cursor-pointer hover:bg-slate-200 transition-colors"
                      onClick={() => toggleTag(tag.id)}
                    >
                      <Plus className="w-3 h-3" />
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Tag */}
            {isAddingTag ? (
              <div className="flex gap-2">
                <Input
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Tag name..."
                  className="flex-1"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateTag();
                    if (e.key === 'Escape') setIsAddingTag(false);
                  }}
                />
                <Button onClick={handleCreateTag} size="sm">
                  Add
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsAddingTag(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingTag(true)}
                className="gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Tag
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Preview */}
        {(front || back || frontImage || backImage) && (
          <Card className="bg-slate-50">
            <CardContent className="p-6">
              <h3 className="text-sm font-medium text-slate-500 mb-4 uppercase tracking-wider">
                Preview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs text-slate-400 uppercase mb-2">Front</p>
                  {front ? (
                    <p className="text-slate-800">{front}</p>
                  ) : (
                    <p className="text-slate-400 italic">Empty</p>
                  )}
                  {frontImage && (
                    <img
                      src={frontImage}
                      alt="Front preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <p className="text-xs text-slate-400 uppercase mb-2">Back</p>
                  {back ? (
                    <p className="text-slate-800">{back}</p>
                  ) : (
                    <p className="text-slate-400 italic">Empty</p>
                  )}
                  {backImage && (
                    <img
                      src={backImage}
                      alt="Back preview"
                      className="mt-2 w-full h-32 object-cover rounded-lg"
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
