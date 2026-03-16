// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// Created: 17 March 2026 | Version: 1.0.0
// Unauthorized use or modification is strictly prohibited.
// ============================================================
const { When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

Then("the Rex launcher icon should be visible", async function () {
  expect(await this.chatbotPage.isLauncherVisible()).toBe(true);
});

Then("the launcher should be positioned at the bottom-right", async function () {
  const box = await this.chatbotPage.launcherIcon.boundingBox();
  expect(box).not.toBeNull();
  const viewport = this.page.viewportSize();
  expect(box.x + box.width).toBeGreaterThan(viewport.width * 0.7);
  expect(box.y + box.height).toBeGreaterThan(viewport.height * 0.7);
});

When("I hover over the Rex launcher", async function () {
  await this.chatbotPage.hoverLauncher();
});

Then("I should see the {string} tooltip", async function (tooltipText) {
  await this.chatbotPage.tooltip.waitFor({ state: "visible", timeout: 5000 });
  const text = await this.chatbotPage.tooltip.innerText();
  expect(text).toContain(tooltipText);
});

Then("the chatbot modal should be visible", async function () {
  expect(await this.chatbotPage.isChatModalVisible()).toBe(true);
});

Then("the chatbot modal should not be visible", async function () {
  expect(await this.chatbotPage.isChatModalVisible()).toBe(false);
});

Then("the chatbot modal should be fully visible", async function () {
  const box = await this.chatbotPage.chatModal.boundingBox();
  expect(box).not.toBeNull();
  expect(box.width).toBeGreaterThan(0);
  expect(box.height).toBeGreaterThan(0);
});

When("I tab to the launcher and press Enter", async function () {
  await this.chatbotPage.tabToLauncher();
  await this.chatbotPage.pressEnterOnLauncher();
});

Then("the launcher aria-label should be present and descriptive", async function () {
  const label = await this.chatbotPage.getLauncherAriaLabel();
  expect(label).not.toBeNull();
  expect(label.length).toBeGreaterThan(3);
});

Then("the tooltip should have appropriate aria attributes", async function () {
  await this.chatbotPage.tooltip.waitFor({ state: "visible", timeout: 5000 });
  const role = await this.chatbotPage.tooltip.getAttribute("role");
  expect(["tooltip", "status", "region"].includes(role)).toBe(true);
});
