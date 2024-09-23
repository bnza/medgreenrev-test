import { Locator, Page } from '@playwright/test'
import { AbstractCollectionPage } from '@lib/poms/abstract-collection-page'
import { AbstractItemReadPage } from '@lib/poms/abstract-item-page'

import { StratigraphicUnitCollectionPage } from '@lib/poms/stratigraphic-unit-collection-page'
import { ChildrenTabContentLocator } from '@lib/locators/children-tab-content-locator'

export class StratigraphicUnitItemPage extends AbstractItemReadPage {
  readonly siteInputAutocomplete: Locator
  readonly getRelationshipsTab: Locator
  readonly getMediaTab: Locator
  readonly getSampleTab: Locator
  readonly getRelationshipsTabContent: ChildrenTabContentLocator
  readonly getSampleTabContent: Locator

  constructor(page: Page) {
    super(page)
    this.siteInputAutocomplete = page.getByLabel('site')
    this.getRelationshipsTab = page.getByRole('tab', {
      name: 'relationships',
    })
    this.getSampleTab = page.getByRole('tab', {
      name: 'sample',
    })
    this.getMediaTab = page.getByRole('tab', {
      name: 'media',
    })
    this.getRelationshipsTabContent = new ChildrenTabContentLocator(
      page.getByTestId('tabs-window-relationships'),
    )
    this.getSampleTabContent = page.getByTestId('tabs-window-samples')
  }

  protected _getCollectionPageModel(page: Page): AbstractCollectionPage {
    return new StratigraphicUnitCollectionPage(page)
  }

  getBasePath(): string {
    return '#/data/stratigraphic-units'
  }
}
