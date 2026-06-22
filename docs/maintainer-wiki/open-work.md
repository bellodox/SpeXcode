# Open Work

- Verify whether a repo-specific documentation validation command such as `docs:check` should be added to [`package.json`](package.json).
- Audit and remove remaining JetBrains-specific runtime/code references, especially commit-message and autocomplete bridge paths in [`src/services/commit-message/CommitMessageProvider.ts`](src/services/commit-message/CommitMessageProvider.ts:11), [`src/services/autocomplete/AutocompleteJetbrainsBridge.ts`](src/services/autocomplete/AutocompleteJetbrainsBridge.ts:13), and wrapper metadata in [`src/shared/kilocode/wrapper.ts`](src/shared/kilocode/wrapper.ts:80).
- Audit and remove stale `agent-runtime` references in retained extension code and docs, especially [`src/core/kilocode/agent-manager/RuntimeProcessHandler.ts`](src/core/kilocode/agent-manager/RuntimeProcessHandler.ts:1), [`AGENTS.md`](AGENTS.md:20), and [`docs/file-locations.md`](docs/file-locations.md:35).
- Remove deleted-surface build leftovers from the retained webview toolchain, especially nightly output logic in [`webview-ui/vite.config.ts`](webview-ui/vite.config.ts:83) and [`webview-ui/src/vite-plugins/sourcemapPlugin.ts`](webview-ui/src/vite-plugins/sourcemapPlugin.ts:24).
- Add workflow notes for maintaining Carbon Memory alongside repository changes.
