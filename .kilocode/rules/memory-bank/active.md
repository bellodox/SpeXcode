[Memory Bank: Active]

This file is local-only and noncanonical.

- Priority: keep volatile memory aligned with [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md)
- Current local note: public environment bundle handling in [`src/core/config/importExport.ts`](src/core/config/importExport.ts:1) now strips secret-bearing MCP content on both export and import paths
- Current local note: hardening centers on [`sanitizeProviderProfilesForBundleExport()`](src/core/config/importExport.ts:202), [`sanitizeGlobalSettingsForBundleExport()`](src/core/config/importExport.ts:226), [`sanitizeMcpConfigForBundleExport()`](src/core/config/importExport.ts:234), [`sanitizeBundleFileContentForExport()`](src/core/config/importExport.ts:271), [`buildEnvironmentBundle()`](src/core/config/importExport.ts:530), and [`importEnvironmentBundle()`](src/core/config/importExport.ts:609)
- Current local note: provider/global settings sanitization uses [`isSecretStateKey()`](packages/types/src/global-settings.ts:336); MCP sanitization removes fields like `env`, authorization-like headers, `clientSecret`, `apiKey`, `token`, `password`, and similar secret-key patterns while preserving safe config fields
- Current local note: imported MCP bundle content is sanitized again before persistence through [`safeWriteJson()`](src/core/config/importExport.ts:641), closing the manual-bundle-edit reintroduction path
- Current local note: public bundle export omits arbitrary rules, workflows, skills, and mode-rules file contents; legacy settings export remains unchanged in [`exportSettings`](src/core/config/importExport.ts:731) and hardening applies through [`exportEnvironmentBundle()`](src/core/config/importExport.ts:765)
- Current local note: regression coverage in [`src/core/config/importExport.spec.ts`](src/core/config/importExport.spec.ts:1) still passes with 1 file / 11 tests after the import-side fix
- Current local note: this Carbon Memory refresh started no servers and no build artifact was produced in this work loop
- Current local note: [`CHANGELOG.md`](CHANGELOG.md) remains intentionally unchanged; release-note coverage should go through a changeset or normal release tooling
- Next action: if release packaging is required, run the repository build entrypoint [`pnpm build`](package.json:16) from the workspace root in a command-capable session
