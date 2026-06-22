import { getAppUrl } from "@roo-code/types"

type WrapperPropsForWebview =
	| import("@roo-code/types").KiloCodeWrapperProperties
	| import("../../../../src/shared/kilocode/wrapper").KiloCodeWrapperProperties // kilocode_change

const getKiloCodeSource = (uriScheme: string = "vscode", kiloCodeWrapperProperties?: WrapperPropsForWebview) => {
	void kiloCodeWrapperProperties
	return uriScheme
}

export function getKiloCodeBackendSignInUrl(
	uriScheme: string = "vscode",
	uiKind: string = "Desktop",
	kiloCodeWrapperProperties?: WrapperPropsForWebview, // kilocode_change
) {
	const source = uiKind === "Web" ? "web" : getKiloCodeSource(uriScheme, kiloCodeWrapperProperties)
	return getAppUrl(`/sign-in-to-editor?source=${source}`)
}

export function getKiloCodeBackendSignUpUrl(
	uriScheme: string = "vscode",
	uiKind: string = "Desktop",
	kiloCodeWrapperProperties?: WrapperPropsForWebview, // kilocode_change
) {
	const source = uiKind === "Web" ? "web" : getKiloCodeSource(uriScheme, kiloCodeWrapperProperties)
	return getAppUrl(`/users/sign_up?source=${source}`)
}
