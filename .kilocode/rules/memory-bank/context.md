[Memory Bank: Active]

This file is local-only and noncanonical. Durable project facts belong in [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md).

Recent change: Option A pruning is complete and the repository now retains only the VS Code extension product graph: [`src/`](src), [`webview-ui/`](webview-ui), and required internal packages under [`packages/`](packages). Removed product surfaces: [`apps/`](apps), [`jetbrains/`](jetbrains), [`packages/evals/`](packages/evals), and [`packages/agent-runtime/`](packages/agent-runtime).

Validation proof recorded from the code subtask: `pnpm install --lockfile-only` succeeded, `pnpm install` succeeded, `pnpm check-types` succeeded with Turbo reporting 12/12 successful tasks, `pnpm vsix` succeeded, the VSIX artifact was generated at [`bin/kilo-code-5.12.0.vsix`](bin/kilo-code-5.12.0.vsix), and `code --install-extension bin\kilo-code-5.12.0.vsix --force` succeeded with successful VS Code CLI installation output. CHANGELOG status: not updated because [`CHANGELOG.md`](CHANGELOG.md) has no Unreleased section and is release-version structured.
