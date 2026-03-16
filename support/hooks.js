// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// Created: 17 March 2026 | Version: 1.0.0
// Unauthorized use or modification is strictly prohibited.
// ============================================================
const { Before, After, BeforeAll } = require("@cucumber/cucumber");
const fs = require("fs");

BeforeAll(async function () {
  ["reports", "reports/screenshots", "reports/logs"].forEach((d) => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
  });
});

Before(async function () {
  await this.init();
});

After(async function (scenario) {
  const passed = scenario.result.status === "PASSED";
  await this.teardown(scenario.pickle.name, passed);
});
