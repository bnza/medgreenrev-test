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
    const collectionPageObjectModel = new UserCollectionPage(page)
    await collectionPageObjectModel.waitTableData()
    await expect(
      collectionPageObjectModel
        .getTableRow('user_base@example.com')
        .getByTestId('read-item-button'),
    ).toBeEnabled()
    await expect(
      collectionPageObjectModel
        .getTableRow('user_base@example.com')
        .getByTestId('update-item-button'),
    ).toBeEnabled()
    await expect(
      collectionPageObjectModel
        .getTableRow('user_base@example.com')
        .getByTestId('delete-item-button'),
    ).toBeEnabled()
    await expect(
      collectionPageObjectModel
        .getTableRow('user_base@example.com')
        .getByTestId('reset-pw-button'),
    ).toBeEnabled()
    await expect(
      collectionPageObjectModel
        .getTableRow('user_admin@example.com')
        .getByTestId('read-item-button'),
    ).toBeEnabled()
    await expect(
      collectionPageObjectModel
        .getTableRow('user_admin@example.com')
        .getByTestId('update-item-button'),
    ).not.toBeEnabled()
    await expect(
      collectionPageObjectModel
        .getTableRow('user_admin@example.com')
        .getByTestId('delete-item-button'),
    ).not.toBeEnabled()
    await expect(
      collectionPageObjectModel
        .getTableRow('user_admin@example.com')
        .getByTestId('reset-pw-button'),
    ).toHaveAttribute('disabled')
  })
  test('Can reset user password', async ({ page }) => {
    const collectionPageObjectModel = new UserCollectionPage(page)
    await collectionPageObjectModel.waitTableData()
    await collectionPageObjectModel
      .getTableRow('user_base@example.com')
      .getByTestId('reset-pw-button')
      .click()
    await expect(
      collectionPageObjectModel.page.getByTestId('user-password-dialog'),
    ).toHaveText(/Are you sure you want to/)
    await collectionPageObjectModel.page
      .getByTestId('user-password-dialog')
      .getByRole('button')
      .nth(1)
      .click()
    await expect(
      collectionPageObjectModel.page.getByTestId('user-password-dialog'),
    ).toHaveText(/Resetting password/)
    await expect(
      collectionPageObjectModel.page.locator('#plainPassword'),
    ).toHaveCount(1)
    await collectionPageObjectModel.page
      .getByTestId('user-password-dialog')
      .getByRole('button')
      .nth(1)
      .click()
    await expect(
      collectionPageObjectModel.page.getByTestId('app-snackbar'),
    ).toHaveText('Copied!')
    await logoutAndLoginAfterResetPassword(collectionPageObjectModel)
  })
})
