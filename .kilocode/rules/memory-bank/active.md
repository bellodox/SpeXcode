[Memory Bank: Active]

This file is local-only and noncanonical.

- Priority: keep volatile memory aligned with [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md)
- Current local note: cosmetic user-facing rebrand from Kilo Code to SpeXcode is complete for active docs, UI/runtime branding, walkthroughs, and localizations
- Current local note: current live repository URL is `https://github.com/bellodox/SpeXcode`
- Current local note: intentional retainers remain for compatibility identifiers and implementation names, including extension IDs, publisher, command/config keys, storage keys, package names, and `kilocode`-named paths
- Current local note: validation proof for the rebrand is [`pnpm check-types`](package.json:13) pass with Turbo 12/12 successful tasks and focused [`webview-ui/src/__tests__/ErrorBoundary.spec.tsx`](webview-ui/src/__tests__/ErrorBoundary.spec.tsx:1) vitest pass with 2 tests passed
- Current local note: [`CHANGELOG.md`](CHANGELOG.md) was intentionally left unchanged because it is release-version structured and has no Unreleased section
- Next action: keep Carbon Memory current and record the public SpeXcode naming in future durable release notes when the next version entry is generated
