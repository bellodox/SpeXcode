[Memory Bank: Active]

This file is local-only and noncanonical.

- Priority: keep volatile memory aligned with [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md)
- Current local note: native-only VS Code extension setup cleanup is complete for retained docs/config
- Current local note: local setup no longer depends on devcontainer, Docker-specific repo setup, Nix, direnv, or asdf-style repo files
- Current local note: removed surfaces remain [`apps/`](apps), [`jetbrains/`](jetbrains), [`packages/evals/`](packages/evals), and [`packages/agent-runtime/`](packages/agent-runtime)
- Current local note: validation proof for the cleanup is [`pnpm check-types`](package.json:13) pass and [`pnpm vsix`](package.json:16) pass with artifact at [`bin/kilo-code-5.12.0.vsix`](bin/kilo-code-5.12.0.vsix)
- Current local note: no user-facing [`CHANGELOG.md`](CHANGELOG.md) update is needed for this internal setup cleanup
- Next action: keep Carbon Memory current and decide whether the historical CLI section in [`docs/file-locations.md`](docs/file-locations.md:33) should stay inline or move to archival docs
