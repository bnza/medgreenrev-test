import { Locator } from '@playwright/test'

export abstract class AbstractLocator {
  readonly locator: Locator

  protected constructor(locator: Locator) {
    this.locator = locator
  }
}
