import { type Locator, type Page } from '@playwright/test'

import { expect } from '@fixtures/fixtures'
import { LoginPage } from '@lib/poms/login-page'

export abstract class AbstractAppPage {
  readonly page: Page
  readonly getAppDataCardToolbar: Locator
  readonly loginButton: Locator
  readonly homePageLogo: Locator
  readonly getAppDataCard: Locator
  readonly appDataCardToolbar: Locator
  readonly authUserButton: Locator
  readonly userSettingsMeLink: Locator
  readonly getAppSnackbar: Locator
  readonly getAppNavigationDrawer: Locator
  readonly getAppNavigationDrawerToggleIcon: Locator
  readonly getVuetifyOverlayContent: Locator
  readonly getVuetifyAutocompleteContent: Locator

  constructor(page: Page) {
    this.page = page
    this.getAppDataCard = page.getByTestId('app-data-card')
    this.getAppDataCardToolbar = page.getByTestId('app-data-card-toolbar')
    this.loginButton = page.getByTestId('login-button')
    this.appDataCardToolbar = page.getByTestId('app-data-card-toolbar')
    this.homePageLogo = page.getByTestId('home-page-logo')
    this.authUserButton = page.getByTestId('auth-user-button')
    this.userSettingsMeLink = page.getByTestId('user-settings-me-link')
    this.getAppSnackbar = page.getByTestId('app-snackbar')
    this.getAppNavigationDrawer = page.getByTestId('app-navigation-drawer')
    this.getAppNavigationDrawerToggleIcon = page.getByTestId('app-bar-nav-icon')
    this.getVuetifyOverlayContent = page.locator(
      '.v-overlay__content .v-list-item',
    )
    this.getVuetifyAutocompleteContent = page.locator(
      '.v-autocomplete__content .v-list-item',
    )
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
    await this.page.getByRole('option', { name: text, exact: true }).click()
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
    await expect(
      autocompleteContentLocator.filter({ hasText: /No data available/ }),
    ).toHaveCount(0)

    await expect(autocompleteContentLocator).toHaveCount(nth + 1)
    await autocompleteContentLocator.nth(nth).click()
  }

  async openNavigationDrawer() {
    await expect(this.getAppNavigationDrawerToggleIcon).toHaveCount(1)
    const classes = await this.getAppNavigationDrawer.getAttribute('class')
    if (!/v-navigation-drawer--active/.test(classes)) {
      await this.getAppNavigationDrawerToggleIcon.click()
    }
  }

  async openNavigationSection(key: string) {
    const navigationSection: Locator = this.getAppNavigationDrawer.getByTestId(
      `app-nav-drawer-li-${key}`,
    )
    const isOpen = await navigationSection
      .locator('.v-list-group__items')
      .isVisible()
    if (!isOpen) {
      await navigationSection.click()
    }
  }

  async clickAppNavigationListItem(section: string, name: string) {
    await this.openNavigationDrawer()
    await this.openNavigationSection(section)
    await this.getAppNavigationDrawer
      .getByText(new RegExp(`${name}`, 'i'))
      .click()
  }

  async dataCardHasExpectedTitle(expectedTitle: string | RegExp) {
    await expect(
      this.getAppDataCardToolbar,
      "Data table's header has the expected title",
    ).toHaveText(expectedTitle)
  }
}
