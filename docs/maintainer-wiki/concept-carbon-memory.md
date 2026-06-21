# Concept: Carbon Memory

Carbon Memory is the repository memory model used by Kilo Code. It combines three layers:

1. The durable maintainer wiki in [`docs/maintainer-wiki/`](docs/maintainer-wiki/)
2. The local-only volatile memory bank in [`.kilocode/rules/memory-bank/`](.kilocode/rules/memory-bank/)
3. Indexed repository context sourced from files such as [`AGENTS.md`](AGENTS.md), [`CLAUDE.md`](CLAUDE.md), [`README.md`](README.md), and [`docs/maintainer-wiki/index.md`](docs/maintainer-wiki/index.md)

The wiki is canonical and should be initialized before the volatile memory bank. The memory bank exists to summarize active context and point back to durable documentation, not to replace it.

Commands such as `Initialize carbon memory.` and `Update carbon memory.` should route through the Understand Anything workflow described in [`C:/Users/VSCode/.kilocode/rules/wiki-and-memory-bank-init.md`](C:/Users/VSCode/.kilocode/rules/wiki-and-memory-bank-init.md). Codebase analysis should happen before updating either durable or volatile Carbon Memory layers.
