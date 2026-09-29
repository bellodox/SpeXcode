import { claudeCodeDefaultModelId, claudeCodeModels, normalizeClaudeCodeModelId } from "./claude-code.js"
import { openAiCodexDefaultModelId, openAiCodexModels } from "./openai-codex.js"

describe("OpenAI Codex provider models", () => {
	test("uses the latest recommended GPT-6 Codex model by default", () => {
		expect(openAiCodexDefaultModelId).toBe("gpt-6-sol")
		expect(openAiCodexModels[openAiCodexDefaultModelId]).toMatchObject({
			contextWindow: 1_000_000,
			supportsNativeTools: true,
			defaultToolProtocol: "native",
			reasoningEffort: "medium",
		})
	})

	test("includes current GPT-6 Codex models with subscription pricing", () => {
		for (const modelId of ["gpt-6-astra", "gpt-6-sol", "gpt-6-luna"] as const) {
			expect(openAiCodexModels[modelId]).toMatchObject({
				inputPrice: 0,
				outputPrice: 0,
				supportsTemperature: false,
				supportsReasoningEffort: ["low", "medium", "high", "xhigh"],
			})
		}
	})

	test("keeps retiring ChatGPT-authenticated Codex models as deprecated for compatibility", () => {
		for (const modelId of ["gpt-5.5", "gpt-5.4", "gpt-5.3-codex", "gpt-5.2-codex", "gpt-5.2"] as const) {
			expect(openAiCodexModels[modelId]).toMatchObject({
				deprecated: true,
			})
			expect(openAiCodexModels[modelId].banner).toBeTruthy()
		}
	})
})

describe("Claude Code provider models", () => {
	test("uses Sonnet 5.5 as the default Claude Code model", () => {
		expect(claudeCodeDefaultModelId).toBe("claude-sonnet-5-5")
		expect(claudeCodeModels[claudeCodeDefaultModelId]).toMatchObject({
			supportsNativeTools: true,
			defaultToolProtocol: "native",
			reasoningEffort: "medium",
		})
	})

	test("includes current Claude Code model families", () => {
		for (const modelId of [
			"claude-fable-5-1",
			"claude-fable-5",
			"claude-opus-5-5",
			"claude-sonnet-5-5",
			"claude-opus-5",
			"claude-sonnet-5",
			"claude-opus-4-8",
		] as const) {
			expect(claudeCodeModels[modelId]).toMatchObject({
				supportsPromptCache: true,
				supportsReasoningEffort: ["disable", "low", "medium", "high", "xhigh"],
			})
		}
	})

	test("normalizes aliases and legacy dated Claude IDs to current Claude Code families", () => {
		expect(normalizeClaudeCodeModelId("sonnet")).toBe("claude-sonnet-5-5")
		expect(normalizeClaudeCodeModelId("opus")).toBe("claude-opus-5-5")
		expect(normalizeClaudeCodeModelId("fable")).toBe("claude-fable-5-1")
		expect(normalizeClaudeCodeModelId("haiku")).toBe("claude-haiku-4-5")
		expect(normalizeClaudeCodeModelId("claude-3-5-sonnet-20241022")).toBe("claude-sonnet-5-5")
		expect(normalizeClaudeCodeModelId("claude-opus-4-1-20250805")).toBe("claude-opus-5-5")
	})
})
