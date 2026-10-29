import catalogDataRaw from "@/data/catalog.json";
import { CatalogData, Category, PackageItem, Phase } from "@/types/catalog";

const catalogData = catalogDataRaw as CatalogData;

export function getRawCatalog(): CatalogData {
  return catalogData;
}

export function getAllCategories(): Category[] {
  return catalogData.categories || [];
}

export function getAllPhases(): Phase[] {
  return catalogData.phases || [];
}

export function getCategoryMap(): Map<string, Category> {
  const map = new Map<string, Category>();
  for (const cat of getAllCategories()) {
    map.set(cat.id, cat);
  }
  return map;
}

export function getCategoryById(id: string): Category | undefined {
  return getAllCategories().find((c) => c.id === id);
}

export function getPackageMap(): Map<string, PackageItem> {
  const map = new Map<string, PackageItem>();
  for (const cat of getAllCategories()) {
    for (const pkg of cat.packages) {
      map.set(pkg.id, pkg);
    }
  }
  return map;
}

export function getPackageById(categoryId: string, packageId: string): PackageItem | undefined {
  const cat = getCategoryById(categoryId);
  if (!cat) return undefined;
  return cat.packages.find((p) => p.id === packageId);
}

/**
 * Filter categories dynamically based on active dependency gating.
 * If a category depends on another category's selection, evaluate it safely.
 */
export function getActiveCategories(
  selections: Record<string, string[]>,
  categories: Category[] = getAllCategories()
): Category[] {
  return categories.filter((category) => {
    if (!category.dependsOn) return true;

    const { category: parentCatId, value, condition = "includes" } = category.dependsOn;
    const parentSelection = selections[parentCatId] || [];

    if (condition === "includes") {
      if (Array.isArray(value)) {
        return value.some((v) => parentSelection.includes(v));
      }
      return value ? parentSelection.includes(value) : parentSelection.length > 0;
    }

    if (condition === "equals") {
      if (Array.isArray(value)) {
        return value.length === parentSelection.length && value.every((v) => parentSelection.includes(v));
      }
      return parentSelection.length === 1 && parentSelection[0] === value;
    }

    if (condition === "not-equals") {
      if (typeof value === "string") {
        return !parentSelection.includes(value);
      }
      return true;
    }

    return true;
  });
}

/**
 * Prune any orphaned category or package IDs from user selections.
 * This guarantees that deleting a category JSON file never crashes the engine or UI.
 */
export function pruneInvalidSelections(
  selections: Record<string, string[]>,
  categories: Category[] = getAllCategories()
): Record<string, string[]> {
  const validCategoryMap = new Map<string, Set<string>>();
  for (const cat of categories) {
    const pkgSet = new Set<string>(cat.packages.map((p) => p.id));
    validCategoryMap.set(cat.id, pkgSet);
  }

  const cleanSelections: Record<string, string[]> = {};

  for (const [catId, selectedPkgIds] of Object.entries(selections)) {
    const validPkgSet = validCategoryMap.get(catId);
    if (!validPkgSet) {
      // Category file was deleted from git! Silently drop it.
      continue;
    }

    const filteredPkgs = selectedPkgIds.filter((pkgId) => validPkgSet.has(pkgId));
    if (filteredPkgs.length > 0) {
      cleanSelections[catId] = filteredPkgs;
    }
  }

  return cleanSelections;
}

/**
 * Generate default recommended selections dynamically from the catalog.
 */
export function getRecommendedSelections(categories: Category[] = getAllCategories()): Record<string, string[]> {
  const rec: Record<string, string[]> = {};
  for (const cat of categories) {
    const recPkgs = cat.packages.filter((p) => p.recommended).map((p) => p.id);
    if (recPkgs.length > 0) {
      rec[cat.id] = cat.selectionType === "single" ? [recPkgs[0]] : recPkgs;
    } else if (!cat.optional && cat.packages.length > 0) {
      // If mandatory but no explicitly marked recommended, pick first
      rec[cat.id] = [cat.packages[0].id];
    }
  }
  return rec;
}
