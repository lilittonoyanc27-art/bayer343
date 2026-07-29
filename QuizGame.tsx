import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Adjective } from './types';
import { ADJECTIVES_DATA } from './data';
import { speakSpanish } from './audio';

interface QuizGameProps {
  onUpdateWordProgress: (wordId: string, isCorrect: boolean) => void;
  onRecordScore: (correct: boolean) => void;
}

export const QuizGame: React.FC<QuizGameProps> = ({ onUpdateWordProgress, onRecordScore }) => {
  const [questions, setQuestions] = useState<Adjective[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [direction, setDirection] = useState<'ru-es' | 'es-ru'>('ru-es');
  const [isFinished, setIsFinished] = useState<boolean>(false);

  useEffect(() => {
    startNewGame();
  }, [direction]);

  const startNewGame = () => {
    const shuffled = [...ADJECTIVES_DATA].sort(() => Math.random() - 0.5).slice(0, 10);
    setQuestions(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setIsFinished(false);
    setSelectedOption(null);
    setIsAnswered(false);
    generateOptionsForIndex(0, shuffled);
  };

  const generateOptionsForIndex = (index: number, list: Adjective[]) => {
    const target = list[index];
    if (!target) return;

    const correctAnswer = direction === 'ru-es' ? target.spanishMasculine : target.russian;
    const wrongAnswers = ADJECTIVES_DATA
      .filter(item => item.id !== target.id)
      .map(item => direction === 'ru-es' ? item.spanishMasculine : item.russian)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);

    const allOptions = [...wrongAnswers, correctAnswer].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  const currentQuestion = questions[currentIndex];

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const correctAnswer = direction === 'ru-es' ? currentQuestion.spanishMasculine : currentQuestion.russian;
    const isCorrect = option === correctAnswer;

    onUpdateWordProgress(currentQuestion.id, isCorrect);
    onRecordScore(isCorrect);

    if (direction === 'ru-es') {
      speakSpanish(currentQuestion.spanishMasculine);
    }

    if (isCorrect) {
      setScore(prev => prev + 10 + streak * 2);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setIsAnswered(false);
      generateOptionsForIndex(nextIdx, questions);
    } else {
      setIsFinished(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  if (isFinished) {
    return (
      <div className="bg-white rounded-3xl p-8 border-2 border-amber-200 shadow-[0_8px_0_#fde68a] text-center max-w-lg mx-auto my-6">
        <div className="w-20 h-20 bg-orange-100 border-2 border-orange-300 rounded-2xl flex items-center justify-center mx-auto mb-4 text-orange-600 shadow-[0_4px_0_#fdba74]">
          <Award className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-wider text-slate-900 mb-2">Викторина завершена!</h2>
        <p className="text-slate-600 mb-6 font-medium">Ваш итоговый счёт: <span className="text-orange-600 font-black text-2xl">{score}</span> очков!</p>

        <button
          onClick={startNewGame}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_0_rgb(194,65,12)] active:translate-y-1 active:shadow-none"
        >
          <RotateCcw className="w-5 h-5" />
          Сыграть снова
        </button>
      </div>
    );
  }

  if (!currentQuestion) return null;

  const correctAnswer = direction === 'ru-es' ? currentQuestion.spanishMasculine : currentQuestion.russian;

  return (
    <div className="max-w-xl mx-auto px-4 py-4">
      {/* Quiz Mode Switcher */}
      <div className="flex justify-between items-center mb-6 bg-amber-100/80 p-1.5 rounded-2xl border-2 border-amber-200 gap-2">
        <button
          onClick={() => setDirection('ru-es')}
          className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
            direction === 'ru-es'
              ? 'bg-orange-500 text-white shadow-[0_3px_0_rgb(194,65,12)]'
              : 'bg-white/60 text-slate-700 hover:bg-white hover:text-slate-900'
          }`}
        >
          Русский ➔ Испанский
        </button>
        <button
          onClick={() => setDirection('es-ru')}
          className={`flex-1 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all ${
            direction === 'es-ru'
              ? 'bg-orange-500 text-white shadow-[0_3px_0_rgb(194,65,12)]'
              : 'bg-white/60 text-slate-700 hover:bg-white hover:text-slate-900'
          }`}
        >
          Испанский ➔ Русский
        </button>
      </div>

      {/* Top Header stats */}
      <div className="flex justify-between items-center mb-4 text-sm font-bold">
        <span className="text-slate-600 uppercase tracking-wider text-xs">Вопрос {currentIndex + 1} из {questions.length}</span>
        <div className="flex items-center gap-3">
          <span className="text-orange-600 font-black flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-xl border border-orange-200">
            <Zap className="w-4 h-4 fill-orange-500 text-orange-500" /> {streak}
          </span>
          <span className="bg-slate-900 text-white px-3.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider shadow-[0_2px_0_#000]">
            {score} очков
          </span>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-orange-500 rounded-3xl p-6 text-white text-center border-b-4 border-orange-700 shadow-[0_8px_0_rgba(194,65,12,0.3)] mb-6 relative">
        <span className="text-[11px] font-black bg-white/20 px-3 py-1 rounded-full text-white uppercase tracking-widest inline-block border border-white/30">
          {currentQuestion.category}
        </span>
        
        <h2 className="text-3xl font-black mt-4 mb-2 tracking-wide drop-shadow-sm">
          {direction === 'ru-es' ? currentQuestion.russian : currentQuestion.spanishMasculine}
        </h2>

        {direction === 'es-ru' && (
          <button
            onClick={() => speakSpanish(currentQuestion.spanishMasculine)}
            className="mt-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-full inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider border border-white/30 transition active:scale-95"
          >
            <Volume2 className="w-4 h-4" /> Произношение
          </button>
        )}
      </div>

      {/* Options */}
      <div className="grid grid-cols-1 gap-3.5 mb-6">
        {options.map((option, idx) => {
          let btnStyle = 'bg-white text-slate-800 border-2 border-amber-200 shadow-[0_4px_0_#fde68a] hover:border-orange-400 hover:bg-orange-50 active:translate-y-1 active:shadow-none';

          if (isAnswered) {
            if (option === correctAnswer) {
              btnStyle = 'bg-emerald-100 text-emerald-950 border-2 border-emerald-500 shadow-[0_4px_0_#059669] font-extrabold';
            } else if (option === selectedOption) {
              btnStyle = 'bg-rose-100 text-rose-950 border-2 border-rose-500 shadow-[0_4px_0_#e11d48] font-extrabold';
            } else {
              btnStyle = 'bg-amber-50 text-slate-400 border-2 border-amber-100 opacity-50 shadow-none';
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleSelectOption(option)}
              className={`w-full p-4 rounded-2xl text-left font-extrabold text-base transition-all flex items-center justify-between ${btnStyle}`}
            >
              <span>{option}</span>
              {isAnswered && option === correctAnswer && (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              )}
              {isAnswered && option === selectedOption && option !== correctAnswer && (
                <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Explanation & Next button */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-2 border-amber-200 rounded-2xl p-4 mb-4 shadow-[0_4px_0_#fde68a]"
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-extrabold text-slate-900 text-sm">
              {currentQuestion.spanishMasculine} ({currentQuestion.spanishFeminine}) — {currentQuestion.russian}
            </span>
            <button
              onClick={() => speakSpanish(currentQuestion.spanishMasculine)}
              className="text-orange-600 hover:text-orange-700 flex items-center gap-1 text-xs font-black uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200"
            >
              <Volume2 className="w-4 h-4" /> Слушать
            </button>
          </div>
          <p className="text-xs text-slate-600 font-medium italic">{currentQuestion.exampleEs} ({currentQuestion.exampleRu})</p>
        </motion.div>
      )}

      {isAnswered && (
        <button
          onClick={handleNextQuestion}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_0_rgb(194,65,12)] active:translate-y-1 active:shadow-none"
        >
          <span>{currentIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить викторину'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
