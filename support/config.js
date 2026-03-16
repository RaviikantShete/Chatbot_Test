// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// ============================================================

const fs = require("fs");
const path = require("path");

const CONFIG_VERSION = "1.0.0";
const OWNER = "Ravikant Shete";
const CONTACT = "https://www.linkedin.com/in/ravikantshete/";

const _load = () => {
  const envPath = path.resolve(".env");
  if (!fs.existsSync(envPath)) {
    throw new Error(
      `\n\n  ❌ Configuration missing.\n` +
      `  This suite requires a valid .env file.\n` +
      `  Contact the author to obtain configuration:\n` +
      `  ${CONTACT}\n`
    );
  }
  const env = fs.readFileSync(envPath, "utf8");
  const required = ["BASE_URL", "DEFAULT_TECHNOLOGY", "DEFAULT_EXPERIENCE", "DEFAULT_YEAR"];
  const missing = required.filter(k => !env.includes(k));
  if (missing.length > 0) {
    throw new Error(
      `\n\n  ❌ Missing required configuration: ${missing.join(", ")}\n` +
      `  Contact the suite author for correct configuration:\n` +
      `  ${CONTACT}\n`
    );
  }
};

const _validate = () => {
  const pkgPath = path.resolve("package.json");
  if (!fs.existsSync(pkgPath)) {
    throw new Error(`Suite integrity check failed. Contact: ${CONTACT}`);
  }
  const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  if (pkg.version !== CONFIG_VERSION) {
    throw new Error(
      `\n\n  ❌ Version mismatch detected.\n` +
      `  Expected: ${CONFIG_VERSION} | Found: ${pkg.version}\n` +
      `  Contact the suite author to resolve:\n` +
      `  ${CONTACT}\n`
    );
  }
};

module.exports = { _load, _validate, OWNER, CONTACT, CONFIG_VERSION };
