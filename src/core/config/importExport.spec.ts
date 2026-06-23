import * as path from "path"

import { describe, expect, it } from "vitest"

import {
	resolveBundleTargetPath,
	sanitizeBundleFileContentForExport,
	sanitizeGlobalSettingsForBundleExport,
	sanitizeProviderProfilesForBundleExport,
	validateBundleRelativePath,
} from "./importExport"

describe("importExport bundle helpers", () => {
	it("validates safe relative bundle paths", () => {
		expect(validateBundleRelativePath("global/skills/example-skill/SKILL.md")).toBe(
			"global/skills/example-skill/SKILL.md",
		)
	})

	it("rejects traversal and absolute bundle paths", () => {
		expect(() => validateBundleRelativePath("../evil.txt")).toThrow(/invalid segments/i)
		expect(() => validateBundleRelativePath("global/skills/../evil.txt")).toThrow(/invalid segments/i)
		expect(() => validateBundleRelativePath("/absolute/path.txt")).toThrow(/must be relative/i)
	})

	it("resolves global and project bundle targets", () => {
		const roots = {
			workspacePath: "/workspace/project",
			globalSettingsPath: "/global/settings",
			globalConfigPath: "/global/.kilocode",
		}

		expect(resolveBundleTargetPath("global/mcp.json", roots)).toBe(
			path.join("/global/settings", "mcp_settings.json"),
		)
		expect(resolveBundleTargetPath("project/rules/test.md", roots)).toBe(
			path.join("/workspace/project", ".kilocode", "rules", "test.md"),
		)
		expect(resolveBundleTargetPath("global/skills/example-skill/SKILL.md", roots)).toBe(
			path.join("/global/.kilocode", "skills", "example-skill", "SKILL.md"),
		)
		expect(resolveBundleTargetPath("project/mode-rules/rules-code/test.md", roots)).toBe(
			path.join("/workspace/project", ".kilocode", "rules-code", "test.md"),
		)
	})

	it("rejects empty bundle paths", () => {
		expect(() => validateBundleRelativePath("")).toThrow(/cannot be empty/i)
		expect(() => validateBundleRelativePath("   ")).toThrow(/cannot be empty/i)
	})

	it("rejects unsupported bundle path categories", () => {
		const roots = {
			workspacePath: "/workspace/project",
			globalSettingsPath: "/global/settings",
			globalConfigPath: "/global/.kilocode",
		}

		expect(() => resolveBundleTargetPath("global/unknown/test.md", roots)).toThrow(/unsupported.*category/i)
		expect(() => resolveBundleTargetPath("invalid-scope/rules/test.md", roots)).toThrow(/unsupported.*path/i)
	})

	it("requires a workspace for project-scoped bundle entries", () => {
		expect(() =>
			resolveBundleTargetPath("project/workflows/test.md", {
				workspacePath: undefined,
				globalSettingsPath: "/global/settings",
				globalConfigPath: "/global/.kilocode",
			}),
		).toThrow(/open workspace/i)
	})

	it("omits provider and global setting secrets from bundle settings export", () => {
		const sanitizedProfiles = sanitizeProviderProfilesForBundleExport({
			currentApiConfigName: "default",
			apiConfigs: {
				default: {
					id: "profile-1",
					apiProvider: "openrouter",
					openRouterApiKey: "secret-key",
					openRouterModelId: "openai/gpt-4o",
					openAiHeaders: {
						Authorization: "Bearer profile-token",
					},
				},
			},
			modeApiConfigs: {
				code: "profile-1",
			},
		})

		expect(sanitizedProfiles.apiConfigs.default.openRouterApiKey).toBeUndefined()
		expect(sanitizedProfiles.apiConfigs.default.openRouterModelId).toBe("openai/gpt-4o")
		expect(sanitizedProfiles.apiConfigs.default.openAiHeaders).toEqual({ "X-Trace-Id": "trace-123" })

		const sanitizedGlobalSettings = sanitizeGlobalSettingsForBundleExport({
			openRouterImageApiKey: "image-secret",
			kiloCodeImageApiKey: "kilo-secret",
			enableCheckpoints: true,
		})

		expect(sanitizedGlobalSettings).toEqual({ enableCheckpoints: true })
	})

	it("omits provider authorization-style headers from bundle settings export", () => {
		const sanitizedProfiles = sanitizeProviderProfilesForBundleExport({
			currentApiConfigName: "default",
			apiConfigs: {
				default: {
					id: "profile-1",
					apiProvider: "openai-compatible",
					openAiHeaders: {
						Authorization: "Bearer profile-token",
						"X-API-Key": "secret-api-key",
						"X-Trace-Id": "trace-123",
					},
				},
			},
			modeApiConfigs: {},
		})

		expect(sanitizedProfiles.apiConfigs.default.openAiHeaders).toEqual({ "X-Trace-Id": "trace-123" })
	})

	it("sanitizes MCP config content while preserving safe fields", () => {
		const sanitizedMcpContent = sanitizeBundleFileContentForExport(
			"global/mcp.json",
			JSON.stringify({
				mcpServers: {
					github: {
						type: "stdio",
						command: "npx",
						args: ["-y", "server-github"],
						url: "https://example.com/mcp",
						timeout: 30,
						disabled: false,
						alwaysAllow: ["list_issues"],
						disabledTools: ["delete_repo"],
						watchPaths: ["src"],
						env: { GITHUB_TOKEN: "secret-token" },
						headers: {
							Authorization: "Bearer top-secret",
							"X-Trace-Id": "trace-123",
						},
						oauth: {
							clientId: "public-client",
							clientSecret: "private-client-secret",
						},
						apiKey: "server-secret",
					},
				},
			}),
		)

		const parsedSanitizedMcpContent = JSON.parse(sanitizedMcpContent!)
		expect(parsedSanitizedMcpContent).toEqual({
			mcpServers: {
				github: {
					type: "stdio",
					command: "npx",
					args: ["-y", "server-github"],
					url: "https://example.com/mcp",
					timeout: 30,
					disabled: false,
					alwaysAllow: ["list_issues"],
					disabledTools: ["delete_repo"],
					watchPaths: ["src"],
					headers: {
						"X-Trace-Id": "trace-123",
					},
					oauth: {
						clientId: "public-client",
					},
				},
			},
		})
	})

	it("omits arbitrary rule workflow and skill file contents from public bundle export", () => {
		expect(
			sanitizeBundleFileContentForExport(
				"project/rules/private-rule.md",
				"API_KEY=sk-live-1234567890\nUse this secret carefully",
			),
		).toBeUndefined()

		expect(
			sanitizeBundleFileContentForExport(
				"global/skills/example-skill/SKILL.md",
				"Authorization: Bearer secret-token",
			),
		).toBeUndefined()
	})
})
