import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, RotateCcw, CheckCircle2, ArrowRight, Delete } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Adjective } from './types';
import { ADJECTIVES_DATA } from './data';
import { speakSpanish } from './audio';

interface TileLetter {
  id: string; // unique letter id
  char: string;
  isUsed: boolean;
}

export const SpellingGame: React.FC = () => {
  const [words, setWords] = useState<Adjective[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [scrambledLetters, setScrambledLetters] = useState<TileLetter[]>([]);
  const [selectedLetterIds, setSelectedLetterIds] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const list = [...ADJECTIVES_DATA].sort(() => Math.random() - 0.5).slice(0, 7);
    setWords(list);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setupWord(0, list);
  };

  const setupWord = (index: number, list: Adjective[]) => {
    const target = list[index];
    if (!target) return;

    const targetWord = target.spanishMasculine.toLowerCase();
    const chars = targetWord.split('');

    // Add 2 extra random distractor letters
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const extra1 = alphabet[Math.floor(Math.random() * alphabet.length)];
    const extra2 = alphabet[Math.floor(Math.random() * alphabet.length)];
    
    const allChars = [...chars, extra1, extra2].sort(() => Math.random() - 0.5);

    const tiles: TileLetter[] = allChars.map((char, i) => ({
      id: `${char}-${i}-${Math.random()}`,
      char,
      isUsed: false
    }));

    setScrambledLetters(tiles);
    setSelectedLetterIds([]);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const currentWord = words[currentIndex];

  const handleTileClick = (tile: TileLetter) => {
    if (isAnswered || tile.isUsed) return;

    // Mark as used
    setScrambledLetters(prev =>
      prev.map(t => t.id === tile.id ? { ...t, isUsed: true } : t)
    );

    setSelectedLetterIds(prev => [...prev, tile.id]);
  };

  const handleRemoveLetter = (tileId: string) => {
    if (isAnswered) return;

    setScrambledLetters(prev =>
      prev.map(t => t.id === tileId ? { ...t, isUsed: false } : t)
    );

    setSelectedLetterIds(prev => prev.filter(id => id !== tileId));
  };

  const handleClear = () => {
    if (isAnswered) return;
    setScrambledLetters(prev => prev.map(t => ({ ...t, isUsed: false })));
    setSelectedLetterIds([]);
  };

  const constructedWord = selectedLetterIds
    .map(id => scrambledLetters.find(t => t.id === id)?.char || '')
    .join('');

  const targetWordClean = currentWord?.spanishMasculine.toLowerCase() || '';

  const handleCheck = () => {
    if (isAnswered) return;

    const correct = constructedWord === targetWordClean;
    setIsAnswered(true);
    setIsCorrect(correct);

    speakSpanish(currentWord.spanishMasculine);

    if (correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setupWord(nextIdx, words);
    } else {
      setIsFinished(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 border-2 border-amber-200 shadow-[0_8px_0_#fde68a] text-center max-w-lg mx-auto my-6">
        <h2 className="text-2xl font-black uppercase tracking-wider text-slate-900 mb-2">Написание изучено!</h2>
        <p className="text-slate-600 mb-6 font-medium">
          Вы правильно собрали <span className="font-black text-orange-600 text-2xl">{score}</span> из {words.length} слов!
        </p>

        <button
          onClick={startNewGame}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_0_rgb(194,65,12)] active:translate-y-1 active:shadow-none"
        >
          <RotateCcw className="w-5 h-5" />
          Собрать новые слова
        </button>
      </div>
    );
  }

  if (!currentWord) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-6 bg-white border-2 border-amber-200 shadow-[0_4px_0_#fde68a] p-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-800">
        <span>Слово {currentIndex + 1} из {words.length}</span>
        <span className="text-orange-600 bg-orange-100 px-3 py-1 rounded-xl border border-orange-200">Счёт: {score}</span>
      </div>

      <div className="bg-orange-500 rounded-3xl p-6 text-white text-center border-b-4 border-orange-700 shadow-[0_8px_0_rgba(194,65,12,0.3)] mb-6">
        <p className="text-[11px] font-black uppercase tracking-widest text-amber-100 mb-2 bg-white/20 inline-block px-3 py-1 rounded-full border border-white/30">
          Соберите слово из букв на испанском:
        </p>
        <h2 className="text-3xl font-black mb-1 tracking-wide">
          {currentWord.russian}
        </h2>
        <button
          onClick={() => speakSpanish(currentWord.spanishMasculine)}
          className="mt-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider border border-white/30 transition active:scale-95"
        >
          <Volume2 className="w-4 h-4" /> Подсказка
        </button>
      </div>

      {/* Answer Slots */}
      <div className="min-h-16 bg-white border-2 border-amber-200 shadow-[0_4px_0_#fde68a] rounded-2xl p-3 flex flex-wrap items-center justify-center gap-2 mb-4">
        {selectedLetterIds.length === 0 ? (
          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Нажимайте на буквы ниже...</span>
        ) : (
          selectedLetterIds.map((id) => {
            const tile = scrambledLetters.find(t => t.id === id);
            return (
              <button
                key={id}
                onClick={() => handleRemoveLetter(id)}
                className="w-11 h-11 bg-orange-500 text-white rounded-xl font-black text-xl shadow-[0_3px_0_rgb(194,65,12)] hover:bg-orange-600 transition flex items-center justify-center border-2 border-orange-600 active:translate-y-0.5 active:shadow-none"
              >
                {tile?.char}
              </button>
            );
          })
        )}
      </div>

      {/* Letter Bank */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {scrambledLetters.map((tile) => (
          <button
            key={tile.id}
            disabled={tile.isUsed || isAnswered}
            onClick={() => handleTileClick(tile)}
            className={`w-12 h-12 rounded-xl font-black text-xl transition-all border-2 ${
              tile.isUsed
                ? 'bg-amber-50 border-amber-100 text-slate-300 cursor-not-allowed opacity-40 shadow-none'
                : 'bg-white border-amber-200 text-slate-800 shadow-[0_4px_0_#fde68a] hover:border-orange-400 hover:bg-orange-50 active:translate-y-1 active:shadow-none'
            }`}
          >
            {tile.char}
          </button>
        ))}
      </div>

      {/* Control Buttons */}
      {!isAnswered ? (
        <div className="flex gap-3">
          <button
            onClick={handleClear}
            className="p-4 bg-amber-100 hover:bg-amber-200 text-slate-800 border-2 border-amber-200 rounded-2xl font-black transition shadow-[0_3px_0_#fde68a] active:translate-y-0.5 active:shadow-none flex items-center justify-center"
            title="Очистить"
          >
            <Delete className="w-5 h-5" />
          </button>

          <button
            onClick={handleCheck}
            disabled={selectedLetterIds.length === 0}
            className="flex-1 py-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-black uppercase tracking-wider rounded-2xl transition-all shadow-[0_4px_0_rgb(194,65,12)] active:translate-y-1 active:shadow-none"
          >
            Проверить ответ
          </button>
        </div>
      ) : (
        <div>
          <div className={`p-4 rounded-2xl border-2 mb-4 font-black text-center ${
            isCorrect ? 'bg-emerald-100 border-emerald-500 text-emerald-950 shadow-[0_4px_0_#059669]' : 'bg-rose-100 border-rose-500 text-rose-950 shadow-[0_4px_0_#e11d48]'
          }`}>
            {isCorrect ? 'Правильно! 🎉' : `Неверно. Правильное слово: ${currentWord.spanishMasculine}`}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_0_rgb(194,65,12)] active:translate-y-1 active:shadow-none"
          >
            <span>{currentIndex < words.length - 1 ? 'Следующее слово' : 'Завершить'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
