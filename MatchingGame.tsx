import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Award, CheckCircle2, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Adjective } from './types';
import { ADJECTIVES_DATA } from './data';
import { speakSpanish } from './audio';

interface Tile {
  id: string; // unique tile id
  wordId: string;
  text: string;
  lang: 'es' | 'ru';
  isMatched: boolean;
}

interface MatchingGameProps {
  onRecordScore: (correct: boolean) => void;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({ onRecordScore }) => {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongPairIds, setWrongPairIds] = useState<string[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isCompleted && tiles.length > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCompleted, tiles]);

  const startNewGame = () => {
    const selectedList = [...ADJECTIVES_DATA].sort(() => Math.random() - 0.5).slice(0, 6);
    const newTiles: Tile[] = [];

    selectedList.forEach((adj) => {
      newTiles.push({
        id: `${adj.id}-es`,
        wordId: adj.id,
        text: adj.spanishMasculine,
        lang: 'es',
        isMatched: false,
      });
      newTiles.push({
        id: `${adj.id}-ru`,
        wordId: adj.id,
        text: adj.russian,
        lang: 'ru',
        isMatched: false,
      });
    });

    setTiles(newTiles.sort(() => Math.random() - 0.5));
    setSelectedTile(null);
    setMatchedIds([]);
    setWrongPairIds([]);
    setTimer(0);
    setIsCompleted(false);
  };

  const handleTileClick = (tile: Tile) => {
    if (tile.isMatched || matchedIds.includes(tile.id)) return;
    if (wrongPairIds.length > 0) return; // ignore clicks during wrong animation

    if (!selectedTile) {
      setSelectedTile(tile);
      if (tile.lang === 'es') speakSpanish(tile.text);
      return;
    }

    if (selectedTile.id === tile.id) {
      setSelectedTile(null);
      return;
    }

    // Match check
    if (selectedTile.wordId === tile.wordId && selectedTile.lang !== tile.lang) {
      // Success match!
      const newMatched = [...matchedIds, selectedTile.id, tile.id];
      setMatchedIds(newMatched);
      setSelectedTile(null);
      onRecordScore(true);

      if (tile.lang === 'es') speakSpanish(tile.text);
      else speakSpanish(selectedTile.text);

      if (newMatched.length === tiles.length) {
        setIsCompleted(true);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } else {
      // Wrong match
      setWrongPairIds([selectedTile.id, tile.id]);
      onRecordScore(false);
      setTimeout(() => {
        setWrongPairIds([]);
        setSelectedTile(null);
      }, 800);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-4">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-6 bg-white border-2 border-amber-200 shadow-[0_4px_0_#fde68a] p-3.5 rounded-2xl">
        <span className="font-black text-slate-900 text-xs uppercase tracking-wider">Сопоставьте пары слов</span>
        <span className="text-orange-600 font-black text-xs uppercase tracking-wider flex items-center gap-1 bg-orange-100 px-3 py-1 rounded-xl border border-orange-200">
          ⏱️ Время: {timer} сек.
        </span>
      </div>

      {isCompleted ? (
        <div className="bg-white rounded-3xl p-8 border-2 border-amber-200 shadow-[0_8px_0_#fde68a] text-center max-w-lg mx-auto my-6">
          <div className="w-20 h-20 bg-emerald-100 border-2 border-emerald-300 rounded-2xl flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-[0_4px_0_#a7f3d0]">
            <Award className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider text-slate-900 mb-2">Отличная работа!</h2>
          <p className="text-slate-600 mb-6 font-medium">Вы нашли все 6 пар за <span className="font-black text-slate-900">{timer} секунд</span>!</p>

          <button
            onClick={startNewGame}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-wider rounded-2xl flex items-center justify-center gap-2 transition-all shadow-[0_4px_0_rgb(194,65,12)] active:translate-y-1 active:shadow-none"
          >
            <RotateCcw className="w-5 h-5" />
            Собрать новые пары
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5">
          {tiles.map((tile) => {
            const isMatched = matchedIds.includes(tile.id);
            const isSelected = selectedTile?.id === tile.id;
            const isWrong = wrongPairIds.includes(tile.id);

            let btnClass = 'bg-white border-2 border-amber-200 text-slate-800 shadow-[0_4px_0_#fde68a] hover:border-orange-400 hover:bg-orange-50 active:translate-y-1 active:shadow-none';

            if (isMatched) {
              btnClass = 'bg-emerald-50 border-2 border-emerald-200 text-emerald-800 opacity-40 shadow-none cursor-default';
            } else if (isWrong) {
              btnClass = 'bg-rose-100 border-2 border-rose-500 text-rose-900 shadow-[0_4px_0_#e11d48] animate-bounce font-black';
            } else if (isSelected) {
              btnClass = 'bg-orange-500 border-2 border-orange-600 text-white shadow-[0_4px_0_rgb(194,65,12)] font-black scale-105';
            }

            return (
              <button
                key={tile.id}
                disabled={isMatched}
                onClick={() => handleTileClick(tile)}
                className={`p-4 rounded-2xl text-center font-extrabold text-base transition-all h-24 flex items-center justify-center relative ${btnClass}`}
              >
                <span>{tile.text}</span>
                {isMatched && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 absolute top-2 right-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
