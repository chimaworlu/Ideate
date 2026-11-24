import React, { useState, useEffect } from 'react';
import { generateConcept } from '../utils/generateIdea';
import {
  SparklesIcon,
  RocketLaunchIcon,
  LayersIcon,
  UserGroupIcon,
  CpuChipIcon,
  CheckIcon,
  RefreshIcon,
  ArrowLeftIcon,
  DocumentDuplicateIcon,
  CheckCircleIcon
} from './Icons';

export default function Stage4YourIdea({
  selectedProblem,
  problemUnderstanding,
  solutionExploration,
  cachedIdea = null,
  onSaveIdea,
  onReset,
  onBack
}) {
  const [isLoading, setIsLoading] = useState(!cachedIdea);
  const [loadingStep, setLoadingStep] = useState(0);
  const [concept, setConcept] = useState(cachedIdea);
  const [copied, setCopied] = useState(false);

  // Progressive loading simulation
  useEffect(() => {
    if (cachedIdea) {
      setConcept(cachedIdea);
      setIsLoading(false);
      return;
    }

    const steps = [
      'Analyzing problem context & target audience...',
      'Mapping technology capabilities...',
      'Synthesizing personalized product concept...'
    ];

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 320);

    const timer = setTimeout(() => {
      const generated = generateConcept({
        selectedProblem,
        problemUnderstanding,
        solutionExploration
      });
      setConcept(generated);
      onSaveIdea(generated);
      setIsLoading(false);
    }, 1000);

    return () => {
      clearInterval(stepInterval);
      clearTimeout(timer);
    };
  }, [cachedIdea, selectedProblem, problemUnderstanding, solutionExploration, onSaveIdea]);

  const handleCopySummary = () => {
    if (!concept) return;
    const summaryText = `💡 ${concept.productName} - Ideate Concept
Tagline: ${concept.tagline}

Overview:
${concept.productOverview.summary}

Key Features:
${concept.keyFeatures.map((f, i) => `${i + 1}. ${f.title}: ${f.explanation}`).join('\n')}

Target Users: ${concept.whoItHelps.primaryUsers}
Technology: ${concept.technologyExplanation.solutionTypeName}`;

    navigator.clipboard?.writeText?.(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Loading Screen
  if (isLoading || !concept) {
    const loadingMessages = [
      'Analyzing problem context & target audience...',
      'Mapping technology capabilities...',
      'Synthesizing personalized product concept...'
    ];

    return (
      <div className="max-w-xl mx-auto px-4 py-20 sm:py-24 text-center">
        <div className="relative mx-auto w-16 h-16 sm:w-20 sm:h-20 mb-6 sm:mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-indigo-500/20 animate-ping"></div>
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white">
            <SparklesIcon className="w-7 h-7 sm:w-8 sm:h-8 animate-spin" />
          </div>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-4">
          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
          <span>Generating Concept</span>
        </div>

        <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight break-words">
          Bringing your idea to life...
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-500 h-6 transition-all duration-300">
          {loadingMessages[loadingStep]}
        </p>

        <div className="mt-8 max-w-xs mx-auto bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-indigo-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${((loadingStep + 1) / loadingMessages.length) * 100}%` }}
          ></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6 sm:space-y-8">
      {/* Stage Header */}
      <div className="text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-2.5 sm:mb-3">
          <span>Stage 4 of 4</span>
          <span className="text-indigo-300">•</span>
          <span>Your Idea</span>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight break-words">
          Here's what you could create!
        </h1>
        <p className="mt-2 sm:mt-2.5 text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
          Look what happens when you turn a problem into an opportunity.
        </p>
      </div>

      {/* Hero Product Concept Card */}
      <section className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-b from-white via-indigo-50/20 to-slate-50 p-5 sm:p-7 lg:p-9">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 mb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-xs font-semibold tracking-wide">
            <RocketLaunchIcon className="w-3.5 h-3.5" />
            <span>Product Concept</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full">
              {concept.technologyExplanation.solutionTypeName}
            </span>
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-indigo-600 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1 rounded-full transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircleIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                  <span>Copy summary</span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 break-words leading-tight">
            {concept.productName}
          </h2>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-indigo-950 leading-relaxed max-w-3xl break-words">
            {concept.tagline}
          </p>
        </div>

        {/* Product Overview Section */}
        <div className="mt-6 sm:mt-8 pt-5 sm:pt-6 border-t border-indigo-100/80 space-y-3.5 sm:space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Product Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200">
              <span className="block text-[11px] sm:text-xs font-bold text-indigo-700 uppercase tracking-wide mb-1">
                What it does
              </span>
              <p className="break-words">{concept.productOverview.summary}</p>
            </div>
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200">
              <span className="block text-[11px] sm:text-xs font-bold text-amber-700 uppercase tracking-wide mb-1">
                The problem it addresses
              </span>
              <p className="break-words">{concept.productOverview.problemAddressed}</p>
            </div>
          </div>
          <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs sm:text-sm text-indigo-950">
            <p className="font-medium break-words">{concept.productOverview.solutionValue}</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight">
            How it works
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {concept.howItWorks.map((step) => (
            <div
              key={step.step}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 flex flex-col justify-between hover:border-indigo-200 transition-all"
            >
              <div>
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center mb-2.5 sm:mb-3">
                  0{step.step}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1 break-words">{step.title}</h4>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed break-words">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Key Features Section */}
      <section className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayersIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              Key features
            </h3>
          </div>
          <span className="text-[11px] sm:text-xs font-medium text-slate-400">Tailored functionality</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {concept.keyFeatures.map((feature, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 break-words">{feature.title}</h4>
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                    {feature.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words">
                  {feature.explanation}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Two-Column Audience & Technology Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Who it helps */}
        <section className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-3.5 sm:space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-violet-50 text-violet-700 flex items-center justify-center">
              <UserGroupIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Who it helps</h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block mb-0.5">
                Target users
              </span>
              <p className="font-bold text-slate-900 break-words">{concept.whoItHelps.primaryUsers}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block mb-0.5">
                Current pain point resolved
              </span>
              <p className="text-slate-600 leading-relaxed break-words">{concept.whoItHelps.coreFrustration}</p>
            </div>

            <div>
              <span className="text-slate-400 font-semibold uppercase text-[10px] tracking-wider block mb-0.5">
                Replaces makeshift habits
              </span>
              <p className="text-slate-600 leading-relaxed break-words">{concept.whoItHelps.previousHabit}</p>
            </div>

            <div className="pt-2 border-t border-slate-100 text-slate-700 font-medium">
              <p className="break-words">{concept.whoItHelps.impactSummary}</p>
            </div>
          </div>
        </section>

        {/* Technology behind the idea */}
        <section className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 space-y-3.5 sm:space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <CpuChipIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Technology behind the idea</h3>
          </div>

          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wide block">
                Chosen format
              </span>
              <span className="font-bold text-slate-900 text-xs sm:text-sm break-words">
                {concept.technologyExplanation.solutionTypeName}
              </span>
            </div>

            <p className="text-slate-600 leading-relaxed break-words">
              {concept.technologyExplanation.summary}
            </p>

            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Technical strengths
              </span>
              {concept.technologyExplanation.highlights.map((highlight, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckIcon className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span className="break-words">{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer Navigation Action Bar */}
      <div className="pt-5 sm:pt-6 border-t border-slate-200 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 sm:gap-4">
        <button
          type="button"
          onClick={onBack}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Back to Stage 3</span>
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white active:scale-[0.98] transition-all cursor-pointer"
        >
          <RefreshIcon className="w-4 h-4" />
          <span>Try another problem</span>
        </button>
      </div>
    </div>
  );
}
