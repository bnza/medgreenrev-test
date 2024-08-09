import { test, expect, APIResponse } from '@playwright/test'
import { apiUrl, loadFixtures, getAuthToken } from '@lib/common/api'

test.beforeEach(async () => {
  loadFixtures()
})

test('Authentication', async ({ request }) => {
  const response: APIResponse = await request.post(`${apiUrl}/login`, {
    data: {
      email: 'user_admin@example.com',
      password: '0002',
    },
  })
  expect(response.ok()).toBeTruthy()
  expect(await response.json()).toHaveProperty('token')
})

test('GET /users/me', async ({ request }) => {
  let response: APIResponse = await request.get(`${apiUrl}/users/me`)
  expect(response.status()).toBe(401)

  response = await request.get(`${apiUrl}/users/me`, {
    headers: {
      Authorization: await getAuthToken(),
    },
  })
  expect(response.ok()).toBeTruthy()
})

test('User email cannot be updated', async ({ request }) => {
  const adminToken = await getAuthToken({
    email: 'user_admin@example.com',
    password: '0002',
  })
  const usersResponse = await request.get(`${apiUrl}/admin/users`, {
    headers: {
      Authorization: adminToken,
    },
  })
  const userId = (await usersResponse.json())['hydra:member']?.find(
    (el: { email: string }) => (el.email = 'user_base@example.com'),
  )['id']
  const patchResponse = await request.patch(`${apiUrl}/admin/users/${userId}`, {
    headers: {
      Authorization: adminToken,
      'content-type': 'application/merge-patch+json',
    },
    data: {
      email: 'user_different@example.com',
    },
  })
  expect(patchResponse.ok()).toBeTruthy()
  const userResponse = await request.get(`${apiUrl}/admin/users/${userId}`, {
    headers: {
      Authorization: adminToken,
    },
  })
  expect((await userResponse.json()).email).toBe('user_base@example.com')
})
