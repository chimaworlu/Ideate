import React, { useState, useEffect } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, ExclamationCircleIcon } from './Icons';

export default function Stage2UnderstandProblem({
  selectedProblem,
  initialAnswers = null,
  onBack,
  onContinue
}) {
  // Controlled state initialized from shared state (preserving backwards/forwards answers)
  const [answers, setAnswers] = useState({
    targetAudience: initialAnswers?.targetAudience || '',
    difficulties: initialAnswers?.difficulties || '',
    currentSolutions: initialAnswers?.currentSolutions || ''
  });

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Sync state if initialAnswers changes externally
  useEffect(() => {
    setAnswers({
      targetAudience: initialAnswers?.targetAudience || '',
      difficulties: initialAnswers?.difficulties || '',
      currentSolutions: initialAnswers?.currentSolutions || ''
    });
  }, [initialAnswers]);

  const handleChange = (field, value) => {
    setAnswers((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  // Validation checks
  const isTargetAudienceValid = answers.targetAudience.trim().length > 0;
  const isDifficultiesValid = answers.difficulties.trim().length > 0;
  const isCurrentSolutionsValid = answers.currentSolutions.trim().length > 0;
  const isFormComplete = isTargetAudienceValid && isDifficultiesValid && isCurrentSolutionsValid;

  const handleContinueClick = (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isFormComplete) {
      return;
    }

    onContinue({
      targetAudience: answers.targetAudience.trim(),
      difficulties: answers.difficulties.trim(),
      currentSolutions: answers.currentSolutions.trim()
    });
  };

  const handleBackClick = () => {
    // Preserve any draft answers back to shared state
    onBack(answers);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Stage Header */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2.5 sm:mb-3">
          <span>Stage 2 of 4</span>
          <span className="text-indigo-300">•</span>
          <span>Understand the Problem</span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight break-words">
          Let's understand the problem.
        </h1>
        <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
          A little more context will help us explore a useful solution.
        </p>
      </div>

      {/* Selected Problem Summary Card */}
      <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Selected Problem
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                selectedProblem?.type === 'suggested'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  : 'bg-amber-50 text-amber-700 border border-amber-100'
              }`}
            >
              {selectedProblem?.type === 'suggested' ? 'Suggested' : 'Custom'}
            </span>
          </div>
          <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug break-words">
            {selectedProblem?.text || 'No problem selected yet'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleBackClick}
          className="self-start sm:self-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer shrink-0"
        >
          Change problem
        </button>
      </div>

      {/* Validation Banner if missing required answers on submit */}
      {hasAttemptedSubmit && !isFormComplete && (
        <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-3.5 sm:p-4 flex items-start gap-3 text-rose-900 animate-fadeIn">
          <ExclamationCircleIcon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-semibold">Please answer all three questions before continuing.</p>
            <p className="text-rose-700 text-xs mt-0.5">
              Each insight is required to build a well-aligned technology solution in the next stages.
            </p>
          </div>
        </div>
      )}

      {/* Question Form */}
      <form onSubmit={handleContinueClick} className="space-y-5 sm:space-y-6">
        {/* Question 1: Who experiences this problem? */}
        <div
          className={`p-4 sm:p-6 rounded-2xl border bg-white transition-all duration-200 ${
            hasAttemptedSubmit && !isTargetAudienceValid
              ? 'border-rose-300 ring-2 ring-rose-500/20'
              : 'border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <label
              htmlFor="target-audience"
              className="block text-xs sm:text-sm md:text-base font-bold text-slate-900 break-words"
            >
              1. Who experiences this problem?
            </label>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wide shrink-0">
              Required
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-2.5 sm:mb-3">
            Consider their role, stage of life, environment, or daily routine.
          </p>
          <textarea
            id="target-audience"
            rows={3}
            value={answers.targetAudience}
            onChange={(e) => handleChange('targetAudience', e.target.value)}
            placeholder="Describe the people who experience this problem..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all resize-none"
          />
          {hasAttemptedSubmit && !isTargetAudienceValid && (
            <p className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1">
              <span>This question is required.</span>
            </p>
          )}
        </div>

        {/* Question 2: What makes this problem difficult or frustrating? */}
        <div
          className={`p-4 sm:p-6 rounded-2xl border bg-white transition-all duration-200 ${
            hasAttemptedSubmit && !isDifficultiesValid
              ? 'border-rose-300 ring-2 ring-rose-500/20'
              : 'border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <label
              htmlFor="difficulties"
              className="block text-xs sm:text-sm md:text-base font-bold text-slate-900 break-words"
            >
              2. What makes this problem difficult or frustrating?
            </label>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wide shrink-0">
              Required
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-2.5 sm:mb-3">
            What is the main obstacle, emotional impact, or loss of time and energy?
          </p>
          <textarea
            id="difficulties"
            rows={3}
            value={answers.difficulties}
            onChange={(e) => handleChange('difficulties', e.target.value)}
            placeholder="What makes this difficult for them?"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all resize-none"
          />
          {hasAttemptedSubmit && !isDifficultiesValid && (
            <p className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1">
              <span>This question is required.</span>
            </p>
          )}
        </div>

        {/* Question 3: How do people currently deal with this problem? */}
        <div
          className={`p-4 sm:p-6 rounded-2xl border bg-white transition-all duration-200 ${
            hasAttemptedSubmit && !isCurrentSolutionsValid
              ? 'border-rose-300 ring-2 ring-rose-500/20'
              : 'border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <label
              htmlFor="current-solutions"
              className="block text-xs sm:text-sm md:text-base font-bold text-slate-900 break-words"
            >
              3. How do people currently deal with this problem?
            </label>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wide shrink-0">
              Required
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-2.5 sm:mb-3">
            What workarounds, makeshift tools, or informal habits do they rely on today?
          </p>
          <textarea
            id="current-solutions"
            rows={3}
            value={answers.currentSolutions}
            onChange={(e) => handleChange('currentSolutions', e.target.value)}
            placeholder="What do people do right now to manage this problem?"
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all resize-none"
          />
          {hasAttemptedSubmit && !isCurrentSolutionsValid && (
            <p className="mt-2 text-xs font-medium text-rose-600 flex items-center gap-1">
              <span>This question is required.</span>
            </p>
          )}
        </div>

        {/* Action Buttons: Back and Continue */}
        <div className="pt-4 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBackClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Back to Stage 1</span>
          </button>

          <button
            type="submit"
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isFormComplete
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]'
                : 'bg-indigo-400 text-white/90 hover:bg-indigo-500'
            }`}
          >
            <span>Continue to Stage 3</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
