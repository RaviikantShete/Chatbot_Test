// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// Created: 17 March 2026 | Version: 1.0.0
// ============================================================
require("dotenv").config();

class ChatbotPage {
  constructor(page) {
    this.page = page;
    this.launcherIcon    = page.locator('[aria-label="Open chat"]');
    this.closeButton     = page.locator('[aria-label="Close chat"]');
    this.messageInput    = page.locator('textarea[placeholder="Type your message here..."]');
    this.sendButton      = page.locator('[aria-label="Send message"]');
    this.botMessages     = page.locator('div.jsx-4443d8c1010b725b.mb-3.flex.justify-start');
    this.userMessages    = page.locator('div.jsx-4443d8c1010b725b.mb-3.flex.justify-end');
    this.welcomeMessage  = page.locator('div.jsx-4443d8c1010b725b.mb-3.flex.justify-start').first();
    this.loadingIndicator= page.locator('[class*="loading"],[class*="typing"]').first();
    this.tooltip         = page.locator('[role="tooltip"]').first();
  }

  async navigate(technology, experience, year) {
    const tech = technology || process.env.DEFAULT_TECHNOLOGY || "javaj2ee";
    const exp  = experience  || process.env.DEFAULT_EXPERIENCE || "4-6";
    const yr   = year        || process.env.DEFAULT_YEAR       || "2024";
    const base = process.env.BASE_URL;
    await this.page.goto(`${base}?technology=${tech}&experience=${exp}&year=${yr}`);
    await this.page.waitForLoadState("networkidle");
  }

  async openChatbot() {
    const start = Date.now();
    await this.launcherIcon.waitFor({ state: "visible", timeout: 30000 });
    await this.launcherIcon.click();
    await this.messageInput.waitFor({ state: "visible", timeout: 15000 });
    return Date.now() - start;
  }

  async closeChatbot() {
    await this.closeButton.waitFor({ state: "visible", timeout: 10000 });
    await this.closeButton.click();
    await this.launcherIcon.waitFor({ state: "visible", timeout: 10000 });
  }

  async sendMessage(message) {
    await this.messageInput.waitFor({ state: "visible", timeout: 10000 });
    await this.messageInput.click();
    await this.messageInput.fill(message);
    const countBefore = await this.botMessages.count();
    await this.sendButton.click();
    return countBefore;
  }

  async waitForBotResponse(countBefore) {
    await this.page.waitForFunction(
      (before) => {
        const msgs = document.querySelectorAll(
          'div.jsx-4443d8c1010b725b.mb-3.flex.justify-start'
        );
        return msgs.length > before;
      },
      countBefore,
      { timeout: 25000 }
    );
    await this.page.waitForTimeout(2000);
  }

  async sendMessageAndWait(message) {
    const start = Date.now();
    const countBefore = await this.sendMessage(message);
    await this.waitForBotResponse(countBefore);
    return Date.now() - start;
  }

  async getLastBotMessage() {
    const count = await this.botMessages.count();
    if (count === 0) return null;
    return this.botMessages.nth(count - 1).innerText();
  }

  async getLastUserMessage() {
    const count = await this.userMessages.count();
    if (count === 0) return null;
    return this.userMessages.nth(count - 1).innerText();
  }

  async getAllMessages()       { return this.page.locator("body").innerText(); }
  async getBotMessageCount()  { return this.botMessages.count(); }
  async isLauncherVisible()   { return this.launcherIcon.isVisible(); }
  async isChatModalVisible()  { return this.messageInput.isVisible(); }
  async hoverLauncher()       { await this.launcherIcon.hover(); }
  async getLauncherAriaLabel(){ return this.launcherIcon.getAttribute("aria-label"); }
  async getModalRole()         { return this.closeButton.getAttribute("role"); }
  async tabToLauncher()        { await this.page.keyboard.press("Tab"); }
  async pressEnterOnLauncher() { await this.launcherIcon.press("Enter"); }
}

module.exports = { ChatbotPage };