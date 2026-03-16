@history
Feature: Chatbot Session History

  @regression
  Scenario: Session history tracks multiple interactions
    Given I am on the Paywatch app
    And the chatbot is open
    When I send the message "Hello"
    And I send the message "What is the Java salary?"
    Then the chat history should contain 2 user messages

  @regression
  Scenario: Messages are displayed in chronological order
    Given I am on the Paywatch app
    And the chatbot is open
    When I send the message "First message"
    And I send the message "Second message"
    Then messages should appear in the order they were sent

  @regression
  Scenario: Bot responses correspond to correct user messages
    Given I am on the Paywatch app
    And the chatbot is open
    When I send the message "Java salary"
    Then the bot response should follow my message in the history

  @regression
  Scenario: History persists after modal close and reopen
    Given I am on the Paywatch app
    And the chatbot is open
    When I send the message "Java salary for 4-6 years"
    And I close the chatbot
    And I reopen the chatbot
    Then the previous conversation should still be visible

  @regression
  Scenario: Multi-turn contextual conversation is supported
    Given I am on the Paywatch app
    And the chatbot is open
    When I send the message "Java developer salary"
    And I send the message "What about senior level?"
    Then the bot should respond in context of the previous message
