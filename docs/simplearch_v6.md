# Project SimpleArch (v6)

Turns a bare Arch install into a **complete, working daily-driver OS** — dev work, gaming, and
daily use all covered — while still exposing **every real alternative** in every category, the
way a hand-rolled setup would, instead of collapsing to one curated "best" pick per category like
most pre-riced distros do.

Closest reference point: Omarchy. Difference from Omarchy — Omarchy hands you one fixed,
opinionated stack. SimpleArch hands you the *entire selection surface* Omarchy's authors already
chose from, lets you pick your own path through it, and still leaves you with a fully working
system at the end regardless of which path you took.

This document covers **only the selector/generator** (referred to below as "the tool"). A second,
separate tool — a configurator for deep customization beyond the working defaults this tool
installs — is planned as its own future project. It gets only a brief mention here (§10).

---

## 0. Architecture Change from v5 — read this first

v5 specced a single statically-linked Rust/ratatui TUI binary that ran live on the target machine,
did live system introspection, and installed things interactively step by step. **That
architecture is gone.** The tool is now:

- **A website.** All browsing, selection, filtering, and media (screenshots/video, shown live —
  something the TUI explicitly couldn't do) happens there. No binary, no terminal UI, nothing to
  compile or distribute per-platform.
- **A generated shell script**, produced at the end of the website flow, that the user runs once
  on their already-installed, already-booted Arch system.

**Why this changed:** the TUI's core justification was live access to the target machine (accurate
conflict detection, "already installed" checks, direct execution). But the point in the user's
timeline where selection needs to happen — after archinstall, once network exists but before a
browser necessarily does — turns out to work fine as a two-visit flow (prerequisites guide, then
post-install site visit) once live scanning is off the table. Live scanning was dropped in favor
of user self-report plus script-side safety nets (below), which trades some detection accuracy for
a much simpler, faster-to-build, and better-authoring-experience architecture. See §7 for exactly
what's kept and what's lost from this trade.

**Everything TUI-specific from v5 is gone**: no Rust/ratatui, no musl static binary, no
QR-code-instead-of-images workaround, no live catalog sync into a running binary. Everything the
TUI was *for* — browsing, filtering, choosing, seeing what things look like — is still here, just
done by the website instead, and done better for the media case specifically.

---

## 1. Core Concept

The user visits a **prerequisites page** first, which guides them through `archinstall` itself —
telling them which top-level profile to pick (Minimal is the supported baseline; see §7) so the
post-install script has a clean, predictable starting point to work from.

After `archinstall` finishes and the user reboots into their bare system (now with working
network, courtesy of `archinstall`'s own NetworkManager setup, and a terminal), they return to the
**main site** and walk through every category a complete daily-driver desktop needs — not just
the traditional "ricing" categories (WM/DE, bar, launcher, file manager, terminal) but everything
a real work system requires: dev toolchains, gaming stack, daily-use apps, and the smaller
utilities a desktop is expected to have (color picker, magnifier, clipboard manager, screenshot
tool, etc.) — choosing freely from **every available option** in each, not a shortlist.

At the end, the website **generates a single shell script** (downloadable, or served at a
short URL for `curl | sh`-style fetching). The user runs it once on their machine. That script —
not the website — does the actual installation.

**What "install" means, precisely (unchanged from v5):**
- Install the chosen package(s) via pacman/AUR.
- Fetch a **known-good default configuration from a GitHub repo** for that package (§4/§5) and
  place it, so the result is immediately usable — not a bare, unconfigured binary drop.
- **Never author, generate, or edit configuration itself.** No config-writing logic anywhere in
  the tool, website, or script. Every config that lands on disk is a file pulled verbatim from a
  repo, same mechanism for every package, no exceptions.

**Catalog scope rule (unchanged):** cover everything a genuine work desktop would plausibly need —
including small or niche-but-real utilities — each filed under its own category. Excludes packages
that technically exist for Arch but that essentially nobody actually uses; completeness means
"every real option," not "every package that has ever existed."

---

## 2. Category Universe — unchanged from v5

Categories span four tiers. There is no structural difference between a "desktop" category and a
"dev" category in how the website presents or filters them — same step types, same filtering
logic, same config-fetch mechanism, just different content.

### 2a. Desktop layer (the original ricing scope)
Display protocol → WM/DE fork → (if hand-assembled) bar, launcher, notification daemon, OSD,
compositor effects, etc. → file manager → terminal → theming (GTK/Qt/icon/cursor) → small utilities
(color picker, magnifier, screenshot/recording, clipboard manager, etc.).

### 2b. Dev toolchains
Languages/runtimes, version managers (e.g. mise), git tooling (git itself, lazygit, gh cli),
editors/IDEs, common CLI dev ergonomics (ripgrep/fd/bat/eza/fzf-class tools), container/VM
tooling where broadly used (docker, podman) — same "real and commonly used, not everything that
exists" rule as §1.

### 2c. Gaming stack
Steam, Proton/Wine, GameMode, gamescope, controller support (e.g. udev rules/tools), performance
overlays (e.g. mangohud), launcher alternatives (Lutris, Heroic) where real and maintained.

### 2d. Daily-use apps
Browser(s), media apps (player, image viewer), communication apps, office/notes, file sync/share
— same "commonly used" bar as everywhere else, not an exhaustive app-store dump.

**Usecase is not a wizard question.** The user never picks "I'm a dev" or "I'm a gamer" — every
tier is offered to everyone, every time. Skipping a whole tier happens by declining every option
in it, not by a gating question upstream. One system usable for *any* usecase at once, not a
system tailored to a declared one.

### 2e. Ricing intensity — unchanged, independent axis
Bare minimum / decent / extensive. Orthogonal to 2a–2d: only affects how much "extra, not
core-function" content within each category is shown, never which of the four tiers appear.

### 2f. DE vs. hand-assembled — first-class fork
A single-select step, above the rest of §2a:
- **Full DE** (GNOME, KDE Plasma, Xfce, Cinnamon, MATE, LXQt, Budgie, COSMIC, etc.) — picking one
  skips the bar/launcher/notification-daemon/compositor-effects steps downstream, since the DE
  bundles its own. Its default config still comes via the same GitHub-repo fetch mechanism as
  everything else, scoped to "make the DE usable," not deep customization.
- **Hand-assemble** — unlocks WM/compositor, bar, launcher, notification daemon, etc. as
  individual selection steps.

Both paths are first-class, no default preference between them.

---

## 3. Website Architecture (replaces v5's "Dynamic Engine")

v5's engine split (TOML package data vs. KDL flow definition, read by a compiled binary at
runtime) doesn't map cleanly onto a website — that split existed specifically to let a *binary*
stay generic while content updated independently of it. A website's backend/database already
serves that same purpose natively, so the two-file-format machinery is dropped. **The concept it
protected — content and flow logic are separately editable, the frontend doesn't hardcode
categories — is kept**, just implemented as a normal web app + database instead:

- **Package/option data** lives in a database (categories, tags, pros/cons, stability score,
  maintained status, media, `default_config_repo` — same fields as v5 §5, minus the TOML
  serialization specifics).
- **Flow/step logic** (what step follows what, dependency gating, single-select vs multi-select
  category steps) lives as backend-driven configuration, not hardcoded frontend routes — so
  adding a category or reordering steps doesn't require a frontend redeploy any more than it
  required a binary rebuild in v5. Exact mechanism (CMS-style admin panel vs. a config table the
  frontend reads) is an implementation detail, not decided here.
- **Filtering** (protocol choice gates which WMs/bars appear, DE-vs-hand-assemble gates which
  desktop-layer steps show at all) is standard web-app conditional logic — same behavior as v5's
  generic filter engine, no longer needing to be generic-over-a-compiled-binary since it's just
  server/client code that can be as specific as needed.

**What's strictly better than the TUI here:** live media. v5 dropped in-tool screenshots/video
specifically because rendering them in a terminal was awkward (chafa dependency, QR-code
workaround). A website just shows images and video natively — this was a real limitation the
architecture change removes, not just a lateral move.

---

## 4. Config-Fetch Mechanism — unchanged in concept, script-side now

Each package's data entry gains a `default_config_repo` field: a URL to a GitHub repo (or path
within one) containing a known-good, minimal-but-working config for that package.

- **Fetch, don't generate.** The *generated script* — not the website — does the actual clone/
  download at run time on the user's machine, placing files at the package's expected config
  path. No templating, no merging, no per-user substitution beyond what the source repo itself
  already does.
- **If no `default_config_repo` is set:** the package's own built-in default is used as-is, only
  for packages genuinely fine unconfigured.
- **Sourcing these repos is a curation task**, same pipeline as package discovery (§6) — the
  agent should also try to identify a well-regarded default-config source per package as part of
  its normal sweep, flagged for Haw's review same as everything else, not auto-trusted.
- **Existing-file handling (replaces v5's live conflict-resolution step, see §7):** the script
  never silently overwrites. If a config file already exists at the target path, the script backs
  it up first (§7) before writing its own.

---

## 5. Package Data Schema — same fields, no longer TOML-specific

All v5 fields carry forward as *data fields*, independent of file format (name, category, tags,
pros/cons, stability_score, maintained status, media_url, default_config_repo). Whatever storage
format the website's backend uses (database rows, JSON, whatever) is an implementation detail —
the schema concept is what's being preserved here, not the TOML syntax:

```
name: hyprland
category: wm
tags: [requires_protocol:wayland]
pros: [...]
cons: [...]
stability_score: 8
media_url: https://github.com/you/simplearch/wiki/hyprland
default_config_repo: https://github.com/some-user/hyprland-minimal-config
```

`default_config_repo` is optional — omitted for packages with a genuinely fine built-in default.

---

## 6. Content Curation Pipeline — unchanged in concept

Same mechanism as v5 §6 (daily AI-agent sweep, fixed rubric, admin dashboard with accepted/
rejected + structured reasons, dedup before dashboard, manual screenshots/video by Haw) — feeding
the website's database instead of a synced TOML repo. Scope stays all four tiers from §2. The
agent's job:

- Surfacing real, commonly-used options across dev/gaming/daily-app tiers with the same
  completeness-not-curation goal as desktop categories — every real alternative, not one "best"
  pick, flagged by quality via existing maturity/stability fields rather than filtered out.
- Applying the "real and commonly used" exclusion rule (§1) consistently — needs an explicit
  rubric (install-base/popularity signals, AUR vote counts, GitHub stars/forks as a proxy) so the
  agent doesn't over- or under-include by tier.
- Attempting to source a `default_config_repo` candidate per package as part of its normal sweep,
  flagged for review same as everything else — not a separate pipeline pass.

---

## 7. System Awareness — fundamentally changed, this is the real architecture shift

v5's live-scanning design (Case A archinstall-log parsing, Case B runtime detection, existing-
state map, pre-install conflict pass) is **dropped**, because the website has no access to the
target machine — it only knows what the user tells it, and by the time the generated script runs,
the website isn't involved anymore either. This was a deliberate trade, not an oversight:

**What's kept — self-report + prerequisites contract:**
- A **prerequisites page** tells the user what to pick during `archinstall` (Minimal is the
  supported baseline — the Custom-profile/live-ISO-networking discussion ruled out feeding
  choices *into* archinstall itself; post-install is the only workable timing). This becomes an
  implicit contract the generated script is allowed to assume.
- The website *can* still catch **self-reported logical conflicts** at generation time (e.g. user
  says "I already have Hyprland" and also selects Sway) purely from form data — no live scan
  needed, just validation logic on what the user typed. This is the one piece of v5's conflict
  detection that's cheap to keep even without a live machine.
- **Pacman-level conflicts** (declared `Conflicts=`, file ownership clashes) are still caught, for
  free, by pacman itself at script run time — the script watches pacman's exit code/stderr and
  reacts. This does not catch *semantic* category conflicts (two WMs installed side by side) since
  pacman has no opinion on those — only true package-manager-level clashes.

**What's genuinely lost, and accepted as a trade:**
- No live "already installed and current, notify-only" detection — the script can do a shallow
  presence check (`command -v`, does a known config path exist) as a sanity ping before running,
  warn if it looks like the user drifted from the prerequisites contract, but this is a heads-up,
  not a diagnosis — it can't tell version, configuration state, or *why* something's present.
- No true pre-install semantic conflict scan (e.g. two WMs both fully installed, no file collision
  for pacman or a `.bak` rule to ever catch) — accepted gap, mitigated only by the self-report
  check above.

**What replaces the old destructive-overwrite protection — auto-backup, unconditional:**
- Whatever the script is about to overwrite, it backs up first, unconditionally, no exceptions —
  `name.bak1`, `.bak2`, etc., incrementing per-file so re-runs never destroy an earlier backup by
  overwriting a fixed `.bak` name.
- This makes the mismatch warning above **advisory, not a safety gate** — since nothing is ever
  destructively lost regardless of whether the user matches the prerequisites contract, the
  warning's job is just "heads up, this might not give a clean result," not "stop, you'll lose
  data." The manual "back up your stuff first" warning still gets shown as the primary signal;
  auto-`.bak` is the safety net underneath it in case the user proceeds anyway.
- At the end of the run, the script prints one consolidated summary (not scattered inline
  messages) listing every file it changed and where its backup landed, so the user has one place
  to check rather than scrolling back through terminal output.

---

## 8. Overall Flow / Phase Ordering — updated for two-visit, script-based shape

1. **Prerequisites page** — user reads this first. Tells them what to pick in `archinstall`
   (Minimal baseline) so the post-install script has a predictable starting point.
2. User runs `archinstall` themselves, on their own, using the prerequisites guidance. No
   integration with archinstall's Custom-profile mechanism — that mechanism only fires *during* an
   in-progress install, and by the time the user has anything to feed it, archinstall has already
   finished (see open question in §10 re: whether a future pre-install path is ever worth
   building).
3. User reboots into their bare, networked system.
4. User visits the **main site**, walks through category selection (§2), sees live media per
   option, gets self-reported-conflict validation (§7) as they go.
5. Website **generates a shell script** (download, or short URL for `curl | sh`).
6. User runs the script on their machine. Script does: prerequisites-match sanity check (§7,
   warn-only) → install packages via pacman/AUR → fetch+place configs (§4), backing up any
   existing file first (§7) → print consolidated end-of-run summary (§7).

No system-scan phase, no in-script interactive conflict-resolution step, no separate "write
selection manifest" step — the generated script itself *is* the manifest, and it's a one-shot,
mostly-unattended run rather than a multi-phase interactive session.

---

## 9. Technical Shape — replaces v5's Rust/TUI section entirely

- **Website**: standard web app + database/backend, holding the package catalog and flow
  configuration (§3). No specific stack mandated here.
- **Generated artifact**: a plain POSIX-compatible shell script (or served at a short URL for
  `curl -fsSL url | sh`-style fetching) — matches the convention already used by comparable
  dotfiles/setup installers (e.g. Omarchy's own install flow), so the ask ("run this one command
  after reboot") is familiar to the target audience.
- Script bootstraps an AUR helper if missing (carried forward from v5, still relevant regardless
  of architecture).
- No compiled binary, no per-platform build/release process, no bundled media rendering — the
  entire reason those existed in v5 (a live TUI on a bare console) no longer applies, since the
  browsing experience moved to a normal browser and the script is just plain shell.

---

## 10. Open Questions / Future Work

- Carried forward from v5: exact popularity/usage signal(s) the curation rubric should use to
  enforce the "real and commonly used" exclusion rule per tier (§6) — needs a concrete, written
  threshold. Also carried forward: for packages with an official upstream "getting started"
  config vs. a third-party curated dotfiles repo, does `default_config_repo` prefer
  upstream-official when one exists, or best-maintained third-party regardless of source? Needs a
  tiebreak rule before curation starts at scale.
- **New:** exactly how strict is the prerequisites contract — is Minimal the *only* supported
  starting state, or are a small set of known-safe variants (e.g. Xorg-only) also supported, with
  the sanity check in §7 checking against a set rather than one exact expected state? Binary
  match/no-match risks false-positive-warning users who did nothing wrong.
- **New:** does the mismatch sanity check (§7) require an explicit confirm keystroke before
  proceeding, or just warn-and-continue? Given auto-backup already handles the destructive case,
  warn-and-continue is defensible, but worth deciding deliberately rather than by default.
- **New:** two-visit session shape confirmed (no cross-visit persistence needed — prerequisites
  page and main site are stateless relative to each other, linked only by the user following
  written guidance). If a future version wants a single continuous session instead, that
  reintroduces a persistence problem (accounts, saved links, or a downloadable JSON) deliberately
  avoided here.
- Configurator project (deep customization beyond working defaults): still deliberately
  undesigned here, to be scoped as its own project once this tool is finished.
