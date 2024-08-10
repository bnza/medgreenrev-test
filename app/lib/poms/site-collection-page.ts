import { AbstractCollectionPage } from '@lib/poms/abstract-collection-page'

export class SiteCollectionPage extends AbstractCollectionPage {
  readonly EXPECTED_NON_AUTH_ITEMS = 11

  async waitTableData() {
    await this._waitTableData('#/data/sites', /Sites/)
  }

  get apiUrl() {
    return /api\/sites/
  }
}
