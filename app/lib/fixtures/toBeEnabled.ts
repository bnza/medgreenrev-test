import { expect as baseExpect, type Locator } from '@playwright/test'

export { test } from '@playwright/test'

export const expect = baseExpect.extend({
  async toBeEnabled(locator: Locator) {
    const pass =
      (await locator.getAttribute('disabled', { timeout: 5000 })) === null
    if (pass) {
      return {
        message: () => 'passed',
        pass: true,
      }
    } else {
      return {
        message: () =>
          `toBeEnabled() assertion failed.\nYou expected '${locator}' to be enabled.\n`,
        pass: false,
      }
    }
  },
})
