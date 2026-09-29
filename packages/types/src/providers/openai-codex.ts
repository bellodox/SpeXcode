import type { ModelInfo } from "../model.js"

/**
 * OpenAI Codex Provider
 *
 * This provider uses OAuth authentication via ChatGPT Plus/Pro subscription
 * instead of direct API keys. Requests are routed to the Codex backend at
 * https://chatgpt.com/backend-api/codex/responses
 *
 * Key differences from openai-native:
 * - Uses OAuth Bearer tokens instead of API keys
 * - Subscription-based pricing (no per-token costs)
 * - Limited model subset available
 * - Custom routing to Codex backend
 */

export type OpenAiCodexModelId = keyof typeof openAiCodexModels

export const openAiCodexDefaultModelId: OpenAiCodexModelId = "gpt-6-sol"

const OPENAI_CODEX_NATIVE_TOOLS = {
	supportsNativeTools: true,
	defaultToolProtocol: "native",
	includedTools: ["apply_patch"],
	excludedTools: ["apply_diff", "write_to_file"],
} as const satisfies Pick<ModelInfo, "supportsNativeTools" | "defaultToolProtocol" | "includedTools" | "excludedTools">

const OPENAI_CODEX_SUBSCRIPTION_PRICING = {
	inputPrice: 0,
	outputPrice: 0,
} as const satisfies Pick<ModelInfo, "inputPrice" | "outputPrice">

const OPENAI_CODEX_DEPRECATED_BANNER =
	"This model is deprecated for ChatGPT-authenticated Codex. Prefer GPT-6 Sol for complex coding workflows or GPT-6 Luna for efficient focused tasks."

/**
 * Models available through the Codex OAuth flow.
 * These models are accessible to ChatGPT Plus/Pro subscribers.
 * Costs are 0 as they are covered by the subscription.
 */
export const openAiCodexModels = {
	"gpt-6-astra": {
		maxTokens: 128000,
		contextWindow: 1000000,
		...OPENAI_CODEX_NATIVE_TOOLS,
		supportsImages: true,
		supportsPromptCache: true,
		supportsReasoningEffort: ["low", "medium", "high", "xhigh"],
		reasoningEffort: "low",
		...OPENAI_CODEX_SUBSCRIPTION_PRICING,
		supportsTemperature: false,
		description: "GPT-6 Astra: OpenAI's strongest Codex model for the hardest end-to-end coding work",
	},
	"gpt-6-sol": {
		maxTokens: 128000,
		contextWindow: 1000000,
		...OPENAI_CODEX_NATIVE_TOOLS,
		supportsImages: true,
		supportsPromptCache: true,
		supportsReasoningEffort: ["low", "medium", "high", "xhigh"],
		reasoningEffort: "medium",
		...OPENAI_CODEX_SUBSCRIPTION_PRICING,
		supportsTemperature: false,
		description: "GPT-6 Sol: OpenAI's recommended Codex model for complex coding and agentic workflows",
	},
	"gpt-6-luna": {
		maxTokens: 128000,
		contextWindow: 400000,
		...OPENAI_CODEX_NATIVE_TOOLS,
		supportsImages: true,
		supportsPromptCache: true,
		supportsReasoningEffort: ["low", "medium", "high", "xhigh"],
		reasoningEffort: "low",
		...OPENAI_CODEX_SUBSCRIPTION_PRICING,
		supportsTemperature: false,
		description: "GPT-6 Luna: OpenAI's efficient Codex model for focused, high-volume coding tasks",
	},
	"gpt-5.5": {
		maxTokens: 128000,
		contextWindow: 1000000,
		...OPENAI_CODEX_NATIVE_TOOLS,
		supportsImages: true,
		supportsPromptCache: true,
		supportsReasoningEffort: ["low", "medium", "high", "xhigh"],
		reasoningEffort: "medium",
		...OPENAI_CODEX_SUBSCRIPTION_PRICING,
		supportsTemperature: false,
		deprecated: true,
		banner: "GPT-5.5 retires from ChatGPT-authenticated Codex on 2026-10-14. Prefer GPT-6 Sol where available.",
		description: "GPT-5.5: Frontier model for agentic coding via ChatGPT subscription",
	},
	"gpt-5.1-codex-max": {
		maxTokens: 128000,
		contextWindow: 400000,
		supportsNativeTools: true,
		defaultToolProtocol: "native",
		includedTools: ["apply_patch"],
		excludedTools: ["apply_diff", "write_to_file"],
		supportsImages: true,
		supportsPromptCache: true,
		supportsReasoningEffort: ["low", "medium", "high", "xhigh"],
		reasoningEffort: "xhigh",
		// Subscription-based: no per-token costs
		inputPrice: 0,
		outputPrice: 0,
		supportsTemperature: false,
		description: "GPT-5.1 Codex Max: Maximum capability coding model via ChatGPT subscription",
	},
	"gpt-5.1-codex": {
		maxTokens: 128000,
		contextWindow: 400000,
		supportsNativeTools: true,
		defaultToolProtocol: "native",
		includedTools: ["apply_patch"],
		excludedTools: ["apply_diff", "write_to_file"],
		supportsImages: true,
		supportsPromptCache: true,
		supportsReasoningEffort: ["low", "medium", "high"],
		reasoningEffort: "medium",
		// Subscription-based: no per-token costs
		inputPrice: 0,
		outputPrice: 0,
		supportsTemperature: false,
		description: "GPT-5.1 Codex: GPT-5.1 optimized for agentic coding via ChatGPT subscription",
	},
	"gpt-5.4": {
		maxTokens: 128000,
		contextWindow: 1000000,
		...OPENAI_CODEX_NATIVE_TOOLS,
		supportsImages: true,
		supportsPromptCache: true,
		supportsReasoningEffort: ["low", "medium", "high", "xhigh"],
		reasoningEffort: "medium",
		...OPENAI_CODEX_SUBSCRIPTION_PRICING,
		supportsTemperature: false,
		deprecated: true,
		banner: "GPT-5.4 retired from ChatGPT-authenticated Codex on 2026-08-31. Prefer GPT-6 Sol where available.",
		description: "GPT-5.4: Flagship coding model via ChatGPT subscription",
	},
	"gpt-5.3-codex": {
		maxTokens: 128000,
		contextWindow: 400000,
		...OPENAI_CODEX_NATIVE_TOOLS,
		supportsImages: true,
		supportsPromptCache: true,
		supportsReasoningEffort: ["low", "medium", "high", "xhigh"],
		reasoningEffort: "medium",
		...OPENAI_CODEX_SUBSCRIPTION_PRICING,
		supportsTemperature: false,
		deprecated: true,
		banner: OPENAI_CODEX_DEPRECATED_BANNER,
		description: "GPT-5.3 Codex: Flagship coding model via ChatGPT subscription",
	},
	"gpt-5.2-codex": {
		maxTokens: 128000,
		contextWindow: 400000,
		...OPENAI_CODEX_NATIVE_TOOLS,
		supportsImages: true,
		supportsPromptCache: true,
		supportsReasoningEffort: ["low", "medium", "high", "xhigh"],
		reasoningEffort: "medium",
		...OPENAI_CODEX_SUBSCRIPTION_PRICING,
		supportsTemperature: false,
		deprecated: true,
		banner: OPENAI_CODEX_DEPRECATED_BANNER,
		description: "GPT-5.2 Codex: Flagship coding model via ChatGPT subscription",
	},
	"gpt-5.1": {
		maxTokens: 128000,
		contextWindow: 400000,
		supportsNativeTools: true,
		defaultToolProtocol: "native",
		includedTools: ["apply_patch"],
		excludedTools: ["apply_diff", "write_to_file"],
		supportsImages: true,
		supportsPromptCache: true,
		supportsReasoningEffort: ["none", "low", "medium", "high"],
		reasoningEffort: "medium",
		// Subscription-based: no per-token costs
		inputPrice: 0,
		outputPrice: 0,
		supportsVerbosity: true,
		supportsTemperature: false,
		description: "GPT-5.1: General GPT-5.1 model via ChatGPT subscription",
	},
	"gpt-5": {
		maxTokens: 128000,
		contextWindow: 400000,
		supportsNativeTools: true,
		defaultToolProtocol: "native",
		includedTools: ["apply_patch"],
		excludedTools: ["apply_diff", "write_to_file"],
		supportsImages: true,
		supportsPromptCache: true,
		supportsReasoningEffort: ["minimal", "low", "medium", "high"],
		reasoningEffort: "medium",
		// Subscription-based: no per-token costs
		inputPrice: 0,
		outputPrice: 0,
		supportsVerbosity: true,
		supportsTemperature: false,
		description: "GPT-5: General GPT-5 model via ChatGPT subscription",
	},
	"gpt-5-codex": {
		maxTokens: 128000,
		contextWindow: 400000,
		supportsNativeTools: true,
		defaultToolProtocol: "native",
		includedTools: ["apply_patch"],
		excludedTools: ["apply_diff", "write_to_file"],
		supportsImages: true,
		supportsPromptCache: true,
		supportsReasoningEffort: ["low", "medium", "high"],
		reasoningEffort: "medium",
		// Subscription-based: no per-token costs
		inputPrice: 0,
		outputPrice: 0,
		supportsTemperature: false,
		description: "GPT-5 Codex: GPT-5 optimized for agentic coding via ChatGPT subscription",
	},
	"gpt-5-codex-mini": {
		maxTokens: 128000,
		contextWindow: 400000,
		supportsNativeTools: true,
		defaultToolProtocol: "native",
		includedTools: ["apply_patch"],
		excludedTools: ["apply_diff", "write_to_file"],
		supportsImages: true,
		supportsPromptCache: true,
		supportsReasoningEffort: ["low", "medium", "high"],
		reasoningEffort: "medium",
		// Subscription-based: no per-token costs
		inputPrice: 0,
		outputPrice: 0,
		supportsTemperature: false,
		description: "GPT-5 Codex Mini: Faster coding model via ChatGPT subscription",
	},
	"gpt-5.1-codex-mini": {
		maxTokens: 128000,
		contextWindow: 400000,
		supportsNativeTools: true,
		defaultToolProtocol: "native",
		includedTools: ["apply_patch"],
		excludedTools: ["apply_diff", "write_to_file"],
		supportsImages: true,
		supportsPromptCache: true,
		supportsReasoningEffort: ["low", "medium", "high"],
		reasoningEffort: "medium",
		inputPrice: 0,
		outputPrice: 0,
		supportsTemperature: false,
		description: "GPT-5.1 Codex Mini: Faster version for coding tasks via ChatGPT subscription",
	},
	"gpt-5.2": {
		maxTokens: 128000,
		contextWindow: 400000,
		...OPENAI_CODEX_NATIVE_TOOLS,
		supportsImages: true,
		supportsPromptCache: true,
		supportsReasoningEffort: ["none", "low", "medium", "high", "xhigh"],
		reasoningEffort: "medium",
		...OPENAI_CODEX_SUBSCRIPTION_PRICING,
		supportsTemperature: false,
		deprecated: true,
		banner: OPENAI_CODEX_DEPRECATED_BANNER,
		description: "GPT-5.2: GPT model via ChatGPT subscription",
	},
} as const satisfies Record<string, ModelInfo>
