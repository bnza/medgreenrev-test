import { AbstractCollectionPage } from '@lib/poms/abstract-collection-page'

export class SitesUsersCollectionPage extends AbstractCollectionPage {
  readonly EXPECTED_NON_AUTH_ITEMS = 11

  async waitTableData() {
    await this._waitTableData('#/data/sites-users', /Sites/)
  }

  get apiUrl() {
    return /api\/sites_users/
  }
}
