import { Phase } from "@/types/catalog";

export const CATALOG_PHASES: Phase[] = [
  {
    id: "base",
    title: "Base & Architecture",
    description: "Core display server protocols, desktop architecture paradigms, and package manager helpers.",
    iconName: "Cpu",
    categories: [
      {
        id: "display-protocol",
        name: "Display Protocol",
        shortDesc: "Wayland vs X11 windowing protocol foundation",
        detailedDesc: "Wayland is the modern Linux graphics standard providing tear-free rendering, per-monitor scaling, and isolation. X11 is the battle-tested legacy display server protocol.",
        iconName: "Monitor",
        phaseId: "base",
        selectionType: "single",
        optional: false,
        packages: [
          {
            id: "protocol-wayland",
            name: "Wayland (Recommended)",
            packageName: "wayland",
            source: "repo",
            description: "Modern graphics protocol engine with native hardware vsync, multi-DPI, and Wayland surface isolation.",
            pros: ["Zero screen tearing", "Native fractional scaling", "High-refresh multi-monitor support", "Modern security sandbox"],
            cons: ["Some older X11 screen recorders require portals or XWayland bridge"],
            stabilityScore: 9,
            tags: ["protocol", "modern", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            websiteUrl: "https://wayland.freedesktop.org"
          },
          {
            id: "protocol-x11",
            name: "X11 / Xorg",
            packageName: "xorg-server",
            source: "repo",
            description: "Traditional X Window System server running X11 network protocol.",
            pros: ["Universal compatibility with 30 years of Linux software", "Simple global key grabbing"],
            cons: ["Susceptible to tearing", "Poor fractional scaling", "Older security model"],
            stabilityScore: 9,
            tags: ["protocol", "legacy"],
            recommended: false,
            websiteUrl: "https://x.org"
          }
        ]
      },
      {
        id: "desktop-architecture",
        name: "Desktop Architecture Paradigm",
        shortDesc: "Choose between hand-assembling modular daemons or installing an integrated Desktop Environment.",
        detailedDesc: "Hand-assembled setups let you pair your own compositor (Hyprland/Sway), bar (Waybar), launcher (Walker/Rofi), and utilities. A full DE bundles everything into one cohesive pre-configured suite.",
        iconName: "Layers",
        phaseId: "base",
        selectionType: "single",
        optional: false,
        packages: [
          {
            id: "arch-hand-assembled",
            name: "Hand-Assembled Modular Stack (Ricing Choice)",
            packageName: "hand-assembled",
            source: "repo",
            description: "Individual selection of compositor, bar, launcher, lockscreen, notification center, and custom QoL tools.",
            pros: ["Complete freedom of choice across every single component", "Zero bloat", "Microsecond responsiveness", "Full Unixporn customization"],
            cons: ["Requires individual component selection (guided by SimpleArch)"],
            stabilityScore: 10,
            tags: ["modular", "ricing", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "arch-full-de",
            name: "Full Desktop Environment (DE)",
            packageName: "full-de",
            source: "repo",
            description: "Integrated desktop suite (KDE Plasma, GNOME, etc.) providing a unified shell, settings panel, and apps.",
            pros: ["Everything works out of the box", "Unified settings UI", "No manual plumbing configuration needed"],
            cons: ["Heavier memory footprint", "Opinionated layouts", "Skips manual shell modularity"],
            stabilityScore: 9,
            tags: ["monolithic", "integrated"],
            recommended: false
          }
        ]
      },
      {
        id: "desktop-environment",
        name: "Integrated Desktop Environment",
        shortDesc: "Select which complete desktop suite to deploy.",
        detailedDesc: "Only active if Full Desktop Environment was selected above. Skips downstream standalone bar and launcher steps.",
        iconName: "LayoutGrid",
        phaseId: "base",
        selectionType: "single",
        optional: true,
        dependsOn: {
          category: "desktop-architecture",
          value: "arch-full-de",
          condition: "includes"
        },
        packages: [
          {
            id: "de-plasma",
            name: "KDE Plasma 6",
            packageName: "plasma-meta",
            source: "repo",
            description: "Next-gen Qt6-based desktop environment featuring KWin compositor and extreme graphical customizability.",
            pros: ["Wayland-first", "Exceptional multi-monitor and HDR support", "Extensive settings GUI"],
            cons: ["Higher resource footprint than standalone tiling WMs"],
            stabilityScore: 9,
            tags: ["qt6", "wayland", "desktop-suite"],
            recommended: true,
            websiteUrl: "https://kde.org/plasma-desktop/"
          },
          {
            id: "de-gnome",
            name: "GNOME 46+",
            packageName: "gnome",
            source: "repo",
            description: "Minimalist, gesture-driven GTK4 desktop using Mutter Wayland compositor.",
            pros: ["Polished trackpad gestures", "Clean aesthetics", "Vibrant extension ecosystem"],
            cons: ["Rigid UX defaults", "Extensions can break between major updates"],
            stabilityScore: 9,
            tags: ["gtk4", "wayland", "desktop-suite"],
            recommended: false,
            websiteUrl: "https://www.gnome.org"
          },
          {
            id: "de-cosmic",
            name: "System76 COSMIC Desktop",
            packageName: "cosmic-session",
            source: "aur",
            description: "Brand new Rust-based modular Wayland desktop environment engineered by System76.",
            pros: ["Memory-safe Rust architecture", "Native Wayland applets and hybrid tiling"],
            cons: ["Rapidly developing alpha/beta status"],
            stabilityScore: 7,
            tags: ["rust", "wayland", "modern"],
            recommended: false,
            websiteUrl: "https://system76.com/cosmic"
          },
          {
            id: "de-xfce",
            name: "Xfce 4",
            packageName: "xfce4",
            source: "repo",
            description: "Lightweight, traditional GTK-based desktop environment for supreme efficiency.",
            pros: ["Rock-solid stability", "Extremely low RAM usage", "Traditional desktop metaphor"],
            cons: ["Historically X11-centric (Wayland transition in progress)"],
            stabilityScore: 9,
            tags: ["gtk", "lightweight"],
            recommended: false,
            websiteUrl: "https://xfce.org"
          }
        ]
      },
      {
        id: "compositor-wm",
        name: "Compositor & Window Manager",
        shortDesc: "The core graphical engine responsible for tiling, drawing window frames, animations, and hotkeys.",
        detailedDesc: "Under Wayland, the compositor is both the display server and the window manager. It coordinates GPU buffers and manages workspaces.",
        iconName: "AppWindow",
        phaseId: "base",
        selectionType: "single",
        optional: true,
        dependsOn: {
          category: "desktop-architecture",
          value: "arch-hand-assembled",
          condition: "includes"
        },
        packages: [
          {
            id: "hyprland",
            name: "Hyprland (Recommended)",
            packageName: "hyprland",
            source: "repo",
            description: "Dynamic tiling Wayland compositor featuring smooth bezier animations, Kawase blur, rounded corners, and powerful IPC sockets.",
            pros: ["Astonishing visual polish & spring physics", "Extensive socket IPC ecosystem", "Dwindle & master layouts", "Huge active community"],
            cons: ["Rapid development pace requires keeping plugins in sync with updates"],
            stabilityScore: 9,
            tags: ["wayland", "tiling", "animations", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            targetConfigPath: "~/.config/hypr/hyprland.conf",
            websiteUrl: "https://hyprland.org",
            githubUrl: "https://github.com/hyprwm/Hyprland"
          },
          {
            id: "sway",
            name: "Sway",
            packageName: "sway",
            source: "repo",
            description: "Drop-in i3-compatible Wayland compositor built directly on wlroots. Minimalist, rock-solid, and battle-tested.",
            pros: ["100% compatible with i3 syntax", "Rock-solid stability", "Zero visual distractions or overhead"],
            cons: ["No built-in blur or advanced rounded window shaders (requires forks)"],
            stabilityScore: 10,
            tags: ["wayland", "wlroots", "minimalist"],
            recommended: false,
            websiteUrl: "https://swaywm.org"
          },
          {
            id: "niri",
            name: "Niri",
            packageName: "niri",
            source: "repo",
            description: "Scrollable-tiling Wayland compositor inspired by PaperWM. Windows open in infinite horizontal ribbons.",
            pros: ["Unique horizontal infinite ribbon workflow", "Fluid touchpad gestures", "Written in Rust"],
            cons: ["Different paradigm than standard grid tiling WMs"],
            stabilityScore: 8,
            tags: ["wayland", "scrollable", "rust"],
            recommended: false,
            githubUrl: "https://github.com/YaLTeR/niri"
          },
          {
            id: "river",
            name: "River",
            packageName: "river",
            source: "repo",
            description: "Dynamic tiling Wayland compositor following the Suckless and dwm philosophy. Highly scriptable via IPC.",
            pros: ["Extremely lightweight", "Tag-based workspace management", "Modular layout generator daemons"],
            cons: ["Requires external layout generators for custom arrangements"],
            stabilityScore: 8,
            tags: ["wayland", "dynamic", "suckless"],
            recommended: false,
            githubUrl: "https://github.com/riverwm/river"
          },
          {
            id: "labwc",
            name: "Labwc",
            packageName: "labwc",
            source: "repo",
            description: "Openbox-like stacking Wayland compositor focusing on simplicity and lightweight efficiency.",
            pros: ["Openbox config compatibility", "Very lightweight", "Great for classic floating window lovers"],
            cons: ["Not primarily designed for automated keyboard tiling"],
            stabilityScore: 8,
            tags: ["wayland", "stacking", "openbox"],
            recommended: false,
            githubUrl: "https://github.com/labwc/labwc"
          }
        ]
      },
      {
        id: "display-manager",
        name: "Display & Login Manager",
        shortDesc: "Graphical or console login greeter launched at boot time.",
        detailedDesc: "Handles user authentication, PAM session creation, and launches your compositor via systemd session wrappers.",
        iconName: "KeyRound",
        phaseId: "base",
        selectionType: "single",
        optional: false,
        packages: [
          {
            id: "greetd-tuigreet",
            name: "greetd + tuigreet (Recommended)",
            packageName: "greetd",
            source: "repo",
            description: "Extremely lightweight, minimal login daemon paired with a fast Rust-based TUI console greeter.",
            pros: ["Instantaneous boot time", "Clean terminal aesthetics", "Runs Wayland compositors cleanly without display server overhead"],
            cons: ["Text-mode console interface rather than graphical mouse avatar UI"],
            stabilityScore: 10,
            tags: ["tui", "greetd", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            targetConfigPath: "/etc/greetd/config.toml"
          },
          {
            id: "sddm",
            name: "SDDM",
            packageName: "sddm",
            source: "repo",
            description: "Qt-based graphical login manager supporting both X11 and Wayland sessions with themes.",
            pros: ["Rich theme support", "Native Qt integration", "User avatars and session switchers"],
            cons: ["Heavier dependencies than greetd"],
            stabilityScore: 9,
            tags: ["gui", "qt6", "display-manager"],
            recommended: false
          },
          {
            id: "ly",
            name: "Ly Display Manager",
            packageName: "ly",
            source: "aur",
            description: "Compact ncurses-like TUI display manager with a retro terminal matrix aesthetic.",
            pros: ["Lightweight C implementation", "Retro console look"],
            cons: ["AUR package on Arch Linux"],
            stabilityScore: 8,
            tags: ["tui", "aur", "retro"],
            recommended: false
          },
          {
            id: "no-dm",
            name: "Manual TTY Login (No Display Manager)",
            packageName: "none",
            source: "repo",
            description: "Log in through standard Linux TTY and launch Hyprland/Sway using `uwsm` or `~/.bash_profile`.",
            pros: ["Absolute zero background daemon overhead", "Total control over startup environment"],
            cons: ["Must type `start-hyprland` or configure login script"],
            stabilityScore: 10,
            tags: ["manual", "tty", "minimal"],
            recommended: false
          }
        ]
      },
      {
        id: "aur-helper",
        name: "AUR Helper & Package Engine",
        shortDesc: "Tool to automatically resolve dependencies and compile packages from Arch User Repository.",
        detailedDesc: "Essential for ricing utilities, proprietary apps, and bleeding-edge GitHub releases.",
        iconName: "Package",
        phaseId: "base",
        selectionType: "single",
        optional: false,
        packages: [
          {
            id: "paru",
            name: "Paru (Recommended)",
            packageName: "paru",
            source: "aur",
            description: "Feature-rich, high-performance Pacman/AUR wrapper written in Rust with interactive review diffs.",
            pros: ["Written in memory-safe Rust", "Built-in PKGBUILD diff viewer before building", "Rich search UI"],
            cons: ["Requires Rust toolchain during initial bootstrap compile"],
            stabilityScore: 9,
            tags: ["rust", "aur", "recommended"],
            recommended: true,
            githubUrl: "https://github.com/Morganamilo/paru"
          },
          {
            id: "yay",
            name: "Yay (Yet Another Yogurt)",
            packageName: "yay",
            source: "aur",
            description: "The most famous and widely adopted AUR helper for Arch Linux, written in Go.",
            pros: ["Extremely mature and stable", "Familiar pacman syntax", "Fast compilation and search"],
            cons: ["Doesn't force-prompt PKGBUILD reviews by default"],
            stabilityScore: 10,
            tags: ["go", "aur"],
            recommended: false,
            isOmarchyDefault: true,
            githubUrl: "https://github.com/Jguer/yay"
          }
        ]
      }
    ]
  },
  {
    id: "shell",
    title: "Desktop Shell & Core Plumbings",
    description: "Status bars, launchers, notification systems, on-screen displays, and wallpaper managers.",
    iconName: "PanelTop",
    categories: [
      {
        id: "status-bar",
        name: "Status Bar & Desktop Panels",
        shortDesc: "Displays workspaces, clocks, hardware gauges, audio volume, and network status.",
        detailedDesc: "Requests top-layer surface space from the compositor via wlr-layer-shell.",
        iconName: "Sliders",
        phaseId: "shell",
        selectionType: "single",
        optional: true,
        dependsOn: {
          category: "desktop-architecture",
          value: "arch-hand-assembled",
          condition: "includes"
        },
        packages: [
          {
            id: "waybar",
            name: "Waybar (Recommended)",
            packageName: "waybar",
            source: "repo",
            description: "The de-facto standard customizable status bar for wlroots and Hyprland compositors with JSON configuration and CSS styling.",
            pros: ["Declarative JSON module layout", "Full GTK3 CSS styling engine", "Hundreds of battle-tested community themes", "High stability"],
            cons: ["Polling modules require shell scripts for complex interactive dials"],
            stabilityScore: 10,
            tags: ["gtk3", "css", "layer-shell", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            targetConfigPath: "~/.config/waybar/config.jsonc",
            githubUrl: "https://github.com/Alexays/Waybar"
          },
          {
            id: "quickshell",
            name: "Quickshell",
            packageName: "quickshell",
            source: "aur",
            description: "Next-generation programmable desktop shell framework powered by QtQuick, QML, and JavaScript. Build full reactive HUDs and visual instruments.",
            pros: ["Complete reactive UI programming with QML & JS", "Native PipeWire & D-Bus hooks", "Hardware spring physics animations", "Ultimate customization"],
            cons: ["Requires QML knowledge for deep custom development"],
            stabilityScore: 8,
            tags: ["qtquick", "qml", "reactive", "advanced"],
            recommended: false,
            githubUrl: "https://github.com/outfoxxed/quickshell"
          },
          {
            id: "eww",
            name: "Eww (ElKowar's Wacky Widgets)",
            packageName: "eww",
            source: "repo",
            description: "Standalone widget system written in Rust using Yuck syntax and SCSS styling.",
            pros: ["Extremely flexible widget canvas", "Standalone daemon architecture", "Rust performance"],
            cons: ["Custom Yuck configuration syntax has a steep learning curve"],
            stabilityScore: 8,
            tags: ["rust", "yuck", "widgets"],
            recommended: false,
            githubUrl: "https://github.com/elkowar/eww"
          },
          {
            id: "yambar",
            name: "Yambar",
            packageName: "yambar",
            source: "repo",
            description: "Modular, ultra-minimal status panel for X11 and Wayland with zero toolkit bloat.",
            pros: ["Fast startup", "Very low memory footprint", "Clean YAML config"],
            cons: ["Fewer pre-made graphical widgets compared to Waybar"],
            stabilityScore: 8,
            tags: ["yaml", "minimal"],
            recommended: false
          }
        ]
      },
      {
        id: "launcher",
        name: "Application Launcher & Command Palette",
        shortDesc: "Search menu for binary launching, window switching, and script actions.",
        detailedDesc: "Modal popup triggered via keyboard chords (e.g. Super + Space).",
        iconName: "Search",
        phaseId: "shell",
        selectionType: "single",
        optional: true,
        dependsOn: {
          category: "desktop-architecture",
          value: "arch-hand-assembled",
          condition: "includes"
        },
        packages: [
          {
            id: "walker",
            name: "Walker (Recommended)",
            packageName: "walker",
            source: "aur",
            description: "Extremely fast, extensible application runner and clipboard/command launcher written in Go with layer-shell integration.",
            pros: ["Blazing fast fuzzy search", "Built-in clipboard, runner, and calc modules", "Modern UI with GTK4/layer-shell", "Custom plugin support"],
            cons: ["AUR package"],
            stabilityScore: 9,
            tags: ["go", "wayland", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            githubUrl: "https://github.com/abenz1267/walker"
          },
          {
            id: "rofi-wayland",
            name: "Rofi (Wayland Fork)",
            packageName: "rofi-wayland",
            source: "repo",
            description: "Direct Wayland port of the classic Rofi window switcher, run dialog, and dmenu replacement.",
            pros: ["Vast universe of existing Rofi themes", "Full dmenu compatibility", "Official Arch extra repo package"],
            cons: ["Older theme syntax format"],
            stabilityScore: 9,
            tags: ["wayland", "classic", "themes"],
            recommended: false,
            githubUrl: "https://github.com/lbonn/rofi"
          },
          {
            id: "fuzzel",
            name: "Fuzzel",
            packageName: "fuzzel",
            source: "repo",
            description: "Wayland-native application launcher built specifically for wlroots compositors. Zero bloat, instant startup.",
            pros: ["Starts in 5ms", "Clean aesthetic", "Extremely tiny binary and minimal memory footprint"],
            cons: ["Less customizable layout styling than Walker or Rofi"],
            stabilityScore: 9,
            tags: ["wayland", "c", "minimalist"],
            recommended: false
          },
          {
            id: "tofi",
            name: "Tofi",
            packageName: "tofi",
            source: "repo",
            description: "Tiny, dynamic, pixel-perfect dmenu replacement for Wayland.",
            pros: ["Super lightweight", "Fast keyboard navigation"],
            cons: ["Strictly text-focused; minimal icon support"],
            stabilityScore: 8,
            tags: ["minimal", "c"],
            recommended: false
          }
        ]
      },
      {
        id: "notification",
        name: "Notification Daemon & Notification Center",
        shortDesc: "Receives D-Bus desktop notifications and presents toasts & slide-out control center.",
        detailedDesc: "Implements org.freedesktop.Notifications to alert you of incoming messages, emails, and system events.",
        iconName: "Bell",
        phaseId: "shell",
        selectionType: "single",
        optional: true,
        dependsOn: {
          category: "desktop-architecture",
          value: "arch-hand-assembled",
          condition: "includes"
        },
        packages: [
          {
            id: "swaync",
            name: "SwayNC (Sway Notification Center) (Recommended)",
            packageName: "swaync",
            source: "repo",
            description: "Complete notification daemon with a slide-out control center panel featuring quick toggles (DND, Wi-Fi, volume, screenshot).",
            pros: ["Slide-out notification panel drawer", "Custom widget toggles (audio, night light, DND)", "GTK3 CSS styling", "Rich media controls"],
            cons: ["Slightly higher RAM usage than minimal toast-only daemons like mako"],
            stabilityScore: 9,
            tags: ["gtk3", "panel", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            targetConfigPath: "~/.config/swaync/config.json",
            githubUrl: "https://github.com/ErikReider/SwayNotificationCenter"
          },
          {
            id: "mako",
            name: "Mako",
            packageName: "mako",
            source: "repo",
            description: "Lightweight notification daemon for Wayland compositors supporting wlroots and Hyprland.",
            pros: ["Ultra-minimalist", "Very fast toast alerts", "Low resource consumption"],
            cons: ["No historical notification center or quick-settings drawer"],
            stabilityScore: 9,
            tags: ["c", "minimalist", "wlroots"],
            recommended: false,
            githubUrl: "https://github.com/emersion/mako"
          },
          {
            id: "dunst",
            name: "Dunst",
            packageName: "dunst",
            source: "repo",
            description: "Classic lightweight and highly customizable notification daemon with layer-shell support.",
            pros: ["Decades of documented configs", "Keyboard navigable notification history"],
            cons: ["Traditional UI layout; no modern slider panel"],
            stabilityScore: 9,
            tags: ["classic", "lightweight"],
            recommended: false
          }
        ]
      },
      {
        id: "osd",
        name: "On-Screen Display (OSD) Overlays",
        shortDesc: "Smooth volume, mute, brightness, and caps-lock floating popups.",
        detailedDesc: "Essential quality-of-life component: displays visual indicators when adjusting volume keys or screen brightness.",
        iconName: "Volume2",
        phaseId: "shell",
        selectionType: "single",
        optional: true,
        dependsOn: {
          category: "desktop-architecture",
          value: "arch-hand-assembled",
          condition: "includes"
        },
        packages: [
          {
            id: "swayosd",
            name: "SwayOSD (Recommended)",
            packageName: "swayosd-git",
            source: "aur",
            description: "Modern OSD window for keyboard shortcuts (volume up/down, microphone mute, brightness, caps-lock) using libadwaita styling.",
            pros: ["Sleek pill-shaped overlay", "Audio volume and brightness curves", "Caps lock and num lock indicator", "OmarchyOS default"],
            cons: ["Requires libadwaita/GTK4 dependencies"],
            stabilityScore: 9,
            tags: ["gtk4", "qol", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            githubUrl: "https://github.com/ErikReider/SwayOSD"
          },
          {
            id: "avizo",
            name: "Avizo",
            packageName: "avizo",
            source: "aur",
            description: "Neat notification-daemon-like utility for multimedia keys on Wayland.",
            pros: ["Simple configuration", "Smooth progress bars"],
            cons: ["Less actively maintained than SwayOSD"],
            stabilityScore: 7,
            tags: ["wayland", "c"],
            recommended: false
          }
        ]
      },
      {
        id: "wallpaper",
        name: "Wallpaper Daemon & Visual Backgrounds",
        shortDesc: "Paints wallpapers, animated GIFs, or dynamic transitions across your displays.",
        detailedDesc: "Runs in the background layer-shell without interfering with application windows.",
        iconName: "Image",
        phaseId: "shell",
        selectionType: "single",
        optional: true,
        dependsOn: {
          category: "desktop-architecture",
          value: "arch-hand-assembled",
          condition: "includes"
        },
        packages: [
          {
            id: "swww",
            name: "swww (Recommended)",
            packageName: "swww",
            source: "repo",
            description: "Efficient Wayland wallpaper daemon written in Rust supporting smooth transition effects (wipe, wave, grow, fade) and animated GIFs.",
            pros: ["Incredible fluid transition animations", "Supports animated GIFs & WebPs", "Daemon control via CLI socket", "Multi-monitor independent wallpapers"],
            cons: ["Slightly more complex CLI parameters than static hyprpaper"],
            stabilityScore: 9,
            tags: ["rust", "transitions", "animated", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            githubUrl: "https://github.com/LGFae/swww"
          },
          {
            id: "hyprpaper",
            name: "hyprpaper",
            packageName: "hyprpaper",
            source: "repo",
            description: "Blazing-fast, lightweight static wallpaper utility from the official Hyprland project.",
            pros: ["Minimal memory footprint", "Direct IPC socket with Hyprland", "Native Hyprland configuration format"],
            cons: ["Static wallpapers only; no wipe/wave animated transition effects"],
            stabilityScore: 9,
            tags: ["hyprland", "fast", "static"],
            recommended: false,
            githubUrl: "https://github.com/hyprwm/hyprpaper"
          },
          {
            id: "mpvpaper",
            name: "mpvpaper",
            packageName: "mpvpaper",
            source: "repo",
            description: "Video wallpaper utility utilizing mpv hardware video decoding as a live desktop background.",
            pros: ["Full live video loops (MP4, MKV) as desktop wallpaper", "Hardware GPU video decoding"],
            cons: ["Consumes more GPU and battery power on laptops"],
            stabilityScore: 8,
            tags: ["video", "live-wallpaper"],
            recommended: false
          },
          {
            id: "waypaper",
            name: "Waypaper (GUI Wallpaper Picker)",
            packageName: "waypaper",
            source: "aur",
            description: "Graphical wallpaper selector frontend that sits on top of swww or hyprpaper.",
            pros: ["Visual image thumbnail gallery", "Point-and-click wallpaper selection"],
            cons: ["GUI utility rather than background daemon"],
            stabilityScore: 9,
            tags: ["gui", "picker"],
            recommended: false
          }
        ]
      },
      {
        id: "idle-lock",
        name: "Idle Management & Screen Locker",
        shortDesc: "Monitors user inactivity, dims displays, suspends system, and presents secure lockscreen.",
        detailedDesc: "Coordinates security and power conservation when stepping away from your machine.",
        iconName: "Lock",
        phaseId: "shell",
        selectionType: "single",
        optional: true,
        dependsOn: {
          category: "desktop-architecture",
          value: "arch-hand-assembled",
          condition: "includes"
        },
        packages: [
          {
            id: "hyprlock-idle",
            name: "hypridle + hyprlock (Recommended)",
            packageName: "hyprlock",
            source: "repo",
            description: "Modern, GPU-accelerated lockscreen with Kawase background blur, dynamic time widgets, and fast input handling, paired with hypridle daemon.",
            pros: ["GPU-accelerated smooth rendering", "Beautiful configurable widgets (avatar, clock, battery)", "Native Wayland ext-session-lock protocol", "Hyprland ecosystem sync"],
            cons: ["Requires Hyprland or wlroots compositor supporting session-lock"],
            stabilityScore: 9,
            tags: ["hyprland", "lockscreen", "gpu", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            targetConfigPath: "~/.config/hypr/hyprlock.conf",
            githubUrl: "https://github.com/hyprwm/hyprlock"
          },
          {
            id: "swaylock-effects",
            name: "swayidle + swaylock-effects",
            packageName: "swaylock-effects-git",
            source: "aur",
            description: "Classic Swaylock fork with added desktop screenshot blurring, fade-in animations, and grace periods.",
            pros: ["Extremely battle-tested", "Screenshot snapshot blur"],
            cons: ["AUR package"],
            stabilityScore: 9,
            tags: ["sway", "lockscreen"],
            recommended: false
          },
          {
            id: "gtklock",
            name: "gtklock",
            packageName: "gtklock",
            source: "repo",
            description: "GTK3-based lockscreen utility with module extensions for music player controls and power buttons.",
            pros: ["GTK theming support", "Playerctl integration"],
            cons: ["Less customizable graphics than hyprlock"],
            stabilityScore: 8,
            tags: ["gtk", "lockscreen"],
            recommended: false
          }
        ]
      }
    ]
  },
  {
    id: "qol",
    title: "Desktop QoL & Ricing Utilities",
    description: "The fine-grained ricing details: clipboard managers, color pickers, screenshot annotation, polkit, portals, and fonts.",
    iconName: "Sparkles",
    categories: [
      {
        id: "clipboard",
        name: "Clipboard History & Managers",
        shortDesc: "Keeps history of copied text, images, and snippets with quick search modal.",
        detailedDesc: "Small convenience that transforms daily workflow: press Super + V to search and paste previous clips.",
        iconName: "Clipboard",
        phaseId: "qol",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "cliphist",
            name: "cliphist + wl-clipboard (Recommended)",
            packageName: "cliphist",
            source: "repo",
            description: "Wayland clipboard manager that stores text, images, and binary clips. Integrates seamlessly into Walker or Rofi fuzzy launchers.",
            pros: ["Supports both rich text and PNG/JPEG image previews", "Integrates into any launcher (Walker/Rofi)", "Zero memory leaks", "OmarchyOS default"],
            cons: ["Requires a launcher frontend to display history UI"],
            stabilityScore: 10,
            tags: ["clipboard", "wayland", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            githubUrl: "https://github.com/sentriz/cliphist"
          },
          {
            id: "clipse",
            name: "clipse (TUI Clipboard Manager)",
            packageName: "clipse-bin",
            source: "aur",
            description: "Keyboard-driven standalone TUI clipboard manager built in Go. Pops up in a small floating terminal scratchpad.",
            pros: ["Built-in sleek TUI interface", "Custom preview windows", "Independent of external launchers"],
            cons: ["Requires configuring a floating terminal window rule"],
            stabilityScore: 9,
            tags: ["tui", "go", "standalone"],
            recommended: false,
            githubUrl: "https://github.com/savedra1/clipse"
          },
          {
            id: "clipman",
            name: "clipman",
            packageName: "clipman",
            source: "repo",
            description: "Simple, lightweight clipboard manager for Wayland focused purely on text snippets.",
            pros: ["Minimalist", "Low footprint"],
            cons: ["Does not preserve image clipboard data"],
            stabilityScore: 8,
            tags: ["wayland", "text-only"],
            recommended: false
          }
        ]
      },
      {
        id: "color-picker",
        name: "Screen Color Picker & Eyedropper",
        shortDesc: "Sample hex/RGB pixel colors directly from your screen with auto-clipboard copy.",
        detailedDesc: "Invaluable for web development, ricing, and design work: click any pixel on your monitor to grab its hex code.",
        iconName: "Pipette",
        phaseId: "qol",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "hyprpicker",
            name: "hyprpicker (Recommended)",
            packageName: "hyprpicker",
            source: "repo",
            description: "GPU-accelerated Wayland color picker with circular magnified lens preview, multiple format outputs (HEX, RGB, HSL), and automatic clipboard copy.",
            pros: ["Magnified pixel lens overlay", "Instantaneous response", "Copies directly to clipboard", "OmarchyOS default"],
            cons: ["Wayland only"],
            stabilityScore: 10,
            tags: ["wayland", "qol", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            githubUrl: "https://github.com/hyprwm/hyprpicker"
          }
        ]
      },
      {
        id: "screenshot",
        name: "Screenshot & Annotation Utilities",
        shortDesc: "Region capture, instant screenshot markup, arrows, blurring, and clipboard copying.",
        detailedDesc: "Replaces heavy tools with blazing-fast region select + instant annotation markup.",
        iconName: "Camera",
        phaseId: "qol",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "satty-grim-slurp",
            name: "satty + grim + slurp (Recommended)",
            packageName: "satty",
            source: "repo",
            description: "Modern screenshot annotation tool built with GTK4 and libadwaita. grim captures pixels, slurp selects screen area, satty provides instant arrows, text, and blur markup.",
            pros: ["Modern, intuitive UI", "Quick arrows, rectangles, text, and pixelation blur", "Wayland-native", "OmarchyOS default"],
            cons: ["Requires grim and slurp installed as capture backends"],
            stabilityScore: 9,
            tags: ["gtk4", "annotation", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            githubUrl: "https://github.com/gabm/Satty"
          },
          {
            id: "swappy",
            name: "swappy",
            packageName: "swappy",
            source: "repo",
            description: "The classic Wayland snapshot editing tool. Very lightweight and responsive.",
            pros: ["Lightweight GTK3 app", "Fast brush, arrows, and highlights"],
            cons: ["Slightly dated UI compared to Satty"],
            stabilityScore: 9,
            tags: ["gtk3", "classic"],
            recommended: false
          },
          {
            id: "hyprshot",
            name: "hyprshot",
            packageName: "hyprshot",
            source: "aur",
            description: "Hyprland-specific CLI utility that easily captures active windows, monitors, or regions with zero configuration.",
            pros: ["Automatic active window border detection", "Clean shell script"],
            cons: ["Hyprland only"],
            stabilityScore: 9,
            tags: ["hyprland", "cli"],
            recommended: false
          },
          {
            id: "flameshot",
            name: "Flameshot",
            packageName: "flameshot",
            source: "repo",
            description: "Powerful and versatile screenshot software with integrated annotation and cloud upload.",
            pros: ["Rich feature set", "Pin screenshot to screen overlay"],
            cons: ["Requires XDG desktop portal under Wayland for proper area selection"],
            stabilityScore: 8,
            tags: ["qt", "gui"],
            recommended: false
          }
        ]
      },
      {
        id: "screen-recorder",
        name: "Hardware Screen Recording & Streaming",
        shortDesc: "GPU-accelerated video capture of your desktop or specific application windows.",
        detailedDesc: "Capture gameplay or desktop demonstrations without dropping frame rates.",
        iconName: "Video",
        phaseId: "qol",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "gpu-screen-recorder",
            name: "GPU Screen Recorder (Recommended)",
            packageName: "gpu-screen-recorder",
            source: "aur",
            description: "Extremely fast screen recorder utilizing NVENC/AMF/VAAPI hardware video encoders. Records with nearly 0% CPU overhead like ShadowPlay.",
            pros: ["Almost zero performance impact while gaming", "Hardware video encoding", "Instant replay buffer support", "OmarchyOS default"],
            cons: ["AUR package"],
            stabilityScore: 9,
            tags: ["gpu", "hardware", "recording", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            githubUrl: "https://git.dec05eba.com/gpu-screen-recorder"
          },
          {
            id: "wf-recorder",
            name: "wf-recorder",
            packageName: "wf-recorder",
            source: "repo",
            description: "Simple CLI screen recorder for wlroots-based Wayland compositors using ffmpeg backends.",
            pros: ["Lightweight CLI tool", "Select region with slurp"],
            cons: ["No replay buffer; manual terminal invocation"],
            stabilityScore: 9,
            tags: ["cli", "ffmpeg"],
            recommended: false
          },
          {
            id: "obs-studio",
            name: "OBS Studio",
            packageName: "obs-studio",
            source: "repo",
            description: "Professional open source software for video recording and live streaming with full PipeWire audio/video capture support.",
            pros: ["Complete studio mixing", "Multi-source scene layouts", "Virtual webcam output"],
            cons: ["Heavyweight application"],
            stabilityScore: 10,
            tags: ["streaming", "professional"],
            recommended: false
          }
        ]
      },
      {
        id: "polkit",
        name: "Polkit Authentication Agent",
        shortDesc: "Presents graphical password prompts for root authorization (mounting disks, installing software).",
        detailedDesc: "Mandatory plumbing component: without a polkit agent, GUI applications requiring administrative rights fail silently.",
        iconName: "ShieldAlert",
        phaseId: "qol",
        selectionType: "single",
        optional: false,
        packages: [
          {
            id: "hyprpolkitagent",
            name: "hyprpolkitagent (Recommended)",
            packageName: "hyprpolkitagent",
            source: "repo",
            description: "Official Polkit authentication agent built with Qt/QML from the Hyprland project. Clean, minimal, and GPU-accelerated.",
            pros: ["Matches modern rounded aesthetic", "Native Wayland layer-shell dialog", "OmarchyOS default"],
            cons: ["Qt-based"],
            stabilityScore: 9,
            tags: ["wayland", "auth", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            githubUrl: "https://github.com/hyprwm/hyprpolkitagent"
          },
          {
            id: "polkit-gnome",
            name: "polkit-gnome",
            packageName: "polkit-gnome",
            source: "repo",
            description: "Legacy GTK3 Polkit authentication agent. Extremely simple and universal.",
            pros: ["Universal compatibility", "Very lightweight"],
            cons: ["Older GTK3 dialog appearance"],
            stabilityScore: 10,
            tags: ["gtk3", "classic"],
            recommended: false
          },
          {
            id: "polkit-kde-agent",
            name: "polkit-kde-agent",
            packageName: "polkit-kde-agent",
            source: "repo",
            description: "KDE Plasma Polkit agent with modern Breeze theme support.",
            pros: ["Polished Qt interface"],
            cons: ["Pulls several KDE framework libraries"],
            stabilityScore: 9,
            tags: ["kde", "qt"],
            recommended: false
          }
        ]
      },
      {
        id: "portal",
        name: "XDG Desktop Portals",
        shortDesc: "Standardized desktop integration interface for screen sharing, file pickers, and sandboxed apps.",
        detailedDesc: "Critical for Discord / OBS / browser screen sharing and GTK/Qt file dialogs under Wayland.",
        iconName: "Network",
        phaseId: "qol",
        selectionType: "multi",
        optional: false,
        packages: [
          {
            id: "xdg-desktop-portal-hyprland",
            name: "xdg-desktop-portal-hyprland (Recommended for Hyprland)",
            packageName: "xdg-desktop-portal-hyprland",
            source: "repo",
            description: "Custom portal backend for Hyprland providing hardware-accelerated screen sharing via PipeWire and window sharing.",
            pros: ["High-FPS screen casting", "Window picker interface", "Essential for WebRTC / Discord screen sharing"],
            cons: ["Hyprland-specific"],
            stabilityScore: 9,
            tags: ["portal", "wayland", "screen-sharing", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "xdg-desktop-portal-gtk",
            name: "xdg-desktop-portal-gtk (Recommended Companion)",
            packageName: "xdg-desktop-portal-gtk",
            source: "repo",
            description: "Fallback GTK portal for standard file open/save dialogs, app choosers, and notifications.",
            pros: ["Clean file chooser dialogs for Flatpak and native apps", "Essential fallback backend"],
            cons: ["None"],
            stabilityScore: 10,
            tags: ["portal", "fallback", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "xdg-desktop-portal-wlr",
            name: "xdg-desktop-portal-wlr",
            packageName: "xdg-desktop-portal-wlr",
            source: "repo",
            description: "Generic wlroots portal implementation used by Sway and River compositors.",
            pros: ["Standard for Sway/wlroots setups"],
            cons: ["Fewer custom animation/window hooks than hyprland portal"],
            stabilityScore: 9,
            tags: ["wlroots", "sway"],
            recommended: false
          }
        ]
      },
      {
        id: "theming-tools",
        name: "Theming & Appearance Configuration",
        shortDesc: "GUIs to configure GTK themes, Qt styles, cursor sizing, and fonts across all desktop toolkits.",
        detailedDesc: "Ensures uniform dark mode, typography, and icon themes across both GTK and Qt software.",
        iconName: "Palette",
        phaseId: "qol",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "nwg-look",
            name: "nwg-look (Recommended)",
            packageName: "nwg-look",
            source: "repo",
            description: "GTK3/GTK4 settings editor designed specifically for Wayland compositors. Sets GTK themes, icon packs, cursors, and fonts without GNOME dependencies.",
            pros: ["Wayland-native", "Directly writes to xsettingsd and gsettings", "Applies immediately", "OmarchyOS default"],
            cons: ["GTK only (use qt6ct for Qt)"],
            stabilityScore: 9,
            tags: ["gtk", "theming", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            githubUrl: "https://github.com/nwg-piotr/nwg-look"
          },
          {
            id: "qt6ct-kvantum",
            name: "qt6ct + kvantum (Recommended)",
            packageName: "qt6ct",
            source: "repo",
            description: "Qt6 configuration tool paired with Kvantum SVG theme engine to give Qt applications unified dark themes.",
            pros: ["Unifies Qt apps with GTK styling", "Kvantum SVG engine enables custom blur and opacity"],
            cons: ["Requires exporting QT_QPA_PLATFORMTHEME=qt6ct in environment"],
            stabilityScore: 9,
            tags: ["qt6", "kvantum", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          }
        ]
      },
      {
        id: "icons-cursors",
        name: "Icon & Cursor Theme Packs",
        shortDesc: "Curated vector icon bundles and high-DPI cursor themes.",
        detailedDesc: "A polished rice requires consistent vector glyphs in file managers and smooth cursor scaling.",
        iconName: "MousePointer",
        phaseId: "qol",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "papirus-icon-theme",
            name: "Papirus Icon Theme (Recommended)",
            packageName: "papirus-icon-theme",
            source: "repo",
            description: "Vibrant, comprehensive SVG icon theme with thousands of customized application icons.",
            pros: ["Complete coverage of virtually every Linux application", "Clean flat material styling"],
            cons: ["None"],
            stabilityScore: 10,
            tags: ["icons", "svg", "recommended"],
            recommended: true
          },
          {
            id: "bibata-cursor-theme",
            name: "Bibata Cursor Theme (Recommended)",
            packageName: "bibata-cursor-theme-bin",
            source: "aur",
            description: "Modern, rounded cursor pack available in Modern Ice, Modern Classic, and Amber varieties.",
            pros: ["Extremely clean rounded edges", "Perfect scaling on high-DPI monitors", "Community favorite on Unixporn"],
            cons: ["AUR package"],
            stabilityScore: 10,
            tags: ["cursor", "modern", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "yaru-icon-theme",
            name: "Yaru Icon Theme",
            packageName: "yaru-icon-theme",
            source: "repo",
            description: "Ubuntu's signature Yaru icon theme for a sleek, familiar Linux desktop aesthetic.",
            pros: ["Polished corporate finish", "Included in OmarchyOS manifest"],
            cons: ["Ubuntu visual branding"],
            stabilityScore: 9,
            tags: ["icons", "ubuntu"],
            recommended: false,
            isOmarchyDefault: true
          }
        ]
      },
      {
        id: "fonts",
        name: "Fonts, Typography & Nerd Font Glyphs",
        shortDesc: "Monospace coding fonts, universal glyph sets, and icon symbol patches.",
        detailedDesc: "Essential for status bars, terminal prompts (Starship/Powerlevel10k), and coding editors.",
        iconName: "Type",
        phaseId: "qol",
        selectionType: "multi",
        optional: false,
        packages: [
          {
            id: "ttf-jetbrains-mono-nerd",
            name: "JetBrains Mono Nerd Font (Recommended)",
            packageName: "ttf-jetbrains-mono-nerd",
            source: "repo",
            description: "The gold standard coding font, patched with thousands of Nerd Font developer icons, folder glyphs, and status symbols.",
            pros: ["Superb programming ligatures", "Extremely readable at all sizes", "Includes complete Nerd Font symbol set", "OmarchyOS default"],
            cons: ["Large package size"],
            stabilityScore: 10,
            tags: ["fonts", "nerd-fonts", "monospace", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "noto-fonts-bundle",
            name: "Google Noto Fonts + CJK + Emoji (Recommended)",
            packageName: "noto-fonts",
            source: "repo",
            description: "Google's universal typographic system. Includes standard typefaces, full Asian character coverage (CJK), and color emoji support.",
            pros: ["Eliminates missing character squares (tofu)", "Universal foreign typography support", "Color emoji rendering in terminals"],
            cons: ["Multi-gigabyte disk footprint for complete international bundle"],
            stabilityScore: 10,
            tags: ["fonts", "international", "emoji", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "woff2-font-awesome",
            name: "Font Awesome Glyphs",
            packageName: "woff2-font-awesome",
            source: "repo",
            description: "Web and desktop icon typeface used by many Waybar and eww status bar configs.",
            pros: ["Extensive battery, Wi-Fi, and volume symbol glyphs"],
            cons: ["Redundant if using Nerd Fonts"],
            stabilityScore: 10,
            tags: ["fonts", "icons"],
            recommended: false,
            isOmarchyDefault: true
          },
          {
            id: "ttf-fira-code",
            name: "Fira Code",
            packageName: "ttf-fira-code",
            source: "repo",
            description: "Monospaced font with programming ligatures for operators like =>, <=, !=.",
            pros: ["Beautiful coding ligatures"],
            cons: ["Requires separate nerd font patch for icons"],
            stabilityScore: 10,
            tags: ["fonts", "coding"],
            recommended: false
          }
        ]
      }
    ]
  },
  {
    id: "hardware",
    title: "Audio, Hardware & Connectivity",
    description: "PipeWire audio stack, Bluetooth, NetworkManager, screen brightness, and power management.",
    iconName: "Radio",
    categories: [
      {
        id: "audio-stack",
        name: "Audio Server & Control Utilities",
        shortDesc: "Next-gen low-latency multimedia routing engine, volume GUI, and parametric equalizers.",
        detailedDesc: "PipeWire replaces PulseAudio and JACK with professional low-latency routing.",
        iconName: "Headphones",
        phaseId: "hardware",
        selectionType: "multi",
        optional: false,
        packages: [
          {
            id: "pipewire-wireplumber",
            name: "PipeWire + WirePlumber (Recommended Core)",
            packageName: "pipewire",
            source: "repo",
            description: "Modern multimedia daemon with ALSA, PulseAudio, and JACK compatibility layers, managed by WirePlumber policy engine.",
            pros: ["Lowest latency audio routing", "Seamless Bluetooth LDAC/AptX codec support", "Universal Linux standard", "OmarchyOS default"],
            cons: ["None"],
            stabilityScore: 10,
            tags: ["audio", "core", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "pavucontrol",
            name: "Pavucontrol (GTK Volume GUI) (Recommended)",
            packageName: "pavucontrol",
            source: "repo",
            description: "Standard PulseAudio/PipeWire volume control GUI for per-application audio routing and device switching.",
            pros: ["Simple per-app volume sliders", "Quick output device switching", "Rock-solid stability"],
            cons: ["Classic GTK interface"],
            stabilityScore: 10,
            tags: ["audio", "gui", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "pwvucontrol",
            name: "pwvucontrol",
            packageName: "pwvucontrol",
            source: "repo",
            description: "Native PipeWire volume control written in Rust and GTK4 with responsive VU meters.",
            pros: ["Modern GTK4 interface", "Direct PipeWire native API integration"],
            cons: ["Slightly newer project than pavucontrol"],
            stabilityScore: 8,
            tags: ["rust", "gtk4", "pipewire"],
            recommended: false
          },
          {
            id: "easyeffects",
            name: "EasyEffects",
            packageName: "easyeffects",
            source: "repo",
            description: "Advanced audio effects, equalizers, noise reduction, and compressors for PipeWire.",
            pros: ["Studio-grade microphone noise cancellation (RNNoise)", "Bass boost & parametric EQ presets"],
            cons: ["Higher CPU usage when multiple DSP plugins are active"],
            stabilityScore: 9,
            tags: ["dsp", "equalizer"],
            recommended: false
          },
          {
            id: "wiremix",
            name: "wiremix (TUI PipeWire Mixer)",
            packageName: "wiremix-git",
            source: "aur",
            description: "Terminal user interface for PipeWire audio routing and volume levels.",
            pros: ["Keyboard driven mixer inside your terminal", "OmarchyOS default"],
            cons: ["AUR package"],
            stabilityScore: 8,
            tags: ["tui", "audio"],
            recommended: false,
            isOmarchyDefault: true
          }
        ]
      },
      {
        id: "network",
        name: "Network Management",
        shortDesc: "Daemon managing Wi-Fi, Ethernet, VPN tunnels, and system tray applet.",
        detailedDesc: "NetworkManager handles automatic connection switching, captive portals, and Wi-Fi scanning.",
        iconName: "Wifi",
        phaseId: "hardware",
        selectionType: "single",
        optional: false,
        packages: [
          {
            id: "networkmanager",
            name: "NetworkManager + nm-applet (Recommended)",
            packageName: "networkmanager",
            source: "repo",
            description: "The universal network management suite for Linux desktops with tray applet and nmcli command line tool.",
            pros: ["Auto-detection of Wi-Fi & Ethernet", "VPN support (WireGuard/OpenVPN)", "Tray applet for Waybar integration", "OmarchyOS default"],
            cons: ["Slightly heavier than bare iwd/systemd-networkd"],
            stabilityScore: 10,
            tags: ["network", "daemon", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "iwd",
            name: "iwd (Intel Wireless Daemon)",
            packageName: "iwd",
            source: "repo",
            description: "Ultra-fast, lightweight standalone wireless daemon replacing wpa_supplicant.",
            pros: ["Blazing fast Wi-Fi connection times", "Extremely tiny memory footprint"],
            cons: ["Focuses strictly on Wi-Fi; requires separate tool for wired Ethernet/VPN"],
            stabilityScore: 9,
            tags: ["wifi", "minimalist"],
            recommended: false
          }
        ]
      },
      {
        id: "bluetooth",
        name: "Bluetooth Management",
        shortDesc: "Bluetooth stack, headset pairing, and connection applets.",
        detailedDesc: "Provides BlueZ daemon, audio profile switching, and connection GUIs/TUIs.",
        iconName: "Bluetooth",
        phaseId: "hardware",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "blueman",
            name: "bluez + blueman (Recommended)",
            packageName: "blueman",
            source: "repo",
            description: "Full-featured GTK Bluetooth manager and tray applet. Seamless pairing for wireless headphones, keyboards, and mice.",
            pros: ["Quick pairing modal", "Audio profile switcher (A2DP / HFP)", "Tray icon for Waybar", "OmarchyOS default"],
            cons: ["GTK3 interface"],
            stabilityScore: 10,
            tags: ["bluetooth", "gui", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "overskride",
            name: "Overskride",
            packageName: "overskride",
            source: "repo",
            description: "Modern Bluetooth client written in Rust and GTK4/libadwaita.",
            pros: ["Beautiful modern UI", "Clean device information inspector"],
            cons: ["No persistent system tray applet"],
            stabilityScore: 8,
            tags: ["rust", "gtk4"],
            recommended: false
          },
          {
            id: "bluetui",
            name: "bluetui (TUI Bluetooth Manager)",
            packageName: "bluetui-bin",
            source: "aur",
            description: "Ratatui-based interactive terminal client for managing Bluetooth devices.",
            pros: ["Fast keyboard navigation in terminal", "Included in OmarchyOS manifest"],
            cons: ["AUR package"],
            stabilityScore: 9,
            tags: ["tui", "rust"],
            recommended: false,
            isOmarchyDefault: true
          }
        ]
      },
      {
        id: "brightness",
        name: "Backlight & Display Brightness Control",
        shortDesc: "Utilities to adjust internal laptop displays and external monitor brightness.",
        detailedDesc: "Allows smooth keyboard backlight and monitor dimming.",
        iconName: "Sun",
        phaseId: "hardware",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "brightnessctl",
            name: "brightnessctl (Recommended)",
            packageName: "brightnessctl",
            source: "repo",
            description: "Lightweight CLI tool that controls device backlight without requiring root permissions via udev rules.",
            pros: ["Instant response time", "Smooth percentage stepping", "Zero daemon overhead", "OmarchyOS default"],
            cons: ["CLI only (binds to function keys)"],
            stabilityScore: 10,
            tags: ["hardware", "backlight", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "asdcontrol",
            name: "asdcontrol",
            packageName: "asdcontrol-git",
            source: "aur",
            description: "Hardware controller for Apple Studio Display and external DDC/CI monitor brightness on Linux.",
            pros: ["Controls Apple Studio Display hardware brightness directly", "OmarchyOS default"],
            cons: ["Specialized hardware target"],
            stabilityScore: 8,
            tags: ["hardware", "apple"],
            recommended: false,
            isOmarchyDefault: true
          }
        ]
      },
      {
        id: "power",
        name: "Power & Battery Management",
        shortDesc: "CPU frequency scaling, battery thresholds, and thermal power profiles.",
        detailedDesc: "Essential for laptops to optimize battery life and quiet fan acoustics.",
        iconName: "BatteryCharging",
        phaseId: "hardware",
        selectionType: "single",
        optional: true,
        packages: [
          {
            id: "power-profiles-daemon",
            name: "power-profiles-daemon (Recommended)",
            packageName: "power-profiles-daemon",
            source: "repo",
            description: "Modern power state controller providing Power Saver, Balanced, and Performance modes. Native integration with SwayNC and Waybar.",
            pros: ["Standard desktop D-Bus power interface", "Instant switching between quiet battery and high performance"],
            cons: ["Less granular manual tuning than TLP"],
            stabilityScore: 10,
            tags: ["power", "modern", "recommended"],
            recommended: true
          },
          {
            id: "auto-cpufreq",
            name: "auto-cpufreq",
            packageName: "auto-cpufreq",
            source: "aur",
            description: "Automatic CPU speed and power optimizer for Linux laptops based on live system load.",
            pros: ["Intelligently scales governor based on battery vs AC status", "Active development"],
            cons: ["Conflicts with power-profiles-daemon"],
            stabilityScore: 9,
            tags: ["laptop", "cpu"],
            recommended: false
          },
          {
            id: "tlp",
            name: "TLP",
            packageName: "tlp",
            source: "repo",
            description: "Advanced power management daemon for Linux laptops with extensive battery thresholds.",
            pros: ["Dozens of granular kernel and hardware power toggles", "ThinkPad battery charge thresholds"],
            cons: ["Extensive configuration file"],
            stabilityScore: 10,
            tags: ["power", "advanced"],
            recommended: false
          }
        ]
      }
    ]
  },
  {
    id: "apps",
    title: "Daily Apps & Productivity",
    description: "Web browsers, terminals, file managers (GUI and TUI), media viewers, notes, and local file sharing.",
    iconName: "Compass",
    categories: [
      {
        id: "browser",
        name: "Web Browser",
        shortDesc: "Fast, secure web browsing with hardware video acceleration.",
        detailedDesc: "Select your primary daily internet browser.",
        iconName: "Globe",
        phaseId: "apps",
        selectionType: "multi",
        optional: false,
        packages: [
          {
            id: "firefox",
            name: "Firefox (Recommended)",
            packageName: "firefox",
            source: "repo",
            description: "Privacy-respecting open source web browser with native Wayland VA-API video decoding, userChrome.css theming, and container tabs.",
            pros: ["Native Wayland rendering", "Hardware GPU video acceleration", "Highly customizable with CSS ricing", "Strict privacy controls"],
            cons: ["Slightly slower WebGL performance than Chromium in select benchmarks"],
            stabilityScore: 10,
            tags: ["browser", "privacy", "recommended"],
            recommended: true
          },
          {
            id: "chromium",
            name: "Chromium",
            packageName: "chromium",
            source: "repo",
            description: "Open-source foundation of Google Chrome. Ultra-fast Blink engine and broad web compatibility.",
            pros: ["Exceptional JavaScript speed", "Full WebAuthn and PWA support", "Included in OmarchyOS manifest"],
            cons: ["Google-centric ecosystem"],
            stabilityScore: 10,
            tags: ["browser", "blink"],
            recommended: false,
            isOmarchyDefault: true
          },
          {
            id: "zen-browser",
            name: "Zen Browser",
            packageName: "zen-browser-bin",
            source: "aur",
            description: "Modern, beautiful Firefox fork featuring vertical tabs, split views, and clean arc-inspired aesthetic.",
            pros: ["Gorgeous modern vertical tab design", "Built-in workspace management", "Firefox privacy base"],
            cons: ["AUR binary package"],
            stabilityScore: 8,
            tags: ["browser", "modern", "aur"],
            recommended: false
          },
          {
            id: "brave",
            name: "Brave Browser",
            packageName: "brave-bin",
            source: "aur",
            description: "Chromium-based browser with built-in ad blocker and tracking prevention.",
            pros: ["Automatic ad/tracker blocking", "Fast Chromium engine"],
            cons: ["Crypto feature promotions"],
            stabilityScore: 9,
            tags: ["browser", "chromium"],
            recommended: false
          }
        ]
      },
      {
        id: "terminal",
        name: "Terminal Emulator",
        shortDesc: "GPU-accelerated terminal emulators with true color, font ligatures, and image support.",
        detailedDesc: "Where you spend most of your time on Arch Linux.",
        iconName: "Terminal",
        phaseId: "apps",
        selectionType: "multi",
        optional: false,
        packages: [
          {
            id: "kitty",
            name: "Kitty (Recommended)",
            packageName: "kitty",
            source: "repo",
            description: "GPU-accelerated terminal emulator with kittens framework, native image rendering protocol, tabs, and true-color support.",
            pros: ["OpenGL hardware acceleration", "Kitty graphics protocol (renders images in yazi/ranger)", "Rich tabs & splits", "Extensive theme ecosystem"],
            cons: ["Config syntax is unique to Kitty"],
            stabilityScore: 10,
            tags: ["gpu", "terminal", "images", "recommended"],
            recommended: true,
            githubUrl: "https://github.com/kovidgoyal/kitty"
          },
          {
            id: "ghostty",
            name: "Ghostty",
            packageName: "ghostty",
            source: "aur",
            description: "Fast, feature-rich, cross-platform terminal emulator written in Zig with native platform UI and GPU rendering.",
            pros: ["Modern Zig performance", "Exceptional font rendering and ligatures", "Clean configuration syntax", "OmarchyOS default"],
            cons: ["AUR package on Arch"],
            stabilityScore: 9,
            tags: ["zig", "modern", "gpu"],
            recommended: false,
            isOmarchyDefault: true,
            githubUrl: "https://ghostty.org"
          },
          {
            id: "foot",
            name: "Foot",
            packageName: "foot",
            source: "repo",
            description: "Blazing fast, lightweight Wayland-native terminal emulator designed specifically for wlroots compositors.",
            pros: ["Tiny memory footprint", "Server-client daemon mode drops launch time to under 1ms", "Zero GPU dependencies"],
            cons: ["Wayland only"],
            stabilityScore: 10,
            tags: ["wayland", "c", "minimalist"],
            recommended: false
          },
          {
            id: "alacritty",
            name: "Alacritty",
            packageName: "alacritty",
            source: "repo",
            description: "Simplistic GPU-accelerated terminal emulator written in Rust.",
            pros: ["Rock-solid stability", "Fast startup", "Simple YAML/TOML config"],
            cons: ["No built-in tabs or splits (relies on tmux)"],
            stabilityScore: 10,
            tags: ["rust", "gpu"],
            recommended: false
          }
        ]
      },
      {
        id: "file-manager-gui",
        name: "Graphical File Manager (GUI)",
        shortDesc: "Desktop file explorer for browsing drives, network shares, and media files.",
        detailedDesc: "Provides drag-and-drop file operations and thumbnail previews.",
        iconName: "Folder",
        phaseId: "apps",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "dolphin",
            name: "Dolphin (Recommended)",
            packageName: "dolphin",
            source: "repo",
            description: "Feature-packed, fast Qt file manager from KDE with dual-pane browsing, integrated terminal panel, and Git status badges.",
            pros: ["Split view mode (press F3)", "Built-in terminal drawer (press F4)", "Fast file searching", "Rich thumbnail previews"],
            cons: ["Pulls KDE framework libraries"],
            stabilityScore: 10,
            tags: ["qt", "gui", "recommended"],
            recommended: true
          },
          {
            id: "nautilus",
            name: "Nautilus (GNOME Files)",
            packageName: "nautilus",
            source: "repo",
            description: "Clean, distraction-free GTK4 file manager with smooth animations.",
            pros: ["Minimalist UI", "Clean search indexing"],
            cons: ["Fewer power-user split panel features than Dolphin"],
            stabilityScore: 10,
            tags: ["gtk4", "gui"],
            recommended: false
          },
          {
            id: "thunar",
            name: "Thunar",
            packageName: "thunar",
            source: "repo",
            description: "Lightweight GTK3 file manager from Xfce with bulk renamer and custom actions.",
            pros: ["Very fast startup", "Custom user action scripts", "Minimal dependencies"],
            cons: ["Older GTK3 interface"],
            stabilityScore: 10,
            tags: ["gtk3", "lightweight"],
            recommended: false
          }
        ]
      },
      {
        id: "file-manager-tui",
        name: "Terminal File Manager (TUI)",
        shortDesc: "Keyboard-driven file manager inside your terminal with instant image previews.",
        detailedDesc: "Navigate directories at the speed of thought without touching your mouse.",
        iconName: "FolderTree",
        phaseId: "apps",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "yazi",
            name: "Yazi (Recommended)",
            packageName: "yazi",
            source: "repo",
            description: "Blazingly fast terminal file manager written in Rust with asynchronous I/O and direct GPU image preview rendering.",
            pros: ["Async Rust architecture (never blocks UI)", "Direct Kitty/Sixel graphics protocol image previews", "Intuitive Vim keybindings", "OmarchyOS default"],
            cons: ["Requires terminal emulator supporting image protocols for graphics previews"],
            stabilityScore: 9,
            tags: ["rust", "async", "tui", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            githubUrl: "https://github.com/sxyazi/yazi"
          },
          {
            id: "superfile",
            name: "Superfile",
            packageName: "superfile-bin",
            source: "aur",
            description: "Modern, gorgeous terminal file manager with rich file icons and multi-panel navigation.",
            pros: ["Clean modern styling", "Multi-panel directory views"],
            cons: ["AUR package"],
            stabilityScore: 8,
            tags: ["tui", "go"],
            recommended: false
          },
          {
            id: "lf",
            name: "lf (List Files)",
            packageName: "lf",
            source: "repo",
            description: "Lightweight terminal file manager inspired by ranger, written in Go with single-binary efficiency.",
            pros: ["Instant startup", "Server/client architecture for clipboard sharing"],
            cons: ["Requires shell scripting for preview generators"],
            stabilityScore: 10,
            tags: ["tui", "go"],
            recommended: false
          }
        ]
      },
      {
        id: "media-viewer",
        name: "Media, Video & Image Viewers",
        shortDesc: "High-performance video playback and instant Wayland image viewers.",
        detailedDesc: "Hardware accelerated video rendering and quick-look image inspection.",
        iconName: "Film",
        phaseId: "apps",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "mpv",
            name: "mpv (Recommended Video Player)",
            packageName: "mpv",
            source: "repo",
            description: "Command-line/GUI video player with GPU video decoding, high-quality video scaling algorithms, and Lua scripting.",
            pros: ["Best video scaling and color quality in the industry", "Hardware VA-API acceleration", "Minimalist on-screen controller", "OmarchyOS default"],
            cons: ["Keybinding-centric rather than menu-heavy"],
            stabilityScore: 10,
            tags: ["video", "hardware", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "imv",
            name: "imv (Recommended Image Viewer)",
            packageName: "imv",
            source: "repo",
            description: "Command-line image viewer for Wayland and X11. Opens images in 10 milliseconds with smooth zooming and panning.",
            pros: ["Wayland-native", "Near instantaneous startup", "Vim-like navigation", "OmarchyOS default"],
            cons: ["Minimalist"],
            stabilityScore: 10,
            tags: ["images", "wayland", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "loupe",
            name: "Loupe (GNOME Image Viewer)",
            packageName: "loupe",
            source: "repo",
            description: "Modern GTK4/libadwaita image viewer with smooth touchpad zoom gestures.",
            pros: ["Modern UI", "Fluid pinch-to-zoom gestures"],
            cons: ["Heavier footprint than imv"],
            stabilityScore: 9,
            tags: ["gtk4", "images"],
            recommended: false
          }
        ]
      },
      {
        id: "documents-notes",
        name: "Document & Markdown Editors",
        shortDesc: "Knowledge bases, personal wikis, and distraction-free document writers.",
        detailedDesc: "Manage project notes, second brains, and technical documentation.",
        iconName: "FileText",
        phaseId: "apps",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "obsidian",
            name: "Obsidian (Recommended)",
            packageName: "obsidian",
            source: "repo",
            description: "Powerful, extensible knowledge base and markdown editor on top of a local folder of plain text files.",
            pros: ["Local plain-text markdown storage", "Rich plugin & theme ecosystem", "Interactive graph visualization", "OmarchyOS default"],
            cons: ["Electron application"],
            stabilityScore: 10,
            tags: ["markdown", "notes", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "typora",
            name: "Typora",
            packageName: "typora",
            source: "aur",
            description: "Seamless live-preview markdown editor providing a clean, distraction-free writing experience.",
            pros: ["True seamless live preview", "Included in OmarchyOS manifest"],
            cons: ["Commercial license"],
            stabilityScore: 9,
            tags: ["markdown", "editor"],
            recommended: false,
            isOmarchyDefault: true
          },
          {
            id: "xournalpp",
            name: "Xournal++",
            packageName: "xournalpp",
            source: "repo",
            description: "Handwriting note-taking and PDF annotation software with stylus and drawing tablet support.",
            pros: ["PDF markup and signing", "Drawing tablet pressure curves", "OmarchyOS default"],
            cons: ["Specialized usecase"],
            stabilityScore: 9,
            tags: ["pdf", "notes"],
            recommended: false,
            isOmarchyDefault: true
          }
        ]
      },
      {
        id: "file-transfer",
        name: "Local Network File Transfer & Sharing",
        shortDesc: "Instant, encrypted local file sharing between Linux, Android, iOS, and macOS.",
        detailedDesc: "AirDrop alternative for local Wi-Fi networks.",
        iconName: "Share2",
        phaseId: "apps",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "localsend",
            name: "LocalSend (Recommended)",
            packageName: "localsend-bin",
            source: "aur",
            description: "Open source cross-platform file transfer tool. Send files, folders, and text securely between devices on the same local network with zero internet connection required.",
            pros: ["End-to-end encrypted local Wi-Fi sharing", "Zero cloud servers required", "Native clients on Android, iOS, Mac, and Windows", "OmarchyOS default"],
            cons: ["AUR package"],
            stabilityScore: 10,
            tags: ["sharing", "network", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            githubUrl: "https://localsend.org"
          }
        ]
      }
    ]
  },
  {
    id: "developer",
    title: "Developer Toolchains & CLI Ergonomics",
    description: "Modern Rust/Go coreutils replacements, Git interfaces, Docker container managers, and polyglot runtime toolchains.",
    iconName: "Code",
    categories: [
      {
        id: "cli-modern",
        name: "Modern CLI Coreutils (Rust & Go Ergonomics)",
        shortDesc: "Blazingly fast replacements for cat, ls, grep, find, cd, and du.",
        detailedDesc: "Essential CLI upgrade: replaces 1970s Unix coreutils with high-speed, syntax-highlighted modern alternatives.",
        iconName: "Sparkle",
        phaseId: "developer",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "bat",
            name: "bat (Syntax-highlighted cat) (Recommended)",
            packageName: "bat",
            source: "repo",
            description: "Cat clone with syntax highlighting for hundreds of languages, Git modifications, and automatic paging.",
            pros: ["Automatic language syntax highlighting", "Shows git diff gutters", "OmarchyOS default"],
            cons: ["None"],
            stabilityScore: 10,
            tags: ["cli", "rust", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "eza",
            name: "eza (Modern ls with Git status) (Recommended)",
            packageName: "eza",
            source: "repo",
            description: "Modern replacement for ls with file icons, recursive tree views, and live Git repository status indicators.",
            pros: ["Visual file icons", "Tree view mode", "Integrated Git status flags", "OmarchyOS default"],
            cons: ["None"],
            stabilityScore: 10,
            tags: ["cli", "rust", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "ripgrep",
            name: "ripgrep (Fast recursive grep) (Recommended)",
            packageName: "ripgrep",
            source: "repo",
            description: "Ultra-fast line-oriented search tool that respects .gitignore rules by default.",
            pros: ["Fastest code search tool available", "Respects gitignore", "OmarchyOS default"],
            cons: ["None"],
            stabilityScore: 10,
            tags: ["cli", "rust", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "fd",
            name: "fd (Fast user-friendly find) (Recommended)",
            packageName: "fd",
            source: "repo",
            description: "Simple, fast and user-friendly alternative to find with colorized terminal output.",
            pros: ["Intuitive syntax (fd pattern)", "Parallel directory traversal", "OmarchyOS default"],
            cons: ["None"],
            stabilityScore: 10,
            tags: ["cli", "rust", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "zoxide",
            name: "zoxide (Smarter cd command) (Recommended)",
            packageName: "zoxide",
            source: "repo",
            description: "Smarter cd command that remembers your most frequently accessed directories and jumps instantly with frecency scoring.",
            pros: ["Jump to nested paths in 2 keystrokes (`z myproj`)", "Universal shell support (bash/zsh/fish)", "OmarchyOS default"],
            cons: ["Requires adding 1 eval line to shell rc"],
            stabilityScore: 10,
            tags: ["cli", "rust", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "fzf",
            name: "fzf (General purpose fuzzy finder) (Recommended)",
            packageName: "fzf",
            source: "repo",
            description: "Interactive command-line fuzzy finder for history, file paths, and shell completions.",
            pros: ["Fuzzy search command history (Ctrl+R)", "Interactive file search (Ctrl+T)", "OmarchyOS default"],
            cons: ["None"],
            stabilityScore: 10,
            tags: ["cli", "go", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "jq",
            name: "jq (JSON query processor) (Recommended)",
            packageName: "jq",
            source: "repo",
            description: "Command-line JSON processor and filter engine.",
            pros: ["Standard tool for shell scripting with API payloads", "OmarchyOS default"],
            cons: ["None"],
            stabilityScore: 10,
            tags: ["cli", "json", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "dust",
            name: "dust (Graphical disk usage du)",
            packageName: "dust",
            source: "repo",
            description: "Visual du clone that renders bar graphs showing where your disk storage is going.",
            pros: ["Instant visual intuition for disk hogs", "OmarchyOS default"],
            cons: ["None"],
            stabilityScore: 10,
            tags: ["cli", "rust"],
            recommended: false,
            isOmarchyDefault: true
          }
        ]
      },
      {
        id: "git-tools",
        name: "Git & Version Control Interfaces",
        shortDesc: "Terminal and graphical consoles for managing branches, staging, and pull requests.",
        detailedDesc: "Interactive staging, interactive rebase, and GitHub CLI workflow.",
        iconName: "GitBranch",
        phaseId: "developer",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "lazygit",
            name: "lazygit (Recommended TUI)",
            packageName: "lazygit",
            source: "repo",
            description: "High-performance interactive terminal UI for Git commands. Line-by-line staging, visual rebase, stash management, and conflict resolution.",
            pros: ["Fastest git staging interface available", "Keyboard driven interactive rebase", "Visual branch hierarchy", "OmarchyOS default"],
            cons: ["Keyboard-centric"],
            stabilityScore: 10,
            tags: ["git", "tui", "go", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            githubUrl: "https://github.com/jesseduffield/lazygit"
          },
          {
            id: "github-cli",
            name: "GitHub CLI (`gh`) (Recommended)",
            packageName: "github-cli",
            source: "repo",
            description: "Official command line tool for GitHub to manage pull requests, issues, releases, and repository cloning.",
            pros: ["Create and checkout PRs from terminal", "Token authentication manager", "OmarchyOS default"],
            cons: ["GitHub specific"],
            stabilityScore: 10,
            tags: ["git", "cli", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "gitui",
            name: "GitUI",
            packageName: "gitui",
            source: "repo",
            description: "Blazingly fast Git terminal UI written in Rust with microsecond responsiveness even in huge repositories.",
            pros: ["Extreme speed and low CPU usage", "Rust performance"],
            cons: ["Slightly fewer advanced interactive rebase features than lazygit"],
            stabilityScore: 9,
            tags: ["git", "rust", "tui"],
            recommended: false
          }
        ]
      },
      {
        id: "containers",
        name: "Containers & Virtualization",
        shortDesc: "Docker / Podman container engines and interactive management dashboards.",
        detailedDesc: "Run development databases, local web servers, and isolated environments.",
        iconName: "Boxes",
        phaseId: "developer",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "docker-stack",
            name: "Docker + Docker Compose (Recommended Engine)",
            packageName: "docker",
            source: "repo",
            description: "Industry-standard containerization platform with multi-container Docker Compose orchestration.",
            pros: ["Universal developer ecosystem compatibility", "Standard images on Docker Hub", "OmarchyOS default"],
            cons: ["Requires background systemd daemon"],
            stabilityScore: 10,
            tags: ["containers", "docker", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "lazydocker",
            name: "lazydocker (Recommended TUI)",
            packageName: "lazydocker",
            source: "repo",
            description: "Interactive terminal UI for Docker containers, images, volumes, and live streaming logs.",
            pros: ["View real-time CPU/RAM usage per container", "Stream logs and attach shells in 1 keystroke", "OmarchyOS default"],
            cons: ["None"],
            stabilityScore: 10,
            tags: ["docker", "tui", "go", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            githubUrl: "https://github.com/jesseduffield/lazydocker"
          },
          {
            id: "podman",
            name: "Podman + Podman Desktop",
            packageName: "podman",
            source: "repo",
            description: "Daemonless, rootless container engine with full Docker command line compatibility.",
            pros: ["Rootless security model", "No background daemon running when idle"],
            cons: ["Occasional differences in Docker socket binding for third-party dev tools"],
            stabilityScore: 9,
            tags: ["containers", "rootless"],
            recommended: false
          },
          {
            id: "oxker",
            name: "oxker (Rust Docker TUI)",
            packageName: "oxker-bin",
            source: "aur",
            description: "Ultra-fast, lightweight TUI for monitoring Docker containers written in Rust.",
            pros: ["Tiny binary size", "Instant startup"],
            cons: ["Fewer container control options than lazydocker"],
            stabilityScore: 8,
            tags: ["rust", "tui"],
            recommended: false
          }
        ]
      },
      {
        id: "dev-runtimes",
        name: "Polyglot Runtimes & Version Managers",
        shortDesc: "Manage multiple versions of Node, Python, Rust, and Go without version conflicts.",
        detailedDesc: "Fast environment manager that replaces nvm, pyenv, rbenv, and sdkman with one unified tool.",
        iconName: "Wrench",
        phaseId: "developer",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "mise",
            name: "mise (Recommended Polyglot Tool Manager)",
            packageName: "mise",
            source: "repo",
            description: "Front-end to your dev environment. Polyglot tool version manager (Node, Python, Go, Rust, Ruby) written in Rust. Fast, clean, and modern.",
            pros: ["Replaces nvm, pyenv, rustup, and goenv with 1 high-speed binary", "Shims-less environment activation", "OmarchyOS default"],
            cons: ["Newer project than asdf"],
            stabilityScore: 9,
            tags: ["runtimes", "rust", "recommended"],
            recommended: true,
            isOmarchyDefault: true,
            githubUrl: "https://mise.jdx.dev"
          },
          {
            id: "rust-toolchain",
            name: "Rust & Cargo Toolchain",
            packageName: "rust",
            source: "repo",
            description: "Official Rust programming language compiler and Cargo package manager.",
            pros: ["Essential for compiling Arch AUR packages from source", "Memory safety and high performance"],
            cons: ["Large compiler download"],
            stabilityScore: 10,
            tags: ["rust", "compiler"],
            recommended: false
          }
        ]
      }
    ]
  },
  {
    id: "system",
    title: "System Administration, Disks & Security",
    description: "Disk partition utilities, ISO flashers, firewall interfaces, and input method editors (IME).",
    iconName: "HardDrive",
    categories: [
      {
        id: "disk-tools",
        name: "Disk, Partition & Filesystem Tools",
        shortDesc: "Partition resizing, SMART drive health diagnostic, and multi-ISO bootable flash utilities.",
        detailedDesc: "Manage physical NVMe/SSD drives, USB drives, and format filesystems.",
        iconName: "HardDrive",
        phaseId: "system",
        selectionType: "multi",
        optional: true,
        packages: [
          {
            id: "gnome-disk-utility",
            name: "GNOME Disks (Recommended GUI)",
            packageName: "gnome-disk-utility",
            source: "repo",
            description: "Clean, reliable disk management utility for formatting drives, inspecting SMART health, creating disk images, and benchmarking.",
            pros: ["Clear graphical drive overview", "Automatic mounting configuration", "SMART health diagnostic", "OmarchyOS default"],
            cons: ["Pulls GNOME dependencies"],
            stabilityScore: 10,
            tags: ["gui", "disk", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "ncdu",
            name: "ncdu (Recommended TUI Disk Usage)",
            packageName: "ncdu",
            source: "repo",
            description: "Fast NCurses disk usage analyzer for finding large files and folders in your terminal.",
            pros: ["Fast interactive folder navigation", "Instant deletion of unwanted temp files", "OmarchyOS default"],
            cons: ["Single-threaded scanning"],
            stabilityScore: 10,
            tags: ["tui", "disk", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "gparted",
            name: "GParted",
            packageName: "gparted",
            source: "repo",
            description: "Dedicated graphical partition editor for creating, deleting, and resizing partitions (ext4, btrfs, NTFS, FAT).",
            pros: ["Advanced partition resizing and moving", "Universal filesystem support"],
            cons: ["Requires root privileges to launch"],
            stabilityScore: 10,
            tags: ["gui", "partitioning"],
            recommended: false
          },
          {
            id: "ventoy",
            name: "Ventoy (Multi-ISO USB Creator)",
            packageName: "ventoy-bin",
            source: "aur",
            description: "Tool to create bootable USB drives where you simply copy ISO files directly to the stick without reformatting.",
            pros: ["Boot dozens of different Linux ISOs from one USB flash drive", "No formatting needed to add new ISOs"],
            cons: ["AUR package"],
            stabilityScore: 9,
            tags: ["usb", "iso", "aur"],
            recommended: false
          }
        ]
      },
      {
        id: "firewall",
        name: "Firewall & Security Interface",
        shortDesc: "Packet filtering rules and application network firewalls.",
        detailedDesc: "Protect your local ports and monitor incoming/outgoing connections.",
        iconName: "Shield",
        phaseId: "system",
        selectionType: "single",
        optional: true,
        packages: [
          {
            id: "ufw-gufw",
            name: "UFW + Gufw (Recommended)",
            packageName: "ufw",
            source: "repo",
            description: "Uncomplicated Firewall with easy command line syntax and graphical GTK management frontend.",
            pros: ["Simple default incoming-deny policy", "Trivial port opening (`ufw allow 8080`)", "OmarchyOS default"],
            cons: ["Basic interface"],
            stabilityScore: 10,
            tags: ["security", "firewall", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "firewalld",
            name: "firewalld",
            packageName: "firewalld",
            source: "repo",
            description: "Dynamic managed firewall with network zones support.",
            pros: ["Network zones (Home, Work, Public)", "Rich rule definitions"],
            cons: ["More complex configuration than UFW"],
            stabilityScore: 9,
            tags: ["firewall", "dynamic"],
            recommended: false
          },
          {
            id: "opensnitch",
            name: "Opensnitch (Application Firewall)",
            packageName: "opensnitch",
            source: "aur",
            description: "Interactive application firewall (Little Snitch clone) that prompts whenever a program attempts an outbound network connection.",
            pros: ["Notifies you in real-time when apps phone home", "Rule creation per executable"],
            cons: ["Can produce many notification prompts initially"],
            stabilityScore: 8,
            tags: ["security", "interactive", "aur"],
            recommended: false
          }
        ]
      },
      {
        id: "ime",
        name: "Input Method Editors (IME) & Asian Typography",
        shortDesc: "Support for typing Japanese (Mozc), Chinese (Pinyin), Korean (Hangul), and non-Latin scripts.",
        detailedDesc: "Essential for bilingual and CJK users to switch between input character sets.",
        iconName: "Languages",
        phaseId: "system",
        selectionType: "single",
        optional: true,
        packages: [
          {
            id: "fcitx5",
            name: "fcitx5 + fcitx5-config-qt (Recommended)",
            packageName: "fcitx5",
            source: "repo",
            description: "Next-generation lightweight input method framework with native Wayland protocol support and Qt config GUI.",
            pros: ["Native Wayland support", "Modern modular architecture", "Extensive CJK engine add-ons (Mozc, Hangul, Rime)", "OmarchyOS default"],
            cons: ["Requires environment variables in pam_environment or profile"],
            stabilityScore: 9,
            tags: ["ime", "cjk", "recommended"],
            recommended: true,
            isOmarchyDefault: true
          },
          {
            id: "ibus",
            name: "IBus",
            packageName: "ibus",
            source: "repo",
            description: "Intelligent Input Bus framework commonly used in GNOME environments.",
            pros: ["Default integration in GNOME desktop"],
            cons: ["Heavier footprint than Fcitx5"],
            stabilityScore: 9,
            tags: ["ime", "gnome"],
            recommended: false
          }
        ]
      }
    ]
  }
];

// Flat array of all categories for quick lookup and linear wizard navigation
export const ALL_CATEGORIES = CATALOG_PHASES.flatMap((p) => p.categories);

// Map of category ID to Category
export const CATEGORY_MAP = new Map(ALL_CATEGORIES.map((c) => [c.id, c]));

// Pre-built curated defaults
export const OMARCHY_PRESET_IDS: Record<string, string[]> = {};
export const RECOMMENDED_PRESET_IDS: Record<string, string[]> = {};

ALL_CATEGORIES.forEach((category) => {
  const recommendedPks = category.packages.filter((p) => p.recommended).map((p) => p.id);
  const omarchyPks = category.packages.filter((p) => p.isOmarchyDefault).map((p) => p.id);

  if (recommendedPks.length > 0) {
    RECOMMENDED_PRESET_IDS[category.id] = category.selectionType === "single" ? [recommendedPks[0]] : recommendedPks;
  }
  if (omarchyPks.length > 0) {
    OMARCHY_PRESET_IDS[category.id] = category.selectionType === "single" ? [omarchyPks[0]] : omarchyPks;
  }
});
