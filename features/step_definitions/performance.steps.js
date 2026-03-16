// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// Created: 17 March 2026 | Version: 1.0.0
// Unauthorized use or modification is strictly prohibited.
// ============================================================
const { When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");

When("I open the chatbot and measure the time", async function () {
  this.timings.modalOpen = await this.chatbotPage.openChatbot();
});

When("I send the message {string} and measure the response time", async function (message) {
  this.timings.lastResponse = await this.chatbotPage.sendMessageAndWait(message);
});

When("I send {int} sequential messages and measure total time", async function (count) {
  const messages = [
    "Java salary for 4-6 years",
    "What about Python developers?",
    "And React developers?",
  ];
  const start = Date.now();
  for (let i = 0; i < count; i++) {
    await this.chatbotPage.sendMessageAndWait(messages[i]);
  }
  this.timings.sequential = Date.now() - start;
});

Then("the modal should open within {int} ms", async function (threshold) {
  expect(this.timings.modalOpen).toBeLessThanOrEqual(threshold);
});

Then("the bot should respond within {int} ms", async function (threshold) {
  expect(this.timings.lastResponse).toBeLessThanOrEqual(threshold);
});

Then("the total time should be within {int} ms", async function (threshold) {
  expect(this.timings.sequential).toBeLessThanOrEqual(threshold);
});
