import { type Locator, type Page } from '@playwright/test';
import { expect } from '@fixtures/fixtures';

const navigationLinksTypes = {
  READ: 0,
  EDIT: 1,
  DELETE: 2,
};

type NavigationLinkSelector = {
  rowSelector: number | string;
  linkType: keyof typeof navigationLinksTypes;
};

export abstract class AbstractCollectionPage {
  readonly page: Page;
  readonly getTitle: Locator;
  readonly getTable: Locator;
  readonly navigationLinksTypes = navigationLinksTypes;

  constructor(page: Page) {
    this.page = page;
    this.getTitle = page.getByTestId('app-data-card-toolbar');
    this.getTable = page.getByTestId('app-data-card').getByRole('table');
  }

  async goto() {
    await this.page.goto('data/sites');
  }

  getTableHeaderByName(name: string) {
    return this.getTable.getByRole('cell', { name, exact: true });
  }

  getTableRow(selector: number | string) {
    return typeof selector === 'string'
      ? this.getTableRowByCode(selector)
      : this.getTable.getByRole('row').nth(selector);
  }

  getTableRowByCode(code: string) {
    const _code = new RegExp(`^${code}$`);
    return this.getTable
      .getByRole('row')
      .filter({ has: this.page.locator(`td`, { hasText: _code }) });
  }

  getReadNavigationLink(
    rowSelector: number | string,
    linkType: keyof typeof this.navigationLinksTypes,
  ) {
    return this.getTableRow(rowSelector)
      .getByRole('link')
      .nth(this.navigationLinksTypes[linkType]);
  }

  async tableHasRightTitle(expectedTitle: string) {
    await expect(
      this.getTitle,
      "Table's header has the right title",
    ).toHaveText(expectedTitle);
  }

  async tableHasHeader(headerName: string) {
    await expect(
      this.getTableHeaderByName(headerName),
      `Table has header '${headerName}' cell`,
    ).toHaveCount(1);
  }

  async tableNotHasHeader(headerName: string) {
    await expect(
      this.getTableHeaderByName(headerName),
      `Table not has header '${headerName}' cell`,
    ).toHaveCount(0);
  }

  async tableCellHasText(rowSelector: number | string, text: string | RegExp) {
    await expect(
      this.getTableRow(rowSelector).getByRole('cell', { name: text }),
      'Table cell has expected text',
    ).toHaveCount(1);
  }

  async linkIsEnabled(locator: Locator | NavigationLinkSelector) {
    if ('rowSelector' in locator) {
      locator = this.getReadNavigationLink(
        locator.rowSelector,
        locator.linkType,
      );
    }
    await expect(locator, 'Link is enabled').toBeEnabledLink();
  }

  async linkIsDisabled(locator: Locator | NavigationLinkSelector) {
    if ('rowSelector' in locator) {
      locator = this.getReadNavigationLink(
        locator.rowSelector,
        locator.linkType,
      );
    }
    await expect(locator, 'Link is disabled').toBeDisabledLink();
  }
}
