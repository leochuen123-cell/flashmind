import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  X,
  RotateCw,
  Check,
  Brain,
  TrendingUp,
  Sparkles,
  ChevronLeft,
  Pause,
  Play,
} from 'lucide-react';
import type { Card as CardType, Tag as TagType } from '@/types';

interface StudyModeProps {
  cards: CardType[];
  getTagById: (id: string) => TagType | undefined;
  onReview: (cardId: string, rating: 'again' | 'hard' | 'good' | 'easy') => void;
  onExit: () => void;
}

const RATING_BUTTONS = [
  { key: 'again' as const, label: 'Again', time: '< 1m', color: 'bg-rose-500 hover:bg-rose-600', textColor: 'text-rose-600' },
  { key: 'hard' as const, label: 'Hard', time: '2d', color: 'bg-amber-500 hover:bg-amber-600', textColor: 'text-amber-600' },
  { key: 'good' as const, label: 'Good', time: '4d', color: 'bg-emerald-500 hover:bg-emerald-600', textColor: 'text-emerald-600' },
  { key: 'easy' as const, label: 'Easy', time: '7d', color: 'bg-violet-500 hover:bg-violet-600', textColor: 'text-violet-600' },
];

export function StudyMode({ cards, getTagById, onReview, onExit }: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStats, setSessionStats] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const currentCard = cards[currentIndex];
  const progress = cards.length > 0 ? ((currentIndex) / cards.length) * 100 : 0;
  const isComplete = currentIndex >= cards.length;

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;
    
    onReview(currentCard.id, rating);
    setSessionStats((prev) => ({ ...prev, [rating]: prev[rating] + 1 }));
    
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 200);
  };

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (isComplete || isPaused) return;

    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleFlip();
    } else if (isFlipped) {
      switch (e.key) {
        case '1':
          handleRate('again');
          break;
        case '2':
          handleRate('hard');
          break;
        case '3':
          handleRate('good');
          break;
        case '4':
          handleRate('easy');
          break;
      }
    }
  }, [isFlipped, isComplete, isPaused, currentCard]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  if (cards.length === 0) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
          <Brain className="w-12 h-12 text-slate-300" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Cards to Study</h2>
        <p className="text-slate-500 mb-6">You don't have any cards due for review right now.</p>
        <Button onClick={onExit} className="gap-2">
          <ChevronLeft className="w-4 h-4" />
          Go Back
        </Button>
      </div>
    );
  }

  if (isComplete) {
    const totalReviewed = sessionStats.again + sessionStats.hard + sessionStats.good + sessionStats.easy;
    const accuracy = totalReviewed > 0
      ? Math.round(((sessionStats.good + sessionStats.easy) / totalReviewed) * 100)
      : 0;

    return (
      <div className="p-8 max-w-2xl mx-auto">
        <Card className="text-center">
          <CardContent className="p-12">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-violet-200">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Session Complete!</h2>
            <p className="text-slate-500 mb-8">Great job! You've reviewed {totalReviewed} cards.</p>

            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-rose-50 rounded-lg">
                <p className="text-2xl font-bold text-rose-600">{sessionStats.again}</p>
                <p className="text-sm text-rose-500">Again</p>
              </div>
              <div className="p-4 bg-amber-50 rounded-lg">
                <p className="text-2xl font-bold text-amber-600">{sessionStats.hard}</p>
                <p className="text-sm text-amber-500">Hard</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">{sessionStats.good}</p>
                <p className="text-sm text-emerald-500">Good</p>
              </div>
              <div className="p-4 bg-violet-50 rounded-lg">
                <p className="text-2xl font-bold text-violet-600">{sessionStats.easy}</p>
                <p className="text-sm text-violet-500">Easy</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-8">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              <span className="text-slate-600">
                Accuracy: <span className="font-bold text-slate-800">{accuracy}%</span>
              </span>
            </div>

            <Button onClick={onExit} className="gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600">
              <Check className="w-4 h-4" />
              Done
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setShowExitConfirm(true)}>
            <X className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Card</span>
              <span className="font-bold text-slate-800">{currentIndex + 1}</span>
              <span className="text-sm text-slate-500">of</span>
              <span className="font-bold text-slate-800">{cards.length}</span>
            </div>
            <div className="w-32 mt-1">
              <Progress value={progress} className="h-1.5" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPaused(!isPaused)}
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </Button>
          
          <div className="flex gap-1">
            {currentCard.tags.slice(0, 3).map((tagId) => {
              const tag = getTagById(tagId);
              return tag ? (
                <Badge
                  key={tagId}
                  style={{
                    backgroundColor: tag.color + '20',
                    color: tag.color,
                  }}
                  className="text-xs"
                >
                  {tag.name}
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="relative mb-8" style={{ perspective: '1000px' }}>
        <div
          onClick={handleFlip}
          className={cn(
            'relative w-full min-h-[400px] cursor-pointer transition-all duration-500',
            'transform-gpu'
          )}
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <Card
            className={cn(
              'absolute inset-0 backface-hidden transition-opacity duration-300',
              isFlipped && 'opacity-0 pointer-events-none'
            )}
            style={{ backfaceVisibility: 'hidden' }}
          >
            <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">Question</p>
              <p className="text-2xl md:text-3xl font-medium text-slate-800 text-center whitespace-pre-wrap">
                {currentCard.front}
              </p>
              {currentCard.frontImage && (
                <img
                  src={currentCard.frontImage}
                  alt="Front"
                  className="mt-6 max-h-64 object-contain rounded-lg"
                />
              )}
              <p className="absolute bottom-6 text-sm text-slate-400 flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                Click or press Space to flip
              </p>
            </CardContent>
          </Card>

          {/* Back */}
          <Card
            className={cn(
              'absolute inset-0 backface-hidden',
              !isFlipped && 'opacity-0 pointer-events-none'
            )}
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <CardContent className="p-8 flex flex-col items-center justify-center min-h-[400px]">
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-4">Answer</p>
              <p className="text-2xl md:text-3xl font-medium text-slate-800 text-center whitespace-pre-wrap">
                {currentCard.back}
              </p>
              {currentCard.backImage && (
                <img
                  src={currentCard.backImage}
                  alt="Back"
                  className="mt-6 max-h-64 object-contain rounded-lg"
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Rating Buttons */}
      <div className={cn(
        'grid grid-cols-4 gap-3 transition-all duration-300',
        !isFlipped && 'opacity-50 pointer-events-none'
      )}>
        {RATING_BUTTONS.map((button, index) => (
          <button
            key={button.key}
            onClick={() => handleRate(button.key)}
            className={cn(
              'p-4 rounded-xl text-white transition-all duration-200',
              'hover:scale-105 hover:shadow-lg active:scale-95',
              button.color
            )}
          >
            <p className="font-semibold text-lg">{button.label}</p>
            <p className="text-sm opacity-80">{button.time}</p>
            <p className="text-xs mt-2 opacity-60">Press {index + 1}</p>
          </button>
        ))}
      </div>

      {/* Exit Confirmation */}
      {showExitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-md w-full mx-4">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">End Session?</h3>
              <p className="text-slate-500 mb-6">
                Your progress will be saved, but you won't be able to continue this session.
              </p>
              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={() => setShowExitConfirm(false)}>
                  Continue
                </Button>
                <Button onClick={onExit} variant="destructive">
                  End Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Pause Overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-sm w-full mx-4 text-center">
            <CardContent className="p-8">
              <Pause className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-800 mb-2">Session Paused</h3>
              <p className="text-slate-500 mb-6">Take your time. Click resume when you're ready.</p>
              <Button onClick={() => setIsPaused(false)} className="gap-2">
                <Play className="w-4 h-4" />
                Resume
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
