import { AbstractCollectionPage } from '@lib/poms/abstract-collection-page'

export class StratigraphicUnitCollectionPage extends AbstractCollectionPage {
  readonly EXPECTED_NON_AUTH_ITEMS = 11

  async waitTableData() {
    await this._waitTableData(
      '#/data/stratigraphic-units',
      'Stratigraphic Units',
    )
  }

  get apiUrl() {
    return /api\/stratigraphic_units/
  }
}
