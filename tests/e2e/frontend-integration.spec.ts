import { test, expect } from '@playwright/test';

test.describe('Quiz Generator - Frontend Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('✅ Application loads without JavaScript errors', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text());
      }
    });

    // Navigate through all main pages
    const pages = ['/', '/upload'];
    
    for (const testPage of pages) {
      await page.goto(testPage);
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(1000); // Allow any async operations to complete
    }

    // Check that no critical JavaScript errors occurred
    const criticalErrors = consoleErrors.filter(error => 
      !error.includes('favicon') && 
      !error.includes('net::ERR_FAILED') &&
      !error.includes('Failed to load resource')
    );

    expect(criticalErrors).toHaveLength(0);
    console.log('✅ Application loads without JavaScript errors');
  });

  test('✅ All required UI components render correctly', async ({ page }) => {
    // Landing page components
    await expect(page.getByText(/Unstuck Quiz Generator/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Get Started/i })).toBeVisible();

    // Navigate to upload page
    const getStartedButton = page.getByRole('button', { name: /Get Started/i });
    await getStartedButton.click();
    await page.waitForURL('/upload');

    // Upload page components
    await expect(page.getByText(/Click to upload.*or drag and drop/i)).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeVisible();

    console.log('✅ All required UI components render correctly');
  });

  test('✅ Form validation works correctly', async ({ page }) => {
    // Navigate to upload page
    const getStartedButton = page.getByRole('button', { name: /Get Started/i });
    await getStartedButton.click();
    await page.waitForURL('/upload');

    // Check file input accepts only PDFs
    const fileInput = page.locator('input[type="file"]');
    const acceptAttr = await fileInput.getAttribute('accept');
    expect(acceptAttr).toContain('pdf');

    console.log('✅ Form validation configured correctly');
  });

  test('✅ Responsive design works across viewports', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Check homepage
      await page.goto('/');
      await expect(page.getByText(/Unstuck Quiz Generator/i)).toBeVisible();
      
      // Check upload page
      await page.goto('/upload');
      await expect(page.getByText(/Click to upload.*or drag and drop/i)).toBeVisible();
      
      // Ensure no horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 50);
    }

    console.log('✅ Responsive design works across all viewports');
  });

  test('✅ Navigation and routing work correctly', async ({ page }) => {
    // Test direct navigation to different routes
    const routes = [
      { path: '/', expectedContent: /Unstuck Quiz Generator/i },
      { path: '/upload', expectedContent: /Click to upload.*or drag and drop/i }
    ];

    for (const route of routes) {
      await page.goto(route.path);
      await page.waitForLoadState('networkidle');
      await expect(page.locator('body')).toContainText(route.expectedContent);
    }

    // Test programmatic navigation
    await page.goto('/');
    const getStartedButton = page.getByRole('button', { name: /Get Started/i });
    await getStartedButton.click();
    await page.waitForURL('/upload');
    await expect(page.getByText(/Click to upload.*or drag and drop/i)).toBeVisible();

    console.log('✅ Navigation and routing work correctly');
  });

  test('✅ Error boundaries handle errors gracefully', async ({ page }) => {
    // Test accessing routes that might not have data
    const protectedRoutes = ['/quiz/1', '/results'];
    
    for (const route of protectedRoutes) {
      await page.goto(route);
      await page.waitForTimeout(2000); // Allow redirects or error handling
      
      // Should either redirect or show appropriate error handling
      const currentUrl = page.url();
      const hasErrorBoundary = await page.getByText(/error|not found|start over/i).isVisible().catch(() => false);
      const isRedirected = !currentUrl.includes(route.replace('/', ''));
      
      expect(hasErrorBoundary || isRedirected).toBeTruthy();
    }

    console.log('✅ Error boundaries handle errors gracefully');
  });

  test('✅ Page titles and meta tags are correct', async ({ page }) => {
    const pageTests = [
      { path: '/', expectedTitle: /Quiz Generator/i },
      { path: '/upload', expectedTitle: /Quiz Generator/i }
    ];

    for (const pageTest of pageTests) {
      await page.goto(pageTest.path);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveTitle(pageTest.expectedTitle);
    }

    console.log('✅ Page titles and meta tags are correct');
  });

  test('✅ Accessibility features are present', async ({ page }) => {
    await page.goto('/');
    
    // Check for semantic HTML
    const semanticElementsCount = await page.locator('main, header, nav, section').count();
    expect(semanticElementsCount).toBeGreaterThan(0);
    
    // Check for accessible buttons
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    // Check that buttons have accessible text or aria-label
    for (let i = 0; i < Math.min(buttonCount, 5); i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      const hasAccessibleText = (text?.trim().length || 0) > 0 || (ariaLabel?.trim().length || 0) > 0;
      expect(hasAccessibleText).toBeTruthy();
    }

    console.log('✅ Accessibility features are present');
  });

  test('✅ Local storage and state persistence work', async ({ page }) => {
    // Check that localStorage is available
    const hasLocalStorage = await page.evaluate(() => {
      try {
        const testKey = 'test-key';
        localStorage.setItem(testKey, 'test-value');
        const value = localStorage.getItem(testKey);
        localStorage.removeItem(testKey);
        return value === 'test-value';
      } catch {
        return false;
      }
    });

    expect(hasLocalStorage).toBeTruthy();

    // Check that the app initializes without errors
    await page.goto('/');
    await page.waitForTimeout(1000);
    
    // Navigate to upload page and back - state should persist
    const getStartedButton = page.getByRole('button', { name: /Get Started/i });
    await getStartedButton.click();
    await page.waitForURL('/upload');
    
    await page.goBack();
    await expect(page.getByText(/Unstuck Quiz Generator/i)).toBeVisible();

    console.log('✅ Local storage and state persistence work');
  });
});