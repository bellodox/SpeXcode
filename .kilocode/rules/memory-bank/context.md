[Memory Bank: Active]

This file is local-only and noncanonical. Durable project facts belong in [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md).

Recent change: the user-facing cosmetic rebrand from Kilo Code to SpeXcode is complete across active docs, marketplace copy, runtime/UI branding, walkthroughs, and localizations. Live repository links now use `https://github.com/bellodox/SpeXcode`. Intentional retainers remain in place for compatibility and implementation stability, including extension IDs, publisher names, command/config keys, storage keys, package names, and `kilocode`-named implementation paths, plus historical changelog or upstream references.

Durable docs already updated in the code subtask include [`README.md`](README.md:1), [`marketplace-README.md`](marketplace-README.md:1), [`CONTRIBUTING.md`](CONTRIBUTING.md:1), [`DEVELOPMENT.md`](DEVELOPMENT.md:1), [`docs/maintainer-wiki/concept-carbon-memory.md`](docs/maintainer-wiki/concept-carbon-memory.md:1), and [`docs/maintainer-wiki/concept-architecture-overview.md`](docs/maintainer-wiki/concept-architecture-overview.md:1). This docs subtask adds the durable maintainer note in [`docs/maintainer-wiki/log.md`](docs/maintainer-wiki/log.md).

Validation proof from the completed code subtask: [`pnpm check-types`](package.json:13) succeeded with Turbo reporting 12 successful tasks out of 12 total, and focused [`webview-ui`](webview-ui) vitest for [`webview-ui/src/__tests__/ErrorBoundary.spec.tsx`](webview-ui/src/__tests__/ErrorBoundary.spec.tsx:1) passed with 2 tests passed. Temporary helper [`scripts/tmp_rebrand.py`](scripts/tmp_rebrand.py) was deleted after the rebrand pass.

Proof search from the completed code subtask found no remaining targeted old live URL matches in checked user-facing targets; remaining older naming is expected only for compatibility identifiers, implementation-path names, and historical or upstream references.

CHANGELOG status: [`CHANGELOG.md`](CHANGELOG.md) remains release-version structured without an Unreleased section, so no direct changelog edit was made in this docs subtask. The user-facing rebrand should instead be captured through the normal next release entry or release tooling.
