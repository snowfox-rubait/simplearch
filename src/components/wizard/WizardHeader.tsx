"use client";

import React from "react";
import { useWizard } from "@/context/WizardContext";
import { CheckCircle, Eye, RefreshCw, Sparkles, Terminal } from "lucide-react";

export const WizardHeader: React.FC = () => {
  const {
    selectedCount,
    loadPreset,
    setIsReviewOpen,
    selections
  } = useWizard();

  const isWayland = (selections["display-protocol"] || []).includes("protocol-wayland");
  const isHandAssembled = (selections["desktop-architecture"] || []).includes("arch-hand-assembled");

  return (
    <header className="h-16 border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md px-6 flex items-center justify-between gap-4 z-20">
      {/* Brand & Logo */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center text-black font-bold shadow-lg shadow-cyan-500/20">
          <Terminal className="w-5 h-5 text-neutral-950" />
        </div>
        <div>
          <h1 className="text-base font-bold text-neutral-100 tracking-tight flex items-center gap-2">
            SimpleArch
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
              v6
            </span>
          </h1>
          <p className="text-[11px] text-neutral-400 hidden sm:block">
            Distro-Grade Arch Linux Desktop Architect
          </p>
        </div>
      </div>

      {/* Center Status Badges */}
      <div className="hidden md:flex items-center gap-2 font-mono text-xs">
        <div className="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>{isWayland ? "Wayland Native" : "X11 Display"}</span>
        </div>
        <div className="px-2.5 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300">
          {isHandAssembled ? "Modular Tiling" : "Full DE Suite"}
        </div>
      </div>

      {/* Action Buttons & Preset Selector */}
      <div className="flex items-center gap-2">
        {/* Preset quick buttons */}
        <div className="hidden lg:flex items-center gap-1.5 bg-neutral-900/80 p-1 rounded-lg border border-neutral-800">
          <button
            onClick={() => loadPreset("omarchy")}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded font-medium text-amber-300 hover:bg-amber-950/40 transition-colors"
            title="Load complete stack matching OmarchyOS"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Omarchy Preset</span>
          </button>
          <button
            onClick={() => loadPreset("recommended")}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded font-medium text-neutral-300 hover:text-neutral-100 hover:bg-neutral-800 transition-colors"
            title="Load standard SimpleArch recommendations"
          >
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Recommended</span>
          </button>
          <button
            onClick={() => loadPreset("clear")}
            className="text-xs px-2 py-1 rounded text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            title="Clear all selections"
          >
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>

        {/* Review Selection CTA */}
        <button
          onClick={() => setIsReviewOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-neutral-950 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
        >
          <Eye className="w-4 h-4" />
          <span>Review ({selectedCount})</span>
        </button>
      </div>
    </header>
  );
};
