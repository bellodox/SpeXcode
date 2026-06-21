# Concept: Architecture Overview

## Project Type

Kilo Code is a monorepo for an AI coding agent platform centered on a VS Code extension, with additional frontend, shared packages, support apps, and JetBrains integration. This is stated in [`README.md`](README.md:11) and reflected by the workspace layout in [`pnpm-workspace.yaml`](pnpm-workspace.yaml:1).

## Main Directories

- [`src/`](src) — core extension logic and tool/runtime behavior
- [`webview-ui/`](webview-ui) — extension webview frontend
- [`packages/`](packages) — shared packages used across surfaces
- [`apps/`](apps) — supporting apps such as docs, site, tests, and Storybook-style surfaces
- [`jetbrains/`](jetbrains) — JetBrains plugin and host packages
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
5. Additional apps and JetBrains packages integrate with the shared platform model.

## External Dependencies and Services

- Node.js and pnpm are required for local development according to [`DEVELOPMENT.md`](DEVELOPMENT.md:13).
- VS Code extension packaging relies on VSCE from [`package.json`](package.json:44).
- Repository hooks are managed by Husky per [`DEVELOPMENT.md`](DEVELOPMENT.md:230).
