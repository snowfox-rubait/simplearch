# The Complete Arch Linux Post-Install Master Handbook: From Bare Metal to Daily Driver & Rice

> **Target Audience:** Anyone who has finished a base Arch Linux installation (via `archinstall` or manual `pacstrap`) and needs to transform it into a robust, high-performance daily-driver workstation covering productivity, development, gaming, and ricing.
>
> **Philosophy:** Arch provides distribution packages and a blank canvas, not an opinionated experience. You are the system architect. This guide maps out every layer of the operating system, compares the best modern tools (GUI and TUI), breaks down how ricing actually works, and provides complete workflows so you can build your ideal setup.

---

## Table of Contents

1. [Phase 0: First Boot & Critical Foundation](#phase-0-first-boot--critical-foundation)
   - Network & DNS
   - User Permissions & Sudo
   - Pacman Optimization & Keyrings
   - AUR Helpers (`yay`, `paru`, etc.)
   - Microcode & Graphics Drivers (NVIDIA, AMD, Intel)
   - Audio Subsystem (PipeWire + WirePlumber)
   - Bluetooth, Timezone, and Power Management
2. [The Core Decision: Desktop Environment (DE) vs. Modular Compositor / WM](#the-core-decision-desktop-environment-de-vs-modular-compositor--wm)
   - Full Desktop Environments (The Cohesive Path)
   - Hand-Assembled Compositors / Window Managers (The Custom Path)
   - Display Protocols: Wayland vs. X11 vs. XWayland
3. [The Modular Desktop Universe: Assembling Your Interface](#the-modular-desktop-universe-assembling-your-interface)
   - Display Managers & Login Greeters (GDM, SDDM, greetd, Ly)
   - Wayland Compositors & X11 Window Managers (Hyprland, Sway, Niri, River, i3, bspwm)
   - Status Bars & Programmable Shells (Waybar, Quickshell, AGS, eww)
   - Application Launchers (Walker, Rofi, Fuzzel, Anyrun, Tofi)
   - Notification Daemons & Control Centers (SwayNC, Mako, Dunst)
   - Screen Lockers & Idle Daemons (hyprlock, hypridle, swaylock)
   - Wallpaper Engines (swww, hyprpaper, mpvpaper, waypaper)
   - Screenshots, Screen Recording & Color Picking (grim + slurp, Satty, gpu-screen-recorder, hyprpicker)
   - Clipboard Managers & OSDs (cliphist, clipse, SwayOSD)
   - Polkit Authentication Agents
   - XDG Desktop Portals & Screen Sharing
4. [Look, Feel & Aesthetics: The Mechanics of Ricing](#look-feel--aesthetics-the-mechanics-of-ricing)
   - Typography, Nerd Fonts & Unicode Glyphs
   - GTK & Qt Synchronization (`nwg-look`, `qt6ct`, `kvantum`)
   - Icon Themes & Cursor Packs
   - Window Rules, Blur, Transparency, and Layout Engines
   - The wlr-layer-shell Model: Why Bars and Overlays Work
5. [The Daily Driver & Productivity Catalog (GUI vs. TUI)](#the-daily-driver--productivity-catalog-gui-vs-tui)
   - Terminal Emulators (Foot, Ghostty, Kitty, Alacritty, WezTerm)
   - Modern CLI Coreutil Replacements (`bat`, `eza`, `fd`, `ripgrep`, `zoxide`, `fzf`, `dust`)
   - File Managers (GUI & Modern TUI)
   - Version Control & Git Workflows
   - Document, Markdown & Knowledge Systems
   - Containers & Virtualization
   - Disks, Partitions & Filesystem Tools
   - Network & Bluetooth Management
   - Audio Control, Equalization & Patchbays
   - Firewalls & System Security
   - Password & Secrets Management
   - Input Methods (IME) for CJK and Multilingual Typing
   - Printing & Scanning
6. [Developer Workstations & Toolchains](#developer-workstations--toolchains)
   - Language Runtimes & Polyglot Managers (`mise`)
   - Editors & IDEs (Neovim, VS Code, Zed, Helix)
   - AI Assisted Coding CLIs & Tooling
7. [The Linux Gaming Stack](#the-linux-gaming-stack)
   - Steam & Proton / GE-Proton
   - Game Launchers (Heroic, Lutris)
   - Performance Optimizations (GameMode, MangoHud, Gamescope)
   - Controller & Peripheral Support
8. [Daily Use Apps & Desktop Comforts](#daily-use-apps--desktop-comforts)
   - Web Browsers (Firefox, Chromium, Brave, Zen, Floorp)
   - Communication & Local File Sharing (LocalSend, Signal, Discord/Webcord)
   - Media Players & Viewers (mpv, imv, Spotify)
9. [Desktop Architectures: From Minimalist Dotfiles to Reactive HUDs](#desktop-architectures-from-minimalist-dotfiles-to-reactive-huds)
   - The Three Desktop Philosophies (Cosmetic, Functional, Computational)
   - Dotfiles Architecture & Version Control (`~/.config/`)
   - Next-Generation Reactive Shells (Quickshell, eBPF telemetry, custom widgets)
10. [Summary Blueprint & Recommended First Builds](#summary-blueprint--recommended-first-builds)

---

## Phase 0: First Boot & Critical Foundation

Before installing graphical interfaces, your underlying Arch installation must be stable, connected, and equipped with package management tooling.

### 1. Network & Name Resolution
Verify you have an active network interface:
```bash
ip link
ping -c 3 archlinux.org
```
If using NetworkManager (standard for desktop workstations):
```bash
sudo systemctl enable --now NetworkManager
# For Wi-Fi via CLI:
nmtui   # or: nmcli device wifi connect "SSID" password "PASS"
```

### 2. User & Sudo Privileges
Ensure your non-root user has sudo privileges:
```bash
# Add user to the wheel group (if not done during install)
usermod -aG wheel,video,audio,input <your-username>

# Grant wheel sudo access safely
EDITOR=nano visudo
# Ensure this line is uncommented:
# %wheel ALL=(ALL:ALL) ALL
```

### 3. Pacman Optimization & Keyrings
Speed up downloads by enabling parallel downloads and colors:
Edit `/etc/pacman.conf`:
```ini
[options]
Color
CheckSpace
VerbosePkgLists
ParallelDownloads = 5
ILoveCandy   # Optional retro pacman progress bar
```
Refresh package keys and database:
```bash
sudo pacman -Sy archlinux-keyring
sudo pacman -Syu
```

### 4. AUR Helper (The Gateway to the Arch User Repository)
The Arch User Repository (AUR) contains nearly every piece of software or ricing tool created for Linux. Install an AUR helper:
- **`yay` (Go):** Most established, fast, intuitive syntax mimicking pacman.
- **`paru` (Rust):** Feature-dense, built-in vi pager for inspecting PKGBUILDs before compilation.

```bash
# Installing yay
sudo pacman -S --needed base-devel git
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si
cd .. && rm -rf yay

# Or installing paru:
# git clone https://aur.archlinux.org/paru.git && cd paru && makepkg -si
```

### 5. Hardware Enablement & Graphics Drivers
Install CPU microcode and your GPU drivers:
- **CPU Microcode:**
  ```bash
  sudo pacman -S intel-ucode    # For Intel CPUs
  sudo pacman -S amd-ucode      # For AMD CPUs
  # Remember to regenerate your bootloader configuration (e.g., grub-mkconfig -o /boot/grub/grub.cfg)
  ```
- **Graphics Drivers:**
  - **AMD:** `sudo pacman -S mesa vulkan-radeon libva-mesa-driver mesa-vdpau xf86-video-amdgpu`
  - **Intel:** `sudo pacman -S mesa vulkan-intel intel-media-driver`
  - **NVIDIA:** `sudo pacman -S nvidia-dkms nvidia-utils lib32-nvidia-utils nvidia-settings opencl-nvidia` (Add `nvidia_modeset`, `nvidia_uvm`, `nvidia_drm` with `modeset=1` to kernel parameters for Wayland).

### 6. Audio Subsystem (PipeWire + WirePlumber)
Modern Linux uses PipeWire for low-latency, glitch-free audio and video stream routing:
```bash
sudo pacman -S pipewire pipewire-pulse pipewire-alsa pipewire-jack wireplumber
systemctl --user enable --now pipewire pipewire-pulse wireplumber
```

### 7. Essential System Daemons
```bash
# Bluetooth
sudo pacman -S bluez bluez-utils
sudo systemctl enable --now bluetooth

# Time synchronization
sudo systemctl enable --now systemd-timesyncd
```

---

## The Core Decision: Desktop Environment (DE) vs. Modular Compositor / WM

Arch allows you to choose your abstraction level. There are two primary paradigms:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      TWO PATHS TO A LINUX DESKTOP                       │
├────────────────────────────────────┬────────────────────────────────────┤
│   PATH A: DESKTOP ENVIRONMENT      │   PATH B: HAND-ASSEMBLED MODULAR   │
│                                    │                                    │
│   • Pre-integrated cohesive system │   • Built piece by piece           │
│   • Unified Settings GUI           │   • Extreme performance & lightness│
│   • Managed window rules, polkit,  │   • Infinite customization         │
│     audio, display scales          │   • Full keyboard-driven workflow  │
│   • Fast to set up, minimal tuning │   • Requires understanding daemons │
└────────────────────────────────────┴────────────────────────────────────┘
```

### Path A: Desktop Environments (DE)
Pick this if you want an out-of-the-box system where display configuration, Bluetooth, sound, and notification centers work immediately without manual scripting:
- **KDE Plasma 6 (Wayland-first, Qt-based):** Incredible performance, endless built-in customization, native fractional scaling, floating or tiling setups.
- **GNOME 40+ (Wayland-first, GTK/libadwaita):** Polished, gesture-heavy, keyboard/overview-focused workflow. Highly extensible via GNOME Extensions.
- **COSMIC (System76, Rust-based):** Modern, Wayland-native, modular desktop with native tiling support.
- **Xfce / Cinnamon / MATE:** Traditional desktop metaphors, battle-tested, lightweight (primarily X11).

### Path B: Hand-Assembled Modular Desktop (The Ricing Route)
Instead of a single monolithic program, you choose a standalone Compositor/Window Manager and orchestrate individual daemons yourself.

### Display Protocol: Wayland vs. X11
- **Wayland (Modern Standard):** The compositor *is* the display server. Tear-free rendering, per-monitor display scaling/refresh rates, modern trackpad gestures, secure isolation between windows.
- **X11 / Xorg (Legacy):** Centralized server architecture. Decades of tooling, but lacks modern multi-refresh rate handling and security sandboxing.
- **XWayland:** A transparent bridge that lets X11 applications and games run seamlessly inside a Wayland compositor.

---

## The Modular Desktop Universe: Assembling Your Interface

If you choose the modular route, here is the complete ecosystem of components. Each category lists the best modern options:

```
                          ┌─────────────────────────┐
                          │   Wayland Compositor    │
                          │ (Hyprland / Sway / Niri)│
                          └────────────┬────────────┘
         ┌───────────────┬─────────────┼─────────────┬───────────────┐
         ▼               ▼             ▼             ▼               ▼
      Status Bar      Launcher    Locker/Idle    Notification     Wallpaper
     (Waybar/AGS)  (Walker/Rofi) (hyprlock/idle)   (SwayNC)     (swww/mpvpaper)
```

### 1. Display Managers & Login Greeters
The screen where you type your password on boot:
- **`greetd` + `tuigreet` / `regreet`:** Extremely minimal and modern. Runs directly in TUI or Wayland, avoiding bloated display-manager overhead.
- **`Ly`:** Retro ncurses TUI login screen with matrix/animations. Ultra-lightweight.
- **`SDDM`:** Qt-based display manager, highly themeable (popular default for KDE and Hyprland rices).
- **`GDM`:** GNOME's display manager, rock-solid Wayland support.
- **`uwsm` (Universal Wayland Session Manager):** Session manager that binds compositor startup to systemd user units for proper lifecycle cleanup.

### 2. Compositors & Window Managers
The engine that positions and renders windows:
- **Wayland Tiling & Dynamic Compositors:**
  - **`Hyprland`:** Fluid animations, Kawase blur, rounded corners, dynamic dwindle/master layouts, extensive IPC socket for scripting. The king of modern ricing.
  - **`Sway`:** Rock-solid, stable, fully compatible with i3 configuration syntax. Clean and predictable.
  - **`Niri`:** Scrollable-tiling Wayland compositor (infinite horizontal ribbon of windows). Fresh, ergonomic workflow.
  - **`River`:** Dynamic tiling compositor inspired by dwm and bspwm; tag-based workspace architecture.
  - **`Labwc`:** Stacking/floating Wayland compositor inspired by Openbox. Extremely light and fast.
- **X11 Tiling Window Managers:**
  - **`i3` / `i3-gaps`:** The classic manual tiling manager. Simple configuration, huge community.
  - **`bspwm`:** Binary space partitioning WM; represents windows as leaves of a binary tree. Controlled purely via `bspc` CLI.
  - **`awesome`:** Scripted entirely in Lua. Infinite programmatic potential.
  - **`qtile`:** Configured and scripted in pure Python.

### 3. Status Bars & Programmable Shells
The bar displaying workspaces, system telemetry, clocks, and tray icons:
- **`Waybar`:** The undisputed standard for Wayland. JSON/JSONC configuration, styled with standard CSS. Fast, reliable, supports custom script modules.
- **`Quickshell`:** A next-generation framework built on QtQuick/QML and JavaScript. Rather than just a bar, it lets you code interactive reactive dashboards, dials, OSDs, and floating widgets with native C++ speed.
- **`AGS` (Aylur's GTK Shell / Astal):** Build full desktop shells using GTK and TypeScript/JavaScript. Used in ricing suites like End-4 and Caelestia.
- **`eww` (ElKowar's Wacky Widgets):** Standalone widget engine written in Rust with custom Yuck/SCSS configuration.

### 4. Application Launchers
The fuzzy search menu for opening apps and running scripts:
- **`Walker`:** Blazingly fast Wayland launcher with plugin architecture (supports clipboard history, web searches, emojis, desktop files, D-Bus services).
- **`Rofi` / `rofi-wayland`:** The battle-tested classic. Massive ecosystem of custom themes, supports dmenu mode, app launching, SSH menus, and script menus.
- **`Fuzzel`:** Minimal, fast Wayland launcher designed for wlroots. Pixel-perfect font rendering, low memory footprint.
- **`Anyrun`:** Highly modular, plugin-centric Wayland runner (KRunner alternative).
- **`Tofi`:** Ultra-fast, minimal keyboard menu.

### 5. Notification Daemons & Control Centers
Displays desktop notifications and notification history panels:
- **`SwayNC` (Sway Notification Center):** Complete notification engine + slide-out control center widget (volume sliders, DND toggle, media controls, custom buttons).
- **`Mako`:** Ultra-lightweight, customizable notification daemon built specifically for Wayland/wlroots.
- **`Dunst`:** The classic notification daemon (X11 & Wayland layer-shell).

### 6. Idle Management & Screen Lockers
Protects your machine when you step away:
- **`hypridle`:** Efficient idle daemon for Wayland. Tracks user activity; dims screens, turns off monitor power (DPMS), and triggers lockers.
- **`hyprlock`:** Fast, GPU-accelerated lockscreen with pam integration, clock widgets, background blur, and customizable password fields.
- **`swaylock` / `swaylock-effects`:** The traditional wlroots locker, supporting screenshot blurs and circle password rings.

### 7. Wallpaper Daemons
- **`swww`:** Wayland wallpaper daemon featuring animated transitions (wipe, wave, slide, grow) with minimal GPU overhead.
- **`hyprpaper`:** Fast, low-memory wallpaper daemon native to the Hyprland ecosystem.
- **`mpvpaper`:** Video wallpaper daemon using `mpv` to render live video or looping clips onto the desktop background.
- **`waypaper`:** GUI frontend/picker to select wallpapers across `swww`, `hyprpaper`, and `swaybg`.

### 8. Screenshot, Screen Recording & Color Picking
- **`grim` + `slurp`:** The foundational CLI pair for Wayland. `slurp` selects a rectangular region; `grim` grabs the image buffer.
- **`Satty` / `swappy`:** Modern screenshot annotation tools (arrows, blur sensitive text, crop, highlight).
- **`gpu-screen-recorder`:** Ultra-fast, GPU-accelerated hardware video recorder (NVENC/VAAPI). Negligible performance hit while gaming.
- **`wf-recorder`:** Lightweight CLI screen recorder for wlroots compositors.
- **`hyprpicker`:** Wayland-native color picker with zoom lens and hex/rgb format copying.

### 9. Clipboard Managers & OSDs
- **`cliphist`:** Wayland clipboard manager storing text and images. Pairs effortlessly with Rofi, Walker, or Fuzzel.
- **`clipse`:** TUI clipboard manager with an interactive ratatui interface.
- **`wl-clipboard`:** Essential CLI tools (`wl-copy`, `wl-paste`) for script integration.
- **`SwayOSD`:** Sleek on-screen display popup for volume, brightness, and caps-lock indicators.

### 10. Polkit Authentication Agents
Required when an application needs root/administrative authorization (e.g., GParted, Timeshift):
- **`hyprpolkitagent`** (Modern Hyprland polkit)
- **`polkit-gnome`** (Standard GTK polkit dialog)
- **`polkit-kde-agent`** (Qt-based polkit dialog)

### 11. XDG Desktop Portals (Screen Sharing & File Pickers)
Portals allow sandboxed apps (Flatpaks, browsers) to communicate with the compositor for screen sharing (WebRTC/Discord/OBS) and file picking:
- Core: `xdg-desktop-portal`
- Compositor backend: `xdg-desktop-portal-hyprland` (for Hyprland), `xdg-desktop-portal-wlr` (for Sway/River), or `xdg-desktop-portal-gnome` / `xdg-desktop-portal-kde`.
- Fallback: `xdg-desktop-portal-gtk` (essential for standard file chooser dialogs).

---

## Look, Feel & Aesthetics: The Mechanics of Ricing

A "rice" is simply a deliberate aesthetic and behavioral alignment across every tool on your screen.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     THE 4 PILLARS OF A COHESIVE RICE                     │
├───────────────────┬───────────────────┬───────────────────┬─────────────┤
│ 1. COLOR PALETTES │ 2. TYPOGRAPHY     │ 3. UI PLUMBING    │ 4. BEHAVIOR │
│ Catppuccin,       │ JetBrains Mono NF,│ GTK (nwg-look),   │ Window rules│
│ Gruvbox, Nord,    │ Cascadia Code,    │ Qt (qt6ct+kvantum)│ gaps, blur, │
│ Tokyo Night,      │ Font Awesome,     │ Icons (Papirus),  │ animations, │
│ Rose Pine         │ Noto CJK/Emoji    │ Cursors (Bibata)  │ scratchpads │
└───────────────────┴───────────────────┴───────────────────┴─────────────┘
```

### 1. Typography & Nerd Fonts
Monospace fonts patched with developer icons are mandatory for terminal glyphs, status bar icons, and prompt symbols:
```bash
# Recommended font packages:
sudo pacman -S ttf-jetbrains-mono-nerd ttf-fira-code noto-fonts noto-fonts-cjk noto-fonts-emoji
```

### 2. GUI Toolkits & Theming Synchronization
Linux apps use different graphics toolkits. To ensure consistent dark/light themes and fonts:
- **GTK Configuration (`nwg-look`):** Sets GTK3/GTK4 themes, fonts, cursor sizes, and icon themes into `~/.config/gtk-3.0/settings.ini` and `~/.config/gtk-4.0/`.
- **Qt Configuration (`qt5ct`, `qt6ct`, `kvantum`):** Configures Qt applications to match GTK or use custom SVG Kvantum skins.
  Add this to your environment variables (`/etc/environment` or shell profile):
  ```bash
  QT_QPA_PLATFORMTHEME=qt6ct
  ```
- **Icon & Cursor Themes:**
  - Icons: `papirus-icon-theme`, `yaru-icon-theme`
  - Cursors: `bibata-cursor-theme`, `breeze-cursors`

### 3. Understanding the Wayland Surface Hierarchy (`wlr-layer-shell`)
Wayland does not treat all windows identically. It separates surfaces into four conceptual layers:
1. **Overlay Layer:** Screen lockers (`hyprlock`), full-screen OSDs, emergency modals.
2. **Top Layer:** Status bars (`Waybar`), launchers (`Walker`), notifications (`SwayNC`). These reserve margins so regular apps do not overlap them.
3. **Normal Layer:** Standard application windows (browsers, terminals, IDEs).
4. **Background Layer:** Wallpapers (`swww`), background canvases.

---

## The Daily Driver & Productivity Catalog (GUI vs. TUI)

A real daily-driver OS requires more than pretty borders. Here is the curated catalog of software across essential productivity categories, highlighting both graphical (GUI) and keyboard-centric terminal (TUI) options.

```
                      PRODUCTIVITY TOOLING MATRIX
┌──────────────────────┬─────────────────────────┬────────────────────────┐
│ Category             │ Top Graphical (GUI)     │ Top Terminal (TUI)     │
├──────────────────────┼─────────────────────────┼────────────────────────┤
│ File Management      │ Dolphin, Nautilus, Nemo │ Yazi, Superfile, lf    │
│ Git / VCS            │ GitKraken, Sublime Merge│ Lazygit, GitUI, Tig    │
│ Containers / Docker  │ Podman Desktop, Portainer│ Lazydocker, Oxker      │
│ Note Taking          │ Obsidian, Logseq, Typora│ Zk, Telekasten, Jrnl   │
│ Disk Partitioning    │ GParted, GNOME Disks    │ Ncdu, Gdu, Cfdisk      │
│ Firewalls            │ Gufw, OpenSnitch        │ Fwtui, interactive-nft │
│ Bluetooth            │ Overskride, Blueman     │ Bluetui                │
│ Audio Control        │ Pavucontrol, EasyEffects│ Wiremix, Pamixer       │
└──────────────────────┴─────────────────────────┴────────────────────────┘
```

### 1. Terminal Emulators
The daily-driver gateway for Linux power users:
- **`Ghostty`:** Modern, GPU-accelerated terminal by Mitchell Hashimoto. Beautiful font rendering, native Wayland tab bar, instant start times.
- **`Foot`:** Fast, lightweight, Wayland-native terminal designed specifically for wlroots/Wayland. Ultra-minimal memory footprint.
- **`Kitty`:** Feature-packed GPU terminal with built-in image rendering (kitty graphics protocol), tabs, splits, and scripting.
- **`Alacritty`:** Pure GPU-accelerated simplicity. Minimalist, blazing-fast, Rust-based.
- **`WezTerm`:** Cross-platform GPU terminal configured entirely via Lua, with built-in multiplexing.

### 2. Modern CLI Coreutil Replacements
Replace antiquated 1970s Unix utilities with fast, ergonomic Rust/Go alternatives:
- `bat` (replaces `cat` with syntax highlighting and git diffs)
- `eza` (replaces `ls` with colors, icons, git status, tree view)
- `fd` (replaces `find` with intuitive fuzzy matching)
- `ripgrep` (`rg` — replaces `grep` with unmatched multithreaded speed)
- `zoxide` (replaces `cd` with smart frequency/recency jumping: `z proj`)
- `fzf` (universal interactive fuzzy search engine)
- `dust` (replaces `du` with visual bar graphs of directory sizes)
- `tldr` (simplified, community-driven cheat sheets instead of dense man pages)

### 3. File Managers
- **GUI:**
  - **`Dolphin`:** The most powerful Linux file manager (KDE). Split views, integrated terminal, deep cloud/FTP support.
  - **`Nautilus` (GNOME Files):** Clean, minimalist, modern GTK4 interface.
  - **`Nemo` (Cinnamon) / `Thunar` (Xfce):** Fast, traditional dual-pane-capable file managers with extensive plugin systems.
- **TUI (Keyboard-driven):**
  - **`Yazi`:** Blazing-fast asynchronous terminal file manager written in Rust. Native image preview support via Chafa/Kitty graphics protocol.
  - **`Superfile`:** Elegant modern terminal file manager featuring dual-pane layouts and rich visual themes.
  - **`lf` / `nnn`:** Minimal, fast file navigators heavily inspired by `ranger`.

### 4. Version Control & Git
- **GUI:** `GitKraken` (feature-rich commercial GUI), `Sublime Merge` (ultra-responsive native C++ Git client), `GitHub Desktop`.
- **TUI:**
  - **`lazygit`:** The industry favorite terminal Git UI. Interactive staging, interactive rebase, branch management, merge conflict resolution.
  - **`GitUI`:** Blazingly fast Rust-based alternative to lazygit.
  - **`Tig`:** Classic text-mode interface for Git logs, tree navigation, and diffs.

### 5. Document & Markdown Editors
- **GUI:**
  - **`Obsidian`:** Extensible local-first knowledge graph and Markdown note-taking powerhouse.
  - **`Logseq`:** Privacy-first outliner built around bidirectional linking.
  - **`MarkText` / `Typora`:** Real-time WYSIWYG Markdown editors.
  - **`Zettlr`:** Academic Markdown editor with Zettelkasten and citation support.
- **TUI:**
  - **`zk`:** CLI/TUI Zettelkasten plain-text note-taking tool.
  - **`Telekasten`:** Neovim-native Zettelkasten integration.

### 6. Container & Virtualization Management
- **Backends:** `docker` + `docker-compose`, or rootless `podman`.
- **GUI:** `Podman Desktop` (open-source GUI for containers), `Portainer` (web dashboard).
- **TUI:**
  - **`lazydocker`:** Interactive terminal UI for Docker containers, logs, and volume pruning.
  - **`oxker`:** Ultra-lightweight Rust Docker tracker.
  - **`k9s`:** Terminal tracker for Kubernetes clusters.

### 7. Disk, Partition & Storage Utilities
- **GUI:**
  - **`GParted`:** The premier disk partition editor.
  - **`GNOME Disks` (`gnome-disk-utility`):** Drive health (SMART data), partition resizing, image burning.
  - **`Ventoy` / `BalenaEtcher`:** Bootable USB creation tools.
- **TUI:**
  - **`ncdu` / `gdu`:** Interactive terminal disk space analyzers with instant folder deletion.
  - **`cfdisk`:** Intuitive ncurses disk partitioner.

### 8. Network & Bluetooth Management
- **Networking:** `NetworkManager` + `nm-applet` (systray) or `nmtui` (terminal ncurses interface).
- **Bluetooth:**
  - GUI: `overskride` (modern GTK4/libadwaita Bluetooth manager), `blueman`.
  - TUI: `bluetui` (interactive ratatui terminal Bluetooth client).

### 9. Audio Control & Equalization
- **GUI:**
  - **`pavucontrol` / `pwvucontrol`:** Essential audio mixer for routing input/output devices per application.
  - **`EasyEffects`:** System-wide DSP audio processing (equalizer, noise suppression via RNNoise, bass enhancer).
  - **`qpwgraph` / `helvum`:** Visual audio patchbay to wire audio streams between apps and outputs.
- **TUI:** `wiremix` (interactive PipeWire mixer) or `pamixer` (scriptable CLI volume).

### 10. Firewalls & Security
- **Backends:** `ufw` or `firewalld`.
- **GUI:** `gufw` (simple UFW GUI) or `OpenSnitch` (interactive application-level outbound connection prompter / Little Snitch clone).
- **TUI:** `fwtui` or interactive `nftables`.

### 11. Passwords & Secrets Management
- **GUI:** `1Password`, `Bitwarden`, `KeePassXC` (offline encrypted vault).
- **CLI/TUI:** `pass` (standard UNIX password manager storing GPG-encrypted files in Git), `bitwarden-cli`, `1password-cli`.

### 12. Input Methods (IME) for Multilingual & CJK Typing
If typing Japanese, Chinese, Korean, or complex scripts:
- Core framework: `fcitx5` + `fcitx5-gtk` + `fcitx5-qt`
- Language engines: `fcitx5-mozc` (Japanese), `fcitx5-chinese-addons` (Chinese), `fcitx5-hangul` (Korean).
- Configuration GUI: `fcitx5-config-qt`.

---

## Developer Workstations & Toolchains

Turn your Arch install into a development powerhouse:

### 1. Version Management with `mise`
Stop manually installing single versions of Node, Python, Go, and Rust. Use **`mise`** (fast Rust-based polyglot tool manager replacing `asdf`, `nvm`, `pyenv`):
```bash
sudo pacman -S mise
# In your project folder:
mise use node@22 python@3.12 go@latest
```

### 2. Modern Code Editors
- **`Neovim`:** Fast, extensible, scripted in Lua. Paired with distributions like LazyVim, AstroNvim, or LunarVim for instant IDE capabilities.
- **`Zed`:** High-performance, Rust-built, GPU-rendered collaborative code editor.
- **`Helix`:** Post-modern modal text editor written in Rust with built-in Tree-sitter and LSP support out of the box (zero configuration needed).
- **`Visual Studio Code` / `VSCodium`:** The industry standard GUI editor.

---

## The Linux Gaming Stack

Arch Linux is widely considered the best platform for Linux gaming due to its bleeding-edge kernel and Mesa drivers.

### 1. Steam & Proton
Enable the multilib repository in `/etc/pacman.conf`:
```ini
[multilib]
Include = /etc/pacman.d/mirrorlist
```
Install Steam and dependencies:
```bash
sudo pacman -Syu steam ttf-liberation lib32-mesa
```
Inside Steam settings: Enable **Steam Play for all other titles** and select **Proton Experimental** or install **`proton-ge-custom`** via AUR for community game patches and media foundation codec support.

### 2. Third-Party Game Launchers
- **`Heroic Games Launcher`:** Beautiful open-source launcher for Epic Games, GOG, and Amazon Games.
- **`Lutris`:** Comprehensive video game preservation platform supporting Blizzard, EA, Ubisoft, and emulators.

### 3. Performance Utilities
- **`gamemode`:** Feral Interactive's daemon that dynamically configures CPU governors, I/O priorities, and GPU clocks when games launch.
  Run games with: `gamemoderun %command%` in Steam launch options.
- **`mangohud`:** GPU/CPU performance, temperature, FPS, and frame time overlay.
  Run games with: `mangohud %command%`.
- **`gamescope`:** Valve's micro-compositor. Renders games in an isolated sandbox with integer scaling, AMD FSR upscaling, and custom refresh rates.

---

## Daily Use Apps & Desktop Comforts

Complete your installation with reliable everyday software:
- **Web Browsers:**
  - `Firefox` / `LibreWolf` (Privacy-hardened, native Wayland support).
  - `Zen Browser` / `Floorp` (Modern, vertical-tab-focused browsers).
  - `Chromium` / `Brave` (Blink engine).
- **Communication:**
  - `Signal Desktop` (`signal-desktop`).
  - `Discord` or `WebCord` / `Vesktop` (Wayland-optimized Discord client with functional screen sharing and audio).
- **Local File Transfer:**
  - **`LocalSend` (`localsend`):** Cross-platform open-source AirDrop alternative for local network sharing between Linux, Android, iOS, and macOS.
- **Media Players:**
  - `mpv` (Minimal, hardware-accelerated video player).
  - `imv` (Fast Wayland image viewer).
  - `Spotify` or `ncspot` (TUI Spotify client).

---

## Desktop Architectures: From Minimalist Dotfiles to Reactive HUDs

Once your tools are chosen, how do you manage and evolve your desktop?

### The Three Desktop Philosophies
1. **Cosmetic Ricing:** Focusing on visual cohesion—matching wallpaper, hex colors, terminal schemes, and window border curves.
2. **Functional Ricing:** Optimizing keyboard ergonomics, automatic window placement, instant terminal scratchpads, and removing mouse reliance to speed up real work.
3. **Computational & Reactive UI:** Turning the desktop into an active instrument. Using engines like **Quickshell** or custom daemons to visualize system state, network activity, audio frequencies, or hardware temperatures in real-time.

### Organizing Your Dotfiles (`~/.config/`)
Keep your configuration files clean, modular, and committed to a Git repository:
```text
~/.config/
├── hypr/
│   ├── hyprland.conf     # Keybindings, window rules, monitors
│   ├── hyprlock.conf     # Screen lock layout
│   └── hypridle.conf     # Inactivity timeouts
├── waybar/
│   ├── config.jsonc      # Module structure
│   └── style.css         # CSS styling
├── foot/
│   └── foot.ini          # Terminal configuration
├── walker/
│   └── config.toml       # Launcher options
├── swaync/
│   └── style.css         # Notification center theme
└── zsh/
    └── .zshrc            # Aliases, prompt, shell plugins
```
Use tools like **`stow`** (GNU Stow) or bare git repositories (`git --git-dir=$HOME/.cfg/ --work-tree=$HOME`) to synchronize your desktop across machines.

---

## Summary Blueprint & Recommended First Builds

If you feel overwhelmed by the vast catalog, here are two proven, battle-tested recipes to guide your setup:

### Recipe 1: The Modern Wayland Powerhouse (High Productivity & Ricing)
- **Base Compositor:** `Hyprland`
- **Session / Login:** `greetd` + `tuigreet`
- **Status Bar:** `Waybar`
- **Application Launcher:** `Walker` or `rofi-wayland`
- **Terminal:** `Ghostty` or `Foot`
- **Notifications:** `SwayNC`
- **Screen Lock & Idle:** `hyprlock` + `hypridle`
- **Wallpapers:** `swww`
- **Audio & Video:** PipeWire + WirePlumber + `pavucontrol`
- **File Management:** `Dolphin` (GUI) + `Yazi` (TUI)
- **Git:** `lazygit`
- **Development:** `mise` + `Neovim` / `Zed`
- **Theming Tools:** `nwg-look` (GTK) + `qt6ct` (Qt) + JetBrains Mono Nerd Font

### Recipe 2: The Ultra-Clean Minimalist (Distraction-Free)
- **Base Compositor:** `Sway` or `Niri`
- **Session / Login:** `Ly`
- **Status Bar:** Minimal `Waybar`
- **Launcher:** `Fuzzel` or `Tofi`
- **Terminal:** `Foot`
- **Notifications:** `Mako`
- **Screen Lock:** `swaylock-effects` + `swayidle`
- **File Management:** `Yazi`
- **Editor:** `Helix`
- **Shell Tools:** `bat`, `eza`, `fd`, `ripgrep`, `zoxide`

---

> **Next Steps:**
> Take one category at a time. Install the package, explore its documentation in `/usr/share/doc/` or on the ArchWiki, test its keybindings, and inspect how other developers structure their configs on GitHub or r/unixporn. Arch gives you total control—build a system that feels like an extension of your mind.
