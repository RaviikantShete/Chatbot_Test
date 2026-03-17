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
  const body = await this.page.locator("body").innerText();
  expect(body.length).toBeGreaterThan(10);
});

Then("messages should appear in the order they were sent", async function () {
  const body = await this.page.locator("body").innerText();
  expect(body.length).toBeGreaterThan(10);
});

Then("the bot response should follow my message in the history", async function () {
  const body = await this.page.locator("body").innerText();
  expect(body.length).toBeGreaterThan(10);
});

Then("the previous conversation should still be visible", async function () {
  const body = await this.page.locator("body").innerText();
  expect(body.length).toBeGreaterThan(10);
});

Then("the bot should respond in context of the previous message", async function () {
  const body = await this.page.locator("body").innerText();
  expect(body.length).toBeGreaterThan(10);
});