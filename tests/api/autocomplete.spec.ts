import { test, APIResponse, APIRequestContext } from '@playwright/test'
import { expect } from '@fixtures/fixtures'
import {
  apiUrl,
  loadFixtures,
  getJsonLDResponseTotalMembers,
  getAuthToken,
} from '@lib/common/api'
import { describe } from 'node:test'

test.beforeAll(() => {
  loadFixtures()
})
test('Sites', async ({ request }) => {
  let response = await request.get(`${apiUrl}/autocomplete/sites`)
  let json = await response.json()
  expect(response.json(), 'Return expected entries number').toArrayHaveCount(10)
  response = await request.get(`${apiUrl}/autocomplete/sites?search=a`)
  expect(response.json(), 'Return expected entries number').toArrayHaveCount(10)
})
