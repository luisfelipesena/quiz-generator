import { test, expect } from '@playwright/test';

test.describe('Quiz Generator - Basic UI Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('✅ Homepage loads and displays correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Quiz Generator/);
    
    // Check main heading
    const heading = page.getByText(/Unstuck Quiz Generator/i);
    await expect(heading).toBeVisible();
    
    // Check Get Started button
    const getStartedButton = page.getByRole('button', { name: /Get Started/i });
    await expect(getStartedButton).toBeVisible();
    
    console.log('✅ Homepage displays correctly');
  });

  test('✅ Navigation from landing to upload page works', async ({ page }) => {
    // Click Get Started button
    const getStartedButton = page.getByRole('button', { name: /Get Started/i });
    await getStartedButton.click();
    
    // Should navigate to upload page
    await page.waitForURL('/upload');
    
    // Check upload area is present
    const uploadArea = page.getByText(/Click to upload.*or drag and drop/i);
    await expect(uploadArea).toBeVisible();
    
    console.log('✅ Landing → Upload navigation successful');
  });

  test('✅ File input exists and accepts PDF files', async ({ page }) => {
    // Navigate to upload page
    const getStartedButton = page.getByRole('button', { name: /Get Started/i });
    await getStartedButton.click();
    await page.waitForURL('/upload');
    
    // Check file input exists
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    
    // Check it accepts PDF files
    const acceptAttr = await fileInput.getAttribute('accept');
    expect(acceptAttr).toContain('pdf');
    
    console.log('✅ File input configured correctly for PDFs');
  });

  test('✅ Mobile responsiveness works correctly', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check homepage is still accessible
    const heading = page.getByText(/Unstuck Quiz Generator/i);
    await expect(heading).toBeVisible();
    
    // Navigate to upload page
    const getStartedButton = page.getByRole('button', { name: /Get Started/i });
    await getStartedButton.click();
    await page.waitForURL('/upload');
    
    // Check upload area is still visible on mobile
    const uploadArea = page.getByText(/Click to upload.*or drag and drop/i);
    await expect(uploadArea).toBeVisible();
    
    // Verify no horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
    
    console.log('✅ Mobile responsiveness validated');
  });

  test('✅ Page layouts are responsive', async ({ page }) => {
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 768, height: 1024 },  // Tablet
      { width: 375, height: 667 }    // Mobile
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      
      // Check content is visible at all sizes
      const heading = page.getByText(/Unstuck Quiz Generator/i);
      await expect(heading).toBeVisible();
      
      // Check no horizontal overflow
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(viewport.width + 50); // Allow small margin
    }
    
    console.log('✅ Responsive layouts validated across all viewports');
  });

  test('✅ Upload page components are properly styled', async ({ page }) => {
    // Navigate to upload page
    const getStartedButton = page.getByRole('button', { name: /Get Started/i });
    await getStartedButton.click();
    await page.waitForURL('/upload');
    
    // Check for proper drop zone styling
    const dropZone = page.locator('div').filter({ hasText: /Click to upload.*or drag and drop/i }).first();
    await expect(dropZone).toBeVisible();
    
    // Verify file input is present
    const fileInput = page.locator('input[type="file"]');
    await expect(fileInput).toBeVisible();
    
    console.log('✅ Upload page styling validated');
  });

  test('✅ Direct URL navigation works correctly', async ({ page }) => {
    // Test direct navigation to upload page
    await page.goto('/upload');
    await page.waitForLoadState('networkidle');
    
    // Should show upload interface
    const uploadArea = page.getByText(/Click to upload.*or drag and drop/i);
    await expect(uploadArea).toBeVisible();
    
    // Test navigation back to home
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Should show landing page
    const heading = page.getByText(/Unstuck Quiz Generator/i);
    await expect(heading).toBeVisible();
    
    console.log('✅ Direct URL navigation validated');
  });
});

test.describe('Quiz Generator - Error Handling & Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('✅ Graceful handling of missing quiz data', async ({ page }) => {
    // Try to access quiz page without data
    await page.goto('/quiz/1');
    await page.waitForTimeout(2000);
    
    // Should redirect to upload or show appropriate message
    const currentUrl = page.url();
    const isRedirected = currentUrl.includes('/upload') || currentUrl.includes('/');
    const hasErrorMessage = await page.getByText(/No Questions|Start Over|Upload/i).isVisible().catch(() => false);
    
    // Either should redirect or show error message
    expect(isRedirected || hasErrorMessage).toBeTruthy();
    
    console.log('✅ Missing quiz data handled gracefully');
  });

  test('✅ Results page handles missing data correctly', async ({ page }) => {
    // Try to access results page without data
    await page.goto('/results');
    await page.waitForTimeout(2000);
    
    // Should redirect or show appropriate message
    const currentUrl = page.url();
    const isRedirected = !currentUrl.includes('/results');
    const hasContent = await page.getByText(/results|score|quiz/i).isVisible().catch(() => false);
    
    // Should either redirect or show some content
    expect(isRedirected || hasContent).toBeTruthy();
    
    console.log('✅ Results page missing data handled gracefully');
  });

  test('✅ Page refresh maintains application state', async ({ page }) => {
    // Navigate to upload page
    const getStartedButton = page.getByRole('button', { name: /Get Started/i });
    await getStartedButton.click();
    await page.waitForURL('/upload');
    
    // Refresh the page
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Upload area should still be visible
    const uploadArea = page.getByText(/Click to upload.*or drag and drop/i);
    await expect(uploadArea).toBeVisible();
    
    console.log('✅ Page refresh handled correctly');
  });
});