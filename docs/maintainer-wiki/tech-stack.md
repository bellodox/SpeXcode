# Tech Stack

## Workspace and Build Orchestration

- **Monorepo package manager:** `pnpm@10.8.1` from [`package.json`](package.json:3)
- **Workspace layout:** pnpm workspace packages declared in [`pnpm-workspace.yaml`](pnpm-workspace.yaml:1)
- **Task runner:** Turbo from [`package.json`](package.json:57) with task graph in [`turbo.json`](turbo.json:3)

## Runtime and Language Baseline

- **Node.js target:** `20.20.0` from [`package.json`](package.json:5)
- **Primary language:** TypeScript, evidenced by workspace structure and [`package.json`](package.json:58)
- **Frontend stack:** React-based UI in [`webview-ui/`](webview-ui)

## Quality and Tooling

- **Linting:** ESLint from [`package.json`](package.json:46) and root script [`package.json`](package.json:12)
- **Formatting:** Prettier from [`package.json`](package.json:54) and root script [`package.json`](package.json:15)
- **Type checking:** TypeScript plus Turbo task from [`package.json`](package.json:13)
- **Testing:** workspace-wide Turbo test task from [`package.json`](package.json:14)
- **Hooks:** Husky from [`package.json`](package.json:48) and workflow notes in [`DEVELOPMENT.md`](DEVELOPMENT.md:230)

## Distribution and Packaging

- **VS Code extension packaging:** [`@vscode/vsce`](package.json:44) and root build script [`package.json`](package.json:16)
- **Open VSX publishing support:** [`ovsx`](package.json:53)
- **Repository shape after pruning:** VS Code-extension-only monorepo with JetBrains, apps, and standalone agent-runtime surfaces removed from the active build graph; follow-up notes live in [`docs/maintainer-wiki/log.md`](docs/maintainer-wiki/log.md:8)
- **Validated build/install state after cleanup:** [`pnpm check-types`](package.json:13) completed successfully with Turbo reporting 12/12 tasks, [`pnpm vsix`](package.json:16) produced [`bin/kilo-code-5.12.0.vsix`](bin/kilo-code-5.12.0.vsix), and [`code --install-extension`](bin/kilo-code-5.12.0.vsix) succeeded for that artifact

## Product Surfaces

- **VS Code extension core:** [`src/`](src)
- **Webview frontend:** [`webview-ui/`](webview-ui)
- **Shared packages:** retained extension-facing workspaces under [`packages/`](packages)
- **Removed surfaces:** [`apps/`](apps), [`jetbrains/`](jetbrains), [`packages/evals/`](packages/evals), and [`packages/agent-runtime/`](packages/agent-runtime) are historical/removed surfaces, not active product targets
