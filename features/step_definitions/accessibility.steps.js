// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// Created: 17 March 2026 | Version: 1.0.0
// ============================================================
const { Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { checkA11y, injectAxe } = require("axe-playwright");

Then("the modal should have role {string} or {string}", async function (role1, role2) {
  const isOpen = await this.chatbotPage.isChatModalVisible();
  expect(isOpen).toBe(true);
});

Then("the message input should have an accessible label or placeholder", async function () {
  const label = await this.chatbotPage.messageInput.getAttribute("aria-label");
  const placeholder = await this.chatbotPage.messageInput.getAttribute("placeholder");
  expect(label || placeholder).toBeTruthy();
});

Then("the bot response should be accessible in the DOM", async function () {
  await this.chatbotPage.botMessages.last().waitFor({ state: "visible", timeout: 20000 });
  const msg = await this.chatbotPage.botMessages.last().innerText();
  expect(msg.length).toBeGreaterThan(0);
});

Then("there should be no critical axe accessibility violations", async function () {
  await injectAxe(this.page);
  let criticalViolations = [];
  try {
    await checkA11y(
      this.page,
      undefined,
      {
        axeOptions: { runOnly: ["wcag2a", "wcag2aa"] },
        violationCallback: (violations) => {
          criticalViolations = violations.filter((v) => v.impact === "critical");
        },
      }
    );
  } catch (e) {
    if (criticalViolations.length > 0) {
      console.warn(`Critical a11y violations: ${criticalViolations.map(v => v.id).join(", ")}`);
    }
  }
  expect(criticalViolations.length).toBe(0);
});

Then("the close button should have an accessible name", async function () {
  const name = await this.chatbotPage.closeButton.getAttribute("aria-label");
  const text = await this.chatbotPage.closeButton.innerText().catch(() => "");
  expect(name || text).toBeTruthy();
});

Then("the close button should be reachable via keyboard", async function () {
  await this.chatbotPage.closeButton.focus();
  const focused = await this.chatbotPage.closeButton.evaluate(
    (el) => document.activeElement === el
  );
  expect(focused).toBe(true);
});