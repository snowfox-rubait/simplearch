# SimpleArch — Master AI Agent Briefing & Project Context

> **Attention Incoming AI Agents:**  
> This file is the primary onboarding briefing for SimpleArch. Read this thoroughly before analyzing, modifying, or extending any part of this codebase. All architectural decisions, user design constraints, and technical trade-offs are documented here and in [`docs/SIMPLEARC_FINDINGS.md`](docs/SIMPLEARC_FINDINGS.md).

---

## 1. Project Mission & Dual-Layer Architecture

**SimpleArch** is a dual-layer platform for Arch Linux designed around this core axiom:
> *"Skip the weeks of research into what tools exist and what is good, without skipping the configuration step (which ricers actually enjoy)."*

Unlike monolithic, opinionated distros (e.g. Omarchy) that lock users into a single predefined desktop, SimpleArch provides **the entire vetted palette of Arch desktop components** while guaranteeing that whatever combination the user picks results in a booting, functional workstation.

### The Two Complementary Frontends:
1. **Layer 1: Pre-Install Archinstall Guide (`guides/simplearch-guide/`)**
   - A standalone, pure dark-mode HTML/CSS/JS visual walkthrough guiding users through official `archinstall` (10 sequential steps with 78 categorized terminal screenshots).
   - Prescribes the **`Minimal`** archinstall profile (or legacy hardware options) so the user boots into a pristine, unbloated Arch baseline.
2. **Layer 2: Post-Install Web Selector & Script Generator (`src/` Next.js App)**
   - An interactive web catalog spanning 35+ categories (compositors, bars, launchers, terminals, audio, etc.).
   - Generates a standalone, safe POSIX bash script (`simplearch-install.sh`) executed on the freshly installed Arch machine to deploy GPU drivers, bootstrap AUR helpers, install packages, and pull baseline dotfiles.

---

## 2. Strict Design Axioms & User Constraints

Any agent modifying the UI or user-facing copy MUST strictly adhere to these rules:

1. **Strict Dark Mode Only:**
   - **NO light mode.** Do not add light mode toggles, themes, or light backgrounds. The user explicitly rejected light mode.
   - Aesthetic is high-contrast, technical, utilitarian, and clean (inspired by Linear, Stripe, and ArchWiki).
2. **Zero "AI Slop":**
   - No flashy neon gradients, marketing buzzwords, generic hero copy, or bubbly corporate illustrations.
   - Keep interface elements crisp, keyboard-accessible, and informative.
3. **Static GitHub Hosting (Zero Backend):**
   - The entire website must run client-side on GitHub Pages.
   - Shell script generation happens 100% in the user's browser. No proprietary backend servers, serverless functions, or databases.

---

## 3. The 4 Operational Installation Modes

The selector and script generator support four distinct operational modes:

| Mode | Baseline Profile | Target Hardware | Description | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Mode 1** | `Desktop` (archinstall) | Modern / Standard | User already ran archinstall with a desktop (GNOME/KDE/Hyprland). Script skips display drivers and only installs ricing tools, apps, and dev utilities. | Supported |
| **Mode 2** | **`Minimal`** (archinstall) | Modern / Standard | Pure, clean canvas. SimpleArch controls GPU drivers, compositor, modular shell daemons, and baseline dotfiles with zero package collisions. | **⭐ Recommended Default** |
| **Mode 3** | Any previous profile | Modern / Standard | Replaces an existing desktop profile. Deactivates conflicting display managers and deploys the SimpleArch stack. | ⚠️ Not Recommended (risk of leftover orphan configs) |
| **Mode 4** | **`Minimal`** (archinstall) | Legacy / Ancient (Core2Duo, non-Vulkan iGPU, $\le$4GB RAM) | Enforces pure X11 protocol, lightweight WMs/DEs (i3/bspwm/XFCE/LXQt), `lz4` zram swap compression, disables Plymouth, and avoids GPU compositing. | **Specialized (Legacy Savior)** |

---

## 4. Hardware GPU Driver Matrix (Archinstall Minimal Profile)

Because Mode 2 and Mode 4 prescribe `archinstall`'s **Minimal** profile, the base system has **zero display drivers**. The SimpleArch generator explicitly manages GPU driver installation:

- **Intel:** `mesa`, `vulkan-intel`, `intel-media-driver`
- **AMD:** `mesa`, `vulkan-radeon`, `libva-mesa-driver`
- **NVIDIA Proprietary (DKMS):** `nvidia-dkms`, `nvidia-utils`, `nvidia-settings`, `linux-headers`, plus Wayland environment variables (`LIBVA_DRIVER_NAME=nvidia`, `GBM_BACKEND=nvidia-drm`, `__GLX_VENDOR_LIBRARY_NAME=nvidia`, `NVD_BACKEND=direct`).
- **NVIDIA Open:** `nvidia-open-dkms`, `nvidia-utils`, `linux-headers` (for Turing+ / RTX series).
- **Virtual Machine:** `mesa`, `xf86-video-vmware`, `spice-vdagent`, `qemu-guest-agent`.
- **Generic / Fallback:** `mesa` (LLVMpipe software rasterizer).

---

## 5. Critical Linux Engineering Decisions & Resolved Conflicts

When making changes to scripts, guides, or data schemas, keep these resolved decisions in mind:

1. **Unified Kernel Images (UKI) MUST Remain Disabled:**
   - *Conflict:* Early notes suggested UKI.
   - *Resolution:* UKI bundles the kernel, cmdline, and initramfs into a static EFI binary. This completely breaks `limine-snapper-sync` dynamic boot entries (which inject `rootflags=subvol=<snapshot>` into the kernel cmdline for snapshot rollbacks). UKI must stay **disabled**.
2. **Archinstall Profile MUST be `Minimal` for Standard Setups:**
   - Selecting `Desktop` pre-installs bloat, unwanted display managers, and conflicting audio/network daemons. `Minimal` ensures SimpleArch has a clean canvas.
3. **XWayland is Bundled Under Wayland:**
   - XWayland is not treated as a separate top-level display protocol. Users selecting Wayland automatically receive XWayland compatibility bridges.
4. **AUR Helper Bootstrapping Timing:**
   - In [`src/lib/scriptGenerator.ts`](src/lib/scriptGenerator.ts), the script must bootstrap `paru-bin` or `yay-bin` via `makepkg -si` in `/tmp` *before* attempting to install any downstream AUR packages.
5. **Centralized Dotfiles & Non-Destructive Backup (`.bak1`, `.bak2`):**
   - Modular baseline configs are fetched from Haw's central GitHub dotfiles repository.
   - Any overwritten config in `~/.config/` is moved to a timestamped backup directory (`~/.config/simplearch_backups/run_<timestamp>`), never destroyed.
6. **Headless Script Delivery (Phone/PC $\rightarrow$ Bare Arch TTY):**
   - Fresh Archinstall leaves the user with only a TTY (no browser installed).
   - SimpleArch provides 3 delivery methods:
     1. Direct here-doc TTY snippet (`cat << 'EOF' > install.sh ... bash install.sh`).
     2. Downloadable `simplearch-install.sh` for USB transfer or SSH.
     3. Ephemeral zero-account paste option (`curl -sL <url> | bash`).

---

## 6. Contributor Package Submission System

To prevent maintainer bottleneck, SimpleArch features a decentralized ZIP contribution workflow:
- **Template Location:** [`package-template/`](package-template/) and downloadable [`package-template.zip`](package-template.zip).
- **Schema:** Standardized [`metadata.json`](package-template/metadata.json) defining tags, stability score, hardware requirements, `pros`, `cons`, and media showcase.
- **Visual Ricing Showcase:** Every package supports:
  - `media/vanilla.png`: Default out-of-the-box appearance.
  - `media/riced-1.png`: Customized ricing screenshot.
  - `media/demo.gif`: Workflow / animation demo clip.
- **Workflow:** Contributor unzips template, fills `metadata.json`, drops screenshots into `media/`, adds optional config in `config/`, zips the folder, and submits a PR or GitHub Issue.

---

## 7. Key Codebase Locations

```text
simplearch/
├── AGENTS.md                          # This briefing document (keep updated!)
├── CLAUDE.md                          # Quick pointer to AGENTS.md & docs
├── README.md                          # Public repository overview
├── package-template/                  # Contributor package blueprint
│   ├── metadata.json                  # Schema & sample values
│   ├── README.md                      # Contributor guide
│   ├── media/                         # Before/after screenshots
│   └── config/                        # Optional baseline config
├── package-template.zip               # Bundled contributor template
├── simplearch_guide_media.zip         # 78 categorized screenshots for guide
├── docs/
│   ├── SIMPLEARC_FINDINGS.md          # Master context, history, & technical findings
│   ├── archinstall_guide_for_simplearch_website.md # 10-step pre-install text
│   ├── Arch_Linux_Post_Install_Master_Handbook.md  # Deep technical post-install guide
│   ├── simplearch_v6.md               # Original v6 architecture spec
│   └── simplearch_package_research.md # Comprehensive package research
├── guides/
│   └── simplearch-guide/              # Layer 1: Standalone HTML/CSS/JS Pre-Install Guide
│       ├── index.html                 # 10 steps, image lightbox, contribute banner
│       ├── styles.css                 # Pure dark mode styling
│       ├── app.js                     # Step navigation & keyboard shortcuts (j/k)
│       └── media/                     # Categorized screenshots (folders 01 to 10)
└── src/                               # Layer 2: Next.js Interactive Selector
    ├── types/catalog.ts               # TypeScript schemas (Manifest, PackageItem, Media)
    ├── data/catalog.ts                # 35+ category database (Modes, GPU drivers, WMs, bars)
    ├── context/WizardContext.tsx      # State management, presets, and manifest generation
    ├── lib/scriptGenerator.ts         # POSIX shell script generation engine
    └── components/wizard/
        ├── PackageCard.tsx            # Card with tags, pros/cons, & before/after showcase
        ├── WizardHeader.tsx           # Navigation, presets, and Contribute ZIP button
        ├── WizardSidebar.tsx          # Phase and category navigator
        ├── CategoryView.tsx           # Category header and package grid
        ├── WizardFooter.tsx           # Back/Next navigation & selection counter
        └── SelectionReviewModal.tsx   # Blueprint review + Full Script Generator Modal
```

---

## 8. Local Testing Environment (QEMU VM in `~/arch-vm/`)

To safely test `archinstall` flows and generated bash scripts without affecting the host machine, a lightweight QEMU virtual machine environment is prepared at `~/arch-vm/`:

* **Directory:** [`~/arch-vm/`](file:///home/test/arch-vm/) (external to the SimpleArch git repo).
* **Launch Script:** [`~/arch-vm/start-vm.sh`](file:///home/test/arch-vm/start-vm.sh).
* **Virtual Disk:** `arch-disk.qcow2` (20 GB dynamic sparse image).
* **Installer ISO:** `archlinux-latest.iso` (1.5 GB official Arch Linux ISO, pre-downloaded).
* **VM Specs:** Allocated **2 vCPUs** and **2048 MB RAM** (intentionally minimal to avoid starving the host).
* **SSH Port Forwarding:** Forwarded `localhost:2222 -> VM:22` for painless script transfer or remote console testing.

### Critical QEMU Boot Insight (Black Screen Resolution):
* **Default Mode (BIOS):** Running `~/arch-vm/start-vm.sh` boots the Arch ISO in Standard BIOS mode (`ISOLINUX`), which starts **instantly in <1s** with zero delay or black screen.
* **UEFI Mode:** Running `~/arch-vm/start-vm.sh --uefi` enables modern `q35` machine type with local writable NVRAM storage (`arch-vars.fd`).  
  > *Historical Gotcha:* Never run QEMU UEFI with a read-only `OVMF_CODE` without a writable `OVMF_VARS` drive on legacy IDE buses; doing so causes a silent boot stall.

---

## 9. Global Website Runner (`run.sh` / `simplearch` CLI)

To start, check, or manage the Next.js selector web application without manually handling ports or node processes:

* **Script:** [`~/Projects/simplearch/run.sh`](file:///home/test/Projects/simplearch/run.sh)
* **Global CLI Symlink:** `~/.local/bin/simplearch` (in the user's `$PATH`).

```bash
simplearch          # Starts Next.js on 0.0.0.0:3000 (if down) & opens browser
simplearch --status # Checks if port 3000 is healthy and prints PID
simplearch --stop   # Gracefully terminates the dev server
simplearch --logs   # Tails .site.log in real-time
```

> **Note on Environment Restarts:** When cloud or container developer environments reboot, background background processes terminate and port 3000 closes. Running `simplearch` instantly revives the server.

---

## 10. Host System Context & Hardware Constraints

* **Host OS:** Omarchy 4.0.2 (Arch Linux rolling distribution).
* **Desktop Environment:** Hyprland on Wayland (`wayland-1`).
* **Hardware:** Intel 4-Core CPU with 7.6 GB RAM.
* **Virtualization:** `/dev/kvm` hardware acceleration is active and accessible.
* **Design Priority:** The user values extreme distro-level completeness. Utilities like clipboard managers with image previews (`cliphist`), color pickers (`hyprpicker`), on-screen displays (`swayosd`), hardware screen recording (`gpu-screen-recorder`), and local file sharing (`localsend`) must be treated as essential distro-level components, matching OmarchyOS parity.

---

## 11. External Obsidian Vault Documentation

Additional raw research notes and guides exist in the user's local Obsidian Vault at `~/Documents/Obsidian Vault/`:
* `The Complete Linux Desktop Architecture & Ricing Master Guide.md` (copied in `docs/`)
* `archinstall_guide_for_simplearch_website.md`
* `archinstall-selections.md`
* `simple arch.md`

---

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
