import { test } from '@playwright/test'
import { SiteCollectionPage } from '@lib/poms/site-collection-page'
import { loadFixtures } from '@lib/common/api'

test.beforeEach(async () => {
  loadFixtures()
})

test.describe('Unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } })
  test('Sites list succeed', async ({ page }) => {
    const siteCollectionPage = new SiteCollectionPage(page)
    await siteCollectionPage.waitTableData()
    await siteCollectionPage.tableNotHasHeader('public')
    await siteCollectionPage.tableCellHasText('ED', 'Ed-Dur')
    await siteCollectionPage.linkIsEnabled({
      rowSelector: 'ED',
      linkType: 'READ',
    })
    await siteCollectionPage.linkIsDisabled({
      rowSelector: 'ED',
      linkType: 'EDIT',
    })
    await siteCollectionPage.linkIsDisabled({
      rowSelector: 'ED',
      linkType: 'DELETE',
    })
  })
})

test.describe('Base user', () => {
  test.use({ storageState: 'playwright/.auth/base.json' })
  test('Sites list succeed', async ({ page }) => {
    const siteCollectionPage = new SiteCollectionPage(page)
    await siteCollectionPage.waitTableData()
  })
})

test.describe('Editor user', () => {
  test.use({ storageState: 'playwright/.auth/editor.json' })
  test('Sites list succeed', async ({ page }) => {
    const siteCollectionPage = new SiteCollectionPage(page)
    await siteCollectionPage.waitTableData()
  })
})

test.describe('Admin user', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' })
  test('Sites list succeed', async ({ page }) => {
    const siteCollectionPage = new SiteCollectionPage(page)
    await siteCollectionPage.waitTableData()
    await siteCollectionPage.tableHasHeader('public')
    await siteCollectionPage.tableCellHasText('ED', 'Ed-Dur')
    await siteCollectionPage.linkIsEnabled({
      rowSelector: 'ED',
      linkType: 'READ',
    })
    await siteCollectionPage.linkIsEnabled({
      rowSelector: 'ED',
      linkType: 'EDIT',
    })
    await siteCollectionPage.linkIsEnabled({
      rowSelector: 'ED',
      linkType: 'DELETE',
    })
  })
})
