import {test} from '@playwright/test'
import {expect} from '@fixtures/fixtures'
import {
    apiUrl,
    loadFixtures,
} from '@lib/common/api'

test.beforeAll(() => {
    loadFixtures()
})
test('Sites', async ({request}) => {
    let response = await request.get(`${apiUrl}/autocomplete/sites`)
    expect(response.json(), 'Return expected entries number').toArrayHaveCount(10)
    response = await request.get(`${apiUrl}/autocomplete/sites?search=a`)
    expect(response.json(), 'Return expected entries number').toArrayHaveCount(10)
})
