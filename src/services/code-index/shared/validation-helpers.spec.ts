import { describe, expect, it } from "vitest"

import { handleValidationError } from "./validation-helpers"

describe("handleValidationError", () => {
	it("returns a user-friendly API key message for ByteString conversion errors", () => {
		const result = handleValidationError(
			new TypeError(
				"Cannot convert argument to a ByteString because the character at index 7 has a value of 8226 which is greater than 255.",
			),
			"openai-compatible",
		)

		expect(result).toEqual({
			valid: false,
			error: "errors.api.invalidKeyInvalidChars",
		})
	})
})
