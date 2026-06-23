import { safeWriteJson } from "../../utils/safeWriteJson"
import os from "os"
import * as path from "path"
import fs from "fs/promises"

import * as vscode from "vscode"
import { z, ZodError } from "zod"

import { customModesSettingsSchema, globalSettingsSchema, isSecretStateKey } from "@roo-code/types"
import { TelemetryService } from "@roo-code/telemetry"
import * as yaml from "yaml" // kilocode_change

import { ProviderSettingsManager, providerProfilesSchema } from "./ProviderSettingsManager"
import { ContextProxy } from "./ContextProxy"
import { CustomModesManager } from "./CustomModesManager"
import { t } from "../../i18n"
import { GlobalFileNames } from "../../shared/globalFileNames" // kilocode_change
import { getWorkspacePath } from "../../utils/path" // kilocode_change
import { getSettingsDirectoryPath } from "../../utils/storage" // kilocode_change
import { getGlobalRooDirectory } from "../../services/roo-config" // kilocode_change

export type ImportOptions = {
	providerSettingsManager: ProviderSettingsManager
	contextProxy: ContextProxy
	customModesManager: CustomModesManager
}

type ExportOptions = {
	providerSettingsManager: ProviderSettingsManager
	contextProxy: ContextProxy
}
type ImportWithProviderOptions = ImportOptions & {
	provider: {
		settingsImportedAt?: number
		postStateToWebview: () => Promise<void>
		postRulesDataToWebview?: () => Promise<void>
		postSkillsDataToWebview?: () => Promise<void>
		getMcpHub?: () => { refreshAllConnections: () => Promise<void> } | undefined
	}
}

// kilocode_change start
const ENVIRONMENT_BUNDLE_FORMAT = "spexcode-environment-bundle"
const ENVIRONMENT_BUNDLE_VERSION = 1

const legacySettingsSchema = z.object({
	providerProfiles: providerProfilesSchema,
	globalSettings: globalSettingsSchema.optional(),
})

const environmentBundleFileEntrySchema = z.object({
	path: z.string().min(1),
	content: z.string(),
})

const environmentBundleSchema = z.object({
	format: z.literal(ENVIRONMENT_BUNDLE_FORMAT),
	version: z.literal(ENVIRONMENT_BUNDLE_VERSION),
	settings: legacySettingsSchema,
	files: z.array(environmentBundleFileEntrySchema).default([]),
})

export type EnvironmentBundle = z.infer<typeof environmentBundleSchema>
export type EnvironmentBundleFileEntry = z.infer<typeof environmentBundleFileEntrySchema>
type ProviderProfiles = z.infer<typeof providerProfilesSchema>

type BundlePathRoots = {
	workspacePath?: string
	globalSettingsPath: string
	globalConfigPath: string
}

type ImportResult = {
	providerProfiles?: Awaited<ReturnType<ProviderSettingsManager["export"]>>
	globalSettings?: Record<string, unknown>
	success: boolean
	error?: string
	isBundle?: boolean
}

const MCP_SECRET_KEY_PATTERN =
	/(?:^|[-_])(api[-_]?key|auth(?:orization)?|client[-_]?secret|password|secret|token)(?:$|[-_])/i
const MCP_SAFE_ROOT_KEYS = new Set([
	"mcpServers",
	"inputs",
	"servers",
	"type",
	"command",
	"args",
	"url",
	"timeout",
	"disabled",
	"alwaysAllow",
	"disabledTools",
	"watchPaths",
	"env",
	"headers",
	"oauth",
])
const MCP_SAFE_SERVER_KEYS = new Set([
	"type",
	"command",
	"args",
	"url",
	"timeout",
	"disabled",
	"alwaysAllow",
	"disabledTools",
	"watchPaths",
	"env",
	"headers",
	"oauth",
])

const AUTHORIZATION_HEADER_PATTERN = /^(authorization|proxy-authorization|x-api-key)$/i

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === "object" && value !== null && !Array.isArray(value)
}

function shouldRemoveMcpSecretKey(key: string): boolean {
	if (key === "env") {
		return true
	}

	return MCP_SECRET_KEY_PATTERN.test(key)
}

function sanitizeMcpHeaders(headers: unknown): Record<string, string> | undefined {
	if (!isPlainObject(headers)) {
		return undefined
	}

	const sanitizedHeaders = Object.fromEntries(
		Object.entries(headers).filter(([key, value]) => {
			if (typeof value !== "string") {
				return false
			}

			return !MCP_SECRET_KEY_PATTERN.test(key)
		}) as [string, string][],
	)

	return Object.keys(sanitizedHeaders).length > 0 ? sanitizedHeaders : undefined
}

function sanitizeProviderHeadersForBundleExport(headers: unknown): Record<string, string> | undefined {
	if (!isPlainObject(headers)) {
		return undefined
	}

	const sanitizedHeaders = Object.fromEntries(
		Object.entries(headers).filter(([key, value]) => {
			if (typeof value !== "string") {
				return false
			}

			return !AUTHORIZATION_HEADER_PATTERN.test(key) && !MCP_SECRET_KEY_PATTERN.test(key)
		}) as [string, string][],
	)

	return Object.keys(sanitizedHeaders).length > 0 ? sanitizedHeaders : undefined
}

function sanitizeMcpOauth(oauth: unknown): Record<string, unknown> | undefined {
	if (!isPlainObject(oauth)) {
		return undefined
	}

	const sanitizedOauth = Object.fromEntries(
		Object.entries(oauth).filter(([key, value]) => !shouldRemoveMcpSecretKey(key) && typeof value !== "undefined"),
	)

	return Object.keys(sanitizedOauth).length > 0 ? sanitizedOauth : undefined
}

function sanitizeMcpServerConfig(serverConfig: unknown): Record<string, unknown> | undefined {
	if (!isPlainObject(serverConfig)) {
		return undefined
	}

	const sanitizedServerConfig = Object.fromEntries(
		Object.entries(serverConfig)
			.filter(([key]) => MCP_SAFE_SERVER_KEYS.has(key) && !shouldRemoveMcpSecretKey(key))
			.map(([key, value]) => {
				if (key === "headers") {
					return [key, sanitizeMcpHeaders(value)]
				}

				if (key === "oauth") {
					return [key, sanitizeMcpOauth(value)]
				}

				return [key, value]
			})
			.filter(([, value]) => typeof value !== "undefined"),
	)

	return Object.keys(sanitizedServerConfig).length > 0 ? sanitizedServerConfig : undefined
}

export function sanitizeProviderProfilesForBundleExport(providerProfiles: ProviderProfiles): ProviderProfiles {
	return {
		...providerProfiles,
		apiConfigs: Object.fromEntries(
			Object.entries(providerProfiles.apiConfigs).map(([name, apiConfig]) => {
				const sanitizedApiConfig = Object.fromEntries(
					Object.entries(apiConfig)
						.filter(([key]) => !isSecretStateKey(key))
						.map(([key, value]) => {
							if (key === "openAiHeaders") {
								return [key, sanitizeProviderHeadersForBundleExport(value)]
							}

							return [key, value]
						})
						.filter(([, value]) => typeof value !== "undefined"),
				)

				return [name, sanitizedApiConfig]
			}),
		),
	}
}

export function sanitizeGlobalSettingsForBundleExport(globalSettings: Record<string, unknown> | undefined) {
	if (!globalSettings) {
		return globalSettings
	}

	return Object.fromEntries(Object.entries(globalSettings).filter(([key]) => !isSecretStateKey(key)))
}

export function sanitizeMcpConfigForBundleExport(mcpConfig: unknown): unknown {
	if (!isPlainObject(mcpConfig)) {
		return mcpConfig
	}

	return Object.fromEntries(
		Object.entries(mcpConfig)
			.filter(([key]) => MCP_SAFE_ROOT_KEYS.has(key) && !shouldRemoveMcpSecretKey(key))
			.map(([key, value]) => {
				if (key === "mcpServers" || key === "servers") {
					if (!isPlainObject(value)) {
						return [key, undefined]
					}

					const sanitizedServers = Object.fromEntries(
						Object.entries(value)
							.map(([serverName, serverConfig]) => [serverName, sanitizeMcpServerConfig(serverConfig)])
							.filter(([, serverConfig]) => typeof serverConfig !== "undefined"),
					)

					return [key, sanitizedServers]
				}

				if (key === "headers") {
					return [key, sanitizeMcpHeaders(value)]
				}

				if (key === "oauth") {
					return [key, sanitizeMcpOauth(value)]
				}

				return [key, value]
			})
			.filter(([, value]) => typeof value !== "undefined"),
	)
}

export function sanitizeBundleFileContentForExport(bundlePath: string, content: string): string | undefined {
	if (bundlePath === "global/mcp.json" || bundlePath === "project/mcp.json") {
		const sanitizedConfig = sanitizeMcpConfigForBundleExport(JSON.parse(content))
		return JSON.stringify(sanitizedConfig, null, 2)
	}

	if (
		bundlePath.includes("/rules/") ||
		bundlePath.includes("/workflows/") ||
		bundlePath.includes("/skills/") ||
		bundlePath.includes("/mode-rules/")
	) {
		return undefined
	}

	return content
}

export function validateBundleRelativePath(relativePath: string): string {
	const normalizedPath = relativePath.replace(/\\/g, "/").trim()

	if (!normalizedPath) {
		throw new Error("Bundle file path cannot be empty")
	}

	if (normalizedPath.startsWith("/") || path.isAbsolute(normalizedPath)) {
		throw new Error(`Bundle file path must be relative: ${relativePath}`)
	}

	const segments = normalizedPath.split("/")
	if (segments.some((segment) => !segment || segment === "." || segment === "..")) {
		throw new Error(`Bundle file path contains invalid segments: ${relativePath}`)
	}

	return segments.join("/")
}

export function resolveBundleTargetPath(relativePath: string, roots: BundlePathRoots): string {
	const normalizedPath = validateBundleRelativePath(relativePath)
	const [scope, category, ...restSegments] = normalizedPath.split("/")

	if ((scope !== "global" && scope !== "project") || !category) {
		throw new Error(`Unsupported bundle file path: ${relativePath}`)
	}

	if (scope === "project" && !roots.workspacePath) {
		throw new Error(`Cannot import project bundle entry without an open workspace: ${relativePath}`)
	}

	const scopeRoot = scope === "global" ? roots.globalConfigPath : roots.workspacePath!

	if (category === "mcp.json") {
		if (restSegments.length > 0) {
			throw new Error(`Unsupported MCP bundle file path: ${relativePath}`)
		}
		return scope === "global"
			? path.join(roots.globalSettingsPath, GlobalFileNames.mcpSettings)
			: path.join(scopeRoot, ".kilocode", "mcp.json")
	}

	if (restSegments.length === 0) {
		throw new Error(`Bundle file path is missing a filename: ${relativePath}`)
	}

	if (category === "rules") {
		return scope === "global"
			? path.join(scopeRoot, "rules", ...restSegments)
			: path.join(scopeRoot, ".kilocode", "rules", ...restSegments)
	}

	if (category === "workflows") {
		return scope === "global"
			? path.join(scopeRoot, "workflows", ...restSegments)
			: path.join(scopeRoot, ".kilocode", "workflows", ...restSegments)
	}

	if (category === "skills") {
		return scope === "global"
			? path.join(scopeRoot, "skills", ...restSegments)
			: path.join(scopeRoot, ".kilocode", "skills", ...restSegments)
	}

	if (category === "mode-rules") {
		return scope === "global"
			? path.join(scopeRoot, ...restSegments)
			: path.join(scopeRoot, ".kilocode", ...restSegments)
	}

	throw new Error(`Unsupported bundle file path category: ${relativePath}`)
}

async function importLegacySettingsData(
	data: z.infer<typeof legacySettingsSchema>,
	{ providerSettingsManager, contextProxy, customModesManager }: ImportOptions,
): Promise<ImportResult> {
	await assertCustomModeTargetsAreValid(data, customModesManager)

	const previousProviderProfiles = await providerSettingsManager.export()
	const { providerProfiles: newProviderProfiles, globalSettings = {} } = data

	const providerProfiles = {
		currentApiConfigName: newProviderProfiles.currentApiConfigName,
		apiConfigs: {
			...previousProviderProfiles.apiConfigs,
			...newProviderProfiles.apiConfigs,
		},
		modeApiConfigs: {
			...previousProviderProfiles.modeApiConfigs,
			...newProviderProfiles.modeApiConfigs,
		},
	}

	await Promise.all(
		(globalSettings.customModes ?? []).map((mode) => customModesManager.updateCustomMode(mode.slug, mode)),
	)

	await providerSettingsManager.import(providerProfiles)
	await contextProxy.setValues(globalSettings)

	const currentProviderName = providerProfiles.currentApiConfigName
	const currentProvider = providerProfiles.apiConfigs[currentProviderName]
	contextProxy.setValue("currentApiConfigName", currentProviderName)

	if (currentProvider) {
		contextProxy.setProviderSettings(currentProvider)
	}

	contextProxy.setValue("listApiConfigMeta", await providerSettingsManager.listConfig())

	return { providerProfiles, globalSettings, success: true, isBundle: false }
}

async function assertYamlFileIsValidIfPresent(filePath: string): Promise<void> {
	try {
		const fileContent = await fs.readFile(filePath, "utf-8")
		const parsedYaml = yaml.parse(fileContent)
		const validationResult = customModesSettingsSchema.safeParse(parsedYaml ?? {})
		if (!validationResult.success) {
			throw new Error(`Cannot overwrite invalid custom modes YAML at ${filePath}`)
		}
	} catch (error) {
		if ((error as NodeJS.ErrnoException).code === "ENOENT") {
			return
		}
		throw error
	}
}

async function assertCustomModeTargetsAreValid(
	data: z.infer<typeof legacySettingsSchema>,
	customModesManager: CustomModesManager,
): Promise<void> {
	const importedCustomModes = data.globalSettings?.customModes ?? []
	if (importedCustomModes.length === 0) {
		return
	}

	const hasGlobalModes = importedCustomModes.some((mode) => mode.source !== "project")
	const hasProjectModes = importedCustomModes.some((mode) => mode.source === "project")

	if (hasGlobalModes) {
		await assertYamlFileIsValidIfPresent(await customModesManager.getCustomModesFilePath())
	}

	if (hasProjectModes) {
		const workspacePath = getWorkspacePath()
		if (!workspacePath) {
			throw new Error("Cannot import project custom modes without an open workspace")
		}
		await assertYamlFileIsValidIfPresent(path.join(workspacePath, ".kilocodemodes"))
	}
}

async function collectBundleFilesFromDirectory(
	baseDirectoryPath: string,
	bundleBasePath: string,
): Promise<EnvironmentBundleFileEntry[]> {
	const entries = await fs.readdir(baseDirectoryPath, { withFileTypes: true })
	const collectedEntries: EnvironmentBundleFileEntry[] = []

	for (const entry of entries) {
		const absoluteEntryPath = path.join(baseDirectoryPath, entry.name)
		const bundleEntryPath = `${bundleBasePath}/${entry.name}`

		if (entry.isDirectory()) {
			collectedEntries.push(...(await collectBundleFilesFromDirectory(absoluteEntryPath, bundleEntryPath)))
			continue
		}

		if (!entry.isFile()) {
			continue
		}

		const validatedBundleEntryPath = validateBundleRelativePath(bundleEntryPath)
		const sanitizedContent = sanitizeBundleFileContentForExport(
			validatedBundleEntryPath,
			await fs.readFile(absoluteEntryPath, "utf-8"),
		)

		if (typeof sanitizedContent === "undefined") {
			continue
		}

		collectedEntries.push({
			path: validatedBundleEntryPath,
			content: sanitizedContent,
		})
	}

	return collectedEntries
}

async function maybeCollectBundleDirectory(
	baseDirectoryPath: string,
	bundleBasePath: string,
): Promise<EnvironmentBundleFileEntry[]> {
	try {
		const stats = await fs.stat(baseDirectoryPath)
		if (!stats.isDirectory()) {
			return []
		}
		return collectBundleFilesFromDirectory(baseDirectoryPath, bundleBasePath)
	} catch (error) {
		console.error(`Failed to collect bundle directory ${bundleBasePath}:`, error)
		return []
	}
}

async function maybeCollectBundleFile(
	sourceFilePath: string,
	bundlePath: string,
): Promise<EnvironmentBundleFileEntry[]> {
	try {
		const stats = await fs.stat(sourceFilePath)
		if (!stats.isFile()) {
			return []
		}

		const validatedBundlePath = validateBundleRelativePath(bundlePath)
		const sanitizedContent = sanitizeBundleFileContentForExport(
			validatedBundlePath,
			await fs.readFile(sourceFilePath, "utf-8"),
		)
		if (typeof sanitizedContent === "undefined") {
			return []
		}

		return [
			{
				path: validatedBundlePath,
				content: sanitizedContent,
			},
		]
	} catch (error) {
		console.error(`Failed to collect bundle file ${bundlePath}:`, error)
		return []
	}
}

async function buildEnvironmentBundle({
	providerSettingsManager,
	contextProxy,
}: ExportOptions): Promise<EnvironmentBundle | undefined> {
	const providerProfiles = await providerSettingsManager.export()
	const globalSettings = sanitizeGlobalSettingsForBundleExport(await contextProxy.export())

	if (typeof providerProfiles === "undefined") {
		return undefined
	}

	const sanitizedProviderProfiles = sanitizeProviderProfilesForBundleExport(providerProfiles)

	const workspacePath = getWorkspacePath()
	const globalSettingsPath = await getSettingsDirectoryPath(contextProxy.globalStorageUri.fsPath)
	const globalConfigPath = getGlobalRooDirectory()
	const files: EnvironmentBundleFileEntry[] = []

	files.push(
		...(await maybeCollectBundleFile(
			path.join(globalSettingsPath, GlobalFileNames.mcpSettings),
			"global/mcp.json",
		)),
		...(workspacePath
			? await maybeCollectBundleFile(path.join(workspacePath, ".kilocode", "mcp.json"), "project/mcp.json")
			: []),
	)

	files.push(
		...(await maybeCollectBundleDirectory(path.join(globalConfigPath, "rules"), "global/rules")),
		...(await maybeCollectBundleDirectory(path.join(globalConfigPath, "workflows"), "global/workflows")),
		...(await maybeCollectBundleDirectory(path.join(globalConfigPath, "skills"), "global/skills")),
	)

	if (workspacePath) {
		files.push(
			...(await maybeCollectBundleDirectory(path.join(workspacePath, ".kilocode", "rules"), "project/rules")),
			...(await maybeCollectBundleDirectory(
				path.join(workspacePath, ".kilocode", "workflows"),
				"project/workflows",
			)),
			...(await maybeCollectBundleDirectory(path.join(workspacePath, ".kilocode", "skills"), "project/skills")),
		)
	}

	for (const scope of ["global", "project"] as const) {
		const scopeRoot = scope === "global" ? globalConfigPath : workspacePath
		if (!scopeRoot) {
			continue
		}

		try {
			const rulesRoot = scope === "global" ? scopeRoot : path.join(scopeRoot, ".kilocode")
			const entries = await fs.readdir(rulesRoot, { withFileTypes: true })
			for (const entry of entries) {
				if (!entry.isDirectory() || !entry.name.startsWith("rules-")) {
					continue
				}

				files.push(
					...(await collectBundleFilesFromDirectory(
						path.join(rulesRoot, entry.name),
						`${scope}/mode-rules/${entry.name}`,
					)),
				)
			}
		} catch (error) {
			// Directory may not exist yet.
		}
	}

	return {
		format: ENVIRONMENT_BUNDLE_FORMAT,
		version: ENVIRONMENT_BUNDLE_VERSION,
		settings: { providerProfiles: sanitizedProviderProfiles, globalSettings },
		files: files.sort((leftEntry, rightEntry) => leftEntry.path.localeCompare(rightEntry.path)),
	}
}

async function importEnvironmentBundle(bundle: EnvironmentBundle, options: ImportOptions): Promise<ImportResult> {
	const legacyImportResult = await importLegacySettingsData(bundle.settings, options)
	const workspacePath = getWorkspacePath()
	const globalSettingsPath = await getSettingsDirectoryPath(options.contextProxy.globalStorageUri.fsPath)
	const roots: BundlePathRoots = {
		workspacePath,
		globalSettingsPath,
		globalConfigPath: getGlobalRooDirectory(),
	}

	for (const bundleFileEntry of bundle.files) {
		const targetPath = resolveBundleTargetPath(bundleFileEntry.path, roots)
		const targetDirectoryPath = path.dirname(targetPath)
		await fs.mkdir(targetDirectoryPath, { recursive: true })

		if (bundleFileEntry.path === "global/mcp.json" || bundleFileEntry.path === "project/mcp.json") {
			try {
				await fs.access(targetPath, fs.constants.F_OK)
				JSON.parse(await fs.readFile(targetPath, "utf-8"))
			} catch (error) {
				if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
					throw new Error(`Cannot overwrite invalid MCP JSON at ${targetPath}`)
				}
			}

			let parsedConfig: unknown
			try {
				parsedConfig = JSON.parse(bundleFileEntry.content)
			} catch (error) {
				throw new Error(`Invalid MCP JSON in bundle entry ${bundleFileEntry.path}`)
			}

			const sanitizedMcpConfig = sanitizeMcpConfigForBundleExport(parsedConfig)
			await safeWriteJson(targetPath, sanitizedMcpConfig)
			continue
		}

		await fs.writeFile(targetPath, bundleFileEntry.content, "utf-8")
	}

	return { ...legacyImportResult, isBundle: true }
}
// kilocode_change end

/**
 * Imports configuration from a specific file path
 * Shares base functionality for import settings for both the manual
 * and automatic settings importing
 */
export async function importSettingsFromPath(
	filePath: string,
	{ providerSettingsManager, contextProxy, customModesManager }: ImportOptions,
) {
	try {
		const parsedJson = JSON.parse(await fs.readFile(filePath, "utf-8"))

		if (parsedJson?.format === ENVIRONMENT_BUNDLE_FORMAT) {
			const bundle = environmentBundleSchema.parse(parsedJson)
			return await importEnvironmentBundle(bundle, {
				providerSettingsManager,
				contextProxy,
				customModesManager,
			})
		}

		return await importLegacySettingsData(legacySettingsSchema.parse(parsedJson), {
			providerSettingsManager,
			contextProxy,
			customModesManager,
		})
	} catch (e) {
		let error = "Unknown error"

		if (e instanceof ZodError) {
			error = e.issues.map((issue) => `[${issue.path.join(".")}]: ${issue.message}`).join("\n")
			TelemetryService.instance.captureSchemaValidationError({ schemaName: "ImportExport", error: e })
		} else if (e instanceof Error) {
			error = e.message
		}

		return { success: false, error }
	}
}

/**
 * Import settings from a file using a file dialog
 * @param options - Import options containing managers and proxy
 * @returns Promise resolving to import result
 */
export const importSettings = async ({ providerSettingsManager, contextProxy, customModesManager }: ImportOptions) => {
	const uris = await vscode.window.showOpenDialog({
		filters: { JSON: ["json"] },
		canSelectMany: false,
	})

	if (!uris) {
		return { success: false, error: "User cancelled file selection" }
	}

	return importSettingsFromPath(uris[0].fsPath, {
		providerSettingsManager,
		contextProxy,
		customModesManager,
	})
}

/**
 * Import settings from a specific file
 * @param options - Import options containing managers and proxy
 * @param fileUri - URI of the file to import from
 * @returns Promise resolving to import result
 */
export const importSettingsFromFile = async (
	{ providerSettingsManager, contextProxy, customModesManager }: ImportOptions,
	fileUri: vscode.Uri,
) => {
	return importSettingsFromPath(fileUri.fsPath, {
		providerSettingsManager,
		contextProxy,
		customModesManager,
	})
}

export const exportSettings = async ({ providerSettingsManager, contextProxy }: ExportOptions) => {
	const uri = await vscode.window.showSaveDialog({
		filters: { JSON: ["json"] },
		defaultUri: vscode.Uri.file(path.join(os.homedir(), "Documents", "kilo-code-settings.json")),
	})

	if (!uri) {
		return
	}

	try {
		const bundle = await buildEnvironmentBundle({ providerSettingsManager, contextProxy })

		// It's okay if there are no global settings, but if there are no
		// provider profile configured then don't export. If we wanted to
		// support this case then the `importSettings` function would need to
		// be updated to handle the case where there are no provider profiles.
		if (typeof bundle === "undefined") {
			return
		}

		// OpenAI Compatible settings are now correctly stored in codebaseIndexConfig
		// No workaround needed - they will be exported automatically with the config

		const dirname = path.dirname(uri.fsPath)
		await fs.mkdir(dirname, { recursive: true })
		await safeWriteJson(uri.fsPath, bundle.settings)
	} catch (e) {
		console.error("Failed to export settings:", e)
		// Don't re-throw - the UI will handle showing error messages
	}
}

// kilocode_change start
export const exportEnvironmentBundle = async ({ providerSettingsManager, contextProxy }: ExportOptions) => {
	const uri = await vscode.window.showSaveDialog({
		filters: { JSON: ["json"] },
		defaultUri: vscode.Uri.file(path.join(os.homedir(), "Documents", "spexcode-environment-bundle.json")),
	})

	if (!uri) {
		return
	}

	try {
		const bundle = await buildEnvironmentBundle({ providerSettingsManager, contextProxy })
		if (!bundle) {
			return
		}

		await fs.mkdir(path.dirname(uri.fsPath), { recursive: true })
		await safeWriteJson(uri.fsPath, bundle)
	} catch (error) {
		console.error("Failed to export environment bundle:", error)
	}
}
// kilocode_change end

/**
 * Import settings with complete UI feedback and provider state updates
 * @param options - Import options with provider instance
 * @param filePath - Optional file path to import from. If not provided, a file dialog will be shown.
 * @returns Promise that resolves when import is complete
 */
export const importSettingsWithFeedback = async (
	{ providerSettingsManager, contextProxy, customModesManager, provider }: ImportWithProviderOptions,
	filePath?: string,
) => {
	let result

	if (filePath) {
		// Validate file path and check if file exists
		try {
			// Check if file exists and is readable
			await fs.access(filePath, fs.constants.F_OK | fs.constants.R_OK)
			result = await importSettingsFromPath(filePath, {
				providerSettingsManager,
				contextProxy,
				customModesManager,
			})
		} catch (error) {
			result = {
				success: false,
				error: `Cannot access file at path "${filePath}": ${error instanceof Error ? error.message : "Unknown error"}`,
			}
		}
	} else {
		result = await importSettings({ providerSettingsManager, contextProxy, customModesManager })
	}

	if (result.success) {
		provider.settingsImportedAt = Date.now()
		if (result.isBundle) {
			await provider.getMcpHub?.()?.refreshAllConnections()
			await provider.postRulesDataToWebview?.()
			await provider.postSkillsDataToWebview?.()
		}
		await provider.postStateToWebview()
		await vscode.window.showInformationMessage(t("common:info.settings_imported"))
	} else if (result.error) {
		await vscode.window.showErrorMessage(t("common:errors.settings_import_failed", { error: result.error }))
	}
}
