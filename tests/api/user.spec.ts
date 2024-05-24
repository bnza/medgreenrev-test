import { test, expect, APIResponse } from '@playwright/test';
import { apiUrl, loadFixtures, getAuthToken } from '@lib/common/api';

test.beforeEach(async () => {
  loadFixtures();
});

test('Authentication', async ({ request }) => {
  const response: APIResponse = await request.post(`${apiUrl}/login`, {
    data: {
      email: 'user_admin@example.com',
      password: '0002',
    },
  });
  expect(response.ok()).toBeTruthy();
  expect(await response.json()).toHaveProperty('token');
});

test('GET /users/me', async ({ request }) => {
  let response: APIResponse = await request.get(`${apiUrl}/users/me`);
  expect(response.status()).toBe(401);

  response = await request.get(`${apiUrl}/users/me`, {
    headers: {
      Authorization: await getAuthToken(),
    },
  });
  expect(response.ok()).toBeTruthy();
});
