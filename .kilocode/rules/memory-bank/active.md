[Memory Bank: Active]

This file is local-only and noncanonical.

- Priority: keep volatile memory aligned with [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md)
- Current local note: public environment bundle export in [`src/core/config/importExport.ts`](src/core/config/importExport.ts:1) now omits secret-bearing content by default during bundle serialization
- Current local note: hardening centers on [`sanitizeProviderProfilesForBundleExport()`](src/core/config/importExport.ts:181), [`sanitizeGlobalSettingsForBundleExport()`](src/core/config/importExport.ts:193), [`sanitizeMcpConfigForBundleExport()`](src/core/config/importExport.ts:201), [`collectBundleFilesFromDirectory()`](src/core/config/importExport.ts:409), and [`buildEnvironmentBundle()`](src/core/config/importExport.ts:474)
- Current local note: provider/global settings sanitization uses [`isSecretStateKey()`](packages/types/src/global-settings.ts:336); MCP sanitization removes fields like `env`, authorization-like headers, `clientSecret`, `apiKey`, `token`, `password`, and similar secret-key patterns while preserving safe config fields
- Current local note: public bundle export omits arbitrary rules, workflows, skills, and mode-rules file contents; legacy settings export remains unchanged in [`exportSettings`](src/core/config/importExport.ts:666) and hardening applies through [`exportEnvironmentBundle`](src/core/config/importExport.ts:700)
- Current local note: regression coverage in [`src/core/config/importExport.spec.ts`](src/core/config/importExport.spec.ts:1) now covers provider secret stripping, MCP secret removal with safe field preservation, and omission of rule/workflow/skill content
- Current local note: validation proof is `pnpm test core/config/importExport.spec.ts` with 1 file / 9 tests plus successful `pnpm check-types` from [`src/package.json`](src/package.json:1)
- Current local note: this docs-only Carbon Memory refresh started no servers
- Current local note: [`CHANGELOG.md`](CHANGELOG.md) remains intentionally unchanged; release-note coverage should go through a changeset or normal release tooling
- Next action: verify a user-facing changeset exists for the hardened environment bundle export feature and add one if missing while keeping Carbon Memory aligned
