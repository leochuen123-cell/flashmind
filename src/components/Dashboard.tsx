import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';
import {
  Brain,
  Plus,
  Library,
  Tags,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import type { Card as CardType, Tag } from '@/types';

interface DashboardProps {
  dueCards: number;
  newCards: number;
  totalCards: number;
  totalTags: number;
  learningCards: number;
  matureCards: number;
  onStudyClick: () => void;
  onCreateClick: () => void;
  onViewCards: () => void;
  onViewTags: () => void;
  recentCards: CardType[];
  getTagById: (id: string) => Tag | undefined;
}

export function Dashboard({
  dueCards,
  newCards,
  totalCards,
  totalTags,
  learningCards,
  matureCards,
  onStudyClick,
  onCreateClick,
  onViewCards,
  onViewTags,
  recentCards,
  getTagById,
}: DashboardProps) {
  const hasDueCards = dueCards > 0;
  const hasNewCards = newCards > 0;
  const studyAvailable = hasDueCards || hasNewCards;

  const masteryPercentage = totalCards > 0
    ? Math.round((matureCards / totalCards) * 100)
    : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Welcome back! 👋
        </h2>
        <p className="text-slate-500">
          You have {dueCards} cards due for review and {newCards} new cards to learn.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className={cn(
          "relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
          studyAvailable ? "border-violet-200" : "border-slate-200 opacity-70"
        )} onClick={studyAvailable ? onStudyClick : undefined}>
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-200">
                <Brain className="w-6 h-6 text-white" />
              </div>
              {studyAvailable && (
                <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">
                  {dueCards + newCards} ready
                </Badge>
              )}
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Study Now</h3>
            <p className="text-sm text-slate-500">
              {studyAvailable ? 'Start your learning session' : 'No cards to study'}
            </p>
          </CardContent>
        </Card>

        <Card 
          className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-emerald-200"
          onClick={onCreateClick}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-200">
                <Plus className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Create Card</h3>
            <p className="text-sm text-slate-500">Add a new flashcard</p>
          </CardContent>
        </Card>

        <Card 
          className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-blue-200"
          onClick={onViewCards}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-200">
                <Library className="w-6 h-6 text-white" />
              </div>
              <Badge variant="secondary">{totalCards}</Badge>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">All Cards</h3>
            <p className="text-sm text-slate-500">Browse your collection</p>
          </CardContent>
        </Card>

        <Card 
          className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-amber-200"
          onClick={onViewTags}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardContent className="p-6 relative">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-200">
                <Tags className="w-6 h-6 text-white" />
              </div>
              <Badge variant="secondary">{totalTags}</Badge>
            </div>
            <h3 className="font-semibold text-slate-800 mb-1">Manage Tags</h3>
            <p className="text-sm text-slate-500">Organize with tags</p>
          </CardContent>
        </Card>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Progress Card */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Learning Progress</h3>
                  <p className="text-sm text-slate-500">Your mastery level</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-2xl font-bold text-slate-800">{masteryPercentage}%</span>
                <p className="text-xs text-slate-500">mastery</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">New Cards</span>
                  <span className="font-medium text-slate-800">{newCards}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${totalCards > 0 ? (newCards / totalCards) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Learning</span>
                  <span className="font-medium text-slate-800">{learningCards}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all duration-500"
                    style={{ width: `${totalCards > 0 ? (learningCards / totalCards) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">Mature</span>
                  <span className="font-medium text-slate-800">{matureCards}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-400 to-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${totalCards > 0 ? (matureCards / totalCards) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Due Cards Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Due for Review</h3>
                <p className="text-sm text-slate-500">Cards waiting</p>
              </div>
            </div>

            <div className="text-center py-4">
              <span className={cn(
                "text-5xl font-bold",
                dueCards > 0 ? "text-rose-500" : "text-slate-300"
              )}>
                {dueCards}
              </span>
              <p className="text-slate-500 mt-2">
                {dueCards === 0 ? 'All caught up!' : 'cards to review'}
              </p>
            </div>

            {dueCards > 0 && (
              <Button 
                onClick={onStudyClick}
                className="w-full mt-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600"
              >
                Review Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Cards */}
      {recentCards.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Recently Added
            </h3>
            <Button variant="ghost" size="sm" onClick={onViewCards}>
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCards.slice(0, 3).map((card) => (
              <Card 
                key={card.id} 
                className="group cursor-pointer transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex gap-1 flex-wrap">
                      {card.tags.slice(0, 2).map((tagId) => {
                        const tag = getTagById(tagId);
                        return tag ? (
                          <Badge 
                            key={tagId}
                            style={{ backgroundColor: tag.color + '20', color: tag.color, borderColor: tag.color + '40' }}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag.name}
                          </Badge>
                        ) : null;
                      })}
                      {card.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{card.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                    {card.isNew && (
                      <Badge className="bg-emerald-100 text-emerald-700 text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                  <p className="text-slate-800 font-medium line-clamp-2 mb-2">
                    {card.front}
                  </p>
                  <p className="text-slate-500 text-sm line-clamp-2">
                    {card.back}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
