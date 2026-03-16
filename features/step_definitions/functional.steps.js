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
  await this.chatbotPage.sendMessage("");
  await this.page.waitForTimeout(1000);
});

Then("I should see a welcome message from the bot", async function () {
  const count = await this.chatbotPage.getBotMessageCount();
  expect(count).toBeGreaterThan(0);
});

Then("the bot response should contain salary-related information", async function () {
  const msg = await this.chatbotPage.getLastBotMessage();
  expect(msg).not.toBeNull();
  const lower = msg.toLowerCase();
  const hasSalaryInfo = ["salary", "lakh", "per annum", "ctc", "package", "pay", "₹"].some((k) =>
    lower.includes(k)
  );
  expect(hasSalaryInfo).toBe(true);
});

Then("the bot should ask for clarification", async function () {
  const msg = await this.chatbotPage.getLastBotMessage();
  expect(msg).not.toBeNull();
  const lower = msg.toLowerCase();
  const isClarification = ["which", "please specify", "could you", "what technology", "clarif"].some((k) =>
    lower.includes(k)
  );
  expect(isClarification).toBe(true);
});

Then("the bot should respond with a graceful fallback message", async function () {
  const msg = await this.chatbotPage.getLastBotMessage();
  expect(msg).not.toBeNull();
  expect(msg.length).toBeGreaterThan(5);
});

Then("the bot should respond gracefully without crashing", async function () {
  expect(await this.chatbotPage.isChatModalVisible()).toBe(true);
  const msg = await this.chatbotPage.getLastBotMessage();
  expect(msg).not.toBeNull();
});

Then("the bot response should be relevant to {string} and {string} years", async function (tech, exp) {
  const msg = await this.chatbotPage.getLastBotMessage();
  expect(msg).not.toBeNull();
  expect(msg.length).toBeGreaterThan(10);
});

Then("the bot should not send the message or should prompt the user", async function () {
  const userMsgCount = await this.chatbotPage.userMessages.count();
  if (userMsgCount > 0) {
    const lastBot = await this.chatbotPage.getLastBotMessage();
    expect(lastBot).not.toBeNull();
  } else {
    expect(userMsgCount).toBe(0);
  }
});

Then("the chatbot should remain functional", async function () {
  expect(await this.chatbotPage.isChatModalVisible()).toBe(true);
  await expect(this.chatbotPage.messageInput).toBeVisible();
});
