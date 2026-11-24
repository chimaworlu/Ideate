import React, { useState } from 'react';
import Header from './components/Header';
import Stage1ChooseProblem from './components/Stage1ChooseProblem';
import Stage2UnderstandProblem from './components/Stage2UnderstandProblem';
import Stage3ExploreSolution from './components/Stage3ExploreSolution';
import Stage4YourIdea from './components/Stage4YourIdea';

const INITIAL_APP_STATE = {
  currentStage: 1,
  selectedProblem: null, // { text, type: 'suggested' | 'custom', id, savedAt }
  problemUnderstanding: null, // { targetAudience, difficulties, currentSolutions }
  solutionExploration: null,  // { solutionType, solutionTypeName, customSolutionType, solutionDescription, savedAt }
  generatedIdea: null         // Preserved product concept
};

export default function App() {
  // Shared application state across all 4 stages
  const [appState, setAppState] = useState(INITIAL_APP_STATE);

  // Stage 1 Continue: Saves problem and transitions to Stage 2
  const handleStage1Continue = (problemPayload) => {
    setAppState((prev) => {
      const isProblemChanged =
        prev.selectedProblem?.text !== problemPayload.text ||
        prev.selectedProblem?.type !== problemPayload.type ||
        prev.selectedProblem?.id !== problemPayload.id;

      return {
        ...prev,
        selectedProblem: problemPayload,
        // Invalidate downstream concept if problem actually changed
        generatedIdea: isProblemChanged ? null : prev.generatedIdea,
        currentStage: 2
      };
    });
  };

  // Stage 2 Back: Preserves draft answers and returns to Stage 1
  const handleStage2Back = (draftAnswers) => {
    setAppState((prev) => ({
      ...prev,
      problemUnderstanding: draftAnswers,
      currentStage: 1
    }));
  };

  // Stage 2 Continue: Saves validated answers and transitions to Stage 3
  const handleStage2Continue = (answersPayload) => {
    setAppState((prev) => {
      const isUnderstandingChanged =
        prev.problemUnderstanding?.targetAudience !== answersPayload.targetAudience ||
        prev.problemUnderstanding?.difficulties !== answersPayload.difficulties ||
        prev.problemUnderstanding?.currentSolutions !== answersPayload.currentSolutions;

      return {
        ...prev,
        problemUnderstanding: answersPayload,
        // Invalidate downstream concept if understanding actually changed
        generatedIdea: isUnderstandingChanged ? null : prev.generatedIdea,
        currentStage: 3
      };
    });
  };

  // Stage 3 Back: Preserves draft solution answers and returns to Stage 2
  const handleStage3Back = (draftData) => {
    setAppState((prev) => ({
      ...prev,
      solutionExploration: draftData,
      currentStage: 2
    }));
  };

  // Stage 3 Continue: Saves validated solution data, clears stale generated idea if inputs changed, and transitions to Stage 4
  const handleStage3Continue = (solutionPayload) => {
    setAppState((prev) => {
      const isSolutionModified =
        prev.solutionExploration?.solutionType !== solutionPayload.solutionType ||
        prev.solutionExploration?.customSolutionType !== solutionPayload.customSolutionType ||
        prev.solutionExploration?.solutionDescription !== solutionPayload.solutionDescription;

      return {
        ...prev,
        solutionExploration: solutionPayload,
        generatedIdea: isSolutionModified ? null : prev.generatedIdea,
        currentStage: 4
      };
    });
  };

  // Stage 4 Save Idea: Stores the generated concept in shared state
  const handleSaveGeneratedIdea = (conceptPayload) => {
    setAppState((prev) => ({
      ...prev,
      generatedIdea: conceptPayload
    }));
  };

  // Stage 4 Back: Returns to Stage 3 while preserving all answers and generated concept
  const handleStage4Back = () => {
    setAppState((prev) => ({
      ...prev,
      currentStage: 3
    }));
  };

  // Stage 4 Reset: Clears all answers and returns to Stage 1 for a fresh ideation run
  const handleReset = () => {
    setAppState(INITIAL_APP_STATE);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Application Bar */}
      <Header currentStage={appState.currentStage} totalStages={4} />

      {/* Main Content Area */}
      <main className="flex-1">
        {appState.currentStage === 1 && (
          <Stage1ChooseProblem
            initialSelection={appState.selectedProblem}
            onSaveProblem={(problem) =>
              setAppState((prev) => ({ ...prev, selectedProblem: problem }))
            }
            onContinue={handleStage1Continue}
            isSaved={Boolean(appState.selectedProblem)}
          />
        )}

        {appState.currentStage === 2 && (
          <Stage2UnderstandProblem
            selectedProblem={appState.selectedProblem}
            initialAnswers={appState.problemUnderstanding}
            onBack={handleStage2Back}
            onContinue={handleStage2Continue}
          />
        )}

        {appState.currentStage === 3 && (
          <Stage3ExploreSolution
            selectedProblem={appState.selectedProblem}
            initialData={appState.solutionExploration}
            onBack={handleStage3Back}
            onContinue={handleStage3Continue}
          />
        )}

        {appState.currentStage === 4 && (
          <Stage4YourIdea
            selectedProblem={appState.selectedProblem}
            problemUnderstanding={appState.problemUnderstanding}
            solutionExploration={appState.solutionExploration}
            cachedIdea={appState.generatedIdea}
            onSaveIdea={handleSaveGeneratedIdea}
            onReset={handleReset}
            onBack={handleStage4Back}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white">
        <div className="max-w-5xl mx-auto px-4 flex items-center justify-center">
          <p>© {new Date().getFullYear()} Ideate - Interactive Technology Ideation Experience</p>
        </div>
      </footer>
    </div>
  );
}
