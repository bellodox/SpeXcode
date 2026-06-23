[Memory Bank: Active]

This file is local-only and noncanonical. Durable project facts belong in [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md).

Recent change: Carbon Memory was refreshed after the completed environment-bundle export-hardening correction for extension-native SpeXcode environment bundles. Export hardening in [`src/core/config/importExport.ts`](src/core/config/importExport.ts:1) now preserves importable rules, workflows, skills, mode-rules, and custom-mode-like content with conservative redaction while still working together with import hardening so MCP config secrets are stripped on public/shared export and cannot be reintroduced through bundle import.

Current local security note: provider/global settings sanitization still uses [`isSecretStateKey()`](packages/types/src/global-settings.ts:336) to strip secret-state fields before bundle serialization. MCP config export remains structurally sanitized through [`sanitizeMcpConfigForBundleExport()`](src/core/config/importExport.ts:234), and imported MCP bundle content is now sanitized again inside [`importEnvironmentBundle()`](src/core/config/importExport.ts:609) before [`safeWriteJson()`](src/core/config/importExport.ts:641) persists it.

Current local export-scope note: public bundle export now retains importable rules, workflows, skills, mode-rules, and custom-mode-like file contents in sanitized form instead of omitting them. Provider/global settings still strip secret-state values through [`isSecretStateKey()`](packages/types/src/global-settings.ts:336), and MCP JSON secret-bearing fields remain redacted during export/import sanitization. Legacy settings export remains unchanged in [`exportSettings`](src/core/config/importExport.ts:731); hardening applies to environment bundle export through [`exportEnvironmentBundle()`](src/core/config/importExport.ts:765).

Test coverage in [`src/core/config/importExport.spec.ts`](src/core/config/importExport.spec.ts:1) now covers provider secret stripping, MCP secret removal with safe field preservation, and preservation of importable rule/workflow/skill-style content under conservative redaction.

Validation proof from [`src/package.json`](src/package.json:1): [`pnpm test core/config/importExport.spec.ts`](src/package.json:1) passed with 1 file / 14 tests from [`src`](src/package.json), and [`pnpm check-types`](src/package.json:1) passed from [`src`](src/package.json). No servers were started in this work loop.

Release-note status: [`CHANGELOG.md`](CHANGELOG.md) remains intentionally unchanged; user-facing release-note coverage should go through a changeset or normal release tooling if needed.
