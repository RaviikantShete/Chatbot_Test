@performance
Feature: Chatbot Performance

  @regression
  Scenario: Modal opens within the SLA threshold
    Given I am on the Paywatch app
    When I open the chatbot and measure the time
    Then the modal should open within 3000 ms

  @regression
  Scenario: Standard query responds within SLA
    Given I am on the Paywatch app
    And the chatbot is open
    When I send the message "Java salary for 4-6 years" and measure the response time
    Then the bot should respond within 15000 ms

  @regression
  Scenario: Data-intensive query responds within extended SLA
    Given I am on the Paywatch app
    And the chatbot is open
    When I send the message "Give me a full breakdown of all technology salaries for 2024" and measure the response time
    Then the bot should respond within 20000 ms

  @regression
  Scenario: Three sequential queries complete within total SLA
    Given I am on the Paywatch app
    And the chatbot is open
    When I send 3 sequential messages and measure total time
    Then the total time should be within 45000 ms
