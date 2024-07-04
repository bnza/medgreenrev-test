import { test, expect, APIResponse } from '@playwright/test'
import {
  apiUrl,
  loadFixtures,
  getJsonLDResponseTotalMembers,
  getAuthToken,
} from '@lib/common/api'
import { describe } from 'node:test'

test.beforeEach(() => {
  loadFixtures()
})

test('GET Collection', async ({ request }) => {
  await describe('Unauthenticated', async () => {
    const response: APIResponse = await request.get(`${apiUrl}/sites`)
    expect(response.ok()).toBeTruthy()
    expect(await getJsonLDResponseTotalMembers(response)).toBe(11)
  })
  await describe('Authenticated', async () => {
    const response: APIResponse = await request.get(`${apiUrl}/sites`, {
      headers: {
        Authorization: await getAuthToken(),
      },
    })
    expect(response.ok()).toBeTruthy()
    expect(await getJsonLDResponseTotalMembers(response)).toBe(12)
  })
})
