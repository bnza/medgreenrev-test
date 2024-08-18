import { test } from '@playwright/test'
import { expect } from '@fixtures/fixtures'
import { apiUrl, getAuthToken, loadFixtures } from '@lib/common/api'

test.beforeAll(() => {
  loadFixtures()
})
test('Sites', async ({ request }) => {
  let response = await request.get(`${apiUrl}/autocomplete/sites`)
  expect(response.json(), 'Returns expected entries number').toArrayHaveCount(
    10,
  )
  response = await request.get(`${apiUrl}/autocomplete/sites?search=al`)
  expect(response.json(), 'Returns expected entries number').toArrayHaveCount(6)
  response = await request.get(`${apiUrl}/autocomplete/sites?search=ww`)
  expect(response.json(), 'Hidden WW site should be hidden').toArrayHaveCount(0)
  const baseToken = await getAuthToken()

  response = await request.get(`${apiUrl}/autocomplete/sites`, {
    headers: {
      Authorization: baseToken,
    },
  })
  expect(response.json(), 'Returns expected entries number').toArrayHaveCount(
    10,
  )
  response = await request.get(`${apiUrl}/autocomplete/sites?search=al`, {
    headers: {
      Authorization: baseToken,
    },
  })
  expect(response.json(), 'Returns expected entries number').toArrayHaveCount(6)
  response = await request.get(`${apiUrl}/autocomplete/sites?search=ww`, {
    headers: {
      Authorization: baseToken,
    },
  })
  expect(response.json(), 'Hidden WW site should be visible').toArrayHaveCount(
    1,
  )
  response = await request.get(`${apiUrl}/autocomplete/sites/authorized`, {
    headers: {
      Authorization: baseToken,
    },
  })
  expect(
    response.json(),
    'Authorized sites returns expected entries number',
  ).toArrayHaveCount(2)
  response = await request.get(
    `${apiUrl}/autocomplete/sites/authorized?search=ed`,
    {
      headers: {
        Authorization: baseToken,
      },
    },
  )
  expect(
    response.json(),
    'Authorized sites filtered returns expected entries number',
  ).toArrayHaveCount(1)
})
