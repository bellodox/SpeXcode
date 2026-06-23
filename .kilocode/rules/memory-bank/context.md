[Memory Bank: Active]

This file is local-only and noncanonical. Durable project facts belong in [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md).

Recent change: Carbon Memory was refreshed after the bundle export hardening follow-up for extension-native SpeXcode environment bundles. Main hardening landed in [`src/core/config/importExport.ts`](src/core/config/importExport.ts:1) through [`sanitizeProviderProfilesForBundleExport()`](src/core/config/importExport.ts:181), [`sanitizeGlobalSettingsForBundleExport()`](src/core/config/importExport.ts:193), [`sanitizeMcpConfigForBundleExport()`](src/core/config/importExport.ts:201), [`collectBundleFilesFromDirectory()`](src/core/config/importExport.ts:409), and [`buildEnvironmentBundle()`](src/core/config/importExport.ts:474).

Current local security note: public environment bundle export now omits secret-bearing content by default. Provider/global settings sanitization uses [`isSecretStateKey()`](packages/types/src/global-settings.ts:336) to strip secret-state fields before bundle serialization. MCP config export is structurally sanitized to remove secret-bearing fields such as `env`, authorization-like headers, `clientSecret`, `apiKey`, `token`, `password`, and similar secret-key patterns while preserving safe configuration fields.

Current local export-scope note: public bundle export now omits arbitrary rules, workflows, skills, and mode-rules file contents instead of exporting raw prose or code that may contain secrets. Legacy settings export remains unchanged in [`exportSettings`](src/core/config/importExport.ts:666); hardening applies to environment bundle export through [`exportEnvironmentBundle`](src/core/config/importExport.ts:700).

Test coverage was extended in [`src/core/config/importExport.spec.ts`](src/core/config/importExport.spec.ts:1) to cover provider secret stripping, MCP secret removal with safe field preservation, and omission of rule/workflow/skill content.

Validation proof from [`src/package.json`](src/package.json:1): `pnpm test core/config/importExport.spec.ts` passed with 1 file / 9 tests, and `pnpm check-types` passed. This docs-only Carbon Memory update started no servers.

Release-note status: this remains a user-facing feature and likely needs coverage through a changeset if not already present; do not edit [`CHANGELOG.md`](CHANGELOG.md) directly unless release practice explicitly requires it.
