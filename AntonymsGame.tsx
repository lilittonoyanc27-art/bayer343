import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Award, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Adjective } from './types';
import { ADJECTIVES_DATA } from './data';
import { speakSpanish } from './audio';

export const AntonymsGame: React.FC = () => {
  const [pairs, setPairs] = useState<{ main: Adjective; antonym: Adjective }[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [options, setOptions] = useState<Adjective[]>([]);
  const [selected, setSelected] = useState<Adjective | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    generatePairs();
  }, []);

  const generatePairs = () => {
    // Find all adjectives that have antonymId
    const antonymAdjs = ADJECTIVES_DATA.filter(adj => adj.antonymId);
    const generated: { main: Adjective; antonym: Adjective }[] = [];

    const usedIds = new Set<string>();

    antonymAdjs.forEach((adj) => {
      if (usedIds.has(adj.id)) return;
      const ant = ADJECTIVES_DATA.find(a => a.id === adj.antonymId);
      if (ant) {
        generated.push({ main: adj, antonym: ant });
        usedIds.add(adj.id);
        usedIds.add(ant.id);
      }
    });

    const shuffledPairs = generated.sort(() => Math.random() - 0.5).slice(0, 8);
    setPairs(shuffledPairs);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelected(null);
    setIsAnswered(false);
    if (shuffledPairs.length > 0) {
      setupQuestion(0, shuffledPairs);
    }
  };

  const setupQuestion = (index: number, list: { main: Adjective; antonym: Adjective }[]) => {
    const current = list[index];
    if (!current) return;

    // Pick 3 wrong options
    const wrong = ADJECTIVES_DATA
      .filter(a => a.id !== current.antonym.id && a.id !== current.main.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allOpts = [...wrong, current.antonym].sort(() => Math.random() - 0.5);
    setOptions(allOpts);
  };

  const currentPair = pairs[currentIndex];

  const handleSelect = (option: Adjective) => {
    if (isAnswered) return;

    setSelected(option);
    setIsAnswered(true);

    const isCorrect = option.id === currentPair.antonym.id;
    if (isCorrect) {
      setScore(prev => prev + 1);
      speakSpanish(option.spanishMasculine);
    } else {
      speakSpanish(currentPair.antonym.spanishMasculine);
    }
  };

  const handleNext = () => {
    if (currentIndex < pairs.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelected(null);
      setIsAnswered(false);
      setupQuestion(nextIdx, pairs);
    } else {
      setIsFinished(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 border-2 border-amber-200 shadow-[0_8px_0_#fde68a] text-center max-w-lg mx-auto my-6">
        <h2 className="text-2xl font-black uppercase tracking-wider text-slate-900 mb-2">Отличный результат!</h2>
        <p className="text-slate-600 mb-6 font-medium">
          Вы нашли противоположности для <span className="font-black text-orange-600 text-2xl">{score}</span> из {pairs.length} слов!
        </p>

        <button
          onClick={generatePairs}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_0_rgb(194,65,12)] active:translate-y-1 active:shadow-none"
        >
          <RotateCcw className="w-5 h-5" />
          Играть снова
        </button>
      </div>
    );
  }

  if (!currentPair) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-4">
      <div className="flex justify-between items-center mb-6 bg-white border-2 border-amber-200 shadow-[0_4px_0_#fde68a] p-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-800">
        <span>Противоположности {currentIndex + 1} из {pairs.length}</span>
        <span className="text-orange-600 bg-orange-100 px-3 py-1 rounded-xl border border-orange-200">Счёт: {score}</span>
      </div>

      <div className="bg-orange-500 rounded-3xl p-6 text-white text-center border-b-4 border-orange-700 shadow-[0_8px_0_rgba(194,65,12,0.3)] mb-6">
        <p className="text-[11px] font-black uppercase tracking-widest text-amber-100 mb-2 bg-white/20 inline-block px-3 py-1 rounded-full border border-white/30">
          Найдите противоположность (антоним):
        </p>
        <h2 className="text-3xl font-black mb-1 tracking-wide">
          {currentPair.main.spanishMasculine}
        </h2>
        <p className="text-sm text-amber-100 font-medium italic">({currentPair.main.russian})</p>
      </div>

      <div className="grid grid-cols-1 gap-3.5 mb-6">
        {options.map((opt) => {
          let btnStyle = 'bg-white text-slate-800 border-2 border-amber-200 shadow-[0_4px_0_#fde68a] hover:border-orange-400 hover:bg-orange-50 active:translate-y-1 active:shadow-none';

          if (isAnswered) {
            if (opt.id === currentPair.antonym.id) {
              btnStyle = 'bg-emerald-100 text-emerald-950 border-2 border-emerald-500 shadow-[0_4px_0_#059669] font-extrabold';
            } else if (opt.id === selected?.id) {
              btnStyle = 'bg-rose-100 text-rose-950 border-2 border-rose-500 shadow-[0_4px_0_#e11d48] font-extrabold';
            } else {
              btnStyle = 'bg-amber-50 text-slate-400 border-2 border-amber-100 opacity-50 shadow-none';
            }
          }

          return (
            <button
              key={opt.id}
              disabled={isAnswered}
              onClick={() => handleSelect(opt)}
              className={`p-4 rounded-2xl text-left font-extrabold text-base transition-all flex items-center justify-between ${btnStyle}`}
            >
              <div>
                <span className="text-lg font-black">{opt.spanishMasculine}</span>
                <span className="text-xs text-slate-500 font-medium ml-2">({opt.russian})</span>
              </div>
              {isAnswered && opt.id === currentPair.antonym.id && (
                <span className="text-xs bg-emerald-200 text-emerald-950 font-black px-2.5 py-1 rounded-lg uppercase tracking-wider">
                  ✓ Антоним
                </span>
              )}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_0_rgb(194,65,12)] active:translate-y-1 active:shadow-none"
        >
          <span>{currentIndex < pairs.length - 1 ? 'Далее' : 'Завершить'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
