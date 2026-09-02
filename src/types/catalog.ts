export type PackageSource = "repo" | "aur";

export type SelectionType = "single" | "multi";

export interface PackageItem {
  id: string;
  name: string;
  packageName: string;
  source: PackageSource;
  description: string;
  pros: string[];
  cons: string[];
  stabilityScore: number; // 1 to 10
  tags: string[];
  recommended?: boolean;
  defaultConfigRepo?: string;
  targetConfigPath?: string;
  websiteUrl?: string;
  githubUrl?: string;
  isOmarchyDefault?: boolean; // Highlight OmarchyOS parity
}

export interface Category {
  id: string;
  name: string;
  shortDesc: string;
  detailedDesc: string;
  iconName: string;
  phaseId: string;
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
  description: string;
  iconName: string;
  categories: Category[];
}

export interface SelectionManifest {
  protocol: "wayland" | "x11";
  architecture: "hand-assembled" | "desktop-environment";
  selections: Record<string, string[]>; // categoryId -> array of package IDs
  timestamp: number;
}
