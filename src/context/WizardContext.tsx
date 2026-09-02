"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  ALL_CATEGORIES,
  CATALOG_PHASES,
  CATEGORY_MAP,
  OMARCHY_PRESET_IDS,
  RECOMMENDED_PRESET_IDS
} from "@/data/catalog";
import { Category, PackageItem, SelectionManifest } from "@/types/catalog";

interface WizardContextType {
  selections: Record<string, string[]>;
  currentStepIndex: number;
  currentCategory: Category;
  activeCategories: Category[];
  isFirstStep: boolean;
  isLastStep: boolean;
  selectedCount: number;
  selectedPackages: { category: Category; packageItem: PackageItem }[];
  isReviewOpen: boolean;
  setIsReviewOpen: (open: boolean) => void;
  togglePackage: (categoryId: string, packageId: string) => void;
  selectPackage: (categoryId: string, packageId: string) => void;
  clearCategory: (categoryId: string) => void;
  selectRecommended: (categoryId: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToCategory: (categoryId: string) => void;
  goToStepIndex: (index: number) => void;
  loadPreset: (preset: "recommended" | "omarchy" | "clear") => void;
  getManifest: () => SelectionManifest;
}

const STORAGE_KEY = "simplearch_wizard_selections_v1";

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [selections, setSelections] = useState<Record<string, string[]>>(() => {
    // Initial default: recommended selections
    return { ...RECOMMENDED_PRESET_IDS };
  });

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isReviewOpen, setIsReviewOpen] = useState<boolean>(false);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Restore from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setSelections(parsed);
        }
      }
    } catch {
      // ignore storage errors
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage when selections change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));
    } catch {
      // ignore storage errors
    }
  }, [selections, isHydrated]);

  // Compute active categories based on dependency gating
  const activeCategories = useMemo(() => {
    return ALL_CATEGORIES.filter((category) => {
      if (!category.dependsOn) return true;
      const { category: parentCatId, value, condition = "includes" } = category.dependsOn;
      const parentSelection = selections[parentCatId] || [];

      if (condition === "includes") {
        if (Array.isArray(value)) {
          return value.some((v) => parentSelection.includes(v));
        }
        return value ? parentSelection.includes(value) : parentSelection.length > 0;
      }
      if (condition === "not-equals") {
        return !parentSelection.includes(value as string);
      }
      return true;
    });
  }, [selections]);

  // Ensure currentStepIndex stays within bounds of active categories
  const safeStepIndex = Math.min(Math.max(0, currentStepIndex), Math.max(0, activeCategories.length - 1));
  const currentCategory = activeCategories[safeStepIndex] || activeCategories[0];

  const togglePackage = (categoryId: string, packageId: string) => {
    const category = CATEGORY_MAP.get(categoryId);
    if (!category) return;

    setSelections((prev) => {
      const currentList = prev[categoryId] || [];
      if (category.selectionType === "single") {
        return {
          ...prev,
          [categoryId]: currentList.includes(packageId) ? [] : [packageId]
        };
      } else {
        // Multi-select
        return {
          ...prev,
          [categoryId]: currentList.includes(packageId)
            ? currentList.filter((id) => id !== packageId)
            : [...currentList, packageId]
        };
      }
    });
  };

  const selectPackage = (categoryId: string, packageId: string) => {
    const category = CATEGORY_MAP.get(categoryId);
    if (!category) return;

    setSelections((prev) => {
      const currentList = prev[categoryId] || [];
      if (category.selectionType === "single") {
        return { ...prev, [categoryId]: [packageId] };
      }
      if (!currentList.includes(packageId)) {
        return { ...prev, [categoryId]: [...currentList, packageId] };
      }
      return prev;
    });
  };

  const clearCategory = (categoryId: string) => {
    setSelections((prev) => ({
      ...prev,
      [categoryId]: []
    }));
  };

  const selectRecommended = (categoryId: string) => {
    const category = CATEGORY_MAP.get(categoryId);
    if (!category) return;
    const recs = category.packages.filter((p) => p.recommended).map((p) => p.id);
    setSelections((prev) => ({
      ...prev,
      [categoryId]: category.selectionType === "single" ? (recs[0] ? [recs[0]] : []) : recs
    }));
  };

  const nextStep = () => {
    if (safeStepIndex < activeCategories.length - 1) {
      setCurrentStepIndex(safeStepIndex + 1);
    } else {
      setIsReviewOpen(true);
    }
  };

  const prevStep = () => {
    if (safeStepIndex > 0) {
      setCurrentStepIndex(safeStepIndex - 1);
    }
  };

  const goToCategory = (categoryId: string) => {
    const idx = activeCategories.findIndex((c) => c.id === categoryId);
    if (idx !== -1) {
      setCurrentStepIndex(idx);
    }
  };

  const goToStepIndex = (index: number) => {
    if (index >= 0 && index < activeCategories.length) {
      setCurrentStepIndex(index);
    }
  };

  const loadPreset = (preset: "recommended" | "omarchy" | "clear") => {
    if (preset === "clear") {
      setSelections({});
    } else if (preset === "omarchy") {
      setSelections({ ...OMARCHY_PRESET_IDS });
    } else if (preset === "recommended") {
      setSelections({ ...RECOMMENDED_PRESET_IDS });
    }
  };

  // Compute flattened selected packages for review
  const selectedPackages = useMemo(() => {
    const result: { category: Category; packageItem: PackageItem }[] = [];
    activeCategories.forEach((cat) => {
      const selectedIds = selections[cat.id] || [];
      selectedIds.forEach((pid) => {
        const pkg = cat.packages.find((p) => p.id === pid);
        if (pkg) {
          result.push({ category: cat, packageItem: pkg });
        }
      });
    });
    return result;
  }, [selections, activeCategories]);

  const selectedCount = selectedPackages.length;

  const getManifest = (): SelectionManifest => {
    const isWayland = (selections["display-protocol"] || []).includes("protocol-wayland");
    const isHandAssembled = (selections["desktop-architecture"] || []).includes("arch-hand-assembled");

    return {
      protocol: isWayland ? "wayland" : "x11",
      architecture: isHandAssembled ? "hand-assembled" : "desktop-environment",
      selections,
      timestamp: Date.now()
    };
  };

  return (
    <WizardContext.Provider
      value={{
        selections,
        currentStepIndex: safeStepIndex,
        currentCategory,
        activeCategories,
        isFirstStep: safeStepIndex === 0,
        isLastStep: safeStepIndex === activeCategories.length - 1,
        selectedCount,
        selectedPackages,
        isReviewOpen,
        setIsReviewOpen,
        togglePackage,
        selectPackage,
        clearCategory,
        selectRecommended,
        nextStep,
        prevStep,
        goToCategory,
        goToStepIndex,
        loadPreset,
        getManifest
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}
