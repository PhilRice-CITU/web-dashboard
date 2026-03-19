import { test, expect } from '@playwright/test'

/**
 * Example E2E tests with Playwright
 *
 * Run with: npm run test:e2e
 * Run in UI mode: npm run test:e2e:ui
 */

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('/')
  })

  test('should display the home page', async ({ page }) => {
    // Add your homepage assertions
    const heading = page.locator('h1')
    await expect(heading).toBeVisible()
  })

  test('should navigate to dashboard', async ({ page }) => {
    // Example: click a navigation link and verify
    const dashboardLink = page.locator('a[href="/dashboard"]')
    if (await dashboardLink.isVisible()) {
      await dashboardLink.click()
      await expect(page).toHaveURL(/.*dashboard/)
    }
  })
})

test.describe('Authentication', () => {
  test('should show login page when not authenticated', async ({ page }) => {
    await page.goto('/protected-route')
    // Should redirect to login
    await expect(page).toHaveURL(/.*login/)
  })
})

test.describe('Forms', () => {
  test('should submit form with validation', async ({ page }) => {
    await page.goto('/forms/example')

    // Fill form
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="password"]', 'password123')

    // Submit
    await page.click('button[type="submit"]')

    // Verify submission
    await expect(page.locator('text=Success')).toBeVisible()
  })
})
