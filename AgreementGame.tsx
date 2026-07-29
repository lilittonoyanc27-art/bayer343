import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Volume2, CheckCircle2, XCircle, ArrowRight, RotateCcw, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Adjective } from './types';
import { ADJECTIVES_DATA } from './data';
import { speakSpanish } from './audio';

interface Exercise {
  nounPhrase: string; // e.g. "Una chica"
  gender: 'f' | 'm';
  number: 's' | 'p';
  adjective: Adjective;
  correctAnswer: string; // e.g. "bonita"
  options: string[]; // e.g. ["bonito", "bonita", "bonitos", "bonitas"]
  translationRu: string; // e.g. "Красивая девушка"
}

export const AgreementGame: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    generateExercises();
  }, []);

  const generateExercises = () => {
    const list = [...ADJECTIVES_DATA].sort(() => Math.random() - 0.5).slice(0, 8);
    
    const nounsList = [
      { noun: 'Un chico', gender: 'm', number: 's', ruNoun: 'Мальчик' },
      { noun: 'Una chica', gender: 'f', number: 's', ruNoun: 'Девушка' },
      { noun: 'Unos chicos', gender: 'm', number: 'p', ruNoun: 'Мальчики' },
      { noun: 'Unas chicas', gender: 'f', number: 'p', ruNoun: 'Девушки' },
      { noun: 'El libro', gender: 'm', number: 's', ruNoun: 'Книга' },
      { noun: 'La casa', gender: 'f', number: 's', ruNoun: 'Дом' },
      { noun: 'Los amigos', gender: 'm', number: 'p', ruNoun: 'Друзья' },
      { noun: 'Las flores', gender: 'f', number: 'p', ruNoun: 'Цветы' }
    ] as const;

    const generated: Exercise[] = list.map((adj) => {
      const nounObj = nounsList[Math.floor(Math.random() * nounsList.length)];
      
      let correct = adj.spanishMasculine;
      let adjRu = adj.russian;

      if (nounObj.gender === 'f' && nounObj.number === 's') {
        correct = adj.spanishFeminine;
        adjRu = adj.russianFeminine || adj.russian;
      } else if (nounObj.gender === 'm' && nounObj.number === 'p') {
        correct = adj.spanishPluralMasculine;
        adjRu = adj.russianPlural || adj.russian;
      } else if (nounObj.gender === 'f' && nounObj.number === 'p') {
        correct = adj.spanishPluralFeminine;
        adjRu = adj.russianPlural || adj.russian;
      }

      // Collect unique options
      const optsSet = new Set([
        adj.spanishMasculine,
        adj.spanishFeminine,
        adj.spanishPluralMasculine,
        adj.spanishPluralFeminine
      ]);

      return {
        nounPhrase: nounObj.noun,
        gender: nounObj.gender,
        number: nounObj.number,
        adjective: adj,
        correctAnswer: correct,
        options: Array.from(optsSet).sort(() => Math.random() - 0.5),
        translationRu: `${adjRu} ${nounObj.ruNoun.toLowerCase()}`
      };
    });

    setExercises(generated);
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
    setSelectedOption(null);
    setIsAnswered(false);
  };

  const current = exercises[currentIndex];

  const handleSelect = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === current.correctAnswer;
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    speakSpanish(`${current.nounPhrase} ${option}`);
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    }
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 border-2 border-amber-200 shadow-[0_8px_0_#fde68a] text-center max-w-lg mx-auto my-6">
        <h2 className="text-2xl font-black uppercase tracking-wider text-slate-900 mb-2">Согласование усвоено!</h2>
        <p className="text-slate-600 mb-6 font-medium">
          Вы верно ответили на <span className="font-black text-orange-600 text-2xl">{score}</span> из {exercises.length} упражнений!
        </p>

        <button
          onClick={generateExercises}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_0_rgb(194,65,12)] active:translate-y-1 active:shadow-none"
        >
          <RotateCcw className="w-5 h-5" />
          Новый раунд упражнений
        </button>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="max-w-xl mx-auto px-4 py-4">
      {/* Exercise progress */}
      <div className="flex justify-between items-center mb-6 bg-white border-2 border-amber-200 shadow-[0_4px_0_#fde68a] p-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-slate-800">
        <span>Упражнение {currentIndex + 1} из {exercises.length}</span>
        <span className="text-orange-600 bg-orange-100 px-3 py-1 rounded-xl border border-orange-200">Счёт: {score}</span>
      </div>

      <div className="bg-orange-500 rounded-3xl p-8 text-white text-center border-b-4 border-orange-700 shadow-[0_8px_0_rgba(194,65,12,0.3)] mb-6">
        <p className="text-[11px] font-black uppercase tracking-widest text-amber-100 mb-2 bg-white/20 inline-block px-3 py-1 rounded-full border border-white/30">
          Форма ({current.gender === 'm' ? 'Муж. род' : 'Жен. род'}, {current.number === 's' ? 'Ед.ч.' : 'Мн.ч.'}):
        </p>
        
        <h2 className="text-3xl font-black mb-3 tracking-wide">
          {current.nounPhrase}{' '}
          <span className="border-b-4 border-white px-3 py-0.5 inline-block text-amber-100">
            {selectedOption || '______'}
          </span>
        </h2>

        <p className="text-sm text-amber-100 font-medium italic">({current.translationRu})</p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3.5 mb-6">
        {current.options.map((opt, idx) => {
          let btnStyle = 'bg-white text-slate-800 border-2 border-amber-200 shadow-[0_4px_0_#fde68a] hover:border-orange-400 hover:bg-orange-50 active:translate-y-1 active:shadow-none';

          if (isAnswered) {
            if (opt === current.correctAnswer) {
              btnStyle = 'bg-emerald-100 text-emerald-950 border-2 border-emerald-500 shadow-[0_4px_0_#059669] font-extrabold';
            } else if (opt === selectedOption) {
              btnStyle = 'bg-rose-100 text-rose-950 border-2 border-rose-500 shadow-[0_4px_0_#e11d48] font-extrabold';
            } else {
              btnStyle = 'bg-amber-50 text-slate-400 border-2 border-amber-100 opacity-50 shadow-none';
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleSelect(opt)}
              className={`p-4 rounded-2xl text-center font-extrabold text-lg transition-all flex items-center justify-between ${btnStyle}`}
            >
              <span>{opt}</span>
              {isAnswered && opt === current.correctAnswer && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              {isAnswered && opt === selectedOption && opt !== current.correctAnswer && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Grammar Explanation Box */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-amber-200 rounded-2xl p-4 mb-4 text-xs text-slate-700 shadow-[0_4px_0_#fde68a]"
        >
          <div className="font-black flex items-center gap-1.5 mb-1.5 text-sm uppercase tracking-wider text-orange-600">
            <HelpCircle className="w-4 h-4 text-orange-500" />
            Правило согласования:
          </div>
          <p className="font-medium leading-relaxed">
            Существительное <strong>{current.nounPhrase}</strong> относится к {current.gender === 'm' ? 'мужскому роду' : 'женскому роду'} ({current.number === 's' ? 'единственное число' : 'множественное число'}).
            Прилагательное <strong>{current.adjective.spanishMasculine}</strong> в этой форме принимает вид <strong className="text-orange-600">{current.correctAnswer}</strong>.
          </p>
        </motion.div>
      )}

      {isAnswered && (
        <button
          onClick={handleNext}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_0_rgb(194,65,12)] active:translate-y-1 active:shadow-none"
        >
          <span>{currentIndex < exercises.length - 1 ? 'Далее' : 'Завершить'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
