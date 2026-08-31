# SimpleArch

> Turns a bare Arch Linux install into a complete, working daily-driver OS (dev work, gaming, daily use, and ricing) with complete freedom of choice across every layer.

SimpleArch provides a web-based selector and one-shot POSIX shell script generator that allows you to configure your ideal Arch Linux desktop with curated, known-good defaults.

## Architecture

- **Web Selector & Wizard:** Built with Next.js (App Router), React, and Tailwind CSS.
- **Catalog Data:** Version-controlled flat data models (`data/`) covering the entire desktop ecosystem across 35+ categories.
- **Safe Installer Script:** Generates a clean POSIX shell script with:
  - Prerequisites sanity check & advisory warnings
  - Automatic AUR helper bootstrap (`yay` / `paru`)
  - Batched package installation
  - Safe default configuration placement with unconditional incremental backups (`.bak1`, `.bak2`)
  - Consolidated end-of-run summary

## Documentation

- [SimpleArch Specification v6](docs/simplearch_v6.md)
- [Package Universe & Research Reference](docs/simplearch_package_research.md)

## Development

```bash
# Install dependencies
npm install

# Run the local development server
npm run dev

# Build for production
npm run build
```
