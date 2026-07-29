import React, { useState } from 'react';
import { Search, Volume2, Star, BookOpen, Sparkles, Filter } from 'lucide-react';
import { Adjective, CategoryType, WordProgress } from './types';
import { ADJECTIVES_DATA, CATEGORIES } from './data';
import { speakSpanish } from './audio';

interface DictionaryProps {
  progressMap: Record<string, WordProgress>;
  onToggleFavorite: (wordId: string) => void;
}

export const Dictionary: React.FC<DictionaryProps> = ({ progressMap, onToggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(false);

  const filtered = ADJECTIVES_DATA.filter((adj) => {
    if (selectedCategory !== 'all' && adj.category !== selectedCategory) return false;
    if (onlyFavorites && !progressMap[adj.id]?.isFavorite) return false;

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchEs = adj.spanishMasculine.toLowerCase().includes(q) || adj.spanishFeminine.toLowerCase().includes(q);
      const matchRu = adj.russian.toLowerCase().includes(q) || (adj.russianFeminine && adj.russianFeminine.toLowerCase().includes(q));
      return matchEs || matchRu;
    }

    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Search & Filter Header */}
      <div className="bg-white p-4.5 rounded-3xl border-2 border-amber-200 shadow-[0_4px_0_#fde68a] mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Поиск по-испански или по-русски..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-amber-50/50 border-2 border-amber-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-orange-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-amber-50/50 border-2 border-amber-200 rounded-2xl px-3 py-2.5 text-xs font-black uppercase tracking-wider text-slate-800 focus:outline-none focus:border-orange-500 cursor-pointer"
          >
            <option value="all">Все категории ({ADJECTIVES_DATA.length})</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Star Filter */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`px-3.5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              onlyFavorites
                ? 'bg-orange-500 text-white shadow-[0_3px_0_rgb(194,65,12)]'
                : 'bg-amber-50 text-slate-700 hover:bg-amber-100 border-2 border-amber-200'
            }`}
          >
            <Star className={`w-4 h-4 ${onlyFavorites ? 'fill-white' : ''}`} />
            Только ★
          </button>
        </div>
      </div>

      {/* Counter */}
      <div className="text-xs font-black uppercase tracking-wider text-slate-600 mb-4 px-2">
        Найдено прилагательных: {filtered.length}
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((adj) => {
          const prog = progressMap[adj.id];
          const isFav = prog?.isFavorite || false;

          return (
            <div
              key={adj.id}
              className="bg-white rounded-3xl p-5 border-2 border-amber-200 shadow-[0_4px_0_#fde68a] hover:border-orange-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-orange-600 bg-orange-100 border border-orange-200 px-3 py-0.5 rounded-full">
                      {adj.category}
                    </span>
                    {prog?.status === 'mastered' && (
                      <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full">
                        ✓ Освоено
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => speakSpanish(adj.spanishMasculine)}
                      className="p-2 text-slate-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all border border-transparent hover:border-orange-200"
                      title="Озвучить"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => onToggleFavorite(adj.id)}
                      className="p-2 text-slate-400 hover:text-amber-500 rounded-xl transition-all"
                      title="В избранное"
                    >
                      <Star className={`w-5 h-5 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`} />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-2xl font-black text-slate-900 tracking-wide">{adj.spanishMasculine}</h3>
                    {adj.spanishFeminine !== adj.spanishMasculine && (
                      <span className="text-sm font-bold text-slate-500">/ {adj.spanishFeminine}</span>
                    )}
                  </div>
                  <p className="text-base font-black text-orange-600 mt-0.5">
                    {adj.russian} {adj.russianFeminine ? `(${adj.russianFeminine})` : ''}
                  </p>
                </div>

                {/* Forms grid */}
                <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-3 text-xs grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <span className="text-slate-500 block font-bold uppercase tracking-wider text-[10px]">Муж. род:</span>
                    <span className="font-extrabold text-slate-900">{adj.spanishMasculine} (ед) / {adj.spanishPluralMasculine} (мн)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-bold uppercase tracking-wider text-[10px]">Жен. род:</span>
                    <span className="font-extrabold text-slate-900">{adj.spanishFeminine} (ед) / {adj.spanishPluralFeminine} (мн)</span>
                  </div>
                </div>

                {/* Example */}
                <div className="text-xs text-slate-700 bg-amber-100/50 rounded-xl p-3 border border-amber-200">
                  <p className="font-extrabold text-slate-900">{adj.exampleEs}</p>
                  <p className="text-slate-600 italic mt-0.5 font-medium">{adj.exampleRu}</p>
                </div>
              </div>

              {adj.ruleNote && (
                <p className="text-xs text-orange-700 mt-3 font-bold flex items-center gap-1">
                  💡 {adj.ruleNote}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
