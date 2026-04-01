// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// Created: 17 March 2026 | Version: 1.0.0
// ============================================================
const fs = require("fs");
const path = require("path");

const OWNER = "Ravikant Shete";
const CONTACT = "https://www.linkedin.com/in/ravikantshete/";

const _load = () => {
  const envPath = path.resolve(".env");
  if (!fs.existsSync(envPath)) {
    throw new Error(
      `\n\n  Configuration missing.\n` +
      `  This suite requires a valid .env file.\n` +
      `  Contact: ${CONTACT}\n`
    );
  }
  const required = ["BASE_URL", "DEFAULT_TECHNOLOGY", "DEFAULT_EXPERIENCE", "DEFAULT_YEAR"];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(
      `\n\n  Missing required environment variables: ${missing.join(", ")}\n` +
      `  Contact: ${CONTACT}\n`
    );
  }
};

const _validate = () => {
  const timeout = parseInt(process.env.TIMEOUT);
  if (process.env.TIMEOUT && isNaN(timeout)) {
    throw new Error(`TIMEOUT must be a valid number. Found: ${process.env.TIMEOUT}`);
  }
  const url = process.env.BASE_URL;
  if (url && !url.startsWith("http")) {
    throw new Error(`BASE_URL must start with http or https. Found: ${url}`);
  }
};

module.exports = { _load, _validate, OWNER, CONTACT };