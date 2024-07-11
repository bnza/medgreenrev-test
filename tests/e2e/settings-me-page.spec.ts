import { test } from '@playwright/test'
import { expect } from '@fixtures/fixtures'
import { loadFixtures } from '@lib/common/api'
import { logoutAndLoginAfterResetPassword } from '@lib/utils/reset-password-dialog'
import { SettingsMePage } from '@lib/poms/settings-me-page'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Base user', () => {
  test.use({ storageState: 'playwright/.auth/base.json' })
  test('Can change his password', async ({ page }) => {
    const pom = new SettingsMePage(page)
    await pom.page.goto('#/')
    await expect(pom.homePageLogo).toHaveCount(1)
    await pom.authUserButton.click()
    await pom.userSettingsMeLink.click()
    await expect(pom.appDataCardToolbar).toHaveText(new RegExp('user_base'))
    await pom.getChangePasswordButton.click()
    await expect(
      pom.getUserPasswordDialog.getByTestId('user-pw-identifier'),
    ).toHaveText(new RegExp('user_base'))
    await pom.getCloseDialogButton.click()
    await expect(pom.getUserPasswordDialog).toHaveCount(0)
    await pom.getChangePasswordButton.click()
    await expect(pom.getUserPasswordDialog).toHaveCount(1)
    await pom.getOldPasswordInput.fill('a')
    await pom.getOldPasswordInput.press('Backspace')
    await pom.getOldPasswordInput.fill('0000')
    await expect(pom.getUserPasswordDialog).toHaveText(/required/)
    await pom.getNewPasswordInput.fill('a')
    await pom.getNewPasswordInput.press('Backspace')
    await expect(pom.getUserPasswordDialog).toHaveText(/required/)
    await pom.getNewPasswordInput.fill('qwert')
    await expect(pom.getUserPasswordDialog).toHaveText(/characters long/)
    await pom.getNewPasswordInput.fill('qwertyui')
    await expect(pom.getUserPasswordDialog).toHaveText(/digit/)
    await pom.getNewPasswordInput.fill('qwertyu1')
    await expect(pom.getUserPasswordDialog).toHaveText(/uppercase/)
    await pom.getNewPasswordInput.fill('qwerty1Q')
    await expect(pom.getUserPasswordDialog).toHaveText(/following characters/)
    await pom.getNewPasswordInput.fill('qwert1Q!')
    await pom.getRepeatPasswordInput.fill('a')
    await pom.getRepeatPasswordInput.press('Backspace')
    await expect(pom.getUserPasswordDialog).toHaveText(/required/)
    await pom.getRepeatPasswordInput.fill('different')
    await expect(pom.getUserPasswordDialog).toHaveText(/match/)
    await pom.getRepeatPasswordInput.fill('qwert1Q!')
    await expect(pom.getUserPasswordDialog).not.toHaveText(/match/)
    await pom.getSubmitChangePasswordButton.click()
    await expect(pom.getUserPasswordDialog).toHaveText(/Changing password/)
    await expect(pom.getAppSnackbar).toHaveText('Successfully changed password')
    await pom.logout()
    await expect(pom.homePageLogo).toHaveCount(1)
    await pom.login({ email: 'user_base@example.com', password: 'qwert1Q!' })
    await expect(pom.getAppSnackbar).toHaveText(/successfully logged in/)
  })
})
