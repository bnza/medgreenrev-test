import { Page } from '@playwright/test'
import { AbstractCollectionPage } from '@lib/poms/abstract-collection-page'
import { AbstractItemReadPage } from '@lib/poms/abstract-item-page'

import { SiteCollectionPage } from '@lib/poms/site-collection-page'

export class SiteItemPage extends AbstractItemReadPage {
  protected _getCollectionPageModel(page: Page): AbstractCollectionPage {
    return new SiteCollectionPage(page)
  }

  getBasePath(): string {
    return '#/data/sites'
  }
}
