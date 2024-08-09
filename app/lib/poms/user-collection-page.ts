import { AbstractCollectionPage } from '@lib/poms/abstract-collection-page'

export class UserCollectionPage extends AbstractCollectionPage {
  async waitTableData() {
    await this._waitTableData('#/admin/users', 'Users')
  }

  getRefreshPasswordButton(rowSelector: number | string) {
    return this.getTableRow(rowSelector).getByRole('button')
  }

  get apiUrl(): string {
    return '**/api/admin/users'
  }
}
