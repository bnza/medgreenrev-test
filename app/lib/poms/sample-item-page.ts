import { Locator, Page } from '@playwright/test'
import {
  AbstractCollectionPage,
  NavigationLinksTypes,
} from '@lib/poms/abstract-collection-page'
import { AbstractItemReadPage } from '@lib/poms/abstract-item-page'

import { SampleCollectionPage } from '@lib/poms/sample-collection-page'
import { StratigraphicUnitItemPage } from '@lib/poms/stratigraphic-unit-item-page'

export class SampleItemPage extends AbstractItemReadPage {
  protected _getCollectionPageModel(page: Page): AbstractCollectionPage {
    return new SampleCollectionPage(page)
  }

  async navigateToStratigraphicUnitItemPageSampleTab(
    suCode: string,
  ): Promise<Locator> {
    const suItemPageObjectModel = new StratigraphicUnitItemPage(this.page)
    await suItemPageObjectModel.navigateFromCollectionPage(suCode, 'READ')
    await suItemPageObjectModel.getSampleTab.click()
    return suItemPageObjectModel.getSampleTabContent
  }

  async navigateFromStratigraphicUnitItemPage(
    suCode: `${string}.${number}.${number}`,
    number: number,
    action?: NavigationLinksTypes,
  ): Promise<SampleCollectionPage> {
    await this.navigateToStratigraphicUnitItemPageSampleTab(suCode)
    const collectionPageObjectModel = new SampleCollectionPage(this.page)
    const row = collectionPageObjectModel.getTableRowBySampleId(
      `${suCode}.${number}`,
    )
    if (action) {
      await row.getByTestId(`${action.toLowerCase()}-item-button`).click()
    }
    return collectionPageObjectModel
  }

  getBasePath(): string {
    return '#/data/samples'
  }
}
