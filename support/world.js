// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// Created: 17 March 2026 | Version: 1.0.0
// Unauthorized use or modification is strictly prohibited.
// ============================================================

require("dotenv").config();
const { setWorldConstructor, World, setDefaultTimeout } = require("@cucumber/cucumber");
const { chromium, firefox, webkit } = require("playwright");
const { ChatbotPage } = require("../pages/ChatbotPage");
const { _load, _validate, CONTACT } = require("./config");

setDefaultTimeout(60 * 1000);

_load();
_validate();

class CustomWorld extends World {
  constructor(options) {
    super(options);
    this.browser = null;
    this.context = null;
    this.page = null;
    this.chatbotPage = null;
    this.timings = {};
  }

  async init() {
    const browserType = process.env.BROWSER || "chromium";
    const headless = process.env.HEADED !== "true";
    const launchers = { chromium, firefox, webkit };
    this.browser = await (launchers[browserType] || chromium).launch({ headless });
    this.context = await this.browser.newContext({ viewport: { width: 1280, height: 720 } });
    this.page = await this.context.newPage();
    this.page.setDefaultTimeout(30000);
    this.chatbotPage = new ChatbotPage(this.page);
  }

  async teardown(scenarioName, passed) {
    try {
      if (!passed) {
        const fs = require("fs");
        if (!fs.existsSync("reports/screenshots")) {
          fs.mkdirSync("reports/screenshots", { recursive: true });
        }
        const safe = scenarioName.replace(/[^a-z0-9]/gi, "_");
        await this.page.screenshot({
          path: `reports/screenshots/FAILED_${safe}_${Date.now()}.png`,
          fullPage: true,
        });
      }
    } catch (e) {}
    await this.context.close();
    await this.browser.close();
  }
}

setWorldConstructor(CustomWorld);
