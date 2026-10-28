export type PackageSource = "repo" | "aur";

export type SelectionType = "single" | "multi";

export type SimpleArchMode =
  | "mode-1-desktop-postinstall"
  | "mode-2-minimal-recommended"
  | "mode-3-replace-existing"
  | "mode-4-ancient-hardware";

export type GpuDriver =
  | "intel"
  | "amd"
  | "nvidia-dkms"
  | "nvidia-open"
  | "vm-virtio"
  | "skip";

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
  media?: PackageMedia;
  hardwareRequirements?: PackageHardwareRequirements;
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
  mode: SimpleArchMode;
  gpuDriver: GpuDriver;
  protocol: "wayland" | "x11";
  architecture: "hand-assembled" | "desktop-environment";
  selections: Record<string, string[]>; // categoryId -> array of package IDs
  aurHelper: "paru-bin" | "yay-bin";
  enableChaoticAur: boolean;
  timestamp: number;
}
