// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// Created: 17 March 2026 | Version: 1.0.0
// Unauthorized use or modification is strictly prohibited.
// ============================================================
const { When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

Then("the chat history should contain {int} user messages", async function (count) {
  const actual = await this.chatbotPage.userMessages.count();
  expect(actual).toBeGreaterThanOrEqual(count);
});

Then("messages should appear in the order they were sent", async function () {
  const count = await this.chatbotPage.userMessages.count();
  expect(count).toBeGreaterThanOrEqual(2);
  const first = await this.chatbotPage.userMessages.nth(0).innerText();
  const second = await this.chatbotPage.userMessages.nth(1).innerText();
  expect(first).toContain("First message");
  expect(second).toContain("Second message");
});

Then("the bot response should follow my message in the history", async function () {
  const userCount = await this.chatbotPage.userMessages.count();
  const botCount = await this.chatbotPage.getBotMessageCount();
  expect(botCount).toBeGreaterThanOrEqual(userCount);
});

Then("the previous conversation should still be visible", async function () {
  const history = await this.chatbotPage.getAllMessages();
  expect(history).toContain("Java salary");
});

Then("the bot should respond in context of the previous message", async function () {
  const msg = await this.chatbotPage.getLastBotMessage();
  expect(msg).not.toBeNull();
  expect(msg.length).toBeGreaterThan(5);
});
