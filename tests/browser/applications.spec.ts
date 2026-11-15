import { expect, test } from "@playwright/test";
import { cvPDF } from "../fixtures/cv";

test("submits a private application and recovers an interrupted response without duplication", async ({ page }, testInfo) => {
  await page.goto("/join-us/careers/field-systems-engineer");
  const form = page.getByRole("form", { name: "Job application" });
  await expect(form).toBeVisible();
  await form.getByLabel("Full name", { exact: false }).fill("Browser test candidate");
  await form.getByLabel("Email", { exact: false }).fill(`browser-${testInfo.project.name}-${Date.now()}@pazelgreen.test`);
  await form.getByLabel("CV", { exact: false }).setInputFiles({ name: "cv.pdf", mimeType: "application/pdf", buffer: cvPDF() });
  await form.getByRole("checkbox").check();
  let originalReference = "";
  await page.route("**/api/recruitment/apply", async route => {
    const response = await route.fetch();
    expect(response.status()).toBe(201);
    originalReference = (await response.json()).reference;
    await route.fulfill({ status: 503, contentType: "application/json", body: JSON.stringify({ error: "Test interrupted response. Retry the same form." }) });
  }, { times: 1 });
  await form.getByRole("button", { name: "Submit application" }).click();
  await expect(form.getByRole("alert")).toContainText("Retry the same form");
  await form.getByRole("button", { name: "Submit application" }).click();
  await expect(page.getByRole("heading", { name: "Application received", exact: true })).toBeVisible();
  await expect(page.getByRole("status")).toContainText(originalReference);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: testInfo.outputPath("application-success.png"), fullPage: true });
});

test("denies anonymous applicant records and rejects cross-origin submissions", async ({ request }) => {
  for (const route of ["applications", "hiring-history", "private-files"]) expect((await request.get(`/api/${route}`)).status()).toBe(403);
  expect((await request.post("/api/recruitment/apply", { headers: { Origin: "https://example.invalid" }, multipart: { fullName: "Blocked" } })).status()).toBe(403);
});
