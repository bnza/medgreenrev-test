import { mergeExpects } from '@playwright/test'
import { expect as toBeEnabledExpect } from '@fixtures/toBeEnabled'
import { expect as toBeDisabledExpect } from '@fixtures/toBeDisabled'
import { expect as toArrayHaveCount } from '@fixtures/toArrayHaveCount'

export { test } from '@playwright/test'

export const expect = mergeExpects(
  toBeEnabledExpect,
  toBeDisabledExpect,
  toArrayHaveCount,
)
