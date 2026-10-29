"use client";

import React from "react";
import { CatalogProvider } from "@/context/CatalogContext";
import { WikiHeader } from "@/components/wiki/WikiHeader";
import { WikiSidebar } from "@/components/wiki/WikiSidebar";
import { WikiCategoryView } from "@/components/wiki/WikiCategoryView";
import { ScriptTerminalModal } from "@/components/wiki/ScriptTerminalModal";

export const WikiLayout: React.FC = () => {
  return (
    <CatalogProvider>
      <div className="flex flex-col h-screen w-screen overflow-hidden bg-neutral-950 text-neutral-100 font-sans selection:bg-[#1793d1] selection:text-black">
        <WikiHeader />

        <div className="flex flex-1 overflow-hidden relative">
          <WikiSidebar />
          <main className="flex-1 flex flex-col overflow-hidden bg-neutral-950/40">
            <WikiCategoryView />
          </main>
        </div>

        <ScriptTerminalModal />
      </div>
    </CatalogProvider>
  );
};
