import { Locator, Page } from '@playwright/test'
import { AbstractCollectionPage } from '@lib/poms/abstract-collection-page'
import { AbstractItemReadPage } from '@lib/poms/abstract-item-page'
import { SitesUsersCollectionPage } from '@lib/poms/sites-users-collection-page'

export class SitesUsersItemPage extends AbstractItemReadPage {
  readonly getSiteAutocomplete: Locator

  constructor(page: Page) {
    super(page)
    this.getSiteAutocomplete = page.getByRole('combobox').nth(0)
  }

  protected _getCollectionPageModel(page: Page): AbstractCollectionPage {
    return new SitesUsersCollectionPage(page)
  }

  getBasePath(): string {
    return '#/admin/sites-users-privileges'
  }
}
