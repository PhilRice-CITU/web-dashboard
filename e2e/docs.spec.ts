import { test, expect } from '@playwright/test'

test.describe('Documentation site', () => {
  test('/docs redirects to the first page', async ({ page }) => {
    await page.goto('/docs')
    await expect(page).toHaveURL(/\/docs\/getting-started\/introduction/)
    await expect(
      page.getByRole('heading', { name: 'Introduction', level: 1 }),
    ).toBeVisible()
  })

  test('sidebar navigates between pages', async ({ page }) => {
    await page.goto('/docs')
    await page
      .getByRole('navigation', { name: 'Documentation' })
      .getByRole('link', { name: 'Devices', exact: true })
      .click()
    await expect(page).toHaveURL(/\/docs\/using-the-dashboard\/devices/)
    await expect(
      page.getByRole('heading', { name: 'Devices', level: 1 }),
    ).toBeVisible()
  })

  test('prev/next pager works', async ({ page }) => {
    await page.goto('/docs/getting-started/dashboard-overview')
    await page.getByRole('link', { name: /Next/ }).click()
    await expect(page).toHaveURL(/first-login-and-roles/)
  })

  test('search dialog opens and navigates', async ({ page }) => {
    await page.goto('/docs')
    await expect(
      page.getByRole('heading', { name: 'Introduction', level: 1 }),
    ).toBeVisible()
    await page.keyboard.press('ControlOrMeta+k')
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible()
    await dialog.getByPlaceholder('Search documentation…').fill('analytics')
    await dialog.getByText('Analytics', { exact: true }).click()
    await expect(page).toHaveURL(/\/docs\/using-the-dashboard\/analytics/)
  })

  test('unknown slug shows the not-found state', async ({ page }) => {
    await page.goto('/docs/nope/missing')
    await expect(
      page.getByRole('heading', { name: 'Page not found' }),
    ).toBeVisible()
  })

  test('theme toggle switches dark mode', async ({ page }) => {
    await page.goto('/docs')
    const html = page.locator('html')
    const wasDark = await html.evaluate((el) => el.classList.contains('dark'))
    await page
      .getByRole('button', { name: /Switch to (dark|light) mode/ })
      .click()
    await expect
      .poll(() => html.evaluate((el) => el.classList.contains('dark')))
      .toBe(!wasDark)
  })

  test('mobile drawer navigation works', async ({ page }) => {
    await page.setViewportSize({ width: 480, height: 900 })
    await page.goto('/docs')
    await page.getByRole('button', { name: 'Open navigation' }).click()
    await page
      .getByRole('navigation', { name: 'Documentation' })
      .getByRole('link', { name: 'Analytics', exact: true })
      .click()
    await expect(page).toHaveURL(/\/docs\/using-the-dashboard\/analytics/)
  })
})
