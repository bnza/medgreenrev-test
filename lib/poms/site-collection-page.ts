import { AbstractCollectionPage } from '@lib/poms/abstract-collection-page'

export class SiteCollectionPage extends AbstractCollectionPage {
  async waitTableData() {
    await this._waitTableData('#/data/sites', 'Sites')
  }
}
