// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// Created: 17 March 2026 | Version: 1.0.0
// Unauthorized use or modification is strictly prohibited.
// ============================================================
const { Given, When, Then } = require("@cucumber/cucumber");
const { expect } = require("@playwright/test");
const testData = require("../../test-data/chat-test-data.json");
const { ChatbotPage } = require("../../pages/ChatbotPage");

Given("I am on the Paywatch app", async function () {
  if (!this.chatbotPage) await this.init();
  await this.chatbotPage.navigate();
});

Given("I am on the Paywatch app with technology {string} and experience {string}", async function (technology, experience) {
  if (!this.chatbotPage) await this.init();
  await this.chatbotPage.navigate(technology, experience);
});

Given("I am on the Paywatch app with viewport {string}", async function (viewport) {
  if (!this.chatbotPage) await this.init();
  const size = testData.viewports[viewport];
  await this.page.setViewportSize(size);
  await this.chatbotPage.navigate();
});

Given("the chatbot is open", async function () {
  if (!this.chatbotPage) await this.init();
  await this.chatbotPage.openChatbot();
});

When("I open the chatbot", async function () {
  await this.chatbotPage.openChatbot();
});

When("I click the Rex launcher", async function () {
  await this.chatbotPage.openChatbot();
});

When("I click the close button", async function () {
  await this.chatbotPage.closeChatbot();
});

When("I close the chatbot", async function () {
  await this.chatbotPage.closeChatbot();
});

When("I reopen the chatbot", async function () {
  await this.chatbotPage.openChatbot();
});

Then("the page should still be functional", async function () {
  await expect(this.page).not.toHaveURL("about:blank");
  const title = await this.page.title();
  expect(title).toBeTruthy();
});
