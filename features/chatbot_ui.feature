@ui
Feature: Chatbot UI and Icon

  @smoke @regression
  Scenario: Rex launcher icon is visible and positioned bottom-right
    Given I am on the Paywatch app
    Then the Rex launcher icon should be visible
    And the launcher should be positioned at the bottom-right

  @regression
  Scenario: Tooltip appears on hover
    Given I am on the Paywatch app
    When I hover over the Rex launcher
    Then I should see the "Ask Paywatch" tooltip

  @smoke @regression
  Scenario: Clicking the launcher opens the chatbot modal
    Given I am on the Paywatch app
    When I click the Rex launcher
    Then the chatbot modal should be visible

  @regression
  Scenario: Close button dismisses the modal
    Given I am on the Paywatch app
    And the chatbot is open
    When I click the close button
    Then the chatbot modal should not be visible

  @regression
  Scenario: Modal open/close does not disrupt page state
    Given I am on the Paywatch app
    When I click the Rex launcher
    And I click the close button
    Then the page should still be functional

  @regression
  Scenario: Launcher is keyboard accessible
    Given I am on the Paywatch app
    When I tab to the launcher and press Enter
    Then the chatbot modal should be visible

  @accessibility @regression
  Scenario: Launcher has a descriptive aria-label
    Given I am on the Paywatch app
    Then the launcher aria-label should be present and descriptive

  @responsive @regression
  Scenario Outline: Modal is responsive across viewports
    Given I am on the Paywatch app with viewport "<viewport>"
    When I click the Rex launcher
    Then the chatbot modal should be fully visible

    Examples:
      | viewport |
      | desktop  |
      | tablet   |
      | mobile   |
