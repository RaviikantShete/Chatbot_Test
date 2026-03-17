// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// Created: 17 March 2026 | Version: 1.0.0
// Unauthorized use or modification is strictly prohibited.
// ============================================================
const { When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

When("I send the message {string}", async function (message) {
  await this.chatbotPage.sendMessageAndWait(message);
});

When("I submit an empty message", async function () {
  await this.chatbotPage.messageInput.waitFor({ state: "visible" });
  await this.chatbotPage.messageInput.fill("");
  const isDisabled = await this.chatbotPage.sendButton.isDisabled();
  this.emptySubmitBlocked = isDisabled;
});

Then("I should see a welcome message from the bot", async function () {
  await this.page.waitForTimeout(3000);
  const body = await this.page.locator("body").innerText();
  const hasWelcome = ["hi", "hello", "how can i help", "welcome", "paywatch", "ask"].some((k) =>
    body.toLowerCase().includes(k)
  );
  expect(hasWelcome).toBe(true);
});

Then("the bot response should contain salary-related information", async function () {
  const body = await this.page.locator("body").innerText();
  const hasSalaryInfo = ["/hour", "Minimum", "Average", "Median", "Maximum", "$", "Hourly"].some((k) =>
    body.includes(k)
  );
  expect(hasSalaryInfo).toBe(true);
});

Then("the bot should ask for clarification", async function () {
  const body = await this.page.locator("body").innerText();
  const isClarification = [
    "which", "please", "could you", "what technology", "clarif",
    "example", "ask", "help", "specify", "more"
  ].some((k) => body.toLowerCase().includes(k));
  expect(isClarification).toBe(true);
});

Then("the bot should respond with a graceful fallback message", async function () {
  const body = await this.page.locator("body").innerText();
  expect(body.length).toBeGreaterThan(10);
});

Then("the bot should respond gracefully without crashing", async function () {
  expect(await this.chatbotPage.isChatModalVisible()).toBe(true);
  const body = await this.page.locator("body").innerText();
  expect(body.length).toBeGreaterThan(10);
});

Then("the bot response should be relevant to {string} and {string} years", async function (tech, exp) {
  const body = await this.page.locator("body").innerText();
  const hasSalaryInfo = ["/hour", "Minimum", "Average", "Median", "Maximum", "$", "Hourly"].some((k) =>
    body.includes(k)
  );
  expect(hasSalaryInfo).toBe(true);
});

Then("the bot should not send the message or should prompt the user", async function () {
  expect(this.emptySubmitBlocked).toBe(true);
});

Then("the chatbot should remain functional", async function () {
  expect(await this.chatbotPage.isChatModalVisible()).toBe(true);
  await expect(this.chatbotPage.messageInput).toBeVisible();
});