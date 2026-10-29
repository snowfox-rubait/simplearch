"use client";

import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import {
  getAllCategories,
  getAllPhases,
  getActiveCategories,
  pruneInvalidSelections,
  getRecommendedSelections,
  getCategoryById
} from "@/lib/catalogLoader";
import { generateInstallScript } from "@/lib/scriptEngine";
import { Category, PackageItem, Phase, SelectionManifest } from "@/types/catalog";

interface ScriptGenerationResult {
  script: string;
  command: string;
  url?: string;
  id?: string;
  expiresAt?: number;
  loading: boolean;
  error?: string;
}

interface CatalogContextType {
  categories: Category[];
  phases: Phase[];
  activeCategories: Category[];
  selections: Record<string, string[]>;
  selectedCategory: Category | null;
  searchQuery: string;
  isTerminalOpen: boolean;
  scriptResult: ScriptGenerationResult | null;
  selectedCount: number;
  selectedPackages: { category: Category; package: PackageItem }[];
  setSelectedCategoryId: (id: string) => void;
  setSearchQuery: (query: string) => void;
  togglePackage: (categoryId: string, packageId: string) => void;
  selectSinglePackage: (categoryId: string, packageId: string) => void;
  clearCategory: (categoryId: string) => void;
  loadPreset: (type: "recommended" | "clear") => void;
  openTerminal: () => void;
  closeTerminal: () => void;
  generateScript: () => Promise<void>;
  isPackageSelected: (categoryId: string, packageId: string) => boolean;
}

const STORAGE_KEY = "simplearch_selections_v2";

const CatalogContext = createContext<CatalogContextType | undefined>(undefined);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const categories = useMemo(() => getAllCategories(), []);
  const phases = useMemo(() => getAllPhases(), []);

  const [selections, setSelections] = useState<Record<string, string[]>>(() => {
    return getRecommendedSelections(categories);
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>(() => {
    return categories[0]?.id || "installation-mode";
  });

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [scriptResult, setScriptResult] = useState<ScriptGenerationResult | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Restore selections from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          // Prune any deleted categories/packages automatically
          const cleaned = pruneInvalidSelections(parsed, categories);
          setSelections(cleaned);
        }
      }
    } catch {
      // Ignore storage read errors
    }
    setIsHydrated(true);
  }, [categories]);

  // Save selections to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
    } catch {
      // Ignore storage write errors
    }
  }, [selections, isHydrated]);

  // Compute active categories with dependency gating
  const activeCategories = useMemo(() => {
    return getActiveCategories(selections, categories);
  }, [selections, categories]);

  // Current selected category (ensure it stays valid)
  const selectedCategory = useMemo(() => {
    const found = activeCategories.find((c) => c.id === selectedCategoryId);
    return found || activeCategories[0] || null;
  }, [activeCategories, selectedCategoryId]);

  // Package lookup helpers
  const isPackageSelected = useCallback(
    (categoryId: string, packageId: string) => {
      const list = selections[categoryId];
      return Array.isArray(list) && list.includes(packageId);
    },
    [selections]
  );

  const togglePackage = useCallback(
    (categoryId: string, packageId: string) => {
      const cat = getCategoryById(categoryId);
      if (!cat) return;

      setSelections((prev) => {
        const currentList = prev[categoryId] || [];
        if (cat.selectionType === "single") {
          // In single mode, selecting switches to this package (unless already selected, if optional)
          if (currentList.includes(packageId)) {
            if (cat.optional) {
              const next = { ...prev };
              delete next[categoryId];
              return next;
            }
            return prev;
          }
          return { ...prev, [categoryId]: [packageId] };
        } else {
          // Multi selection mode
          const exists = currentList.includes(packageId);
          const updated = exists ? currentList.filter((id) => id !== packageId) : [...currentList, packageId];
          if (updated.length === 0) {
            const next = { ...prev };
            delete next[categoryId];
            return next;
          }
          return { ...prev, [categoryId]: updated };
        }
      });
    },
    []
  );

  const selectSinglePackage = useCallback((categoryId: string, packageId: string) => {
    setSelections((prev) => ({
      ...prev,
      [categoryId]: [packageId]
    }));
  }, []);

  const clearCategory = useCallback((categoryId: string) => {
    setSelections((prev) => {
      const next = { ...prev };
      delete next[categoryId];
      return next;
    });
  }, []);

  const loadPreset = useCallback(
    (type: "recommended" | "clear") => {
      if (type === "clear") {
        setSelections({});
      } else {
        setSelections(getRecommendedSelections(categories));
      }
    },
    [categories]
  );

  // Selected packages summary list
  const selectedPackages = useMemo(() => {
    const list: { category: Category; package: PackageItem }[] = [];
    for (const cat of activeCategories) {
      const pkgIds = selections[cat.id] || [];
      for (const pId of pkgIds) {
        const pkg = cat.packages.find((p) => p.id === pId);
        if (pkg) {
          list.push({ category: cat, package: pkg });
        }
      }
    }
    return list;
  }, [activeCategories, selections]);

  const selectedCount = selectedPackages.length;

  // Build manifest
  const manifest = useMemo<SelectionManifest>(() => {
    return {
      timestamp: Date.now(),
      mode: selections["installation-mode"]?.[0] || "mode-2-minimal-recommended",
      gpuDriver: selections["gpu-driver"]?.[0] || "gpu-intel",
      aurHelper: selections["aur-helper"]?.[0] || "paru",
      selections
    };
  }, [selections]);

  // Generate Script & Trigger Edge KV Upload
  const generateScript = useCallback(async () => {
    // 1. Generate client-side immediately
    const rawScript = generateInstallScript({ manifest, catalog: categories });

    // Initial local state
    setScriptResult({
      script: rawScript,
      command: "curl -fsSL https://simplearch.snowfox.live/s/generating/install.sh | bash",
      loading: true
    });
    setIsTerminalOpen(true);

    // 2. Upload to Cloudflare Pages Function at /api/script
    try {
      const res = await fetch("/api/script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: rawScript, manifest })
      });

      if (!res.ok) {
        throw new Error(`Cloudflare Edge returned status ${res.status}`);
      }

      const data = (await res.json()) as {
        id: string;
        url: string;
        command: string;
        expiresAt: number;
        ttlHours: number;
      };

      setScriptResult({
        script: rawScript,
        command: data.command,
        url: data.url,
        id: data.id,
        expiresAt: data.expiresAt,
        loading: false
      });
    } catch {
      // In local dev without KV / offline fallback, generate direct here-doc command
      const fallbackCommand = `cat << 'EOF' > install.sh\n${rawScript}\nEOF\nbash install.sh`;
      setScriptResult({
        script: rawScript,
        command: fallbackCommand,
        loading: false,
        error: "Notice: Running in offline / local development mode (Cloudflare KV not bound)."
      });
    }
  }, [manifest, categories]);

  const openTerminal = () => {
    generateScript();
  };

  const closeTerminal = () => {
    setIsTerminalOpen(false);
  };

  return (
    <CatalogContext.Provider
      value={{
        categories,
        phases,
        activeCategories,
        selections,
        selectedCategory,
        searchQuery,
        isTerminalOpen,
        scriptResult,
        selectedCount,
        selectedPackages,
        setSelectedCategoryId,
        setSearchQuery,
        togglePackage,
        selectSinglePackage,
        clearCategory,
        loadPreset,
        openTerminal,
        closeTerminal,
        generateScript,
        isPackageSelected
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
}

export function useCatalog() {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error("useCatalog must be used within a CatalogProvider");
  }
  return context;
}
