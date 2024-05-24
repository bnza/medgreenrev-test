import { test } from '@playwright/test';

import { SiteCollectionPage } from '@lib/poms/site-collection-page';

test.describe('Unauthenticated user', () => {
  test.use({ storageState: { cookies: [], origins: [] } });
  test('Sites list succeed', async ({ page }) => {
    const siteCollectionPage = new SiteCollectionPage(page);
    await siteCollectionPage.goto();
    await siteCollectionPage.tableHasRightTitle('Sites');
    await siteCollectionPage.tableHasHeader('ID');
    await siteCollectionPage.tableNotHasHeader('public');
    await siteCollectionPage.tableCellHasText('ED', 'Ed-Dur');
    await siteCollectionPage.linkIsEnabled({
      rowSelector: 'ED',
      linkType: 'READ',
    });
    await siteCollectionPage.linkIsDisabled({
      rowSelector: 'ED',
      linkType: 'EDIT',
    });
    await siteCollectionPage.linkIsDisabled({
      rowSelector: 'ED',
      linkType: 'DELETE',
    });
  });
});

test.describe('Base user', () => {
  test.use({ storageState: 'playwright/.auth/base.json' });
  test('Sites list succeed', async ({ page }) => {
    const siteCollectionPage = new SiteCollectionPage(page);
    await siteCollectionPage.goto();
  });
});

test.describe('Admin user', () => {
  test.use({ storageState: 'playwright/.auth/admin.json' });
  test('Sites list succeed', async ({ page }) => {
    const siteCollectionPage = new SiteCollectionPage(page);
    await siteCollectionPage.goto();
    await siteCollectionPage.tableHasRightTitle('Sites');
    await siteCollectionPage.tableHasHeader('ID');
    await siteCollectionPage.tableHasHeader('public');
    await siteCollectionPage.tableCellHasText('ED', 'Ed-Dur');
    await siteCollectionPage.linkIsEnabled({
      rowSelector: 'ED',
      linkType: 'READ',
    });
    await siteCollectionPage.linkIsEnabled({
      rowSelector: 'ED',
      linkType: 'EDIT',
    });
    await siteCollectionPage.linkIsEnabled({
      rowSelector: 'ED',
      linkType: 'DELETE',
    });
  });
});
