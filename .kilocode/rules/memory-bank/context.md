[Memory Bank: Active]

This file is local-only and noncanonical. Durable project facts belong in [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md).

Recent change: the remaining JetBrains/deleted-surface leftovers were removed from retained code/config after the extension-only pruning. Active product surfaces remain [`src/`](src), [`webview-ui/`](webview-ui), and required internal packages under [`packages/`](packages); removed surfaces remain [`apps/`](apps), [`jetbrains/`](jetbrains), [`packages/evals/`](packages/evals), and [`packages/agent-runtime/`](packages/agent-runtime).

Validation proof recorded from the code subtask: [`pnpm check-types`](package.json:13) succeeded with Turbo reporting 12/12 successful tasks, [`pnpm vsix`](package.json:16) succeeded, the VSIX artifact was generated at [`bin/kilo-code-5.12.0.vsix`](bin/kilo-code-5.12.0.vsix), [`code --install-extension bin\kilo-code-5.12.0.vsix --force`](bin/kilo-code-5.12.0.vsix) succeeded, and [`code --list-extensions`](bin/kilo-code-5.12.0.vsix) included `kilocode.kilo-code`.

Packaging gotcha resolved: an earlier failed install came from a truncated VSIX created while concurrent packaging/watch processes were still running; rerunning packaging after stopping the conflicting processes produced a valid installable artifact. CHANGELOG status remains unchanged because [`CHANGELOG.md`](CHANGELOG.md) has no Unreleased section and is release-version structured.
