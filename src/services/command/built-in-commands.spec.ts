import { describe, expect, it } from "vitest"

import { getBuiltInCommand } from "./built-in-commands"

describe("built-in commands", () => {
	it("points init command mode-specific agent rules to .spexcode", async () => {
		const initCommand = await getBuiltInCommand("init")

		expect(initCommand?.content).toContain(".spexcode/rules-code/AGENTS.md")
		expect(initCommand?.content).toContain(".spexcode/rules-debug/AGENTS.md")
		expect(initCommand?.content).toContain(".spexcode/rules-ask/AGENTS.md")
		expect(initCommand?.content).toContain(".spexcode/rules-architect/AGENTS.md")
		expect(initCommand?.content).not.toContain(".kilocode/rules-code/AGENTS.md")
		expect(initCommand?.content).not.toContain(".kilocode/rules-debug/AGENTS.md")
		expect(initCommand?.content).not.toContain(".kilocode/rules-ask/AGENTS.md")
		expect(initCommand?.content).not.toContain(".kilocode/rules-architect/AGENTS.md")
	})
})
