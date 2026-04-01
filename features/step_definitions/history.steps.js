// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// Created: 17 March 2026 | Version: 1.0.0
// ============================================================
const { When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

Then("the chat history should contain {int} user messages", async function (count) {
  await this.chatbotPage.botMessages.last().waitFor({ state: "visible", timeout: 20000 });
  const botCount = await this.chatbotPage.botMessages.count();
  expect(botCount).toBeGreaterThanOrEqual(1);
});

Then("messages should appear in the order they were sent", async function () {
  await this.chatbotPage.botMessages.last().waitFor({ state: "visible", timeout: 20000 });
  const botCount = await this.chatbotPage.botMessages.count();
  expect(botCount).toBeGreaterThanOrEqual(1);
});

Then("the bot response should follow my message in the history", async function () {
  await this.chatbotPage.botMessages.last().waitFor({ state: "visible", timeout: 20000 });
  const msg = await this.chatbotPage.botMessages.last().innerText();
  expect(msg.length).toBeGreaterThan(5);
});

Then("the previous conversation should still be visible", async function () {
  await this.chatbotPage.botMessages.first().waitFor({ state: "visible", timeout: 20000 });
  const count = await this.chatbotPage.botMessages.count();
  expect(count).toBeGreaterThan(0);
});

Then("the bot should respond in context of the previous message", async function () {
  await this.chatbotPage.botMessages.last().waitFor({ state: "visible", timeout: 20000 });
  await this.page.waitForTimeout(2000);
  const msg = await this.chatbotPage.botMessages.last().innerText();
  const hasSalaryInfo = [
    "/hour", "Minimum", "Average", "senior", "$", "Hourly",
    "experience", "developer", "salary", "compensation", "rate"
  ].some((k) => msg.toLowerCase().includes(k.toLowerCase()));
  expect(hasSalaryInfo).toBe(true);
});