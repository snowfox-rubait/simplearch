# SimpleArch Part 2 (idea only — not designed) — Interactive Desktop Simulator / Config Generator

Status: **deferred**. Start only after Part 1 (the selector website + generated install script,
see `simplearch_v6.md`) is finished and shipped.

## The idea

Once Part 1's script has installed a user's chosen stack (WM/DE, bar, launcher, terminal, etc.)
with known-good default configs, Part 2 would be a separate site that:

1. **Simulates the resulting desktop** — a live, interactive 2D/3D rendering of what the user's
   desktop looks like after the Part 1 install (their actual chosen bar, launcher, WM behavior,
   theming, etc.), not a generic mockup.
2. **Lets the user edit it directly** — move, add, remove, and restyle elements in the simulator
   the way they'd want their real desktop to look/behave.
3. **Generates config from those edits** — every change the user makes live in the simulator is
   captured and turned into a second shell script that applies the equivalent real configuration
   (Hyprland config, waybar config, GTK/Qt theming, etc.) to their actual machine.

In short: config-by-direct-manipulation instead of config-by-editing-text-files-by-hand — the
"design it visually, get real config out" experience Part 1 explicitly avoids providing (Part 1
only fetches *known-good defaults* verbatim, never authors config).

## Why it's a separate project, not "Part 1.5"

- Part 1 fetches configs verbatim from repos. Part 2 would need to **understand and generate**
  config in each tool's own format/DSL (Hyprland's config language, waybar's JSON, GTK CSS,
  whatever else) — a fundamentally different, much larger technical problem per supported tool.
- Realistic build cost scales per WM/bar/launcher supported — this is closer to "one small product
  per tool" than a single generic feature, unless scope is deliberately narrowed.

## Open questions (unresolved, for whenever this starts)

- Full free-form live 2D/3D simulator+editor vs. a more constrained "preview + guided wizard"
  (pick from a handful of layout/theming knobs per tool, generate config from templates) — the
  wizard version is far cheaper to build and probably captures most of the practical value.
- Which tools get simulator support first, and how deep the simulation needs to be to feel honest
  (vs. becoming a mockup that lies about real WM behavior).
- How simulator edits map back to each tool's specific config syntax — likely needs its own
  per-tool "edit → config" translation layer, not a generic one.

## Next step

None yet — intentionally undesigned until Part 1 ships. Revisit and scope properly then.
