"use client";

import React, { useMemo, useState } from "react";
import { useWizard } from "@/context/WizardContext";
import { CATALOG_PHASES } from "@/data/catalog";
import { IconRenderer } from "@/components/ui/IconRenderer";
import { generateInstallScript } from "@/lib/scriptGenerator";
import {
  Check,
  ChevronLeft,
  Copy,
  Cpu,
  Download,
  FileCode,
  Package,
  Sparkles,
  Terminal,
  Trash2,
  X,
  Zap
} from "lucide-react";
import clsx from "clsx";

export const SelectionReviewModal: React.FC = () => {
  const {
    isReviewOpen,
    setIsReviewOpen,
    selectedPackages,
    togglePackage,
    getManifest,
    goToCategory
  } = useWizard();

  const [activeTab, setActiveTab] = useState<"review" | "script">("review");
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);

  const manifest = useMemo(() => getManifest(), [getManifest]);
  const aurCount = selectedPackages.filter((p) => p.packageItem.source === "aur").length;
  const repoCount = selectedPackages.filter((p) => p.packageItem.source === "repo").length;

  const generatedScript = useMemo(() => {
    return generateInstallScript(manifest, selectedPackages);
  }, [manifest, selectedPackages]);

  if (!isReviewOpen) return null;

  const handleCopyManifest = () => {
    navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
    setCopiedManifest(true);
    setTimeout(() => setCopiedManifest(false), 2000);
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generatedScript);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([generatedScript], { type: "text/x-shellscript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simplearch-install.sh";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const ttyCommand = `cat << 'EOF' > install.sh\n${generatedScript}\nEOF\nbash install.sh`;

  const handleCopyCommand = () => {
    navigator.clipboard.writeText(ttyCommand);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 md:p-5 border-b border-neutral-800 bg-neutral-900/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-800/40 flex items-center justify-center text-cyan-400">
              {activeTab === "review" ? <Package className="w-5 h-5" /> : <FileCode className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-lg md:text-xl font-bold text-neutral-100 tracking-tight">
                  {activeTab === "review" ? "Selection Manifest & Blueprint" : "Generated Installation Script"}
                </h3>
                <span className="text-xs font-mono font-medium px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  {selectedPackages.length} Packages
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {activeTab === "review"
                  ? "Review selected components or switch to script generator."
                  : "Standalone POSIX bash script ready to execute on your bare Arch install."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex items-center bg-neutral-900 p-1 rounded-lg border border-neutral-800 text-xs font-medium">
              <button
                onClick={() => setActiveTab("review")}
                className={clsx(
                  "px-3 py-1 rounded transition-colors",
                  activeTab === "review" ? "bg-neutral-800 text-neutral-100 shadow" : "text-neutral-400 hover:text-neutral-200"
                )}
              >
                Manifest
              </button>
              <button
                onClick={() => setActiveTab("script")}
                className={clsx(
                  "px-3 py-1 rounded transition-colors flex items-center gap-1.5",
                  activeTab === "script" ? "bg-cyan-500 text-neutral-950 font-semibold shadow" : "text-cyan-400 hover:text-cyan-300"
                )}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>Script</span>
              </button>
            </div>

            <button
              onClick={() => setIsReviewOpen(false)}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stats & Context Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4 border-b border-neutral-800 bg-neutral-900/20 text-xs font-mono">
          <div className="p-2.5 rounded-lg bg-neutral-900/50 border border-neutral-800">
            <span className="text-neutral-400 block mb-0.5 text-[11px]">Install Mode</span>
            <span className="text-xs font-semibold text-neutral-200 truncate block">
              {manifest.mode.replace("mode-", "M").replace("-recommended", "")}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-900/50 border border-neutral-800">
            <span className="text-neutral-400 block mb-0.5 text-[11px]">GPU Driver</span>
            <span className="text-xs font-semibold text-cyan-300 uppercase block truncate">
              {manifest.gpuDriver}
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-900/50 border border-neutral-800">
            <span className="text-neutral-400 block mb-0.5 text-[11px]">Repo Packages</span>
            <span className="text-xs font-semibold text-blue-400">
              {repoCount} pkgs
            </span>
          </div>
          <div className="p-2.5 rounded-lg bg-neutral-900/50 border border-neutral-800">
            <span className="text-neutral-400 block mb-0.5 text-[11px]">AUR Helper</span>
            <span className="text-xs font-semibold text-purple-400">
              {manifest.aurHelper} ({aurCount} pkgs)
            </span>
          </div>
        </div>

        {/* TAB 1: REVIEW SELECTIONS */}
        {activeTab === "review" && (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5">
            {CATALOG_PHASES.map((phase) => {
              const phaseItems = selectedPackages.filter((item) => item.category.phaseId === phase.id);
              if (phaseItems.length === 0) return null;

              return (
                <div key={phase.id} className="space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
                    <IconRenderer name={phase.iconName} className="w-4 h-4" />
                    <span>{phase.title}</span>
                    <span className="text-neutral-600 font-mono">({phaseItems.length})</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {phaseItems.map(({ category, packageItem }) => (
                      <div
                        key={packageItem.id}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900/60 border border-neutral-800/80 hover:border-neutral-700 transition-all text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          <div
                            className="p-1 rounded bg-neutral-800 cursor-pointer hover:bg-neutral-700"
                            onClick={() => {
                              setIsReviewOpen(false);
                              goToCategory(category.id);
                            }}
                            title={`Edit ${category.name}`}
                          >
                            <IconRenderer name={category.iconName} className="w-3.5 h-3.5 text-neutral-400" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-medium text-neutral-200 truncate">
                                {packageItem.name}
                              </span>
                              {packageItem.isOmarchyDefault && (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                                  Omarchy
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] font-mono text-neutral-400 truncate block">
                              {packageItem.packageName}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() => togglePackage(category.id, packageItem.id)}
                          className="p-1.5 rounded text-neutral-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                          title="Remove package"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            {selectedPackages.length === 0 && (
              <div className="text-center py-12 text-neutral-400">
                <p className="text-sm">No packages selected yet. Pick options from the categories.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GENERATED SCRIPT */}
        {activeTab === "script" && (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col space-y-4">
            {/* Quick Action Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-neutral-900/60 border border-neutral-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyScript}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-500 hover:bg-cyan-400 text-neutral-950 transition-colors font-sans shadow"
                >
                  {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedScript ? "Script Copied!" : "Copy Full Script"}</span>
                </button>

                <button
                  onClick={handleDownloadScript}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .sh</span>
                </button>
              </div>

              {/* Contributor Callout */}
              <a
                href="/package-template.zip"
                download="simplearch-package-template.zip"
                className="inline-flex items-center gap-1.5 text-xs text-purple-300 hover:text-purple-200 px-2.5 py-1 rounded bg-purple-950/40 border border-purple-800/40 transition-colors"
                title="Download Contributor Package Template (.zip) to add missing packages"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                <span>Missing a package? Submit ZIP</span>
              </a>
            </div>

            {/* Headless TTY Instructions */}
            <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-800/30 text-xs">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Executing on Bare Arch Linux Console:</span>
                </span>
                <button
                  onClick={handleCopyCommand}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline font-mono"
                >
                  {copiedCommand ? "Copied command!" : "Copy TTY One-Liner"}
                </button>
              </div>
              <p className="text-neutral-300 text-[11px] leading-relaxed mb-2">
                Save script to <code>install.sh</code> on your new Arch install and run:
              </p>
              <div className="p-2 rounded bg-neutral-950 border border-neutral-800 font-mono text-[11px] text-neutral-300 flex items-center justify-between overflow-x-auto">
                <code>bash simplearch-install.sh</code>
                <span className="text-[10px] text-neutral-500 font-sans ml-2">(Run as regular user with sudo)</span>
              </div>
            </div>

            {/* Code Preview Box */}
            <div className="flex-1 relative rounded-xl bg-neutral-950 border border-neutral-800 overflow-hidden font-mono text-xs text-neutral-300 flex flex-col min-h-[300px]">
              <div className="px-4 py-2 bg-neutral-900/60 border-b border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
                <span>simplearch-install.sh (POSIX Bash)</span>
                <span>{generatedScript.split("\n").length} lines</span>
              </div>
              <pre className="p-4 overflow-x-auto overflow-y-auto max-h-[360px] leading-relaxed text-[11px] select-all">
                <code>{generatedScript}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="p-3.5 md:p-4 border-t border-neutral-800 bg-neutral-900/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handleCopyManifest}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-300 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 transition-colors"
          >
            {copiedManifest ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedManifest ? "Manifest JSON Copied!" : "Copy Manifest JSON"}</span>
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {activeTab === "script" ? (
              <button
                onClick={() => setActiveTab("review")}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back to Manifest</span>
              </button>
            ) : (
              <button
                onClick={() => setIsReviewOpen(false)}
                className="flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                Continue Editing
              </button>
            )}

            {activeTab === "review" && (
              <button
                onClick={() => setActiveTab("script")}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-neutral-950 transition-all shadow-md shadow-cyan-500/20 active:scale-95"
              >
                <FileCode className="w-4 h-4" />
                <span>Generate Install Script &rarr;</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
