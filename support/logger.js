// ============================================================
// Owner: Ravikant Shete
// Project: Paywatch Rex Chatbot Test Suite
// LinkedIn: https://www.linkedin.com/in/ravikantshete/
// Created: 17 March 2026 | Version: 1.0.0
// Unauthorized use or modification is strictly prohibited.
// ============================================================
const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs = require("fs");

const logDir = "reports/logs";
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const date = new Date().toISOString().split("T")[0];

const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.printf(({ timestamp, level, message }) =>
    `[${timestamp}] ${level.toUpperCase()}: ${message}`
  )),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logDir, `test-run-${date}.log`) }),
    new transports.File({ filename: path.join(logDir, "errors.log"), level: "error" }),
  ],
});

module.exports = logger;
