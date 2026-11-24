import React from 'react';
import { SparklesIcon } from './Icons';

export default function Header({ currentStage = 1, totalStages = 4 }) {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white">
            <SparklesIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="text-lg sm:text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 bg-clip-text text-transparent">
              Ideate
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium text-slate-500">
          <span className="hidden sm:inline text-slate-400">Problem-solving experience</span>
          <div className="flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span className="text-slate-700 font-semibold">Stage {currentStage}</span>
            <span className="text-slate-400">/ {totalStages}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
