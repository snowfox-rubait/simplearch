# SimpleArch

> Turns a bare Arch Linux install into a complete, working daily-driver OS (dev work, gaming, daily use, and ricing) with complete freedom of choice across every layer.

SimpleArch is a dual-layer platform for Arch Linux providing:
1. **Interactive Pre-Install Guide:** Step-by-step visual guidance through official `archinstall` (prescribing the **Minimal** profile for clean desktop ownership).
2. **Post-Install Web Selector & Script Generator:** An à la carte catalog across 35+ categories generating a single, safe post-install shell script that automates GPU driver setup, bootstraps an AUR helper, installs packages, pulls modular baseline dotfiles, and displays a first-boot keybinding cheat-sheet.

---

## Key Features

- **Four Operational Modes:**
  - **Mode 1: Desktop Post-Install:** Enhancements layered on top of an existing desktop install.
  - **Mode 2: Minimal Base (Recommended):** Pure, clean slate with zero package collisions.
  - **Mode 3: Replace Existing Profile:** Swaps conflicting display managers and desktops.
  - **Mode 4: Ancient Hardware Mode:** Specialized for legacy dual-core CPUs, non-Vulkan iGPUs, and $\le$4GB RAM (pure X11, `lz4` zram, no Plymouth).
- **GPU Driver Resolution:** Because `archinstall` Minimal includes no display drivers, SimpleArch detects and installs the complete graphics stack for Intel, AMD, NVIDIA (DKMS or Open), or Virtual Machines.
- **Safe, Non-Destructive Dotfiles:** Baseline configs pulled from Haw's modular GitHub repo with automatic `.bak1`, `.bak2` backups.
- **Headless TTY Delivery:** Client-side script generation with instant copy-paste here-doc or downloadable `.sh` for bare Arch consoles without a web browser.
- **Decentralized Contributor Workflow:** Community members can submit new packages simply by downloading [`package-template.zip`](package-template.zip), filling [`metadata.json`](package-template/metadata.json), adding before/after screenshots to `media/`, and submitting via GitHub Issue or PR.

---

## Repository Structure

```text
simplearch/
├── AGENTS.md                          # Master AI agent briefing & architectural rules
├── docs/
│   ├── SIMPLEARC_FINDINGS.md          # Comprehensive technical findings, decisions & conflict resolution
│   ├── Arch_Linux_Post_Install_Master_Handbook.md # Deep post-install handbook
│   ├── archinstall_guide_for_simplearch_website.md # Pre-install guide walkthrough text
│   ├── simplearch_v6.md               # Original v6 architecture spec
│   └── simplearch_package_research.md # 35+ category package research
├── guides/
│   └── simplearch-guide/              # Layer 1: Standalone Pure Dark Mode Pre-Install Guide Site
│       ├── index.html                 # 10-step guide with 78 terminal screenshots & contribute banner
│       ├── styles.css                 # Pure dark mode styling (zero AI-slop)
│       └── app.js                     # Step navigation & keyboard shortcuts (j/k)
├── package-template/                  # Contributor package template
│   ├── metadata.json                  # Schema for new package contributions
│   ├── README.md                      # Contributor guide
│   └── media/                         # Before/after ricing screenshots
├── package-template.zip               # Pre-packaged contributor download
└── src/                               # Layer 2: Next.js Interactive Selector & Script Engine
    ├── types/catalog.ts               # Manifest, package, and media TypeScript schemas
    ├── data/catalog.ts                # 35+ category database (modes, drivers, packages)
    ├── context/WizardContext.tsx      # State management and presets
    ├── lib/scriptGenerator.ts         # POSIX shell script generator engine
    └── components/wizard/             # UI components, cards, modal, and script preview
```

---

## Documentation Links

- [AI Agent Master Briefing](AGENTS.md)
- [Comprehensive Findings & Technical Decisions](docs/SIMPLEARC_FINDINGS.md)
- [Post-Install Master Handbook](docs/Arch_Linux_Post_Install_Master_Handbook.md)
- [Pre-Install Guide Walkthrough Text](docs/archinstall_guide_for_simplearch_website.md)
- [Contributor Submission Template](package-template/README.md)
- [SimpleArch Specification v6](docs/simplearch_v6.md)

---

## Development

```bash
# Install dependencies
npm install

# Run the local development server (Next.js Selector)
npm run dev

# Build for production
npm run build
```

To preview the standalone Pre-Install Guide site, open `guides/simplearch-guide/index.html` in any web browser.
