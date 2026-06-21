# Workflows

## Build

- Install dependencies with `pnpm install` as documented in [`DEVELOPMENT.md`](DEVELOPMENT.md:64).
- Build the extension bundle with `pnpm build` from [`DEVELOPMENT.md`](DEVELOPMENT.md:180) and [`package.json`](package.json:16).

## Test and Quality Checks

- Run linting with `pnpm lint` from [`package.json`](package.json:12).
- Run type-checking with `pnpm check-types` from [`package.json`](package.json:13).
- Run tests with `pnpm test` from [`package.json`](package.json:14) and [`DEVELOPMENT.md`](DEVELOPMENT.md:209).

## Review and Contribution Flow

- Follow contribution guidance in [`CONTRIBUTING.md`](CONTRIBUTING.md).
- Use development workflow notes in [`DEVELOPMENT.md`](DEVELOPMENT.md:154).
- Pre-commit and pre-push behavior is managed by Husky as documented in [`DEVELOPMENT.md`](DEVELOPMENT.md:230).

## Documentation and Carbon Memory Updates

- Update the durable wiki in [`docs/maintainer-wiki/`](docs/maintainer-wiki/) before updating the volatile memory bank in [`.kilocode/rules/memory-bank/`](.kilocode/rules/memory-bank/).
- No repository `docs:check` script is currently defined in [`package.json`](package.json), so documentation validation is presently manual.
- When repository architecture or workflows change, refresh this wiki first and then synchronize short-lived context in the memory bank.
