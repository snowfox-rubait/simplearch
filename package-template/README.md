# SimpleArch Contributor Package Template

Welcome! SimpleArch is an open, modular catalog and script generator for Arch Linux. We welcome contributions for new window managers, compositors, status bars, application launchers, terminals, audio tools, and system utilities.

Contributors can submit new packages simply by filling out this folder, adding screenshots/GIFs of their rice, zipping the folder, and submitting it to our GitHub repository.

---

## Folder Structure

```text
my-package-name/
├── metadata.json       # Required: Package metadata, pros/cons, tags, and media links
├── README.md           # This guide
├── media/              # Required: Before & after ricing screenshots / GIFs / videos
│   ├── vanilla.png     # Default out-of-the-box look
│   ├── riced-1.png     # Riced screenshot (example 1)
│   └── demo.gif        # Optional demo GIF / WebM video
└── config/             # Optional: Minimal working baseline config
    └── config.conf
```

---

## Step-by-Step Contribution Guide

### Step 1: Duplicate and Rename
Make a copy of this `package-template` folder and rename it to your package's canonical name (e.g., `foot-terminal` or `swaync`).

### Step 2: Fill Out `metadata.json`
Open `metadata.json` and adjust the fields:
- **`name`**: Human-readable display name (e.g. `Foot Terminal`).
- **`category`**: One of:
  - `wm` (Window Manager / Compositor)
  - `de` (Desktop Environment)
  - `bar` (Status Bar / Dock)
  - `launcher` (App Launcher / Menu)
  - `terminal` (Terminal Emulator)
  - `file-manager` (GUI / TUI File Manager)
  - `notification` (Notification Daemon)
  - `lock` (Screen Locker)
  - `wallpaper` (Wallpaper Utility)
  - `audio` (Volume / Audio Control)
  - `utils` (Clipboard, Screenshot, Portal, etc.)
- **`protocol`**: `wayland`, `x11`, or `agnostic`.
- **`source`**: `repo` (official Arch `pacman` repos) or `aur`.
- **`packages`**: Array of exact package names to install via `pacman` or the AUR helper.
- **`tags`**: Relevant badges:
  - `verified`: Tested on bare-metal Arch Linux.
  - `old-hardware-friendly`: Runs smoothly on legacy dual-core CPUs / non-Vulkan iGPUs.
  - `modern-hardware`: Demands modern GPU compositing / Vulkan / high refresh rate.
  - `minimal-memory`: Idles under 30MB RAM.
  - `gpu-composited`: Uses hardware GPU rendering for blur/animations.
- **`stability_score`**: Integer from 1 to 10 based on release maturity and upstream stability.
- **`hardware_requirements`**:
  - `ancient_hardware_friendly`: `true` or `false`.
  - `gpu_compositing_required`: `true` or `false`.
- **`pros`**: 2–4 concise bullet points explaining why users choose this tool.
- **`cons`**: 1–3 honest limitations or quirks.
- **`compatibility`**:
  - `supported_protocols`: `["wayland"]`, `["x11"]`, or both.
  - `conflicts`: Packages that cannot run alongside this tool.
  - `curated_pairings`: Recommended companion tools (e.g. for a WM: recommended bar, launcher, locker).
- **`media`**: References to files placed in the `media/` folder.

### Step 3: Add Media Showcases
SimpleArch users want to see **what the software looks like before and after ricing**:
1. **Before Ricing (`media/vanilla.png`)**: A clean screenshot showing the software running in its default, out-of-the-box state.
2. **After Ricing (`media/riced-example-1.png`, etc.)**: One or more screenshots showing a customized, riced setup in action.
3. **Animations / GIFs (`media/demo.gif` or `.webm`)**: (Optional but encouraged) A short animation showing window transitions, menus, or dynamic behavior.

*Image guidelines:*
- Preferred format: `.png` or `.webp` for stills; `.gif` or `.webm` for motion.
- Resolution: 1080p or 1440p preferred (keep file sizes under 5MB per media file).

### Step 4: Add Baseline Config (Optional)
If you have a sensible, minimal, well-commented baseline configuration that gives new users a working starting point:
- Place it in `config/` (e.g. `config/foot.ini`).
- In `metadata.json`, specify `targetConfigPath` (e.g. `~/.config/foot/foot.ini`).

### Step 5: Zip and Submit
1. Compress your completed folder:
   ```bash
   zip -r my-package.zip my-package/
   ```
2. Submit your contribution:
   - **Option A (GitHub Issue):** Open a new issue titled `[Package Submission] Package Name` on `https://github.com/simplearch/simplearch`, attach `my-package.zip`, and briefly describe your submission.
   - **Option B (Pull Request):** Place your folder into `packages/` in the SimpleArch repository and submit a PR.

The maintainers will review the metadata, test the install script integration, and merge it into the live catalog!
