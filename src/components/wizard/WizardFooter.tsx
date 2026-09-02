"use client";

import React from "react";
import { useWizard } from "@/context/WizardContext";
import { ArrowLeft, ArrowRight, CheckCheck, SkipForward } from "lucide-react";
import clsx from "clsx";

export const WizardFooter: React.FC = () => {
  const {
    currentStepIndex,
    activeCategories,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    clearCategory,
    currentCategory,
    selections
  } = useWizard();

  const totalSteps = activeCategories.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);
  const currentSelections = selections[currentCategory.id] || [];

  return (
    <footer className="h-16 border-t border-neutral-800 bg-neutral-950/95 backdrop-blur-md px-6 flex items-center justify-between gap-4 z-20">
      {/* Back Button */}
      <button
        onClick={prevStep}
        disabled={isFirstStep}
        className={clsx(
          "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all",
          isFirstStep
            ? "text-neutral-600 bg-neutral-900/30 cursor-not-allowed border border-neutral-800/40"
            : "text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700"
        )}
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Center Progress Bar & Step Counter */}
      <div className="flex flex-col items-center gap-1.5 flex-1 max-w-xs sm:max-w-md mx-2">
        <div className="flex items-center justify-between w-full text-[11px] font-mono text-neutral-400">
          <span>
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
          <span>{progressPercent}% completed</span>
        </div>
        <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden border border-neutral-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Right Controls: Skip & Next */}
      <div className="flex items-center gap-2">
        {currentCategory.optional && currentSelections.length === 0 && (
          <button
            onClick={nextStep}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <span>Skip</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          onClick={nextStep}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-neutral-950 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
        >
          <span>{isLastStep ? "Review Selections" : "Next Category"}</span>
          {isLastStep ? (
            <CheckCheck className="w-4 h-4" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </footer>
  );
};
