import React from 'react';
import {
  BriefcaseIcon,
  ClipboardIcon,
  HomeIcon,
  BookOpenIcon,
  UsersIcon,
  CheckCircleIcon
} from './Icons';

const ICON_MAP = {
  briefcase: BriefcaseIcon,
  clipboard: ClipboardIcon,
  home: HomeIcon,
  book: BookOpenIcon,
  users: UsersIcon
};

export default function ProblemCard({ problem, isSelected, onSelect }) {
  const IconComponent = ICON_MAP[problem.icon] || BriefcaseIcon;

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group relative text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 w-full flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
        isSelected
          ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600/30'
          : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/60'
      }`}
      aria-pressed={isSelected}
    >
      <div className="flex items-start justify-between gap-3 w-full">
        <div
          className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-colors duration-200 shrink-0 ${
            isSelected
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700'
          }`}
        >
          <IconComponent className="w-5 h-5" />
        </div>

        <div className="shrink-0 pt-0.5">
          <div
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
              isSelected
                ? 'bg-indigo-600 text-white'
                : 'border border-slate-300 group-hover:border-indigo-400'
            }`}
          >
            {isSelected ? (
              <CheckCircleIcon className="w-5 h-5" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-transparent"></span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4">
        {problem.tag && (
          <span
            className={`inline-block text-[10px] sm:text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded-md mb-1.5 transition-colors ${
              isSelected
                ? 'bg-indigo-100 text-indigo-700 font-semibold'
                : 'bg-slate-100 text-slate-500 group-hover:text-slate-600'
            }`}
          >
            {problem.tag}
          </span>
        )}
        <h3
          className={`text-sm sm:text-base font-semibold transition-colors leading-snug break-words ${
            isSelected ? 'text-indigo-950' : 'text-slate-900 group-hover:text-slate-950'
          }`}
        >
          {problem.title}
        </h3>
      </div>
    </button>
  );
}
