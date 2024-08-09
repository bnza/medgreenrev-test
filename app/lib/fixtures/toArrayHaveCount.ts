import { expect as baseExpect } from '@playwright/test'

export const expect = baseExpect.extend({
  async toArrayHaveCount(received: Promise<any>, count: number) {
    received = await received
    if (!Array.isArray(received)) {
      return {
        message: () =>
          `toBeArrayHaveCount() assertion failed.\nGiven value is not an array\n`,
        pass: false,
      }
    }
    if (received.length !== count) {
      return {
        message: () =>
          `toBeArrayHaveCount() assertion failed.\nYou expect array toHave ${count} entries but it has ${received.length} entries\n`,
        pass: false,
      }
    }
    return {
      message: () => 'passed',
      pass: true,
    }
  },
})
