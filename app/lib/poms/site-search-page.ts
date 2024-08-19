import { AbstractSearchPage } from '@lib/poms/abstract-search-page'

export class SiteSearchPage extends AbstractSearchPage {
  get appUrl() {
    return '#/data/sites/search'
  }
}
