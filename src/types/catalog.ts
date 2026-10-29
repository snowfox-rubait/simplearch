export type PackageSource = "repo" | "aur";
export type SelectionType = "single" | "multi";

export interface PackageMediaItem {
  title: string;
  description: string;
  file: string;
  type: "image" | "gif" | "video";
}

export interface PackageMedia {
  before_ricing?: {
    description: string;
    file: string;
  };
  after_ricing?: PackageMediaItem[];
}

export interface PackageHardwareRequirements {
  ancient_hardware_friendly?: boolean;
  gpu_compositing_required?: boolean;
}

export interface PackageItem {
  id: string;
  name: string;
  packageName: string;
  source: PackageSource;
  description: string;
  pros?: string[];
  cons?: string[];
  stabilityScore?: number; // 1 to 10
  tags?: string[];
  recommended?: boolean;
  isOmarchyDefault?: boolean;
  targetConfigPath?: string;
  defaultConfigRepo?: string;
  websiteUrl?: string;
  githubUrl?: string;
  services?: string[]; // Systemd system services to enable
  userServices?: string[]; // Systemd user services to enable
  envVars?: Record<string, string>;
  dotfiles?: string[];
  media?: PackageMedia;
  hardwareRequirements?: PackageHardwareRequirements;
}

export interface CategoryPhase {
  id: string;
  title: string;
  description?: string;
  order: number;
}

export interface Category {
  id: string;
  name: string;
  shortDesc: string;
  detailedDesc?: string;
  icon?: string;
  phase: CategoryPhase;
  order: number;
  selectionType: SelectionType;
  optional: boolean;
  dependsOn?: {
    category: string;
    value?: string | string[];
    condition?: "equals" | "not-equals" | "includes";
  };
  packages: PackageItem[];
}

export interface Phase {
  id: string;
  title: string;
  description?: string;
  order: number;
  categories: Category[];
}

export interface SelectionManifest {
  timestamp: number;
  mode?: string;
  gpuDriver?: string;
  aurHelper?: string;
  selections: Record<string, string[]>; // categoryId -> array of selected package IDs
}

export interface CatalogData {
  generatedAt: string;
  totalCategories: number;
  phases: Phase[];
  categories: Category[];
}
