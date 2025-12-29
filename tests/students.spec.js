const { test, expect } = require('@playwright/test');
const fs = require('fs').promises;
const path = require('path');

test.describe('Student Admin Tool Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear students data before navigating
    const studentsFile = path.join(__dirname, '../students.json');
    await fs.writeFile(studentsFile, '[]');

    // Navigate to the students page
    await page.goto('http://localhost:3000/students.html');
    // Wait for page to load
    await page.waitForSelector('h1');
    // Reload to ensure fresh data
    await page.reload();
    await page.waitForSelector('h1');
  });

  test('should display the student admin tool page', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Student Admin Tool');
    await expect(page.locator('h2').first()).toHaveText('Add Student');
    await expect(page.locator('h2').nth(1)).toHaveText('Students List');
  });

  test('should add a new student with valid details', async ({ page }) => {
    // Fill in the form with valid data
    await page.fill('#name', 'John Doe');
    await page.fill('#class', '10th Grade');
    await page.fill('#phone', '1234567890');
    await page.fill('#mentorName', 'Mr. Smith');

    // Submit the form
    await page.click('button[type="submit"]');

    // Wait for the student to appear in the table
    await page.waitForSelector('#studentsTable tbody tr:last-child');

    // Check if the student appears in the table with correct details
    const lastRow = page.locator('#studentsTable tbody tr').last();
    await expect(lastRow).toContainText('John Doe');
    await expect(lastRow).toContainText('10th Grade');
    await expect(lastRow).toContainText('1234567890');
    await expect(lastRow).toContainText('Mr. Smith');
  });

  test('should edit an existing student details', async ({ page }) => {
    // First, add a student
    await page.fill('#name', 'Jane Doe');
    await page.fill('#class', '9th Grade');
    await page.fill('#phone', '0987654321');
    await page.fill('#mentorName', 'Ms. Johnson');
    await page.click('button[type="submit"]');
    await page.waitForSelector('#studentsTable tbody tr:last-child');

    // Click edit button
    await page.click('#studentsTable tbody tr:last-child .edit-btn');

    // Wait for modal
    await page.waitForSelector('#editModal', { state: 'visible' });

    // Edit the details
    await page.fill('#editName', 'Jane Smith');
    await page.fill('#editClass', '10th Grade');
    await page.fill('#editPhone', '1111111111');
    await page.fill('#editMentorName', 'Mr. Brown');

    // Submit edit
    await page.click('#editForm button[type="submit"]');

    // Wait for modal to close
    await page.waitForSelector('#editModal', { state: 'hidden' });

    // Check updated details
    const lastRow = page.locator('#studentsTable tbody tr').last();
    await expect(lastRow).toContainText('Jane Smith');
    await expect(lastRow).toContainText('10th Grade');
    await expect(lastRow).toContainText('1111111111');
    await expect(lastRow).toContainText('Mr. Brown');
  });

  test('should delete a student successfully', async ({ page }) => {
    // Add a student
    await page.fill('#name', 'Test Student');
    await page.fill('#class', 'Test Class');
    await page.fill('#phone', '0000000000');
    await page.fill('#mentorName', 'Test Mentor');
    await page.click('button[type="submit"]');
    await page.waitForSelector('#studentsTable tbody tr:last-child');

    // Confirm student is added
    await expect(page.locator('#studentsTable tbody')).toContainText('Test Student');

    // Click delete button and confirm dialog
    page.on('dialog', dialog => dialog.accept());
    await page.click('#studentsTable tbody tr:last-child .delete-btn');

    // Wait for deletion
    await page.waitForTimeout(500);

    // Check if student is removed
    await expect(page.locator('#studentsTable tbody')).not.toContainText('Test Student');
  });

  test('should export students data to CSV file', async ({ page }) => {
    // Add a student first
    await page.fill('#name', 'Export Test');
    await page.fill('#class', 'Export Class');
    await page.fill('#phone', '2222222222');
    await page.fill('#mentorName', 'Export Mentor');
    await page.click('button[type="submit"]');
    await page.waitForSelector('#studentsTable tbody tr:last-child');

    // Click export button
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('#exportBtn')
    ]);

    // Verify download
    expect(download.suggestedFilename()).toBe('students.csv');
  });

  test('should reject invalid phone number (not 10 digits)', async ({ page }) => {
    // Try to add with invalid phone (less than 10 digits)
    await page.fill('#name', 'Invalid Phone');
    await page.fill('#class', 'Test Class');
    await page.fill('#phone', '12345'); // Invalid: only 5 digits
    await page.fill('#mentorName', 'Test Mentor');

    // Submit
    await page.click('button[type="submit"]');

    // Wait a bit
    await page.waitForTimeout(500);

    // Check that student was not added (form validation prevents submission)
    await expect(page.locator('#studentsTable tbody')).not.toContainText('Invalid Phone');
  });

  test('should handle empty form submission gracefully', async ({ page }) => {
    // Get initial count
    const initialCount = await page.locator('#studentsTable tbody tr').count();

    // Try to submit empty form
    await page.click('button[type="submit"]');

    // Wait
    await page.waitForTimeout(500);

    // Check that no student was added (required fields prevent submission)
    const finalCount = await page.locator('#studentsTable tbody tr').count();
    expect(finalCount).toBe(initialCount);
  });
});