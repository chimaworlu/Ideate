import React, { useState, useEffect } from 'react';
import { SOLUTION_TYPES } from '../data/solutions';
import {
  GlobeIcon,
  DeviceMobileIcon,
  CpuChipIcon,
  CogIcon,
  LightBulbIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ExclamationCircleIcon
} from './Icons';

const ICON_MAP = {
  globe: GlobeIcon,
  mobile: DeviceMobileIcon,
  ai: CpuChipIcon,
  cog: CogIcon,
  lightbulb: LightBulbIcon
};

export default function Stage3ExploreSolution({
  selectedProblem,
  initialData = null,
  onBack,
  onContinue
}) {
  const [solutionType, setSolutionType] = useState(initialData?.solutionType || '');
  const [customSolutionType, setCustomSolutionType] = useState(
    initialData?.customSolutionType || ''
  );
  const [solutionDescription, setSolutionDescription] = useState(
    initialData?.solutionDescription || ''
  );

  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  // Sync state if initialData changes externally
  useEffect(() => {
    setSolutionType(initialData?.solutionType || '');
    setCustomSolutionType(initialData?.customSolutionType || '');
    setSolutionDescription(initialData?.solutionDescription || '');
  }, [initialData]);

  // Validation
  const isTypeSelected = Boolean(solutionType);
  const isCustomTypeValid =
    solutionType !== 'something-else' || customSolutionType.trim().length > 0;
  const isDescriptionValid = solutionDescription.trim().length > 0;
  const isFormComplete = isTypeSelected && isCustomTypeValid && isDescriptionValid;

  const handleSelectType = (typeId) => {
    setSolutionType(typeId);
    if (typeId !== 'something-else') {
      setCustomSolutionType('');
    }
  };

  const handleBackClick = () => {
    // Save draft data back to shared state
    onBack({
      solutionType,
      customSolutionType,
      solutionDescription
    });
  };

  const handleContinueClick = (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    if (!isFormComplete) {
      return;
    }

    const selectedTypeObj = SOLUTION_TYPES.find((t) => t.id === solutionType);

    onContinue({
      solutionType,
      solutionTypeName:
        solutionType === 'something-else'
          ? customSolutionType.trim()
          : selectedTypeObj?.title || solutionType,
      customSolutionType: customSolutionType.trim(),
      solutionDescription: solutionDescription.trim(),
      savedAt: new Date().toISOString()
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Stage Header */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2.5 sm:mb-3">
          <span>Stage 3 of 4</span>
          <span className="text-indigo-300">•</span>
          <span>Explore a Solution</span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight break-words">
          Let's explore a solution.
        </h1>
        <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed">
          Now that we understand the problem, let's think about how technology could help make things better.
        </p>
      </div>

      {/* Selected Problem Summary Card */}
      <div className="mb-6 sm:mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Original Problem
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
            {selectedProblem?.text || 'No problem selected'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleBackClick}
          className="self-start sm:self-center text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer shrink-0"
        >
          Review problem details
        </button>
      </div>

      {/* Validation Banner if missing required answers on submit */}
      {hasAttemptedSubmit && !isFormComplete && (
        <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-3.5 sm:p-4 flex items-start gap-3 text-rose-900 animate-fadeIn">
          <ExclamationCircleIcon className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <p className="font-semibold">Please complete all required fields before continuing.</p>
            <ul className="text-rose-700 text-xs mt-1 list-disc list-inside space-y-0.5">
              {!isTypeSelected && <li>Choose a solution type.</li>}
              {solutionType === 'something-else' && !isCustomTypeValid && (
                <li>Describe the custom type of solution you have in mind.</li>
              )}
              {!isDescriptionValid && (
                <li>Describe what you want this solution to help people do.</li>
              )}
            </ul>
          </div>
        </div>
      )}

      <form onSubmit={handleContinueClick} className="space-y-6 sm:space-y-8">
        {/* Question 1: Solution Type Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs sm:text-sm md:text-base font-bold text-slate-900 break-words">
              What type of solution would you like to explore?
            </label>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wide shrink-0">
              Required
            </span>
          </div>
          <p className="text-xs text-slate-500">
            Pick the technology format that feels best suited for solving this problem.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {SOLUTION_TYPES.map((type) => {
              const isSelected = solutionType === type.id;
              const IconComponent = ICON_MAP[type.icon] || GlobeIcon;

              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleSelectType(type.id)}
                  className={`group relative text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600/30'
                      : 'border-slate-200 bg-white hover:border-indigo-300 hover:bg-slate-50/60'
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex items-start justify-between gap-2 w-full">
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700'
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all ${
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

                  <div className="mt-3">
                    <h3
                      className={`text-xs sm:text-sm font-bold transition-colors break-words ${
                        isSelected ? 'text-indigo-950' : 'text-slate-900'
                      }`}
                    >
                      {type.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {type.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Conditional input for 'Something else' */}
          {solutionType === 'something-else' && (
            <div className="mt-4 p-3.5 sm:p-4 rounded-xl border border-indigo-200 bg-indigo-50/40 animate-fadeIn space-y-2">
              <label
                htmlFor="custom-solution-type"
                className="block text-xs font-bold text-slate-800 break-words"
              >
                Describe the type of solution you have in mind <span className="text-rose-500">*</span>
              </label>
              <input
                id="custom-solution-type"
                type="text"
                value={customSolutionType}
                onChange={(e) => setCustomSolutionType(e.target.value)}
                placeholder="e.g. Smart hardware, wearable device, chrome extension, kiosk..."
                className={`w-full rounded-xl border bg-white px-3 sm:px-3.5 py-2 sm:py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                  hasAttemptedSubmit && !isCustomTypeValid
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/20'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20'
                }`}
              />
              {hasAttemptedSubmit && !isCustomTypeValid && (
                <p className="text-xs font-medium text-rose-600">
                  Please describe the custom solution type you have in mind.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Question 2: Describe your idea */}
        <div
          className={`p-4 sm:p-6 rounded-2xl border bg-white transition-all duration-200 ${
            hasAttemptedSubmit && !isDescriptionValid
              ? 'border-rose-300 ring-2 ring-rose-500/20'
              : 'border-slate-200 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
            <label
              htmlFor="solution-description"
              className="block text-xs sm:text-sm md:text-base font-bold text-slate-900 break-words"
            >
              What would you want this solution to help people do?
            </label>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wide shrink-0">
              Required
            </span>
          </div>
          <p className="text-xs text-slate-500 mb-2.5 sm:mb-3">
            Focus on the primary outcome, core feature, or breakthrough experience this technology provides.
          </p>

          <textarea
            id="solution-description"
            rows={4}
            value={solutionDescription}
            onChange={(e) => setSolutionDescription(e.target.value)}
            placeholder="Describe what you imagine your solution would help people do..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all resize-none"
          />

          <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
            <span>{solutionDescription.trim().length} characters</span>
            {solutionDescription && (
              <button
                type="button"
                onClick={() => setSolutionDescription('')}
                className="text-slate-400 hover:text-slate-600 font-medium hover:underline cursor-pointer"
              >
                Clear text
              </button>
            )}
          </div>

          {hasAttemptedSubmit && !isDescriptionValid && (
            <p className="mt-2 text-xs font-medium text-rose-600">
              This description is required to generate your product concept.
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
            <span>Back to Stage 2</span>
          </button>

          <button
            type="submit"
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              isFormComplete
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98]'
                : 'bg-indigo-400 text-white/90 hover:bg-indigo-500'
            }`}
          >
            <span>Continue to Stage 4</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
