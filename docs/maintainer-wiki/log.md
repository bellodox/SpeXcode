# Maintainer Log

## 2026-06-21

- Initial wiki setup created as the durable Carbon Memory layer for this repository.
- Established [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md) as the canonical entrypoint.
- Initialization based on repository evidence from [`README.md`](README.md), [`package.json`](package.json), [`pnpm-workspace.yaml`](pnpm-workspace.yaml), [`turbo.json`](turbo.json), [`DEVELOPMENT.md`](DEVELOPMENT.md), and [`docs/file-locations.md`](docs/file-locations.md).

## 2026-06-22

- Updated durable docs after the extension-only leftover cleanup to stop presenting [`jetbrains/`](jetbrains), [`apps/`](apps), and [`packages/agent-runtime/`](packages/agent-runtime) as active repository surfaces.
- Recorded that retained-code/config cleanup removed remaining JetBrains and deleted-surface leftovers, including simplifications around commit-message adapters, autocomplete bridge code, wrapper metadata, agent-manager runtime handling, and webview packaging helpers named in the completed code task.
- Recorded validation proof from the code subtask: [`pnpm check-types`](package.json:13) succeeded with Turbo 12/12 tasks, [`pnpm vsix`](package.json:16) produced [`bin/kilo-code-5.12.0.vsix`](bin/kilo-code-5.12.0.vsix), and no VSIX installation command was run for this cleanup because the user asked not to install it.
- Recorded the packaging gotcha that an earlier failed install came from a truncated VSIX caused by concurrent packaging/watch processes; rerunning packaging after stopping the conflicting processes produced a valid artifact.
- Removed non-native contributor setup surfaces and references that conflicted with the extension-only native workflow, including [`.devcontainer/`](.devcontainer), [`.dockerignore`](.dockerignore), [`.envrc`](.envrc), [`flake.nix`](flake.nix), [`flake.lock`](flake.lock), and Docker-based GitHub workflows for removed surfaces.
- Recorded completion of the cosmetic user-facing rebrand from Kilo Code to SpeXcode across active docs, marketplace copy, runtime/UI branding, walkthroughs, and localizations, while intentionally retaining compatibility identifiers such as extension IDs, publisher names, command/config keys, storage keys, package names, and `kilocode`-named implementation paths.
- Recorded the current live repository URL for active public links as `https://github.com/bellodox/SpeXcode`.
- Recorded validation proof from the rebrand code subtask: [`pnpm check-types`](package.json:13) succeeded with Turbo 12/12 tasks, focused [`webview-ui/src/__tests__/ErrorBoundary.spec.tsx`](webview-ui/src/__tests__/ErrorBoundary.spec.tsx:1) passed with 2 tests passed, and the targeted user-facing link/name grep reported no remaining old live URL matches in the checked targets.
