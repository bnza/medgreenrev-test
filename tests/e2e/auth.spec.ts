import { test, expect, APIResponse } from '@playwright/test'
import { apiUrl, loadFixtures, getAuthToken } from '@lib/common/api'
import { LoginPage } from '@lib/poms/login-page'

test.beforeEach(async () => {
  loadFixtures()
})

test('Login succeed', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.goto()
  await loginPage.login()
  await expect(page.getByTestId('app-snackbar')).toHaveText(
    /successfully logged in/,
  )
})

// test('Expired JWT handling',async ({ page }) => {
//     await page.route('*/**/api/login', async route => {
//         const json = { token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2OTk5NTMyODAsImV4cCI6MTY5OTk1Njg4MCwicm9sZXMiOlsiUk9MRV9VU0VSIl0sImVtYWlsIjoidXNlcl9iYXNlQGV4YW1wbGUuY29tIn0.U-nPDBZAF59fRVZc64zKau6lGjLLRH0w7GiFpxNK-_gWImo32isVddiQR8LlhpAUUobY6oc8dCfcAfXhyi4pcjHHe79RcHkIsMBK3t3S1UcSOdeab7w4YCbrdmxH59d_C3f6YjRjr5GOTtMIXtgXN73rXVxi2yKAeoimB_DigCGt93dg7a5o8cj-hRcm1_NJTcmuBytNdxfY1qMRWLuAhMkpF8HMT2ipyBJP9KwOIUimGPqRgEwEB6K9xOjyR_iqunah6l4XQzYANLvE_tJjGMuiHCrOzAmabMcPEjvRXMKrBTbTbLhQZ1t3G-eiTftoyoHZn-fQZ_sbnN9bfadT2A" };
//         await route.fulfill({ json });
//     });
//
//     await page.route('*/**/api/users/me', async route => {
//         const json = {
//             "id": "1ee7bf9e-93f7-638a-a87c-498d303ff73b",
//             "email": "user_base@example.com",
//             "sites": [],
//             "roles": [
//                 "ROLE_USER"
//             ]
//         }
//         await route.fulfill({ json });
//     });
//
//     await page.goto('/login');
//
//     await page.getByLabel('e-mail').fill('user_base@example.com');
//     await page.getByLabel('password').fill('0000');
//     await page.getByRole('button', { name: 'login' }).click()
//
//     await page.getByTestId('app-bar-nav-icon').click();
//     await page.getByTestId('app-nav-drawer-li-data').click();
//     await page.getByTestId('app-nav-drawer-li-sites').click();
//
//     await expect(page.getByTestId('app-snackbar')).toBeVisible()
// })

// test('ACL forbid page',async ({ page }) => {
//     await page.goto('/admin/users');
//
//     await page.getByLabel('e-mail').fill('user_base@example.com');
//     await page.getByLabel('password').fill('0000');
//     await page.getByRole('button', { name: 'login' }).click()
//
//     await expect(page.getByTestId('app-snackbar')).toHaveText(/^Access to page forbidden/)
// })
