[Memory Bank: Active]

This file is local-only and noncanonical.

- Priority: keep volatile memory aligned with [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md)
- Current local note: SpeXcode `main` compatibility analysis covered upstream range `d4cdcde5aa796d9d546013e98ad149db15709ee6` excluded through `73bf529fafc631d36d7ed58d25b5dcc9fc0f6cf1`, with current workspace merge-base/already-present commit `214f36b43760b11feb0747b1903adc5957caecf2`
- Current local note: implemented active-compatible/adaptable commits were `c7da025b78c20e303149bba20021d69e80533710`, `bcb72e749d363ad6d6a80f44338b3ceefebaa6b0`, `4cd3747d93f33620d790d60b622abbef8b824792`, `ad520cee99fe4b82ae4e3fb3c8227589aca02447`, `5eb9271b89a09d893c1812ba0ecc640b1a567938`, `b43dcdbd371e9f4296e5f52eaf40763953a87f54`, and `3c215d2c9ef52cd6ad5bac6c09a405eae7f0a7c7`
- Current local note: selection intentionally skipped merge commits, changeset release bumps, JetBrains-only or removed-surface commits, and docs/metadata copy candidates that would churn or undo the SpeXcode rebrand
- Current local note: validation proof is backend provider tests from [`src/package.json`](src/package.json:1) with 4 files / 112 tests, targeted UI test from [`webview-ui/package.json`](webview-ui/package.json:1) with 1 file / 27 tests, and successful [`pnpm vsix`](src/package.json:660) packaging producing [`bin/kilo-code-5.12.0.vsix`](bin/kilo-code-5.12.0.vsix)
- Current local note: this docs-only Carbon Memory refresh started no servers
- Current local note: [`CHANGELOG.md`](CHANGELOG.md) remains intentionally unchanged because it has no Unreleased section and this work should flow through normal release tooling
- Next action: record this compatibility pass in the next durable release note or release-tooling output while keeping Carbon Memory aligned
