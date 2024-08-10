import { Locator, Page } from '@playwright/test'
import { AbstractCollectionPage } from '@lib/poms/abstract-collection-page'
import { AbstractItemReadPage } from '@lib/poms/abstract-item-page'

import { SiteCollectionPage } from '@lib/poms/site-collection-page'
import { ChildrenTabContentLocator } from '@lib/locators/children-tab-content-locator'

export class SiteItemPage extends AbstractItemReadPage {
  readonly getStratigraphicUnitsTab: Locator
  readonly getStratigraphicUnitsTabContent: ChildrenTabContentLocator

  constructor(page: Page) {
    super(page)
    this.getStratigraphicUnitsTab = page.getByRole('tab', {
      name: 'stratigraphic units',
    })
    this.getStratigraphicUnitsTabContent = new ChildrenTabContentLocator(
      page.getByTestId('tabs-window-stratigraphic-units'),
    )
  }

  protected _getCollectionPageModel(page: Page): AbstractCollectionPage {
    return new SiteCollectionPage(page)
  }

  getBasePath(): string {
    return '#/data/sites'
  }
}
