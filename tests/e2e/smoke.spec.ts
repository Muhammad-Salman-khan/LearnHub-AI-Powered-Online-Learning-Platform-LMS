import { test, expect } from "@playwright/test";

test.describe("LearnHub E2E Smoke Tests", () => {
  test("homepage loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/LearnHub/);
    await expect(
      page.getByRole("heading", { level: 1, name: /Master the.*Future/i }),
    ).toBeVisible();
  });

  test("signup page loads and shows form", async ({ page }) => {
    await page.goto("/signup");
    await expect(page).toHaveTitle(/Sign Up|Register/i);
    await expect(page.getByRole("form", { name: /sign up|register/i })).toBeVisible();
  });

  test("login page loads and shows form", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveTitle(/Log In|Sign In/i);
    await expect(page.getByRole("form", { name: /log in|sign in/i })).toBeVisible();
  });

  test("courses page loads with filter sidebar", async ({ page }) => {
    await page.goto("/courses");
    await expect(page).toHaveTitle(/Courses/i);
    await expect(page.getByRole("heading", { name: /All Courses/i })).toBeVisible();
  });

  test("redirects unauthenticated users from dashboard to login", async ({ page }) => {
    await page.goto("/dashboard/student");
    await expect(page.url()).toContain("/login");
  });

  test("redirects unauthenticated users from admin to login", async ({ page }) => {
    await page.goto("/dashboard/admin");
    await expect(page.url()).toContain("/login");
  });

  test("redirects unauthenticated users from instructor to login", async ({ page }) => {
    await page.goto("/dashboard/instructor");
    await expect(page.url()).toContain("/login");
  });
});
