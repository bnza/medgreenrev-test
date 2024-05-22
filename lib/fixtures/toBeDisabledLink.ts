
import { expect as baseExpect, type Locator } from "@playwright/test";

export { test } from "@playwright/test";

export const expect = baseExpect.extend({
  async toBeDisabledLink(locator: Locator) {
    const pass = await locator.getAttribute('disabled') === 'true'
    if (pass) {
      return {
        message: () => "passed",
        pass: true,
      };
    } else {
      return {
        message: () => `toBeDisabledLink() assertion failed.\nYou expected '${locator}' to be enabled.\n`,
        pass: false,
      };
    }
  },
});