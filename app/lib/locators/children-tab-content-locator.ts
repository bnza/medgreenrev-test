import { Locator } from '@playwright/test'
import { AbstractLocator } from '@lib/locators/abstract-locator'
import { CollectionTable } from '@lib/locators/collection-table'

export class ChildrenTabContentLocator extends AbstractLocator {
  readonly getSearchButton: Locator
  readonly getChildrenCollectionTable: CollectionTable

  constructor(locator: Locator) {
    super(locator)
    this.getSearchButton = locator.getByTestId('collection-search-link')
    this.getChildrenCollectionTable = new CollectionTable(
      locator.getByTestId('children-collection-table'),
    )
  }
}
