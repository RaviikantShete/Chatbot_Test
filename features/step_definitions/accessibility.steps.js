// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// Created: 17 March 2026 | Version: 1.0.0
// Unauthorized use or modification is strictly prohibited.
// ============================================================
const { Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const { checkA11y, injectAxe } = require("axe-playwright");

Then("the modal should have role {string} or {string}", async function (role1, role2) {
  const role = await this.chatbotPage.getModalRole();
  expect([role1, role2].includes(role)).toBe(true);
});

Then("the message input should have an accessible label or placeholder", async function () {
  const label = await this.chatbotPage.messageInput.getAttribute("aria-label");
  const placeholder = await this.chatbotPage.messageInput.getAttribute("placeholder");
  expect(label || placeholder).toBeTruthy();
});

Then("the bot response should be accessible in the DOM", async function () {
  const msg = await this.chatbotPage.getLastBotMessage();
  expect(msg).not.toBeNull();
  expect(msg.length).toBeGreaterThan(0);
});

Then("there should be no critical axe accessibility violations", async function () {
  await injectAxe(this.page);
  await checkA11y(
    this.page,
    await this.chatbotPage.chatModal.elementHandle(),
    {
      axeOptions: { runOnly: ["wcag2a", "wcag2aa"] },
      detailedReport: true,
      detailedReportOptions: { html: true },
      violationCallback: (violations) => {
        const critical = violations.filter((v) => v.impact === "critical");
        expect(critical.length).toBe(0);
      },
    }
  );
});

Then("the close button should have an accessible name", async function () {
  const name = await this.chatbotPage.closeButton.getAttribute("aria-label");
  const text = await this.chatbotPage.closeButton.innerText();
  expect(name || text).toBeTruthy();
});

Then("the close button should be reachable via keyboard", async function () {
  await this.chatbotPage.closeButton.focus();
  const focused = await this.chatbotPage.closeButton.evaluate(
    (el) => document.activeElement === el
  );
  expect(focused).toBe(true);
});
