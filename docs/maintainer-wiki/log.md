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
- Recorded follow-up packaging proof after the user explicitly asked whether the rebrand affected builds: a fresh post-rebrand run of [`pnpm vsix`](src/package.json:660) succeeded from [`src/`](src) and produced [`bin/kilo-code-5.12.0.vsix`](bin/kilo-code-5.12.0.vsix), confirming extension packaging still works with the retained compatibility identity in [`src/package.json`](src/package.json:2).

## 2026-06-23

- Recorded the completed SpeXcode `main` compatibility implementation range as upstream stopping commit `d4cdcde5aa796d9d546013e98ad149db15709ee6` excluded through tip `73bf529fafc631d36d7ed58d25b5dcc9fc0f6cf1`, with current workspace merge-base/already-present commit `214f36b43760b11feb0747b1903adc5957caecf2`.
- Recorded the active-compatible/adaptable commits implemented from that pass: `c7da025b78c20e303149bba20021d69e80533710` (DeepSeek V4 Pro/Flash), `bcb72e749d363ad6d6a80f44338b3ceefebaa6b0` (OpenAI Codex GPT-5.5), `4cd3747d93f33620d790d60b622abbef8b824792` (OpenAI GPT-5.5), `ad520cee99fe4b82ae4e3fb3c8227589aca02447` (ripgrep resolution fix), `5eb9271b89a09d893c1812ba0ecc640b1a567938` (Kimi K2.6 Moonshot/Fireworks), `b43dcdbd371e9f4296e5f52eaf40763953a87f54` (remove modelstats fetch from KiloModelInfoView), and `3c215d2c9ef52cd6ad5bac6c09a405eae7f0a7c7` (Claude Opus 4.7 / Extra High verbosity adapted).
- Recorded selection constraints for that implementation pass: merge commits, changeset release bumps, JetBrains-only or removed-surface commits, and docs/metadata copy candidates that would churn or undo the SpeXcode rebrand were intentionally skipped.
- Recorded validation proof from the completed compatibility implementation: backend provider tests passed from [`src/package.json`](src/package.json:1) with `pnpm test api/providers/__tests__/openai-codex.spec.ts api/providers/__tests__/openai-native.spec.ts api/providers/__tests__/fireworks.spec.ts api/providers/__tests__/moonshot.spec.ts` covering 4 files / 112 tests; targeted UI test passed from [`webview-ui/package.json`](webview-ui/package.json:1) with `pnpm test src/components/ui/hooks/__tests__/useSelectedModel.spec.ts` covering 1 file / 27 tests; and extension packaging passed from [`src/package.json`](src/package.json:1) with [`pnpm vsix`](src/package.json:660), producing [`bin/kilo-code-5.12.0.vsix`](bin/kilo-code-5.12.0.vsix).
- Recorded changelog handling status: [`CHANGELOG.md`](CHANGELOG.md) has no Unreleased section and remains release-version structured, so this compatibility work should be surfaced through normal release tooling rather than a forced direct changelog edit.
