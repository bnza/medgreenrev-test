import { test, expect, APIResponse, APIRequestContext } from '@playwright/test'
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

const getSiteByCode = async (request: APIRequestContext, code: string) => {
  const response: APIResponse = await request.get(
    `${apiUrl}/sites?code[]=${code}`,
  )
  const json = await response.json()
  return json['hydra:member'][0]
}

test('Sites', async ({ request }) => {
  let response: APIResponse = await request.get(
    `${apiUrl}/validator/unique/sites/code/ED`,
  )
  expect(await response.json(), 'Site should exists').toBe(0)
  response = await request.get(`${apiUrl}/validator/unique/sites/code/NON`)
  expect(await response.json(), "Site shouldn't exists").toBe(1)
  response = await request.get(`${apiUrl}/validator/unique/sites/name/Ed-Dur`)
  expect(await response.json(), 'Site should exists').toBe(0)
  response = await request.get(
    `${apiUrl}/validator/unique/sites/name/Non-Exists`,
  )
  expect(await response.json(), "Site shouldn't exists").toBe(1)
})
test('Users', async ({ request }) => {
  let response: APIResponse = await request.get(
    `${apiUrl}/validator/unique/users/email/user_base@example.com`,
  )
  expect(await response.json(), 'User should exists').toBe(0)
  response = await request.get(
    `${apiUrl}/validator/unique/users/email/user_wrong@example.com`,
  )
  expect(await response.json(), "User shouldn't exists").toBe(1)
})
test('Stratigraphic Units', async ({ request }) => {
  const site = await getSiteByCode(request, 'ED')
  let response: APIResponse = await request.get(
    `${apiUrl}/validator/unique/stratigraphic-units/${site.id}/2023/1003`,
  )
  expect(await response.json(), 'Stratigraphic unit should exists').toBe(0)
  response = await request.get(
    `${apiUrl}/validator/unique/stratigraphic-units/0/2023/1003`,
  )
  expect(await response.json(), "Stratigraphic unit shouldn't exists").toBe(1)
})
