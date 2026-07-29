import React from 'react';
import { BookOpen, Sparkles, Check, HelpCircle, Layers, ArrowRight } from 'lucide-react';

export const GrammarGuide: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Title Header */}
      <div className="bg-orange-500 text-white rounded-3xl p-6 border-b-4 border-orange-700 shadow-[0_8px_0_rgba(194,65,12,0.3)]">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8 text-amber-200" />
          <h2 className="text-2xl font-black uppercase tracking-wider">Грамматика испанских прилагательных</h2>
        </div>
        <p className="text-amber-100 text-sm font-medium leading-relaxed">
          Испанские прилагательные всегда согласуются с существительным в роде (мужской/женский) и числе (единственное/множественное).
        </p>
      </div>

      {/* Section 1: Rod / Gender */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-[0_4px_0_#fde68a] space-y-4">
        <h3 className="text-lg font-black uppercase tracking-wider text-slate-900 flex items-center gap-2.5">
          <span className="w-8 h-8 bg-orange-100 border border-orange-300 text-orange-600 rounded-2xl flex items-center justify-center text-sm font-black shrink-0">1</span>
          Образование женского рода
        </h3>

        <div className="space-y-3 text-sm text-slate-800">
          <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200">
            <span className="font-black text-slate-900 block mb-1 uppercase tracking-wider text-xs">Окончание на -o ➔ меняется на -a</span>
            <p className="text-slate-600 mb-2 font-medium">Прилагательные на <strong>-o</strong> изменяются по роду:</p>
            <div className="flex items-center gap-3 font-extrabold text-slate-900">
              <span className="bg-white px-3 py-1.5 rounded-xl border-2 border-amber-200 shadow-sm">alto (высокий)</span>
              <span className="text-orange-500 text-lg">➔</span>
              <span className="bg-white px-3 py-1.5 rounded-xl border-2 border-amber-200 text-orange-600 shadow-sm">alta (высокая)</span>
            </div>
          </div>

          <div className="bg-amber-50/40 p-4 rounded-2xl border-2 border-amber-200/70">
            <span className="font-black text-slate-900 block mb-1 uppercase tracking-wider text-xs">Окончание на -e или согласный ➔ не меняется!</span>
            <p className="text-slate-600 mb-2 font-medium">Форма одинакова и для мужского, и для женского рода:</p>
            <ul className="list-disc list-inside space-y-1 font-bold text-slate-800">
              <li>un chico <strong className="text-orange-600">inteligente</strong> / una chica <strong className="text-orange-600">inteligente</strong></li>
              <li>un libro <strong className="text-orange-600">azul</strong> / una flor <strong className="text-orange-600">azul</strong></li>
              <li>un hombre <strong className="text-orange-600">joven</strong> / una mujer <strong className="text-orange-600">joven</strong></li>
            </ul>
          </div>

          <div className="bg-amber-50/40 p-4 rounded-2xl border-2 border-amber-200/70">
            <span className="font-black text-slate-900 block mb-1 uppercase tracking-wider text-xs">Исключение: Прилагательные на -or, -ón, -án</span>
            <p className="text-slate-600 mb-2 font-medium">Добавляют букву <strong>-a</strong> в женском роде:</p>
            <p className="font-extrabold text-slate-900">trabajador (муж.) ➔ trabajador<strong className="text-orange-600">a</strong> (жен.)</p>
          </div>
        </div>
      </div>

      {/* Section 2: Plural */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-[0_4px_0_#fde68a] space-y-4">
        <h3 className="text-lg font-black uppercase tracking-wider text-slate-900 flex items-center gap-2.5">
          <span className="w-8 h-8 bg-orange-100 border border-orange-300 text-orange-600 rounded-2xl flex items-center justify-center text-sm font-black shrink-0">2</span>
          Образование множественного числа
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="bg-amber-50/60 p-4 rounded-2xl border-2 border-amber-200">
            <span className="font-black text-slate-900 block mb-1 uppercase tracking-wider text-xs">После гласной ➔ +s</span>
            <p className="text-slate-700 font-bold leading-relaxed">
              alto ➔ alto<strong className="text-orange-600">s</strong><br />
              alta ➔ alta<strong className="text-orange-600">s</strong><br />
              grande ➔ grande<strong className="text-orange-600">s</strong>
            </p>
          </div>

          <div className="bg-amber-50/60 p-4 rounded-2xl border-2 border-amber-200">
            <span className="font-black text-slate-900 block mb-1 uppercase tracking-wider text-xs">После согласной ➔ +es</span>
            <p className="text-slate-700 font-bold leading-relaxed">
              azul ➔ azul<strong className="text-orange-600">es</strong><br />
              fácil ➔ fácil<strong className="text-orange-600">es</strong><br />
              joven ➔ jóven<strong className="text-orange-600">es</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Section 3: Position & Short forms */}
      <div className="bg-white rounded-3xl p-6 border-2 border-amber-200 shadow-[0_4px_0_#fde68a] space-y-4">
        <h3 className="text-lg font-black uppercase tracking-wider text-slate-900 flex items-center gap-2.5">
          <span className="w-8 h-8 bg-orange-100 border border-orange-300 text-orange-600 rounded-2xl flex items-center justify-center text-sm font-black shrink-0">3</span>
          Позиция в предложении и усечение (Apócope)
        </h3>

        <p className="text-sm text-slate-700 font-medium">
          Обычно испанское прилагательное ставится <strong className="text-slate-900 uppercase tracking-wider text-xs">ПОСЛЕ</strong> существительного:
          <br />
          <span className="font-extrabold text-slate-900">un coche rojo</span> (красная машина), <span className="font-extrabold text-slate-900">una casa grande</span> (большой дом).
        </p>

        <div className="bg-amber-50/70 p-4 rounded-2xl border-2 border-amber-200 text-sm">
          <span className="font-black text-slate-900 block mb-2 uppercase tracking-wider text-xs">Особые усечённые формы перед существительными:</span>
          <ul className="space-y-1.5 text-slate-800 font-bold">
            <li>• <strong className="text-slate-900">bueno</strong> ➔ <strong className="text-orange-600">buen</strong> (un <em>buen</em> amigo — хороший друг)</li>
            <li>• <strong className="text-slate-900">malo</strong> ➔ <strong className="text-orange-600">mal</strong> (un <em>mal</em> día — плохой день)</li>
            <li>• <strong className="text-slate-900">grande</strong> ➔ <strong className="text-orange-600">gran</strong> (un <em>gran</em> hombre — великий человек)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
