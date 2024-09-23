import { AbstractCollectionPage } from '@lib/poms/abstract-collection-page'

export class SampleCollectionPage extends AbstractCollectionPage {
  readonly EXPECTED_NON_AUTH_ITEMS = 11

  async waitTableData() {
    await this._waitTableData('#/data/samples', /Samples/)
  }

  get apiUrl() {
    return /api\/samples/
  }

  getTableRowBySampleId(id: `${string}.${number}.${number}.${number}`) {
    const pieces = id.split('.')
    return this.getTableRowBySuCodeAndNumber(
      pieces[0],
      Number(pieces[1]),
      Number(pieces[2]),
      Number(pieces[3]),
    )
  }
}
