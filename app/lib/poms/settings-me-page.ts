import { Locator, Page } from '@playwright/test'
import { AbstractAppPage } from '@lib/poms/abstract-app-page'

export class SettingsMePage extends AbstractAppPage {
  readonly getChangePasswordButton: Locator
  readonly getUserPasswordDialog: Locator
  readonly getOldPasswordInput: Locator
  readonly getNewPasswordInput: Locator
  readonly getRepeatPasswordInput: Locator
  readonly getCloseDialogButton: Locator
  readonly getSubmitChangePasswordButton: Locator

  constructor(page: Page) {
    super(page)
    this.getChangePasswordButton = page.getByTestId('change-pw-button')
    this.getUserPasswordDialog = page.getByTestId('user-password-dialog')
    this.getOldPasswordInput = page.getByLabel('old password', { exact: true })
    this.getNewPasswordInput = page.getByLabel('new password', { exact: true })
    this.getRepeatPasswordInput = page.getByLabel('repeat password', {
      exact: true,
    })
    this.getCloseDialogButton =
      this.getUserPasswordDialog.getByTestId('close-button')
    this.getSubmitChangePasswordButton =
      this.getUserPasswordDialog.getByTestId('change-pw-button')
  }

  async navigateByUserMenu() {
    await this.authUserButton.click()
    await this.userSettingsMeLink.click()
  }

  async fillForm(data: {
    oldPassword?: string
    newPassword?: string
    repeatPassword?: string
  }) {
    const formData = Object.assign(
      { oldPassword: '', neePassword: '', repeatPassword: '' },
      data,
    )
    await this.getOldPasswordInput.fill(formData.oldPassword)
    await this.getNewPasswordInput.fill(formData.newPassword)
    await this.getRepeatPasswordInput.fill(formData.repeatPassword)
  }
}
