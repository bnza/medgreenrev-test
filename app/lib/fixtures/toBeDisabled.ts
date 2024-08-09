import { expect as baseExpect, type Locator } from '@playwright/test'

export { test } from '@playwright/test'

export const expect = baseExpect.extend({
  async toBeDisabled(locator: Locator) {
    const pass = await locator.getAttribute('disabled')
    if (pass) {
      return {
        message: () => 'passed',
        pass: true,
      }
    } else {
      return {
        message: () =>
          `toBeDisabled() assertion failed.\nYou expected '${locator}' to be disabled.\n`,
        pass: false,
      }
    }
  },
})
