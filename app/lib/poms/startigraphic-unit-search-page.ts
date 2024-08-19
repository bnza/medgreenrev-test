import { AbstractSearchPage } from '@lib/poms/abstract-search-page'

export class StratigraphicUnitSearchPage extends AbstractSearchPage {
  get appUrl() {
    return '#/data/stratigraphic-units/search'
  }
}
