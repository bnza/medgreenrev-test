import { Locator, Page } from '@playwright/test'
import { AbstractCollectionPage } from '@lib/poms/abstract-collection-page'
import { AbstractItemReadPage } from '@lib/poms/abstract-item-page'

import { UserCollectionPage } from '@lib/poms/user-collection-page'

export class UserItemPage extends AbstractItemReadPage {
  readonly resetPasswordButton: Locator

  constructor(page: Page) {
    super(page)
    this.resetPasswordButton = page
      .getByTestId('app-data-card-toolbar')
      .getByTestId('reset-pw-button')
  }

  protected _getCollectionPageModel(page: Page): AbstractCollectionPage {
    return new UserCollectionPage(page)
  }

  getBasePath(): string {
    return '#/admin/users'
  }
}
