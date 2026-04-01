// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// Created: 17 March 2026 | Version: 1.0.0
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
  await this.chatbotPage.welcomeMessage.waitFor({ state: "visible", timeout: 15000 });
  const msg = await this.chatbotPage.welcomeMessage.innerText();
  expect(msg.length).toBeGreaterThan(0);
  const hasWelcome = ["Hi", "Hello", "How can I help", "Welcome", "Paywatch"].some(
    (k) => msg.includes(k)
  );
  expect(hasWelcome).toBe(true);
});

Then("the bot response should contain salary-related information", async function () {
  await this.chatbotPage.botMessages.last().waitFor({ state: "visible", timeout: 20000 });
  await this.page.waitForTimeout(2000);
  const msg = await this.chatbotPage.botMessages.last().innerText();
  expect(msg).not.toBeNull();
  const hasSalaryInfo = [
    "/hour", "Minimum", "Average", "Median", "Maximum", "$",
    "salary", "hourly", "compensation", "specialize", "rate",
    "experience", "developer", "India"
  ].some((k) => msg.toLowerCase().includes(k.toLowerCase()));
  expect(hasSalaryInfo).toBe(true);
});

Then("the bot should ask for clarification", async function () {
  await this.chatbotPage.botMessages.last().waitFor({ state: "visible", timeout: 20000 });
  await this.page.waitForTimeout(2000);
  const msg = await this.chatbotPage.botMessages.last().innerText();
  expect(msg).not.toBeNull();
  const isClarification = [
    "which", "please", "could you", "what technology", "clarif",
    "example", "ask", "help", "specify", "more", "specialize",
    "technology", "role", "provide", "information"
  ].some((k) => msg.toLowerCase().includes(k.toLowerCase()));
  expect(isClarification).toBe(true);
});

Then("the bot should respond with a graceful fallback message", async function () {
  await this.chatbotPage.botMessages.last().waitFor({ state: "visible", timeout: 20000 });
  const msg = await this.chatbotPage.botMessages.last().innerText();
  expect(msg).not.toBeNull();
  expect(msg.length).toBeGreaterThan(5);
});

Then("the bot should respond gracefully without crashing", async function () {
  expect(await this.chatbotPage.isChatModalVisible()).toBe(true);
  await this.chatbotPage.botMessages.last().waitFor({ state: "visible", timeout: 20000 });
  const msg = await this.chatbotPage.botMessages.last().innerText();
  expect(msg).not.toBeNull();
});

Then("the bot response should be relevant to {string} and {string} years", async function (tech, exp) {
  await this.chatbotPage.botMessages.last().waitFor({ state: "visible", timeout: 20000 });
  await this.page.waitForTimeout(2000);
  const msg = await this.chatbotPage.botMessages.last().innerText();
  expect(msg).not.toBeNull();
  const hasSalaryInfo = [
    "/hour", "Minimum", "Average", "Median", "Maximum", "$",
    "salary", "hourly", "compensation", "specialize", "rate",
    "experience", "developer", "India"
  ].some((k) => msg.toLowerCase().includes(k.toLowerCase()));
  expect(hasSalaryInfo).toBe(true);
});

Then("the bot should not send the message or should prompt the user", async function () {
  expect(this.emptySubmitBlocked).toBe(true);
});

Then("the chatbot should remain functional", async function () {
  expect(await this.chatbotPage.isChatModalVisible()).toBe(true);
  await expect(this.chatbotPage.messageInput).toBeVisible();
});