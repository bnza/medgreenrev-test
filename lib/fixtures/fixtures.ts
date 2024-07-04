import { mergeExpects } from '@playwright/test'
import { expect as toBeEnabledExpect } from '@fixtures/toBeEnabled'
import { expect as toBeDisabledExpect } from '@lib/fixtures/toBeDisabled'

export { test } from '@playwright/test'

export const expect = mergeExpects(toBeEnabledExpect, toBeDisabledExpect)
