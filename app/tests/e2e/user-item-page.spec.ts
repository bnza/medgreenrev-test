import { test } from '@playwright/test'
import { expect } from '@fixtures/fixtures'
import { loadFixtures } from '@lib/common/api'
import { logoutAndLoginAfterResetPassword } from '@lib/utils/reset-password-dialog'
import { UserItemPage } from '@lib/poms/user-item-page'
import { UserCollectionPage } from '@lib/poms/user-collection-page'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Admin user', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' })
  test('Delete item', async ({ page }) => {
    const itemPageObjectModel = new UserItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage(
      'user_base@example.com',
      'DELETE',
    )
    await expect(
      itemPageObjectModel.page.getByTestId('delete-item-alert-row'),
    ).toHaveCount(1)
    const _url = itemPageObjectModel.page.url()
    await itemPageObjectModel.page
      .getByTestId('app-data-card-toolbar')
      .getByRole('button')
      .click()
    await expect(
      itemPageObjectModel.page
        .getByTestId('app-data-card-toolbar')
        .getByText(/Users/),
    ).not.toHaveText('delete')
    await page.goto(_url)
    await itemPageObjectModel.pageHasEmptyItem()
  })
  test('Update item', async ({ page }) => {
    const itemPageObjectModel = new UserItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage(
      'user_base@example.com',
      'UPDATE',
    )
    await itemPageObjectModel.page.getByLabel('ROLE_EDITOR').click()
    await expect(itemPageObjectModel.page.getByLabel('email')).toHaveAttribute(
      'readonly',
    )
    await itemPageObjectModel.page
      .getByTestId('app-data-card-toolbar')
      .getByRole('button')
      .click()
    await expect(
      itemPageObjectModel.page
        .getByTestId('app-data-card-toolbar')
        .getByText(/User/),
    ).not.toHaveText('update')
    await expect(
      itemPageObjectModel.page.getByLabel('ROLE_EDITOR'),
    ).toBeChecked()
  })
  test('Create item', async ({ page }) => {
    const itemPageObjectModel = new UserItemPage(page)
    const collectionPageModel = new UserCollectionPage(page)
    await collectionPageModel.waitTableData()
    await collectionPageModel.getCreateLink.click()

    await itemPageObjectModel.page.getByLabel('email').fill('invalid')
    await expect(
      itemPageObjectModel.page.getByText('Value is not a valid email address'),
    ).toHaveCount(1)
    await itemPageObjectModel.page.getByLabel('email').fill('')
    await expect(
      itemPageObjectModel.page.getByText('This field is required'),
    ).toHaveCount(1)
    await itemPageObjectModel.page
      .getByLabel('email')
      .fill('user_test@example.com')
    await itemPageObjectModel.page.getByLabel('ROLE_EDITOR').click()
    await itemPageObjectModel.page
      .getByTestId('app-data-card-toolbar')
      .getByRole('button')
      .click()
    await expect(
      itemPageObjectModel.page
        .getByTestId('app-data-card-toolbar')
        .getByText(/User/),
    ).not.toHaveText('create')
    await expect(itemPageObjectModel.page.getByLabel('email')).toHaveValue(
      'user_test@example.com',
    )
    await expect(
      itemPageObjectModel.page.getByLabel('ROLE_EDITOR'),
    ).toBeChecked()
    await logoutAndLoginAfterResetPassword(itemPageObjectModel)
  })
  test('ResetPassword', async ({ page }) => {
    const itemPageObjectModel = new UserItemPage(page)
    await itemPageObjectModel.navigateFromCollectionPage(
      'user_base@example.com',
      'READ',
    )
    await expect(
      itemPageObjectModel.page.getByLabel('ROLE_EDITOR'),
    ).toHaveCount(1)
    await itemPageObjectModel.resetPasswordButton.click()
    await itemPageObjectModel.page
      .getByTestId('user-password-dialog')
      .getByRole('button')
      .nth(1)
      .click()
    await logoutAndLoginAfterResetPassword(itemPageObjectModel)
  })
})
