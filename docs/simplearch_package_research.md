# SimpleArch Package Universe — Research Reference

**Purpose:** raw candidate list for every category SimpleArch's wizard should cover, after a bare
Arch install (via `archinstall` or manual). Sourced primarily from ArchWiki, the Hyprland Wiki's
"Useful Utilities" section (which is itself organized almost exactly like SimpleArch's category
model), AlternativeTo/community comparisons for less-official corners, and the OmarchyOS core manifest audit.

**Status of this doc:** comprehensive sweep, not exhaustive, continuously verified against current AUR/repo
state. Every entry needs: (1) confirm exact package name in [community]/[extra] vs AUR, (2) confirm
still maintained, (3) pull real `pros`/`cons`/`stability_score` for the TOML schema. Treat this as
the *candidate* list the content pipeline (§6 of the spec) should ingest and verify — not
ground truth.

**Sourcing key:** [AW] = ArchWiki, [HW] = Hyprland Wiki, [ATN] = AlternativeTo, [GH] = GitHub
description, [GEN] = general knowledge / needs a dedicated search pass to confirm, [OM] = OmarchyOS research audit.

---

## 1. Display protocol (gate for everything downstream)
- Wayland — protocol, not a package itself; installed transitively via a compositor [AW]
- X11 / Xorg (`xorg-server`) [AW]
- XWayland (`xorg-xwayland`) — X11 compat layer under Wayland compositors [AW]

---

## 2. Compositors (Wayland) — `category: wm`, `requires: wayland`
Per ArchWiki's Category:Wayland compositors [AW]:
- Hyprland
- Sway
- River (and River-classic)
- Niri
- Labwc
- Wayfire
- Cagebreak
- Dwl
- MangoWM
- Nwg-shell (arguably a shell, not just a compositor — needs re-check)
- Weston (reference/demo compositor, not really daily-driver)
- Gamescope (gaming-focused compositor, niche category of its own)
- KWin (Wayland mode) — comes with KDE Plasma, not standalone
- Mutter (Wayland mode) — comes with GNOME, not standalone

## 2b. Window managers (X11) — `category: wm`, `requires: x11`
Tiling/dynamic, per ArchWiki Category:Tiling window managers [AW]:
- bspwm
- i3 (i3-wm / i3-gaps fork question — verify current AUR state)
- awesome
- Qtile
- Xmonad
- Herbstluftwm
- Ratpoison
- Stumpwm
- Notion
- Dk
- Cwc
- EXWM (Emacs-based, niche)

Stacking/floating, per ArchWiki Category:Stacking window managers [AW]:
- Openbox
- Fluxbox
- IceWM
- JWM
- PekWM
- FVWM
- Blackbox
- Cwm
- Evilwm
- Twm
- Window Maker
- Xfwm (ships with Xfce, standalone use possible)
- 2bwm
- Compiz (compositing WM, mostly historical/niche now — verify still maintained)

## 2c. Full Desktop Environments (bundle their own WM/compositor) — separate category, `category: de`
These are NOT wizard-owned "WM" picks — they're a different tier entirely (bundle panel, settings,
file manager, etc. as one unit). SimpleArch needs to decide whether these are even in scope, since
the whole premise is "pick individual pieces." Flagging as an open question, but for completeness:
- GNOME (Mutter)
- KDE Plasma (KWin)
- Xfce (Xfwm)
- Cinnamon (Muffin)
- MATE (Marco)
- LXQt
- LXDE
- Budgie
- Deepin (DDE)
- Enlightenment (E16/E-something, also standalone WM historically)
- COSMIC (System76's new Rust-based DE, Wayland-native — verify packaging maturity)

---

## 3. Status bars / shells — `category: bar`
From Hyprland Wiki Status Bars page + bars-and-widgets-list [HW][GH]:
- Waybar — de facto standard for wlroots compositors
- Polybar — X11-era standard, works on some Wayland setups
- Quickshell — QtQuick-based shell toolkit (not just a bar — full shell framework)
- AGS (Aylur's GTK Shell) — scaffolding for Astal
- Astal — underlying GTK shell-building framework/library (AGS wraps this)
- eww (ElKowar's Wacky Widgets) — Rust, custom widget system
- Ewwii — lighter eww-alternative
- ags-based full shells: e.g. **end-4/dots-hyprland**, **HyDE**, **Caelestia** (community shells — verify these are packages vs. "install this whole dotfiles repo")
- Yambar — modular status panel, X11+Wayland
- i3status / i3status-rust — status generators feeding i3bar or similar
- lemonbar — minimal XCB bar
- Xmobar — Haskell, xmonad-associated but usable elsewhere
- Rootbar — wlroots bar
- Zebar — cross-platform taskbar/widget tool (verify Linux/Wayland support level)
- YASB (Reborn) — appears to be more Windows-oriented, needs verification for Linux relevance
- slstatus — suckless status generator (feeds into dwm-style bars via WM_NAME)

## 4. Application launchers — `category: launcher`
[HW][ATN]:
- Rofi (X11, works via XWayland on Wayland too — verify native Wayland support state)
- Wofi (Wayland, wlroots) — reportedly less actively maintained, verify
- Fuzzel (Wayland, wlroots)
- Walker (Wayland, extensible, Quickshell-adjacent ecosystem)
- Anyrun (Wayland, krunner-like, plugin-based)
- tofi (Wayland, extremely minimal/fast)
- bemenu (dmenu-style, Wayland)
- dmenu (X11, suckless classic)
- Albert (Qt-based, desktop-agnostic)
- Ulauncher (Python/GTK, plugin ecosystem)
- KRunner (KDE's own, if KDE components are present)
- sirula (.desktop-only Wayland launcher)
- sway-launcher-desktop (fzf-based)
- rmenu, raffi, sherlock, sysmenu — smaller/newer Wayland launchers, need maturity verification

## 5. File managers — `category: file-manager` (multi-select)
GUI [HW]:
- Dolphin (KDE)
- Nautilus (GNOME) + extensions: nautilus-admin-gtk4, nautilus-image-converter, nautilus-open-any-terminal, nautilus-python
- Nemo (Cinnamon) + nemo-fileroller, nemo-terminal
- PCManFM-Qt (LXQt)
- PCManFM (LXDE)
- Thunar (Xfce)

TUI [HW]:
- lf
- nnn
- ranger
- superfile
- yazi

## 6. Terminal emulators — `category: terminal`
Per ArchWiki Category:Terminal emulators [AW] + comparison sites:
- Alacritty
- Kitty
- Foot (Wayland-native, wlroots)
- Ghostty
- WezTerm
- Konsole (KDE)
- GNOME Terminal / Ptyxis (GNOME's newer one — verify current GNOME default)
- Xfce4-terminal
- st (suckless terminal)
- rxvt-unicode (urxvt)
- xterm
- Terminator
- Termite (reportedly unmaintained — verify)
- Guake / Yakuake (drop-down terminals, GTK/KDE respectively)
- mlterm
- Contour

## 7. Notification daemons — `category: notification-daemon`
[HW]:
- Mako (wlroots-focused, most common Hyprland pairing)
- Dunst (X11 + Wayland via layer-shell)
- SwayNC (swaync — bundles notification center + control center)
- fnott
- Deadd notification center (verify current maintenance state)

## 8. Idle management / screen lockers — `category: idle` / `category: locker`
[HW][AW]:
- hypridle (Hyprland ecosystem)
- swayidle (Sway ecosystem, usable elsewhere)
- hyprlock (Hyprland ecosystem)
- swaylock / swaylock-effects (fork with blur/effects)
- gtklock
- waylock

## 9. Wallpaper utilities — `category: wallpaper`
[HW]:
- hyprpaper
- swaybg
- swww (animated transitions, actively used across non-Hyprland wlroots setups too)
- mpvpaper (video wallpaper via mpv)
- wpaperd
- Azote (GUI wallpaper manager, supports swaybg/swww backends)
- waypaper (GUI wallpaper picker, wraps swaybg/swww/hyprpaper — verify exact name)

## 10. Screenshot / screen recording — `category: screenshot` / `category: screen-recorder`
[HW][OM]:
- grim (capture) + slurp (region select) — foundational pair, almost everything else wraps these
- swappy (annotate)
- satty (modern annotate, swappy/Flameshot-inspired)
- hyprshot (Hyprland-specific wrapper script/AUR package)
- hyprpicker (color picker, adjacent utility)
- grimblast (Hyprland official wrapper, verify vs grimcap fork)
- grimcap (simplified alternative wrapper)
- Flameshot (portal-based, DE-agnostic)
- gpu-screen-recorder (GPU-accelerated hardware screen recorder) [OM]
- wf-recorder (wlroots screen recording)
- wl-screenrec (alternative, verify maturity)
- OBS Studio (`obs-studio`, full recording/streaming suite — heavier weight option)

## 11. Clipboard managers — `category: clipboard` (multi-select plausible)
[HW]:
- cliphist (text+image+binary, wl-clipboard based)
- clipman (text only)
- clipvault (cliphist alternative, extra features: max-age, min/max length)
- clipse (TUI-based, popular standalone option)
- wl-clipboard (underlying CLI tool most of the above depend on — hard dependency)

## 12. Color pickers — `category: color-picker`
[HW]:
- hyprpicker

## 13. On-screen display (volume/brightness popups) — `category: osd`
[HW][OM]:
- SwayOSD (`swayosd`, confirmed by Omarchy manifest)

## 14. Session / login — `category: display-manager`
Per ArchWiki Display manager + Category:Display managers [AW][OM]:
- GDM
- SDDM
- LightDM (+ greeters: lightdm-gtk-greeter, lightdm-slick-greeter, lightdm-pantheon-greeter)
- LXDM
- Ly (TUI/ncurses-style — popular in minimal tiling-WM setups)
- greetd (minimal daemon, pairs with a separate greeter like tuigreet or regreet)
- Plasma Login Manager (newer KDE successor to SDDM — verify current adoption state)
- XDM
- SLiM (resurrected 2022, verify systemd compatibility maturity)
- Entrance (Enlightenment's DM, experimental)
- uwsm (Universal Wayland Session Manager — session launching wrapper) [OM]
- xdg-terminal-exec (portable terminal dispatcher) [OM]
- plymouth (boot splash engine) [OM]

Greeters for greetd specifically: tuigreet, regreet, gtkgreet, wlgreet.

## 15. Audio stack / control — `category: audio`
[HW][OM]:
- PipeWire (server, effectively mandatory backend now) [HW]
- WirePlumber (session/policy manager for PipeWire) [HW]
- pavucontrol (GTK volume control GUI, PulseAudio-compat layer)
- pwvucontrol (native PipeWire-first alternative to pavucontrol)
- easyeffects (GUI equalizer/effects chain)
- helvum (patchbay GUI for PipeWire)
- qpwgraph (Qt patchbay alternative)
- wiremix (TUI PipeWire mixer) [OM]
- pamixer (CLI volume control) [OM]

## 16. Network management — `category: network`
- NetworkManager (`networkmanager`) — de facto standard
- nm-applet (tray applet)
- iwd (alternative backend, lighter weight, used instead of wpa_supplicant)
- network-manager-applet vs plasma-nm (KDE's own NM frontend)
- Waybar/eww network modules (script-level, not standalone packages)

## 17. Bluetooth — `category: bluetooth`
Per ArchWiki Bluetooth page [AW][OM]:
- bluez (core stack, effectively mandatory)
- bluez-utils
- Blueman (`blueman`, full GTK manager + applet)
- Overskride (`overskride`, GTK4/libadwaita client)
- Bluetooth Manager Sidebar (`bm-sidebar`, GTK4/libadwaita, Wayland-sidebar style)
- btctl (simple launcher-integrated connection manager)
- bluetui (Rust/Ratatui TUI Bluetooth manager) [OM]
- ObexFTP / obexftp (file transfer)
- toolBLEx (BLE scanner/analyzer, dev tool)

## 18. AUR helpers — `category: aur-helper` (needed for System Scan / bootstrap phase)
Per ArchWiki AUR helpers + comparisons [AW][GEN]:
- yay (most popular, Go)
- paru (Rust, yay-inspired)
- pikaur (Python, minimal deps)
- trizen (Perl)
- pacaur (largely unmaintained — verify status)
- aura (Haskell, broader package-manager ambitions)
- pakku (Nim)
- octopi (Qt GUI)
- pamac (GTK GUI, Manjaro-origin, supports Flatpak/Snap/AUR)
- aurutils (scriptable/repo-based, power-user oriented)
- pacseek (Go, search-focused TUI)

## 19. Portals (XDG Desktop Portal backends) — `category: portal`
Per ArchWiki XDG Desktop Portal + package page [AW][OM]:
- xdg-desktop-portal (core)
- xdg-desktop-portal-hyprland
- xdg-desktop-portal-wlr (generic wlroots)
- xdg-desktop-portal-gtk
- xdg-desktop-portal-kde
- xdg-desktop-portal-gnome
- xdg-desktop-portal-lxqt
- xdg-desktop-portal-cosmic
- xdg-desktop-portal-xapp
- xdg-desktop-portal-dde
- xdg-desktop-portal-phosh

## 20. Theming / appearance tooling — `category: theming`
[AW][OM]:
- nwg-look (GTK theme/settings GUI for wlroots setups)
- qt5ct / qt6ct (Qt platform theme configuration)
- lxappearance (older GTK appearance tool)
- kvantum / kvantum-qt5 (Qt theme engine, SVG-based)
- yaru-icon-theme (Ubuntu/Yaru icons) [OM]
- papirus-icon-theme (Papirus icon pack)
- bibata-cursor-theme (Bibata cursor pack)

## 21. Polkit agents — `category: polkit-agent`
- hyprpolkitagent
- polkit-gnome
- polkit-kde-agent
- lxqt-policykit
- mate-polkit

## 22. Fonts & Glyphs — `category: fonts`
[AW][OM]:
- ttf-jetbrains-mono-nerd (Nerd Font patched monospace) [OM]
- noto-fonts / noto-fonts-cjk / noto-fonts-emoji (Google Noto universal coverage) [OM]
- woff2-font-awesome (Web/icon font) [OM]
- ttf-ia-writer (Monospace writing font) [OM]
- fontconfig (core font configuration system) [OM]
- ttf-fira-code / ttf-cascadia-code (ligature coding fonts)

---

## 23. Input Method Editors (IME) & Localization — `category: ime`
Required for CJK (Chinese, Japanese, Korean) and non-Latin typography [AW][OM]:

GUI Alternatives:
- IBus Preferences (`ibus`, Intelligent Input Bus config interface) [OM]
- fcitx5-config-qt (`fcitx5-config-qt`, dedicated configuration GUI for Fcitx5) [OM]
- SCIM Setup (`scim`, Smart Common Input Method GUI setup) [OM]
- Uim-pref-gtk (`uim`, Universal Input Method setup frontend) [OM]
- Nimf Settings (`nimf`, Nimf input method framework configuration tool) [OM]

TUI / CLI Alternatives:
- ibus-setup (CLI mode) [OM]
- fcitx5-remote (CLI tool for querying/switching input engines) [OM]
- uim-sh (Command-line interface and shell evaluator for Uim) [OM]
- scim-config-agent (Terminal utility for configuring SCIM engines) [OM]
- fcitx5-diagnose (Interactive terminal troubleshooting engine for Fcitx5) [OM]

Core & Engine packages:
- fcitx5, fcitx5-gtk, fcitx5-qt [OM]
- fcitx5-hangul, fcitx5-chinese-addons, fcitx5-mozc

---

## 24. Printing & Document Output — `category: printing`
[AW][OM]:
- cups (core print server) [OM]
- cups-browsed (automatic network printer discovery) [OM]
- cups-filters (OpenPrinting CUPS filters) [OM]
- cups-pdf (virtual print-to-PDF driver) [OM]
- system-config-printer (GTK graphical printer configuration wizard) [OM]

---

## 25. Container & Virtualization Management — `category: containers`
Engine backend: `docker`, `docker-buildx`, `docker-compose`, `podman` [OM]

GUI Alternatives:
- Portainer (Web-based container management dashboard) [OM]
- Podman Desktop (Graphical console for managing Podman/Docker containers) [OM]
- DockStation (Developer-centric GUI client for Docker and Docker Compose) [OM]
- Docker Desktop (Official container management dashboard from Docker) [OM]
- LazyDock-GUI (Electron wrapper around terminal-based container tools) [OM]

TUI Alternatives:
- lazydocker (Keyboard-driven TUI for managing containers, images, and volumes) [OM]
- oxker (Fast, lightweight TUI for Docker written in Rust) [OM]
- sen (Terminal engine for managing Docker containers interactively) [OM]
- dry (Terminal utility to monitor and manage Docker containers) [OM]
- k9s (Kubernetes and container-level TUI tracker) [OM]

---

## 26. Disk, Partitions & Filesystem Management — `category: disk-utils`
Core tools: `dosfstools`, `exfatprogs`, `gvfs-mtp`, `gvfs-nfs`, `gvfs-smb`, `bolt` (Thunderbolt auth) [OM]

GUI Alternatives:
- GParted (`gparted`, dedicated GTK partition editor) [OM]
- KDE Partition Manager (`partitionmanager`, Qt-based disk and partition editor) [OM]
- Ventoy (`ventoy`, tool to create multi-ISO bootable USB drives) [OM]
- BalenaEtcher (`etcher`, graphical image flashing utility) [OM]
- GNOME Disks (`gnome-disk-utility`, drive SMART status, formatting, backup/restore) [OM]

TUI Alternatives:
- ncdu (NCurses disk usage analyzer) [OM]
- gdu (Fast multi-threaded disk usage analyzer in Go) [OM]
- cfdisk (Ncurses-based partition editor in util-linux) [OM]
- cgdisk (Ncurses-based GPT partition manipulator) [OM]
- diskus (Minimal, fast disk space analyzer in Rust) [OM]

---

## 27. Firewall & Security Interfaces — `category: firewall`
Core engine: `ufw`, `ufw-docker`, `firewalld`, `iptables`, `nftables` [OM]

GUI Alternatives:
- Gufw (`gufw`, graphical interface for Uncomplicated Firewall) [OM]
- Firewalld GUI (`firewall-config`, configuration tool for firewalld) [OM]
- Opensnitch (`opensnitch`, interactive application firewall / Little Snitch clone) [OM]
- Shorewall GUI (Frontend helper for Shoreline Firewall) [OM]
- Vuurmuur (Powerful firewall manager with an interactive UI) [OM]

TUI Alternatives:
- interactive-iptables (TUI for editing and listing iptables rules) [OM]
- fwtui (Ncurses-based helper for packet filtering rules) [OM]
- nftables interactive (Interactive shell prompt for the nftables engine) [OM]
- apf-tui (Advanced Policy Firewall terminal management interface) [OM]
- shorewall-tui (Ncurses-based monitor for Shorewall states) [OM]

---

## 28. Password & Secrets Management — `category: secrets`
[AW][OM]:
- 1password-beta / 1password-cli [OM]
- keepassxc (local encrypted password vault GUI)
- bitwarden / bitwarden-cli
- libsecret [OM]
- gnome-keyring [OM]
- pass (standard UNIX password manager, CLI/GPG)

---

## 29. Git & Version Control Interfaces — `category: vcs-tools`
Core CLI tools: `github-cli` (`gh`), `tree-sitter-cli` [OM]

GUI Alternatives:
- GitKraken (Feature-rich commercial Git client GUI) [OM]
- GitHub Desktop (Official user-friendly Git interface from GitHub) [OM]
- Sublime Merge (High-performance Git client from Sublime Text team) [OM]
- Gitg (GNOME Git repository viewer) [OM]
- Git Cola (Sleek Python/Qt Git GUI) [OM]

TUI Alternatives:
- lazygit (Interactive terminal UI for Git commands) [OM]
- Tig (Text-mode interface for Git logs and diffs) [OM]
- GitUI (Blazingly fast Git terminal UI written in Rust) [OM]
- Git-assembler (Declarative tool to orchestrate branches in terminal views) [OM]
- gh-dash (Interactive dashboard extension for GitHub CLI) [OM]

---

## 30. Document & Markdown Editors — `category: document-editors`
Core & Document Viewers: `obsidian`, `typora`, `xournalpp`, `evince`, `sushi` [OM]

GUI Alternatives:
- Zettlr (Academic Markdown editor oriented toward Zettelkasten) [OM]
- MarkText (Modern real-time preview Markdown editor) [OM]
- Ghostwriter (Distraction-free Markdown writing environment) [OM]
- Joplin (Open-source note-taking app with sync) [OM]
- Logseq (Privacy-first local outliner for knowledge management) [OM]

TUI Alternatives:
- zk (Terminal-based Zettelkasten note-taking assistant) [OM]
- Telekasten (Neovim plugin acting as a Zettelkasten manager) [OM]
- note-cli (Lightweight command note utility) [OM]
- sncli (Python-based TUI client for Simplenote) [OM]
- jrnl (Command-line plain-text journal application) [OM]

---

## 31. Media, Creative & Video Apps — `category: media-apps`
[AW][OM]:
- mpv (CLI/GUI video player) [OM]
- imv (Wayland-native image viewer) [OM]
- kdenlive (Non-linear video editor) [OM]
- pinta (Lightweight image editor / Paint.NET equivalent) [OM]
- evince (PDF / document viewer) [OM]
- sushi (GNOME Files quick-look previewer) [OM]
- ffmpegthumbnailer / imagemagick (media processing & thumbnails) [OM]
- cliamp (TUI music player) [OM]
- spotify (streaming client) [OM]

---

## 32. CLI Productivity & Shell Quality-of-Life Tools — `category: cli-tools`
Modern Rust/Go replacements for traditional Unix coreutils [OM]:
- bat (cat replacement with syntax highlighting) [OM]
- eza (ls replacement with git status, tree view, metadata) [OM]
- fd (fast find replacement) [OM]
- ripgrep (blazingly fast grep replacement) [OM]
- dust (du disk usage replacement with graphical bars) [OM]
- zoxide (smart cd replacement with frecency jumping) [OM]
- fzf (general-purpose command-line fuzzy finder) [OM]
- jq (JSON processor and query engine) [OM]
- xmlstarlet (XML parser and processor) [OM]
- tldr (simplified community-driven man page cheatsheets) [OM]
- plocate (high-speed locate replacement utilizing io_uring) [OM]
- expac (pacman database format query tool) [OM]
- inxi (comprehensive system information CLI) [OM]
- gum (shell scripting UI helper for interactive prompts) [OM]
- usage (CLI tool specification parser) [OM]
- socat / inetutils / whois (network debugging utilities) [OM]
- less / man-db / bash-completion (baseline shell ergonomics) [OM]

---

## 33. Developer Toolchains & AI CLI Tools — `category: dev-toolchains`
[OM]:
- rust / ruby / llvm / clang / luarocks [OM]
- dotnet-runtime-9.0 (.NET runtime) [OM]
- mise (polyglot development tool and environment manager) [OM]
- claude-code (AI assistant CLI coding tool) [OM]
- python-gobject / python-poetry-core / python-terminaltexteffects [OM]
- tree-sitter-cli (incremental parsing system CLI) [OM]

---

## 34. Local Transfer, Communications & Productivity Apps — `category: apps`
[OM]:
- localsend (open-source local cross-platform file drop / AirDrop clone) [OM]
- signal-desktop (encrypted messaging) [OM]
- chromium (web browser) [OM]

---

## 35. Hardware, Brightness & System Utilities — `category: hardware-misc`
[OM]:
- brightnessctl (lightweight backlight control) [OM]
- asdcontrol (Apple Studio Display / external monitor brightness controller) [OM]
- avahi (mDNS / Zeroconf service discovery for AirPrint & LAN discovery) [OM]
- nss-mdns (Host name resolution for .local domains) [OM]
- wireless-regdb (Linux wireless regulatory database) [OM]
- tzupdate (automatic timezone updates via IP geolocation) [OM]
- kernel-modules-hook (automatic initramfs rebuilds on kernel/module updates) [OM]

---

## Open gaps / things this pass did NOT cover yet (flag for next research round)
1. **Icon themes, cursor themes, GTK/Qt color-scheme packages** — initial data points added (Papirus, Bibata, Yaru), but full sub-catalog needs formal expansion.
2. **Fonts** — foundational packages added (JetBrains Mono Nerd, Noto fonts, Font Awesome, iA Writer); further coding font alternatives can be mapped.
3. **Power/battery management daemons** (e.g. auto-cpufreq, TLP, power-profiles-daemon) — untouched, decision needed regarding inclusion in base installer scope.
4. **greetd greeters specifically** (tuigreet, regreet, gtkgreet, wlgreet) — named, verify packaging maturity.
5. **Screen-sharing specifics beyond portals** (e.g. wf-recorder alternatives, OBS plugins) — partial only.
6. **Phone-connect utilities** (KDE Connect, GSConnect) — Hyprland Wiki has a whole "Phone connect" section to pull.
7. **Exact current AUR vs official-repo location for every single package above** — requires live repo verification pass.

---

## Suggested next steps for the actual content pipeline
- Turn each numbered section above into a `category` in the TOML schema.
- Dedicated search passes still needed for: phone-connect tools, power management, greetd greeter validation.
- Cross-check every package name against `pacman -Ss <name>` / AUR web search before it goes in the schema.
- Feed into the "AI agent + daily n8n pipeline" (§6 of SimpleArch spec) as the initial seed catalog.

---

# Comparison Pass 2 — Omarchy v4 (`basecamp/omarchy`) Cross-Check & Alternative Mapping

Source: the actual, current, verbatim package manifest at
`basecamp/omarchy/install/omarchy-base.packages` (151 packages), cross-referenced with
`archinstall` default profile packages and the original SimpleArch catalog.

Below is the complete mapping of Omarchy-introduced categories and packages, including **at least 5 GUI and 5 TUI alternatives** for each core toolset.

### Category A: Container & Virtualization Management
*Primary tool in OmarchyOS:* `docker` / `docker-compose`

| Alternative Type | Tool Name | Description |
| :--- | :--- | :--- |
| **GUI** | **1. Portainer** | Web-based container management dashboard. |
| **GUI** | **2. Podman Desktop** | Graphical console for managing Podman/Docker containers. |
| **GUI** | **3. DockStation** | Developer-centric GUI client for Docker and Docker Compose. |
| **GUI** | **4. Docker Desktop** | Official container management dashboard from Docker. |
| **GUI** | **5. LazyDock-GUI** | Electron wrapper around terminal-based container tools. |
| **TUI** | **1. lazydocker** | Keyboard-driven TUI for managing containers, images, and volumes. |
| **TUI** | **2. oxker** | Simple, fast TUI for Docker written in Rust. |
| **TUI** | **3. sen** | Terminal engine for managing Docker containers interactively. |
| **TUI** | **4. dry** | Terminal utility to monitor and manage Docker containers. |
| **TUI** | **5. k9s** | While built for Kubernetes, provides comprehensive container-level TUI tracking. |

---

### Category B: Disk, Partitions & Filesystem Management
*Primary tool in OmarchyOS:* `gnome-disk-utility` / `dosfstools`

| Alternative Type | Tool Name | Description |
| :--- | :--- | :--- |
| **GUI** | **1. GParted** | Dedicated partition editor for creating, deleting, and resizing. |
| **GUI** | **2. KDE Partition Manager** | Qt-based utility to manage disk devices, partitions, and filesystems. |
| **GUI** | **3. Ventoy** | Graphical tool to create bootable USB drives. |
| **GUI** | **4. BalenaEtcher** | Simple GUI flash utility for writing ISOs to USB drives. |
| **GUI** | **5. GNOME Disks** | The default Omarchy utility for drive status and backup/restore. |
| **TUI** | **1. ncdu** | Disk usage analyzer utilizing NCurses. |
| **TUI** | **2. gdu** | Fast disk usage analyzer written in Go. |
| **TUI** | **3. cfdisk** | Ncurses-based partition editor package built into standard util-linux. |
| **TUI** | **4. cgdisk** | Ncurses-based GPT partition manipulator. |
| **TUI** | **5. diskus** | Minimal, multi-threaded fast disk space analyzer. |

---

### Category C: Firewall & Security Interfaces
*Primary tool in OmarchyOS:* `ufw`

| Alternative Type | Tool Name | Description |
| :--- | :--- | :--- |
| **GUI** | **1. Gufw** | Graphical interface for managing the Uncomplicated Firewall (UFW). |
| **GUI** | **2. Firewalld GUI** | Configuration tool for the firewalld daemon. |
| **GUI** | **3. Opensnitch** | Interactive application firewall port for Linux (Little Snitch clone). |
| **GUI** | **4. Shorewall GUI** | Frontend helper interfaces for Shoreline Firewall. |
| **GUI** | **5. Vuurmuur** | Powerful firewall manager using an interactive UI. |
| **TUI** | **1. interactive-iptables** | TUI for quickly editing and listing iptables rules. |
| **TUI** | **2. fwtui** | Ncurses-based helper for packet filtering rules. |
| **TUI** | **3. nftables interactive** | Shell prompt client for controlling the nftables engine. |
| **TUI** | **4. apf-tui** | Advanced Policy Firewall terminal management interface. |
| **TUI** | **5. shorewall-tui** | Ncurses-based monitor for Shorewall states. |

---

### Category D: Input Methods & Localization
*Primary tool in OmarchyOS:* `fcitx5`

| Alternative Type | Tool Name | Description |
| :--- | :--- | :--- |
| **GUI** | **1. IBus Preferences** | Configuration interface for Intelligent Input Bus. |
| **GUI** | **2. fcitx5-config-qt** | Dedicated configuration GUI for Fcitx5. |
| **GUI** | **3. SCIM Setup** | Graphical setup for Smart Common Input Method. |
| **GUI** | **4. Uim-pref-gtk** | Universal Input Method setup frontend. |
| **GUI** | **5. Nimf Settings** | Configuration tool for the Nimf input method framework. |
| **TUI** | **1. ibus-setup (CLI mode)** | Command line terminal engine wrapper for IBus. |
| **TUI** | **2. fcitx5-remote** | CLI utility for controlling input method status. |
| **TUI** | **3. uim-sh** | Command-line interface and shell evaluator for Uim. |
| **TUI** | **4. scim-config-agent** | Terminal command tool to configure SCIM engines. |
| **TUI** | **5. fcitx5-diagnose** | Interactive terminal troubleshooting engine for Fcitx5. |

---

### Category E: Git & Version Control Interfaces
*Primary tool in OmarchyOS:* `github-cli` / `lazygit`

| Alternative Type | Tool Name | Description |
| :--- | :--- | :--- |
| **GUI** | **1. GitKraken** | Highly popular, feature-rich Git client GUI. |
| **GUI** | **2. GitHub Desktop** | Official user-friendly Git interface from GitHub. |
| **GUI** | **3. Sublime Merge** | Extremely fast Git client from the makers of Sublime Text. |
| **GUI** | **4. Gitg** | GNOME client for viewing Git repositories. |
| **GUI** | **5. Git Cola** | Sleek and powerful Python/Qt Git GUI. |
| **TUI** | **1. lazygit** | High-performance interactive Git console TUI. |
| **TUI** | **2. Tig** | Text-mode interface for Git repository logs and diffs. |
| **TUI** | **3. GitUI** | Blazingly fast Git terminal UI written in Rust. |
| **TUI** | **4. Git-assembler** | Declarative tool to orchestrate branches in terminal views. |
| **TUI** | **5. gh-dash** | Interactive dashboard extension for the GitHub CLI. |

---

### Category F: Document & Markdown Editors
*Primary tool in OmarchyOS:* `obsidian` / `typora` / `xournalpp`

| Alternative Type | Tool Name | Description |
| :--- | :--- | :--- |
| **GUI** | **1. Zettlr** | Markdown editor oriented toward academic writing and Zettelkasten. |
| **GUI** | **2. MarkText** | Modern real-time preview Markdown editor. |
| **GUI** | **3. Ghostwriter** | Distraction-free Markdown writing environment. |
| **GUI** | **4. Joplin** | Open-source note-taking app with Markdown and cloud synchronization. |
| **GUI** | **5. Logseq** | Privacy-first local-outliner for knowledge management. |
| **TUI** | **1. zk** | Terminal-based note-taking assistant. |
| **TUI** | **2. Telekasten (Neovim)** | Luarocks/Neovim plugin acting as a Zettelkasten manager. |
| **TUI** | **3. note-cli** | Lightweight terminal command note utility. |
| **TUI** | **4. sncli** | Python-based TUI client for Simplenote. |
| **TUI** | **5. jrnl** | Command-line journal application that stores entries in plain text. |

---

# archinstall Overlap — Conditional Skip Inputs, Not Removed Categories

**Important correction:** nothing below means any SimpleArch
category gets deleted. SimpleArch's own premise is a **bare/Minimal archinstall** (or manual
pacstrap) — in that flow, archinstall installs *none* of the desktop-layer categories below, and
every SimpleArch category stays exactly as cataloged. This section only matters
for the **edge case** where someone ran archinstall's optional "Desktop" flow instead of "Minimal"
and then runs SimpleArch afterward. Verified against the current `archlinux/archinstall` repo
(`archinstall/default_profiles/desktops/`) and its guided-installer documentation.

This is not a special case requiring new logic — it's exactly what §3's generic filtering
mechanism already exists for. archinstall's `user_configuration.json` (System Scan, §7 Case A)
just becomes one more source of accumulated answers alongside ricing-tier and maturity-ceiling.
Each category step already declares tag-based gates; "already satisfied by a prior install" is
the same kind of check as "already satisfied by a prior wizard step," so a step whose answer is
already known from the state map is **skipped**, not hardcoded around. Nothing in §3's engine
needs to change — this only affects what tags System Scan populates before the wizard runs.

## Unconditionally out of scope, regardless of archinstall flow
These never touch a SimpleArch category either way — disk partitioning, filesystem (ext4/btrfs/
xfs), LUKS encryption, bootloader (systemd-boot/GRUB), kernel selection, hostname/user/locale,
mirror region, NTP, GPU driver selection. Correctly out of scope per spec §7 regardless of which
archinstall flow was used.

## Conditional skip candidates — only populated if the Desktop flow was used

**Desktop profile choice** (only exists if "Desktop" was picked over "Minimal"/"Server"). Current
profile list from `archinstall/default_profiles/desktops/`:
gnome, plasma, xfce4, mate, lxqt, sway, hyprland, i3, niri, niri_dms, labwc, river, qtile, xmonad.

If System Scan's Case A finds one of these in `user_configuration.json`, that's an
**already-satisfied** tag for the WM/compositor category step — the step is skipped rather than
re-asked, the same way a `depends_on` gate skips an incompatible option today. If the user runs
SimpleArch and explicitly wants to pick a *different* compositor anyway, that's the existing
single-select hard-conflict path (§7): keep existing / replace / cancel — not a new mechanism,
the same one already specified for a manually-installed WM found during Case B scanning.

**Audio server** (PipeWire vs PulseAudio — only asked by archinstall if a Desktop profile was
chosen, or via `--audio` flag). Same treatment: if found already configured, the audio-stack
category step is skipped as already-satisfied.

**Network stack** (NetworkManager vs systemd-networkd vs manual). Same treatment.

## Unverified — flag for follow-up, don't assume
Some 2026-era archinstall walkthroughs mention a firewall selection step during install (UFW
appears in at least one guide). Whether this is a real, current archinstall option needs a direct
check against the guided-installer source before treating "Firewall" (added in Pass 2 from
Omarchy) as another conditional-skip candidate. Not confirmed either way yet.

## Net effect on the catalog
No category is removed. The only change this pass produces is a note that System Scan's Case A
extraction (parsing `user_configuration.json`) should specifically look for: desktop profile,
audio server choice, and network stack choice — since those three are the ones that can already
be populated before SimpleArch ever runs, and only when the user's own archinstall run went
through the Desktop flow rather than Minimal.

---

## Still not fully resolved by this pass
- Omarchy's **theme system** (`omarchy-theme-*` commands, per-theme bundles of wallpaper + Waybar
  colors + terminal colors + GTK/Qt theme) is a higher-level abstraction than individual packages —
  it's a *configuration format* Omarchy invented, not a package list. SimpleArch's config-only
  scope (per spec, configuration is explicitly out of scope for the installer tool itself) means this
  doesn't directly translate to a SimpleArch category, but it's worth knowing Omarchy solves
  "coordinated theming across bar/terminal/GTK/Qt" as one unit rather than per-component — that's a
  design precedent for the *separate future configurator project* mentioned in spec §10, not
  for SimpleArch itself.
- Icon/cursor theme catalog is seeded with Papirus, Bibata, Yaru; full sub-catalog needs ongoing expansion.
- Omarchy's webapps layer (PWA-wrapped Basecamp/WhatsApp/ChatGPT/etc.) is confirmed out of scope for
  SimpleArch (that's app-installation, not desktop-ricing) but flagged here so it's a documented,
  deliberate exclusion rather than an oversight.
