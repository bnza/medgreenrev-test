import { type Locator, type Page } from '@playwright/test'

export const credentials = {
  ADMIN: { email: 'user_admin@example.com', password: '0002' },
  EDITOR: { email: 'user_editor@example.com', password: '0001' },
  BASE: { email: 'user_base@example.com', password: '0000' },
}

export class LoginPage {
  readonly page: Page
  readonly getDataCard: Locator
  readonly getEmailInput: Locator
  readonly getPasswordInput: Locator
  readonly getLoginButton: Locator

  constructor(page: Page) {
    this.page = page
    this.getDataCard = page.getByTestId('login-data-card')
    this.getEmailInput = page.getByLabel('e-mail')
    this.getPasswordInput = page.getByLabel('password')
    this.getLoginButton = page.getByRole('button', { name: 'login' })
  }

  async goto() {
    await this.page.goto('#/')
    await this.page.getByTestId('login-button').click()
  }

  async login(
    credentials = { email: 'user_base@example.com', password: '0000' },
  ) {
    await this.getEmailInput.fill(credentials.email)
    await this.getPasswordInput.fill(credentials.password)
    await this.getLoginButton.click()
  }
}
