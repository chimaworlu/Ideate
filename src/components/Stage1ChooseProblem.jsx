import React, { useState, useEffect } from 'react';
import { SUGGESTED_PROBLEMS } from '../data/problems';
import ProblemCard from './ProblemCard';
import { ArrowRightIcon, CheckCircleIcon, ExclamationCircleIcon } from './Icons';

export default function Stage1ChooseProblem({
  initialSelection = null,
  onSaveProblem,
  onContinue = null,
  isSaved = false
}) {
  // If an initial selection was passed from shared state, determine whether it was suggested or custom
  const [selectedSuggestedId, setSelectedSuggestedId] = useState(() => {
    if (initialSelection?.type === 'suggested') {
      return initialSelection.id || null;
    }
    return null;
  });

  const [customProblem, setCustomProblem] = useState(() => {
    if (initialSelection?.type === 'custom') {
      return initialSelection.text || '';
    }
    return '';
  });

  const [hasSubmitted, setHasSubmitted] = useState(isSaved);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Sync state if initialSelection changes externally (e.g., on application reset)
  useEffect(() => {
    if (initialSelection?.type === 'suggested') {
      setSelectedSuggestedId(initialSelection.id || null);
      setCustomProblem('');
    } else if (initialSelection?.type === 'custom') {
      setCustomProblem(initialSelection.text || '');
      setSelectedSuggestedId(null);
    } else if (!initialSelection) {
      setSelectedSuggestedId(null);
      setCustomProblem('');
    }
    setHasSubmitted(isSaved);
  }, [initialSelection, isSaved]);

  // Handle clicking a suggested card
  const handleSelectSuggested = (problem) => {
    setSelectedSuggestedId(problem.id);
    setCustomProblem(''); // Clear custom problem when suggested is picked
    setHasSubmitted(false);
  };

  // Handle typing a custom problem
  const handleCustomChange = (e) => {
    const val = e.target.value;
    setCustomProblem(val);
    setSelectedSuggestedId(null); // Clear suggested selection when typing custom
    setHasSubmitted(false);
  };

  // Determine current active problem
  const activeSuggested = SUGGESTED_PROBLEMS.find((p) => p.id === selectedSuggestedId);
  const isCustomActive = customProblem.trim().length > 0;
  const isSelected = Boolean(activeSuggested || isCustomActive);

  const currentProblemText = activeSuggested
    ? activeSuggested.title
    : isCustomActive
    ? customProblem.trim()
    : '';

  const handleContinue = (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isSelected) {
      return;
    }

    const problemPayload = {
      text: currentProblemText,
      type: activeSuggested ? 'suggested' : 'custom',
      id: activeSuggested ? activeSuggested.id : null,
      savedAt: new Date().toISOString()
    };

    onSaveProblem(problemPayload);
    setHasSubmitted(true);

    if (onContinue) {
      onContinue(problemPayload);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Stage Header */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2.5 sm:mb-3">
          <span>Stage 1 of 4</span>
          <span className="text-indigo-300">•</span>
          <span>Choose a Problem</span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight break-words">
          What problem would you like to solve?
        </h1>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-slate-600 max-w-2xl leading-relaxed">
          Choose a problem you've experienced or describe one of your own. Every great idea starts somewhere.
        </p>
      </div>

      {/* Validation Banner if user attempts to continue without selecting or describing a problem */}
      {hasAttemptedSubmit && !isSelected && (
        <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-3.5 sm:p-4 flex items-start gap-3 text-rose-900 animate-fadeIn">
          <ExclamationCircleIcon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-semibold">Please select or describe a problem before continuing.</p>
            <p className="text-rose-700 text-xs mt-0.5">
              Choose one of the suggested problems below or type your own custom problem.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleContinue} className="space-y-6 sm:space-y-8">
        {/* Suggested Problems Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Suggested Problems
            </h2>
            <span className="text-xs text-slate-400">Select one</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {SUGGESTED_PROBLEMS.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                isSelected={selectedSuggestedId === problem.id}
                onSelect={() => handleSelectSuggested(problem)}
              />
            ))}
          </div>
        </div>

        {/* Divider with 'or' */}
        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-slate-50 px-3 text-slate-400 font-semibold tracking-wider">
              or create your own
            </span>
          </div>
        </div>

        {/* Custom Problem Input Section */}
        <div
          className={`p-4 sm:p-6 rounded-2xl border transition-all duration-200 bg-white ${
            isCustomActive
              ? 'border-indigo-600 ring-1 ring-indigo-600/30'
              : hasAttemptedSubmit && !isSelected
              ? 'border-rose-300 ring-1 ring-rose-500/20'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <label
              htmlFor="custom-problem-textarea"
              className="block text-xs sm:text-sm font-semibold text-slate-900"
            >
              Or describe your own problem
            </label>
            {isCustomActive && (
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                Active selection
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mb-3">
            In 1-2 sentences, express the frustration, obstacle, or challenge you encounter.
          </p>
          <div className="relative">
            <textarea
              id="custom-problem-textarea"
              rows={3}
              value={customProblem}
              onChange={handleCustomChange}
              placeholder="Tell us about a problem you'd like to solve..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all resize-none"
            />
          </div>
          {customProblem && (
            <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
              <span>{customProblem.trim().length} characters</span>
              <button
                type="button"
                onClick={() => setCustomProblem('')}
                className="text-slate-400 hover:text-slate-600 text-xs font-medium hover:underline cursor-pointer"
              >
                Clear text
              </button>
            </div>
          )}
        </div>

        {/* State Saved Feedback Banner (if submitted) */}
        {hasSubmitted && !onContinue && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 flex items-start gap-3 text-emerald-900">
            <CheckCircleIcon className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <p className="font-semibold">Problem saved to shared application state!</p>
              <p className="text-emerald-700 mt-0.5 break-words">
                Selected: <span className="font-medium italic">"{currentProblemText}"</span> ({activeSuggested ? 'Suggested' : 'Custom'})
              </p>
              <p className="text-emerald-600 text-xs mt-1">
                Subsequent stages will use this problem as the foundation.
              </p>
            </div>
          </div>
        )}

        {/* Sticky/Bottom Continue Action Bar */}
        <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="text-xs text-slate-500 text-center sm:text-left">
            {isSelected ? (
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block shrink-0"></span>
                <span>Ready to continue with your selected problem</span>
              </span>
            ) : (
              <span>Please select a suggested option or write your own problem to proceed</span>
            )}
          </div>

          <button
            type="submit"
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]'
                : 'bg-indigo-400 text-white/90 hover:bg-indigo-500'
            }`}
          >
            <span>Continue</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
