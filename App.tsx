import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  Gamepad2, 
  Layers, 
  Flame, 
  Award, 
  CheckCircle, 
  RotateCcw, 
  GraduationCap,
  Volume2,
  HelpCircle,
  Puzzle,
  SpellCheck,
  Grid
} from 'lucide-react';
import { ActiveTab, GameMode, WordProgress, UserStats } from './types';
import { ADJECTIVES_DATA } from './data';
import { Flashcards } from './Flashcards';
import { QuizGame } from './QuizGame';
import { MatchingGame } from './MatchingGame';
import { AgreementGame } from './AgreementGame';
import { AntonymsGame } from './AntonymsGame';
import { SpellingGame } from './SpellingGame';
import { Dictionary } from './Dictionary';
import { GrammarGuide } from './GrammarGuide';

const STATS_STORAGE_KEY = 'es_adj_user_stats_v1';
const PROGRESS_STORAGE_KEY = 'es_adj_word_progress_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('flashcards');
  const [activeGameMode, setActiveGameMode] = useState<GameMode>('quiz');

  // Stats state
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem(STATS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {
      streak: 1,
      lastActiveDate: new Date().toISOString().slice(0, 10),
      totalAnswered: 0,
      correctAnswered: 0,
    };
  });

  // Progress state
  const [progressMap, setProgressMap] = useState<Record<string, WordProgress>>(() => {
    try {
      const saved = localStorage.getItem(PROGRESS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return {};
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progressMap));
    } catch (e) {
      console.error(e);
    }
  }, [progressMap]);

  // Update progress for a single word
  const handleUpdateWordProgress = (wordId: string, isCorrect: boolean) => {
    setProgressMap((prev) => {
      const existing = prev[wordId] || {
        wordId,
        status: 'new',
        correctCount: 0,
        incorrectCount: 0,
      };

      const newCorrect = existing.correctCount + (isCorrect ? 1 : 0);
      const newIncorrect = existing.incorrectCount + (!isCorrect ? 1 : 0);

      let newStatus = existing.status;
      if (newCorrect >= 3) {
        newStatus = 'mastered';
      } else if (newCorrect > 0 || newIncorrect > 0) {
        newStatus = 'learning';
      }

      return {
        ...prev,
        [wordId]: {
          ...existing,
          status: newStatus,
          correctCount: newCorrect,
          incorrectCount: newIncorrect,
          lastReviewed: Date.now(),
        },
      };
    });

    handleRecordScore(isCorrect);
  };

  const handleToggleFavorite = (wordId: string) => {
    setProgressMap((prev) => {
      const existing = prev[wordId] || {
        wordId,
        status: 'new',
        correctCount: 0,
        incorrectCount: 0,
      };
      return {
        ...prev,
        [wordId]: {
          ...existing,
          isFavorite: !existing.isFavorite,
        },
      };
    });
  };

  const handleRecordScore = (isCorrect: boolean) => {
    setStats((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      let newStreak = prev.streak;

      if (prev.lastActiveDate !== today) {
        // Simple streak update logic
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        if (prev.lastActiveDate === yesterday) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      }

      return {
        ...prev,
        streak: newStreak,
        lastActiveDate: today,
        totalAnswered: prev.totalAnswered + 1,
        correctAnswered: prev.correctAnswered + (isCorrect ? 1 : 0),
      };
    });
  };

  // Derived counts
  const totalWordsCount = ADJECTIVES_DATA.length;
  const masteredCount = (Object.values(progressMap) as WordProgress[]).filter((p) => p.status === 'mastered').length;
  const learningCount = (Object.values(progressMap) as WordProgress[]).filter((p) => p.status === 'learning').length;
  const accuracy = stats.totalAnswered > 0 
    ? Math.round((stats.correctAnswered / stats.totalAnswered) * 100) 
    : 100;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans flex flex-col antialiased">
      {/* Top Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center text-white shadow-md font-black text-lg">
              ES
            </div>
            <div>
              <h1 className="text-lg font-black text-slate-900 leading-tight">
                Испанские прилагательные
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Карточки, проверка и 5 развивающих игр
              </p>
            </div>
          </div>

          {/* User Stats Pill Bar */}
          <div className="flex items-center gap-2 text-xs font-bold">
            <div className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full flex items-center gap-1">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{stats.streak} день</span>
            </div>

            <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-full flex items-center gap-1 hidden md:flex">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Освоено: {masteredCount} / {totalWordsCount}</span>
            </div>

            <div className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-full font-bold">
              {accuracy}% точность
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-5xl mx-auto px-4 border-t border-slate-100 flex overflow-x-auto gap-1 py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm whitespace-nowrap flex items-center gap-2 transition ${
              activeTab === 'flashcards'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>🎴 Карточки с проверкой</span>
          </button>

          <button
            onClick={() => setActiveTab('games')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm whitespace-nowrap flex items-center gap-2 transition ${
              activeTab === 'games'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>🎮 Игры ({5})</span>
          </button>

          <button
            onClick={() => setActiveTab('dictionary')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm whitespace-nowrap flex items-center gap-2 transition ${
              activeTab === 'dictionary'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>📖 Словарь</span>
          </button>

          <button
            onClick={() => setActiveTab('grammar')}
            className={`px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm whitespace-nowrap flex items-center gap-2 transition ${
              activeTab === 'grammar'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>💡 Грамматика</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto pb-12">
        {activeTab === 'flashcards' && (
          <Flashcards
            progressMap={progressMap}
            onUpdateWordProgress={handleUpdateWordProgress}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'games' && (
          <div className="max-w-3xl mx-auto px-4 py-6">
            {/* Game Selector Pills */}
            <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-1.5 mb-6">
              <button
                onClick={() => setActiveGameMode('quiz')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  activeGameMode === 'quiz' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Викторина</span>
              </button>

              <button
                onClick={() => setActiveGameMode('matching')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  activeGameMode === 'matching' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Пары слов</span>
              </button>

              <button
                onClick={() => setActiveGameMode('agreement')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  activeGameMode === 'agreement' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Согласование</span>
              </button>

              <button
                onClick={() => setActiveGameMode('antonyms')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  activeGameMode === 'antonyms' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Антонимы</span>
              </button>

              <button
                onClick={() => setActiveGameMode('spelling')}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  activeGameMode === 'spelling' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>Собери слово</span>
              </button>
            </div>

            {/* Render selected game */}
            {activeGameMode === 'quiz' && (
              <QuizGame
                onUpdateWordProgress={handleUpdateWordProgress}
                onRecordScore={handleRecordScore}
              />
            )}

            {activeGameMode === 'matching' && (
              <MatchingGame onRecordScore={handleRecordScore} />
            )}

            {activeGameMode === 'agreement' && (
              <AgreementGame />
            )}

            {activeGameMode === 'antonyms' && (
              <AntonymsGame />
            )}

            {activeGameMode === 'spelling' && (
              <SpellingGame />
            )}
          </div>
        )}

        {activeTab === 'dictionary' && (
          <Dictionary
            progressMap={progressMap}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {activeTab === 'grammar' && (
          <GrammarGuide />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>Изучение испанских прилагательных с озвучкой и проверкой знаний • 2026</p>
      </footer>
    </div>
  );
}
