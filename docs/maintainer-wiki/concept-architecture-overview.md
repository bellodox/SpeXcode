# Concept: Architecture Overview

## Project Type

SpeXcode is now an extension-only monorepo centered on the VS Code extension, its bundled webview frontend, and the internal packages required to build and package that extension. Current workspace membership is reflected by [`pnpm-workspace.yaml`](pnpm-workspace.yaml:1).

## Main Directories

- [`src/`](src) — core extension logic and tool/runtime behavior
- [`webview-ui/`](webview-ui) — extension webview frontend
- [`packages/`](packages) — retained shared packages required by the extension product graph
- [`scripts/`](scripts) — repository automation and packaging utilities

## Entry Points and Control Surfaces

- Root orchestration starts in [`package.json`](package.json) and [`turbo.json`](turbo.json).
- Workspace membership is defined in [`pnpm-workspace.yaml`](pnpm-workspace.yaml).
- Contributor and developer workflows are documented in [`DEVELOPMENT.md`](DEVELOPMENT.md).

## High-Level Flow

1. Root workspace scripts coordinate build, test, lint, and packaging tasks.
2. The extension core in [`src/`](src) provides runtime logic.
3. The frontend in [`webview-ui/`](webview-ui) provides interactive UI for the extension.
4. Shared packages in [`packages/`](packages) provide reusable contracts and utilities.
5. Removed product surfaces such as [`apps/`](apps), [`jetbrains/`](jetbrains), and [`packages/agent-runtime/`](packages/agent-runtime) no longer participate in the build graph; remaining retained code/config leftovers were removed in the 2026-06-22 cleanup recorded in [`docs/maintainer-wiki/log.md`](docs/maintainer-wiki/log.md:8).

## External Dependencies and Services

- Native local development requires Git, Git LFS, Node.js, pnpm, and VS Code according to [`DEVELOPMENT.md`](DEVELOPMENT.md:11).
- VS Code extension packaging relies on VSCE from [`package.json`](package.json:44).
- Repository hooks are managed by Husky per [`DEVELOPMENT.md`](DEVELOPMENT.md:230).
- Post-cleanup validation should confirm the extension remains buildable through [`pnpm check-types`](package.json:13) and [`pnpm vsix`](package.json:16).
