@accessibility
Feature: Chatbot Accessibility

  @regression
  Scenario: Launcher has a valid aria-label
    Given I am on the Paywatch app
    Then the launcher aria-label should be present and descriptive

  @regression
  Scenario: Chatbot modal has correct ARIA role
    Given I am on the Paywatch app
    And the chatbot is open
    Then the modal should have role "dialog" or "region"

  @regression
  Scenario: Message input has an accessible label
    Given I am on the Paywatch app
    And the chatbot is open
    Then the message input should have an accessible label or placeholder

  @regression
  Scenario: Bot responses are visible in the accessibility tree
    Given I am on the Paywatch app
    And the chatbot is open
    When I send the message "Java salary"
    Then the bot response should be accessible in the DOM

  @regression
  Scenario: No critical accessibility violations in the chatbot container
    Given I am on the Paywatch app
    And the chatbot is open
    Then there should be no critical axe accessibility violations

  @regression
  Scenario: Close button is accessible and keyboard reachable
    Given I am on the Paywatch app
    And the chatbot is open
    Then the close button should have an accessible name
    And the close button should be reachable via keyboard

  @regression
  Scenario: Tooltip area has appropriate aria attributes
    Given I am on the Paywatch app
    When I hover over the Rex launcher
    Then the tooltip should have appropriate aria attributes
