import { test, expect } from '@playwright/test'
import { UserCollectionPage } from '@lib/poms/user-collection-page'
import { LoginPage } from '@lib/poms/login-page'
import { loadFixtures } from '@lib/common/api'
import { logoutAndLoginAfterResetPassword } from '@lib/utils/reset-password-dialog'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test('Sites list redirected to login page', async ({ page }) => {
    const userCollectionPage = new UserCollectionPage(page)
    const loginPage = new LoginPage(page)
    await userCollectionPage.page.goto('#/admin/users')
    await expect(loginPage.getDataCard).toHaveCount(1)
  })
  test('Non admin users are redirect to home after login', async ({ page }) => {
    const userCollectionPage = new UserCollectionPage(page)
    const loginPage = new LoginPage(page)
    await userCollectionPage.page.goto('#/admin/users')
    await expect(loginPage.getDataCard).toHaveCount(1)
    await loginPage.login()
    await expect(loginPage.page.getByTestId('home-page-logo')).toHaveCount(1)
  })
  test('Admin users are redirect to collection page after login', async ({
    page,
  }) => {
    const userCollectionPage = new UserCollectionPage(page)
    const loginPage = new LoginPage(page)
    await userCollectionPage.page.goto('#/admin/users')
    await expect(loginPage.getDataCard).toHaveCount(1)
    await loginPage.login({ email: 'user_admin@example.com', password: '0002' })
    await userCollectionPage.waitTableData()
  })
})

test.describe('Admin user', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' })
  test('Has right permissions on users data', async ({ page }) => {
    const userCollectionPage = new UserCollectionPage(page)
    await userCollectionPage.waitTableData()
    await userCollectionPage.linkIsEnabled({
      rowSelector: 'user_base@example.com',
      linkType: 'READ',
    })
    await userCollectionPage.linkIsEnabled({
      rowSelector: 'user_base@example.com',
      linkType: 'EDIT',
    })
    await userCollectionPage.linkIsEnabled({
      rowSelector: 'user_base@example.com',
      linkType: 'DELETE',
    })
    await expect(
      userCollectionPage.getRefreshPasswordButton('user_base@example.com'),
    ).toBeEnabled()
    await userCollectionPage.linkIsEnabled({
      rowSelector: 'user_admin@example.com',
      linkType: 'READ',
    })
    await userCollectionPage.linkIsDisabled({
      rowSelector: 'user_admin@example.com',
      linkType: 'EDIT',
    })
    await userCollectionPage.linkIsDisabled({
      rowSelector: 'user_admin@example.com',
      linkType: 'DELETE',
    })
    await expect(
      userCollectionPage.getRefreshPasswordButton('user_admin@example.com'),
    ).toHaveAttribute('disabled')
  })
  test('Can reset user password', async ({ page }) => {
    const userCollectionPage = new UserCollectionPage(page)
    await userCollectionPage.waitTableData()
    await userCollectionPage
      .getRefreshPasswordButton('user_base@example.com')
      .click()
    await expect(
      userCollectionPage.page.getByTestId('user-password-dialog'),
    ).toHaveText(/Are you sure you want to/)
    await userCollectionPage.page
      .getByTestId('user-password-dialog')
      .getByRole('button')
      .nth(1)
      .click()
    await expect(
      userCollectionPage.page.getByTestId('user-password-dialog'),
    ).toHaveText(/Resetting password/)
    await expect(userCollectionPage.page.locator('#plainPassword')).toHaveCount(
      1,
    )
    await userCollectionPage.page
      .getByTestId('user-password-dialog')
      .getByRole('button')
      .nth(1)
      .click()
    await expect(
      userCollectionPage.page.getByTestId('app-snackbar'),
    ).toHaveText('Copied!')
    await logoutAndLoginAfterResetPassword(userCollectionPage)
  })
})
