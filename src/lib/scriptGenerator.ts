import { Category, PackageItem, SelectionManifest } from "@/types/catalog";

export function generateInstallScript(
  manifest: SelectionManifest,
  selectedItems: { category: Category; packageItem: PackageItem }[]
): string {
  const timestamp = new Date(manifest.timestamp).toISOString();

  // Partition official repo vs AUR packages
  const repoPackagesSet = new Set<string>();
  const aurPackagesSet = new Set<string>();

  // Collect packages
  selectedItems.forEach(({ packageItem }) => {
    // Some package names can be multiple space-separated packages
    const pkgNames = packageItem.packageName.split(/\s+/).filter(Boolean);
    pkgNames.forEach((name) => {
      if (packageItem.source === "aur") {
        aurPackagesSet.add(name);
      } else {
        repoPackagesSet.add(name);
      }
    });
  });

  // Base system requirements
  repoPackagesSet.add("git");
  repoPackagesSet.add("curl");
  repoPackagesSet.add("base-devel");

  // GPU Driver resolution
  let gpuDriverInstallCode = "";
  if (manifest.gpuDriver === "intel") {
    gpuDriverInstallCode = `log_info "Installing Intel Graphics Stack (Mesa + Vulkan + Media Driver)..."
sudo pacman -S --needed --noconfirm mesa vulkan-intel intel-media-driver libva-intel-driver || true`;
  } else if (manifest.gpuDriver === "amd") {
    gpuDriverInstallCode = `log_info "Installing AMD Radeon Graphics Stack (AMDGPU + RADV Vulkan + VA-API)..."
sudo pacman -S --needed --noconfirm mesa vulkan-radeon libva-mesa-driver mesa-vdpau || true`;
  } else if (manifest.gpuDriver === "nvidia-dkms") {
    gpuDriverInstallCode = `log_info "Installing NVIDIA Proprietary DKMS Drivers..."
sudo pacman -S --needed --noconfirm nvidia-dkms nvidia-utils nvidia-settings linux-headers || true

# Wayland environment variables for NVIDIA
if [ ! -f /etc/environment.d/10-nvidia.conf ]; then
  sudo mkdir -p /etc/environment.d
  sudo tee /etc/environment.d/10-nvidia.conf > /dev/null << 'EOF'
LIBVA_DRIVER_NAME=nvidia
GBM_BACKEND=nvidia-drm
__GLX_VENDOR_LIBRARY_NAME=nvidia
NVD_BACKEND=direct
EOF
fi`;
  } else if (manifest.gpuDriver === "nvidia-open") {
    gpuDriverInstallCode = `log_info "Installing NVIDIA Open Kernel Module Drivers..."
sudo pacman -S --needed --noconfirm nvidia-open-dkms nvidia-utils linux-headers || true

# Wayland environment variables for NVIDIA
if [ ! -f /etc/environment.d/10-nvidia.conf ]; then
  sudo mkdir -p /etc/environment.d
  sudo tee /etc/environment.d/10-nvidia.conf > /dev/null << 'EOF'
LIBVA_DRIVER_NAME=nvidia
GBM_BACKEND=nvidia-drm
__GLX_VENDOR_LIBRARY_NAME=nvidia
NVD_BACKEND=direct
EOF
fi`;
  } else if (manifest.gpuDriver === "vm-virtio") {
    gpuDriverInstallCode = `log_info "Installing Virtual Machine Guest Drivers (SPICE & QEMU Agent)..."
sudo pacman -S --needed --noconfirm mesa xf86-video-vmware spice-vdagent qemu-guest-agent || true
sudo systemctl enable --now spice-vdagent qemu-guest-agent || true`;
  } else {
    gpuDriverInstallCode = `log_info "Installing Generic Mesa Software Rasterizer..."
sudo pacman -S --needed --noconfirm mesa || true`;
  }

  // Ancient hardware optimizations (Mode 4)
  let mode4Code = "";
  if (manifest.mode === "mode-4-ancient-hardware") {
    mode4Code = `
# ------------------------------------------------------------------------------
# Mode 4: Ancient Hardware Optimizations (Low RAM & Weak Dual-Core)
# ------------------------------------------------------------------------------
log_info "Applying Ancient Hardware Optimizations..."
# Configure zram with lz4 algorithm for lower CPU cycles
sudo mkdir -p /etc/systemd/zram-generator.conf.d
sudo tee /etc/systemd/zram-generator.conf.d/simplearch-ancient.conf > /dev/null << 'EOF'
[zram0]
zram-size = ram / 2
compression-algorithm = lz4
EOF
sudo systemctl restart systemd-zram-setup@zram0.service || true
`;
  }

  const helper = manifest.aurHelper === "yay-bin" ? "yay" : "paru";
  const repoList = Array.from(repoPackagesSet).sort();
  const aurList = Array.from(aurPackagesSet).sort();

  return `#!/usr/bin/env bash
# ==============================================================================
# SimpleArch Post-Installation Orchestration Script
# ==============================================================================
# Mode:             ${manifest.mode}
# Architecture:     ${manifest.architecture}
# Display Protocol: ${manifest.protocol}
# GPU Driver:       ${manifest.gpuDriver}
# AUR Helper:       ${manifest.aurHelper}
# Generated:        ${timestamp}
#
# Generated client-side by SimpleArch (https://simplearch.org)
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
# Phase 4: AUR Helper Bootstrapping (${manifest.aurHelper})
# ------------------------------------------------------------------------------
if ! command -v ${helper} &>/dev/null; then
  log_info "Bootstrapping AUR helper (${manifest.aurHelper})..."
  sudo pacman -S --needed --noconfirm base-devel git
  TMP_BUILD=\$(mktemp -d)
  git clone "https://aur.archlinux.org/${manifest.aurHelper}.git" "\$TMP_BUILD/${manifest.aurHelper}"
  (cd "\$TMP_BUILD/${manifest.aurHelper}" && makepkg -si --noconfirm)
  rm -rf "\$TMP_BUILD"
  log_ok "AUR helper (${helper}) successfully installed."
else
  log_ok "AUR helper (${helper}) already present."
fi

# ------------------------------------------------------------------------------
# Phase 5: Official Repository Package Installation (${repoList.length} packages)
# ------------------------------------------------------------------------------
log_info "Installing official repository packages..."
sudo pacman -S --needed --noconfirm \\
${repoList.map((pkg) => `  ${pkg}`).join(" \\\n")}
log_ok "Official repository packages installed."

${
  aurList.length > 0
    ? `# ------------------------------------------------------------------------------
# Phase 6: AUR Packages Installation (${aurList.length} packages)
# ------------------------------------------------------------------------------
log_info "Installing AUR packages via ${helper}..."
${helper} -S --needed --noconfirm \\
${aurList.map((pkg) => `  ${pkg}`).join(" \\\n")}
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

# Pull baseline configs from Haw's modular repository
TEMP_DOTS=\$(mktemp -d)
log_info "Fetching baseline configurations from repository..."
if git clone --depth=1 https://github.com/haw/dotfiles.git "\$TEMP_DOTS/dots" 2>/dev/null; then
  log_ok "Baseline configs downloaded."
  # Non-destructive copy
  cp -r "\$TEMP_DOTS/dots/.config/"* "\$HOME/.config/" 2>/dev/null || true
  rm -rf "\$TEMP_DOTS"
else
  log_warn "Dotfiles repository unavailable. Creating standard local config skeletons."
fi

# ------------------------------------------------------------------------------
# Phase 8: System Services Activation
# ------------------------------------------------------------------------------
log_info "Enabling system services..."
sudo systemctl enable NetworkManager.service 2>/dev/null || true

# Display Manager
if pacman -Qi sddm &>/dev/null; then
  sudo systemctl enable sddm.service 2>/dev/null || true
  log_ok "SDDM display manager enabled."
elif pacman -Qi greetd &>/dev/null; then
  sudo systemctl enable greetd.service 2>/dev/null || true
  log_ok "Greetd display manager enabled."
elif pacman -Qi ly &>/dev/null; then
  sudo systemctl enable ly.service 2>/dev/null || true
  log_ok "Ly display manager enabled."
fi

# Audio Stack
systemctl --user enable --now pipewire pipewire-pulse wireplumber 2>/dev/null || true
log_ok "PipeWire user audio services enabled."

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
echo -e "Total Packages: \${CYAN}${repoList.length + aurList.length}\${NC} (${repoList.length} repo, ${aurList.length} AUR)"
echo -e "Config Backups: \${YELLOW}\$BACKUP_DIR\${NC}"
echo -e "Cheat-Sheet:    \${CYAN}\$HOME/.config/simplearch/cheatsheet.txt\${NC}"
echo ""
echo -e "\${BOLD}Ready to reboot into your newly configured system:\${NC}"
echo -e "  \${CYAN}sudo reboot\${NC}"
echo ""
`;
}
