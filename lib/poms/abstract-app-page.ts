import { type Locator, type Page } from '@playwright/test'

import { expect } from '@fixtures/fixtures'
import { LoginPage } from '@lib/poms/login-page'

export abstract class AbstractAppPage {
  readonly page: Page
  readonly getTitle: Locator
  readonly loginButton: Locator
  readonly homePageLogo: Locator
  readonly getAppDataCard: Locator
  readonly appDataCardToolbar: Locator
  readonly authUserButton: Locator
  readonly userSettingsMeLink: Locator
  readonly getAppSnackbar: Locator

  constructor(page: Page) {
    this.page = page
    this.getAppDataCard = page.getByTestId('app-data-card')
    this.getTitle = page.getByTestId('app-data-card-toolbar')
    this.loginButton = page.getByTestId('login-button')
    this.appDataCardToolbar = page.getByTestId('app-data-card-toolbar')
    this.homePageLogo = page.getByTestId('home-page-logo')
    this.authUserButton = page.getByTestId('auth-user-button')
    this.userSettingsMeLink = page.getByTestId('user-settings-me-link')
    this.getAppSnackbar = page.getByTestId('app-snackbar')
  }

  async logout() {
    await this.page.getByTestId('auth-user-button').click()
    await this.page.getByText('Logout').click()
    await this.page
      .getByTestId('logout-dialog')
      .getByRole('button')
      .getByText('logout')
      .click()
    await this.expectHomePage()
  }

  async expectHomePage() {
    await expect(this.homePageLogo).toHaveCount(1)
  }

  async login(
    credentials = { email: 'user_base@example.com', password: '0000' },
  ) {
    await this.loginButton.click()
    await expect(this.page.getByTestId('login-data-card')).toHaveCount(1)
    const loginPage = new LoginPage(this.page)
    await loginPage.login(credentials)
    await expect(this.page.getByTestId('app-snackbar')).toHaveText(
      /successfully logged in/,
    )
  }

  async clickVuetifyVSelect(locator: Locator, text: string) {
    await locator.click()
    await this.page
      .locator('.v-select__content .v-list-item')
      .filter({ has: this.page.getByText(text, { exact: true }) })
      .click()
  }

  async fillVuetifyVAutocompleteAncClickNth(
    locator: Locator,
    text: string,
    nth: number = 0,
  ) {
    await locator.fill(text)
    const autocompleteContentLocator = this.page.locator(
      '.v-autocomplete__content .v-list-item',
    )
    await expect(autocompleteContentLocator).toHaveText(
      /^((?!No data available).)*$/,
    )
    await autocompleteContentLocator.nth(nth).click()
  }
}
