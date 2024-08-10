import { Locator } from '@playwright/test'
import { AbstractLocator } from '@lib/locators/abstract-locator'
import { expect } from '@fixtures/fixtures'

export class CollectionTable extends AbstractLocator {
  constructor(locator: Locator) {
    super(locator)
  }

  async expectRowCount(number: number) {
    await expect(this.locator.getByRole('row')).toHaveCount(number)
  }
}
