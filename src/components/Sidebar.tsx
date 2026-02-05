import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Brain,
  Library,
  Tags,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Home,
  Sparkles,
  Clock,
  Database,
} from 'lucide-react';
import type { ViewMode, Tag } from '@/types';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  selectedTagId: string | null;
  onTagSelect: (tagId: string | null) => void;
  tags: Tag[];
  dueCount: number;
  newCount: number;
  totalCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Sidebar({
  currentView,
  onViewChange,
  selectedTagId,
  onTagSelect,
  tags,
  dueCount,
  newCount,
  totalCount,
  searchQuery,
  onSearchChange,
}: SidebarProps) {
  const [isTagsExpanded, setIsTagsExpanded] = useState(true);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const navItems = [
    { id: 'dashboard' as ViewMode, label: 'Dashboard', icon: Home },
    { id: 'study' as ViewMode, label: 'Study Now', icon: Brain, badge: dueCount + newCount },
    { id: 'cards' as ViewMode, label: 'All Cards', icon: Library, badge: totalCount },
    { id: 'tags' as ViewMode, label: 'Tags', icon: Tags, badge: tags.length },
    { id: 'data' as ViewMode, label: 'Data', icon: Database },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-xl text-slate-800">FlashMind</h1>
            <p className="text-xs text-slate-500">Smart Flashcards</p>
          </div>
        </div>

        {/* Search */}
        <div className={cn(
          "relative transition-all duration-200",
          isSearchFocused && "scale-[1.02]"
        )}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search cards..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={cn(
              "pl-10 bg-slate-50 border-slate-200 transition-all duration-200",
              isSearchFocused && "bg-white border-violet-300 ring-2 ring-violet-100"
            )}
          />
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-4">
        <div className="space-y-1 mb-6">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full justify-start gap-3 h-11 relative group transition-all duration-200",
                currentView === item.id
                  ? "bg-violet-50 text-violet-700 hover:bg-violet-100"
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5 transition-transform duration-200 group-hover:scale-110",
                currentView === item.id && "text-violet-600"
              )} />
              <span className="flex-1 text-left font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <Badge
                  variant={item.id === 'study' ? 'default' : 'secondary'}
                  className={cn(
                    "text-xs px-2 py-0.5",
                    item.id === 'study' && "bg-gradient-to-r from-violet-500 to-fuchsia-500"
                  )}
                >
                  {item.badge}
                </Badge>
              )}
            </Button>
          ))}
        </div>

        {/* Tags Section */}
        <div>
          <button
            onClick={() => setIsTagsExpanded(!isTagsExpanded)}
            className="flex items-center gap-2 w-full px-2 py-2 text-sm font-semibold text-slate-500 hover:text-slate-700 transition-colors"
          >
            {isTagsExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            TAGS
          </button>

          {isTagsExpanded && (
            <div className="mt-2 space-y-1">
              <Button
                variant="ghost"
                onClick={() => onTagSelect(null)}
                className={cn(
                  "w-full justify-start gap-3 h-9 text-sm transition-all duration-200",
                  selectedTagId === null && currentView === 'cards'
                    ? "bg-slate-100 text-slate-800"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <div className="w-3 h-3 rounded-full bg-slate-300" />
                <span className="flex-1 text-left">All Cards</span>
              </Button>

              {tags.map((tag) => (
                <Button
                  key={tag.id}
                  variant="ghost"
                  onClick={() => onTagSelect(tag.id)}
                  className={cn(
                    "w-full justify-start gap-3 h-9 text-sm transition-all duration-200 group",
                    selectedTagId === tag.id
                      ? "bg-slate-100 text-slate-800"
                      : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <div
                    className="w-3 h-3 rounded-full transition-transform duration-200 group-hover:scale-125"
                    style={{ backgroundColor: tag.color }}
                  />
                  <span className="flex-1 text-left truncate">{tag.name}</span>
                </Button>
              ))}

              {tags.length === 0 && (
                <p className="text-xs text-slate-400 px-3 py-2 italic">
                  No tags yet. Create one!
                </p>
              )}
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-100">
        <Button
          onClick={() => onViewChange('create')}
          className="w-full gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white shadow-lg shadow-violet-200 transition-all duration-200 hover:shadow-xl hover:shadow-violet-200 hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          New Card
        </Button>

        <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{dueCount} due</span>
          </div>
          <div className="flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            <span>{newCount} new</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
