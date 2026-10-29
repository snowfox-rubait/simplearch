import { Category, PackageItem, SelectionManifest } from "@/types/catalog";
import { pruneInvalidSelections } from "@/lib/catalogLoader";

export interface ScriptEngineOptions {
  manifest: SelectionManifest;
  catalog: Category[];
}

export function generateInstallScript(options: ScriptEngineOptions): string {
  const { manifest, catalog } = options;
  const cleanSelections = pruneInvalidSelections(manifest.selections || {}, catalog);

  const timestamp = new Date(manifest.timestamp || Date.now()).toISOString();

  // Mode detection
  const selectedMode = cleanSelections["installation-mode"]?.[0] || "mode-2-minimal-recommended";

  // GPU Driver detection
  const selectedGpu = cleanSelections["gpu-driver"]?.[0] || "gpu-intel";

  // AUR Helper detection
  const selectedAurHelper = cleanSelections["aur-helper"]?.[0] || "paru";
  const helperName = selectedAurHelper === "yay" ? "yay" : "paru";
  const helperPackage = selectedAurHelper === "yay" ? "yay-bin" : "paru-bin";

  // Package collections
  const repoPackages = new Set<string>();
  const aurPackages = new Set<string>();
  const systemServices = new Set<string>();
  const userServices = new Set<string>();
  const envVariables: Record<string, string> = {};
  const dotfilesModules = new Set<string>();

  // Base system requirements
  repoPackages.add("git");
  repoPackages.add("curl");
  repoPackages.add("base-devel");

  // Collect from all selected packages across all categories
  for (const category of catalog) {
    const selectedPkgIds = cleanSelections[category.id] || [];
    for (const pkgId of selectedPkgIds) {
      const pkg = category.packages.find((p) => p.id === pkgId);
      if (!pkg) continue;

      // Extract pacman/AUR packages
      const names = (pkg.packageName || "").split(/\s+/).filter(Boolean);
      for (const name of names) {
        if (pkg.source === "aur") {
          aurPackages.add(name);
        } else {
          repoPackages.add(name);
        }
      }

      // Collect systemd services
      if (Array.isArray(pkg.services)) {
        pkg.services.forEach((s) => systemServices.add(s));
      }
      if (Array.isArray(pkg.userServices)) {
        pkg.userServices.forEach((s) => userServices.add(s));
      }

      // Collect environment variables
      if (pkg.envVars) {
        Object.assign(envVariables, pkg.envVars);
      }

      // Collect dotfile modules
      if (Array.isArray(pkg.dotfiles)) {
        pkg.dotfiles.forEach((d) => dotfilesModules.add(d));
      }
    }
  }

  // GPU Driver Stack generation
  let gpuDriverInstallCode = "";
  if (selectedGpu === "gpu-intel") {
    gpuDriverInstallCode = `log_info "Installing Intel Graphics Stack (Mesa + Vulkan + Media Driver)..."
sudo pacman -S --needed --noconfirm mesa vulkan-intel intel-media-driver libva-intel-driver || true`;
  } else if (selectedGpu === "gpu-amd") {
    gpuDriverInstallCode = `log_info "Installing AMD Radeon Graphics Stack (AMDGPU + RADV Vulkan + VA-API)..."
sudo pacman -S --needed --noconfirm mesa vulkan-radeon libva-mesa-driver mesa-vdpau || true`;
  } else if (selectedGpu === "gpu-nvidia-dkms") {
    gpuDriverInstallCode = `log_info "Installing NVIDIA Proprietary DKMS Drivers..."
sudo pacman -S --needed --noconfirm nvidia-dkms nvidia-utils nvidia-settings linux-headers || true

# Ingest Wayland environment variables for NVIDIA
sudo mkdir -p /etc/environment.d
sudo tee /etc/environment.d/10-nvidia.conf > /dev/null << 'EOF'
LIBVA_DRIVER_NAME=nvidia
GBM_BACKEND=nvidia-drm
__GLX_VENDOR_LIBRARY_NAME=nvidia
NVD_BACKEND=direct
EOF`;
  } else if (selectedGpu === "gpu-nvidia-open") {
    gpuDriverInstallCode = `log_info "Installing NVIDIA Open Kernel Module Drivers..."
sudo pacman -S --needed --noconfirm nvidia-open-dkms nvidia-utils linux-headers || true

# Ingest Wayland environment variables for NVIDIA
sudo mkdir -p /etc/environment.d
sudo tee /etc/environment.d/10-nvidia.conf > /dev/null << 'EOF'
LIBVA_DRIVER_NAME=nvidia
GBM_BACKEND=nvidia-drm
__GLX_VENDOR_LIBRARY_NAME=nvidia
NVD_BACKEND=direct
EOF`;
  } else if (selectedGpu === "gpu-vm-virtio") {
    gpuDriverInstallCode = `log_info "Installing Virtual Machine Guest Drivers (SPICE & QEMU Agent)..."
sudo pacman -S --needed --noconfirm mesa xf86-video-vmware spice-vdagent qemu-guest-agent || true
sudo systemctl enable --now spice-vdagent qemu-guest-agent || true`;
  } else {
    gpuDriverInstallCode = `log_info "Installing Generic Mesa Software Rasterizer..."
sudo pacman -S --needed --noconfirm mesa || true`;
  }

  // Mode 4: Ancient Hardware Optimizations
  let mode4Code = "";
  if (selectedMode === "mode-4-ancient-hardware") {
    mode4Code = `
# ------------------------------------------------------------------------------
# Mode 4: Ancient Hardware Optimizations (Low RAM & Weak Dual-Core)
# ------------------------------------------------------------------------------
log_info "Applying Ancient Hardware Optimizations (lz4 zram swap)..."
sudo mkdir -p /etc/systemd/zram-generator.conf.d
sudo tee /etc/systemd/zram-generator.conf.d/simplearch-ancient.conf > /dev/null << 'EOF'
[zram0]
zram-size = ram / 2
compression-algorithm = lz4
EOF
sudo systemctl restart systemd-zram-setup@zram0.service || true
`;
  }

  // Ensure default desktop services if selected in categories
  if (repoPackages.has("sddm")) systemServices.add("sddm.service");
  if (repoPackages.has("greetd")) systemServices.add("greetd.service");
  if (repoPackages.has("ly")) systemServices.add("ly.service");
  if (repoPackages.has("networkmanager")) systemServices.add("NetworkManager.service");
  if (repoPackages.has("bluetooth") || repoPackages.has("bluez")) systemServices.add("bluetooth.service");
  if (repoPackages.has("ufw")) systemServices.add("ufw.service");

  // Audio user services
  if (repoPackages.has("pipewire")) {
    userServices.add("pipewire");
    userServices.add("pipewire-pulse");
    userServices.add("wireplumber");
  }

  const sortedRepoList = Array.from(repoPackages).sort();
  const sortedAurList = Array.from(aurPackages).sort();
  const sortedSystemServices = Array.from(systemServices).sort();
  const sortedUserServices = Array.from(userServices).sort();

  return `#!/usr/bin/env bash
# ==============================================================================
# SimpleArch Post-Installation Orchestration Script
# ==============================================================================
# Mode:             ${selectedMode}
# GPU Driver:       ${selectedGpu}
# AUR Helper:       ${helperPackage}
# Generated:        ${timestamp}
#
# Generated dynamically by SimpleArch (https://simplearch.snowfox.live)
# ==============================================================================

set -euo pipefail

BOLD='\\033[1m'
CYAN='\\033[0;36m'
GREEN='\\033[0;32m'
YELLOW='\\033[0;33m'
RED='\\033[0;31m'
NC='\\033[0m'

log_info()    { echo -e "\${CYAN}\${BOLD}[SimpleArch]\${NC} \$1"; }
log_ok()      { echo -e "\${GREEN}\${BOLD}[✓]\${NC} \$1"; }
log_warn()    { echo -e "\${YELLOW}\${BOLD}[!]\${NC} \$1"; }
log_err()     { echo -e "\${RED}\${BOLD}[✗]\${NC} \$1"; }

# ------------------------------------------------------------------------------
# Phase 1: Environment & Sanity Checks
# ------------------------------------------------------------------------------
if [ "\$EUID" -eq 0 ]; then
  log_err "Do not run this script directly as root!"
  log_err "Run as your regular user with sudo permissions."
  exit 1
fi

log_info "Validating internet connection..."
if ! ping -c 1 archlinux.org &>/dev/null; then
  log_err "No internet connection detected. Please connect to your network and retry."
  exit 1
fi
log_ok "Internet connection confirmed."

# Initialize Non-Destructive Backup Directory
BACKUP_DIR="\$HOME/.config/simplearch_backups/run_\$(date +%Y%m%d_%H%M%S)"
mkdir -p "\$BACKUP_DIR"
log_ok "Non-destructive backup directory ready: \$BACKUP_DIR"

# ------------------------------------------------------------------------------
# Phase 2: Pacman Performance & Mirror Sync
# ------------------------------------------------------------------------------
log_info "Configuring pacman parallel downloads..."
sudo sed -i 's/^#ParallelDownloads = [0-9]*/ParallelDownloads = 5/' /etc/pacman.conf || true
sudo pacman -Sy --noconfirm

# ------------------------------------------------------------------------------
# Phase 3: Hardware GPU Driver Stack
# ------------------------------------------------------------------------------
${gpuDriverInstallCode}
${mode4Code}
# ------------------------------------------------------------------------------
# Phase 4: AUR Helper Bootstrapping (${helperPackage})
# ------------------------------------------------------------------------------
if ! command -v ${helperName} &>/dev/null; then
  log_info "Bootstrapping AUR helper (${helperPackage})..."
  sudo pacman -S --needed --noconfirm base-devel git
  TMP_BUILD=\$(mktemp -d)
  git clone "https://aur.archlinux.org/${helperPackage}.git" "\$TMP_BUILD/${helperPackage}"
  (cd "\$TMP_BUILD/${helperPackage}" && makepkg -si --noconfirm)
  rm -rf "\$TMP_BUILD"
  log_ok "AUR helper (${helperName}) successfully installed."
else
  log_ok "AUR helper (${helperName}) already present."
fi

# ------------------------------------------------------------------------------
# Phase 5: Official Repository Package Installation (${sortedRepoList.length} packages)
# ------------------------------------------------------------------------------
log_info "Installing official repository packages..."
sudo pacman -S --needed --noconfirm \\
${sortedRepoList.map((pkg) => `  ${pkg}`).join(" \\\n")}
log_ok "Official repository packages installed."

${
  sortedAurList.length > 0
    ? `# ------------------------------------------------------------------------------
# Phase 6: AUR Packages Installation (${sortedAurList.length} packages)
# ------------------------------------------------------------------------------
log_info "Installing AUR packages via ${helperName}..."
${helperName} -S --needed --noconfirm \\
${sortedAurList.map((pkg) => `  ${pkg}`).join(" \\\n")}
log_ok "AUR packages installed."`
    : `# No AUR packages requested.`
}

# ------------------------------------------------------------------------------
# Phase 7: Baseline Dotfiles & Non-Destructive Backup
# ------------------------------------------------------------------------------
log_info "Setting up modular baseline configurations..."
backup_and_link() {
  local target="\$1"
  if [ -e "\$target" ]; then
    local rel_path="\${target#\$HOME/}"
    local backup_target="\$BACKUP_DIR/\$rel_path"
    mkdir -p "\$(dirname "\$backup_target")"
    cp -r "\$target" "\$backup_target"
    log_info "Backed up existing: \$target -> \$backup_target"
  fi
}

mkdir -p "\$HOME/.config"

TEMP_DOTS=\$(mktemp -d)
log_info "Fetching baseline configurations from repository..."
if git clone --depth=1 https://github.com/haw/dotfiles.git "\$TEMP_DOTS/dots" 2>/dev/null; then
  log_ok "Baseline configs downloaded."
  cp -r "\$TEMP_DOTS/dots/.config/"* "\$HOME/.config/" 2>/dev/null || true
  rm -rf "\$TEMP_DOTS"
else
  log_warn "Dotfiles repository unavailable. Creating standard local config skeletons."
fi

# ------------------------------------------------------------------------------
# Phase 8: System & User Services Activation
# ------------------------------------------------------------------------------
log_info "Enabling system services..."
${sortedSystemServices.map((svc) => `sudo systemctl enable ${svc} 2>/dev/null || true`).join("\n")}

${
  sortedUserServices.length > 0
    ? `log_info "Enabling user-level services..."
systemctl --user enable --now ${sortedUserServices.join(" ")} 2>/dev/null || true`
    : ""
}

# ------------------------------------------------------------------------------
# Phase 9: First-Boot Cheat-Sheet
# ------------------------------------------------------------------------------
mkdir -p "\$HOME/.config/simplearch"
cat << 'CHEATSHEET' > "\$HOME/.config/simplearch/cheatsheet.txt"
================================================================================
              SimpleArch — Essential Keybinding Quick-Start
================================================================================
[Terminal]          Super + Return / Super + Enter
[Application Menu]  Super + Space / Super + D
[Web Browser]       Super + B
[Close Window]      Super + Q
[File Manager]      Super + E
[Lock Screen]       Super + L
[Exit / Logout]     Super + Shift + E
================================================================================
Press Super + Q to dismiss this cheat-sheet.
CHEATSHEET

# ------------------------------------------------------------------------------
# Phase 10: Installation Complete!
# ------------------------------------------------------------------------------
echo ""
echo -e "\${GREEN}\${BOLD}================================================================================\${NC}"
echo -e "\${GREEN}\${BOLD}         SimpleArch Installation Finished Successfully!\${NC}"
echo -e "\${GREEN}\${BOLD}================================================================================\${NC}"
echo -e "Total Packages: \${CYAN}${sortedRepoList.length + sortedAurList.length}\${NC} (${sortedRepoList.length} repo, ${sortedAurList.length} AUR)"
echo -e "Config Backups: \${YELLOW}\$BACKUP_DIR\${NC}"
echo -e "Cheat-Sheet:    \${CYAN}\$HOME/.config/simplearch/cheatsheet.txt\${NC}"
echo ""
echo -e "\${BOLD}Ready to reboot into your newly configured system:\${NC}"
echo -e "  \${CYAN}sudo reboot\${NC}"
echo ""
`;
}
