"use client";

import React, { useState } from "react";
import { useCatalog } from "@/context/CatalogContext";
import { Terminal, Copy, Check, Download, X, AlertTriangle, Loader2 } from "lucide-react";

export const ScriptTerminalModal: React.FC = () => {
  const { isTerminalOpen, closeTerminal, scriptResult, selectedCount } = useCatalog();
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  if (!isTerminalOpen || !scriptResult) return null;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(scriptResult.command);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptResult.script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([scriptResult.script], { type: "text/x-shellscript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simplearch-install.sh";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-4xl max-h-[92vh] bg-neutral-950 border border-neutral-800 rounded-lg flex flex-col shadow-2xl overflow-hidden font-mono">
        {/* Terminal Header Bar */}
        <div className="p-3 border-b border-neutral-800 bg-neutral-900/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-300">
            <Terminal className="w-4 h-4 text-[#1793d1]" />
            <span className="font-semibold text-neutral-100">SimpleArch Orchestration Script</span>
            <span className="text-neutral-500">•</span>
            <span className="text-neutral-400 text-[11px]">{selectedCount} packages configured</span>
          </div>

          <button
            onClick={closeTerminal}
            className="text-neutral-400 hover:text-neutral-100 p-1 rounded hover:bg-neutral-850 cursor-pointer"
            title="Close [Esc]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-5">
          {/* 1-Liner TTY Command Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <span className="font-semibold text-neutral-200">1. Instant TTY Execution Command:</span>
              {scriptResult.loading && (
                <span className="flex items-center gap-1 text-[11px] text-[#1793d1]">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Generating edge link...
                </span>
              )}
            </div>

            <div className="relative flex items-center rounded border border-[#1793d1]/40 bg-neutral-900 p-3 group">
              <code className="text-xs md:text-sm text-[#1793d1] font-mono break-all pr-12 select-all">
                {scriptResult.command}
              </code>

              <button
                onClick={handleCopyCommand}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono flex items-center gap-1 transition-colors cursor-pointer"
                title="Copy command"
              >
                {copiedCommand ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>

            {/* Expiration & Retention Notice */}
            <div className="flex items-start gap-2 p-2.5 rounded bg-amber-950/20 border border-amber-900/40 text-xs text-amber-300/90 font-sans">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-semibold">Notice:</span>
                <p className="text-[11px] text-amber-400/80 leading-relaxed">
                  This quick command is hosted via Cloudflare Edge KV and expires in <strong>24 hours</strong>. If you plan to install later or keep a permanent backup of this configuration, download <code>simplearch-install.sh</code> below.
                </p>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center justify-between gap-3 flex-wrap pt-2 border-t border-neutral-800 text-xs">
            <span className="text-neutral-400 text-xs">2. Raw Script Verification & Export:</span>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-850 text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#1793d1]" />
                <span>Download .sh</span>
              </button>

              <button
                onClick={handleCopyScript}
                className="px-3 py-1.5 rounded bg-neutral-900 hover:bg-neutral-850 text-neutral-200 border border-neutral-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copiedScript ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-neutral-400" />
                    <span>Copy Script</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Script Code Viewer */}
          <div className="rounded border border-neutral-800 bg-black/90 p-3 max-h-72 overflow-y-auto font-mono text-[11px] text-neutral-300 leading-relaxed select-text">
            <pre className="whitespace-pre">{scriptResult.script}</pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-900/50 flex items-center justify-end">
          <button
            onClick={closeTerminal}
            className="px-4 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
