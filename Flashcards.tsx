import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Star, CheckCircle, XCircle, RotateCcw, Filter, Eye, Sparkles } from 'lucide-react';
import { Adjective, CategoryType, WordProgress } from './types';
import { ADJECTIVES_DATA, CATEGORIES } from './data';
import { speakSpanish } from './audio';

interface FlashcardsProps {
  progressMap: Record<string, WordProgress>;
  onUpdateWordProgress: (wordId: string, isCorrect: boolean) => void;
  onToggleFavorite: (wordId: string) => void;
}

export const Flashcards: React.FC<FlashcardsProps> = ({
  progressMap,
  onUpdateWordProgress,
  onToggleFavorite
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'new' | 'learning' | 'mastered' | 'favorite'>('all');
  const [direction, setDirection] = useState<'ru-es' | 'es-ru'>('es-ru');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [activeGender, setActiveGender] = useState<'m' | 'f'>('m');
  const [activeNumber, setActiveNumber] = useState<'s' | 'p'>('s');
  const [sessionCount, setSessionCount] = useState<{ learned: number; review: number }>({ learned: 0, review: 0 });

  // Filter adjectives list
  const filteredList = ADJECTIVES_DATA.filter((adj) => {
    if (selectedCategory !== 'all' && adj.category !== selectedCategory) return false;
    const prog = progressMap[adj.id];
    const status = prog ? prog.status : 'new';
    if (filterStatus === 'favorite' && !prog?.isFavorite) return false;
    if (filterStatus !== 'all' && filterStatus !== 'favorite' && status !== filterStatus) return false;
    return true;
  });

  const currentAdj = filteredList[currentIndex] || filteredList[0];

  useEffect(() => {
    setIsFlipped(false);
    setActiveGender('m');
    setActiveNumber('s');
  }, [currentIndex, selectedCategory, filterStatus]);

  if (!filteredList.length) {
    return (
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 text-center max-w-lg mx-auto my-8">
        <Filter className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-slate-800 mb-2">Нет подходящих карточек</h3>
        <p className="text-slate-600 mb-4">Попробуйте изменить выбранную категорию или фильтр статуса.</p>
        <button
          onClick={() => { setSelectedCategory('all'); setFilterStatus('all'); }}
          className="px-4 py-2 bg-amber-500 hover:bg-amber-6-0 text-white font-medium rounded-xl transition"
        >
          Сбросить фильтры
        </button>
      </div>
    );
  }

  const getSpanishWord = (adj: Adjective) => {
    if (activeGender === 'm' && activeNumber === 's') return adj.spanishMasculine;
    if (activeGender === 'f' && activeNumber === 's') return adj.spanishFeminine;
    if (activeGender === 'm' && activeNumber === 'p') return adj.spanishPluralMasculine;
    return adj.spanishPluralFeminine;
  };

  const getRussianWord = (adj: Adjective) => {
    if (activeNumber === 'p' && adj.russianPlural) return adj.russianPlural;
    if (activeGender === 'f' && adj.russianFeminine) return adj.russianFeminine;
    return adj.russian;
  };

  const handleSpeech = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (currentAdj) {
      speakSpanish(getSpanishWord(currentAdj));
    }
  };

  const handleNextCard = (isCorrect: boolean) => {
    onUpdateWordProgress(currentAdj.id, isCorrect);
    
    if (isCorrect) {
      setSessionCount(prev => ({ ...prev, learned: prev.learned + 1 }));
    } else {
      setSessionCount(prev => ({ ...prev, review: prev.review + 1 }));
    }

    if (currentIndex < filteredList.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const currentProg = progressMap[currentAdj.id];
  const isFav = currentProg?.isFavorite || false;

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      {/* Category & Status & Direction Filter Bar */}
      <div className="flex flex-col gap-3 mb-6 bg-white p-4 rounded-3xl border-b-4 border-amber-200 shadow-md">
        {/* Mode / Direction Switcher */}
        <div className="flex justify-between items-center bg-amber-100/80 p-1.5 rounded-2xl border-2 border-amber-200 gap-2">
          <button
            onClick={() => { setDirection('es-ru'); setIsFlipped(false); }}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
              direction === 'es-ru'
                ? 'bg-orange-500 text-white shadow-[0_3px_0_rgb(194,65,12)]'
                : 'bg-white/60 text-slate-700 hover:bg-white'
            }`}
          >
            Испанский ➔ Перевод (Русский)
          </button>
          <button
            onClick={() => { setDirection('ru-es'); setIsFlipped(false); }}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
              direction === 'ru-es'
                ? 'bg-orange-500 text-white shadow-[0_3px_0_rgb(194,65,12)]'
                : 'bg-white/60 text-slate-700 hover:bg-white'
            }`}
          >
            Русский ➔ Перевод (Испанский)
          </button>
        </div>

        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest px-1">Категория:</span>
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentIndex(0); }}
              className="bg-amber-50 border-2 border-amber-200 rounded-2xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">Все категории ({ADJECTIVES_DATA.length})</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(['all', 'new', 'learning', 'mastered', 'favorite'] as const).map(st => (
              <button
                key={st}
                onClick={() => { setFilterStatus(st); setCurrentIndex(0); }}
                className={`px-3 py-1.5 rounded-2xl text-xs font-black uppercase transition ${
                  filterStatus === st
                    ? 'bg-orange-500 text-white shadow-[0_3px_0_rgb(194,65,12)] border-2 border-orange-600'
                    : 'bg-amber-50/80 text-slate-600 hover:bg-amber-100 border-2 border-amber-200'
                }`}
              >
                {st === 'all' && 'Все'}
                {st === 'new' && 'Новые'}
                {st === 'learning' && 'Учу'}
                {st === 'mastered' && 'Освоил'}
                {st === 'favorite' && '★ Избранные'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Counter Bar */}
      <div className="flex items-center justify-between text-xs font-black text-slate-500 uppercase tracking-wider mb-3 px-2">
        <span>
          Карточка {currentIndex + 1} из {filteredList.length}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5" /> Знаю: {sessionCount.learned}
          </span>
          <span className="text-rose-700 bg-rose-100 border border-rose-200 px-3 py-1 rounded-full flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Повторить: {sessionCount.review}
          </span>
        </div>
      </div>

      {/* Main Flashcard with 3D Flip */}
      <div className="relative h-88 w-full cursor-pointer perspective-1000 mb-6" onClick={() => setIsFlipped(!isFlipped)}>
        <motion.div
          className="w-full h-full relative duration-500 transform-style-3d transition-transform"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.4 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Front Side */}
          <div
            className="absolute inset-0 w-full h-full rounded-[36px] bg-gradient-to-br from-orange-400 via-amber-500 to-orange-600 border-b-[10px] border-orange-700 p-8 text-white shadow-2xl flex flex-col justify-between backface-hidden"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3.5 py-1 rounded-full backdrop-blur-md border border-white/30">
                {currentAdj.category}
              </span>
              <div className="flex items-center gap-1">
                {direction === 'es-ru' && (
                  <button
                    onClick={handleSpeech}
                    className="p-2.5 rounded-2xl bg-white/20 hover:bg-white/30 transition text-white border border-white/30 active:scale-95"
                    title="Озвучить"
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={(e) => { e.stopPropagation(); onToggleFavorite(currentAdj.id); }}
                  className="p-2.5 rounded-2xl hover:bg-white/20 transition text-amber-200 hover:text-white"
                  title="В избранное"
                >
                  <Star className={`w-6 h-6 ${isFav ? 'fill-amber-300 text-amber-300' : ''}`} />
                </button>
              </div>
            </div>

            <div className="text-center my-auto">
              <span className="text-xs font-black uppercase tracking-widest text-amber-100 block mb-2 opacity-90">
                {direction === 'es-ru' ? 'Испанское слово:' : 'Русское слово:'}
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-wide mb-3 drop-shadow-sm">
                {direction === 'es-ru' ? getSpanishWord(currentAdj) : getRussianWord(currentAdj)}
              </h2>
              <div className="h-1.5 w-16 bg-white/40 mx-auto rounded-full mb-3"></div>
              <span className="inline-block text-xs font-black uppercase tracking-wider text-orange-950 bg-white px-4 py-2 rounded-2xl shadow-md border border-white/50 animate-pulse">
                Нажмите, чтобы открыть перевод ↺
              </span>
            </div>

            <div className="flex justify-between items-center text-xs font-extrabold text-amber-100/90 border-t border-white/20 pt-3">
              <span>Сложность: {currentAdj.difficulty === 'easy' ? 'Легкая' : currentAdj.difficulty === 'medium' ? 'Средняя' : 'Сложная'}</span>
              <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> Открыть перевод</span>
            </div>
          </div>

          {/* Back Side (Translation) - rotateY(180deg) prevents text mirroring */}
          <div
            className="absolute inset-0 w-full h-full rounded-[36px] bg-white border-4 border-amber-300 border-b-[10px] border-amber-400 p-8 shadow-2xl flex flex-col justify-between rotate-y-180 backface-hidden"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden'
            }}
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase tracking-widest text-orange-700 bg-amber-100 border border-amber-300 px-3.5 py-1 rounded-full">
                Перевод ({direction === 'es-ru' ? 'Русский' : 'Español'})
              </span>

              {/* Audio Button */}
              <button
                onClick={handleSpeech}
                className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl transition shadow-[0_4px_0_rgb(194,65,12)] active:translate-y-0.5 flex items-center justify-center border border-orange-600"
                title="Озвучить на испанском"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="text-center my-auto">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                  {direction === 'es-ru' ? getRussianWord(currentAdj) : getSpanishWord(currentAdj)}
                </h2>
              </div>

              {/* Interactive Gender & Number Modifier Toggle */}
              <div className="flex justify-center gap-2 my-3" onClick={(e) => e.stopPropagation()}>
                <div className="bg-amber-50 p-1 rounded-2xl border border-amber-200 flex text-xs font-black text-slate-600">
                  <button
                    onClick={() => setActiveGender('m')}
                    className={`px-3 py-1 rounded-xl transition ${activeGender === 'm' ? 'bg-orange-500 text-white shadow-xs' : 'hover:text-slate-900'}`}
                  >
                    Муж. род (-o)
                  </button>
                  <button
                    onClick={() => setActiveGender('f')}
                    className={`px-3 py-1 rounded-xl transition ${activeGender === 'f' ? 'bg-orange-500 text-white shadow-xs' : 'hover:text-slate-900'}`}
                  >
                    Жен. род (-a)
                  </button>
                </div>
                <div className="bg-amber-50 p-1 rounded-2xl border border-amber-200 flex text-xs font-black text-slate-600">
                  <button
                    onClick={() => setActiveNumber('s')}
                    className={`px-3 py-1 rounded-xl transition ${activeNumber === 's' ? 'bg-orange-500 text-white shadow-xs' : 'hover:text-slate-900'}`}
                  >
                    Ед.ч.
                  </button>
                  <button
                    onClick={() => setActiveNumber('p')}
                    className={`px-3 py-1 rounded-xl transition ${activeNumber === 'p' ? 'bg-orange-500 text-white shadow-xs' : 'hover:text-slate-900'}`}
                  >
                    Мн.ч. (-s)
                  </button>
                </div>
              </div>

              {/* Example sentence */}
              <div className="bg-amber-50/80 border-2 border-amber-200 p-3.5 rounded-2xl text-left max-w-md mx-auto">
                <p className="text-sm font-black text-slate-900">{currentAdj.exampleEs}</p>
                <p className="text-xs font-bold text-slate-500 mt-0.5">{currentAdj.exampleRu}</p>
              </div>

              {currentAdj.ruleNote && (
                <p className="text-xs text-amber-900 font-bold bg-amber-100/80 rounded-xl px-3 py-1.5 mt-2 max-w-md mx-auto border border-amber-300">
                  💡 {currentAdj.ruleNote}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-slate-400 border-t border-slate-100 pt-2">
              <span>{direction === 'es-ru' ? currentAdj.spanishMasculine : currentAdj.russian}</span>
              <span>Нажмите, чтобы перевернуть обратно ↺</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => handleNextCard(false)}
          className="flex-1 max-w-xs h-16 bg-slate-200 border-b-4 border-slate-300 hover:bg-slate-300 text-slate-700 rounded-2xl font-black text-base flex items-center justify-center gap-2 transition active:translate-y-0.5"
        >
          <XCircle className="w-5 h-5 text-slate-600" />
          <span>Ещё учить</span>
        </button>

        <button
          onClick={() => handleNextCard(true)}
          className="flex-1 max-w-xs h-16 bg-orange-500 border-b-4 border-orange-700 hover:bg-orange-600 text-white rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-[0_6px_0_rgb(194,65,12)] active:translate-y-0.5 transition-all"
        >
          <CheckCircle className="w-6 h-6 text-orange-200" />
          <span>Знаю карточку!</span>
        </button>
      </div>
    </div>
  );
};
