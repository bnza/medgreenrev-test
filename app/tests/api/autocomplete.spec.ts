import { test } from '@playwright/test'
import { expect } from '@fixtures/fixtures'
import { apiUrl, getAuthToken, loadFixtures } from '@lib/common/api'

test.beforeAll(() => {
  loadFixtures()
})
test('Sites', async ({ request }) => {
  let response = await request.get(`${apiUrl}/autocomplete/sites`)
  expect(response.json(), 'Return expected entries number').toArrayHaveCount(10)
  response = await request.get(`${apiUrl}/autocomplete/sites?search=al`)
  expect(response.json(), 'Return expected entries number').toArrayHaveCount(6)
  const baseToken = await getAuthToken()

  response = await request.get(`${apiUrl}/autocomplete/sites/authorized`, {
    headers: {
      Authorization: baseToken,
    },
  })
  expect(response.json(), 'Return expected entries number').toArrayHaveCount(2)
  response = await request.get(
    `${apiUrl}/autocomplete/sites/authorized?search=ed`,
    {
      headers: {
        Authorization: baseToken,
      },
    },
  )
  expect(response.json(), 'Return expected entries number').toArrayHaveCount(1)
})
