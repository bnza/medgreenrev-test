import { test as setup, expect } from '@playwright/test'
import { LoginPage, credentials } from '@lib/poms/login-page'
import { loadFixtures } from '@lib/common/api'

setup.beforeAll(() => {
  loadFixtures()
})

const adminFile = 'playwright/.auth/admin.json'

setup('authenticate as admin ser', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login(credentials.ADMIN)
  await expect(page.getByTestId('app-snackbar').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: adminFile })
})

const editorFile = 'playwright/.auth/editor.json'
setup('authenticate as editor user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login(credentials.EDITOR)
  await expect(page.getByTestId('app-snackbar').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: editorFile })
})

const baseFile = 'playwright/.auth/base.json'
setup('authenticate as base user', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login(credentials.BASE)
  await expect(page.getByTestId('app-snackbar').first()).toHaveText(
    /successfully logged in/,
  )
  await page.context().storageState({ path: baseFile })
})
