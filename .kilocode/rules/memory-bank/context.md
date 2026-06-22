[Memory Bank: Active]

This file is local-only and noncanonical. Durable project facts belong in [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md).

Recent change: native-only VS Code extension setup cleanup is complete. Non-native local setup surfaces were removed, including devcontainer files under [`.devcontainer/`](.devcontainer), repository-level Docker/Nix/direnv/asdf setup files, and obsolete CI workflows for removed setup paths. Active product surfaces remain [`src/`](src), [`webview-ui/`](webview-ui), and required internal packages under [`packages/`](packages); removed product surfaces remain [`apps/`](apps), [`jetbrains/`](jetbrains), [`packages/evals/`](packages/evals), and [`packages/agent-runtime/`](packages/agent-runtime).

Durable docs were already updated in the code subtask, including [`DEVELOPMENT.md`](DEVELOPMENT.md:1), [`README.md`](README.md:1), and maintainer wiki pages such as [`docs/maintainer-wiki/tech-stack.md`](docs/maintainer-wiki/tech-stack.md), [`docs/maintainer-wiki/workflows.md`](docs/maintainer-wiki/workflows.md), [`docs/maintainer-wiki/concept-architecture-overview.md`](docs/maintainer-wiki/concept-architecture-overview.md), and [`docs/maintainer-wiki/log.md`](docs/maintainer-wiki/log.md).

Validation proof recorded from the code subtask: [`pnpm check-types`](package.json:13) passed with Turbo reporting 12/12 successful tasks, and [`pnpm vsix`](package.json:16) passed producing [`bin/kilo-code-5.12.0.vsix`](bin/kilo-code-5.12.0.vsix). No extension installation command was run for this cleanup.

Proof search from the code subtask found only historical or harmless remaining references in [`docs/maintainer-wiki/log.md`](docs/maintainer-wiki/log.md), [`src/services/browser/browserDiscovery.ts`](src/services/browser/browserDiscovery.ts), and [`src/services/commit-message/exclusionUtils.ts`](src/services/commit-message/exclusionUtils.ts).

CHANGELOG status: no user-facing release changelog entry is required for this repository-internal development setup cleanup; [`CHANGELOG.md`](CHANGELOG.md) remains release-version structured without an Unreleased convention to update.
