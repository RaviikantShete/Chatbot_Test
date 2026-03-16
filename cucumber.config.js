module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    require: [
      "support/world.js",
      "support/hooks.js",
      "features/step_definitions/**/*.js",
    ],
    format: [
      "progress-bar",
      "json:reports/cucumber-report.json",
    ],
    formatOptions: {
      snippetInterface: "async-await",
    },
    retry: 1,
    retryTagFilter: "@flaky",
    tags: process.env.TAGS || "",
  },
};
