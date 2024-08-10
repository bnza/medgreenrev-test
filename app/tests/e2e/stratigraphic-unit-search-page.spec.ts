import {test} from '@playwright/test'

import {loadFixtures} from '@lib/common/api'
import {expect} from '@fixtures/fixtures'
import {StratigraphicUnitCollectionPage} from "@lib/poms/stratigraphic-unit-collection-page";
import {StratigraphicUnitSearchPage} from "@lib/poms/startigraphic-unit-search-page";

test.beforeEach(async () => {
    loadFixtures()
})
test.describe('Unauthenticated user', () => {
    test.use({storageState: {cookies: [], origins: []}})

    test('Can navigate from collection', async ({page}) => {
        const collectionPageObject = new StratigraphicUnitCollectionPage(page)
        await collectionPageObject.waitTableData()
        await collectionPageObject.getSearchLink.click()
        const searchPageObject = new StratigraphicUnitSearchPage(page)
        await searchPageObject.hasExpectedTitle()
        await searchPageObject.expectToBeEmpty()
        await searchPageObject.getAddFilterButton.click()

        await expect(searchPageObject.getAddFilterDialogTitle).toHaveText(
            'Add filter',
        )
        await expect(searchPageObject.getAddFilterDialogContent).toHaveCount(1)

        await searchPageObject.getSubmitAddFilterButton.click()
        await expect(searchPageObject.getAddFilterDialogContent).toHaveText(
            /This field is required/,
        )
        await searchPageObject.clickVuetifyVSelect(
            searchPageObject.getAddFilterDialogPropertyInput,
            'site',
        )
        await searchPageObject.clickVuetifyVSelect(
            searchPageObject.getAddFilterDialogOperatorInput,
            'equals',
        )

        await expect(searchPageObject.getAddFilterDialogContent).not.toHaveText(
            /This field is required/,
        )
        await searchPageObject.getSubmitAddFilterButton.click()
        await expect(searchPageObject.getAddFilterDialogContent).toHaveText(
            /This field is required/,
        )
        await searchPageObject.fillVuetifyVAutocompleteAncClickNth(
            searchPageObject.page.getByLabel('site'),
            'ED',
        )
        await searchPageObject.getSubmitAddFilterButton.click()

        await expect(searchPageObject.getAddFilterDialog).toHaveCount(0)
        await expect(searchPageObject.getFiltersListItem).toHaveCount(1)
        await searchPageObject.getSubmitAddFiltersButton.click()
        await collectionPageObject.expectResponseTotalItems(8)
        await collectionPageObject.waitTableData()
    })
})
