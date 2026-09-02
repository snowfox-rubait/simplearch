"use client";

import React from "react";
import { WizardProvider } from "@/context/WizardContext";
import { WizardHeader } from "@/components/wizard/WizardHeader";
import { WizardSidebar } from "@/components/wizard/WizardSidebar";
import { CategoryView } from "@/components/wizard/CategoryView";
import { WizardFooter } from "@/components/wizard/WizardFooter";
import { SelectionReviewModal } from "@/components/wizard/SelectionReviewModal";

export const WizardLayout: React.FC = () => {
  return (
    <WizardProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 font-sans selection:bg-cyan-500 selection:text-black">
        <WizardHeader />

        <div className="flex flex-1 overflow-hidden relative">
          <WizardSidebar />
          <main className="flex-1 flex flex-col overflow-hidden bg-neutral-900/10">
            <CategoryView />
          </main>
        </div>

        <WizardFooter />
        <SelectionReviewModal />
      </div>
    </WizardProvider>
  );
};
