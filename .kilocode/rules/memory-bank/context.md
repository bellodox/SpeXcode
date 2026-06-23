[Memory Bank: Active]

This file is local-only and noncanonical. Durable project facts belong in [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md).

Recent change: Carbon Memory was refreshed after the completed SpeXcode main-branch compatibility implementation. The analysis inspected SpeXcode `main` from stopping commit `d4cdcde5aa796d9d546013e98ad149db15709ee6` excluded through tip `73bf529fafc631d36d7ed58d25b5dcc9fc0f6cf1`, with current workspace merge-base/already-present commit `214f36b43760b11feb0747b1903adc5957caecf2`.

Implemented active-compatible/adaptable commits recorded for local memory: `c7da025b78c20e303149bba20021d69e80533710` DeepSeek V4 Pro/Flash, `bcb72e749d363ad6d6a80f44338b3ceefebaa6b0` OpenAI Codex GPT-5.5, `4cd3747d93f33620d790d60b622abbef8b824792` OpenAI GPT-5.5, `ad520cee99fe4b82ae4e3fb3c8227589aca02447` ripgrep resolution fix, `5eb9271b89a09d893c1812ba0ecc640b1a567938` Kimi K2.6 Moonshot/Fireworks, `b43dcdbd371e9f4296e5f52eaf40763953a87f54` remove modelstats fetch from KiloModelInfoView, and `3c215d2c9ef52cd6ad5bac6c09a405eae7f0a7c7` Claude Opus 4.7 / Extra High verbosity adapted.

Selection rules recorded for the completed implementation: skipped merge commits, changeset release bumps, JetBrains-only or removed-surface commits, and docs/metadata copy candidates that would churn or undo the SpeXcode rebrand.

Validation proof from the completed implementation: backend provider tests passed from [`src/package.json`](src/package.json:1) using `pnpm test api/providers/__tests__/openai-codex.spec.ts api/providers/__tests__/openai-native.spec.ts api/providers/__tests__/fireworks.spec.ts api/providers/__tests__/moonshot.spec.ts` with 4 files / 112 tests; UI targeted test passed from [`webview-ui/package.json`](webview-ui/package.json:1) using `pnpm test src/components/ui/hooks/__tests__/useSelectedModel.spec.ts` with 1 file / 27 tests; extension packaging passed from [`src/package.json`](src/package.json:1) using `pnpm vsix`, producing [`bin/kilo-code-5.12.0.vsix`](bin/kilo-code-5.12.0.vsix).

This docs-only Carbon Memory update started no servers. CHANGELOG status: [`CHANGELOG.md`](CHANGELOG.md) is release-version structured and has no Unreleased section, so this compatibility work should be represented through normal release tooling rather than a forced direct changelog edit.
