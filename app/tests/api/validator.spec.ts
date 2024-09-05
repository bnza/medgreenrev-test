import { test, expect, APIResponse, APIRequestContext } from '@playwright/test'
import { apiUrl, loadFixtures, getAuthToken } from '@lib/common/api'

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

const getUserByEmail = async (
  request: APIRequestContext,
  email: string,
  token: string,
) => {
  const response: APIResponse = await request.get(
    `${apiUrl}/admin/users?email[]=${email}`,
    {
      headers: {
        Authorization: token,
      },
    },
  )
  const json = await response.json()
  return json['hydra:member'][0]
}

const getNthSuBySiteCode = async (
  request: APIRequestContext,
  code: string,
  number = 0,
) => {
  const site = await getSiteByCode(request, code)

  const response: APIResponse = await request.get(
    `${apiUrl}/stratigraphic_units?site[]=${site.id}`,
  )
  const json = await response.json()
  return json['hydra:member'][number]
}
const getNthSusRelBySiteCode = async (
  request: APIRequestContext,
  code: string,
  number = 0,
) => {
  const site = await getSiteByCode(request, code)

  const response: APIResponse = await request.get(
    `${apiUrl}/stratigraphic_units_relationships?site.id[]=${site.id}`,
  )
  const json = await response.json()
  return json['hydra:member'][number]
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
test('Sites Users', async ({ request }) => {
  const uuid = '1ef5a09a-b7f5-6814-891c-83b573ec0d84'
  let response: APIResponse = await request.get(
    `${apiUrl}/validator/unique/sites_users/0/${uuid}`,
  )
  expect(response.status(), 'Only auth users').toBe(401)
  const adminToken = await getAuthToken({
    email: 'user_admin@example.com',
    password: '0002',
  })
  response = await request.get(
    `${apiUrl}/validator/unique/sites_users/0/${uuid}`,
    {
      headers: {
        Authorization: adminToken,
      },
    },
  )
  expect(await response.json(), "Sites/Users shouldn't exists").toBe(1)
  const site = await getSiteByCode(request, 'ED')
  const user = await getUserByEmail(
    request,
    'user_base@example.com',
    adminToken,
  )

  response = await request.get(
    `${apiUrl}/validator/unique/sites_users/${site.id}/${user.id}`,
    {
      headers: {
        Authorization: adminToken,
      },
    },
  )
  expect(await response.json(), 'Sites/Users should exists').toBe(0)
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
test('Stratigraphic Units Relationships', async ({ request }) => {
  let response: APIResponse = await request.get(
    `${apiUrl}/stratigraphic_units_relationships/`,
  )
  let json = await response.json()
  const relationship = json['hydra:member'][0]
  const sxSuId = relationship.sxSU.id
  const dxSuId = relationship.dxSU.id

  response = await request.get(
    `${apiUrl}/validator/unique/stratigraphic_units_relationships/${sxSuId}/${dxSuId}`,
  )
  expect(
    await response.json(),
    'Stratigraphic unit relationship should exists',
  ).toBe(0)
  response = await request.get(
    `${apiUrl}/validator/unique/stratigraphic_units_relationships/0/${dxSuId}`,
  )
  expect(
    await response.json(),
    'Stratigraphic unit relationship should not exists',
  ).toBe(1)
})
