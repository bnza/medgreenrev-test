import { type Locator, type Page } from '@playwright/test'
import { expect } from '@fixtures/fixtures'
import { AbstractAppPage } from '@lib/poms/abstract-app-page'

const navigationLinksTypes = {
  READ: 0,
  EDIT: 1,
  DELETE: 2,
}

export type NavigationLinksTypes = keyof typeof navigationLinksTypes

type NavigationLinkSelector = {
  rowSelector: number | string
  linkType: NavigationLinksTypes
}

export abstract class AbstractCollectionPage extends AbstractAppPage {
  readonly getTable: Locator
  readonly getCreateLink: Locator
  readonly getSearchLink: Locator
  readonly navigationLinksTypes = navigationLinksTypes

  // readonly collectionResponsePromise

  constructor(page: Page) {
    super(page)
    this.getTable = page.getByTestId('app-data-card').getByRole('table')
    this.getCreateLink = page
      .getByTestId('app-data-card-toolbar')
      .getByRole('link')
      .nth(0)
    this.getSearchLink = page
      .getByTestId('app-data-card-toolbar')
      .getByTestId('collection-search-link')
  }

  abstract waitTableData(): Promise<void>

  abstract get apiUrl(): string | RegExp

  get collectionResponsePromise() {
    return this.page.waitForResponse(this.apiUrl)
  }

  protected async _waitTableData(
    url: string,
    tableTitle: string,
    expectedTableHeader: string = 'ID',
  ) {
    await this.page.goto(url)
    await this.tableHasExpectedTitle(tableTitle)
    await this.tableHasHeader(expectedTableHeader)
  }

  getTableHeaderByName(name: string) {
    return this.getTable.getByRole('cell', { name, exact: true })
  }

  getTableRow(selector: number | string) {
    return typeof selector === 'string'
      ? this.getTableRowByCode(selector)
      : this.getTable.getByRole('row').nth(selector)
  }

  getTableRowByCode(code: string) {
    const _code = new RegExp(`^${code}$`)
    return this.getTable
      .getByRole('row')
      .filter({ has: this.page.locator(`td`, { hasText: _code }) })
  }

  getNavigationLink(
    rowSelector: number | string,
    linkType: NavigationLinksTypes,
  ) {
    return this.getTableRow(rowSelector)
      .getByRole('link')
      .nth(this.navigationLinksTypes[linkType])
  }

  getReadNavigationLink(rowSelector: number | string) {
    return this.getTableRow(rowSelector)
      .getByRole('link')
      .nth(this.navigationLinksTypes['READ'])
  }

  async tableHasExpectedTitle(expectedTitle: string | RegExp) {
    await expect(
      this.getTitle,
      "Table's header has the right title",
    ).toHaveText(expectedTitle)
  }

  async tableHasHeader(headerName: string) {
    await expect(
      this.getTableHeaderByName(headerName),
      `Table has header '${headerName}' cell`,
    ).toHaveCount(1)
  }

  async tableNotHasHeader(headerName: string) {
    await expect(
      this.getTableHeaderByName(headerName),
      `Table not has header '${headerName}' cell`,
    ).toHaveCount(0)
  }

  async tableCellHasText(rowSelector: number | string, text: string | RegExp) {
    await expect(
      this.getTableRow(rowSelector).getByRole('cell', { name: text }),
      'Table cell has expected text',
    ).toHaveCount(1)
  }

  async linkIsEnabled(locator: Locator | NavigationLinkSelector) {
    if ('rowSelector' in locator) {
      locator = this.getNavigationLink(locator.rowSelector, locator.linkType)
    }
    await expect(locator, 'Link is enabled').toBeEnabled()
  }

  async linkIsDisabled(locator: Locator | NavigationLinkSelector) {
    if ('rowSelector' in locator) {
      locator = this.getNavigationLink(locator.rowSelector, locator.linkType)
    }
    await expect(locator, 'Link is disabled').toBeDisabled()
  }

  async expectResponseTotalItems(count: number) {
    const response = await this.collectionResponsePromise
    const body = await response.json()
    // @ts-ignore
    expect(body['hydra:totalItems']).toBe(count)
  }
}
