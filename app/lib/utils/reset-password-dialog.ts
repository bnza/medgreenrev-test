import { expect } from '@fixtures/fixtures'
import { AbstractAppPage } from '@lib/poms/abstract-app-page'

export const logoutAndLoginAfterResetPassword = async (
  page: AbstractAppPage,
) => {
  await expect(page.page.locator('#plainPassword')).toHaveText(/.{10}/)
  const userIdentifier = await page.page
    .getByTestId('user-password-dialog')
    .getByTestId('user-pw-identifier')
    .textContent()
  const plainPassword = await page.page.locator('#plainPassword').textContent()
  await page.page
    .getByTestId('user-password-dialog')
    .getByRole('button')
    .nth(0)
    .click()
  await page.logout()
  await page.login({
    email: userIdentifier,
    password: plainPassword,
  })
}
